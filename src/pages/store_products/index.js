/** @format */

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
    getProducts,
} from "actions/postActions";
import { isEmpty } from "lodash";
import { Dropdown } from "primereact/dropdown";
import { CSVLink } from "react-csv";
import useOnClickOutside from "utils/onClickOutside";
import Copy from "assets/images/svg/copy.svg";
import AddProduct from "./AddProduct";
import AppTable from "components/app-table";
import styled from "styled-components";
import moment from "moment";
import { Button } from "react-bootstrap";
import useWindowSize from "components/useWindowSize";
import "./css/product.scss";
import { useParams} from "react-router";
import {alertError} from "../../modules/alert";
import LeftChevron from "../../assets/images/svg/leftChevron";
import {Link} from "react-router-dom";
import {getStoreProducts} from "../../actions/frontStoreActions";
import {handleCopy} from "utils";
import ProductDetail from "./ProductDetail";
import {useTranslation} from "react-i18next";
const Gap = styled.div`
  position: relative;
  padding-bottom: 2em;
  padding-top: 1em;
`;
const RightComponent = styled.div`
  float: right;
`;

function formatNumber(num) {
    return Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function StoreProducts(props) {
    const {storeId} = useParams();
    const [currency, setCurrency] = useState(
        props.business_details?.default_currency
    );
    const [perPage, setPerPage] = useState(25);
    const [isOpen, setOpen] = useState(false);
    const [expt, setExport] = useState();
    const [name, setName] = useState();
    const [manage, setManage] = useState();
    const [createProduct, setCreateProduct] = useState(false)
    const [isOpenCreateProduct, setIsOpenCreateProduct] = useState(false)
    const [productTab, setProductTab] = useState(false)
    const { t } = useTranslation();
    const size = useWindowSize()
    const { width, height } = size;
    const isMobile = width < 1200;

    const { store_products, getStoreProducts, products, loading } = props;

    const exports = [
        {
            text: t("Export to Excel"),
            value: 1,
            label: 1,
        }
    ];

    const ref = useRef();
    useOnClickOutside(ref, () => setName());

    useEffect(() => {
        const store = props.store_details.payload.find(item=>item.storeId === storeId)
        if (store){
            setName(store.storeName)
            getStoreProducts(0, perPage, storeId)
        }else{
            alertError('Store not found')
        }

    }, []);

    const changePage = (from = 1) => {
        getStoreProducts(from-1, perPage, storeId)
    };

    const headers = [
        { label: t('Store not found'), key: 'productName' },
        { label: t('Amount'), key: 'amount' },
        { label: t('Stock'), key: 'stock' },
        { label: t('Product Link'), key: 'productLink' },
        { label: t('Sold'), key: 'sold' },
    ];

    const downloadTemplate = (option) => {
        if (option.value === 1)
            return (
                <div className="my-1 font-12 font-weight-bold">
                    <CSVLink
                        data={products && products.payload || []}
                        headers={headers}
                        filename={`${name}-products-${new Date().getTime()}.csv`}
                    >
                        <span style={{ color: "#333333" }}>{option.text}</span>
                    </CSVLink>
                </div>
            );
    };

    const [fullColumns] = React.useState([
        {
            name: t('Product Thumbnail'),
            style: { width: '120px' },
            cell: props => (
                <img src={
                    props && props.productImageUrl
                } width="60" height="60" />
            )
        },
        {
            name: t('Product Name'),
            style: { width: '200px' },
            cell: props => <div className="align-middle">{props.productName}</div>
        },
        {
            name: t('Amount'),
            cellStyle: { textAlign: 'left' },
            cell: props => <div className="align-middle">{currency} {formatNumber(props.amount)}</div>
        },
        {
            name: t('Revenue'),
            cellStyle: { textAlign: 'left' },
            cell: props => <div className="align-middle">{currency} {formatNumber(props.revenue)}</div>
        },
        {
            name: t('Sold'),
            cellStyle: { textAlign: 'left' },
            cell: props => <div className="align-middle">{currency} {formatNumber(props.sold)}</div>
        },
        {
            name: t("Stock"),
            cellStyle: { textAlign: 'left' },
            cell: (props) => <div className="align-middle">{formatNumber(props.stock)}</div>,
        },
        {
            name: t('Date Created'),
            cell: data => <span>{moment(data.dateCreated).format("DD-MM-yyyy, hh:mm A")}</span>
        },
        {
            name: t('Product Link'),
            cell: data => <span className="d-flex align-items-center p-0 m-0">
                <div className="cut-text-1"
                     title={data.productLink ? data.productLink.replace(/\s/g, "") : ''}>
                    <a href={data.productLink ? data.productLink : ''} target="_blank">{data.productLink ? data.productLink.replace(/\s/g, "") : ''}</a>
                </div>
                <img
                    src={Copy}
                    width="15"
                    height="15"
                    className="cursor-pointer"
                    title={data.productLink ? data.productLink.replace(/\s/g, "") : ''}
                    onClick={(e) => {
                        handleCopy(data.productLink ? data.productLink.replace(/\s/g, "") : '');
                    }}
                />
            </span>

        }
    ]);

    const [columns] = React.useState([
        {
            name: t('Product Name'),
            cell: props => <div className="align-middle">{props.productName}</div>
        },
        {
            name: t('Amount'),
            cellStyle: { textAlign: 'left' },
            cell: props => <div className="align-middle">{currency} {formatNumber(props.amount)}</div>
        },
        {
            name: t('Sold'),
            cellStyle: { textAlign: 'left' },
            cell: props => <div className="align-middle">{currency} {formatNumber(props.sold)}</div>
        },
        {
            name: t('Date Created'),
            cell: data => <span>{moment(data.dateCreated).format("DD-MM-yyyy")}</span>
        },
        {
            name: t('Product Link'),
            cell: data => <span className="d-flex align-items-center p-0 m-0">
                <div className="cut-text-1">
                    <a
                        title={data.productLink ? data.productLink.replace(/\s/g, "") : ''}
                        href={data.productLink ? data.productLink : ''} target="_blank">
                        {data.productLink ? data.productLink.replace(/\s/g, "") : ''}
                    </a>
                </div>
                <img
                    src={Copy}
                    width="15"
                    height="15"
                    className="cursor-pointer"
                    onClick={(e) => {
                        handleCopy( data.productLink);
                    }}
                />
            </span>

        }
    ]);

    return (
        <>
                    <AddProduct
                        setOpen={setOpen}
                        storeId={storeId}
                        createProduct={createProduct}
                        setCreateProduct={setCreateProduct}
                        isOpen={isOpen}
                        isMobile={isMobile}
                        onNewProduct={ ()=>{
                            setIsOpenCreateProduct(true)
                            setOpen(false)
                        }}
                    />
            <ProductDetail
                isOpen={isOpenCreateProduct}
                storeId={storeId}
                productTab={productTab}
                setProductTab={setProductTab}
                close={()=>{
                    setIsOpenCreateProduct(false)
                    setOpen(true)
                }}
            />

            {isEmpty(manage) && (
                <div className="py-5">
                        <Link to="/frontstore" className="backk pb-5">
                            <LeftChevron /> {t("return to stores")}
                        </Link>
                        <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
                            {t(`${name}'s Store`)}
                        </div>
                        <Gap>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <Button
                                            variant="xdh"
                                            height={"40px"}
                                            className="brand-btn"
                                            style={{ width: "200px" }}
                                            onClick={() => setOpen(true)}
                                        >
                                            {t("Add Product")}
                                        </Button>
                                    </div>

                                    <div>
                                        <div className="d-none d-lg-block">
                                            <RightComponent>
                                                <span className="font-12 font-light export_data">
                                                    <Dropdown
                                                        optionLabel="text"
                                                        style={{ width: 180 }}
                                                        value={expt}
                                                        options={exports}
                                                        onChange={(e) => {
                                                            setExport(e.target.value);
                                                        }}
                                                        itemTemplate={downloadTemplate}
                                                        placeholder={t("Export Data")}
                                                        className="font-12 text-left sbt-border-success"
                                                        showClear={true}
                                                    />
                                                </span>
                                            </RightComponent>
                                        </div>
                                    </div>
                                </div>

                        </Gap>

                            <AppTable
                                columns={width >= 991 ? fullColumns : columns}
                                headerStyle={{ textTransform: 'uppercase' }}
                                loading={loading}
                                paginate={products && products.rowCount ? products.rowCount ? Math.ceil(products.rowCount / perPage) > 1 : false : false}
                                perPage={perPage}
                                totalPages={
                                    products && products.rowCount ? products && products.rowCount ? Math.ceil(products && products.rowCount / perPage) : 0 : 0
                                }
                                changePage={(page) => {
                                    changePage(page.activePage);
                                }}
                                currentPage={
                                    products &&
                                    parseInt(products.page) + 1
                                }
                                data={(products && products.payload) || []}
                                // onClickRow={viewTransactionData}
                                rowStyle={{ cursor: 'pointer' }}
                            />
                    </div>
            )}
        </>
    );
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    location: state.data.location,
    store_products: state.data.store_products,
    store_details: state.frontStore.business_stores_data,
    products: state.frontStore.store_products,
    loading: state.frontStore.loading_store_products,
});
export default connect(mapStateToProps, {
    getProducts,
    getStoreProducts
})(StoreProducts);
