import React, { useState, useEffect } from "react";
import Checked from "../assets/images/checked.png";
import styled from "styled-components";
import { useDropzone } from 'react-dropzone';
import { isEmpty } from "lodash";
import {base64toBlob, detectMimeType, getKycDocType} from "utils";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { alertError, alertSuccess } from "./alert";
import { useTranslation } from "react-i18next";
const UploadFile = styled.div`
    width: auto;
    height: 50px;
    background: #FFFFFF;
    border: 1px dashed #DFE0EB;
    box-sizing: border-box;
    border-radius: 5px;
  display: flex;
  align-items: center;
`;


function KycForms(props) {
    const reader = new FileReader();
    const [openModal, setOpenModal] = useState(false)
    const [image, setImage] = useState('')
    const { data, key, value, handleValue, setValue, fields, setField } = props;

    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        fileRejections,
        open
    } = useDropzone({
        accept: "image/*, application/pdf",
        noClick: true,
        noKeyboard: true,
        maxSize:1000*1000*2,
    });

    const { t } = useTranslation();
    useEffect(() => {
        if (value) {
            if (Array.isArray(value)) {
                value.map(data => {
                    if (data.documentType === 'TEXT') {
                        setField({ ...fields, [data.fieldName]: data.rawFile });
                    } else {
                        setField({ ...fields, [data.fieldName]: data.rawFile });
                    }

                })
            }
        }

    }, [value])

    const transformKycDocuments = (docs, fieldName, currentData, fieldValue, type = 'TEXT') => {
        const copy = JSON.parse(JSON.stringify(docs))
        let index;
        const exists = docs.find((item, i) => {
            index = i
            return item.fieldName == fieldName
        })
        if (exists) {
            if (type === 'NONTEXT') {
                const d = {
                    fieldName: currentData.fieldName,
                    documentType: currentData.documentType,
                    rawFile: fieldValue
                }
                copy[index] = d
                setValue(copy)
            } else {
                let d = {
                    fieldName: currentData.fieldName,
                    documentType: currentData.documentType,
                    kycRecordUpdate: fieldValue
                }

                copy[index] = d
                setValue(copy)
            }

        } else {

            if (type === 'NONTEXT') {
                let d = {
                    fieldName: currentData.fieldName,
                    documentType: currentData.documentType,
                    rawFile: fieldValue
                }
                copy.push(d)
                setValue(copy)
            } else {

                let d = {
                    fieldName: currentData.fieldName,
                    documentType: currentData.documentType,
                    kycRecordUpdate: fieldValue
                }
                copy.push(d)
                setValue(copy)
            }
        }
    }

    const setKycValues = (fieldValue, fieldName, currentData) => {

        if (value && value.length > 0) {
            transformKycDocuments(value, fieldName, currentData, fieldValue, 'TEXT')
        }
        else {
            setValue([{
                fieldName: currentData.fieldName,
                documentType: currentData.documentType,
                kycRecordUpdate: fieldValue
            }]
            );
        }
    }

    useEffect(() => {
        acceptedFiles.map(file => {
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alertError("Maximum of 5MB is allowed");
                    return;
                }
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    if (value && value.length > 0) {
                        transformKycDocuments(value, data.fieldName, data, reader.result, 'NONTEXT');
                        alertSuccess('File was successfully uploaded');
                    } else {
                        setValue([{
                            fieldName: data.fieldName,
                            documentType: data.documentType,
                            rawFile: reader.result
                        }]
                        );
                    }
                }

            }
        });
    }, [acceptedFiles]);

    useEffect(() => {
        fileRejections.map(file => {
            if (file && file.errors){
                if (file.errors[0].code === 'file-too-large') {
                    alertError('Sorry! Your document is larger than 2 Megabytes. Kindly reduce the file size and re-upload.')
                }
            }
            }
        );
    }, [fileRejections]);

    const isAvailable = fields && Object.keys(fields).indexOf(data.fieldName) > -1;
    const requiredField = ["PROFILED"].indexOf(data.status) > -1

    const previewFile = (d)=>{
        try{
            const file = value.find(item=>item.fieldName === d.fieldName)
            if (detectMimeType(file.rawFile).indexOf('image') !== -1 ){
                setImage(file.rawFile)
                setOpenModal(true)
            }else if (detectMimeType(file.rawFile).indexOf('pdf') !== -1 ){
                var blob = base64toBlob(encodeURI(file.rawFile.replace(/^data:application\/[a-z]+;base64,/, "")));
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob, "pdfBase64.pdf");
                } else {
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl);
                }
            }
        }catch (e) {
            alertError('Unable to preview file at the moment')
        }
    }

    const previewLink = (d)=>{
        try{
            if (getKycDocType(d) === 'IMAGE'){
                setImage(d.kycDocumentUrl)
                setOpenModal(true)
            }else if (getKycDocType(d) === 'PDF'){
                window.open( encodeURI(d.kycDocumentUrl));
            }
        }catch (e) {
            console.log(e)
            alertError('Unable to preview file at the moment')
        }
    }
    return (
        <div className="sbt-kyc">
            {openModal && (
                <Lightbox
                    mainSrc={image}
                    onCloseRequest={() => setOpenModal(false)}
                />
            )}
            {!requiredField && (
                <UploadFile className="mb-3 justify-content-between p-3">
                        <span className="d-flex align-items-center" >
                            <img src={Checked} height="14" />
                            <span className='pl-2'>{data.fieldName}</span>
                        </span>
                        <span className='cursor-pointer seerbit-color' onClick={()=> previewLink(data)}>
                                                        PREVIEW</span>
                </UploadFile>
            )}
            {data.documentType === "TEXT" && data.status !== "APPROVED" && (
                requiredField && (
                    <div className="mb-3" key={key}>
                        <input autoComplete="on" style={{ display: 'none' }}
                            id="fake-hidden-input-to-stop-google-address-lookup" />
                        <div className="form-outline mb-3">
                            <input
                                autoComplete="off"
                                name={data.fieldName}
                                type="text"
                                className={value && isAvailable && fields[data.fieldName] !== "" ? `form-control hasText` : `form-control seerbit-text`}
                                onChange={(e) => {
                                    setKycValues(e.target.value, data.fieldName, data)
                                }}
                                value={value && isAvailable ? fields[data.fieldName] : data.kycRecordUpdate}
                                required
                            />
                            <label className="form-label">{data.fieldName.replace("_", " ")}</label>
                        </div>
                    </div>
                )
            )
            }
            {(["IMAGE", "PDF"].indexOf(data.documentType) > -1) && data.status !== "APPROVED" && (
                requiredField && (
                    isEmpty(data.kycDocumentUrl) && (
                        <div className="mb-3" key={key}>
                            <div className="file-label  my-1">
                                <span className='font-bold'>{data.fieldName}</span> {' '}
                                <span style={{ color: 'rgb(255 34 0)' }} className='font-16'>*</span>
                            </div>
                            <div {...getRootProps({ className: "dropzone" })}>
                                <input {...getInputProps()} />
                                <UploadFile 
                                // style={{ border: props.emptyUpload ? "0.5px solid #ff0000": "1px dashed rgb(223, 224, 235)" }} 
                                >
                                    {value && isAvailable ? (
                                            <div className="d-flex justify-content-between align-items-center p-3 w-100">
                                                <span className="file-content">
                                                    <span className='cursor-pointer seerbit-color' onClick={()=> previewFile(data)}>
                                                        PREVIEW</span>
                                                </span>
                                                <span className="font-10 cursor-pointer seerbit-color" onClick={open}>
                                                    Replace
                                                </span>
                                            </div>
                                    ) : (
                                        data.status === "PROFILED" ? (
                                            <div className="pt-1 px-2" onClick={open}>
                                                <span className="file-content">
                                                    {" "}Drop file here or <span className="text-primary cursor-pointer">
                                                        browse files</span> from your computer</span>
                                            </div>
                                        ) : (
                                                <div className="d-flex justify-content-between align-items-center p-3 w-100">
                                                    <span className="file-content" onClick={()=>previewLink(data)}>
                                                        <img src={Checked} height="8" />
                                                        {" "}{data.fieldName}
                                                    </span>
                                                    <span className="font-10 cursor-pointer seerbit-color" onClick={open}>
                                                        Replace
                                                            </span>
                                                </div>
                                        ))}
                                </UploadFile>
                                <div className='d-flex justify-content-end font-9'  style={{ color: 'rgb(255 34 0)' }}>*Maximum file size is 2MB</div>
                            </div>
                        </div>
                    )
                ))}
        </div>
    )
}
export default KycForms;
