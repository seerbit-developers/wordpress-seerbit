import React from "react";
import Dropzone from "react-dropzone";
import Attach from "../assets/images/svg/attach.svg";
import "./css/module.scss";

const FileDocument = (props) => {
  return (
    <div className="col-md-12 configuration__item">
      <label className="font-12 text-capitalize">{props.data.fieldName.toUpperCase()}</label>

      <div className="bg-white px-4 py-2 mb-2">
        <div className="row">
          {[
            "NEW_BUSINESS",
            "IN_REVIEW",
            "SUBMITTED",
            "PROFILED",
            "REVIEW",
          ].indexOf(props.status) > -1 && (
              <div className="col-9 p-0">
                <div
                  className={
                    props.status && props.file
                      ? "text-primary font-12"
                      : props.status
                        ? "text-success font-12"
                        : "text-danger font-12"
                  }
                >
                  {props.status && props.file
                    ? ""
                    : props.data.kycDocumentUrl &&
                      props.data.kycDocumentUrl !== null
                      ? `Your ${props.data.kycDocumentName} document has been recieved and it's currently awaiting approval`
                      : `Drop your ${props.data.kycDocumentName} documents here`}
                </div>
                <div className={"font-12"}>
                  {props.file === undefined
                    ? ""
                    : <><span>{props.file.name}</span> <i className="fa fa-check-circle ml-2" style={{ color: '#28a745' }}></i></>}
                </div>
              </div>
            )}

          {["APPROVED", "DECLINED"].indexOf(props.status) > -1 && (
            <div className="col-9 p-0">
              <div
                className={
                  props.status === "APPROVED"
                    ? "text-success font-12"
                    : "text-danger font-12"
                }
              >
                {props.status === "APPROVED"
                  ? ` ${props.status}`
                  : `${props.status}:  did not meet the requirement`}
              </div>
              {props.file !== undefined && (
                <div className={"font-12"}>
                  {/* Your {props.data.kycDocumentName} document is ready for upload */}
                  <><span>{props.file.name}</span> <i className="fa fa-check-circle ml-2" style={{ color: '#28a745' }}></i></>
                </div>
              )}
            </div>
          )}

          <div className="col-3 p-0">
            <Dropzone
              onDrop={props.onDrop}
              accept="image/png, image/jpeg, application/pdf"
              onDropAccepted={() => alert('FIle uploaded successfully')}
              className={
                props.status === "APPROVED"
                  ? "text-success font-12 "
                  : "text-danger font-12 "
              }
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps({
                    className: "dropzone float-right d-flex justify-end",
                  })}
                >
                  <input {...getInputProps()} className="pl-0 font-14" />
                  {props.status !== "APPROVED" && <img src={Attach} />
                  }
                </div>
              )}
            </Dropzone>
          </div>
        </div>
      </div>
      <div className="input__border--bottom"/>
    </div>
  );
};

export default FileDocument;