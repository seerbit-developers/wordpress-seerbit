import { loadState } from "../utils/localStorage";
import { BASE_URL,PARTNER_ID } from "../actions/types";
import axios from "axios";
import * as Sentry from "@sentry/react";
// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

const postRequest = async (url, payload) => {
  const state = loadState() && loadState().user.data;

  const options = {
    method: "POST",
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
    data: payload,
  };

  return axios(url, options).then((response) => response.data);
};

const postRequestWithToken = async (url, payload, token) => {
  const state = loadState() && loadState().user.data;

  const options = {
    method: "POST",
    headers: state
      ? {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
          "SB-PARTNER-ID": PARTNER_ID,
        }
      : {
          "content-type": "application/json",
          "SB-PARTNER-ID": PARTNER_ID,
        },
    data: payload,
  };

  return axios(url, options).then((response) => response.data);
};

const putRequestWithToken = async (url, payload, token) => {
  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      "SB-PARTNER-ID": PARTNER_ID,
    },
    data: payload,
  };

  return axios(url, options).then((response) => response.data);
};

const getRequestWithToken = async (url, token) => {
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
      "SB-PARTNER-ID": PARTNER_ID,
    },
  };

  return axios(url, options).then((response) => response.data);
};

const postRequestNoAuth = async (url, payload) => {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "SB-PARTNER-ID": PARTNER_ID,
    },
    data: payload,
  };

  return axios(url, options).then((response) => response.data);
};

const getRequestOpen = async (url, payload) => {
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "SB-PARTNER-ID": PARTNER_ID,
    },
    data: payload,
  };

  return axios(url, options).then((response) => response.data);
};

const putRequestNoAuth = async (url, payload) => {
  const options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "SB-PARTNER-ID": PARTNER_ID,
    },
    data: payload,
  };

  return axios(url, options).then((response) => response.data);
};

const putRequest = async (url, payload, onUploadProgress) => {
  const state = loadState() && loadState().user.data;

  const options = {
    method: "PUT",
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
    data: payload,
    onUploadProgress: onUploadProgress,
  };

  return axios(url, options).then((response) => response.data);
};

const getRequest = async (url) => {
  const state = loadState() && loadState().user.data;

  const options = {
    method: "GET",
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
  };

  return axios(url, options).then((response) => response.data);
};

const getRequestNoAuth = async (url) => {
  const state = loadState() && loadState().user.data;

  const options = {
    method: "GET",
    baseURL: BASE_URL,
    headers: state
      ? {
          "content-type": "application/json",
          "SB-PARTNER-ID": PARTNER_ID,
        }
      : {
          "content-type": "application/json",
          "SB-PARTNER-ID": PARTNER_ID,
        },
  };

  return axios(url, options).then((response) => response.data);
};

const get = async (url) => {
  const state = loadState() && loadState().user.data;

  const options = {
    baseURL: BASE_URL,
    method: "GET",
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
  };

  const instance = axios.create(options);

  return instance(url, options).then((response) => response.data);
};

const deleteRequest = async (url) => {
  const state = loadState() && loadState().user.data;

  const options = {
    baseURL: BASE_URL,
    method: "DELETE",
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
  };

  const instance = axios.create(options);

  return instance(url, options).then((response) => response.data);
};

const post = async (url, payload) => {
  const state = loadState() && loadState().user.data;

  const options = {
    baseURL: BASE_URL,
    method: "POST",
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
    data: payload,
  };

  const instance = axios.create(options);

  return instance(url, options).then((response) => response.data);
};

export {
  postRequest,
  getRequest,
  get,
  putRequest,
  getRequestNoAuth,
  postRequestNoAuth,
  putRequestNoAuth,
  getRequestOpen,
  post,
  deleteRequest,
  postRequestWithToken,
  putRequestWithToken,
  getRequestWithToken,
};
