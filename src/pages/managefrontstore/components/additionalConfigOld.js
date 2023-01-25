import React from "react";
import { isEmpty } from "lodash";
import Loader from "assets/images/svg/loader.svg";
import Next from "assets/images/svg/next.svg";

const StoreAdditionalConfig = ({all_store_details, loading, onEdit})=>{
    console.log(all_store_details)
    return (
        <div className="col-lg-9 col-md-12 py-3">
            <div className="sbt-table-topless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">Invoicing</div>
                        <div className="sbt-value">{
                            isEmpty(all_store_details) && loading
                                ? <img src={Loader} width="100" height="60" alt="icon" />
                                : all_store_details && all_store_details.payload && all_store_details.payload.isInvoice === null ? "No invoice configuration available."
                                : all_store_details && all_store_details.payload && all_store_details.payload.isInvoice ? "Yes" : "No"
                        }
                        </div>
                    </div>
                    <img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("setting")}/>
                </div>
            </div>
            <div className="sbt-table-topless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">Negotation</div>
                        <div className="sbt-value">{
                            isEmpty(all_store_details) && loading
                                ? <img src={Loader} width="100" height="60" alt="icon" />
                                : all_store_details && all_store_details.payload && all_store_details.payload.isNegotiation === null ? "No negotiation configuration available."
                                : all_store_details && all_store_details.payload && all_store_details.payload.isNegotiation ? "Yes" : "No"
                        }
                        </div>
                    </div>
                    <img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("setting")}/>
                </div>
            </div>
            <div className="sbt-table-topless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">Pay Later</div>
                        <div className="sbt-value">{
                            isEmpty(all_store_details) && loading
                                ? <img src={Loader} width="100" height="60" alt="icon" />
                                : all_store_details && all_store_details.payload && all_store_details.payload.isPayLater === null ? "No paylater configuration available."
                                : all_store_details && all_store_details.payload && all_store_details.payload.isPayLater ? "Yes" : "No"
                        }
                        </div>
                    </div>
                    <img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("setting")}/>
                </div>
            </div>
            <div className="sbt-table-bottomless">
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="sbt-label">Notification</div>
                        <div className="sbt-value">{
                            isEmpty(all_store_details) && loading
                                ? <img src={Loader} width="100" height="60" alt="icon" />
                                : all_store_details && all_store_details.payload && all_store_details.payload.isNotification === null ? "No notification configuration available."
                                : all_store_details && all_store_details.payload && all_store_details.payload.isNotification ? "Yes" : "No"
                        }
                        </div>
                    </div>
                    <img src={Next} alt="next" className="cursor-pointer" onClick={()=> onEdit("setting")}/>
                </div>
            </div>
        </div>
    )
};

export default StoreAdditionalConfig;
