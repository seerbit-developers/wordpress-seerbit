/** @format */

import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	getTransactions,
	filterTransactions,
	searchTransactions,
	emailReport,
	addRefund,
	replyDispute,
} from '../../actions/postActions';
import moment from 'moment';
import cogoToast from 'cogo-toast';
import { Can } from '../../modules/Can';

import { Dropdown } from 'primereact/dropdown';
import { DebounceInput } from 'react-debounce-input';
import { CSVLink } from 'react-csv';
import PrintPDf from '../../utils/downloadPdf';
import ReportEmail from '../../modules/ReportEmail';
import Overview from '../../utils/analytics/transaction_overview';

import Table from '../../utils/analytics/table';
import Filter from '../../utils/analytics/filter';
import styled from 'styled-components';

import transactions_export from '../../utils/strings/transaction_export.json';
import transactions_json from '../../utils/strings/transaction.json';
import iconFilter from '../../assets/images/svg/filter.svg';
import Mastercard from '../../assets/images/svg/mastercard-icon.svg';
import Bank from '../../assets/images/svg/bank-icon.svg';
import Visa from '../../assets/images/svg/visa-icon.svg';
import Verve from '../../assets/images/verve.png';
import Exchange from '../../assets/images/svg/transfer-icon.svg';
import Search from '../../assets/images/svg/search.svg';

import './css/pre_auth.scss';

const Wrapper = styled.div`
	background: #fff;
	width: 100vw;
	padding-left: 3em;
`;

const NavMenuItem = styled.div`
	padding: 3.5em 4.5em 3.5em 0em;
	font-size: 1.1em;
	color: #676767 !important;
	min-height: calc(100vh - 80px);
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

const Label = styled.div`
	font-size: 12px;
	line-height: 2;
	margin-right: 6em;
	width: 150px;
`;

function formatNumber(num) {
	return Number(num)
		.toFixed(2)
		.toString()
		.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function PreAuthPage(props) {
	const [currency, setCurrency] = useState(
		props.business_details.default_currency
	);
	const exports = transactions_json.exports_type;
	const [transaction_status, setTransactionStatus] = useState();
	const [active_option, setActiveOption] = useState('default');
	const [perPage, setPerPage] = useState(25);
	const [date_value, setDateValue] = useState(0);
	const [search_term, setSearchTerms] = useState();
	const [processing, setProcessing] = useState();
	const [show_date, setShowDate] = useState(false);
	const [show_fliter, setShowFilter] = useState(false);
	const [dates, setDates] = useState([]);
	const [expt, setExport] = useState(); //exports[0].value
	const [showFilter, toggleFilter] = useState(false);
	const [show_mail_report, setShowMailReport] = useState(false);
	const [transaction_data, setTransactionData] = useState();
	const [show_overview, setShowOverview] = useState();
	const [refund_success, setRefundSuccess] = useState(false);

	const onRowClick = () => { };

	const changePage = (
		from = 1,
		cur = currency,
		status = transaction_status
	) => {
		active_option === 'filter'
			? filter(search_term, undefined, undefined, from, perPage, cur, status)
			: props.getTransactions(from, perPage, cur, status);
		setProcessing(true);
	};

	const filter = (
		search_term,
		from_date = dates[0],
		to_date = dates[1],
		page = 1,
		range = perPage,
		cur = currency,
		status = transaction_status
	) => {
		const from = from_date
			? moment(from_date).format('DD-MM-yyyy')
			: '01-01-2019';
		const to = to_date
			? moment(to_date).format('DD-MM-yyyy')
			: moment().format('DD-MM-yyyy');
		setDateValue(`${from} - ${to}`);
		setProcessing(true);
		setActiveOption('filter');
		props.searchTransactions(page, range, from, to, search_term, cur, status);
	};
	const changeRange = (range) => {
		setProcessing(true);
		setPerPage(range);
		const from_date = dates[0]
			? moment(dates[0]).format('DD-MM-yyyy')
			: '01-01-2019';
		const to_date = dates[1]
			? moment(dates[1]).format('DD-MM-yyyy')
			: moment().format('DD-MM-yyyy');
		active_option === 'filter'
			? filter(from_date, to_date, 1, range)
			: props.getTransactions(1, range, currency, transaction_status);
	};

	const refresh = () => {
		setActiveOption('default');
		props.getTransactions(1, perPage, currency, transaction_status);
	};

	const closeEmailReport = () => {
		setShowMailReport(false);
	};

	const sendEmailReport = (param) => {
		const data = {
			reportFields: param,
			emailAddresses: [props.user_details.email],
		};
		setProcessing(true);
		if (data.reportFields.length < 3) {
			cogoToast.error('Please select a minimum of 3 fields');
			setProcessing(false);
			return false;
		} else {
			let from = dates[0]
				? moment(dates[0]).format('DD-MM-yyyy')
				: moment().subtract(1, 'month').format('DD-MM-yyyy');
			let to = dates[1]
				? moment(dates[1]).format('DD-MM-yyyy')
				: moment().subtract(1, 'days').format('DD-MM-yyyy');

			if (moment() === moment(dates[1]))
				to = moment().subtract(1, 'days').format('DD-MM-yyyy');

			const params = {
				start_date: from,
				stop_date: to,
				data,
				location: 'email_report',
			};
			props.emailReport(params);
		}
	};

	const mapTrans = props.transactions.map((x) => {
		return {
			...x,
			refundValue:
				x.refundList && x.refundList.length > 0
					? x.settlementAmount >= x.refundList[0].amount
						? x.refundList[0].amount
						: x.settlementAmount
					: 0,
			refundDate:
				x.refundList && x.refundList.length > 0
					? x.refundList.created_at
					: null,
		};
	});
	let headers = transactions_export.default;

	if (props.business_details.invoice && props.business_details.invoice.active) {
		headers.push(...transactions_export.branch);
	}

	let transactions_array = [
		[
			{ text: 'Status', style: 'tableHeader' },
			{ text: 'Time Stamp', style: 'tableHeader' },
			{ text: 'Amount', style: 'tableHeader' },
			{ text: 'Reference', style: 'tableHeader' },
			{ text: 'Customer', style: 'tableHeader' },
		],
		[
			{ pointer: 'gatewayResponseMessage' },
			{ pointer: 'transactionTimeString' },
			{ pointers: ['currency,amount', ' '] },
			{ pointer: 'transactionRef' },
			{
				pointers: [
					'customer.customerName,customer.customerEmail,customer.customerPhone',
					'\n',
				],
			},
		],
	];

	const downloadTemplate = (option) => {
		if (!option.value) {
			return option.text;
		} else {
			if (option.value === 1)
				return (
					<div className='my-1 font-12 font-weight-bold'>
						<CSVLink
							data={mapTrans}
							headers={headers}
							filename={`${new Date().getTime()}-transactions.csv`}
							className=''
						>
							<span style={{ color: '#333333' }}>{option.text}</span>
						</CSVLink>
					</div>
				);
			else if (option.value === 2)
				return (
					<div
						className='my-1 font-12 font-weight-bold'
						onClick={() =>
							PrintPDf(props.transactions || [], transactions_array)
						}
					>
						{option.text}
					</div>
				);
			else if (option.value === 3)
				return (
					<div
						className='my-1 font-12 font-weight-bold'
						onClick={() => {
							setShowMailReport(true);
						}}
					>
						{option.text}
					</div>
				);
		}
	};

	useEffect(() => {
		props.getTransactions();
		if (props.business_details.default_currency)
			setCurrency(props.business_details.default_currency);
	}, []);

	useEffect(() => {
		if (props.refund && props.location === 'refund') {
			props.getTransactions();
			setRefundSuccess(true);
			cogoToast.success(props.refund.message, {
				position: 'top-right',
			});
		}
		if (props.error_details && props.error_details.error_source === 'refund') {
			cogoToast.error(props.error_details.message, {
				position: 'top-right',
			});
		}

		if (props.dispute && props.location === 'dispute') {
			cogoToast.success('Sent !', { position: 'top-right' });
		}
		if (props.error_details && props.error_details.error_source === 'dispute') {
			cogoToast.error("Request can't be process, try again later", {
				position: 'top-right',
			});
		}

		if (props.email_report && props.location === 'email_report') {
			cogoToast.success(props.email_report.message, {
				position: 'top-right',
			});
		}

		if (
			props.error_details &&
			props.error_details.error_source === 'email_report'
		) {
			cogoToast.error(props.error_details.message, {
				position: 'top-right',
			});
		}
		setProcessing(false);
	}, [
		props.transactions,
		props.business_details.default_currency,
		props.refund,
		props.email_report,
		props.location,
		props.error_details,
		props.transactions_params,
	]);

	return (
		<>
			{!show_overview && (
				<Wrapper className='sbt-transaction'>
					<NavMenuItem>
						<div className='font-medium pb-3 font-20 text-black'>
							Transactions{' '}
							<Counter>
								TOTAL{' '}
								{props.transactions_params && props.transactions_params.rowCount
									? props.transactions_params.rowCount
									: 0}
							</Counter>
						</div>
						<Gap>
							<div classNam='container-fluid'>
								<div className='row'>
									<div className='col-md-6'>
										<div className='row'>
											<Can access={'EXPORT_MERCHANT_REPORT'}>
												<Label className='px-3 fltr'>
													<Dropdown
														optionLabel='text'
														value={transaction_status}
														options={transactions_json.pre_auth}
														onChange={(e) => {
															setTransactionStatus(e.value);
															changePage(undefined, currency, e.value);
															setShowFilter(true);
														}}
														placeholder={'Capture Type'}
														className='font-12 w-150px sbt-border-success'
														showClear={true}
													/>
												</Label>
											</Can>
											{show_date && (
												<span className='px-3'>
													<div className='input-wrap sbt-border-success br-normal px-2 py-1 cursor-pointer'>
														<input
															className='font-12 py-1 w-150px h-30 '
															value={date_value}
															disabled={true}
														/>
														<span
															onClick={() => {
																setShowDate(false);
																setDates([]);
																filter(search_term, null, null);
															}}
														>
															&times;
														</span>
													</div>
												</span>
											)}
											{/* {show_fliter && (
												<span className='px-3'>
													<div className='input-wrap sbt-border-success br-normal px-2 py-1 cursor-pointer'>
														<input
															className='font-12 py-1 w-120px cursor-pointer h-30'
															value={transaction_status}
															disabled={true}
														/>
														<span
															onClick={() => {
																setShowFilter(false);
																setTransactionStatus('ALL');
																changePage(1, currency, 'ALL');
															}}
														>
															&times;
														</span>
													</div>
												</span>
											)} */}
										</div>
									</div>
									<div className='col-md-6'>
										<RightComponent>
											<div className='row'>
												<span className='font-12 font-light px-3'>
													<div
														onMouseUp={() => toggleFilter(!showFilter)}
														className='mt-3'
													>
														<img src={iconFilter} /> Filter
													</div>
												</span>
												<span className='font-12 font-light px-3'>
													<div className='input-wrap sbt-border-success br-normal px-2 py-1'>
														<DebounceInput
															minLength={2}
															debounceTimeout={1000}
															className='font-12 py-2  w-200px sbt-border-success'
															placeholder='Transaction references'
															aria-label='Search'
															onChange={(e) => {
																setSearchTerms(e.target.value);
																filter(e.target.value);
															}}
														/>
														<span>
															<img src={Search} />
														</span>
													</div>
												</span>
												<span className='font-12 font-light px-3 export_data'>
													<Dropdown
														optionLabel='text'
														value={expt}
														options={exports}
														onChange={(e) => {
															setExport(e.target.value);
														}}
														itemTemplate={downloadTemplate}
														placeholder='Export Data'
														className='sbt-border-success'
														showClear={true}
													/>
												</span>
											</div>
										</RightComponent>
									</div>
								</div>
							</div>
							{show_mail_report && (
								<ReportEmail
									show={show_mail_report}
									process={processing}
									close={closeEmailReport}
									sendReport={sendEmailReport}
									email={
										props.user_details.email ? props.user_details.email : ''
									}
								/>
							)}

							{showFilter && (
								<Filter
									setDates={(val) => setDates(val)}
									dates={dates}
									filter={(from_date, to_date) => {
										filter(search_term, from_date, to_date);
										setShowDate(true);
									}}
									allowedCurrency={props.business_details.allowedCurrency}
									currency={currency}
									setCurrency={(cur) => setCurrency(cur)}
									changePage={(cur, status) => changePage(1, cur, status)}
									setTransactionStatus={(status) =>
										setTransactionStatus(status)
									}
									transaction_status={transaction_status}
									setShowFilter={(bol) => setShowFilter(bol)}
								/>
							)}
						</Gap>
						<Table
							data={props.transactions}
							totalRecords={props.transactions_params.rowCount}
							setRange={(len) => changeRange(len)}
							perPage={perPage}
							currentpage={(props.transactions_params.currentpage)}
							changePage={(page) => {
								changePage(page);
							}}
							header={[
								{
									name: 'Capture Date',
									pointer: 'transactionTimeString',
									format: 'Y-MM-DD hh:mm A',
								},
								{
									name: 'Customer Name',
									pointer: 'customer.customerName',
								},
								{
									name: 'Reference',
									pointer: '',
									func: (data) => (
										<span
											className='cursor-pointer text-uppercase'
											style={{ color: '#007BFF' }}
											onClick={() => {
												setShowOverview(data);
												setTransactionData(data);
											}}
										>
											{data.transactionRef}
										</span>
									),
									copy: true,
								},
								{
									name: 'Amount',
									pointer: '',
									func: (props) => (
										<span
											className={` mb-1 ${props.refundList && props.refundList.length > 0
													? 'refund'
													: (props.gatewayResponseMessage === "APPROVED" ||
														props.gatewayResponseMessage === "Successful") &&
														(props.gatewayResponseCode === "00") &&
														(props.status === "COMPLETED" || props.status === "SETTLED")
														? 'success'
														: ['SM_X23', 'SM_A'].indexOf(
															props.gatewayResponseCode
														) > -1
															? 'default'
															: 'failed'
												}-transaction`}
										>
											{props.currency} {formatNumber(props.amount)}
										</span>
									),
								},
								{
									name: 'Method',
									pointer: '',
									func: (props) => (
										<span className='number'>
											<img
												width='25px'
												height='auto'
												src={
													props.analytics.channel === 'account' ||
														props.analytics.channel === 'ACCOUNT'
														? Bank
														: props.analytics.channelType == 'master'
															? Mastercard
															: props.analytics.channelType == 'visa'
																? Visa
																: props.analytics.channelType == 'verve'
																	? Verve
																	: props.analytics.channel === 'card'
																		? Mastercard
																		: Exchange
												}
												className='mr-2 mb-1'
											/>
											{props.analytics.channel === 'card'
												? props.maskNumber &&
												props.maskNumber?.substring(
													props.maskNumber.length - 9
												)
												: props.analytics.channel === 'account' ||
													props.analytics.channel === 'ACCOUNT'
													? props.analytics.channelType
													: props.analytics.channel}
										</span>
									),
								},
								{
									name: 'Authorization Date',
									pointer: 'transactionTimeString',
									format: 'Y-M-DD h:m:s A',
								},
								{
									name: 'Capture Type',
									pointer: '',
									func: (props) => (
										<span style={{ color: '#007BFF' }}>Manual</span>
									),
								},
								{
									name: 'Status',
									pointer: '',
									func: (props) => {
										return (
											<span>Authorized</span>
											// <span
											// 	className={` mb-1 ${
											// 		props.refundList && props.refundList.length > 0
											// 			? 'refund'
											// 			: props.gatewayResponseMessage === 'APPROVED'
											// 			? 'success'
											// 			: ['SM_X23', 'SM_A'].indexOf(
											// 					props.gatewayResponseCode
											// 			  ) > -1
											// 			? 'default'
											// 			: 'failed'
											// 	}-transaction`}
											// >
											// 	{props.refundList && props.refundList.length > 0
											// 		? 'Refund'
											// 		: props.gatewayResponseMessage === 'APPROVED'
											// 		? 'Successful'
											// 		: ['SM_X23', 'SM_A'].indexOf(
											// 				props.gatewayResponseCode
											// 		  ) > -1
											// 		? 'Pending'
											// 		: 'Failed'}
											// </span>
										);
									},
								},
							]}
							onRowClick={onRowClick}
						/>
					</NavMenuItem>
				</Wrapper>
			)}
			{show_overview && (
				<div>
					<Overview
						props={transaction_data}
						setShowOverview={() => setShowOverview(false)}
						addRefund={(params) => props.addRefund(params)}
						refund_success={refund_success}
						closeSuccess={() => setRefundSuccess(false)}
						replyDispute={props.replyDispute}
					/>
				</div>
			)}
		</>
	);
}

PreAuthPage.propTypes = {
	getTransactions: PropTypes.func.isRequired,
	addRefund: PropTypes.func.isRequired,
	replyDispute: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
	transactions: state.data.transactions,
	transactions_params: state.data.transactions_params,
	error_details: state.data.error_details,
	searching_transactions: state.data.searching_transactions,
	user_details: state.data.user_details,
	business_details: state.data.business_details,
	refund: state.data.refund,
	location: state.data.location,
	email_report: state.data.email_report,
	dispute: state.data.dispute,
});

export default connect(mapStateToProps, {
	getTransactions,
	filterTransactions,
	searchTransactions,
	emailReport,
	addRefund,
	replyDispute,
})(PreAuthPage);
