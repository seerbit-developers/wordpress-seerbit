import React from "react";
import TableDropdown from "components/table-actions-dropdown/table-dropdown";
const DisputeResponse = (props, raiseDispute, setShowDispute, replyDispute, processing, setProcessing) => {
  return (
    <>
      {props.status === "IN_DISPUTE" && (
          <TableDropdown data={[
            { label: 'Reply', value: 'reply' },
            { label: 'Accept', value: 'accept' },
          ]}/>
      )}
      {props.status === "DECLINED" && (
          <TableDropdown data={[
            { label: 'Edit', value: 'edit' },
          ]}/>
      )}
      {props.status === "AUTO_ACCEPTED" && (
          <TableDropdown data={[
            { label: 'Edit', value: 'edit' },
          ]}/>
      )}
      {props.status === "ACCEPTED" && (
          <TableDropdown data={[
            { label: 'Edit', value: 'edit' },
          ]}/>
      )}
      {props.status === "CLOSED" && (
          <TableDropdown data={[
            { label: 'Edit', value: 'edit' },
          ]}/>
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
