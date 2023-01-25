import React, {useEffect, useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Dropdown, DropdownButton, FormControl, InputGroup, Spinner} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Button from "components/button";
import {createInvoice, generateInvoice, getInvoices,} from "actions/invoiceActions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { getCountries } from "actions/postActions";
import {connect} from "react-redux";
import ItemFields from "./ItemFields";
import moment from "moment";
import {faSpinner, faSync} from "@fortawesome/free-solid-svg-icons";
import "./invoice.scss";
import {alertError, alertExceptionError, alertSuccess} from "modules/alert";
import {formatNumber} from "utils";
import CreateCustomer from "../customers/CreateCustomer";
import { getCustomers } from "actions/invoiceActions";
import {makeInvoice} from "services/invoiceService";
import Select, {components} from "react-select";

const CreateInvoice = ({
  business_details,
                         getInvoices,
  generateInvoice,
  invoice_number,
  generating,
  customers,
    getCountries,
                         countries,
                         getCustomers,
                         loading_invoice_customers
}) => {
  const [totalFields, setTotalFields] = useState([0]);
  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [discountUnit, setUnit] = useState("%");
  const [customer_id, setCustomerId] = useState("");
  const [values, setValues] = useState(null);
  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [busy, setBusy] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    generateInvoice();
    getCustomers();
    if (!countries) {
      getCountries()
    }
    else if (countries && countries.payload && Array.isArray(countries.payload) && countries.payload.length < 1)
    {
      getCountries()
    }
  }, []);

  useEffect(() => {
    if (items.length > 0 || discount !== 0) {
      calculateTotal();
    }
  }, [items, discount, discountUnit]);

  useEffect(() => {
    if (invoice_number) {
      setValues({ ...values, invoiceNo: invoice_number?.invoiceNumber });
    }
  }, [invoice_number]);

  const customerList = useMemo(() => {
    if (customers?.hasOwnProperty('data')) {
      return customers?.data?.map((customer) => ({
        label: `${customer.contactName}`,
        value: customer.id,
      }));
    }
  }, [customers]);

  const itemValue = useMemo(() => {
    return items.filter((item) => item.rate && item.quantity);
  }, [items]);

  const vatValues = useMemo(() => {
    return items.filter((item) => item.tax);
  }, [items]);

  const calculateTotal = () => {
    let totalSub = itemValue.reduce(
      (acc, item) => acc + Number(item.rate * item.quantity),
      0
    );
    setSubTotal(totalSub);
    if (discountUnit === "%") {
      let calculateDiscount = totalSub/100 * discount;
      let vatValue = calculateVATRate(totalSub - calculateDiscount);
      setVat(vatValue);
      setTotal(totalSub + vatValue - calculateDiscount);
    } else {
      let vatValue = totalSub - discount;
      let total = subTotal - discount
      setVat(vatValue);
      setTotal(total);
    }
  };

  const calculateVATRate = (sub) => {
    let totalVatInPercentage = vatValues.reduce(
      (acc, item) => acc + Number(item.tax),
      0
    );
    let cal = totalVatInPercentage * 0.01;
    return sub * cal;
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const keys = Object.keys(items);

    if (keys.includes(JSON.stringify(index))) {
      if (name === "tax" && value > 100) return;
      items[index][name] = name === "itemName" ? value : Number(value);
      let amount = Number(items[index].rate) * Number(items[index].quantity);
      items[index].amount = amount ? amount : 0;
    } else {
      items[index] = {
        ...items[index],
        [name]: name === "itemName" ? value : Number(value),
        amount: 0,
      };
    }
    setItems([...items]);
  };

  const handleDiscount = (e) => {
    if (
      e.target.value === undefined ||
      e.target.value === NaN ||
      e.target.value === ""
    ) {
      setDiscount(0);
    } else if (discountUnit === "%") {
      if (e.target.value <= 100) {
        setDiscount(parseInt(e.target.value));
      }
    } else {
      if (e.target.value <= subTotal) {
        setDiscount(e.target.value);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if selected date is less than current date
    const dueDate = values?.dueDate;

    if (!customer_id) {
      alertError("Please select a customer");
      return;
    }

    if (!dueDate) {
      alertError("Due date is required");
      return;
    }

    const data = {
      ...values,
      totalAmount: Number(total.toFixed(2)),
      subTotal: Number(subTotal.toFixed(2)),
      discount: discountUnit === "%" ? subTotal * discount * 0.01 : discount,
      vat: Number(vat.toFixed(2)),
      invoiceItems: itemValue,
      currency: business_details?.default_currency,
      externalBusiness_id: business_details?.number,
      dueDate: moment(dueDate).format("YYYY-MM-DD") || "",
    };

    setBusy(true);
    makeInvoice(customer_id, data).then(res=>{
      setBusy(false);
      if (res.responseCode == '201'){
        alertSuccess("Invoice created");
        setValues(null);
        setCustomerId("");
        setTotalFields([])
        setItems([]);
        getInvoices();
        generateInvoice();
        setTotalFields([0])
      } else {
        alertError(data.message
            ? data.message || data.message
            : "An error occurred while creating customer. Kindly try again");
      }
    }).catch(e=>{
      setBusy(false);
      alertExceptionError(e)
    })
  };

  const onClickCreate = () => {
    setOpenCreateModel(true);
  }

  const onCloseCreate = () => {
    setOpenCreateModel(false);
  }

  const onRemoveRow = (i) => {
    if (totalFields.length > 1){
      const itemsCopy = JSON.parse(JSON.stringify(items));
      const fieldsCopy = JSON.parse(JSON.stringify(totalFields));
      if(items.indexOf(i) > -1){
        itemsCopy.splice(i, 1);
      }
      if(totalFields.indexOf(i) > -1){
        fieldsCopy.splice(i, 1);
      }
      setTotalFields(fieldsCopy)
      setItems(itemsCopy);
    }
  }

  const addField = () => {
    const itemsCopy = JSON.parse(JSON.stringify(totalFields));
    itemsCopy.push(itemsCopy.length)
    setTotalFields(itemsCopy)
  }
  const SelectMenuButton = (props) => {
    return (
        <components.MenuList  {...props} style={{backgroundColor:'white'}}>
          {props.children}
          <Button size='md' full type='button' onClick={onClickCreate}>{t('Create a customer')}</Button>
        </components.MenuList >
    ) }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className=" create--invoice"
      >
        <div className="--content-full">
          <div className=" header">
            <h4>{t("Create Invoice")}</h4>
          </div>
        </div>
        <CreateCustomer
            isOpen={openCreateModel}
            close={onCloseCreate}
            countries={countries?.payload}
        />
        <div className="col-lg-9 m-0 p-0">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="d-flex">
              <div className="">
                <div className="col-12 m-0 p-0">
                  <div className="row">
                    <div className="col-lg-23 col-md-12 mb-3">
                      <Select
                          options={customerList || []}
                          isSearchable
                          placeholder='Select a customer'
                          isLoading={loading_invoice_customers}
                          loadingMessage={'Fetching your customers'}
                          noOptionsMessage={'You are yet to create a customer'}
                          components={{ MenuList: SelectMenuButton }}
                          onChange={e=>setCustomerId(e.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 m-0 p-0">
                  <div className="row">
                    <div className="col-lg-6 col-md-12 mb-3">
                      <label className="field--title">
                        {t("Invoice Number")}#
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          name="invoiceNo"
                          className="form-control"
                          value={invoice_number?.invoiceNumber}
                          disabled
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => generateInvoice()}
                          >
                            {generating ? (
                              <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                              <FontAwesomeIcon icon={faSync} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <div className="form-group">
                        <label className="field--title">
                          {t("Order Number")}#
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="orderNo"
                          value={ values?.orderNo}
                          onChange={(e) =>
                            setValues({ ...values, orderNo: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <div className="form-group">
                        <label className="field--title">{t("Due date")}</label>
                        <input type="datetime-local"
                               className="d-block form-control"
                               onChange={(e) =>
                                   setValues({
                                     ...values,
                                     dueDate: moment(e.value).format("YYYY-MM-DD HH:mm"),
                                   })
                               }
                        />
                        {/*<Calendar id="datetemplate" value={values?.dueDate}*/}
                        {/*          className="d-block"*/}
                        {/*          style={{width:'100%'}}*/}
                        {/*          minDate={new Date()}*/}
                        {/*          onChange={(e) =>*/}
                        {/*              setValues({*/}
                        {/*                ...values,*/}
                        {/*                dueDate: moment(e.value).format("YYYY-MM-DD HH:mm"),*/}
                        {/*              })*/}
                        {/*          }/>*/}
                        {/*<DatePicker />*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-3 d-lg-block d-none overflow-auto" style={{width:"626.11px"}}>
                <div className="sub--total p-4 d-flex justify-content-between">
                  <div className="sub--title">
                    <div className="mb-3">{t("Sub Total")}</div>
                    <div className="mb-3 d-flex flex-row align-items-center">
                      <div>{t("Discount")}</div>
                      <div className="mx-3 mr-5 pr-5">
                        {" "}
                        <InputGroup size="sm">
                          <FormControl
                            aria-label="Text input with dropdown button"
                            name="discount"
                            type="number"
                            value={discount}
                            className='invoice-total-input'
                            onChange={(e) => handleDiscount(e)}
                            disabled={subTotal === 0}
                          />

                          <DropdownButton
                            variant="outline-secondary"
                            title={discountUnit}
                            id="invoice-rate-type"
                            align="left-end"
                            size="sm"
                          >
                            <Dropdown.Item onClick={() => setUnit("%")}>
                              %
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setUnit("Flat")}>
                              {t("Flat Fee")}
                            </Dropdown.Item>
                          </DropdownButton>
                        </InputGroup>
                      </div>
                    </div>
                    <div className="mb-3">
                      {t("VAT")}({t("Rate")})
                    </div>
                    <div>{t("Total")}</div>
                  </div>
                  <div className="sbt--value">
                    <div className="mb-3">
                      {formatNumber(subTotal)}
                    </div>
                    <div
                      className="mb-3 d-flex align-items-center justify-content-end"
                      style={{ height: 30 }}
                    >
                      {discountUnit === "%"
                        ? formatNumber(subTotal * discount * 0.01)
                        : formatNumber(discount)}
                    </div>
                    <div className="mb-3">{formatNumber(vat)}</div>
                    <div>{formatNumber(total)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 px-3 d-md-block d-lg-none">
              <div className="d-flex sub--total justify-content-between">
                <div className="sub--title">
                  <div className="mb-3">{t("Sub Total")}</div>
                  <div className="mb-3 d-flex flex-row align-items-center">
                    <div>{t("Discount")}</div>
                    <div className="mx-3 mr-5 pr-5">
                      {" "}
                      <InputGroup size="sm">
                        <FormControl
                          name="discount"
                          type="number"
                          min={0}
                          value={discount}
                          onChange={(e) => handleDiscount(e)}
                          disabled={subTotal === 0}
                        />

                        <DropdownButton
                          variant="outline-secondary"
                          title={discountUnit}
                          id="input-group-dropdown-2"
                          align="end"
                          size="sm"
                        >
                          <Dropdown.Item onClick={() => setUnit("%")}>
                            %
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => setUnit("Flat")}>
                            {t("Flat Fee")}
                          </Dropdown.Item>
                        </DropdownButton>
                      </InputGroup>
                    </div>
                  </div>
                  <div className="mb-3">
                    {t("VAT")}({t("Rate")})
                  </div>
                  <div>{t("Total")}</div>
                </div>
                <div className="sbt--value">
                  <div className="mb-3">
                    {formatNumber(subTotal)}
                  </div>
                  <div
                    className="mb-3 d-flex align-items-center justify-content-end"
                    style={{ height: 30 }}
                  >
                    {discountUnit === "%"
                      ? formatNumber(subTotal * discount * 0.01)
                      : formatNumber(discount)}
                  </div>
                  <div className="mb-3">{vat}</div>
                  <div>{formatNumber(total)}</div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 p-0 mt-5">
              <div className="d-flex flex-row justify-content-between justify-content-start">
                <div className="col-3 m-0 p-0">{t("Item Name")}</div>
                <div className="col-2">{t("Quantity")}</div>
                <div className="col-1">{t("Rate")}</div>
                <div className="col-2">{t("Tax")}%</div>
                <div className="col-2">{t("Amount")}</div>
                <div className="col-1"></div>
              </div>
              <hr />
              <div className="my-3">
                {
                  totalFields.map( (item, index) => (
                  <div key={index}>
                    <ItemFields
                      index={index}
                      handleChange={handleChange}
                      items={items}
                      onRemoveRow={onRemoveRow}
                    />
                  </div>
                ))}
              </div>
              <span
                className="add--field"
                onClick={() => addField()}
              >
                {t("Add another item")}
              </span>
              <div className="d-flex justify-content-end mt-5 pt-5">
                <Button size="sm">
                  {busy ? (
                    <Spinner animation="border" variant="light" size='sm'/>
                  ) : (
                    <>{t("Create and Send Invoice")}</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

CreateInvoice.propTypes = {};

const mapStateToProps = (state) => ({
  business_details: state.data.business_details,
  generating: state.invoice.generating,
  invoice_number: state.invoice.invoice_number,
  loading_invoice_customers: state.invoice.loading_invoice_customers,
  countries: state.data.countries,
  customers: state.invoice.invoice_customers,
});

export default connect(mapStateToProps, {
  createInvoice,
  generateInvoice,
  getCountries,
  getCustomers,
  getInvoices
})(CreateInvoice);
