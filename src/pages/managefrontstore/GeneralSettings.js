import React, { useState } from "react";
import Delivery from "./Delivery";
import Discount from "./Discount";
import "./css/general.scss";
import AppModal from "../../components/app-modal";

export default function GeneralSettings(props) {
    const { setOpen, storeId, currency, isOpen} = props;
    const [selected, setSelected] = useState("Discount Coupons")
    const tabs = ["Discount Coupons", "Delivery Zones"];

    return (
        <AppModal
            title={"Additional Setup"}
            isOpen={isOpen}
            close={() => {
                setOpen(false);
            }}>

                        <div className="mt-5">
                            <div className="d-flex justify-content-between">
                                {tabs.map((data, id) => (
                                    <div
                                        key={id}
                                        onClick={() => setSelected(data)}
                                        className={
                                            selected === data
                                                ? "cursor-pointer text__color--dark font-bold font-14"
                                                : "cursor-pointer text__color--base hov"
                                        }
                                    >
                                        {data}
                                    </div>
                                ))}
                            </div>
                            {selected === "Discount Coupons" && <Discount storeId={storeId} currency={currency} close={()=>setOpen(false)}/>}
                            {selected === "Delivery Zones" && <Delivery storeId={storeId} currency={currency}  close={()=>setOpen(false)}/>}
                            {/*{selected === "Other Settings" && <OtherSettings storeId={storeId} all_store_details={all_store_details} />}*/}
                        </div>

        </AppModal>
    )
}
