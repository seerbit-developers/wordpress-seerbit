/** @format */

import React, { useState } from 'react';

import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import Details from '../../modules/customer_transactions';

import { Nav } from 'react-bootstrap';

import './css/sbt-table.scss';
import styled from 'styled-components';

const Wrapper = styled.div`
	background: #fff;
	width: 100vw;
	min-height: 100vh;
	padding-left: 3em;
`;
const CloseTag = styled.div`
	font-size: 0.9em;
	color: #c2c2c2 !important;
	display: flex;
	cursor: pointer;
	.icon {
		font-size: 1.2em;
	}
	padding-bottom: 3em;
`;
const Centered = styled.div`
	display: flex;
	justify-content: center;
	.text-blue {
		color: #283c7c !important;
		font-size: 40px;
		width: 102px;
		padding-top: 20px;
		padding-bottom: 20px;
		border-radius: 50%;
		background-color: #e1ebff;
		text-align: center;
  }
  .
`;

const DataWrapper = styled.div`
	// height: auto;
	background: #fcfcff;
	border: 1px solid #e7f3ff;
	border-radius: 5px;
`;

const Wrap = styled.div`
	margin-bottom: 1.5em;
	color: #454444 !important;
	.email {
		color: #60677d !important;
		word-break: break-all;
	}
	.black-list {
		color: #c10707 !important;
	}
`;

const NavMenuItem = styled.div`
	padding: 3.5em 4.5em 3.5em 0em;
	font-size: 1.1em;
	color: #676767 !important;
`;
const Counter = styled.span`
	color: #bababa;
	font-size: 12px;
	font-weight: 400;
	margin-left: 1em;
`;

export function CustomerDetails({ props, close, business_details }) {
	const { customerName } = props;
	const [activeTab, setActiveTab] = useState(0);
	return (
		<Wrapper className='sbt-table'>
			<NavMenuItem>
				<CloseTag
					onClick={(e) => {
						close();
					}}
				>
					<FontAwesomeIcon icon={faChevronLeft} className='mt-1' />{' '}
					<span className='ml-1 mb-2'>return to customers</span>
				</CloseTag>
				<div className='font-medium pb-3 font-20 text-black'>
					Customer Overview{' '}
					<Counter>
						TOTAL TRANSACTION &nbsp;&nbsp; {props.transactionList.length}
					</Counter>
				</div>
				<div className='row'>
					<div className='float-left px-3' style={{ width: '250px' }}>
						<DataWrapper className='bg-white px-3 pt-4'>
							<Wrap>
								<Centered className='pb-3'>
									{customerName && (
										<span className='text-blue text-uppercase'>
											{customerName.split(' ')[0] &&
												customerName.split(' ')[0][0]}
											{customerName.split(' ')[1] &&
												customerName.split(' ')[1][0]}
										</span>
									)}
									{!customerName && (
										<span className='text-blue text-uppercase'>SB</span>
									)}
								</Centered>

								<div className='text-center font-15 font-regular text-capitalized'>
									{props.customerName}
								</div>
								<div className='text-center font-15 email'>
									{props.customerEmail}
								</div>
								<div className='text-center row py-2'>
									<div className='col-6'>
										<div className='black font-10'>Phone Number</div>
										<div className='font-12'>{props.customerPhone}</div>
									</div>
									<div className='col-6'>
										<div className='black font-10'>Date Added</div>
										<div className='font-12'>
											{moment(props.createdAt).format('Y-MM-DD')}
										</div>
									</div>
								</div>
								<div className='text-center'>
									{/* <span className='black-list font-12'>Blacklist customer</span> */}
								</div>
							</Wrap>
						</DataWrapper>
					</div>

					<div className='col px-3'>
						<Nav variant='tabs' defaultActiveKey='link-0'>
							<Nav.Item onClick={() => setActiveTab(0)}>
								<Nav.Link eventKey='link-0'>TRANSACTIONS</Nav.Link>
							</Nav.Item>
							<Nav.Item onClick={() => setActiveTab(1)}>
								<Nav.Link eventKey='link-1'>SUBSCRIPTIONS</Nav.Link>
							</Nav.Item>
						</Nav>
						{activeTab === 0 && (
							<Details props={{ ...props, ...business_details }} />
						)}
						{activeTab === 1 && (
							<div className='center-h text-center'>Not yet available</div>
						)}
					</div>
				</div>
			</NavMenuItem>
		</Wrapper>
	);
}

export default CustomerDetails;
