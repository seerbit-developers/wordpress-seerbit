/** @format */

import { BASE_URL, ERROR_DATA, LOGIN, UPDATE, QUERY } from "./types";
import { loadState } from "../utils/localStorage";
import axios from "axios";

export const PARTNER_ID = process.env.PARTNER_ID

export const auth = (postData, dispatch, fn) => {
  return axios(`${BASE_URL}${postData.URL}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "SB-PARTNER-ID": PARTNER_ID,
    },
    data: postData.data,
  })
    .then((res) => res.data)
    .then((user_details) => {
      if (user_details.responseCode !== "00") {
        user_details.error_source = postData.location;
        dispatch({
          type: ERROR_DATA,
          payload: user_details,
        });
      } else {
        dispatch({
          type: LOGIN,
          payload: {
            user_details: user_details.payload,
            location: postData.location,
            business_details:
             Array.isArray(user_details.payload.businessList) ? user_details.payload.businessList.length === 1
                ? user_details.payload.businessList[0].business
                : {} : {},
            user_permissions:
                Array.isArray(user_details.payload.businessList) ? user_details.payload.businessList.length === 1
                ? user_details.payload.businessList[0].role.permissions
                : [] : [],
          },
        });
      }
    })
    .catch((err) => {
      dispatch({
        type: ERROR_DATA,
        payload: {
          error_source: postData.location,
          ...(err.response ? err.response.data : err.response),
        },
      });
    });
};

export const executeActions = (props, dispatch, fn) => {
  const state = loadState() && loadState().user.data;
  let url = `${BASE_URL}${props.URL}`;

  const options = {
    method: props.type,
    headers: state
      ? {
        "content-type": "application/json",
        Authorization: `Bearer ${state.user_details.token}`,
        integrationid: state.business_details.number,
        integrationmode: "BUSINESS",
       "SB-PARTNER-ID": PARTNER_ID,
      }
      : {
        "content-type": "application/json",
        "SB-PARTNER-ID": PARTNER_ID,
      },
    data: props.data,
    onUploadProgress: props.onUploadProgress,
  };

  axios(url, options)
    .then((response) => response.data)
    .then((res) => {
      if (res.responseCode === "00" || res.code === "00") {
        fn && fn();
        !props.parent_value
          ? dispatch({
            type: UPDATE,
            name: props.name,
            payload: {
              data: props.additionalData
                ? {
                  ...props.additionalData,
                  ...((res && res.payload) || res),
                }
                : (res && res.payload) || res,
              location: props.location,
            },
          })
          : dispatch({
            type: UPDATE,
            payload: { data: { ...res } },
            name: props.name,
            location: props.location,
          });
      } else {
        res.error_source = props.location;
        dispatch({
          type: ERROR_DATA,
          payload: res.payload || res,
        });
      }
    })
    .catch((err) => {
      err.error_source = props.location;
      dispatch({
        type: ERROR_DATA,
        payload: {
          error_source: props.location,
          ...(err.response ? err.response.data : err.response),
        },
      });
    });
};

export const query = (props, dispatch, fn, fail) => {
  const state = loadState().user.data;
  const { URL, type } = props;
  let url = `${BASE_URL}${URL}`;
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${state.user_details.token}`,
      integrationid: state.business_details.number,
      integrationmode: "BUSINESS",
      "SB-PARTNER-ID": PARTNER_ID,
    },
  };

  return axios(url, options)
    .then((response) => response.data)
    .then((res) => {
      if (res.responseCode === "00" || res.code === "00") {
        dispatch({
          type: QUERY,
          payload:
            props.index !== undefined
              ? filterById(res.payload, "" + props.index)
              : res,
          spread: props.spread,
          parent_value: props.parent_value,
          name: props.name,
        });
      } else {
        dispatch({
          type: QUERY,
          name: props.name,
          payload: res,
        });
      }
      return res
    })
    .catch((err) => {
      fail && fail();
      dispatch({
        type: ERROR_DATA,
        name: props.name,
        payload: err.response ? err.response.data : err.response,
      });
      return err
    });
};

const filterById = (data, id) => {
  return data.find((x, index) => id === x.number);
};
