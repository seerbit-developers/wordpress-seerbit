import React from "react";
import Loader from "./loader";

const BlockUI = ({content,show=false})=>{
    return (
        show && <div className="block-ui">
            <div className="block-ui--container">
                {content}
                <Loader type='login'/>
            </div>
        </div>
    )
}

export default BlockUI
