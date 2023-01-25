import React from 'react';
import AppTable from "components/app-table";
import useWindowSize from "components/useWindowSize";
import moment from "moment";
import PropTypes from 'prop-types';
import {formatNumber} from "utils";
import Badge from "components/badge";
import StatusIcon from "components/StatusIcon";
import {handleCopy} from "utils";
import {useTranslation} from "react-i18next";
const Table = ({ data, loading=false, perPage=25,changePage,currentPage }) => {
    const size = useWindowSize()
    const { width, height } = size;
    const { t } = useTranslation();

    const fullColumns = [
        {
            name: t('Date'),
            style: { width: '100px',textAlign: 'left' },
            cell: props => <span className='font-11'>{props.payout ? moment(props.payout.requestDate).format("DD-MM-yyyy, hh:mm A") : 'NA'}</span>
        },
        {
            name: t('Activity'),
            style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
            cell: data => <div>
                <Badge text={data.type === 'DB' ? 'DEBIT' : 'CREDIT'} status={data.type === 'DB' ? 'fail' : 'success'}/>
            </div>
        },
        {
            name: t('Narration'),
            style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
            cell: props => <div title={props.description ? props.description : ""} className="cut-text"
                                onClick={()=>handleCopy(props.description ? props.description : "")}
            >
                {props.description ? props.description : "__"}
            </div>
        },
        {
            name: t('Reference'),
            style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
            cell: props => <div title={props.payout ? props.payout.transactionReference : ""}
                                className="cut-text"
                                onClick={()=>handleCopy(props.payout ? props.payout.transactionReference : "")}
            >
                {props.payout ? props.payout.transactionReference : "__"}
            </div>
        },
        {
            name: t('Amount'),
            style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
            cell: props => <div className="cut-text">
                {props.payout ? props.payout.currency ? props.payout.currency  : ''  : ''} {formatNumber(props.amount)}
            </div>
        },
        {
            name: t('Charge'),
            style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
            cell: props => <div className="cut-text">
                {props.payout ? props.payout.currency ? props.payout.currency  : ''  : ''} {formatNumber(props.charge)}
            </div>
        },
        {
            name: t('Balance After'),
            style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
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
            style: { width: '100px',textAlign: 'left' },
            cell: props => <span className='font-11'>{props.payout ? moment(props.payout.requestDate).format("DD-MM-yyyy, hh:mm A") : 'NA'}</span>
        },
        {
            name: t('Amount'),
            style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
            cell: props => <div className="cut-text">
                {props.payout ? props.payout.currency ? props.payout.currency  : ''  : ''} {formatNumber(props.amount)}
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
            <AppTable
                columns={width >= 991 ? fullColumns: mobileColumns}
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

Table.propTypes = {
    data: PropTypes.any,
    loading: PropTypes.bool,
    perPage: PropTypes.number,
    currentPage: PropTypes.number,
    changePage: PropTypes.func.isRequired,
}
export default Table;
