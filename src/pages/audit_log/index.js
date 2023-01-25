/** @format */

import React, { memo, useState } from 'react';

import moment from 'moment';
import { Calendar } from 'primereact/calendar';

import styled from 'styled-components';
import { Paginator } from 'primereact/paginator';

import { Dropdown } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import CollapseRight from '../../assets/images/svg/collapse-right.svg';
import Print from '../../assets/images/svg/print.svg';

import './css/audit_log.scss';

import Category from '../../modules/category';

const Wrapper = styled.div`
	background: #fff;
	width: 100vw;
	padding-left: 3em;
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
const Gap = styled.div`
	padding-bottom: 2em;
	padding-top: 1em;
`;
const RightComponent = styled.div`
	float: right;
`;

const Border = styled.div`
	border: 1px solid #d2d3d8;
	padding-bottom: 0.75em;
	padding-top: 0.75em;
	border-radius: 3px;
`;

function formatNumber(num) {
	return Number(num)
		.toFixed(2)
		.toString()
		.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function AuditLog({ history }) {
	const refunds = [
		{
			time: new Date().getTime(),
			action: 'BUSINESS TRANSACTION FEE UPDATED',
			user: 'superadmin@seerbit.com',
		},
		{
			time: new Date().getTime(),
			action: 'BUSINESS TRANSACTION FEE UPDATED',
			user: 'superadmin@seerbit.com',
		},
		{
			time: new Date().getTime(),
			action: 'BUSINESS TRANSACTION FEE UPDATED',
			user: 'superadmin@seerbit.com',
		},
		{
			time: new Date().getTime(),
			action: 'BUSINESS TRANSACTION FEE UPDATED',
			user: 'superadmin@seerbit.com',
		},
		{
			time: new Date().getTime(),
			action: 'BUSINESS TRANSACTION FEE UPDATED',
			user: 'superadmin@seerbit.com',
		},
	];
	const quantities = [
		{ key: 1, text: '10', value: 10 },
		{ key: 2, text: '25', value: 25 },
		{ key: 3, text: '50', value: 50 },
		{ key: 1, text: '100', value: 100 },
	];
	const [size, setSize] = useState(10);
	const [page, setPage] = useState(10);

	const [showCategory, setCategory] = useState(false);
	const [dates, setDates] = useState([
		new Date('2020-01-23'),
		new Date('2020-05-23'),
	]);

	const onRowClick = () => {};
	return (
		<Wrapper className='sbt-audit-log'>
			<NavMenuItem>
				<div className='font-medium pb-3 font-20 text-black'>
					Audit Log <Counter>TOTAL 5</Counter>
				</div>{' '}
				<div className='row'>
					<div className='col-md-6'>
						<div className='row'>
							<div className='col-12'>
								<Gap>
									<div classNam='container-fluid'>
										<RightComponent>
											<span className='px-3'>
												<Calendar
													selectionMode='range'
													value={dates}
													onChange={(e) => setDates(e.value)}
													className='font-12'
													showIcon={true}
													hideOnDateTimeSelect={true}
												></Calendar>
											</span>
										</RightComponent>
									</div>
								</Gap>
							</div>
							<div className='col-12 px-0'>
								<div className='border br-normal black p-3 my-3'>
									<div
										className='row m-0 py-4'
										style={{ background: 'F8FAFF' }}
									>
										<div className='col-2 font-15 border-right text-center'>
											<div className='pb-2'>2</div>
											<div>secs ago</div>
										</div>
										<div className='col'>
											<div className='font-16 pb-2'>
												BUSINESS TRANSACTION FEE UPDATED
											</div>
											<div className='text-muted font-13'>
												By superadmin@seerbit.com
											</div>
										</div>
										<div className='col-2 text-right font-weight-lighter pt-3'>
											<img
												src={CollapseRight}
												className='font-weight-lighter cursor-pointer'
											/>
										</div>
									</div>
									<div className='m-0 row py-4'>
										<div className='col-2 font-15 border-right text-center'>
											<div className='pb-2'>2</div>
											<div>secs ago</div>
										</div>
										<div className='col'>
											<div className='font-16 pb-2'>
												BUSINESS TRANSACTION FEE UPDATED
											</div>
											<div className='text-muted font-13'>
												By superadmin@seerbit.com
											</div>
										</div>
										<div className='col-2 text-right font-weight-lighter pt-3'>
											<img
												src={CollapseRight}
												className='font-weight-lighter cursor-pointer'
											/>
										</div>
									</div>
									<div
										className='row m-0 py-4'
										style={{ background: 'F8FAFF' }}
									>
										<div className='col-2 font-15 border-right text-center'>
											<div className='pb-2'>2</div>
											<div>secs ago</div>
										</div>
										<div className='col'>
											<div className='font-16 pb-2'>
												BUSINESS TRANSACTION FEE UPDATED
											</div>
											<div className='text-muted font-13'>
												By superadmin@seerbit.com
											</div>
										</div>
										<div className='col-2 text-right font-weight-lighter pt-3'>
											<img
												src={CollapseRight}
												className='font-weight-lighter cursor-pointer'
											/>
										</div>
									</div>
									<div className='m-0 row py-4'>
										<div className='col-2 font-15 border-right text-center'>
											<div className='pb-2'>2</div>
											<div>secs ago</div>
										</div>
										<div className='col'>
											<div className='font-16 pb-2'>
												BUSINESS TRANSACTION FEE UPDATED
											</div>
											<div className='text-muted font-13'>
												By superadmin@seerbit.com
											</div>
										</div>
										<div className='col-2 text-right font-weight-lighter pt-3'>
											<img
												src={CollapseRight}
												className='font-weight-lighter cursor-pointer'
											/>
										</div>
									</div>
									<div
										className='row m-0 py-4'
										style={{ background: '#F8FAFF' }}
									>
										<div className='col-2 font-15 border-right text-center'>
											<div className='pb-2'>2</div>
											<div>secs ago</div>
										</div>
										<div className='col'>
											<div className='font-16 pb-2'>
												BUSINESS TRANSACTION FEE UPDATED
											</div>
											<div className='text-muted font-13'>
												By superadmin@seerbit.com
											</div>
										</div>
										<div className='col-2 text-right font-weight-lighter pt-3'>
											<img
												src={CollapseRight}
												className='font-weight-lighter cursor-pointer'
											/>
										</div>
									</div>
								</div>
								<div className='container-fluid px-4'>
									<div className='row'>
										<div className='col-6'>
											<div className='font-11 black font-light row'>
												<Dropdown>
													<span className='pt-2'>
														Show {size}{' '}
														<Dropdown.Menu
															style={{ maxWidth: '50px', fontSize: '11px' }}
														>
															{quantities.map((data, key) => (
																<Dropdown.Item
																	onClick={() => setSize(data.value)}
																	key={key}
																>
																	{data.text}
																</Dropdown.Item>
															))}
														</Dropdown.Menu>{' '}
														per page{' '}
													</span>
													<Dropdown.Toggle className='px-0' variant={'none'}>
														{/*<FontAwesomeIcon icon={faCaretDown} />*/}
													</Dropdown.Toggle>
												</Dropdown>
											</div>
										</div>
										<div className='col-6'>
											<RightComponent>
												<Paginator
													first={page}
													rows={20}
													totalRecords={120}
													onPageChange={(e) => setPage(e.first)}
												></Paginator>
											</RightComponent>{' '}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='col-md-5 p-5'>
						<div
							className=' br-normal p-3'
							style={{
								border: '1px solid #B8D6F2',
								boxShadow: '0px 4px 1px #F5F7FA',
							}}
						>
							<div className='row py-2'>
								<div className='col-6 float-left font-16 font-weight-bold '>
									<span className='cursor-pointer'>Audit Details</span>
								</div>
								<div className='col-6 text-right'>&times;</div>
							</div>
							<div className='row'>
								<div className='col-md-6'>
									<div className='font-14'>
										<br />
										<div className='black font-12'>Date &amp; Time</div>
										<div className='text-muted font-13'>
											{moment().format('D MMM, Y - h:mA')}
										</div>
									</div>
								</div>
								<div className='col-md-6'>
									<div className='font-14'>
										<br />
										<div className='black font-12'>Email</div>
										<div className='text-muted font13'>
											{'superadmin@seerbit.com'}
										</div>
									</div>
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-11'>
									<div className='font-14'>
										<br />
										<div className='black font-12'>Account</div>
										<div className='text-muted font-13'>
											Business transaction fee updates
										</div>
									</div>
								</div>
							</div>
							<div className='row'>
								<div className='col-sm-12 py-3'>
									<img src={Print} className='float-right' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</NavMenuItem>
			<Category showCategory={showCategory} close={() => setCategory(false)} />
		</Wrapper>
	);
}

export default AuditLog;
