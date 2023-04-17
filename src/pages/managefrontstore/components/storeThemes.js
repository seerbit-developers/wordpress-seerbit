import React from "react";
import Selected from "../../../assets/images/svg/selected.svg";
import Loader from "../../../assets/images/svg/loader.svg";
import {isEmpty} from "lodash";
import {useTranslation} from "react-i18next";


const StoreThemes = ({
                         loading,
                         themes,
                         setselectedTheme,
                         all_store_details,
                         updateTheme,
                         selectedTheme,
                         storeId,
                     })=>{
    const { t } = useTranslation();
    return (
        <div className="my-4 d-flex align-items-center py-3 front_store__section">
            <div className="col-12">
                <div className="row p-0 m-0">
                    <div className="col-lg-12 col-md-12 py-3">
                        <div className="sbt-label">{t('Store Themes')}</div>
                        <div className="sbt-value">{t('Pick a theme for your store and customize it')}</div>
                    </div>
                    <div className="col-lg-12 col-md-12 p-3">

                        <div className="d-flex flex-row flex-wrap">
                            {!loading && themes && themes.payload && themes.payload.filter(item=>item.status === 'ACTIVE').map((data, id) => (
                                <div onClick={() => {
                                    updateTheme({
                                        data: {
                                            themeId: data.themeId
                                        },
                                        storeId: storeId
                                    })
                                    setselectedTheme(data.themeId)
                                }} key={id}>
                                    <div className="img-div mx-3 my-2 animr--box-shadow ">
                                        {!isEmpty(selectedTheme) ? (
                                            <img src={data.previewLink} alt="theme" className={selectedTheme === data.themeId ? `theme responsive` : `responsive`} style={{ height: 150 }} />
                                        ) : (
                                            <img src={data.previewLink} alt="theme" className={all_store_details && all_store_details.payload && all_store_details.payload.theme === data.themeId ? `theme responsive` : `responsive`} style={{ height: 150 }} />
                                        )}

                                        {!isEmpty(selectedTheme) ? (
                                            selectedTheme === data.themeId && <div className="check">
                                                <img src={Selected} alt="selected" />
                                            </div>
                                        ) : (
                                            all_store_details && all_store_details.payload && all_store_details.payload.theme === data.themeId && <div className="check">
                                                <img src={Selected} alt="selected" />
                                            </div>
                                        )
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        {isEmpty(themes) && loading && <tr className="d-flex justify-content-center">
                            <img src={Loader} width="100" height="60" alt="icon" />
                        </tr>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreThemes
