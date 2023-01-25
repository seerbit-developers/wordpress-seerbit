import React from "react";
import styled from "styled-components";
import {useTranslation} from "react-i18next";

const Badge = ({
  as = "span",
  text = null,
  status = "",
  styles = "",
  type,
  className = '',
  ...props
}) => {
  const { t } = useTranslation();
  const Container = styled(as)`
    line-height: 24px;
    color: ${type === "api-key" ? "#105EFB" : "#000000"};
    font-size: 0.6rem;
    font-weight: 400;
    padding: ${type === "api-key" ? "7px 10px" : "5px"};
    ${type === "api-key" ? "letter-spacing: 0.05em" : ""};
    border-radius: ${type === "api-key" ? "10px" : "3px"};
    ${styles};
    background: ${status === "success"
      ? "rgba(92, 189, 124, 0.08)"
      : status === "fail"
      ? "rgba(193, 7, 7, 0.08)" 
            : status === "info" ?
                "rgba(128,126,126,0.08)"
      : "rgba(108, 120, 139, 0.15)"};
  `;
  return <Container className={className} title={text ? t(text) : ''}>{text ? t(text) :
      typeof props.children === 'string' ?
          t(props.children) : props.children}</Container>;
};

export default Badge;
