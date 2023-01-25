import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from "framer-motion"
import {getLoanApplications} from "services/capitalService";
import ApplicationsModal from "./applications"
const PortfolioBalance = () => {
    const [applications, setApplications] = useState([]);
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);
    const variants = {
        open: {
            y: 0,
            opacity: 1,
            transition: {
                y: { stiffness: 1000, velocity: -100 }
            }
        },
        closed: {
            y: 50,
            opacity: 0,
            transition: {
                y: { stiffness: 1000 }
            }
        }
    };
    useEffect( ()=>{
        getLoanApplications().then(res=>{
            if (res){
                setApplications(res.loan[0].borrower)
            }
        })
    }, [])

    return (
        <div className="balance-section">
            <ApplicationsModal
                isOpen={showApplicationsModal}
                close={()=>setShowApplicationsModal(false)}
                data={applications}
            />
            <div className="header">
                <h4>Portfolio Balance</h4>
                <span>&#8358;</span>
            </div>
            <motion.div
                variants={variants}
                animate="open"
            >
            <div className="balance">
                <h4>Loan Balance</h4>
                <span>0.00</span>
            </div>
            <div className="balance">
                <h4 className="cursor-pointer" onClick={()=>setShowApplicationsModal(true)}>
                    Total Applications</h4>
                <span
                    className="cursor-pointer" onClick={()=>setShowApplicationsModal(true)}
                >{applications?.length}</span>
            </div>
            <div className="balance">
                <h4>Group Pay</h4>
                <span>0.00</span>
            </div>

            </motion.div>

        </div>
    );
};

export default PortfolioBalance;
