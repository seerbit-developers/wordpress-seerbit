/**
 * Pin Code
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { verifyEmail, setErrorLog, clearState } from "../../actions/postActions";
import { useParams } from "react-router-dom";
import "./css/index.scss";
import styled from "styled-components";
import {verifyAccount} from "../../services/authService";
import {alertError, alertExceptionError} from "../../modules/alert";
import {appBusy} from "../../actions/appActions";
import BlockUI from "../../components/blockUi";
import {Button} from "react-bootstrap";
import BrandsThatTrustUs from "../../components/brandsTrust";
import {hostChecker} from "../../utils";

const Container = styled.div`
  margin: 80px 60px;
`;


export function Activate(props) {
  const { token } = useParams();
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');


  useEffect(() => {
    if (token) {
      props.appBusy(true,'We are Verifying your account.');
      setVerifying(true)
      verifyAccount(token)
          .then(res => {
            setVerifying(false)
            props.appBusy();
            setStatus(res.responseCode)
            if (res.responseCode === '00'){
              setTimeout( ()=>{
                window.location.href = window.origin + "/#/auth/login"
              }, 3000)
            }else{
              setMessage(res.message ? res.message : 'An Error Occurred verifying your account. Kindly try again by reloading this page.')
              alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
            }
          })
          .catch(e=>{
            setVerifying(false)
            props.appBusy()
            alertExceptionError(e)
          })
    }
  }, [token])

  // useEffect(() => {
  //   if (props.error_details) {
  //     cogoToast.error(props.error_details.message, { position: "top-right" });
  //     props.clearState({ name: "error_details", value: null });
  //   }
  // }, [props.error_details]);

  // useEffect(() => {
  //   if (props.activate) {
  //     cogoToast.success("Your account was sucessfully activated.", { position: "top-right" });
  //     window.location.href = window.origin + "/#/auth/login"
  //     props.clearState({ name: "activate", value: null });
  //   }
  // }, [props.activate]);

  return (
    <Container>
      <BlockUI content={<h5>{props.block_ui && props.block_ui.message}</h5>} show={props.block_ui && props.block_ui.status}/>
      <div className="container">
        <div className="">
          <div className="text-center">
            <div style={{ marginBottom: "190px" }}>
                <img
                    src={`https://res.cloudinary.com/dy2dagugp/image/upload/logo/${hostChecker()}.png`}
                    as="a"
                    href="https://seerbit.com/"
                    target="_blank"
                    className="auth-logo"
                    alt="seerbit_logo" width="121"
                />
              {/*<img src="https://res.cloudinary.com/dpejkbof5/image/upload/v1620323718/Seerbit_logo_png_ddcor4.png" alt="seerbit_logo" width="121" />*/}
            </div>

            {!verifying &&
            <div>
              {
                status == '00' ?
                    <section>
                      <div className="svg-container">
                        <svg className="ft-green-tick" xmlns="http://www.w3.org/2000/svg" height="100" width="100"
                             viewBox="0 0 48 48" aria-hidden="true">
                          <circle className="circle" fill="#5bb543" cx="24" cy="24" r="22"/>
                          <path className="tick" fill="none" stroke="#FFF" stroke-width="6" stroke-linecap="round"
                                stroke-linejoin="round" stroke-miterlimit="10" d="M14 27l5.917 4.917L34 17"/>
                        </svg>
                      </div>
                      <div style={{color: "#323131"}} className="mt-5">
                        Thank You for Signing Up
                      </div>
                      <div className="d-flex justify-content-center align-items-center mt-5 flex-column">
                        <div className="font-16 text-center"
                             style={{width: "400px", color: "#323131", marginBottom: 200}}>
                          You account has been confirmed and activated. You will be redirected to the Login page to sign
                          in to your account.
                        </div>
                        {/*<Button*/}
                        {/*    block*/}
                        {/*    className="brand-btn h-50px w-100%"*/}
                        {/*    type="button"*/}
                        {/*    onClick={()=>window.location = "/#/auth/login"}*/}
                        {/*>*/}
                        {/*  Sign In*/}
                        {/*</Button>*/}
                      </div>
                    </section>
                    :
                    <section>
                      <div style={{color: "#323131"}} className="mt-5">
                        Sorry! We are unable to verify your account at the moment.
                      </div>
                      <div className="d-flex justify-content-center align-items-center mt-5">
                        <div className="font-16 text-center"
                             style={{width: "400px", color: "#323131", marginBottom: 200}}>
                          {message}
                        </div>
                      </div>
                    </section>
              }
            </div>
                }
<BrandsThatTrustUs/>
          </div>
        </div>
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  activate: state.data.activate,
  block_ui: state.data.block_ui
});

export default connect(mapStateToProps, {
  verifyEmail,
  setErrorLog,
  clearState,
  appBusy
})(Activate);
