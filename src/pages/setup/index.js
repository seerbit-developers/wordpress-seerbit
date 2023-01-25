/** @format */

import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setWhiteLabel } from 'actions/postActions';
import Brand from 'utils/strings/brand.json';

export function WhiteLabel(props) {
	useEffect(() => {
		props.setWhiteLabel(Brand[`${props.match.params.label}`]);
		window.location.href = '/';
	}, []);
	return <div></div>;
}

const mapStateToProps = (state) => ({
	white_label: state.data.white_label,
});

export default connect(mapStateToProps, {
	setWhiteLabel,
})(WhiteLabel);
