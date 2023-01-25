import React from 'react';
import AppTable from "components/app-table";
import useWindowSize from "components/useWindowSize";
import moment from "moment";
import PropTypes from 'prop-types';
import Badge from "components/badge";
import {useTranslation} from "react-i18next";
import {formatNumber, handleCopy} from "utils";
const Table = ({ data, loading=false, perPage=25,changePage,currentPage }) => {
    const size = useWindowSize()
    const { width, height } = size;
    const { t } = useTranslation();


    const fullColumns = [
        {
            name: t('Date'),
            cell: props => <span className='font-11'>{moment(props.createdAt).format("DD-MM-yyyy, hh:mm A")}</span>
        },
        {
            name: t('First Name'),
            cell: data => data.firstName ? data.firstName : '__'
        },
        {
            name: t('Last Name'),
            cell: data => data.lastName ? data.lastName : '__'
        },
        {
            name: t('Phone'),
            cell: props => <div className="cut-text" title={props.phoneNumber ? props.phoneNumber : ""}
                                onClick={()=>handleCopy(props.phoneNumber ? props.phoneNumber : "")}
            >
                {props.phoneNumber ? props.phoneNumber.substr(0,11) : "__"}
            </div>
        },
        {
            name: t('Email'),
            cell: props => <div className="cut-text" title={props.emailAddress ? props.emailAddress : ""}
                                onClick={()=>handleCopy(props.emailAddress ? props.emailAddress : "")}
            >
                {props.emailAddress ? props.emailAddress.substr(0,11) : "__"}
            </div>
        },
        {
            name: t('Ref'),
            cell: props => props.pocketReferenceId ? props.pocketReferenceId : '__'

        },
        {
            name: t('Account'),
            cell: props => props.pocketAccountNumber ? props.pocketAccountNumber : '__'

        },
        {
            name: t('Funding Link'),
            cell: props => <div className="cut-text">
                {props.fundingLink ? <a href={props.fundingLink ? props.fundingLink : ""} target="_blank"
                   title={props.fundingLink ? props.fundingLink : ""}>
                    {props.fundingLink ? props.fundingLink : "__"}
                </a> : '__'}
            </div>
        },
        {
            name: t('Status'),
            style: { width: 'auto', paddingRight: '15px', textAlign: 'right' },
            cellStyle: { width: '80px', paddingRight: '15px', textAlign: 'right' },
            cell: props => <div>
                {props.status ? props.status : "__"}
            </div>
        },

    ];
    const mobileColumns = [
        {
            name: t('Date'),
            cell: props => <span className='font-11'>{moment(props.createdAt).format("DD-MM-yyyy")}</span>
        },
        {
            name: t('First Name'),
            cell: data => data.firstName ? data.firstName : '__'
        },
        {
            name: t('Ref'),
            cell: props => props.pocketReferenceId ? props.pocketReferenceId : '__'

        },
        {
            name: t('Account'),
            cell: props => props.pocketAccountNumber ? props.pocketAccountNumber : '__'

        },
        {
            name: t('Status'),
            style: { width: 'auto', paddingRight: '15px', textAlign: 'right' },
            cellStyle: { width: '80px', paddingRight: '15px', textAlign: 'right' },
            cell: props => <div>
                {props.status ? props.status : "__"}
            </div>
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
                        data.payload: []
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
                data.payload: []
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
