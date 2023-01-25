import React, { useState, useEffect } from "react";
import {
    generateCoupon,
    createCoupon,
    getCoupon,
    clearState,
    loadAllStoreDetails,
} from "actions/postActions";
import Table from 'utils/analytics/table';
import Back from "assets/images/svg/back-left.svg";
import { useForm, Controller } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { Spinner } from "react-bootstrap";
import moment from "moment";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import Select from 'react-select';
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import Button from "components/button";
import "./css/general.scss";
import {useTranslation} from "react-i18next";
import {alertError, alertSuccess} from "../../modules/alert";

const customStyles = {
    control: styles => ({
        ...styles,
        background: "#FFFFFF",
        boxSizing: "border-box",
        borderRadius: 3,
        height: "calc(1.5em + 0.75rem + 2px)",
        ":hover": {
            border: "1px solid #389fee",
        },
        ":active": {
            border: "1px solid transparent",
        },
        ":focus": {
            border: "1px solid transparent",
        },
    }),
    valueContainer: styles => ({
        ...styles,
        outline: "unset",
        ":focus": {
            border: "1px solid red",
        },
    }),
}


export function Discounts(props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(25);
    const [processing, setProcessing] = useState(false);
    const { handleSubmit, errors, control } = useForm();
    const [showCoupon, setShowCoupon] = useState(false);
    const [coupon, setCoupon] = useState();
    const [value, setValue] = useState()
    const [addEndDate, setAddEndDate] = useState(false)
    const [singleUse, setSingleUse] = useState(false)
    const [frequency, setFrequency] = useState(false)
    const [couponType] = useState([
        { id: 0, value: "PERCENTAGE", label: t("Percentage"), name: "couponType" },
        { id: 1, value: "FIXED", label: t("Fixed"), name: "couponType" },
    ])

    const {
        currency,
        createCoupon,
        storeId,
        getCoupon,
        location,
        error_details,
        create_coupon,
        clearState,
        loadAllStoreDetails,
        generate_coupon,
        generateCoupon,
        get_coupon,
        close
    } = props;

    const onRowClick = () => { }

    const handleSelected = (selected) => {
        setValue({ ...value, [selected.name]: selected.value });
    }

    useEffect(() => {
        getCoupon({
            storeId,
            size: perPage,
            start: 1,
        })
        generateCoupon({ storeId })
    }, [])

    const submitForm = (e) => {
        setProcessing(true)
        createCoupon({
            data: {
                ...value,
                couponCode: coupon,
                storeId: storeId
            },
            location: "create_coupon"
        })
    }

    useEffect(() => {
        setLoading(true);
        if (!isEmpty(get_coupon)) setLoading(false);
        if (!isEmpty(error_details)) setLoading(false);
    }, [get_coupon, error_details]);

    const getRandomString = (length) => {
        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        setCoupon(result);
    }

    const handleValue = (e) => {
        if (e.target.name === "endDate") {
            setValue({ ...value, endDate: moment(e.target.value).format("yyyy-MM-DD") });
        } else if (e.target.name === "startDate") {
            setValue({ ...value, startDate: moment(e.target.value).format("yyyy-MM-DD") });
        } else {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    };

    useEffect(() => {
        if (create_coupon && location === "create_coupon") {
            setProcessing(false);
            alertSuccess("Coupon was successfully created");
            getCoupon({
                storeId,
                size: perPage,
                start: 1,
            })
            setShowCoupon(false)
            loadAllStoreDetails({ storeId })
            clearState({ name: "create_coupon", value: null });
            clearState({ name: "generate_coupon", value: null });
            setCoupon(null)
            close();
        }
    }, [location]);

    useEffect(() => {
        if (generate_coupon) {
            setCoupon(generate_coupon.couponCode)
            clearState({ name: "generate_coupon", value: null });
        }
    }, [generate_coupon]);

    useEffect(() => {
        if (error_details && error_details.error_source === "create_coupon") {
            setProcessing(false);
            alertError(error_details.message || error_details.responseMessage);
        }
        if (error_details && error_details.error_source === "generate_coupon") {
            setProcessing(false);
            alertError(error_details.message || error_details.responseMessage);
        }
        clearState({ name: "error_details", value: null });
    }, [error_details]);

    const changePage = (from = 1) => {
        getCoupon({
            storeId,
            start: from,
            size: perPage
        })
    };

    const setRange = (page = perPage) => {
        getCoupon({
            storeId,
            size: page,
            start: 1,
        })
    };

    return (
        <div className="sbt-general">
            {!showCoupon && (
                <div>
                    <div className="my-3 d-flex justify-content-end" >
                        <Button
                            size="sm"
                            onClick={() => setShowCoupon(true)}
                        >
                            {t('Create Coupon')}
                        </Button>
                    </div>
                    <Table
                        loading={loading}
                        data={get_coupon && get_coupon.payload || []}
                        totalRecords={get_coupon && get_coupon.rowCount || 0}
                        currentpage={get_coupon && get_coupon.currentPage || "0"}
                        perPage={perPage}

                        changePage={changePage}
                        setRange={(data) => {
                            setRange(data);
                            setPerPage(data);
                        }}

                        header={[
                            {
                                name: t('Code'),
                                pointer: "couponCode",
                            },
                            {
                                name: t('Type'),
                                pointer: '',
                                func: (props) => (
                                    <span>{(props && props.couponType) ? t(props.couponType) : 'NA'}</span>
                                ),
                            },
                            {
                                name: t('Value'),
                                pointer: '',
                                func: (props) => (
                                    <span>{props && props.couponType === "PERCENTAGE" ? `${props.couponValue}%` : `${currency} ${props.couponValue}`}</span>
                                ),
                            },
                            {
                                name: t('Start Date'),
                                pointer: '',
                                func: (props) => (
                                    <span>{`${props.startDate ? moment(props.startDate).format('DD-MM-yy') : '-'}`}</span>
                                ),
                            },
                            {
                                name: t('End Date'),
                                pointer: '',
                                func: (props) => (
                                    <div>{props && props.endDate ? moment(props.endDate).format('DD-MM-yy') : "-"}</div>
                                ),
                            }

                        ]}
                        onRowClick={onRowClick}
                    />
                </div>
            )}

            {showCoupon && (
                <div>
                    <div className="d-flex justify-content-start align-items-center back cursor-pointer mt-5 mb-5" onClick={() => setShowCoupon(false)}>
                        <img src={Back} className="font-20 close mr-2" alt="icon" />
                        {t('back')}
                    </div>
                    <form onSubmit={handleSubmit(submitForm)}>
                        <div className="sbt-sub-title mb-4">
                            <div className="d-flex justify-content-between">
                                {t('Discount Coupons')}
                                <Button
                                    size="sm"
                                    onClick={() => generateCoupon({ storeId })}
                                >
                                    {t('Generate Coupon')}
                                </Button>
                            </div>
                        </div>
                        <div className="form-group mh-40 mb-3">
                            <label className="font-12 m-0">{t('Coupon Code')}</label>
                            <input
                                type="text"
                                name="couponCode"
                                className="form-control m-0"
                                placeholder={t('Coupon Code')}
                                value={coupon}
                                disabled
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="form-group mh-40 mb-3" style={{ width: "30%" }}>
                                <label className="font-12 m-0">{t('Coupon Type')}</label>

                                <Controller
                                    name="couponType"
                                    defaultValue={""}
                                    className="basic-single"
                                    render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                        <Select
                                            options={couponType}
                                            styles={customStyles}
                                            value={couponType.find(c => c.value === value)}
                                            onChange={e => {
                                                handleSelected(e)
                                                onChange(e.value.toUpperCase());
                                            }}
                                            isSearchable={false}
                                            isLoading={!isEmpty(couponType) ? false : true}
                                        />
                                    )}
                                    control={control}
                                    rules={{ required: true }}
                                />
                                {errors && errors.couponType.type === "required" && (
                                    <span className="text-danger font-12">{t('Coupon type is required')}</span>
                                )}
                            </div>
                            <div className="form-group mh-40 mb-3" style={{ width: "65%" }}>
                                <label className="font-12 m-0">{t('Value')}</label>
                                <input
                                    type="number"
                                    name="couponValue"
                                    className="form-control m-0"
                                    placeholder="value"
                                    pattern={value && value.couponType === "PERCENTAGE" ? "^\d*(\.\d{0,2})?$" : ""}
                                    step={value && value.couponType === "PERCENTAGE" ? ".01" : ""}
                                    min={value && value.couponType === "PERCENTAGE" ? "0" : ""}
                                    max={value && value.couponType === "PERCENTAGE" ? "100.00" : ""}
                                    value={value && value.couponValue}
                                    onChange={(e) => handleValue(e)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label className="font-12 m-0">{t('Start Date')}</label>
                            <div>
                                <Calendar
                                    name="startDate"
                                    value={value && value.startDate}
                                    onChange={(e) => handleValue(e)}
                                    style={{ width: "100%" }}>
                                </Calendar>
                            </div>
                        </div>
                        {addEndDate && <div className="form-group mb-3">
                            <label className="font-12 m-0">{t('End Date')}</label>
                            <div>
                                <Calendar
                                    name="endDate"
                                    value={value && value.endDate}
                                    onChange={(e) => handleValue(e)}
                                    style={{ width: "100%" }}>
                                </Calendar>
                            </div>
                        </div>}
                        {singleUse && <div className="form-group mh-40 mb-3">
                            <label className="font-12 m-0">{t('Redeemer Email')}</label>
                            <input
                                type="email"
                                name="redeemerEmail"
                                className="form-control m-0"
                                placeholder="email"
                                value={value && value.redeemerEmail}
                                onChange={(e) => handleValue(e)}
                                required
                            />
                        </div>}
                        {frequency && <div className="form-group mh-40 mb-3">
                            <label className="font-12 m-0">{t('Frequency')}</label>
                            <input
                                type="number"
                                name="frequency"
                                className="form-control m-0"
                                placeholder={t('Number of times')}
                                value={value && value.frequency}
                                onChange={(e) => handleValue(e)}
                                required
                            />
                        </div>}
                        <div className="form-group mb-0 form-inline">
                            <div className="form-group">
                                <input
                                    type="checkbox"
                                    className="form-control mr-3"
                                    checked={addEndDate}
                                    onChange={() => setAddEndDate(!addEndDate)}
                                />
                            </div>
                            <label className="font-12 m-0">{t('Add end date')}</label>
                        </div>
                        <div className="form-group mb-0 form-inline">
                            <div className="form-group">
                                <input
                                    type="checkbox"
                                    className="form-control mr-3"
                                    checked={singleUse}
                                    onClick={() => setSingleUse(!singleUse)}
                                />
                            </div>
                            <label className="font-12 m-0">{t('Limit to one customer per use')}</label>
                        </div>
                        <div className="form-group mb-0 form-inline">
                            <div className="form-group">
                                <input
                                    type="checkbox"
                                    className="form-control mr-3"
                                    checked={frequency}
                                    onChange={() => setFrequency(!frequency)}
                                />
                            </div>
                            <label className="font-12 m-0">{t('Limit the number of times codes can be used in total')}</label>
                        </div>
                        <div className="mt-5">
                            <Button
                                style={{ width: "100%" }}
                                className="brand-btn"
                                variant="primary"
                                type="submit"
                                disabled={processing}
                            >
                                {processing && (
                                    <Spinner animation="border" variant="light" size='sm'/>
                                )}
                                {!processing && t("Submit")}
                            </Button>

                        </div>
                    </form>
                </div>
            )}
        </div >
    )
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    location: state.data.location,
    store_details: state.data.store_details,
    create_coupon: state.data.create_coupon,
    get_coupon: state.data.get_coupon,
    generate_coupon: state.data.generate_coupon
});

export default connect(mapStateToProps, {
    generateCoupon,
    createCoupon,
    getCoupon,
    clearState,
    loadAllStoreDetails
})(Discounts);
