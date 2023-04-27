/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    addStoreProduct,
    getProducts,
    loadStoreProducts,
    searchProducts,
    setErrorLog,
    clearState,
} from "actions/postActions";
import { isEmpty } from "lodash";
import { DebounceInput } from 'react-debounce-input';
import styled from "styled-components";
import Button from "components/button";
import AppTable from "components/app-table";
import {alertError, alertExceptionError, alertSuccess} from "../../modules/alert";
import {addStoreProducts} from "../../services/frontStoreService";
import {getStoreProducts} from "../../actions/frontStoreActions";
const Wrapper = styled.div`
  background: #fff;
`;

const Gap = styled.div`
  position: relative;
  padding-bottom: 2em;
  padding-top: 1em;
`;


function formatNumber(num) {
    return Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function StoreProduct(props) {
    const [currency, setCurrency] = useState(
        props.business_details.default_currency
    );
    const [perPage, setPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [allSelected, setSelectAll] = useState(false);
    const [id, setId] = useState([]);
    const [productData, setProductData] = useState([]);

    const {
        setOpen,
        storeId,
        products,
        loadStoreProducts,
        getStoreProducts,
        setCreateProduct,
        onNewProduct
    } = props;

    useEffect(() => {
        props.getProducts({ start: 1, size: perPage, status: 'ALL' });
        props.clearState({ products: null })
    }, []);

    useEffect(() => {
        if (products && products.payload) {
                setProductData(products.payload.map(item=>({...item, checked:false})))
        }
    }, [products]);

    const onSelectAll = (checked) => {
        const copyProducts = JSON.parse(JSON.stringify(productData))
        const cp = copyProducts.map(item=>{
                item.checked = checked;
                return {...item}
        })
        setProductData(cp)
        setSelectAll(!checked)
    }

    const changePage = (search_terms, from = 1, status = 'ALL') => {
        if (search_terms) {
            props.searchProducts(from, perPage, search_terms);
        } else props.getProducts({ start: from, size: perPage, status });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        const selectedProducts = productData.filter(item=>item.checked).map(item=>item.id);
        if(!selectedProducts.length){
            alertError('Select at least one product')
            return
        }

        setLoading(true)
        addStoreProducts({
                     productId: selectedProducts,
                     storeId,
                     status: "ACTIVE"
               })
            .then((res) => {
                setLoading(false);
                if (res.responseCode === "00") {
                    alertSuccess(`${selectedProducts.length > 1 ? 'Products ' :'Product '} added to the store`);
                    getStoreProducts(0, 25, storeId)
                    setOpen(false)
                } else {
                    alertError(res.message
                        ? res.message
                        : "An Error Occurred sending the request. Kindly try again");
                }
            })
            .catch((e) => {
                setLoading(false);
                alertExceptionError(e, "frontstore")
            })
    }

    function onSelectProduct(data){
        const copyProducts = JSON.parse(JSON.stringify(productData))
        const cp =copyProducts.map(item=>{
            if(item.id == data.id){
                item.checked = !item.checked;
                return {...item}
            }
            return  item
        })
        setProductData(cp)
    }

    const fullColumns = React.useMemo(()=>
        [
            {
                name: '',
                cell: data => (
                    <div className="d-flex flex-row align-items-center">
                        <input
                            type="checkbox"
                            className=" mr-3"
                            checked={data.checked}
                            onChange={(e) => {
                                onSelectProduct(data)
                            }}
                        />
                        <div style={{ width: "100px" }}>
                            <img src={
                                data &&
                                data.productImages ?
                                    Array.isArray(data.productImages) &&
                                    data.productImages[0] &&
                                    data.productImages[0].productImageUrl :
                                    data.productImageUrl && data.productImageUrl
                            } width="50" height="50" alt="image" />
                        </div>
                    </div>
                )
            },
            {
                name: 'Name',
                cell: data => (
                    <div>
                        {data.productName ? data.productName : "NA"}
                    </div>
                )
            },
            {
                name: 'Amount',
                cell: data => (
                    <div className="align-middle">{currency} {formatNumber(data.amount? data.amount : "NA")}</div>
                )
            },
            {
                name: 'Status',
                cell: data => (
                    <span className='number'>
                                        <span
                                            className={`round ${data.status === true ? 'success' : 'default'
                                            } rounded-circle`}
                                        />
                        {data.status === true ? 'active' : 'inactive'}
                                    </span>
                )
            }

        ], [productData]);


    return (
        <>
            <Wrapper className="sbt-order">
                <form onSubmit={handleSubmit}>
                    <Gap>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <div className="input-wrap sbt-border-success br-normal px-1 py-1">
                                                        <DebounceInput
                                                            minLength={3}
                                                            debounceTimeout={1000}
                                                            className="font-12 px-2 sbt-border-success"
                                                            placeholder='Search products'
                                                            aria-label='Search'
                                                            onChange={(e) => {
                                                                changePage(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Button
                                                            size="sm"
                                                            type='button'
                                                            onClick={() => onNewProduct()}
                                                        >
                                                            New product
                                                        </Button>
                                                    </div>

                                                </div>
                    </Gap>
                    <div>
                        <div className="ml-2 mb-3 d-flex justify-content-between">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="font-14 font-dark">Select All</span>
                                <input
                                    type="checkbox"
                                    className="ml-2"
                                    // checked={allSelected}
                                    onChange={(e) => {
                                        onSelectAll(e.target.checked)
                                    }}
                                />
                            </div>
                            <div>

                                <Button
                                    size="sm"
                                    disabled={loading}
                                    type="submit"
                                    >
                                    Add to store
                                    </Button>
                            </div>
                        </div>
                    </div>
                    <AppTable
                        columns={fullColumns}
                        headerStyle={{ textTransform: 'uppercase' }}
                        loading={loading}
                        perPage={perPage}
                        currentpage={products &&
                        products.currentPage &&
                            parseInt(products.currentPage) + 1}
                        changePage={(page) => {
                            changePage(null,page.activePage);
                        }}
                        data={productData}
                        paginate={products ? products.rowCount ? Math.ceil(products.rowCount / perPage) > 1 : false : false}
                        totalPages={products ? products.rowCount ? Math.ceil(products.rowCount / perPage) : 0 : 0}
                    />
                </form>
            </Wrapper>
        </>
    );
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    location: state.data.location,
    products: state.data.products,
    add_product_store: state.data.add_product_store
});
export default connect(mapStateToProps, {
    addStoreProduct,
    loadStoreProducts,
    searchProducts,
    getProducts,
    setErrorLog,
    clearState,
    getStoreProducts
})(StoreProduct);
