import {Button} from "react-bootstrap";
import React from "react";

const SeerBitAdverts = ()=>{
    return(
        <div
            className="auth--side-container"
        >
            <div >
                <div className="text-center font-bold text-dark font-18 mx-auto mb-4 px-3 pt-4">
                    How COVID-19 led to a surge in <br></br> eCommerce in Africa
                </div>
                <div className="text-center font-14 text__color--light px-4">
                It’s been a year since the world responded to an onslaught of a deadly coronavirus, which we all came to know as COVID-19, by shutting down international borders and placing restrictions on movement and activities.
                </div>
                <div className="d-flex justify-content-center my-3 mb-5">
                    <Button
                        block
                        variant="outline-dark"
                        className="h-45px w-150px font-13"
                        style={{ width: "100px", backgroundColor: "#fff" }}
                    >
                        <a href="https://seerbit.com/blog/how-covid-19-led-to-a-surge-in-ecommerce-in-africa/" target="_blank" className="text-black">Read More</a>
                    </Button>
                </div>
                <div className="d-flex justify-content-center">
                    <img
                        src="https://res.cloudinary.com/dy2dagugp/image/upload/v1634034804/seerbit/feature-sample_trpdou.jpg"
                        // height="100%"
                        as="a"
                        href="https://seerbit.com/"
                        target="_blank"
                        className="w-100"
                        style={{ height: "100%"}}
                    />
                </div>
            </div>
        </div>
    )
}

export default SeerBitAdverts;
