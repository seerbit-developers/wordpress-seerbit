import React from 'react';
import PropTypes from 'prop-types';
const Header = ({name}) => {
    return (
        <div className="py-3">
            <div className="font-medium pb-3 font-20 text-black header">
                <h3>Welcome to <span>Seerbit Capital</span> {name}</h3>
                <p>You have been preapproved for capital loan</p>
            </div>
        </div>
    );
};
Header.propTypes = {
    name: PropTypes.string
};

export default Header;
