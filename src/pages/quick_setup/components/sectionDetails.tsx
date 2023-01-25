import React from 'react';
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import Close from "assets/images/svg/x-circle.svg";
const SubHeading = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  color: #000;
`;

const Title = styled.div`
  font-size: 25px;
  color: #000;
`;

function SectionDetails({
                            progressStatus,
                            setProgressShow
                        }) {
    const { t } = useTranslation();
    return (
        <div className="mb-5">
            <div className="d-flex flex-row justify-content-between">
        <div>
            {
                progressStatus === undefined || progressStatus === 0  ? (
                        <div>
                            <div className="mb-2">
                                <Title>{t('Business Details')}</Title>
                            </div>
                            <SubHeading>{t('Details about your business')}</SubHeading>
                        </div>
                    ) :
                    progressStatus === 1 ? (
                            <div>
                                <div className="mb-2">
                                    <Title>{t('Business contact details')}</Title>
                                </div>
                                <SubHeading>{t('Contact details of your business')}</SubHeading>
                            </div>
                        ) :
                        progressStatus === 2 ?
                            (
                                <div>
                                    <div className="mb-2">
                                        <Title>{t('Settlement Details')}</Title>
                                    </div>
                                    <SubHeading>{t('A bank account to receive funds for settlement')}</SubHeading>
                                </div>
                            )
                            :
                            (
                                <div>
                                    <div className="mb-2">
                                        <Title>{t('Legal Documents')}</Title>
                                    </div>
                                    <SubHeading>{t('Upload legal documents for your business')}</SubHeading>
                                </div>
                            )}
        </div>
            <div className="pt-4 mr-4" style={{ paddingRight: "58px" }}>
                <img
                    src={Close}
                    alt="close"
                    onClick={() => setProgressShow(false)}
                    className="cursor-pointer"
                />
            </div>
            </div>
        </div>
    );
}

export default SectionDetails;
