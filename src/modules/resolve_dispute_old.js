import React from "react";
import { Dropdown } from "react-bootstrap";
const DisputeResponse = (props, raiseDispute, setShowDispute, replyDispute, processing, setProcessing) => {
  return (
    <>
      {props.status === "IN_DISPUTE" && (
        <Dropdown>
          <Dropdown.Toggle
            variant="no"
            id="dropdown-basic"
            className="btn-link-primary font-14 p-0"
            drop={"right"}
            disabled={processing}
          >
            Action
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              eventKey="1"
              onClick={(e) => {
                replyDispute({
                  location: "dispute",
                  url: {
                    dispute_ref: props.dispute_ref,
                    action: "accept",
                  },
                  data: {
                    amount: props.transDetails.amount,
                    resolution: "accept",
                  },
                });
              }}
            >
              <button
                className="btn btn-block my-1 btn-downloadoption font-10 font-weight-bold"
                onClick={() => setProcessing(true)}
                disabled={processing}>
                Accept
              </button>
            </Dropdown.Item>
            <Dropdown.Divider className="my-0" />
            <Dropdown.Item
              eventKey="2"
              onClick={(e) => {
                setShowDispute(true);
                raiseDispute(props);
              }}
            >
              <button
                className="btn btn-block my-1 btn-downloadoption font-10 font-weight-bold"
                disabled={processing}>
                Reply
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      {props.status === "DECLINED" && (
        <React.Fragment>
          <span className="round pending rounded-circle" /> Rejected
        </React.Fragment>
      )}
      {props.status === "AUTO_ACCEPTED" && (
        <React.Fragment>
          <span className="round pending rounded-circle" /> Auto Resolved
          accepted
        </React.Fragment>
      )}
      {props.status === "ACCEPTED" && (
        <React.Fragment>
          <span className="round pending rounded-circle" /> Accepted
        </React.Fragment>
      )}
      {props.status === "CLOSED" && (
          <React.Fragment>
            <span className="round success rounded-circle" /> Resolved
          </React.Fragment>
      )}
    </>
  );
};
const DisputeStatus = (status) => {
  if (status) {
    if (status === "IN_DISPUTE") {
      return (
        <React.Fragment>
          <span className="round pending rounded-circle" /> IN PROCESS
        </React.Fragment>
      );
    } else if (status === "DECLINED") {
      return (
        <React.Fragment>
          <span className="round failed rounded-circle" /> DECLINED
        </React.Fragment>
      );
    } else if (status === "ACCEPTED") {
      return (
        <React.Fragment>
          <span className="round success rounded-circle" /> RESOLVED
        </React.Fragment>
      );
    } else if (status === "AUTO_ACCEPTED") {
      return (
        <React.Fragment>
          <span className="round success rounded-circle" /> RESOLVED AFTER DUE
          DATE
        </React.Fragment>
      );
    } else if (status === "CLOSED") {
      return (
        <React.Fragment>
          <span className="round success rounded-circle" /> RESOLVED
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <span className="round pending rounded-circle" /> IN PROCESS
        </React.Fragment>
      );
    }
  }
  return (
    <React.Fragment>
      <span className="round pending rounded-circle" /> IN PROCESS
    </React.Fragment>
  );
};

export { DisputeResponse, DisputeStatus };
