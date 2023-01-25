import React from "react";
import { connect } from "react-redux";
import {useTranslation} from "react-i18next";
const BusinessDetails = ({ business_details }) => {
    const { t } = useTranslation();
  const { business_name, number, logo } = business_details;
  return (
    <div className="business__details--container">
      <div className="logo__container text-center">
        {logo && (
          <img
            src={logo}
            style={{
              width: "90px",
              height: "90px",
              textAlign: "center",
              marginTop: "10px",
            }}
          />
        )}
      </div>
      <div className="business__details">
        <h2>{business_name ? business_name : " "}</h2>
        <h2>
          <span>{t('Business ID')}</span> - {number ? number : ""}
        </h2>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  business_details: state.data.business_details,
});
export default connect(mapStateToProps, {})(BusinessDetails);
