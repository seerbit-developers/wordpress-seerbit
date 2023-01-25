// /** @format */
//
// import React, { useState, useEffect, useRef } from "react";
// import { connect } from "react-redux";
// import {
//     loadStoreProducts,
//     getProducts,
//     setErrorLog,
//     clearState,
// } from "actions/postActions";
// import { isEmpty } from "lodash";
// import { Dropdown } from "primereact/dropdown";
// import { CSVLink } from "react-csv";
// import useOnClickOutside from "utils/onClickOutside";
// import cogoToast from "cogo-toast";
// import Copy from "assets/images/svg/copy.svg";
// import AddProduct from ".AddProduct";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
// import AppTable from "components/app-table";
// import styled from "styled-components";
// import moment from "moment";
// import { Button } from "react-bootstrap";
// import useWindowSize from "components/useWindowSize";
// // import "./css/product.scss";
//
// const NavMenuItem = styled.div`
//   font-size: 1.1em;
//   color: #676767 !important;
// `;
//
// const Gap = styled.div`
//   position: relative;
//   padding-bottom: 2em;
//   padding-top: 1em;
// `;
// const RightComponent = styled.div`
//   float: right;
// `;
//
// const CloseTag = styled.div`
//   font-size: 0.9em;
//   color: #c2c2c2 !important;
//   display: flex;
//   cursor: pointer;
//   .icon {
//     font-size: 1.2em;
//   }
// `;
//
//
// function formatNumber(num) {
//     return Number(num)
//         .toFixed(2)
//         .toString()
//         .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
// }
//
// export function StoreProducts(props) {
//     const [currency, setCurrency] = useState(
//         props.business_details.default_currency
//     );
//     const [perPage, setPerPage] = useState(25);
//     const [isOpen, setOpen] = useState();
//     const [processing, setProcessing] = useState(false);
//     const [expt, setExport] = useState();
//     const [loading, setLoading] = useState(false);
//     const [selectedName, setName] = useState();
//     const [manage, setManage] = useState();
//     const [createProduct, setCreateProduct] = useState(false)
//
//     const size = useWindowSize()
//     const { width, height } = size;
//     const isMobile = width < 1200;
//
//     const { store_products, selectedStore, setProducts } = props;
//     const exports = [
//         {
//             text: "Export to Excel",
//             value: 1,
//             label: 1,
//         }
//     ];
//
//     const ref = useRef();
//     useOnClickOutside(ref, () => setName());
//
//     useEffect(() => {
//         props.loadStoreProducts({ storeId: selectedStore.storeId });
//         props.clearState({ store_products: null })
//     }, []);
//
//     useEffect(() => {
//         setLoading(true);
//         if (!isEmpty(store_products)) setLoading(false);
//         if (!isEmpty(props.error_details)) setLoading(false);
//     }, [store_products, props.error_details]);
//
//
//     useEffect(() => {
//         if (props.error_details && props.location === "store_products") {
//             cogoToast.error(props.error_details.message, {
//                 position: "top-right",
//             });
//         }
//     }, [props.error_details]);
//
//
//     const changePage = (from = 1) => {
//         props.loadStoreProducts({ start: from, size: perPage, storeId: selectedStore.storeId });
//         setProcessing(true);
//     };
//
//     const headers = [
//         { label: 'Product Name', key: 'productName' },
//         { label: 'Product Description', key: 'productDescription' },
//         { label: 'Product Code', key: 'productCode' },
//         { label: 'Product Code Name', key: 'productNameCode' },
//         { label: 'Amount', key: 'amount' },
//         { label: 'Quantity', key: 'quantity' },
//         { label: 'Product Link', key: 'productLink' },
//         { label: 'status', key: 'status' },
//         { label: 'Product Category', key: 'category.name' },
//         { label: 'Category Type', key: 'category.type' },
//         { label: 'Product Category Code', key: 'category.nameCode' },
//     ];
//
//     const downloadTemplate = (option) => {
//         if (option.value === 1)
//             return (
//                 <div className="my-1 font-12 font-weight-bold">
//                     <CSVLink
//                         data={store_products && store_products.payload || []}
//                         headers={headers}
//                         filename={`${new Date().getTime()}-product.csv`}
//                     >
//                         <span style={{ color: "#333333" }}>{option.text}</span>
//                     </CSVLink>
//                 </div>
//             );
//     };
//
//     const handleCopy = (e, props) => {
//         e.preventDefault();
//         cogoToast.success(`Copied Successfully`, { position: "top-right" });
//         const textField = document.createElement("textarea");
//         textField.innerText = props;
//         document.body.appendChild(textField);
//         textField.select();
//         document.execCommand("copy");
//         textField.remove();
//     };
//
//     const [fullColumns] = React.useState([
//         {
//             name: 'Product Thumbnail',
//             style: { width: '200px' },
//             cell: props => (
//                 <img src={
//                     props && props.productImageUrl
//                 } width="60" height="60" />
//             )
//         },
//         {
//             name: 'Product Name',
//             style: { width: '200px' },
//             cell: props => <div className="align-middle">{props.productName}</div>
//         },
//         {
//             name: 'Amount',
//             cellStyle: { textAlign: 'left' },
//             cell: props => <div className="align-middle">{currency} {formatNumber(props.amount)}</div>
//         },
//         {
//             name: 'Revenue',
//             cellStyle: { textAlign: 'left' },
//             cell: props => <div className="align-middle">{currency} {formatNumber(props.revenue)}</div>
//         },
//         {
//             name: 'Sold',
//             cellStyle: { textAlign: 'left' },
//             cell: props => <div className="align-middle">{currency} {formatNumber(props.sold)}</div>
//         },
//         {
//             name: "Stock",
//             cellStyle: { textAlign: 'left' },
//             cell: (props) => <div className="align-middle">{formatNumber(props.stock)}</div>,
//         },
//         {
//             name: 'Date Created',
//             cell: data => <span>{moment(data.dateCreated).format("DD-MM-yyyy, hh:mm A")}</span>
//         },
//         {
//             name: 'Product Link',
//             cell: data => <span className="row p-0 m-0">
//                 <div className="cut-text-1">
//                     {data.productLink}
//                 </div>
//                 <img
//                     src={Copy}
//                     width="15"
//                     height="15"
//                     className="cursor-pointer"
//                     onClick={(e) => {
//                         handleCopy(e, data.productLink);
//                     }}
//                 />
//             </span>
//
//         }
//     ]);
//
//     const [columns] = React.useState([
//         {
//             name: 'Product Name',
//             cell: props => <div className="align-middle">{props.productName}</div>
//         },
//         {
//             name: 'Amount',
//             cellStyle: { textAlign: 'left' },
//             cell: props => <div className="align-middle">{currency} {formatNumber(props.amount)}</div>
//         },
//         {
//             name: 'Sold',
//             cellStyle: { textAlign: 'left' },
//             cell: props => <div className="align-middle">{currency} {formatNumber(props.sold)}</div>
//         },
//         {
//             name: 'Date Created',
//             cell: data => <span>{moment(data.dateCreated).format("DD-MM-yyyy")}</span>
//         },
//         {
//             name: 'Product Link',
//             cell: data => <span className="row p-0 m-0">
//                 <div className="cut-text-1">
//                     {data.productLink}
//                 </div>
//                 <img
//                     src={Copy}
//                     width="15"
//                     height="15"
//                     className="cursor-pointer"
//                     onClick={(e) => {
//                         handleCopy(e, data.productLink);
//                     }}
//                 />
//             </span>
//
//         }
//     ]);
//
//     return (
//         <>
//             {
//                 isOpen && (
//                     <AddProduct
//                         setOpen={setOpen}
//                         storeId={selectedStore.storeId}
//                         createProduct={createProduct}
//                         setCreateProduct={setCreateProduct}
//                         isOpen={isOpen}
//                         isMobile={isMobile}
//                     />
//                 )}
//             {isEmpty(manage) && (
//                 <div className="sbt-order page-container">
//                     <NavMenuItem className="py-5">
//                         <CloseTag onClick={() => setProducts()}>
//                             <FontAwesomeIcon icon={faChevronLeft} className="my-1" />{" "}
//                             <span className="ml-1 mb-2">return to store</span>
//                         </CloseTag>
//                         <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
//                             {selectedStore.storeName}'s Store
//                         </div>
//                         <Gap>
//                             <div classNam="container-fluid">
//                                 <div className="row">
//                                     <div className="col-md-6">
//                                         <Button
//                                             variant="xdh"
//                                             height={"40px"}
//                                             className="brand-btn"
//                                             style={{ width: "200px" }}
//                                             onClick={() => setOpen(true)}
//                                         >
//                                             Add Product
//                                         </Button>
//                                     </div>
//
//                                     <div className="col-md-6">
//                                         <div className="d-none d-lg-block">
//                                             <RightComponent>
//                                                 <span className="font-12 font-light export_data">
//                                                     <Dropdown
//                                                         optionLabel="text"
//                                                         style={{ width: 180 }}
//                                                         value={expt}
//                                                         options={exports}
//                                                         onChange={(e) => {
//                                                             setExport(e.target.value);
//                                                         }}
//                                                         itemTemplate={downloadTemplate}
//                                                         placeholder="Export Data"
//                                                         className="font-12 text-left sbt-border-success"
//                                                         showClear={true}
//                                                     />
//                                                 </span>
//                                             </RightComponent>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Gap>
//                         {width >= 991 &&
//                         <AppTable
//                             columns={fullColumns}
//                             headerStyle={{ textTransform: 'uppercase' }}
//                             loading={loading}
//                             paginate={store_products && store_products.rowCount ? store_products.rowCount ? Math.ceil(store_products.rowCount / perPage) > 1 : false : false}
//                             perPage={perPage}
//                             totalPages={
//                                 store_products && store_products.rowCount ? store_products && store_products.rowCount ? Math.ceil(store_products && store_products.rowCount / perPage) : 0 : 0
//                             }
//                             changePage={(page) => {
//                                 changePage(page.activePage);
//                             }}
//                             currentPage={
//                                 store_products && store_products.page &&
//                                 store_products.page ?
//                                     parseInt(store_products.page) === 0 ? 1 :
//                                         parseInt(store_products.page) === perPage ? 2 :
//                                             Math.ceil(parseInt(store_products.page) / perPage) + 1 : 1
//                             }
//                             data={(store_products && store_products.payload) || []}
//                             // onClickRow={viewTransactionData}
//                             rowStyle={{ cursor: 'pointer' }}
//                         />
//                         }
//
//                         {width < 991 &&
//                         <AppTable
//                             hideHeader
//                             columns={columns}
//                             headerStyle={{ textTransform: 'uppercase' }}
//                             loading={loading}
//                             paginate={store_products && store_products.rowCount ? store_products.rowCount ? Math.ceil(store_products.rowCount / perPage) > 1 : false : false}
//                             perPage={perPage}
//                             totalPages={
//                                 store_products && store_products.rowCount ? store_products && store_products.rowCount ? Math.ceil(store_products && store_products.rowCount / perPage) : 0 : 0
//                             }
//                             changePage={(page) => {
//                                 changePage(page.activePage);
//                             }}
//                             currentPage={
//                                 store_products && store_products.page &&
//                                 store_products.page ?
//                                     parseInt(store_products.page) === 0 ? 1 :
//                                         parseInt(store_products.page) === perPage ? 2 :
//                                             Math.ceil(parseInt(store_products.page) / perPage) + 1 : 1
//                             }
//                             data={(store_products && store_products.payload) || []}
//                             // onClickRow={viewTransactionData}
//                             rowStyle={{ cursor: 'pointer' }}
//                         />
//                         }
//                     </NavMenuItem>
//                 </div>
//             )}
//         </>
//     );
// }
//
// const mapStateToProps = (state) => ({
//     error_details: state.data.error_details,
//     user_details: state.data.user_details,
//     business_details: state.data.business_details,
//     location: state.data.location,
//     store_products: state.data.store_products,
//     store_orders: state.data.store_orders
// });
// export default connect(mapStateToProps, {
//     loadStoreProducts,
//     getProducts,
//     setErrorLog,
//     clearState,
// })(StoreProducts);
