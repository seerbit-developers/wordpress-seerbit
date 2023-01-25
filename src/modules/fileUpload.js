import React, { useState } from "react";
import cogoToast from "cogo-toast";
import FileDocument from "./fileDocument";

const KYCDocument = ({
  data,
  key,
  setItems,
  items,
  kycDocuments,
  setKYCDocuments,
  setKYCUpdate,
}) => {
  const render = new FileReader();
  const onDrop = (files) => {
    if (files[0].size > 5 * 1024 * 1024) {
      alert("Maximum of 5 Megabyte is allow");
      cogoToast.error("Maximum of 5 Megabyte is allow");
      return;
    }
    setItems({ ...items, [data.fieldName]: files[0] });
  };

  render.onloadend = () => {
    const set = {
      fieldName: data.fieldName,
      documentType: data.documentType,
      rawFile: render.result,
    };
    setKYCDocuments(uniq([set, ...kycDocuments], (it) => it.u));
    setKYCUpdate(true);
  };

  React.useEffect(() => {
    if (items[data.fieldName]) {
      render.readAsDataURL(items[data.fieldName]);
    }
  }, [items])

  return (
    <FileDocument
      status={data.status}
      onDrop={onDrop}
      file={items[data.fieldName]}
      data={data}
    />
  );
};

const KYCText = ({
  data,
  kycDocuments,
  setKYCDocuments,
  setKYCUpdate,
  setValues,
  values,
  setItems,
  items,
}) => {
  let set = {};
  return (
    <div className="col-md-12 configuration__item">
      <label className="font-12 text-capitalize">{data.fieldName.replace("_", " ")}</label>
      <input
        defaultValue={data.kycRecordUpdate}
        className="d-block form__control--blank"
        // "{`d-block ${editMode ? 'form__control--full' : 'form__control--blank'}`}"
        type="text"
        placeholder={data.fieldName.replace("_", " ")}
        name={[data.fieldName]}
        minLength={5}
        onChange={(e) => {
          set = {
            fieldName: data.fieldName,
            documentType: data.documentType,
            kycRecordUpdate: e.target.value,
          };
          setValues({ ...values, [data.fieldName]: e.target.value });
          setKYCDocuments(uniq([set, ...kycDocuments], (it) => it.u));
          setKYCUpdate(true);
        }}
        value={values[data.fieldName]}
      />
      <div className="input__border--bottom"/>
    </div>
  );
};

const KYCNotSet = ({
  data,
  setBusinessCertificate,
  rc_number,
  handleRCNumber,
  items,
  setItems,
  setKYCUpdate,
}) => {
  const render = new FileReader();
  const onDrop = (files) => {
    if (files[0].size > 5 * 1024 * 1024) {
      alert("Maximum of 5 Megabyte is allow");
      cogoToast.error("Maximum of 5 Megabyte is allow");
      return;
    }
    setItems({ [data.fieldName]: files[0] });
  };

  render.onloadend = () => {
    setKYCUpdate();
    setBusinessCertificate(render.result);
  };

  React.useEffect(() => {
    if (items[data.fieldName]) {
      render.readAsDataURL(items[data.fieldName]);
    }
  }, [items])

  return (
    <>
      <div className="form-group my-2">
        <input
          className="form-control"
          type="text"
          placeholder="RC Number"
          name="rc_number"
          maxLength={10}
          onChange={(e) => {
            setKYCUpdate();
            handleRCNumber(e);
          }}
          value={rc_number}
        />
      </div>
      <FileDocument
        status={data.status}
        onDrop={onDrop}
        file={items[data.fieldName]}
        data={data}
      />
    </>
  );
};

const uniq = (arr) =>
  arr.filter(
    (v, i, a) =>
      a.findIndex((t) => t.fieldName === v.fieldName && !t.identifier) === i
  );

export { KYCDocument, KYCText, KYCNotSet };
