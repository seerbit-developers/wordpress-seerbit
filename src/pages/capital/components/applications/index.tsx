import React from 'react';
import PropTypes from 'prop-types';
import AppModal from "components/app-modal"
const Index = ({isOpen, close, data}) => {
    return (
        <AppModal
            isOpen={isOpen}
            close={close}
            title={'Loan Application History'}
            description={'Loan Application History'}
        >
        <div>
            {
                data && data.map(item=>
                <div className="d-flex justify-content-between">
                    <h5>{item.product[0].application[0].status}</h5>
                    <h5>{item.product[0].application[0].amount}</h5>
                    <h5>
                        {item.product[0].application[0].tenor}
                        {item.product[0].application[0].tenorunit}
                    </h5>
                    <h5>{item.product[0].application[0].added}</h5>
                </div>
                )
            }
        </div>
        </AppModal>
    );
};

Index.propTypes = {
    isOpen : PropTypes.bool.isRequired,
    close : PropTypes.func.isRequired,
    data : PropTypes.array
};

export default Index;
