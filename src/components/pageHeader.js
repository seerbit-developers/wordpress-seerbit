import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

const Container = styled.div`
  line-height: 24px;
  color: #000000;
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom:.5em;
  ${ props => props.styles }
`;

const Description = styled.p`
      line-height: 24px;
      color: #6e6e6e;
      font-size: .8rem;
      font-weight: 400;
    `;

const PageHeader = ({ title = '', total = 0, styles, description='' })=>{
    const { t } = useTranslation();

    return (
        <Container>{ t(title) }<Description>{t(description)}</Description></Container>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    total: PropTypes.number,
    styles: PropTypes.any,
}
export default PageHeader
