import React from 'react';
import AppTable from "components/app-table";
import useWindowSize from "components/useWindowSize";
import moment from "moment";
import PropTypes from 'prop-types';
import {formatNumber, handleCopy} from "utils";
import Badge from "components/badge";
import StatusIcon from "components/StatusIcon";
import {useTranslation} from "react-i18next";
const TransfersTable = ({ data, loading=false, perPage=10, changePage,currentPage }) => {
    const size = useWindowSize()
    const { t } = useTranslation();
    const { width, height } = size;
    const getRecipient = (data)=>(
        data ?
            data.receiverAccountName ? data.receiverAccountName + `(${data.receiverAccountNumber})`
                : "__" : "__"
    )

    const fullColumns = [
        {
            name: t('Date'),
            cell: props => <span className='font-11'>{props.payout ? moment(props.payout.requestDate).format("DD-MM-yyyy, hh:mm A") : 'NA'}</span>
        },
        {
            name: t('Activity'),
            cell: data => <div>
                <Badge text={data.type === 'DB' ? 'DEBIT' : 'CREDIT'} status={data.type === 'DB' ? 'fail' : 'success'}/>
            </div>
        },
        {
            name: t('Recipient'),
            cell: props => <div>
                {getRecipient(props.payout)}
            </div>
        },
        {
            name: t('Narration'),
            cell: props => <div title={props.description ? props.description : ""} className='cut-text'
                                onClick={()=>handleCopy(props.description ? props.description : "")}
            >
                {props.description ? props.description : "__"}
            </div>
        },
        {
            name: t('Reference'),
            cell: props => <div title={props.payout ? props.payout.transactionReference : ""}
                                className="cut-text"
                                onClick={()=>handleCopy(props.payout ? props.payout.transactionReference : "")}
            >
                {props.payout ? props.payout.transactionReference : "__"}
            </div>
        },
        {
            name: t('Amount'),
            cell: props => <div className="cut-text">
                {props.payout ? props.payout.currency ? props.payout.currency  : ''  : ''} {formatNumber(props.amount)}
            </div>
        },
        {
            name: t('Balance After'),
            cell: props => <div className="cut-text">
                {
                    props.currentBalance ?
                        props.payout ? props.payout.currency ? props.payout.currency + ' ' + formatNumber(props.currentBalance)   : ''  : ''

                    : "__"}
            </div>
        },
        {
            name: t('Status'),
            style: { width: '80px',  textAlign: 'center'},
            cellStyle: { textAlign: 'center', width: '80px'},
            cell: props => <StatusIcon status={props.status ? props.status === 'SUCCESSFUL' ? 'success' : 'fail' : 'fail'}/>
        },

    ];
    const mobileColumns = [
        {
            name: t('Date'),
            cell: props => <span className='font-11'>{props.payout ? moment(props.payout.requestDate).format("DD-MM-yyyy") : 'NA'}</span>
        },
        {
            name: t('Recipient'),
            cell: props => <div>
                {props.payout ? props.payout.receiverAccountName + `(${props.payout.receiverAccountNumber})` : "__"}
            </div>
        },
        {
            name: t('Amount'),
            cell: props => <div className="cut-text">
                {props.payout ? props.payout.currency ? props.payout.currency  : ''  : ''} {formatNumber(props.amount)}
            </div>
        },
        {
            name: t('Balance After'),
            cell: props => <div className="cut-text">
                {
                    props.currentBalance ?
                        props.payout ? props.payout.currency ? props.payout.currency + ' ' + formatNumber(props.currentBalance)   : ''  : ''

                    : "__"}
            </div>
        },
        {
            name: t('Status'),
            style: { width: '80px',  textAlign: 'center'},
            cellStyle: { textAlign: 'center', width: '80px'},
            cell: props => <StatusIcon status={props.status ? props.status === 'SUCCESSFUL' ? 'success' : 'fail' : 'fail'}/>
        },

    ];
    return (

            width >= 991 ?
            <AppTable
                columns={fullColumns}
                fixedLayout={false}
                headerStyle={{textTransform: 'capitalize'}}
                loading={loading}
                paginate={data ? data.rowCount ? Math.ceil(data.rowCount / perPage) > 1 : false : false}
                perPage={perPage}
                totalPages={data ? data.rowCount ? Math.ceil(data.rowCount / perPage) : 0 : 0}
                changePage={(page) => {
                    changePage(page.activePage - 1);
                }}
                currentPage={
                    currentPage
                }
                data={
                    data &&
                    data.payload ?
                        data.payload.accountHistory : []
                }
            />
        :
    <AppTable
        columns={mobileColumns}
        fixedLayout={false}
        headerStyle={{textTransform: 'capitalize'}}
        loading={loading}
        paginate={data ? data.rowCount ? Math.ceil(data.rowCount / perPage) > 1 : false : false}
        perPage={perPage}
        totalPages={data ? data.rowCount ? Math.ceil(data.rowCount / perPage) : 0 : 0}
        changePage={(page) => {
            changePage(page.activePage - 1);
        }}
        currentPage={
            currentPage
        }
        data={
            data &&
            data.payload ?
                data.payload.accountHistory : []
        }
    />

    );
};

TransfersTable.propTypes = {
    data: PropTypes.any,
    loading: PropTypes.bool,
    perPage: PropTypes.number,
    currentPage: PropTypes.number,
    changePage: PropTypes.func.isRequired,
}
export default TransfersTable;
