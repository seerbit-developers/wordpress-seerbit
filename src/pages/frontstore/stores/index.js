/** @format */

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
    getStoreDetails,
    setErrorLog,
    clearState,
    getAllowedCurrencies
} from "actions/postActions";
import { isEmpty } from "lodash";
import { Dropdown } from "primereact/dropdown";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import AppTable from "components/app-table";
import CreateFronstore from "./components/create";
import Copy from "assets/images/svg/copy.svg";
import useWindowSize from "components/useWindowSize";
import TableDropdown from "components/table-actions-dropdown/table-dropdown";
import moment from "moment";
import {getBusinessStores} from "actions/frontStoreActions";
import {handleCopy} from  "utils"
import EditFrontStore from "./components/edit";
import { useTranslation } from "react-i18next";
// import {AppModalCenter} from "../../../components/app-modal";
// import Badge from "../../../components/badge";


const Gap = styled.div`
  position: relative;
  padding-bottom: 2em;
  padding-top: 1em;
`;
const RightComponent = styled.div`
  float: right;
`;

export function FrontStores(props) {
    const [perPage] = useState(25);
    const [expt, setExport] = useState();
    const [createStore, setCreateStore] = useState(false);
    const [editStore, setEditStore] = useState(false);
    const [store, setStore] = useState(null);
    const [manage, setManage] = useState();
    const [storeOrders, setOrders] = useState();
    const [storeProducts, setProducts] = useState();
    const size = useWindowSize()
    const { width } = size;
    const {t} = useTranslation()
    const { store_details } = props;
    const exports = [
        {
            text: t("Export to Excel"),
            value: 1,
            label: 1,
        }
    ]

    useEffect(() => {
        props.getBusinessStores()
        props.getAllowedCurrencies()
    }, []);


    const changePage = (from = 1) => {
        props.getBusinessStores( from, perPage );
    };

    const headers = [
        { label: t("Full Name"), key: "fullName" },
        { label: t("Email"), key: "emailAddress" },
        { label: t("Pocket Account Number"), key: "pocketAccountNumber" },
        { label: t("Phone Number"), key: "phoneNumber" },
        { label: t("Currency"), key: "currency" },
        { label: t("Pocket Balance"), key: "balance" },
        { label: t("Date Added"), key: "createdAt" },
    ];

    const [actions] = React.useState(
        [
            { label: t('View Orders'), value: 'view' },
            { label: t('Products'), value: 'products' },
            { label: t('Manage Store'), value: 'manage' },
            { label: t('Edit Store'), value: 'edit' },
        ]
    );

    const onEditStore = (st)=>{
        setEditStore(true)
        setStore(st)
    }

    const onTableActionChange = (action, data) => {
        if (action.value === 'view') {
            props.history.push(`frontstore/${data.storeId}/orders`)
            // setOrders(data)
        }

        if (action.value === 'products') {
            props.history.push(`frontstore/${data.storeId}/products`)
            // setProducts(props)
        }

        if (action.value === 'manage') {
            props.history.push(`frontstore/${data.storeId}/manage`)
            // setManage(data)
        }
        if (action.value === 'edit') {
            onEditStore(data)
        }
    }

    const downloadTemplate = (option) => {
        if (option.value === 1)
            return (
                <div className="my-1 font-12 font-weight-bold">
                    <CSVLink
                        data={store_details && store_details.payload || []}
                        headers={headers}
                        filename={`${new Date().getTime()}-pocket_customers.csv`}
                    >
                        <span style={{ color: "#333333" }}>{option.text}</span>
                    </CSVLink>
                </div>
            );
    };

    const [fullColumns] = React.useState([
        {
            name: t('Store Name'),
            style: { width: '150px' },
            cell: row => (
                <span className="text-right seerbit-color" title={row && row.storeName && row.storeName} onClick={()=>onEditStore(row)}>
          {row && row.storeName && row.storeName}
        </span>
            )
        },
        {
            name: t('Orders'),
            style: { width: '50px' },
            cell: props => <span className="row p-0 m-0">
        <span>{props && props.orders}</span>
      </span>
        },
        {
            name: t('Revenue'),
            cellStyle: { textAlign: 'left' },
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: props => {
                return (
                    <span className="row p-0 m-0">
            <div className="cut-text">
              <span className="seerbit-color">{`${props.currency} ${props.revenue}`}</span>
            </div>
          </span>
                )
            }
        },
        {
            name: t('Date Created'),
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span>{moment(data.dateCreated).format("DD-MM-yyyy, hh:mm A")}</span>
        },
        {
            name: t('Store Link'),
            style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span className="row p-0 m-0">
        <div className="d-flex align-items-center">
          <img
              src={Copy}
              width="15"
              height="15"
              className="cursor-pointer mr-2"
              onClick={(e) => {
                  handleCopy(data.storeUrl ? data.storeUrl.toLowerCase().replace(/\s/g, "") : '');
              }}
          />
          <a href={data.storeUrl ? data.storeUrl.toLowerCase().replace(/\s/g, "") : ''}
             title={data.storeUrl ? data.storeUrl.toLowerCase().replace(/\s/g, "") : ''} target="_blank">
              {data.storeUrl ? data.storeUrl.toLowerCase().replace(/\s/g, "") : ''}</a>
        </div>
      </span>
        },
        {
            name: t('Status'),
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span className='number position-relative'>
        <span
            className={`round position-absolute ${data.status === "ACTIVE" ? 'success' : 'default'
            } rounded-circle`}
            style={{bottom:0}}
        />
                <span style={{marginLeft:20}}>{data.status.toLowerCase() === 'active' ? 'Online' : 'Offline' }</span>
      </span>
        },
        {
            name: t('Action'),
            style: { width: '50px', paddingRight: '0px', textAlign: 'right' },
            cellStyle: { textAlign: 'right' },
            cell: (props) => (
                <TableDropdown data={actions} onChange={(action) => onTableActionChange(action, props)} />
            )
        },
    ]);

    const [columns] = React.useState([
        {
            name: t('Store Name'),
            style: { width: '200px' },
            cell: row => (
                <span className="text-right" title={row && row.storeName && row.storeName}>
          {row && row.storeName && row.storeName}
        </span>
            )
        },
        {
            name: t('Date Created'),
            style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span>{moment(data.dateCreated).format("DD-MM-yyyy, hh:mm A")}</span>
        },
        {
            name: t('Store Link'),
            style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span className="row p-0 m-0">
        <div className="cut-text-1">
          {data.storeUrl}
        </div>
        <img
            src={Copy}
            width="15"
            height="15"
            className="cursor-pointer"
            onClick={(e) => {
                handleCopy(data.storeUrl);
            }}
        />
      </span>
        },
        {
            name: t('Status'),
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span className='number'>
        <span
            className={`round ${data.status === "ACTIVE" ? 'success' : 'default'
            } rounded-circle`}
        />
                {data.status.toLowerCase()}
      </span>
        },
        {
            name: t('Action'),
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                <TableDropdown data={actions} onChange={(action) => onTableActionChange(action, props)} />
            )
        },
    ]);

    return (
        <>
            {/*<AppModalCenter*/}
            {/*    close={() => setIsOpenProductPitch(false)}*/}
            {/*    isOpen={isOpenProductPitch}*/}
            {/*>*/}
            {/*    <div className='d-flex align-items-center mb-2'>*/}
            {/*        <h4 className='d-inline-block mr-2 mb-0'>{t('Congratulations')} </h4>*/}
            {/*        <span>👍</span>*/}
            {/*    </div>*/}

            {/*    <div className='mb-3'>*/}
            {/*        {t('You have successfully completed all requirements.')}*/}
            {/*        <br/>*/}
            {/*        {t('After a successful review, your account will be activated for Live transactions.')}*/}
            {/*    </div>*/}
            {/*    <Button*/}
            {/*        block*/}
            {/*        className="brand-btn w-200px cursor-pointer"*/}
            {/*        onClick={() => setIsOpenProductPitch(false)}*/}
            {/*    >*/}
            {/*        <span className='mr-2'>👉</span> {' '} {t(' Go to your Dashboard')}*/}
            {/*    </Button>*/}
            {/*</AppModalCenter>*/}
            {isEmpty(manage) && isEmpty(storeProducts) && isEmpty(storeOrders) && (

                    <div className="py-5">
                        <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
                            {t("Front Store")}
                            {/*<span onClick={()=>setIsOpenProductPitch(true)}>😲</span>*/}
                        </div>

                        <Gap>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Button
                                        variant="xdh"
                                        height={"40px"}
                                        className="brand-btn"
                                        style={{ width: "200px" }}
                                        onClick={()=>setCreateStore(true)}
                                    >
                                        {t("Create a store")}
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
                            fixedLayout={false}
                            headerStyle={{ textTransform: 'uppercase' }}
                            loading={props.loading}
                            paginate={store_details && store_details.rowCount ? store_details.rowCount ? Math.ceil(store_details.rowCount / perPage) > 1 : false : false}
                            perPage={perPage}
                            totalPages={
                                store_details && store_details.rowCount ? store_details && store_details.rowCount ? Math.ceil(store_details && store_details.rowCount / perPage) : 0 : 0
                            }
                            changePage={(page) => {
                                changePage(page.activePage);
                            }}
                            currentPage={
                                store_details && store_details.currentPage &&
                                store_details.currentPage ?
                                    parseInt(store_details.currentPage) === 0 ? 1 :
                                        parseInt(store_details.currentPage) === perPage ? 2 :
                                            Math.ceil(parseInt(store_details.currentPage) / perPage) + 1 : 1
                            }
                            data={(store_details && store_details.payload) || []}
                            // onClickRow={viewTransactionData}
                            rowStyle={{ cursor: 'pointer' }}
                        />
                    </div>

            )}

            <CreateFronstore
                isOpen={createStore}
                close={() => setCreateStore(false)}
                reload={props.getBusinessStores}
            />

            <EditFrontStore
                isOpen={editStore}
                store={store}
                close={() => setEditStore(false)}
                reload={props.getBusinessStores}
            />
        </>
    );
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    location: state.data.location,
    // store_details: state.data.store_details,
    store_details: state.frontStore.business_stores_data,
    loading: state.frontStore.loading_business_stores,
});
export default connect(mapStateToProps, {
    getStoreDetails,
    setErrorLog,
    clearState,
    getBusinessStores,
    getAllowedCurrencies
})(FrontStores);
