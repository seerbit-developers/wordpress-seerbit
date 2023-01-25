import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
    getProductCategories,
    addProduct,
    getProducts,
    createStoreSettings,
    clearState,
} from "actions/postActions";
import Upload from "./Upload";
import "./css/general.scss";
import { getStoreProducts } from "../../actions/frontStoreActions";
import CreateProduct from "./CreateProduct";
// import {CSSTransition} from "react-transition-group";
import { Button, ProgressBar, Spinner } from "react-bootstrap";
import { createStoreProduct, uploadProductImages } from "../../services/frontStoreService";
import { alertError, alertExceptionError, alertSuccess } from "../../modules/alert";
import Joi from '@hapi/joi';
import validationObject from './validate.product_create';
import AppModal from "../../components/app-modal";

export function ProductDetail(props) {

    const {
        product_categories,
        storeId,
        getProductCategories,
        getStoreProducts,
        isOpen,
        close,
        productTab,
        setProductTab,
        getProducts
    } = props;

    // const [menuHeight, setMenuHeight] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [details, setDetails] = useState(null);
    const [images, setImages] = useState([]);
    const [reset, setReset] = useState(false);
    // const dropdownRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        getProductCategories()
        // setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    }, []);

    // function calcHeight(el) {
    //     const height = el.offsetHeight + 100;
    //     setMenuHeight(height);
    // }

    const onUploadProgress = (progressEvent) => {
        let percentCompleted = 0;
        percentCompleted = Math.floor(
            (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
    };

    const saveImages = (productId) => {
        const p = {
            data: {
                productImages: images,
            },
            id: productId
        }
        uploadProductImages(p, onUploadProgress)
            .then((res) => {
                setProcessing(false);
                if (res.responseCode === "00") {
                    alertSuccess("Product created");
                    setUploadProgress(0)
                    getProducts({ start: 1, size: 25, status: 'ALL' })
                    setReset(true)
                    close()
                } else {
                    setUploadProgress(0)
                    alertError(res.message
                        ? res.message
                        : "An Error occurred uploading images. Kindly try again");
                }
            })
            .catch((e) => {
                setUploadProgress(0)
                setProcessing(false);
                alertExceptionError(e)
            });
    }

    const save = async () => {
        const schema = Joi.object(validationObject);
        try {
            const validation = await schema.validate(details);
            if (validation.error) {
                alertError(validation.error.message);
                productTab && setProductTab(false)
            } else {
                if (images && Array.isArray(images) && images.length < 1) {
                    alertError('Select an image or images for the product')
                    setProductTab(true)
                    return
                }
                setProductTab(false)
                setProcessing(true)
                createStoreProduct(
                    {
                        ...details,
                        isDepletable: details.quantity > 0
                    }
                )
                    .then((res) => {
                        if (res.responseCode === "00") {
                            saveImages(res.payload.id)
                            getStoreProducts(0, 25, storeId)
                        } else {
                            alertError(res.message
                                ? res.message
                                : "An Error Occurred sending the request. Kindly try again");
                        }
                    })
                    .catch((e) => {
                        setProcessing(false);
                        alertExceptionError(e)
                    });
            }
        }
        catch (e) { alertExceptionError(e) }
    }

    return (
        <AppModal
            title={"Create a new product"}
            isOpen={isOpen}
            close={() => {
                close();
            }}>
            <div className="tabs">
                <span className={productTab ? 'tab' : 'tab-active'} onClick={() => setProductTab(false)}>Product Details</span>
                <span className={!productTab ? 'tab' : 'tab-active'} onClick={() => setProductTab(true)}>Image Gallery</span>
            </div>

            <div className="tabs_container" >
                {/*<CSSTransition*/}
                {/*    in={!productTab}*/}
                {/*    unmountOnExit={true}*/}
                {/*    classNames="tabs_anim"*/}
                {/*    timeout={300}*/}
                {/*    onEnter={calcHeight}*/}
                {/*>*/}
                <CreateProduct product_categories={product_categories} setDetails={setDetails} show={productTab} reset={reset} processing={processing} />
                {/*</CSSTransition>*/}
                {/*<CSSTransition*/}
                {/*    in={productTab}*/}
                {/*    unmountOnExit={true}*/}
                {/*    classNames="tabs_anim"*/}
                {/*    timeout={300}*/}
                {/*    onEnter={calcHeight}*/}
                {/*>*/}
                <Upload setImages={setImages} show={productTab} images={images} />
                {/*</CSSTransition>*/}
            </div>
            <div className="mt-5">
                {uploadProgress > 0 && (
                    <ProgressBar
                        animated
                        now={uploadProgress}
                        label={`${uploadProgress}%`}
                    />
                )}
                <Button
                    style={{ width: "100%" }}
                    className="brand-btn"
                    variant="primary"
                    disabled={processing}
                    type="button"
                    onClick={save}
                >
                    {processing && (
                        <Spinner animation="border" variant="light" />
                    )}
                    {!processing && "Create Product"}
                </Button>
            </div>
        </AppModal>
    )
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    location: state.data.location,
    new_product: state.data.new_product,
    product_categories: state.data.product_categories,
    product: state.data.product,

});

export default connect(mapStateToProps, {
    createStoreSettings,
    addProduct,
    getProductCategories,
    clearState,
    getProducts,
    getStoreProducts
})(ProductDetail);
