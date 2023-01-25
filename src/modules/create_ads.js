/** @format */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addBusinessAdvert, getBusinessAdvert, updateBusinessAdvert, clearState } from "../actions/postActions";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { isEmpty } from "lodash";
import validate from "utils/strings/validate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Upload from "../assets/images/svg/upload.svg";
import styled from "styled-components";
import "./css/module.scss";
import {alertError, alertSuccess} from "./alert";

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


function CreateAds(props) {
  const {
    close,
    add_advert,
    addBusinessAdvert,
    updateBusinessAdvert,
    getBusinessAdvert,
    selectedAds,
    isEdit,
    update_advert
  } = props;

  const [upload_ads, setUploadAds] = useState();
  const [adsContent, setAdsContent] = useState({});
  const [processing, setProcessing] = useState(false);
  const [ads, setAds] = useState();
  const [uploadProcess, setUploadProcess] = useState(false);


  useEffect(() => {
    if (!isEmpty(add_advert) || !isEmpty(update_advert)) {
      setProcessing(false);
    }
  }, [add_advert, update_advert]);

  useEffect(() => {
    if (
      props.error_details &&
      props.location === "add_advert"
    ) {
      setProcessing(false);
      alertError(props.error_details.message);
      props.clearState({ add_advert: null });
    }

    if (
      props.error_details &&
      props.location === "update_advert"
    ) {
      setProcessing(false);
      alertError(props.error_details.message);
      props.clearState({ update_advert: null });
    }

  }, [props.error_details]);

  useEffect(() => {
    if (props.add_advert && props.location === "add_advert") {
      setProcessing(false);
      alertSuccess(props.add_advert.responseMessage);
      props.clearState({ add_advert: null });
      getBusinessAdvert();
      close();
    }

    if (props.update_advert && props.location === "update_advert") {
      setProcessing(false);
      alertSuccess("Updated Successfully!");
      props.clearState({ update_advert: null });
      getBusinessAdvert();
      close();
    }

  }, [props.location]);


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
          if ((image.width < 400) || (image.width > 450)) {
            alertError("Please, upload a file with a width and a height not lesser than 400 and greater than 450");
            return;
          }

          if ((image.height < 400) || (image.height > 450)) {
            alertError("Please, upload a file with a width and a height not lesser than 400 and greater than 450");
            return;
          }
          setAds(reader.result);
        }
      }
    }
  }, [upload_ads])

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    !isEdit ? (
      addBusinessAdvert({ data: { ...adsContent, advertImage: ads }, location: "add_advert" })
    ) : (
      updateBusinessAdvert({
        data: {
          advertId: selectedAds.id,
          advertImage: ads,
          advertTitle: !adsContent.advertTitle ? selectedAds.advertTitle : adsContent.advertTitle,
          advertDescription: !adsContent.advertDescription ? selectedAds.advertDescription : adsContent.advertDescription,
          advertUrl: !adsContent.advertUrl ? selectedAds.advertUrl : adsContent.advertUrl,
        },
        location: "update_advert"
      })
    )
  };

  const handleValue = (e) => {
    setAdsContent({ ...adsContent, [e.target.name]: e.target.value ? e.target.value : "" });
  };

  return (
    <Modal.Body className="py-3 px-4">
      <Modal.Title className="font-20 text-dark pb-3">
        <div className="py-2 text-bold">
          <strong>{isEdit ? "Update Ads" : "Create Ads"}</strong>
        </div>
      </Modal.Title>
      <form className="w-100" onSubmit={handleSubmit}>
        <div>
          <div className="px-5">
            <Center>
              <img
                src={ads ? ads : isEdit ? selectedAds.advertImageUrl : Upload}
                onClick={(e) => uploadElement.click()}
                height="64"
                width="64"
                title="click to update business ads"
              />
            </Center>
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/png, image/gif"
              placeholder="image"
              ref={(e) => (uploadElement = e)}
              onChange={(e) => {
                setUploadAds();
                setUploadAds(e.target.files[0])
              }}
            />
            <Center className="py-3">
              <Tag>
                We recommend that you choose a file with the height and width, that is not lesser than{" "}
                <strong>400</strong> and greater than <strong>450</strong>,
                and with a size not more than <strong>2MB</strong> for the best results.
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
                ? `Uploading`
                : isEdit
                  ? "Change Ads"
                  : "Upload Ads"}
            </Button>
          </Center>
        </div>

        <div className="form-group mh-40 ">
          <label className="font-12">Ads Title</label>
          <input
            className="form-control mh-40 "
            type="text"
            name="advertTitle"
            minLength={2}
            onChange={(e) => handleValue(e)}
            value={isEdit && adsContent.advertTitle === undefined ? selectedAds.advertTitle : adsContent.advertTitle}
            required
          />
        </div>

        <div className="form-group mh-40 ">
          <label className="font-12">Description</label>
          <textarea
            name="advertDescription"
            className="form-control"
            minLength={2}
            maxLength={200}
            placeholder="Describe your ads with 200 characters..."
            rows="3"
            style={{ resize: "none" }}
            onChange={(e) => handleValue(e)}
            value={isEdit && adsContent.advertDescription === undefined ? selectedAds.advertDescription : adsContent.advertDescription}
            required
          />
        </div>


        <div className="form-group mh-40 ">
          <label className="font-12">Link</label>
          <input
            className="form-control mh-40 "
            pattern={validate.web}
            placeholder={`Enter a valid URL starting with "http://" or "https://"`}
            type="url"
            name="advertUrl"
            onChange={(e) => handleValue(e)}
            value={isEdit && adsContent.advertUrl === undefined ? selectedAds.advertUrl : adsContent.advertUrl}
            required
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
              <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
            )}{" "}
            {isEdit ? "Update Ads" : "Create Ads"}
          </Button>
        </div>
      </form>
    </Modal.Body>
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
})(CreateAds);
