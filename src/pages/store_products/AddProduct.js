import React from "react";
import ProductDetail from "./ProductDetail";
import AppModal from "components/app-modal";
import Products from "./Products";
import "./css/general.scss";

export default function AddProduct(props) {
    const {
        setOpen,
        storeId,
        createProduct,
        setCreateProduct,
        isOpen,
        reload,
        onNewProduct
    } = props;

    return (
        <AppModal
            title={!createProduct ? "Add Products" : "Create Product"}
            isOpen={isOpen}
            close={() => {
                setOpen(false);
                setCreateProduct(false);
            }}>

            <div>

                {
                    !createProduct && <div className="mt-5">
                        <Products storeId={storeId} setCreateProduct={setCreateProduct} setOpen={setOpen} onNewProduct={onNewProduct}/>
                    </div>
                }

                {createProduct && <div className="mt-5">
                    <ProductDetail storeId={storeId} setCreateProduct={setCreateProduct} setOpen={setOpen} reload={reload}/>
                </div>}

            </div>
        </AppModal>
    )
}
