import React, {useMemo, useState} from "react";
import AppModal from "components/app-modal";
import Button from "components/button";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import {useForm, Controller} from "react-hook-form";
import ReactCountryFlag from "react-country-flag";
import {isEmpty} from "lodash";
import Select from "react-select";
import {createCustomer} from "services/invoiceService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {alertError, alertExceptionError, alertSuccess} from "modules/alert";
import { getCustomers } from "actions/invoiceActions";

const CreateCustomer = ({
  isOpen,
  close,
  countries,
  getCustomers
}) => {
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm({ shouldUseNativeValidation: false });
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  const onSubmit = async data => {
    setBusy(true);
    const p = {...data, country: data.country.name}
    createCustomer(p).then(res=>{
      setBusy(false);
      if (res.responseCode == '201'){
        alertSuccess('Customer created');
        getCustomers();
      } else {
        alertError(res.message ? res.message : 'Failed to create customer')
      }
    }).catch(e=>{
      setBusy(false);
      alertExceptionError(e)
    })
  };


  const co = useMemo( ()=> {
    return countries?.map((list, id) =>
        ({
          ...list,
          id,
          value: list.countryCode,
          label: <div><ReactCountryFlag
              countryCode={list.countryCode}
              style={{
                lineHeight: '1.6em',
                fontSize: '1.6em',
                marginRight: '6px',
              }}
              svg
              cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
              cdnSuffix="svg"
              title="US"
          />{list.name.charAt(0).toUpperCase() + list.name.slice(1).toLowerCase()}</div>
        })
    )

  }, [countries])
  return (
    <AppModal
      title={"New Customer"}
      isOpen={isOpen}
      close={() => close(false)}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div className="w-100">
          <div className="form-group mh-40 ">
            <label className="font-12 font-medium">{t("Business Name")} <span className='text-danger text-italic'>{errors?.businessName?.message}</span></label>
            <input
              className="form-control mh-40"
              type="text"
              disabled={busy}
              {...register("businessName", { required: "Enter business name" })}
            />
          </div>
          <div className="form-group mh-40 ">
            <label className="font-12 font-medium">{t("Contact Name")} <span className='text-danger text-italic'>{errors?.contactName?.message}</span></label>
            <input
              className="form-control mh-40"
              type="text"
              disabled={busy}
              {...register("contactName", { required: "Enter contact name." })}
            />
          </div>
          <div className="form-group mh-40">
            <label className="font-12 font-medium">{t("Phone Number")} <span className='text-danger text-italic'>{errors?.customerPhone?.message}</span></label>
            <input
              className="form-control mh-40"
              type="text"
              disabled={busy}
              {...register("customerPhone", { required: "Enter contact phone." })}
            />
          </div>
          <div className="form-group mh-40">
            <label className="font-12 font-medium">{t("Email Address")} <span className='text-danger text-italic'>{errors?.customerEmail?.message}</span></label>
            <input
              className="form-control mh-40"
              type="email"
              disabled={busy}
              {...register("customerEmail", { required: "Enter contact email." })}
            />
          </div>
          <div className="form-group mh-40 ">
            <label className="font-12 font-medium">{t("Street Address")} <span className='text-danger text-italic'>{errors?.address?.message}</span></label>
            <input
              className="form-control mh-40 "
              type="text"
              disabled={busy}
              {...register("address", { required: "Enter customer address." })}
            />
          </div>
          <div className="form-group mh-40 ">
            <label className="font-12 font-medium">{t("City")} <span className='text-danger text-italic'>{errors?.city?.message}</span></label>
            <input
              className="form-control mh-40 "
              type="text"
              disabled={busy}
              {...register("city", { required: "Enter customer city." })}
            />
          </div>
          <div className="col-12 p-0 m-0">
            <div className="row">
              <div className="col-6">
                <div className="form-group mh-40 ">
                  <label className="font-12 font-medium">{t("State")} <span className='text-danger text-italic'>{errors?.state?.message}</span></label>
                  <input
                    className="form-control mh-40"
                    type="text"
                    disabled={busy}
                    {...register("state", { required: "Enter state." })}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group mh-40 ">
                  <label className="font-12 font-medium">{t("Country")} <span className='text-danger text-italic'>{errors?.country?.message}</span></label>
                  <Controller
                      control={control}
                      name="country"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Select
                      className="basic-single"
                      {...register("country", { required: "Select country." })}
                      value={value}
                      options={co}
                      disabled={busy}
                      onChange={onChange}
                      isSearchable={false}z
                      isLoading={!isEmpty(co) ? false : true}
                  />
                      )}
                      />
                </div>
              </div>
            </div>
          </div>
          <div className="form-group mh-40 mt-3">
            <Button
              size="lg"
              type='submit'
              full={true}
              // disabled={busy || !isValid}
            >
              {busy ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                  t("Save")
              )}
            </Button>
          </div>
        </div>
      </form>
    </AppModal>
  );
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  getCustomers
})(CreateCustomer);
