import React, {Fragment, useCallback, useEffect, useRef} from "react";
import CloseIcon from "../../assets/images/svg/closeIcon";
import PageHeader from "../pageHeader";
import PropTypes from "prop-types";
import { Dialog, Transition } from '@headlessui/react';
import {AnimatePresence, motion} from "framer-motion";
import ReactDOM from "react-dom";
const modalVariant = {
    initial: { opacity: 1 },
    isOpen: { opacity: 1 },
    exit: { opacity: 1 }
};
const containerVariant = {
    initial: { right: "-50%", transition: { type: "tween", stiffness:0.4 } },
    isOpen: { right: "0%", transition: { type: "tween", stiffness:0.4 } },
    exit: { right: "-50%", transition: { type: "tween", stiffness:0.4 } }
};
const AppModal = ({isOpen, close, title, description, containerStyle, contentStyle,headerStyle, ...props})=> {
    const closeWithEscapeKey = useCallback((event)=>{
        if ((event.keyCode || event.charCode) === 27){
            close()
        }
    }, []);
    useEffect( ()=>{
        document.addEventListener("keydown", closeWithEscapeKey);
        return () => {
            document.removeEventListener("keydown", closeWithEscapeKey);
        };
    }, [closeWithEscapeKey]);

    if (!isOpen) return null
    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={"initial"}
                    animate={"isOpen"}
                    exit={"exit"}
                    variants={modalVariant}
                    style={{zIndex:999}}
                >
                    <div className={`${ 'side-modal-overlay'}`}  onClick={ ()=> close()}/>
                <motion.div className={`side-modal-window side-modal-window-visible`} variants={containerVariant} style={containerStyle}>
                    <div style={headerStyle}>
                        <div className="modal-close">
                            <CloseIcon className="modal-close-icon" onClick={() => close()}/>
                        </div>
                        <div>
                            <PageHeader title={title} description={description}/>
                        </div>
                    </div>
                    <div style={contentStyle}>
                            {props.children}
                    </div>
                </motion.div>
                </motion.div>
                    )}
        </AnimatePresence>,
        document.getElementById('app-modal')
    );
}

AppModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    description: PropTypes.string,
    title: PropTypes.string,
    props: PropTypes.any,
};


export const AppModalCenter = ({ isOpen, close, title, description, ...props}) => {
    const closeWithEscapeKey = useCallback((event)=>{
        if (event.keyCode === 27){
            close()
        }
    }, []);

    useEffect( ()=>{
        document.addEventListener("keydown", closeWithEscapeKey);
        return () => {
            document.removeEventListener("keydown", closeWithEscapeKey);
        };
    }, [closeWithEscapeKey]);
    const completeButtonRef = useRef(null)
    const silent = () => {

    }
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                onClose={() => silent()}
                initialFocus={completeButtonRef}
                className={'custom-modal-window'}
            >
                <Transition.Child
                    as={'div'}
                    enter="side--modal-enter"
                    leave="side--modal-exit"

                    leaveFrom="side--modal-enter-active"
                    enterFrom="side--modal-exit-active"

                    leaveTo="side--modal-exit-active"
                    enterTo="side--modal-enter-active"
                >
                    {props.children}
                </Transition.Child>
            </Dialog>
        </Transition>
    )
}

AppModalCenter.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    description: PropTypes.string,
    title: PropTypes.string,
    props: PropTypes.any,
};

export default AppModal
