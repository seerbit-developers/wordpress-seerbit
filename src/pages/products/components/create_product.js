/** @format */

import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import verify from "utils/strings/verify.json";
import validate from "utils/strings/validate.json";
import { Dropdown } from "primereact/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "react-bootstrap";
import styled from "styled-components";
import AppModal from "components/app-modal";
import "modules/css/module.scss";
import {alertError, alertSuccess} from "modules/alert";
import { updateProductImage,createProduct} from "services/productService";
import {useDropzone} from "react-dropzone";
import UploadIcon from "assets/images/svg/uploadIcon";
import CloseIcon from "assets/images/svg/closeIcon";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";


const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

function CreateProduct({
  close,
  setShowCategory,
  product_categories,
  isOpen,
  currency, getProducts
}) {

  const [uploadProcess, setUploadProcess] = useState();
  const [productName, setProductName] = useState();
  const [productProcessing, setProductProcessing] = useState();
  const [productCode, setProductCode] = useState();
  const [productDescription, setProductDescription] = useState();
  const [amount, setAmount] = useState();
  const [quantity, setQuantity] = useState();
  const [categoryId, setCategoryId] = useState();
  const [isDepletable, setIsDepletable] = useState();
  const [status, setStatus] = useState();
  const [progress, setProgress] = useState(0)
  const [productNamePass, setProductNamePass] = useState(true);
  const [amountPass, setAmountPass] = useState(true);
  const [quantityPass, setQuantityPass] = useState(true);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [updateImage, setUpdateImage] = useState(false);
  const {t} = useTranslation()
  const product = useSelector(state=>state.frontStore.product_details)

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    open,
    fileRejections
  } = useDropzone({
    accept: "image/*",
    maxFiles: 5,
    maxSize:1000*1000+2
  });
  useEffect(() => {
    if (acceptedFiles.length === 5) {
      alertError("Maximum of 5 images allowed.");
      return;
    }
    if (files.length === 5) {
      alertError("Maximum of 5 images allowed.");
      return;
    }
    let store = []
    acceptedFiles.map(file => {
      let reader = new FileReader();
      if (file) {
        if (file.size > 1025 * 1000) {
          alertError("Maximum of 1MB file size is allowed");
          return;
        }
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          store.push(reader.result)
          if (acceptedFiles.length === store.length) {
            setUpdateImage(true)
            if (files.length > 0) {
              setFiles([...files, ...store])
            } else {
              setFiles(store)
            }
          }
        }

      }
    });
  }, [acceptedFiles]);

  const removeImage = (index) => {
    const data = files.filter((val, i) => {
      return i !== index && val !== ""
    })
    setUpdateImage(true)
    setFiles(data)
  }

  useEffect(() => {
    fileRejections.map(file => (
        console.error(file)
    ));
  }, [fileRejections]);

  const handleProductName = (e) => {
    setProductName(e.target.value);
    setProductNamePass(e.target.value.length > 2);
  };
  const handleProductDescription = (e) => {
    setProductDescription(e.target.value);
  };
  const handleAmount = (e) => {
    var thenum = e.target.value.match(RegExp(verify.number), "");
    if (thenum !== null) {
      setAmount(thenum[0]);
      setAmountPass(RegExp(validate.amount).test(thenum[0]));
    }
  };
  const handleQuantity = (e) => {
    var thenum = e.target.value.match(RegExp(verify.number), "");
    if (thenum !== null) {
      setQuantity(thenum[0]);
      setQuantityPass(RegExp(validate.number).test(thenum[0]));
    }
  };
  const handleProductCode = (e) => {
    setProductCode(e.target.value);
  };
  const categoryTemplate = (option) => {
    if (!option.id) {
      return (
        <div
          className="font-12"
          onClick={() => {
            setShowCategory(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} className={"mr-2 font-16"} />
          {t('Add new category')}
        </div>
      );
    } else
      return (
        <div
          className="my-1 font-12"
        >
          {option.name}
        </div>
      );
  };
  const clearForm = ()=>{
    if (product){
      setProductName('')
      setProductCode('')
      setProductDescription('')
      setIsDepletable('')
      setAmount('')
      setQuantity('')
      setStatus('')
      setCategoryId( '')
    }
  }


  const initProcess = async (
    productName,
    productCode,
    productDescription,
    amount,
    quantity,
    categoryId,
    isDepletable,
    status
  ) => {
    if (!productNamePass) {
      setProductName("");
      setProductProcessing(false);
      setProductNamePass(false);
    } else if (!amountPass) {
      setAmount("");
      setProductProcessing(false);
      setAmountPass(false);
    } else if (!quantityPass) {
      setQuantity("");
      setProductProcessing(false);
      setQuantityPass(false);
    } else {
      setProductProcessing(true);
        createProduct(
            {
              data: {
                productName,
                productCode,
                productDescription,
                amount,
                quantity,
                categoryId: categoryId,
                isDepletable,
                status,
              }
            }
        ).then( async res =>{
              setProductProcessing(false);
              if (res.responseCode === '00'){
                getProducts()
                if (updateImage){
                  initUpload(res.payload.id).then(res=> {
                    clearForm()
                    close()
                    if (!res) {
                      alertError('Failed to update product images')
                    }else{
                      alertSuccess('Success')
                    }
                  })
                }else{
                  clearForm()
                  close()
                  alertSuccess('Success')
                }
              }else{
                alertError(res.message ? res.message : 'Failed to update product')
              }
            })
          .catch(e=>{
          setProductProcessing(false);
          alertError(e.message ? e.message : 'Failed to update product')
          })

    }
  };

  const onUploadProgress = (progressEvent) => {
    let percentCompleted = 0;
    percentCompleted = Math.floor(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setProgress(percentCompleted);
  };

  const initUpload = (productId) => {
    if (!files.length){
      return null
    }
      const params = {
        data: {
          productImages: files,
        },
        id: productId,
        onUploadProgress,
        multiple:true
      };
        setUploadProcess(true);
        return updateProductImage(params)
            .then( res =>{
              setUploadProcess(false);
              getProducts();
              setProgress(0);
              if (res.responseCode === '00'){
                return true
              }else{
                return false
              }
            }).catch(e=>{
          setUploadProcess(false);
          setProgress(0);
              getProducts();
          return false
        })
  };

  return (
      // eslint-disable-next-line max-len
    <AppModal title={`${t('Create Product')}`} isOpen={isOpen} close={() => close()}>
        <form
          className="w-100 pb-5"
          onSubmit={(e) => {
            e.preventDefault();
            initProcess(
              productName,
              productCode,
              productDescription,
              amount,
              quantity,
              categoryId,
              isDepletable,
              status
            );
          }}
        >
          <div className="col-12 py-2">
            <div>
              {uploadProgress < 1 && (
                  <div className="mb-2" {...getRootProps({ className: "dropzone" })} >
                    <input {...getInputProps()} />
                    <div className="mb-5">
                      <div className="empty-upload cursor-pointer">
                        <div className="d-flex justify-content-center pt-4">
                          <div className="text-center">
                            <img src={UploadIcon} alt="empty" width="50" height="50" />
                            <div className="instruc mt-3"> {t('Drag and Drop or select images')}</div>
                            <div className="instruct-1 my-1">{t('Maximum 5 of images')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {progress > 0 && (
                <ProgressBar
                  animated
                  now={progress}
                  label={`${progress}%`}
                  className="mb-2"
                />
              )}
              <div className="row p-0 m-0 my-3 d-flex flex-wrap">
                {files.map((data, id) =>
                    <div key={id} className={!data ? 'product_image-border-stripes cursor-pointer' : 'product_image-border'} onClick={() => {
                      if (!data) {
                        open()
                      }
                    }}>
                      {data && <img src={data} width="80" height="80" className="mr-2 mb-2" alt="uploads" />}
                      {uploadProgress < 1 &&
                      <CloseIcon className='product_image-close' onClick={() => removeImage(id)} />
                      }
                    </div>
                )}
              </div>

              {/*<Button*/}
              {/*  style={{*/}
              {/*    background: "transparent",*/}
              {/*    border: "1px solid #DFE0EB",*/}
              {/*    boxSizing: "border-box",*/}
              {/*    borderRadius: "5px",*/}
              {/*  }}*/}
              {/*  variant="xdh"*/}
              {/*  block*/}
              {/*  className="btn-outline font-14"*/}
              {/*  onClick={() => {*/}
              {/*    uploadElement.click();*/}
              {/*  }}*/}
              {/*>*/}
              {/*  {uploadProcess && (*/}
              {/*    <FontAwesomeIcon*/}
              {/*      icon={faSpinner}*/}
              {/*      spin*/}
              {/*      className="font-15"*/}
              {/*    />*/}
              {/*  )}{" "}*/}
              {/*  {uploadProcess*/}
              {/*    ? `Uploading`*/}
              {/*    : "Upload Product Picture"}*/}
              {/*</Button>*/}

            </div>
          </div>


          <div className="row">
            <div className="col-12 py-2">
              <label className="font-12">{t('Product Name')}</label>
              <input
                className="form-control mh-40 "
                type="text"
                name="name"
                onChange={(e) => handleProductName(e)}
                value={productName}
                required
              />
              {!productNamePass && productName !== undefined && (
                <Error>{t('enter a valid name')}</Error>
              )}
            </div>
            <div className="col-12 py-2">
              <label className="font-12">{t('Product Code (optional)')}</label>
              <input
                className="form-control mh-40 "
                type="text"
                name="code"
                onChange={(e) => handleProductCode(e)}
                value={productCode}
              />
            </div>

            <div className="col-12 py-2 ">
              <div className="font-12 mb-2">{t('Category')}</div>
              <Dropdown
                optionLabel="text"
                value={categoryId}
                options={product_categories}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                }}
                itemTemplate={categoryTemplate}
                placeholder={t('Select a category')}
                className="sbt-border-success w-100"
              />
            </div>
            <div className="form-group col-12 pb-0">
              <label className="font-12">{t('Quantity')}</label>
              <input
                className="form-control mh-40 "
                type="text"
                name="quantity"
                onChange={(e) => handleQuantity(e)}
                value={quantity}
                required
              />
              {!quantityPass && quantity !== undefined && (
                <Error>{t('Quantity must be greater than zero')}</Error>
              )}
            </div>
            <div className="form-group col-12 mb-1">
              <label className="font-12">{t('Price')}</label>
            </div>
            <div className="form-group col-3">
              <input
                className="form-control mh-40 bg-white"
                type="text"
                defaultValue={currency}
                disabled={true}
                required
              />
            </div>{" "}
            <div className="pl-md-1 form-group col-9">
              <input
                className="form-control mh-40"
                type="text"
                name="amount"
                value={amount}
                onChange={(e) => handleAmount(e)}
                required
              />
              {!amountPass && amount !== undefined && (
                <Error>{t('Enter a valid amount')}</Error>
              )}
            </div>
            <div className="form-group col-12 px-3">
              <label className="font-12 ">
                {t('Product Description')}{" "}
              </label>
              <textarea
                name="message"
                className="form-control"
                rows="3"
                minLength={2}
                maxLength={200}
                placeholder={t('Describe your product with 200 characters...')}
                style={{ resize: "none" }}
                onChange={(e) => handleProductDescription(e)}
                value={productDescription}
                required
              />
            </div>
            <div className=" col-12">
              <div className="row mx-0">
                <label className="font-14 mt-2 mr-2">{t('Do you want to set the status to be active?')}</label>
                <div className="form-inline ">
                  <label className="form-label font-14 mr-2">{t('Yes')}</label>
                  <input
                    type="checkbox"
                    className="form-control "
                    onChange={(e) => setStatus(!status)}
                    checked={status}
                  />
                  <label className="form-label font-14 mx-2">{t('No')}</label>
                  <input
                    type="checkbox"
                    className="form-control mr-2 "
                    onChange={(e) => setStatus(false)}
                    checked={!status}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-12 pb-2">
              <div className="row mx-0">
                <label className="font-14 mt-2 mr-3">{t('Do you want to enable the stock?')}</label>
                <div className="form-inline ">
                  <label className="form-label font-14 mr-2">{t('Yes')}</label>
                  <input
                    type="checkbox"
                    className="form-control "
                    onChange={(e) => setIsDepletable(true)}
                    checked={isDepletable}
                  />
                  <label className="form-label font-14 mx-2">{t('No')}</label>
                  <input
                    type="checkbox"
                    className="form-control mr-2 "
                    onChange={(e) => setIsDepletable(false)}
                    checked={!isDepletable}
                  />
                </div>
              </div>
            </div>
            <div className="col-12">
              <Button
                variant="xdh"
                size="lg"
                block
                height={"40px"}
                className="brand-btn"
                type="submit"
                disabled={productProcessing}
              >
                {productProcessing && (
                  <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                )}
                {!productProcessing && `${t('Create Product')}`}
              </Button>
            </div>
          </div>
        </form>
    </AppModal>
  );
}

export default CreateProduct;
