import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PlanOverview from "./plan_overview";
import { getPlanSubscribers } from "actions/recurrentActions";
import { cancelSubscription } from "services/recurrentService";
import { useParams } from "react-router-dom";
import AppTable from "components/app-table";
import Copy from "assets/images/svg/copy.svg";
import Badge from "components/badge";
import moment from "moment";
import { alertExceptionError, alertSuccess, alertError } from "modules/alert";
import TableDropdown from "components/table-actions-dropdown/table-dropdown";
import useWindowSize from "components/useWindowSize";
import "./css/plan_overview.scss";
import { handleCopy } from "../../utils";
import UpdateSub from "./update_subscription";

function PlanSubscribers(props) {
  const [perPage] = useState(25);
  const [update, setUpdate] = useState(false);
  const [data, setData] = useState({});

  const { plans, plan_subscribers, loading, history, getPlanSubscribers } =
    props;

  const { planId } = useParams();
  const size = useWindowSize();
  const { width } = size;
  const [selectedPlan, setPlan] = useState(null);

  useEffect(() => {
    let data = plans?.payload.find(
      (element) => element?.details?.planId === planId
    );
    setPlan(data);
    getPlanSubscribers(planId);
  }, [plans, planId]);

  const [actions] = React.useState([
    { label: "View Payments", value: "view" },
    { label: "Update Subscriptions", value: "update" },
    { label: "Cancel Subscription", value: "cancel" },
  ]);

  const onTableActionChange = (action, props) => {
    if (action.value === "view") {
      history.push(`/plans/${planId}/${props?.billingId}/transactions`);
    }
    if (action.value === "update") {
      setUpdate(true);
      setData(props);
    }
    if (action.value === "cancel") {
      cancel(props);
    }
  };

  const cancel = (props) => {
    const data = {
      amount: props?.amount,
      currency: props?.currency,
      country: props?.country,
      mobileNumber: props?.mobileNumber,
      billingId: props?.billingId,
      publicKey: props?.publicKey,
      status: "CANCELED",
    };
    cancelSubscription(data)
      .then((res) => {
        if (res.responseCode == "00") {
          getPlanSubscribers(planId);
          alertSuccess("Subscription was successfully cancelled.");
        } else {
          alertError(res.message
              ? res.message || res.responseMessage
              : "An error occurred while cancelling the subscription. Kindly try again");
        }
      })
      .catch((e) => {
        alertExceptionError(e);
      });
  };

  const [columns] = React.useState([
    {
      name: "Customer Name",
      cell: (props) => props?.cardName,
    },
    {
      name: "Amount",
      cell: (props) => (
        <div>
          {props?.currency} {props?.amount}
        </div>
      ),
    },
    {
      name: "Interval",
      cell: (props) => (
        <div>{props?.billingCycle && props?.billingCycle.toLowerCase()}</div>
      ),
    },
    {
      name: "Billing Code",
      cell: (props) => (
        <span className="row p-0 m-0">
          <div className="cut-text">{props?.billingId}</div>
          <img
            src={Copy}
            width="15"
            height="15"
            className="cursor-pointer"
            onClick={(e) => {
              handleCopy(props?.billingId);
            }}
          />
        </span>
      ),
    },
    {
      name: "Subscribed On",
      cell: (props) => (
        <div>{moment(props?.createdAt).format("DD-MM-yyyy, hh:mm A")}</div>
      ),
    },
    {
      name: "No of Payments",
      cell: (props) => <div>{`${props?.chargeCount} of ${props?.limit}`}</div>,
    },
    {
      name: "Status",
      cell: (props) => {
        return (
          <div className="text-left">
            <Badge
              status={props?.status === "ACTIVE" ? "success" : "default"}
              styles={` p-1 ${
                props?.status === "ACTIVE" ? "success" : "default"
              }-transaction`}
            >
              {props?.status && props?.status.toLowerCase()}
            </Badge>
          </div>
        );
      },
    },
    {
      name: "",
      style: { width: "50px", paddingRight: "15px", textAlign: "left" },
      cell: (props) => (
        <TableDropdown
          data={actions}
          onChange={(action) => onTableActionChange(action, props)}
        />
      ),
    },
  ]);

  const [columnsMobile] = React.useState([
    {
      name: "Customer Name",
      cell: (props) => props?.cardName,
    },
    {
      name: "Amount",
      cell: (props) => (
        <div>
          {props?.currency} {props?.amount}
        </div>
      ),
    },
    {
      name: "Plan Code",
      cell: (props) => (
        <span className="row p-0 m-0">
          <div className="cut-text">{props?.billingId}</div>
          <img
            src={Copy}
            width="15"
            height="15"
            className="cursor-pointer"
            onClick={(e) => {
              handleCopy(props?.billingId);
            }}
          />
        </span>
      ),
    },
    {
      name: "Status",
      cell: (props) => {
        return (
          <div className="text-left">
            <Badge
              status={props?.status === "ACTIVE" ? "success" : "default"}
              styles={` p-1 ${
                props?.status === "ACTIVE" ? "success" : "default"
              }-transaction`}
            >
              {props?.status && props?.status.toLowerCase()}
            </Badge>
          </div>
        );
      },
    },
    {
      name: "",
      style: { width: "50px", paddingRight: "15px", textAlign: "left" },
      cell: (props) => (
        <TableDropdown
          data={actions}
          onChange={(action) => onTableActionChange(action, props)}
        />
      ),
    },
  ]);

  // const changePage = (from = 1) => {
  //   const startDate = moment(dates[0]).format("DD-MM-yyyy");
  //   const stopDate = moment(dates[1]).format("DD-MM-yyyy");
  //   props.getSubscriberTransaction(selectedSubscriber?.customerId, planId, from, perPage, startDate, stopDate, selectedSubscriber?.billingId)
  // };

  return (
    <div className="page-container py-5">
      <UpdateSub
        isOpen={update}
        data={data}
        close={() => setUpdate(false)}
      />
      <PlanOverview {...{ selectedPlan, title: "plans" }} />
      <div className="sbt-plan-overview">
        <div className="font-medium font-20 text-black mr-3 d-none d-lg-block">
          Subscribers
        </div>
        <hr className="my-3" />
          <AppTable
            columns={width >= 991 ? columns : columnsMobile}
            fixedLayout={false}
            headerStyle={{ textTransform: "uppercase" }}
            loading={loading}
            paginate={
              (plan_subscribers?.rowCount &&
                Math.ceil(plan_subscribers?.rowCount / perPage) > 1) ||
              false
            }
            perPage={perPage}
            totalPages={
              (plan_subscribers?.rowCount &&
                Math.ceil(plan_subscribers?.rowCount / perPage)) ||
              0
            }
            // changePage={(page) => changePage(page.activePage)}
            currentPage={
              plan_subscribers?.currentPage &&
              parseInt(plan_subscribers?.currentPage) === 0
                ? 1
                : parseInt(plan_subscribers?.currentPage) === perPage
                ? 2
                : Math.ceil(parseInt(plan_subscribers?.currentPage) / perPage) +
                  1
            }
            data={plan_subscribers?.payload || []}
            rowStyle={{ cursor: "pointer" }}
          />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  plans: state.recurrent.plans,
  plan_subscribers: state.recurrent.plan_subscribers,
  loading: state.recurrent.loading_plan_subscribers,
});

export default connect(mapStateToProps, {
  getPlanSubscribers,
})(PlanSubscribers);
