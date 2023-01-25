import React from 'react';
import Button from "components/button";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion"
const Start = ({goTo, show}) => {
    return (
        <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x:-10 }}
            className="start"
        >
            <div>
                <div className="title">
                    Start your Capital Application
                    Here
                </div>
            </div>
            <div>
                <div className="action">
                    <Button type="success" size="sm" onClick={()=>goTo('OFFERS')}>Start your Capital application here</Button>
                </div>
            </div>

        </motion.div>
        </AnimatePresence>
    );
};

Start.propTypes = {
    goTo: PropTypes.func,
    show: PropTypes.bool,
};

export default Start;
