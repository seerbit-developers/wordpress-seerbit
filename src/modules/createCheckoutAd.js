/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    addBusinessAdvert,
    getBusinessAdvert,
    updateBusinessAdvert,
    clearState,
    dispatchBusinessAdvert
} from "../actions/postActions";
import { Button } from "react-bootstrap";
import { isEmpty } from "lodash";
import validate from "utils/strings/validate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Upload from "../assets/images/svg/upload.svg";
import styled from "styled-components";
import "./css/module.scss";
import AppModal from "components/app-modal";
import {createCheckoutAdvert} from "services/checkoutService";
import {alertError, alertExceptionError, alertSuccess} from "./alert";
import {useTranslation} from "react-i18next";

const Center = styled.div`
  text-align: center;
  margin: auto;
  justify-content: center;
  line-height: 1.2;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  color: #676767;
`;

function CreateCheckoutAdvert(props) {
    const { t } = useTranslation();
    const {
        close,
        add_advert,
        selectedAds,
        isEdit=false,
        update_advert,
        isOpen,
        dispatchBusinessAdvert
    } = props;

    const [upload_ads, setUploadAds] = useState();
    const [adsContent, setAdsContent] = useState({});
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState(true);
    const [ads, setAds] = useState();
    const [uploadProcess, setUploadProcess] = useState(false);


    useEffect(() => {
        if (!isEmpty(add_advert) || !isEmpty(update_advert)) {
            setProcessing(false);
        }
    }, [add_advert, update_advert]);


    let uploadElement = null;
    const reader = new FileReader();
    const image = new Image();

    useEffect(() => {
        if (upload_ads) {
            if (parseFloat(upload_ads.size / (1024 * 1024)).toFixed(2) > 2) {
                alertError("Maximum of 2MB is allowed");
                return;
            }

            reader.readAsDataURL(upload_ads);

            reader.onload = () => {
                image.src = reader.result;
                image.onload = () => {
                    // if ((image.width < 400) || (image.width > 450)) {
                    //     alertError("Please, upload a file with a width and a height not lesser than 400px and greater than 450px");
                    //     return;
                    // }
                    //
                    // if ((image.height < 400) || (image.height > 450)) {
                    //     alertError("Please, upload a file with a width and a height not lesser than 400px and greater than 450px");
                    //     return;
                    // }
                    setAds(reader.result);
                }
            }
        }
    }, [upload_ads])

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        const p = {
            advertId: selectedAds?.id,
            advertImage: ads,
            status: status ? "ACTIVE" : "INACTIVE",
            advertTitle: !adsContent.advertTitle ? selectedAds.advertTitle : adsContent.advertTitle,
            advertDescription: !adsContent.advertDescription ? selectedAds.advertDescription : adsContent.advertDescription,
            advertUrl: !adsContent.advertUrl ? selectedAds.advertUrl : adsContent.advertUrl,
        }

        createCheckoutAdvert(p).then((res) => {
            setProcessing(false);
            if (res.responseCode === "00") {
                alertSuccess("Successful");
                dispatchBusinessAdvert(res.payload)
                close()
            } else {
                alertError(res.message
                    ? res.message
                    : "An Error Occurred sending the request. Kindly try again");
            }
        }).catch((e) => {
            setProcessing(false);
            alertExceptionError(e)
        });
    };

    const handleValue = (e) => {
        setAdsContent({ ...adsContent, [e.target.name]: e.target.value ? e.target.value : "" });
    };

    return (
        <AppModal title="Create Checkout Advert" isOpen={isOpen} close={() => close()}>
            <form className="w-100" onSubmit={handleSubmit}>
                <div>
                    <div className="px-5">
                        <Center>
                            <img
                                src={ads ? ads : isEdit ? selectedAds.advertImageUrl : Upload}
                                onClick={(e) => uploadElement.click()}
                                height="64"
                                width="64"
                                title={t('click to update business ads')}
                            />
                        </Center>
                        <input
                            style={{ display: "none" }}
                            type="file"
                            accept="image/png, image/gif, image/jpeg, image/jpg, image/webp"
                            placeholder="image"
                            ref={(e) => (uploadElement = e)}
                            onChange={(e) => {
                                setUploadAds();
                                setUploadAds(e.target.files[0])
                            }}
                        />
                        <Center className="py-3">
                            <Tag>
                                {t('We recommend that you choose a file with the height and width, that is not lesser than')}{" "}
                                <strong>400px</strong> {t('and greater than')} <strong>450px</strong>,
                                {t('and with a size not more than')} <strong>2MB</strong> {t('for the best results')}.
                            </Tag>
                        </Center>
                    </div>
                    <Center className="pb-4">
                        <Button
                            style={{
                                background: "transparent",
                                border: "1px solid #DFE0EB",
                                boxSizing: "border-box",
                                borderRadius: "5px",
                            }}
                            variant="xdh"
                            block
                            className="btn-outline font-14"
                            onClick={() => {
                                uploadElement.click();
                            }}
                        >{uploadProcess && (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                spin
                                className="font-15"
                            />)}{" "}
                            {uploadProcess
                                ? t('Uploading')
                                : isEdit
                                    ? t('Change Image')
                                    : t('Upload Image')}
                        </Button>
                    </Center>
                </div>

                <div className="form-group mh-40 d-flex flex-row align-items-center">
                    <label className="font-12 my-0 mr-2">{status ? t('Active') :t('Disabled')}</label>
                    <input
                        type="checkbox"
                        className="d-block"
                        checked={status}
                        onChange={(e) => {setStatus(!status)}}
                        disabled={processing}
                    />
                </div>
                <div className="form-group mh-40 ">
                    <label className="font-12">{t('Advert Title')}</label>
                    <input
                        className="form-control mh-40 "
                        type="text"
                        name="advertTitle"
                        minLength={2}
                        onChange={(e) => handleValue(e)}
                        value={isEdit && adsContent.advertTitle === undefined ? selectedAds.advertTitle : adsContent.advertTitle}
                        required
                        disabled={processing}
                    />
                </div>

                <div className="form-group mh-40 ">
                    <label className="font-12">{t('Advert Description')}</label>
                    <textarea
                        name="advertDescription"
                        className="form-control"
                        minLength={2}
                        maxLength={200}
                        placeholder={t('Advert Description')}
                        rows="3"
                        style={{ resize: "none" }}
                        onChange={(e) => handleValue(e)}
                        value={isEdit && adsContent.advertDescription === undefined ? selectedAds.advertDescription : adsContent.advertDescription}
                        required
                        disabled={processing}
                    />
                </div>


                <div className="form-group mh-40 ">
                    <label className="font-12">{t('Advert Link')}</label>
                    <input
                        className="form-control mh-40 "
                        pattern={validate.web_no_http}
                        placeholder={t('Enter a valid URL')}
                        type="url"
                        name="advertUrl"
                        onChange={(e) => handleValue(e)}
                        value={isEdit && adsContent.advertUrl === undefined ? selectedAds.advertUrl : adsContent.advertUrl}
                        required
                        disabled={processing}
                    />
                </div>

                <div className="form-group mh-40">
                    <Button
                        variant="xdh"
                        size="lg"
                        block
                        height={"50px"}
                        className="brand-btn"
                        type="submit"
                        disabled={processing}
                    >
                        {processing && (
                            <FontAwesomeIcon icon={faSpinner} spin className="font-16" />
                        )}{" "}
                        {t('Create Advert')}
                    </Button>
                </div>
            </form>
        </AppModal>
    );
}

const mapStateToProps = (state) => ({
    add_advert: state.data.add_advert,
    update_advert: state.data.update_advert,
    error_details: state.data.error_details,
    location: state.data.location,
});
export default connect(mapStateToProps, {
    addBusinessAdvert,
    updateBusinessAdvert,
    getBusinessAdvert,
    clearState,
    dispatchBusinessAdvert
})(CreateCheckoutAdvert);
