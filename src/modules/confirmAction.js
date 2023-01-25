/** @format */

import React from 'react';
import { Modal } from 'rsuite';
import {useTranslation} from "react-i18next";

const ConfirmAction = ({ show, message, close, handler, title, process }) => {
	const {t} = useTranslation()
	return (
		<Modal centered show={show} onHide={close} size='xs' role="alertdialog" backdrop="static">
			<div className='modal-content border-none br-0'>
				<div className='modal-header'>
					<h5 className='modal-title font-15 text-capitalize'>{title}</h5>
				</div>
				<div className='modal-body'>
					<p className='font-14'>{message}</p>
				</div>
				<div className='modal-footer'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handler();
						}}
					>
						<button type='submit' className='btn btn-danger' disabled={process}>
							{process ? t('Processing')+'...' : t('OK')}
						</button>
					</form>

					<button
						type='button'
						className='btn btn-light'
						data-dismiss='modal'
						onClick={(e) => close()}
					>
						{t('Cancel')}
					</button>
				</div>
			</div>{' '}
		</Modal>
	);
};
export default ConfirmAction;
