/**
 * BusinessInformation
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  saveKey,
  setBusiness,
  getIndustries,
} from "../../actions/postActions";
import {setUserRole} from "../../actions/userManagementActions";
import { useTransition, animated } from "react-spring";
import styled from "styled-components";
import "./css/setup.scss";
import { isEmpty } from "lodash";
import Upload from "assets/images/svg/upload.svg";
import LongArrow from "assets/images/svg/long-arrow.svg";
import Loader from "components/loader";
import {alertExceptionError} from "../../modules/alert";
import {fetchBusinessDetails} from "../../services/authService";
import {useTranslation} from "react-i18next";
const Wrapper = styled.div`
  padding-left: 3em;
  color: #565555;
`;
const NavMenuItem = styled.div`
  padding: 2em 4.5em 3.5em 0;
  font-size: 1.1em;
  color: #c2c2c2 !important;
  &:hover {
    color #c4c4c4 !important;
  }
`;
const Centered = styled.div`
  display: flex;
  justify-content: center;
`;

const WrapSection = styled.div`
  // width: 700px;
  display: flex;
  margin-right: 3em
`;

const Wrap = styled.div`
width: 100%;
  .list {
    transition: all 0.3s ease-in-out;
    margin-bottom: 1.5em;
    background: #fff;
    border-radius: 5px;
    width: 700px;
    border: 1px solid #dfe0eb;
    @media(max-width: 720px) {
      width: 100%
    }
  }
  span {
    color: #565555;
    vertical-align: middle;
  }
  :hover .list {
    box-shadow: 1px 1px 40px -7px rgba(219, 219, 219, 1);
  }
  :hover img {
    zoom: 1.3 !important;
    opacity: 0.8;
  }
`;

const WrapBox = styled.div`
width: 100%;
  .list {
    transition: all 0.3s ease-in-out;
    margin-bottom: 1.5em;
    background: #fff;
    border-radius: 5px;
    width: 700px;
    @media(max-width: 720px) {
      width: 100%
    }
  }
  span {
    color: #565555;
    vertical-align: middle;
  }
`;

const Welcome = styled.div`
  color: #0c0c0c;
  text-align: center;
  font-weight: 250;
  font-size: 21px;
  font-style: normal;
  margin-bottom: 2em;
  width: 90%
`;

const ImageWrapper = styled.div`
  width: 50px;
  height: 50px;
  img {
    width: 100%;
    height: auto;
  }
`;

export function BusinessList({ user_details, setBusiness, setUserRole, business_details }) {
    const { businessList, full_name } = user_details;
    const [business_list, setBusinessList] = useState([]);
    const [fetchingBusinessDetails, setFetchingBusinessDetails] = useState(false);
    const [singleBusiness, setSingleBusiness] = useState(null);
    const [message, setMessage] = useState(null);
    const [mounted, setMounted] = useState(false);
    const { t } = useTranslation();


    useEffect(() => {
        createCategorizedData(businessList);
    }, []);

  const createCategorizedData = (data = []) => {
    if (!isEmpty(data)) {
      const categorizedBusiness = data.map((list, id) => {
        return {
          ...list,
          list_id: id,
        };
      });
      if(Array.isArray(categorizedBusiness)){
        if(categorizedBusiness.length == 1){
          setSingleBusiness('single')
          getBusinessDetails(categorizedBusiness[0].business.number)
        }else{
          setSingleBusiness('multiple')
          setBusinessList(categorizedBusiness);
        }
    }
  };
}

    const getBusinessDetails = (id)=>{
        setFetchingBusinessDetails(true);
        // setSingleBusiness(null);
        setMessage(`${t("Hi")} ${full_name}, ${t("we are configuring your dashboard")}.`)
        fetchBusinessDetails(id)
            .then(res => {
                saveKey(res.payload[0].business.number)
                if (res.responseCode === '00') {
                    setBusiness(res.payload[0])
                    setUserRole(res.payload[0].role)
                } else {
                    setFetchingBusinessDetails(false)
                    alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
                    setMessage(`${t("Hi")} ${full_name}, ${t("Select a business")}.`)
                }
            }).catch(e => {
            alertExceptionError(e)
            setFetchingBusinessDetails(false)
            setMessage(`${t("Hi")} ${full_name}, ${t("Select a business")}.`)
        })
    }

  const transition = useTransition(
    business_list,
    (business_list) => business_list.list_id,
    {
      from: { opacity: 0, marginTop: -25, marginBottom: 25 },
      enter: { opacity: 1, marginTop: 0, marginBottom: 0 },
      leave: { opacity: 0, marginTop: -25, marginBottom: 25 },
    }
  );

    useEffect( ()=>{
        // if(full_name){
        //     setMessage(`Hi ${full_name}, Select a business.`)
        // }
    }, [])

    return (
        <Wrapper className="sbt-setup">
            <NavMenuItem>
                {!fetchingBusinessDetails && <div className="pb-3 font-20 black font-medium">{t("Businesses")}</div>}
            </NavMenuItem>
            <Centered className="py-4">
                <div>
                    <Welcome className="font-thin text-center mr-3">
                        {" "}
                        {
                           singleBusiness === 'multiple'
                            && message ? message : business_details && !business_details.number && `${t("Hi")} ${full_name}, ${t("Select a business")}.`
                        }
                    </Welcome>
                    {fetchingBusinessDetails ?
                        <WrapSection>
                            <WrapBox className="">
                                <div className="list py-3 ">
                                    <Loader type='login' color={true}/>
                                </div>
                            </WrapBox>
                        </WrapSection>
                        : transition.map(({ item, key, props }) => (
                            <animated.div key={key} style={props}>
                                <WrapSection>
                                    <Wrap className="">
                                        <div className="list py-3 ">
                                            <div
                                                className="row font-15 m-0 px-3 cursor-pointer "
                                                style={{ lineHeight: "1.3" }}
                                                onClick={() => {
                                                    // setBusiness(key);
                                                    // saveKey(item.business.number);
                                                    getBusinessDetails(item.business.number);
                                                }}
                                            >
                                                <ImageWrapper className="mr-3">
                                                    <img
                                                        src={(item.business && item.business.logo) || Upload}
                                                        style={{ zoom: "1.2" }}
                                                    />{" "}
                                                </ImageWrapper>
                                                <div className="text col mt-3">
                                                    <div className="font-medium font-18 ">
                                                        {item.business.business_name}
                                                    </div>
                                                </div>
                                                <div className="col mt-3">
                                                    <img
                                                        className="float-right py-2 "
                                                        src={LongArrow}
                                                        style={{ zoom: "1.2" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Wrap>
                                </WrapSection>
                            </animated.div>
                        ))}
                </div>
            </Centered>
        </Wrapper>
    );
}

BusinessList.propTypes = {
  saveKey: PropTypes.func.isRequired,
    setBusiness: PropTypes.func.isRequired,
    setUserRole: PropTypes.func.isRequired,
    business_details: PropTypes.any,
};
const mapStateToProps = (state) => ({
  user_details: state.data.user_details,
  business_key: state.data.business_key,
  location: state.data.location,
});

export default connect(mapStateToProps, {
  saveKey,
  setBusiness,
  getIndustries,
  setUserRole
})(BusinessList);
