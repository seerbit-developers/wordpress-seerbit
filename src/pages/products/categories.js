/** @format */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from "react-i18next";
import {
	getProductCategories,
} from 'actions/frontStoreActions';
import { Button } from 'react-bootstrap';
import Category from '../../modules/category';
import Table from '../../utils/analytics/table';
import styled from 'styled-components';
import Pen from '../../assets/images/svg/pen.svg';
import Delete from '../../assets/images/svg/trash.svg';
import './css/product.scss';
import {AppModalCenter} from "components/app-modal";
import {alertExceptionError, alertLoading, alertSuccess} from "modules/alert";
import {deleteCategory} from "services/productService";

const Gap = styled.div`
	padding-bottom: 2em;
	padding-top: 1em;
`;
export function CategoryPage({product_categories, ...props}) {
	const [perPage, setPerPage] = useState(25);
	const [show_category, setShowCategory] = useState(false);
	const [category, setCategory] = useState();
	const [type, setType] = useState('Create');
	const [confirmDelete, setConfirmDelete] = useState(false);
	const {t} = useTranslation()

	const changePage = (from = 1) => {
		props.getProductCategories({ from, perPage });
	};

	const catSetter = (e, data) => {
		setType(e);
		setCategory(data);
		setShowCategory(true);
	};

	useEffect(() => {
		props.getProductCategories();
	}, []);

	const onDelete = async () => {
		const alert = alertLoading()
		deleteCategory(category.id)
			.then(res=>{
			alert()
			setConfirmDelete(false);
			if (res.responseCode === '00'){
				alertSuccess('Success');
				props.getProductCategories();
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
				<div className='font-medium pb-3 font-20 text-black'>
					{t("Product Categories")}
				</div>
				<AppModalCenter
					close={() => setConfirmDelete(false)}
					isOpen={confirmDelete}
				>
					<div className='d-flex align-items-center mb-2'>
						<h4 className='d-inline-block mr-2 mb-0'>{t('Confirm Action')} </h4>
					</div>

					<div className='mb-3'>
						{t('You are about to delete a category.')}
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
				<Gap>
					<div>
						<div className='d-flex justify-content-between'>
							<div className='p-0'>
								<Button
									variant='xdh'
									height={'50px'}
									className='brand-btn font-12'
									style={{ width: '200px' }}
									onClick={(e) => setShowCategory(true)}
								>
									{t('Add Category')}
								</Button>{' '}
							</div>
						</div>
					</div>
				</Gap>
				<Table
					fixedLayout={false}
					data={product_categories.payload}
					totalRecords={product_categories.rowCount}
					perPage={perPage}
					currentpage={(product_categories.currentPage)}
					changePage={(page) => {
						changePage(page);
					}}
					header={[
						{
							name: t('Name'),
							pointer: 'name',
							func: (props) => (
								<span>
									{props}
								</span>
							),
						},
						{
							name: t('Description'),
							pointer: 'description',
							func: (props) => (
								<div>{props !== "" ? props : t("NA")}</div>
							),
						},
						{
							name: t('Action'),
							pointer: '',
							func: (props) => (
								<div className='d-flex align-items-center justify-content-between'>
									{props.isCustom &&
									<img
										src={Pen}
										style={{ height: '10px', width: '10px' }}
										className='cursor-pointer'
										onClick={(e) => {
											catSetter('Edit', props);
										}}
									/>}
									{props.isCustom &&
										<img
										src={Delete}
										style={{ height: '10px', width: '10px' }}
										className='cursor-pointer'
										onClick={(e) => {
											setConfirmDelete(true);
											setCategory(props)
										}}
									/>
									}
								</div>
							),
						},
					]}
				/>
			</div>

				<Category
					show_category={show_category}
					close={() => {
						setType("Create");
						setCategory();
						setShowCategory(false)
					}}
					category={category}
					type={type}
				/>

		</div>
	);
}

CategoryPage.propTypes = {
	getProductCategories: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
	user_details: state.data.user_details,
	product_categories: state.frontStore.product_categories
});

export default connect(mapStateToProps, {
	getProductCategories
})(CategoryPage);
