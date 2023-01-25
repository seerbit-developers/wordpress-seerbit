import React from "react";
import { Modal } from "react-bootstrap";
import "./css/sbt-table.scss";

function RoleDetails({ showDetails, close, role }) {
  return (
    showDetails && (
      <Modal show={showDetails} onHide={close} centered size="lg">
        <div className="px-3 py-3">
          <div className="font-medium text-black font-20">Operation Role</div>
        </div>
        <div className="row px-3">
          <div className="col-md-7">
            <div className="border mb-2">
              <div
                className="p-3 font-18"
                style={{
                  color: "#0DB450",
                  background: "rgba(140, 255, 186, 0.49)",
                }}
              >
                Can Access
              </div>
              <div className="scrollable p-3 row">
                {role.can &&
                  role.can.map((item, index) => {
                    return (
                      <div className="py-1 font-10 black col-md-6" key={index}>
                        {item.replace(/_/g, " ")}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="border">
              <div
                className=" p-3 font-18"
                style={{
                  color: "#C10707",
                  background: "rgba(193, 7, 7, 0.45)",
                }}
              >
                Can't Access
              </div>
              <div className="scrollable p-3">
                {role.cannot &&
                  role.cannot.map((item, index) => {
                    return (
                      <div className="py-1 font-10 black" key={index}>
                        {item.replace(/_/g, " ")}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  );
}

export default RoleDetails;
