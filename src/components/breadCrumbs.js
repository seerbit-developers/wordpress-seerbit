import React from "react";
import styled from "styled-components";
import PageHeader from "./pageHeader";
import RightChevron from "../assets/images/svg/rightChevron";
import {useRouteMatch,useHistory} from "react-router";
import {useTranslation} from "react-i18next";
const BreadCrumbs = ({ title = '', styles,as='div', menu = [] })=>{
    const { t } = useTranslation();
    let { url } = useRouteMatch();
    let history = useHistory();
    const [navMenus, setMenus] = React.useState([]);
    const Container = styled(as)`
  line-height: 24px;
  color: #000000;
  font-weight: 400;
  padding-right:18px;
  ${ styles }
`;
    const changePage = (page)=>{
        history.push("/"+page)
    }

    React.useEffect( ()=>{
        const menus = url.split("/").filter(item => item.length > 0).map(item => item.replace(/_/g, " "));
        setMenus(menus)
    }, [])

    return (
        <Container>
            <div className="breadcrumb-container">
                {
                    navMenus.map((item, i)=> {
                        return <span key={i} className={`text-capitalize pr-3 ${i !== navMenus.length -1 ? 'cursor-pointer' : ''}`}
                                     onClick={ ()=> i !== navMenus.length -1 ? changePage(item) : null}>
                            <span className={`pr-3 ${i === navMenus.length -1 ? 'font-bold' : 'hovercrum'} `}>{t(item)} {i !== navMenus.length -1 ? t('Settings') : ''}</span>
                            {/*<span className={` pr-3 ${i === navMenus.length -1 ? 'font-bold' : ''}`}>Settings</span>*/}
                            {i < navMenus.length - 1  ? <RightChevron/> : null}
                        </span>
                    })
                }
            </div>
            <PageHeader title={title}/>
        </Container>
    );
}

export default (BreadCrumbs);
