/** @format */

import React, { useState } from 'react';
import moment from 'moment';
import AppModal from "components/app-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCaretDown,
	faCaretUp,
	faPaperclip,
} from '@fortawesome/free-solid-svg-icons';
import Upload from '../assets/images/svg/upload.svg';
import Attach from '../assets/images/svg/attach.svg';

import styled from 'styled-components';
import './css/module.scss';
import Button from "../components/button";

const Wrap = styled.div`
	border-radius: 2px;
	line-height: 1.5;
	.title {
		color: #000000;
		font-weight: 500;
		font-size: 16px;
	}
	.text-body {
		line-height: 2;
		font-size: 12px;
		display: flex;
		.text {
			color: #6b6b6b;
		}
		.label {
			color: #6b6b6b;
			min-width: 100px;
		}
	}
	.text-body.pb-2 {
		line-height: 2 !important;
	}
	table {
		border: none !important;
		background: transparent !important;
		td:first-child,
		th {
			box-shadow: none !important;
			background: transparent !important;
			font-size: 1em !important;
			color: #676767 !important;
			font-weight: 500 !important;
			padding: 0.8em;
		}
		td {
			padding: 0.5em !important;
		}

		tr {
			line-height: 1;
		}
		td:last-child {
			line-height: 1.7;
			border-top: 3px solid #676767;
		}
	}
`;

const RightComponent = styled.div`
	float: right;
`;

function Conversations({
						   isOpen,
	close,
	dispute,
	message,
	setMessage,
	setImageUpload,
	image_upload,
	replyDispute,
	viewMode
}) {
	var uploadElement = null;
	const [customerTrigger, setCustomerTrigger] = useState(true);

	const fileuploadHandler = (e) => {
		if (e.target.files[0].size > 1028 * 1000) {
			alert('Maximum of 1 Megabyte is allow');
			return;
		}
		if (e.target.files && e.target.files[0]) {
			setImageUpload(e.target.files[0]);
		}
	};
	return (
		<AppModal title="Dispute Details" isOpen={isOpen} close={() => close()}>
			{isOpen && <div>
				<Wrap className='pt-4 mt-5'>
					<div className='title font-16'>
						Details
						<RightComponent>
							<FontAwesomeIcon
								icon={customerTrigger ? faCaretDown : faCaretUp}
								onClick={() => {
									setCustomerTrigger(!customerTrigger);
								}}
							/>
						</RightComponent>
					</div>
					{customerTrigger && (
						<>
							<div className='text-body font-12'>
								<div className='label '>Created on : </div>
								<span className='text '>
								{moment(dispute.date_of_dispute).format('Y/M/D h:m:s A')}
							</span>
							</div>
							<div className='text-body font-12'>
								<div className='label'>Category : </div>
								<span className='text '>{'Charge back'}</span>
							</div>{' '}
							<div className='text-body font-12'>
								<div className='label'>Resolution : </div>
								<span className='text '>
								{dispute.resolution === null
									? dispute.status
									: dispute.resolution.replace(/_/g, ' ')}
							</span>
							</div>
							<div className='text-body font-12'>
								<div className='label'>Refunded : </div>
								<span className='text '>
								{dispute.amount === null ? 'NONE' : `NGN ${dispute.amount}`}
							</span>
							</div>
							<div className='text-body font-12'>
								<div className='label'>Resolution : </div>
								<span className='text '>
								{' '}
									{dispute.date_of_resolution === null
										? dispute.status
										: dispute.date_of_resolution}
							</span>
							</div>
							<div className='text-body font-12'>
								<div className='label'>Transaction Reference : </div>
								<div className='text '>
									{' '}
									{dispute.transaction_ref === null
										? "Not Available"
										: dispute.transaction_ref}
								</div>
							</div>
							<div className='text-body font-12'>
								<div className='label'>Dispute Reference : </div>
								<div className='text '>
									{' '}
									{dispute.dispute_ref === null
										? "Not Available"
										: dispute.dispute_ref}
								</div>
							</div>
							{dispute.transDetails && dispute.transDetails.product_id &&
							<div className='text-body font-12'>
									<div className='label'>Product ID :</div>
									<div className='text '>
										{' '}
										{dispute.transDetails ? dispute.transDetails.product_id ? dispute.transDetails.product_id : "NA" : "NA"}
									</div>
								</div>
							}
						</>
					)}
					<Wrap className='py-4'>
						{dispute &&
						dispute.evidence &&
						dispute.evidence.map(function (item, key) {
							return (
								<div
									className='text-body font-15 mb-2 py-2'
									style={{ lineHeight: '1.3' }}
								>
									{/* {item.msg_sender === 'merchant' && ( */}

									<Thumbnail item={item} />

									<Text item={item} />

									{/* )} */}
									{/* {item.msg_sender !== 'merchant' && (
										<div className='row'>
										  <div className='col-9'>
											<Text item={item} />
                      </div>
                      <div className='col-3'>
                        	<Thumbnail item={item} />
                      </div>

										</div>
									)} */}
								</div>
							);
						})}
					</Wrap>
				</Wrap>{' '}

				{ viewMode === 'FULL' && <Wrap className='w-100 '>
					<div
						className='wrapper overflow-auto px-5'
						style={{ bottom: '10px', display: 'contents' }}
					>
						<div className='bg-white'>
						<textarea
							name='message'
							className='form-control'
							placeholder='Message'
							rows='2'
							maxLength={200}
							style={{ resize: 'none' }}
							onChange={(e) => setMessage(e.target.value)}
							value={message}
						/>

							<img
								src={Attach}
								style={{
									width: '18px',
									transform: 'rotate(315deg)',
									zIndex: '3',
									marginTop: '10px',
								}}
								onClick={(e) => uploadElement.click()}
							/>
							{image_upload && <span>Attached</span>}
						</div>

						<input
							style={{ display: 'none' }}
							type='file'
							accept='image/png, image/jpeg, application/pdf'
							placeholder='image'
							ref={(e) => (uploadElement = e)}
							onChange={fileuploadHandler.bind(this)}
						/>

						<div className='float-right mt-2'>
							<Button text='Reply' onClick={replyDispute} />
						</div>
						<p className={'font-10'}>
							{/* {this.state.upload_image === undefined
                    ? ""
                    : `${this.state.upload_image.name}`} */}
						</p>
					</div>
				</Wrap>}
			</div>}
		</AppModal>
	);
}

const Text = ({ item }) => (
	<div className='text'>
		<div>{item.message}</div>
		<div className='seerbit-color font-10'>
			{moment(item.date_of_resolution).fromNow()}
		</div>
		<div className='font-12'>
			<span className='label'>From : </span>
			{item.msg_sender === null ? 'Bank' : item.msg_sender}
		</div>{' '}
	</div>
);

const Thumbnail = ({ item }) => (
	<div>
		{item.images[0].image && (
			<a
				href={item.images[0].image}
				className='bg-white p-3 border-dash br-normal mr-3 cursor-pointer '
				download={'dispute_' + moment()}
				target='_blank'
				title='click to download attachment'
			>
				<FontAwesomeIcon
					icon={faPaperclip}
					className='font-20 sbt-deep-color'
				/>
			</a>
		)}
		{!item.images[0].image && (
			<div className='mr-3'>
				<img src={Upload} style={{ zoom: '1' }} />{' '}
			</div>
		)}
	</div>
);

export default Conversations;
