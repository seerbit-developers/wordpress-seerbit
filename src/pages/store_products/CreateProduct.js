import React, {useEffect, useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import Select from 'react-select';
import { isEmpty } from "lodash";
import {useTranslation} from "react-i18next";


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
const CreateProduct = React.memo(({ product_categories, setDetails, show, reset, processing }) => {
    const { handleSubmit, errors, control } = useForm();
    const [value, setValue] = useState(null);
    const [categoryData, setData] = useState([]);
    const [check, setCheck] = useState(false);
    const { t } = useTranslation();

    const handleSelected = (selected) => {
        const d = { ...value, categoryId: selected.value }
        setValue(d);
        setDetails(d)
    }

    const handleValue = (e) => {
        const d = { ...value, [e.target.name]: e.target.value }
        setValue(d);
        setDetails(d)
    };

    const createCategoryData = (data) => {
        if (!isEmpty(data)) {
            let categorizedData = [];
            categorizedData = data.payload.map((list, id) => {
                return {
                    ...list,
                    value: list.id,
                    label: list.name
                };
            });
            setData(categorizedData);
        }
    };

    useEffect(() => {
        if (product_categories) {
            createCategoryData(product_categories);
        }
    }, [product_categories]);

    useEffect(() => {
        if (check) {
            setValue({ ...value, quantity: 1 })
            setDetails({ ...value, quantity: 1 })
        } else {
            setValue({ ...value, quantity: 0 })
            setDetails({ ...value, quantity: 0 })
        }
    }, [check]);

    useEffect( ()=>{
        if (reset){
            formReset()
        }
    }, [reset])

    const formReset = () => {
        const form = document.querySelector("#seerbit-form")
        Array.from(form.querySelectorAll("input")).forEach(
            input => {
                input.value = ""
            }
        );
        Array.from(form.querySelectorAll("textarea")).forEach(
            input => (input.value = "")
        );
    };

    return (
        <div className={`anim ${!show ? 'anim_show' : 'anim_hide'}`}>
            <form id='seerbit-form'>
                    <div className="mb-5 mt-5">
                        <div className="form-group mh-40 mt-4">
                            <input
                                className="form-control mh-40 "
                                type="text"
                                name="productName"
                                minLength={2}
                                disabled={processing}
                                onChange={(e) => handleValue(e)}
                                // value={value && value.productName}
                                placeholder={t("Product Name")}
                            />
                        </div>
                        <div className="form-group mh-40 mt-4">
                            <input
                                className="form-control mh-40 "
                                type="text"
                                name="productCode"
                                minLength={2}
                                disabled={processing}
                                onChange={(e) => handleValue(e)}
                                // value={value && value.productCode}
                                placeholder={t("Product Code")}
                            />
                        </div>
                        <div className="form-onboarding-outline mb-3">
                            <Controller
                                name="categoryId"
                                defaultValue={""}
                                className="basic-single"
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <Select
                                        options={categoryData}
                                        styles={customStyles}
                                        disabled={processing}
                                        // value={categoryData.find(c => c.value === value)}
                                        onChange={e => {
                                            onChange(e.value);
                                            handleSelected(e)
                                        }}
                                        isSearchable={false}
                                        isLoading={!isEmpty(categoryData) ? false : true}
                                    />
                                )}
                                control={control}
                                rules={{ required: true }}
                            />
                            {errors && errors.categoryId && errors.categoryId.type === "required" && (
                                <span className="text-danger font-12">{t("Product Category is required")}</span>
                            )}
                        </div>
                        <div className="form-group mh-40 mt-4">
                            <div className="input-group">
                                <div className="input-group-prepend" style={{ backgroundColor: "#DFE0EB" }} >
                                        <span className="input-group-text" id="basic-addon1">
                                            {t("Amount NGN")}
                                        </span>
                                </div>
                                <input
                                    className="form-control mh-40"
                                    name="amount"
                                    type="text"
                                    disabled={processing}
                                    // value={value && value.amount}
                                    onChange={(e) => handleValue(e)}
                                    required
                                />
                            </div>
                        </div>
                        {check && <div className="form-group mh-40 mt-4">
                            <input
                                className="form-control mh-40 "
                                type="number"
                                name="quantity"
                                disabled={processing}
                                onChange={(e) => handleValue(e)}
                                // value={value && value.quantity}
                                placeholder={t("Quantity")}
                            />
                        </div>}
                        <div className="form-group mh-40 mt-4">
                                <textarea
                                    name="productDescription"
                                    className="form-control"
                                    rows="3"
                                    disabled={processing}
                                    minLength={2}
                                    maxLength={200}
                                    placeholder={t("Product Description")}
                                    style={{ resize: "none" }}
                                    onChange={(e) => handleValue(e)}
                                    // value={value && value.productDescription}
                                    required
                                />
                        </div>
                        <div className="form-group">
                            <div className="form-inline ">
                                <input
                                    type="checkbox"
                                    disabled={processing}
                                    className="form-control mr-2"
                                    name="isDepletable"
                                    onChange={() => setCheck(!check)}
                                />
                                <label className="form-label font-14">{t("Enable stock for this product")}</label>
                            </div>
                        </div>
                    </div>
            </form>
        </div>
    );
})

export default CreateProduct;
