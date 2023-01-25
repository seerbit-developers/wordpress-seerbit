import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import EditPlan from "../../modules/edit_plan";
import { editPlan } from "services/recurrentService";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { dispatchUpdatePlan } from "actions/recurrentActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { alertExceptionError, alertSuccess, alertError } from "modules/alert";
import Copy from "assets/images/svg/copy.svg";
import { useHistory } from "react-router";
import { Button } from "react-bootstrap";
import "./css/plan_overview.scss";
import styled from "styled-components";
import LeftChevron from "../../assets/images/svg/leftChevron";
import {Link} from "react-router-dom";
import {handleCopy} from "../../utils";
import {useTranslation} from "react-i18next";

const Container = styled.div`
   background: #FFFFFF;
   border: 1px solid #F0F2F7;
   boxSizing: border-box;
   boxShadow: 0px 1px 4px #F0F2F7;
   borderRadius: 3
`;

function PlanOverview(props) {
    const [isOpen, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const { selectedPlan, dispatchUpdatePlan, business_details, title } = props;
    const [values, setValues] = useState();
    const history = useHistory();
    const {t} = useTranslation();

    const {
        default_currency,
        country,
    } = business_details;

    useEffect(() => {
        setValues({
            productId: selectedPlan?.details?.productId,
            productDescription: selectedPlan?.details?.productDescription,
            amount: selectedPlan?.details?.amount,
            billingCycle: selectedPlan?.details?.billingCycle,
            publicKey: selectedPlan?.details?.publicKey,
            limit: selectedPlan?.details?.limit
        })
    }, [selectedPlan])

    const handleChangeStatus = () => {
        setProcessing(true)
        const data = {
            ...values,
            planId: selectedPlan?.details?.planId,
            status: selectedPlan?.details?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            country: country?.countryCode,
            currency: default_currency,
        }
        editPlan(data).then(res => {
            if (res.responseCode == '00') {
                setProcessing(false)
                dispatchUpdatePlan({
                    planId: res?.payload?.details?.planId,
                    plan: res?.payload
                });
                alertSuccess(res?.payload?.details?.status === "ACTIVE" ? "Plan was successfully activated." : "Plan was successfully deactivated.")
            } else {
                setProcessing(false)
                alertError(res.message
                    ? res.message || res.responseMessage
                    : "An error occurred while updating the plan status. Kindly try again");
            }
        }).catch((e) => {
            setProcessing(false)
            alertExceptionError(e)
        });
    }


    return (
        <div>
            <div className="d-flex flex-row justify-content-between">
                <div>
                    <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-3">
                        {selectedPlan?.details?.productId}
                    </div>
                    <div className="font-16 mb-5">
                        <span >{t('Plan Code')}{" "}
                            <span className="text-black">{selectedPlan?.details?.planId}
                            </span>
                        </span>
                    </div>
                </div>
                {/*<CloseTag onClick={() => history.goBack()} className="mr-1">*/}
                {/*    <FontAwesomeIcon icon={faChevronLeft} className="mt-2" />{" "}*/}
                {/*    <span className="ml-1 mb-2">return to {title}</span>*/}
                {/*</CloseTag>*/}
                <div className="d-flex flex-row justify-content-between">
                    <Link onClick={() => history.goBack()} className="backk pb-5">
                        <LeftChevron /> return to {title}
                    </Link>
                </div>
            </div>
            <Container className="my-4 d-flex align-items-center py-3 mb-5" style={{ height: "auto" }}>
                <div className="col-12">
                    <div className="row p-0 m-0">
                        <div className="col-lg-8 col-md-12">
                            <div className="row p-0 m-0 justify-content-between" style={{ width: "100%" }}>
                                <div className="py-3">
                                    <div className="sbt-label">Plan Amount</div>
                                    <div className="sbt-value">{`${selectedPlan?.currency} ${selectedPlan?.amount}`}</div>
                                </div>
                                <div className="py-3">
                                    <div className="sbt-label">Interval</div>
                                    <div className="sbt-value">{selectedPlan?.details?.billingCycle && selectedPlan?.details?.billingCycle.toLowerCase()}</div>
                                </div>
                                <div className="py-3">
                                    <div className="sbt-label">Revenue</div>
                                    <div className="sbt-value">{`${selectedPlan?.currency} ${selectedPlan?.revenue}`}</div>
                                </div>
                                <div className="py-3">
                                    <div className="sbt-label">Plan Link</div>
                                    <span className="row p-0 m-0">
                                        <div className="cut-text-2">
                                            <span className="sbt-value"><a href={selectedPlan?.payUrl} target="_blank">{selectedPlan?.payUrl}</a></span>
                                        </div>
                                        <img
                                            src={Copy}
                                            width="15"
                                            height="15"
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                handleCopy(selectedPlan?.payUrl);
                                            }}
                                        />
                                    </span>

                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <div className="d-flex flex-row flex-wrap justify-content-end" style={{ width: "100%" }}>
                                <div className="py-3 mr-2">
                                    <Button
                                        variant="light"
                                        style={{ width: "100px", background: "#DFE0EB" }}
                                        className="sbt-button"
                                        onClick={() => setOpen(true)}
                                    >
                                        edit plan
                                    </Button>
                                </div>
                                <div className="py-3">
                                    <Button
                                        style={{ width: "180px" }}
                                        className={selectedPlan?.details?.status === "ACTIVE" ? "sbt-button" : "brand-btn"}
                                        variant={selectedPlan?.details?.status === "ACTIVE" ? "danger" : ""}
                                        onClick={() => handleChangeStatus()}
                                    >

                                        {processing && (
                                            <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                                        )}{" "}
                                        {selectedPlan?.details?.status === "ACTIVE" ? "deactivate" : "activate"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <EditPlan close={() => setOpen(false)} {...{ isOpen, selectedPlan }} />
        </div>
    );
}


const mapStateToProps = state => ({
    business_details: state.data.business_details
});

export default connect(mapStateToProps, {
    dispatchUpdatePlan
})(PlanOverview);
