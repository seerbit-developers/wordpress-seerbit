/** @format */

import React, { useEffect, useState } from 'react';
import Table from 'utils/analytics/table';
import styled from 'styled-components';
import {connect, useSelector} from "react-redux";
import {
	getOrdersByProduct, getProductList,
} from 'actions/frontStoreActions';
import Edit from 'assets/images/svg/pen';
import Trash from 'assets/images/svg/trash';
import Copy from 'assets/images/svg/copy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { alertExceptionError, alertLoading, alertSuccess} from "modules/alert";
import {useTranslation} from "react-i18next";
import {AppModalCenter} from "components/app-modal";
import {Button} from "react-bootstrap";
import {deleteProduct} from "services/productService";
import {handleCopy} from "utils";

const CloseTag = styled.div`
	font-size: 0.9em;
	color: #c2c2c2 !important;
	display: flex;
	align-items: center;
	cursor: pointer;
	.icon {
		font-size: 1.2em;
	}
	padding-bottom: 3em;
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

const onRowClick = () => { };

export function ProductDetails({
	close,
	setShowProduct,
	business_details,
	getOrdersByProduct,
	orders,
	loading,
	getProductList
}) {
	const {t} = useTranslation()
	const [perPage, setPerPage] = useState(25);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const props = useSelector(state=>state.frontStore.product_details)
	useEffect(() => {
		getOrdersByProduct(0, perPage, props.productRef)
	}, [])
	const changePage = (from = 0) => {
		getOrdersByProduct(from, perPage, props.productRef)
	};
	const setRange = (page = perPage) => {
		getOrdersByProduct(0, page, props.productRef)
	};

	const onDelete = async () => {
		const alert = alertLoading()
		deleteProduct(props.id).then(res=>{
			alert()
			if (res.responseCode === '00'){
				alertSuccess('Success');
				getProductList();
				close();
			}
		}).catch(err=> {
			{
				alertExceptionError(err);
				alert()
			}
		})
	}

	return (
		<div className="page-container py-5">
			<div>
				<AppModalCenter
					close={() => setConfirmDelete(false)}
					isOpen={confirmDelete}
				>
					<div className='d-flex align-items-center mb-2'>
						<h4 className='d-inline-block mr-2 mb-0'>{t('Confirm Action')} </h4>
					</div>

					<div className='mb-3'>
						{t('You are about to delete a product.')}
					</div>
					<div className='d-flex align-items-center justify-content-between'>
						<Button
							className="brand-btn w-200px cursor-pointer"
							onClick={onDelete}
						>
							<span className='mr-2'>⁉️</span> {' '} {t('Confirm')}
						</Button>
						<Button
							className="brand-btn-danger w-200px cursor-pointer ml-4"
							onClick={()=>setConfirmDelete(false)}
						>
							{t('Cancel')}
						</Button>
					</div>
				</AppModalCenter>
				<CloseTag
					onClick={(e) => {
						close();
					}}
				>
					<FontAwesomeIcon icon={faChevronLeft}  />{' '}
					<span className='ml-1'>{t('return to products')}</span>
				</CloseTag>
				<div className='font-medium font-20 text-black'>
					<span className='mr-5'>{props && props.productName}</span>
				</div>
				<Gap>
					<div className='container-fluid'>
						<div className='row'>
							<div className='col-4 border br-normal'>
								<div className='row py-2'>
									<div className='col-6 text-dark font-14'>
										<span
											className='cursor-pointer'
											onClick={() => setShowProduct(true)}
										>
											<img src={Edit} className='pr-2' />
											{t('edit')}
										</span>
									</div>
									<div className='col-6 text-right'>
										<span onClick={() => setConfirmDelete(true)}>
											<img src={Trash} />
										</span>
									</div>
								</div>
								<div className='row'>
									<div className='col-4'>
										<div className='font-14'>
											<br />
											<div className='black font-15'>{t('Category')}</div>
											<div className='text-muted font-13'>
												{props.category && props.category.name}
											</div>
										</div>
									</div>
									<div className='col-4'>
										<div className='font-14'>
											<br />
											<div className='black font-15'>{t('Stock/Quantity')}</div>
											<div className='text-muted font-13'>{props.quantity}</div>
										</div>
									</div>
									<div className='col-4'>
										<div className='font-14'>
											<br />
											<div className='black font-15'>{t('Price')}</div>
											<div className='text-muted font13'>{`${business_details.default_currency} ${props.amount}`}</div>
										</div>
									</div>
								</div>
								<div className='row mb-2'>
									<div className='col-11'>
										<div className='font-14'>
											<br />
											<div className='black font-15'>{t('Description')}</div>
											<div className='text-muted font-13'>
												{props.productDescription?.substring(0, 40)}
											</div>
										</div>
									</div>
								</div>
								<div className='row'>
									<div className='col-sm-12 py-3'>
										<div
											className='input-group mb-3 form-group h-40'
											style={{
												border: '1px solid #b9c0c7',
												borderRadius: '5px',
												padding: '5px',
											}}
										>
											<input
												className='form-control border-none h-25px'
												value={props.productCheckoutLink}
											/>
											<div className='input-group-append'>
												<button
													className='btn pt-1 font-12'
													style={{ background: '#F5F7FA' }}
													onClick={(e) =>
														handleCopy(props.productCheckoutLink)
													}
												>
													<img src={Copy} width="15" height="15" /> {t('copy')}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Gap>
				<div className="col-12 p-0 m-0 mb-3">
					<div className="row">
						<div className="col-6">
							<div className='font-medium pb-3 font-20 text-black'>
								{t('Orders')} <Counter>{t('TOTAL')} {(orders && orders.rowCount) || 0}</Counter>
							</div>
						</div>
						<div className="col-6">
							{/*<RightComponent>*/}
							{/*	<span className="font-12 font-light px-3 export_data">*/}
							{/*		<Dropdown*/}
							{/*			optionLabel="text"*/}
							{/*			value={expt}*/}
							{/*			options={exports}*/}
							{/*			onChange={(e) => {*/}
							{/*				setExport(e.target.value);*/}
							{/*			}}*/}
							{/*			itemTemplate={downloadTemplate}*/}
							{/*			placeholder={t('Export Data')}*/}
							{/*			className="font-12 text-left w-200px sbt-border-success py-1"*/}
							{/*			showClear={true}*/}
							{/*		/>*/}
							{/*	</span>*/}
							{/*</RightComponent>*/}
						</div>
					</div>
				</div>
				<Table
					loading={loading}
					data={(orders && orders.payload) || []}
					totalRecords={(orders && orders.rowCount) || 0}
					perPage={perPage}
					currentpage={(orders && orders.currentPage) || "0"}
					changePage={changePage}
					setRange={(data) => {
						setRange(data);
						setPerPage(data);
					}}
					header={[
						{
							name: t('Date'),
							pointer: 'profileAt',
							format: 'Y/MM/DD hh:mm:ss A',
						},
						{
							name: t('Customer Detail'),
							pointer: 'customerContactDetails',
						},
						{
							name: t('Reference'),
							pointer: 'reference',
						},
						{ name: 'Quantity', pointer: 'quantity' },

						{
							name: t('Amount'),
							pointer: 'amount',
							func: props => `${business_details.default_currency} ${props}`
						},
						{
							name: t('Status'),
							pointer: 'status',

						},
					]}
					onRowClick={onRowClick}
				/>
			</div>
		</div>
	);
}

const mapStateToProps = (state) => ({
	business_details: state.data.business_details,
	orders: state.frontStore.product_orders,
	loading: state.frontStore.loading_product_orders,
});

export default connect(mapStateToProps, {
	getOrdersByProduct,
	getProductList
})(ProductDetails);
