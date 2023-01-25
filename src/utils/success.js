import React from "react";
import styled from "styled-components";

import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";

import "../modules/css/module.scss";

const SubHead = styled.span`
  display: block;
  font-size: 15px;
  line-height: 17px;
  color: #676767;
  text-align: center;
  line-height: 2;
`;

function Success({ showSuccess, close }) {
  return (
    showSuccess && (
      <Modal.Body className="text-center pt-5">
        <form className="w-100">
          <div>
            <SubHead className="px-3 font-weight-bold font-16">
              Your customer refund is on its way
            </SubHead>
            <SubHead className="px-5 py-3 font-weight-lighter font-15">
              <div className="px-5">
                Refunds may take 3-14 working days to complete.
              </div>
            </SubHead>
          </div>
          <div className="form-group mh-40">
            <Button
              variant="xdh"
              size="lg"
              block
              height={"50px"}
              className="brand-btn"
              onClick={close}
            >
              close
            </Button>
          </div>
        </form>
      </Modal.Body>
    )
  );
}

export default Success;
