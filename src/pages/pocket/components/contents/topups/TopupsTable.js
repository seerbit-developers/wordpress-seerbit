import React from 'react';
import AppTable from "components/app-table";
import useWindowSize from "components/useWindowSize";
import moment from "moment";
import PropTypes from 'prop-types';
import {formatNumber} from "utils";
import {useTranslation} from "react-i18next";
const TopupsTable = ({ data, loading=false, perPage=25,changePage,currentPage }) => {
    const size = useWindowSize()
    const { t } = useTranslation();

    const { width, height } = size;

    const fullColumns = [
        {
            name: t('Date'),
            style: { width: '100px',textAlign: 'left',paddingLeft:'15px' },
            cell: props => <span>{moment(props.created_at).format("DD-MM-yyyy, hh:mm A")}</span>
        },
        {
            name: t('Activity'),
            style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
            cell: props => <div className="cut-text">
                {props.status ? props.status : "NA"}
            </div>
        },
        {
            name: t('Narration'),
            style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
            cell: props => <div className="cut-text">
                {props.status ? props.status : "NA"}
            </div>
        },
        {
            name: t('Amount'),
            style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
            cell: props => <div className="cut-text">
                {props.currency} {formatNumber(props.amount)}
            </div>
        },
        {
            name: t('Balance After'),
            style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
            cell: props => <div className="cut-text">
                {props.status ? props.status : "NA"}
            </div>
        },
        {
            name: t('Status'),
            style: { width: '80px', paddingRight: '15px'},
            cell: props => <div className="cut-text">
                {props.status ? props.status : "NA"}
            </div>
        },

    ];
    return (

            width >= 991 ?
            <AppTable
                columns={fullColumns}
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
        columns={fullColumns}
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

TopupsTable.propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool,
}
export default TopupsTable;
