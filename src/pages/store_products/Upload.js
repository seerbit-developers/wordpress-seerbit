import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { connect } from "react-redux";
import {
    getProducts,
    uploadProductImage,
    createStoreSettings,
    clearState,
} from "actions/postActions";
import "./css/general.scss";
// import ImageGallery from "assets/images/svg/image-gallery.svg";
import { useDropzone } from 'react-dropzone';
import { uploadProductImages } from "../../services/frontStoreService";
import { alertError, alertExceptionError, alertSuccess } from "../../modules/alert";
// import Button from "components/button"
import CloseIcon from "../../assets/images/svg/closeIcon";
import UploadIcon from "../../assets/images/svg/uploadIcon.svg";

export function Upload(props) {
    const {
        setImages,
        show,
        images
    } = props;

    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        open,
        fileRejections
    } = useDropzone({
        accept: "image/*", maxFiles: 5
    })


    useEffect(() => {
        if (acceptedFiles.length === 5) {
            alertError("Maximum of 5 images allowed.");
            return;
        }
        if (images.length === 5) {
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
                        if (images.length > 0) {
                            setImages([...images, ...store])
                        } else {
                            setImages(store)
                        }
                    }
                }

            }
        });
    }, [acceptedFiles]);

    useEffect(() => {
        if (images.length > 0) {
            const totalImages = images.length;
            const remainingImageSpace = 5 - totalImages;
            let preview = [...images];
            for (let i = 0; i < remainingImageSpace; i++) {
                preview.push("")
            }
            setFiles(preview)
        }else{
            setFiles([])
        }
    }, [images])

    const removeImage = (index) => {
        const data = files.filter((val, i) => {
            return i !== index && val !== ""
        })
        setImages(data)
    }

    useEffect(() => {
        fileRejections.map(file => (
            console.error(file)
        ));
    }, [fileRejections]);


    // const onUploadProgress = (progressEvent) => {
    //     let percentCompleted = 0;
    //     percentCompleted = Math.floor(
    //         (progressEvent.loaded * 100) / progressEvent.total
    //     );
    //     setUploadProgress(percentCompleted);
    // };

    return (
        <div className={`anim sbt-general ${show ? 'anim_show' : 'anim_hide'}`}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="d-flex flex-row justify-content-between">
                    <div>
                        <p>Select images for the product</p>
                    </div>
                    {/*    <div>*/}
                    {/*        <Button*/}
                    {/*            style={{ width: "150" }}*/}
                    {/*            className="mr-2"*/}
                    {/*            type="fail"*/}
                    {/*            size="sm"*/}
                    {/*            onClick={() => {*/}
                    {/*                // getProducts()*/}
                    {/*                setProductId()*/}
                    {/*                setUploadImage(false)*/}
                    {/*                setCreateProduct(false)*/}
                    {/*                setProcessing(false)*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            Cancel*/}
                    {/*        </Button>*/}
                    {/*        <Button*/}
                    {/*            style={{ width: "150" }}*/}
                    {/*            type="primary"*/}
                    {/*            disabled={processing}*/}
                    {/*            size="sm"*/}
                    {/*        >*/}
                    {/*            {processing && (*/}
                    {/*                "Uploading..."*/}
                    {/*            )}*/}
                    {/*            {!processing && "Add Images"}*/}
                    {/*        </Button>*/}
                    {/*    </div>*/}
                </div>
                {uploadProgress < 1 && (
                    <div className="mb-2" {...getRootProps({ className: "dropzone" })} >
                        <input {...getInputProps()} />
                        <div className="mb-5 mt-5">
                            <div className="empty-upload cursor-pointer">
                                <div className="d-flex justify-content-center pt-4">
                                    <div className="text-center">
                                        <img src={UploadIcon} alt="empty" width="50" height="50" />
                                        <div className="instruc mt-3"> Drag and Drop or select images</div>
                                        <div className="instruct-1 my-1"> Maximum 5 of images</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="">
                    {uploadProgress > 0 && (
                        <ProgressBar
                            animated
                            now={uploadProgress}
                            label={`${uploadProgress}%`}
                        />
                    )}
                </div>
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
                                // <div>
                                //     <Button size="xs" style={{width: 100}} type="fail" onClick={() => removeImage(id)}
                                //             buttonType="button">Remove</Button>
                                // </div>
                            }
                        </div>
                    )}
                </div>


            </form>
        </div>
    )
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    location: state.data.location,
    create_store_settings: state.data.create_store_settings,
    product: state.data.product
});

export default connect(mapStateToProps, {
    getProducts,
    uploadProductImage,
    createStoreSettings,
    clearState,
})(Upload);
