import * as React from "react"

function HamburgerIcon(props) {
    return (
        <svg width={17} height={14} viewBox="0 0 12 9" fill="none" {...props}>
            <path fill="#676767" d="M0 8H12V9H0z" />
            <path fill="#676767" d="M0 4H12V5H0z" />
            <path fill="#676767" d="M0 0H12V1H0z" />
        </svg>
    )
}

export default HamburgerIcon
