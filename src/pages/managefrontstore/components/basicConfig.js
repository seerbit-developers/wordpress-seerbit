import React from 'react'
import Button from "components/button";
import {useTranslation} from "react-i18next";

const BasicConfig = ({save, selectedStore, setOpen, setOpenType}) => {
    const { t } = useTranslation();
    return (
        <form onSubmit={save}>
            <div className="my-4 d-flex align-items-center py-3 front_store__section">
                <div className="col-12">
                    <div className="row p-0 m-0">
                        <div className="col-lg-8 col-md-12">
                            <div className="row p-0 m-0 justify-content-between" style={{ width: "100%" }}>
                                <div className="py-3" style={{maxWidth:200}}>
                                    <div className="sbt-label">{t('Store Name')}</div>
                                    <div className="sbt-value">{selectedStore?.storeName}</div>
                                </div>
                                <div className="py-3">
                                    <div className="sbt-label">{t('Orders')}</div>
                                    <div className="sbt-value">{selectedStore?.orders}</div>
                                </div>
                                <div className="py-3">
                                    <div className="sbt-label">{t('Revenue')}</div>
                                    <div className="sbt-value">{`${selectedStore?.currency}${selectedStore?.revenue}`}</div>
                                </div>
                                <div className="py-3">
                                    <div className="sbt-label">{t('Store URL')}</div>
                                    <div className="sbt-value" style={{ width: "100%", color: "#3F99F0", cursor: "pointer" }}>
                                        <a href={selectedStore?.storeUrl} target="_blank">{selectedStore?.storeUrl}</a></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <div className="d-flex flex-row flex-wrap justify-content-end" style={{ width: "100%" }}>
                                {/*<div className="py-3 mr-2">*/}
                                {/*    <Button*/}
                                {/*        size="sm"*/}
                                {/*        // style={{ width: "100px", background: "#DFE0EB" }}*/}
                                {/*        onClick={() => {*/}
                                {/*            setOpen(true);*/}
                                {/*            setOpenType("setting")*/}
                                {/*        }}*/}
                                {/*        type={'button'}*/}
                                {/*    >*/}
                                {/*        {t('edit store')}*/}
                                {/*    </Button>*/}
                                {/*</div>*/}
                                <div className="py-3">
                                    <Button
                                        size="sm"
                                        // style={{ width: "180px" }}
                                        buttonType={selectedStore?.status === "ACTIVE" ? "fail" : "success"}
                                        // variant={selectedStore?.status === "ACTIVE" ? "danger" : ""}
                                        type="submit"
                                    >
                                        {selectedStore?.status === "ACTIVE" ? t("take store offline") : t("take store online")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default BasicConfig;
