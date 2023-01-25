/** @format */

import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import "./css/module.scss";
import {
	getProductCategories,
} from 'actions/frontStoreActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import AppModal from "../components/app-modal";
import {updateProductsCategory, createProductsCategory} from "services/frontStoreService";
import {alertError, alertExceptionError, alertSuccess} from "./alert";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";

function AddCategory({
	show_category,
	close,
	type,
	category,
	getProductCategories,
}) {
	const { register, handleSubmit, watch,setValue, formState: { errors } } = useForm();
	const { t } = useTranslation();
	const [categoryProcessing, setCategoryProcessing] = useState(false);

	useEffect( ()=>{
		if (type === 'Edit')
		{
			setValue('name', category.name);
			setValue('description', category.description);
		}
	}, [category, type])
	const initProcess = ({name, description}) => {
			if (type === 'Create') {
				setCategoryProcessing(true);
				createProductsCategory(
					{
						name,
						description,
					}
				) .then((res) => {
					setCategoryProcessing(false);
					if (res.responseCode === "00") {
						getProductCategories();
						alertSuccess("Category created");
						close()
					} else {
						alertError(res.message
							? res.message
							: "An Error Occurred sending the request. Kindly try again");
					}
				})
					.catch((e) => {
						setCategoryProcessing(false);
						alertExceptionError(e)
					});
			}
			else {
				setCategoryProcessing(true);
				updateProductsCategory(
					{
						name,
						description,
					},
					category.id
				) .then((res) => {
					setCategoryProcessing(false);
					if (res.responseCode === "00") {
						getProductCategories();
						alertSuccess("Category updated");
						close()
					} else {
						alertError(res.message
							? res.message
							: "An Error Occurred sending the request. Kindly try again");
					}
				})
					.catch((e) => {
						setCategoryProcessing(false);
						alertExceptionError(e)
					});
			}
	};

	return (
		<AppModal isOpen={show_category} close={close} title={ `${type} ${t('category')}` }>
				<form
					className='w-100'
					onSubmit={handleSubmit(initProcess)}
				>
					<div className='row'>
						<div className='col-md-12 py-2'>
							<label className='font-12'>{t('Category Name')} </label>
							<label className='ml-2 errorText'>{errors.name?.message}</label>
							<input
								className='form-control mh-40 '
								type='text'
								{...register("name",{ required: 'Name is required', maxLength: 20 })}
								aria-invalid={errors.name ? "true" : "false"}
							/>

						</div>

						<div className=' form-group col-md-12 py-2'>
							<label className='font-12 '>{t('Category Description')} </label>
							<label className='ml-2 errorText'>{errors.description?.message}</label>
							<textarea
								className='form-control'
								rows='3'
								style={{ resize: 'none' }}
								{...register("description", {  maxLength: {message:'Maximum length is 50', value:50} })}
								aria-invalid={errors.description ? "true" : "false"}
							/>
						</div>
						<div className='col-12'>
							<Button
								variant='xdh'
								size='lg'
								block
								height={'40px'}
								className='brand-btn'
								type='submit'
								disabled={categoryProcessing}
							>
								{categoryProcessing && (
									<FontAwesomeIcon icon={faSpinner} spin className='font-20' />
								)}
								{!categoryProcessing && `${type} ${t('Category')}`}
							</Button>
						</div>
					</div>
				</form>
		</AppModal>
	);
}

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, {
	getProductCategories,
})(AddCategory);

