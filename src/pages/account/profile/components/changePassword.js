import React, { useState } from "react";
import Button from "components/button";
import { Spinner } from "react-bootstrap";

const ChangePassword = ({ open }) => {
    const [process, setProcess] = useState(false);
    return (
        <div className="">
            {open &&
                <form
                    className="w-100"
                >
                    <div className="d-flex flex-row justify-content-between ">
                        <div className={`configuration__item w-100 mr-2`}>
                            <label className="form__control--label--lg">Current Password</label>
                            <input
                                className={`d-block form__control--full`}
                                type="password"
                                name="current_password"
                            />
                        </div>
                        <div className={`configuration__item w-100 mr-2`}>
                            <label className="form__control--label--lg">New Password</label>
                            <input
                                className={`d-block form__control--full`}
                                type="password"
                                name="new_password"
                            />
                        </div>
                        <div className={`configuration__item w-100`}>
                            <label className="form__control--label--lg">Repeat New Password</label>
                            <input
                                className={`d-block form__control--full`}
                                type="password"
                                name="password_confirmation"
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <Button text={process ?
                            <Spinner animation="border" size="sm" variant="light" disabled={process} /> : 'Save Password'}
                            as="button" buttonType='submit' />
                    </div>
                </form>
            }
        </div>
    )
}

export default ChangePassword
