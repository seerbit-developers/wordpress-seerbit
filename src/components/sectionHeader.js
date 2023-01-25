import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
const Container = styled(props=>props.as)`
  line-height: 24px;
  color: #000000;
  font-size: 1rem;
  font-weight: 400;
  ${ props=>props.styles }
`;
const SectionHeader = ({ title = '', as='span', styles})=>{
    const { t } = useTranslation();
    return (
        <Container as={as} styles={styles}>{ t(title) }</Container>
    );
}
SectionHeader.propTypes = {
    title: PropTypes.string,
    as: PropTypes.string,
    styles: PropTypes.any,
}
export default SectionHeader
