/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getCustomers, searchCustomers } from "actions/postActions";
import Details from "../../utils/analytics/customer_details";
import { isEmpty } from "lodash";
import AppTable from "components/app-table";
import moment from "moment";
import useWindowSize from "../../components/useWindowSize";
import { useTranslation } from "react-i18next";
import Button from "components/button";


function CustomerPage(props) {
  const [perPage, setPerPage] = useState(25);
  const [show_details, setShowDetails] = useState(false);
  const [customer_data, setCustomerData] = useState();
  const [processing, setProcessing] = useState();
  const [loading, setLoading] = useState(false);
  const size = useWindowSize()
  const { width, height } = size;
  const changePage = (from, range = perPage, type) => {
    setPerPage(range);
    props.getCustomers({ start: from, size: range });
    setProcessing(true);
  };


  useEffect(() => {
    props.getCustomers();
    setProcessing(true);
  }, []);

  useEffect(() => {
    setProcessing(false);
  }, [props.customers, props.location, props.error_details]);

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(props.customers)) setLoading(false);
    if (!isEmpty(props.error_details)) setLoading(false);
  }, [props.customers, props.error_details]);

  const {t} = useTranslation()

  const [fullColumns] = React.useState([
    {
      name: t('Customer Name'),
      style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
        {props.customerName ? props.customerName : "NA"}
      </div>
    },
    {
      name: t('Email'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div>
        {props.customerEmail ? props.customerEmail : "NA"}
      </div>
    },
    {
      name: t('Phone'),
      style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div>
        {props.customerPhone ? props.customerPhone : "NA"}
      </div>
    },

    {
      name: t('Added Date'),
      cellStyle: { textAlign: 'right', padding:0 },
      style: { width: '80px',textAlign: 'right',paddingRight:'15px' },
      cell: props => <span>{moment(props.createdAt).format("DD-MM-yyyy, hh:mm A")}</span>
    }
  ]);

  const [mobileColumns] = React.useState([
    {
      name: t('Customer Name'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
        {props.customerName ? props.customerName : "NA"}
      </div>
    },
  ]);

  const isMobile = width < 991;

  return (
    <>
      {!show_details && (
          <div className="page-container py-5">
            <div className="py-3">
              <div className="d-flex justify-content-between">
            <h3 className="font-medium pb-3 font-20 text-black">
              {t("Customers")}{" "}
            </h3>
                <Button size='sm' >Export</Button>
              </div>
              {
              <AppTable
                  columns={isMobile ? mobileColumns : fullColumns}
                  fixedLayout={false}
                  headerStyle={{textTransform: 'uppercase'}}
                  loading={loading}
                  paginate={props.customers ? props.customers.rowCount ? Math.ceil(props.customers.rowCount / perPage) > 1 : false : false}
                  perPage={perPage}
                  totalPages={props.customers ? props.customers.rowCount ? Math.ceil(props.customers.rowCount / perPage) : 0 : 0}
                  changePage={(page) => {
                    changePage(page.activePage);
                  }}
                  currentPage={
                    props.customers &&
                    props.customers.currentpage ?
                        parseInt(props.customers.currentpage) === 0 ? 1 :
                            parseInt(props.customers.currentpage) === perPage ? 2 :
                                Math.ceil(parseInt(props.customers.currentpage) / perPage) + 1 : 1
                  }
                  data={
                    props.customers &&
                    props.customers.payload ?
                        props.customers.payload : []
                  }
                  // onClickRow={onRowClick}
                  // rowClass='cursor-pointer'
              />
              }
          </div>
        </div>
      )}
      {show_details && (
        <div className="position-absolute">
          <Details
            props={customer_data}
            close={() => setShowDetails(false)}
            business_details={props.business_details}
          />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  customers: state.data.customers,
  business_details: state.data.business_details,
});

export default connect(mapStateToProps, {
  getCustomers,
  searchCustomers,
})(CustomerPage);
