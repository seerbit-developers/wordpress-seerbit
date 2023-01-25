import React from "react";
const ArrowUp = require('../assets/images/svg/arrow-up.svg');
const ArrowDown = require('../assets/images/svg/arrow-down.svg');
import PropTypes from 'prop-types';

const StatusIcon = ({ status='success' })=> status === 'success' ? <img src={ArrowDown} alt="success" title='Successful'/> : <img src={ArrowUp} alt="fail" title='Failed'/>


StatusIcon.propTypes = {
    status: PropTypes.any
}

export default StatusIcon;
