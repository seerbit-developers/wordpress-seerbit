/** @format */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	getProducts,
	addProduct,
	updateProduct,
	addCategory,
	updateCategory,
	searchProducts,
	uploadProductImage,
	clearState
} from 'actions/postActions';
import {getProductList,getProductCategories, dispatchProductDetails} from 'actions/frontStoreActions';
import { Dropdown } from 'primereact/dropdown';
import { DebounceInput } from 'react-debounce-input';
import { CSVLink } from 'react-csv';
import { Button } from 'react-bootstrap';
import Product from './components/product';
import CreateProduct from './components/create_product';
import Category from '../../modules/category';
import Overview from './components/product_overview';
import ConfirmAction from '../../modules/confirmAction';
import styled from 'styled-components';
import Search from '../../assets/images/svg/search.svg';
import Copy from '../../assets/images/svg/copy.svg';
import './css/product.scss';
import AppTable from "components/app-table";
import useWindowSize from "components/useWindowSize";
import { htmlEncode } from "utils";
import {alertError} from "modules/alert";
import {handleCopy} from "utils";
import {useTranslation} from "react-i18next";
import {deleteProduct} from "services/productService";
import {hasAccess} from "modules/Can";

const RightComponent = styled.div`
	float: right;
`;

function formatNumber(num) {
	return Number(num)
		.toFixed(2)
		.toString()
		.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function ProductPage({business_details,product_details,permissions,dispatchProductDetails, ...props}) {
	const [currency, setCurrency] = useState(
		business_details.default_currency
	);
	const [product, setProduct] = useState();
	const [transaction_status, setTransactionStatus] = useState('ALL');
	const [perPage, setPerPage] = useState(25);
	const [search_term, setSearchTerms] = useState();
	const [processing, setProcessing] = useState();
	const [expt, setExport] = useState();
	const [show_product, setShowProduct] = useState(false);
	const [show_overview, setShowOverview] = useState();
	const [product_categories, setProductCategories] = useState([]);
	const [show_category, setShowCategory] = useState(false);
	const [productProcessing, setProductProcessing] = useState(false);
	const [categoryProcessing, setCategoryProcessing] = useState(false);
	const [type, setType] = useState('Create');
	const [show_confirm_delete, setShowConfirmDelete] = useState(false);
	const [uploadProcess, setUploadProcess] = useState(false);
	const [upload_image, setUploadImage] = useState();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const size = useWindowSize()
	const {t} = useTranslation()

	const { width, height } = size;

	const exports = [
		{
			text: t('Export to Excel'),
			value: 1,
			label: 1,
		}
	];

	const changePage = (from = 1, status = transaction_status,search_terms) => {
			props.getProductList(from-1, perPage,status === 'ALL' ? false : status, search_terms ? htmlEncode(search_terms.trim().replace(/\s/g, '')) : '' );
	};

	const search = (search_terms) => {
		props.getProductList(0, perPage,transaction_status === 'ALL' ? false : transaction_status, htmlEncode(search_terms.trim().replace(/\s/g, '')) );
	};

	const headers = [
		{ label: t('Product Name'), key: 'productName' },
		{ label: t('Product Description'), key: 'productDescription' },
		{ label: t('Product Code'), key: 'productCode' },
		{ label: t('Product Code Name'), key: 'productNameCode' },
		{ label: t('Amount'), key: 'amount' },
		{ label: t('Quantity'), key: 'quantity' },
		{ label: t('Product Link'), key: 'productLink' },
		{ label: t('Status'), key: 'status' },
		{ label: t('Product Category'), key: 'category.name' },
		{ label: t('Category Type'), key: 'category.type' },
		{ label: t('Product Category Code'), key: 'category.nameCode' },
	];

	const downloadTemplate = (option) => {
		if (!option.value) {
			return option.text;
		} else {
			if (option.value === 1)
				return (
					<div className='my-1 font-12 font-weight-bold'>
						<CSVLink
							data={props.products && props.products.payload || []}
							headers={headers}
							filename={`${new Date().getTime()}-products.csv`}
							className=''
						>
							<span style={{ color: '#333333' }}>{option.text}</span>
						</CSVLink>
					</div>
				);
		}
	};

	useEffect(() => {
		props.getProductList();
		props.getProductCategories();
		props.clearState({ get_products_order: null });
		if (business_details.default_currency)
			setCurrency(business_details.default_currency);
	}, []);

	useEffect(() => {
		if (props.product_categories) {
			const cat =
				(props.product_categories &&
					props.product_categories.payload &&
					props.product_categories.payload.map((x) => {
						return { ...x, text: x.name, value: x.id };
					}, [])) ||
				[];
			cat.unshift({ text: ' ' });
			setProductCategories(cat || []);
		}


		setProcessing(false);
	}, [
		props.products,
		business_details.default_currency,
		props.refund,
		props.email_report,
		props.location,
		props.product_categories,
	]);

	useEffect(() => {
		if (
			props.error_details &&
			props.error_details.error_source === 'product_image_upload'
		) {
			setUploadProcess(false);
			alertError(props.error_details.message || props.error_details.responseMessage);
			props.clearState({ product_image_upload: null });
			setUploadImage()
		}

		if (
			props.error_details &&
			props.error_details.error_source === 'new_product'
		) {
			setProductProcessing(false);
			alertError(props.error_details.message || "Can't complete action at the moment");
			props.clearState({ new_product: null });
		}

		if (
			props.error_details &&
			props.error_details.error_source === 'update_product'
		) {
			setProductProcessing(false);
			alertError(props.error_details.message || "Can't complete action at the moment");
			props.clearState({ update_product: null });
		}


		if (
			props.error_details &&
			props.error_details.error_source === 'delete_product'
		) {
			setProductProcessing(false);

			alertError(props.error_details.message || "Can't complete action at the moment");
			props.clearState({ delete_product: null });
		}
		setProcessing(false);

	}, [props.error_details]);

	const onViewProductDetails = (p) => {
		dispatchProductDetails(p)
		setShowOverview(true);
		setProduct(p);
		setType('Edit');
	}
	const [fullColumns] = React.useState(
		[
			{
				name: t('Product Thumbnail'),
				style: { width: '200px' },
				cell: props => (
					<img src={
						props && props.productImages && Array.isArray(props.productImages) ?
							props.productImages[props.productImages.length-1] && props.productImages[props.productImages.length-1].productImageUrl
							: ''
					} width="60" height="60" />
				)
			},
			{
				name: t('Name'),
				cell: (props) => (
					<span
						style={{ width: "150px" }}
						className='cursor-pointer seerbit-color'
						onClick={() => {
							onViewProductDetails(props)
						}}
					>
						{props.productName}
					</span>
				),
			},
			{
				name: t('Stock'),
				cell: (props) => (
					<span>
						{props.stockType === 'STOCK' && props.enableStock ? props.quantity : props.isDepletable ? (props.quantity == 0 ? 'Out of Stock' : props.quantity)  : 'Unlimited'}
					</span>
				),
			},
			{
				name: t('Amount'),
				selector: 'amount',
				cell: (props) =>
					<div className="cut-text">
						{currency} {formatNumber(props.amount)}
					</div>,
			},
			{
				name: t('Status'),
				cell: (props) => (
					<span className='number d-flex align-items-center'>
						<span
							className={`round ${props.status === true ? 'success' : 'default'
								} rounded-circle`}
						/>
						<span>{props.status === true ? t('active') : t('inactive')}</span>
					</span>
				),
			},
			{
				name: t('Product Link'),
				cell: (props) => (
					<span className="row p-0 m-0">
						<div className="cut-text">
							{props && props.productCheckoutLink !== null ? <a href={props.productCheckoutLink} target="_blank">{props.productCheckoutLink}</a> : t("Not Available")}
						</div>
						<img
							src={Copy}
							width="15"
							height="15"
							className="cursor-pointer"
							onClick={(e) => {
								handleCopy(props.productCheckoutLink);
							}}
						/>
					</span>
				),
			},
		]
	);

	const onAddProduct = () => {
		if (hasAccess('ADD_PRODUCT',permissions)) {
			setShowCreateModal(true);
		}else {
			alertError('You do not have permission(ADD PRODUCT) to Add a product')
		}
	}

	return (
		<>
			{!show_overview && (
				<div className="page-container py-5">
						<div className='font-medium pb-3 font-20 text-black'>
							{t("Product Center")}
						</div>
				<div className='d-flex justify-content-between mb-5'>
									<div>
											<Button
												variant='xdh'
												height={'50px'}
												className='brand-btn font-12'
												style={{ width: '200px' }}
												onClick={onAddProduct}
											>
												{t("Add Product")}
											</Button>
									</div>
									<div>
										<RightComponent>
											<div className='row'>
												{/* <span className='font-12 font-light px-3'>
													<div
														onMouseUp={() => toggleFilter(!showFilter)}
														className='mt-3'
													>
														<img src={iconFilter} /> Filters
													</div>
												</span> */}
												<span className='font-12 font-light px-3'>
												<div className="input-wrap sbt-border-success br-normal py-1 px-2 mr-3">
														<DebounceInput
															minLength={3}
															debounceTimeout={1000}
															className="font-12 text-left"
															placeholder={t('Search product name')}
															aria-label='Search'
															onChange={(e) => {
																setSearchTerms(e.target.value);
																search(e.target.value);
															}}
														/>
														<span>
															<img src={Search} />
														</span>
													</div>
												</span>
												<span className="font-12 font-light px-3 export_data">
													<Dropdown
														optionLabel='text'
														value={expt}
														options={exports}
														onChange={(e) => {
															setExport(e.target.value);
														}}
														itemTemplate={downloadTemplate}
														placeholder={t('Export Data')}
														className="font-12 text-left w-200px sbt-border-success py-1"
														showClear={true}
													/>
												</span>
											</div>
										</RightComponent>
									</div>
								</div>

              <AppTable
                  columns={fullColumns}
				  fixedLayout={false}
                  headerStyle={{textTransform: 'uppercase'}}
                  loading={props.loading}
                  paginate={props.products ? props.products.rowCount ? Math.ceil(props.products.rowCount / perPage) > 1 : false : false}
                  perPage={perPage}
                  totalPages={props.products ? props.products.rowCount ? Math.ceil(props.products.rowCount / perPage) : 0 : 0}
                  changePage={(page) => {
                    changePage(page.activePage);
                  }}
                  currentPage={
                    props.products &&
                    parseInt(props.products.currentPage) + 1
                  }
                  data={
                    props.products &&
                    props.products.payload ?
                        props.products.payload : []
                  }
              />

					<CreateProduct
						isOpen={showCreateModal}
						close={() => {
							setShowCreateModal(false);
						}}
						getProducts={props.getProductList}
						product_categories={product_categories}
						setShowCategory={setShowCategory}
						currency={currency}
					/>
				</div>
			)}


				<Product
					isOpen={show_product && !show_category}
					upload_image={upload_image}
					setUploadImage={setUploadImage}
					id={props && props.product && props.product.id || undefined}
					show_product={show_product}
					close={() => {
						setShowProduct(false);
					}}
					getProducts={props.getProductList}
					product_categories={product_categories}
					setProductProcessing={setProductProcessing}
					productProcessing={productProcessing}
					uploadProductImage={props.uploadProductImage}
					product_image_upload={props.product_image_upload}
					setUploadProcess={setUploadProcess}
					uploadProcess={uploadProcess}
					type={type}
					product={product_details}
					addProduct={props.addProduct}
					updateProduct={props.updateProduct}
					setShowCategory={setShowCategory}
					currency={currency}
				/>

			{show_category && (
				<Category
					show_category={show_category}
					close={() => setShowCategory(false)}
					product_categories={product_categories}
					setCategoryProcessing={setCategoryProcessing}
					categoryProcessing={categoryProcessing}
					type='Create'
					addCategory={props.addCategory}
				/>
			)}
			{show_overview && (
				<Overview
					props={product}
					close={() => {
						setShowOverview(false);
						props.clearState({ get_products_order: null });
					}}
					setShowProduct={setShowProduct}
				/>
			)}
			{show_confirm_delete && (
				<ConfirmAction
					show={show_confirm_delete}
					title='Confirm action'
					message={`You are about to delete ${product.productName.toUpperCase()}.`}
					handler={() =>
						deleteProduct(product.id)
					}
					close={(e) => setShowConfirmDelete(false)}
				/>
			)}
		</>
	);
}

ProductPage.propTypes = {
	getProducts: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
	products: state.data.products,
	loading: state.data.loading_products,
	error_details: state.data.error_details,
	user_details: state.data.user_details,
	business_details: state.data.business_details,
	location: state.data.location,
	product_categories: state.frontStore.product_categories,
	product_details: state.frontStore.product_details,
	product: state.data.product,
	product_category: state.data.product_category,
	new_category: state.data.new_category,
	product_image_upload: state.data.product_image_upload,
	permissions:state.auth.permissions
});

export default connect(mapStateToProps, {
	getProducts,
	getProductCategories,
	addProduct,
	updateProduct,
	addCategory,
	updateCategory,
	searchProducts,
	uploadProductImage,
	clearState,
	getProductList,
	dispatchProductDetails
})(ProductPage);
