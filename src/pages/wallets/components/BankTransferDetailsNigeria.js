import React from 'react';
import Copy from "../../../assets/images/svg/copy.svg";
import {isEmpty} from "lodash";
import {handleCopy, hostName} from "utils";
import PropTypes from 'prop-types';
import styled from "styled-components";
import {useSelector} from "react-redux";

const SubHead = styled.span`
  display: block;
  font-size: 15px;
  color: #676767;
  line-height: 2;
`;
const BankTransferDetailsNigeria = ({ businessPocketAccountNumber }) => {
    const business_details = useSelector((d)=> d?.data?.business_details);

    const createBankName = (data) => {
        return "9 payment service bank";
        if (isEmpty(data)) return;
        if (data && data.startsWith("8")) {
            return "Sterling Bank"
        } else {
            return "Providus Bank"
        }
    }
    return (
        <SubHead
            className="p-3 text-muted font-15 mb-5"
            style={{ backgroundColor: "#F0F2F7" }}
        >
            <div className="brand">{
                createBankName(businessPocketAccountNumber)}
            </div>
            <div className="text-muted">
                <span
                    className="cursor-pointer"
                    onClick={() =>
                        handleCopy(businessPocketAccountNumber)
                    }
                >
                  {businessPocketAccountNumber}{" "}
                    <img src={Copy} width="15" height="15" />
                </span>
            </div>
            <div className="">{`${hostName()}(${business_details?.business_name})`}</div>
            {/*<hr />*/}
        </SubHead>
    );
};

BankTransferDetailsNigeria.propTypes = {
    businessPocketAccountNumber: PropTypes.string,
}
export default BankTransferDetailsNigeria;
