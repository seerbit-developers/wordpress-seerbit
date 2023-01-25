import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {connect} from "react-redux";
import {fetchPaymentLinkTransactions} from "../../actions/paymentLinkActions";
import PropTypes from 'prop-types'
import useWindowSize from "../../components/useWindowSize";
import Badge from "../../components/badge";
import moment from "moment";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import {formatNumber, getTransactionStatus, getTransactionStatusStyle, getTransactionStatusType} from "../../utils";
import AppTable from "../../components/app-table";
import LeftChevron from "../../assets/images/svg/leftChevron";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

const Transactions = ({ payment_links, fetchPaymentLinkTransactions, link_transactions, loading }) => {
    const { page, id } = useParams();
    const [paymentLink, setPaymentLink ] = useState(null);
    const [isSideMenuModalOpen, setIsSideMenuModalOpen] = useState(false);
    const [refund_success, setRefundSuccess] = useState(false);
    const [transaction_data, setTransactionData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [ perPage, setPerPage ] = useState(25);
    const size = useWindowSize();
    const { t } = useTranslation();
    const history = useHistory();
    const { width, height } = size;
    const getTransactions = (from=0) =>{
        fetchPaymentLinkTransactions(from, perPage, id)
    }

    const changePage = (
        page)=>{
        getTransactions(page)
    }
    useEffect( ()=>{
        if (id && payment_links){
            const pl = payment_links.payload.find( item => item.paymentLinkId === id)
            setPaymentLink(pl)
            getTransactions()
        }
    }, [ id, payment_links ]);

    const viewTransactionData = (data) => {
        setIsSideMenuModalOpen(true)
        setRefundSuccess(false)
        setTransactionData(data);
    }
    const renderTooltipReference = (props) => (
        <Tooltip id="button-tooltip">
            {props.transactionRef}
        </Tooltip>
    );
    const [fullColumns] = React.useState([
        {
            name: 'Customer',
            style: { width: '200px' },
            cell: row => <span className="text-right" title={row && row.customerEmail}>
        {row ? row.customerEmail : 'NA'}
      </span>
        },
        {
            name: 'Reference',
            style: { width: '200px' },
            cell: data => <span className="row p-0 m-0">

        <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipReference(data)}
        ><div
            onClick={(e) => {
                viewTransactionData(data)
            }}
            className="cut-text cursor-pointer text-uppercase"
        >
            <span>{data && data.transactionRef ? data.transactionRef.substr(0, 15) : ""}</span>

          </div>
        </OverlayTrigger>
      </span>
        },
        {
            name: 'Amount',
            cellStyle: { textAlign: 'left' },
            style: { width: '90px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
                return (
                    <div className="text-left" onClick={() => viewTransactionData(props)}>
                        <div>
              <span className="" style={{ fontWeight: "500" }} onClick={() => viewTransactionData(props)}>
                {props.currency} {formatNumber(props.amount)}
              </span>
                        </div>

                    </div>
                )
            }
        },
        {
            name: '',
            style: { width: '100px', paddingRight: '15px' },
            cell: props => {
                const preAuthType = (props.preAuthType && props.preAuthType.replace("_", " ").toLowerCase()) || "";
                const preAuthCapitalized = preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
                return (
                    <div className="text-left" onClick={() => viewTransactionData(props)}>
                        <Badge
                            status={ getTransactionStatusType( props, preAuthCapitalized ) }
                            styles={ getTransactionStatusStyle( props, preAuthCapitalized ) }
                        >
                            {
                                getTransactionStatus(props, preAuthCapitalized)
                            }
                        </Badge>
                    </div>
                )
            }
        },
        {
            name: 'Payment Channel',
            style: { width: '250px', paddingRight: '15px', textAlign: 'left' },
            cell: row => <span className="text-lowercase text-center" onClick={() => viewTransactionData(row)}>{row.channelType ? row.channelType? row.channelType : "" : ""}</span>
        },


        {
            name: 'Date',
            style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <span>{moment(data.newTransactionTime).format("DD-MM-yyyy, hh:mm A")}</span>
        },
    ]);

    const [columns] = React.useState([
        {
            name: 'Amount', cell: props => {
                // const preAuthType = (props.preAuthType && props.preAuthType.replace("_", " ").toLowerCase()) || "";
                return (
                    <div className="d-flex justify-content-start">
            <span className="cut-text font-bold" style={{ flex: 1 }}>
              {props.currency} {formatNumber(props.amount)}
            </span>
                    </div>
                )
            }
        },
        {
            name: '',
            cell: props => {
                const preAuthType = (props.preAuthType && props.preAuthType.replace("_", " ").toLowerCase()) || "";
                const preAuthCapitalized = preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
                return (
                    <div className="text-center" onClick={() => viewTransactionData(props)}>
                        <Badge
                            status={ getTransactionStatusType( props, preAuthCapitalized ) }
                            styles={ getTransactionStatusStyle( props, preAuthCapitalized ) }
                        >
                            {
                                getTransactionStatus(props, preAuthCapitalized)
                            }
                        </Badge>
                    </div>
                )
            }
        },
        {
            name: 'Time Stamp', cell: data => <span>{moment(data.newTransactionTime).format("D-M-yy, HH:mm")}</span>
        },
    ]);

    return (
        <div className="page-container">
            <div className="py-5">
                <div onClick={(e) => {
                    history.goBack()
                }} className="backk pb-5">
                    <LeftChevron /> {t('return to payment links')}
                </div>
                <div className="font-medium font-20 text-black mr-3 d-none d-lg-block">
                    {t('Transactions')} - {paymentLink?.paymentLinkName}
                </div>
            </div>

            {width >= 991 &&
            <AppTable
                columns={fullColumns}
                headerStyle={{ textTransform: 'uppercase' }}
                loading={loading}
                paginate={link_transactions ? link_transactions.rowCount ? Math.ceil(link_transactions.rowCount / perPage) > 1 : false : false}
                perPage={perPage}
                totalPages={link_transactions ? link_transactions.rowCount ? Math.ceil(link_transactions.rowCount / perPage) : 0 : 0}
                changePage={(page) => {
                    setCurrentPage(page.activePage)
                    changePage(page.activePage - 1);
                }}
                currentPage={
                    link_transactions &&
                    link_transactions.currentpage ?
                        parseInt(link_transactions.currentpage) + 1 : 1
                }
                data={
                    link_transactions &&
                    link_transactions.payload ?
                        link_transactions.payload : []
                }
                onClickRow={viewTransactionData}
                rowStyle={{ cursor: 'pointer' }}
            />
            }
            {width < 991 &&
            <AppTable
                columns={columns}
                loading={loading}
                hideHeader
                paginate={link_transactions ? link_transactions.rowCount ? Math.ceil(link_transactions.rowCount / perPage) > 1 : false : false}
                perPage={perPage}
                totalPages={link_transactions ? link_transactions.rowCount ? Math.ceil(link_transactions.rowCount / perPage) : 0 : 0}
                changePage={(page) => {
                    changePage(page.activePage - 1);
                    setCurrentPage(page.activePage)
                }}
                currentPage={
                    link_transactions &&
                    link_transactions.currentpage ?
                        parseInt(link_transactions.currentpage) === 0 ? 1 :
                            parseInt(link_transactions.currentpage) === perPage ? 2 :
                                Math.ceil(parseInt(link_transactions.currentpage) / perPage) + 1 : 1
                }
                data={
                    link_transactions &&
                    link_transactions.payload ?
                        link_transactions.payload : []
                }
                onClickRow={viewTransactionData}
                rowStyle={{ cursor: 'pointer' }}
            />
            }
        </div>
    );
};

Transactions.propTypes = {
    payment_links : PropTypes.any,
    link_transactions : PropTypes.any,
    loading : PropTypes.bool,
    fetchPaymentLinkTransactions : PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
    payment_links: state.paymentLink.payment_links,
    loading: state.paymentLink.loading_payment_link_transactions,
    link_transactions: state.paymentLink.payment_link_transactions,
    business_details: state.data.business_details,
});

export default connect(mapStateToProps, {fetchPaymentLinkTransactions})(Transactions);
