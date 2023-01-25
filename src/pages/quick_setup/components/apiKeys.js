import React from "react";
import Copy from "../../../assets/images/svg/copy.svg";
import {handleCopy} from "utils"
import {useTranslation} from "react-i18next";
const ApiKeys = ({
                    setting,
                    test_private_key,
                    live_private_key,
                    test_public_key,
                    live_public_key
})=>{
    const { t } = useTranslation();
    return (
        <div className="my-3">
        <div className="font-12 api--keys__container">
            <div>
                <h5
                    style={{ background: "#dfe0e" }}
                    className="font-12"
                >
                    {setting.mode.charAt(0).toUpperCase() +
                    setting.mode.slice(1).toLowerCase()}{" "}
                    {t('Secret')}
                </h5>
            </div>
            <section>
                <input
                    value={
                        setting.mode === "TEST"
                            ? test_private_key
                            : live_private_key
                    }
                    style={{ minHeight: "10px" }}
                    className="font-12"
                />
                <img
                    onClick={() =>
                        handleCopy(
                            `${t(setting.mode)} Secret Key`,
                            setting.mode === "TEST"
                                ? test_private_key
                                : live_private_key
                        )
                    }
                    src={Copy}
                />
            </section>
        </div>
            <div className="font-12 api--keys__container">
                <div>
                    <h5
                        style={{ background: "#dfe0e" }}
                        className="font-12"
                    >
                        {setting.mode.charAt(0).toUpperCase() +
                        setting.mode.slice(1).toLowerCase()}{" "}
                        {t('Public')}
                    </h5>
                </div>
                <section>
                    <input
                        value={
                            setting.mode === "TEST"
                                ? test_public_key
                                : live_public_key
                        }
                        style={{ minHeight: "10px" }}
                        className="font-12"
                    />
                    <img
                        onClick={() =>
                            handleCopy(
                                `${t(setting.mode)} ${t('Public Key')}`,
                                setting.mode === "TEST"
                                    ? test_public_key
                                    : live_public_key
                            )
                        }
                        src={Copy}
                    />
                </section>
            </div>
        </div>
    )
}

export default ApiKeys
