/** @format */

import { css, keyframes } from "styled-components";

const setColors = (Brand) => {
  const { color, button_color, border_color } = Brand;
  return css`
    .brand-button-color {
      background-color: ${button_color} !important;
    }
    .brand-border-color {
      border-color: 1px solid ${border_color} !important;
    }
    .brand-border-botton-color {
      border-bottom: 1px solid ${border_color} !important;
    }
    .brand-border-right-color {
      border-right: 1px solid ${border_color} !important;
    }
    .brand-border-left-color {
      border-left: 1px solid ${border_color} !important;
    }
    // .brand-color {
    //   color: ${color} !important;
    // }
    .brand-settings .active {
      border-right: 3px solid ${border_color} !important;
      animation: myAnimation 0.6s linear;
    }
    @keyframes myAnimation {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    // .brand-btn {
    //   border-radius: 3px;
    //   border: 0.5px solid ${border_color};
    //
    //   background: ${button_color};
    //   border-color: ${border_color};
    //   color: #ffffff;
    //   font-weight: 500;
    //   font-size: 14px;
    //   min-height: 40px;
    //
    //   &:hover {
    //     background: #253b80d4;
    //     border-color: ${border_color};
    //     color: white !important;
    //   }
    //
    //   .p-inputtext {
    //     padding: 1em;
    //     font-size: 12px !important;
    //   }
    // }
  `;
};

export default setColors;
