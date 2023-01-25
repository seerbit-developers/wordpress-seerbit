import * as React from "react"

function NoDataPlaceHolder(props) {
    return (
        <svg width={144} height={144} viewBox="0 0 144 144" fill="none" {...props}>
            <circle cx={72} cy={72} r={71} stroke="#CCC" strokeWidth={2} />
            <path fill="url(#pattern0)" fillOpacity={0.2} d="M32 32H112V112H32z" />
            <defs>
                <pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width={1}
                    height={1}
                >
                    <use xlinkHref="#image0" transform="scale(.005)" />
                </pattern>
                <image
                    id="image0"
                    width={200}
                    height={200}
                    xlinkHref="data:image/png;base64,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"
                />
            </defs>
        </svg>
    )
}

export default NoDataPlaceHolder
