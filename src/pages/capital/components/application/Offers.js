import React from 'react';
import PropTypes from "prop-types";
import Button from "components/button";
import CloseSvg from "assets/images/svg/closeSvg.svg"
import { motion, AnimatePresence } from "framer-motion"
const Offers = ({offersCount = 5, goTo, show,offers}) => {
    const variants = {
        show: {
            y: 0,
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.2 }
        },
        hidden: {
            y: 50,
            opacity: 0,
            transition: {staggerChildren: 0.05, staggerDirection: -1  }

        }
    };
    const variantsItem = {
        show: {
            y: 0,
            x: 0,
            opacity: 1,
            transition: {
                y: { stiffness: 500 }
            }
        },
        hidden: {
            y: 40,
            x: -5,
            opacity: 0,
            transition: {
                y: { stiffness: 500 }
            }
        }
    };

    return (
        <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x:100 }}
            className="offers"
        >
            <div className="header">
                {`We have up to ${offersCount} offers for you`}
                <span className="close cursor-pointer" onClick={()=>goTo('START')}><img src={CloseSvg} alt="close"/></span>
            </div>

            <motion.div className="offer-list"
                        variants={variants}
                        initial="hidden"
                        animate={show ? 'show' : 'hidden'}
                        // initial={{ opacity: 0, y: -50 }}
                        // animate={{ opacity: 1, y: 0 }}
                        // transition={{ duration: 0.5 }}
            >
                {
                    offers && offers.map( (item, i)=>
                        <motion.div
                            variants={variantsItem}
                            // whileHover={{ scale: 0.97 }}
                            whileTap={{ scale: 0.95 }}
                            className="item"
                            key={i}
                        >
                            <h3 className="title">{item.product[0].name}</h3>
                            <div className="details">
                                {/*<p className="description">{item.description}</p>*/}
                                <Button size="sm" styles={{background:'#F9812DE0'}} onClick={()=>goTo('OFFER', item.product[0])}>View Offer</Button>
                            </div>
                        </motion.div>
                    )
                }

            </motion.div>
        </motion.div>

        </AnimatePresence>
    );
};

Offers.propTypes = {
    offersCount: PropTypes.number,
    goTo: PropTypes.func,
    show: PropTypes.bool,
    offers: PropTypes.array,
};

export default Offers;
