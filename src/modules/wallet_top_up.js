/** @format */
import React, { useState } from "react";

import verify from "utils/strings/verify";
import validate from "utils/strings/validate";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Copy from "../assets/images/svg/copy.svg";
import styled from "styled-components";
import "./css/module.scss";
import {Loader} from "semantic-ui-react";
import {handleCopy} from 'utils'
const SubHead = styled.span`
  display: block;
  font-size: 15px;
  line-height: 17px;
  color: #676767;
  line-height: 2;
`;

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

function WalletTopUp({
  show_top_up,
  close,
  wallet,
  walletTopUp,
  inProcess,
  setInProcess,
  business_details,
  location,
}) {
  const [amount, setAmount] = useState();
  const [amountPass, setAmountPass] = useState(true);


  const handleAmount = (e) => {
    var thenum = e.target.value.match(RegExp(verify.number), "");
    if (thenum !== null) {
      setAmount(thenum[0]);
      setAmountPass(RegExp(validate.money).test(thenum[0]));
    }
  };

  const initProcess = async (amount) => {
    setInProcess(true);
    if (!amountPass) {
      setAmount("");
      setInProcess(false);
      setAmountPass(false);
    } else {
      const params = {
        location: "wallet-top-up",
        data: {
          amount,
          emailAddress: business_details.business_email,
        },
      };
      walletTopUp(params);
    }
  };

  return (
    <Modal centered show={show_top_up} onHide={close} size="md">
      <Modal.Body className="py-3 px-4">
        <Modal.Title className="font-20 text-dark pb-3">
          <div className="py-2 text-bold">
            <strong>Pocket Top Up</strong>
          </div>
        </Modal.Title>
        {(!wallet ||
          !wallet.responsemessage ||
          location !== "wallet-top-up") && (
            <form
              className="w-100"
              onSubmit={(e) => {
                e.preventDefault();
                initProcess(amount);
              }}
            >
              <div className="form-group mh-40 ">
                <label className="font-12"> How much do you want to send?</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">
                      {business_details.default_currency}
                    </span>
                  </div>
                  <input
                    className="form-control mh-40 "
                    pattern="^(0|[1-9][0-9]*)$"
                    type="text"
                    name="amount"
                    onChange={(e) => handleAmount(e)}
                    value={amount}
                    required
                  />
                </div>
                {!amountPass && amount !== undefined && (
                  <Error>enter a valid amount</Error>
                )}
              </div>

              <div className="form-group mh-40">
                <Button
                  variant="xdh"
                  size="lg"
                  block
                  height={"50px"}
                  className="brand-btn"
                  type="submit"
                  disabled={inProcess}
                >
                  {inProcess && (
                      <Loader active inline='centered' />
                  )}
                  {!inProcess && "Initiate Transfer"}
                </Button>
              </div>
            </form>
          )}
        {wallet && wallet.responsemessage && location === "wallet-top-up" && (
          <form className="w-100">
            <div className="">
              <SubHead className="font-weight-light font-15">
                Transfer the amount you wish to fund your Pocket Account with
                the account details provided below
                {/* Please complete your payment via transfer to this{' '}
								<span className='font-weight-bold'>
									{wallet.payload.bankName}
								</span>{' '}
								account number:{' '}
								<span className='font-weight-bold'>
									{wallet.payload.accountNumber}
								</span>{' '}
								using any of your bank channels */}
              </SubHead>
              <SubHead
                className="p-3 text-muted font-15"
                style={{ backgroundColor: "#F0F2F7" }}
              >
                <div className="brand">{wallet.bankName}</div>
                <div className="text-muted">
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      handleCopy(
                        wallet.wallet || wallet.accountNumber,
                        "Account number"
                      )
                    }
                  >
                    {wallet.wallet || wallet.accountNumber}{" "}
                    <img src={Copy} width="15" height="15" />
                  </span>
                </div>
                <div className="">{wallet.walletname}</div>
              </SubHead>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default WalletTopUp;
