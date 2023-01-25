/** @format */
import { alertSuccess } from "../modules/alert";
import React from "react";
import {isEmpty,isBoolean} from "lodash";
import Mastercard from "assets/images/svg/mastercard-icon";
import Visa from "assets/images/svg/visa-icon";
import Verve from "assets/images/verve.png";

const calcRange = (from, to, step = 1) => {
	let i = parseInt(from);
	const range = [];

	while (i <= to) {
		range.push(i);
		i += step;
	}

	return range;
};

const checkHost = (host) => {
	if (host.indexOf('localhost') !== -1) {
		return 'seerbit'
	}
	if (host.indexOf('pilot') !== -1) {
		return 'pilot'
	} else if (host.indexOf('wema') !== -1) {
		return 'wema'
	} else if (host.indexOf('uba') !== -1) {
		return 'uba'
	} else if (host.indexOf('fcmb') !== -1) {
		return 'fcmb'
	}
	else if (host.indexOf('orabank') !== -1) {
		return 'orabank'
	}
	else if (host.indexOf('intelisys') !== -1) {
		return 'intelisys'
	}
	else if (host.indexOf('sayele') !== -1) {
		return 'sayele'
	}
	else if (host.indexOf('intouch') !== -1) {
		return 'intouch'
	}
	else if (host.indexOf('psb') !== -1) {
		return 'psb'
	}
	else if (host.indexOf('parallex') !== -1) {
		return 'parallex'
	}
	else if (host.indexOf('budpay') !== -1) {
		return 'budpay'
	}
	else if (host.indexOf('sabi') !== -1) {
		return 'sabi'
	}
	else {
		return 'seerbit'
	}
}

const hostChecker = () => {
	try {
		const host = checkHost(window.location.origin.toLocaleLowerCase());
		return (host)
	} catch (e) {
		return 'seerbit'
		// throw new Error('Error checking host')
	}
}

const hostName = () => {
	try {
		const host = checkHost(window.location.origin.toLocaleLowerCase());
		if (host === 'seerbit') {
			return 'SeerBit'
		}
		if (host === 'pilot') {
			return 'SeerBit'
		} else if (host === 'wema') {
			return 'Wema Bank'
		} else if (host === 'uba') {
			return 'United Bank For Africa Plc'
		} else if (host === 'fcmb') {
			return 'First City Monument Bank'
		}
		else if (host === 'orabank') {
			return 'Orabank'
		}
		else if (host === 'intelisys') {
			return 'Intelisys'
		}
		else if (host === 'sayele') {
			return 'Sayele'
		}
		else if (host === 'psb') {
			return 'Bank9ja'
		}
		else if (host === 'intouch') {
			return 'Intouch'
		}
		else if (host.indexOf('parallex') !== -1) {
			return 'Parallex Bank'
		}
		else {
			return 'SeerBit'
		}
	} catch (e) {
		return 'SeerBit'
	}
}

const handleCopy = (e) => {
	const textField = document.createElement('textarea');
	textField.innerText = e;
	document.body.appendChild(textField);
	textField.select();
	document.execCommand('copy');
	textField.remove();
	alertSuccess('Copied', 'global_copy_module')
};

function hideOnClickOutside(element) {
	const outsideClickListener = event => {
		if (!element.contains(event.target) && isVisible(element)) { // or use: event.target.closest(selector) === null
			element.style.display = 'none'
			removeClickListener()
		}
	}

	const removeClickListener = () => {
		document.removeEventListener('click', outsideClickListener)
	}

	document.addEventListener('click', outsideClickListener)
}
function shouldHideOnClickOutside(element) {
	const outsideClickListener = event => {
		if (!element.contains(event.target) && isVisible(element)) { // or use: event.target.closest(selector) === null
			return true;
			removeClickListener()
		} else {
			return false;
		}
	}

	const removeClickListener = () => {
		document.removeEventListener('click', outsideClickListener)
	}

	document.addEventListener('click', outsideClickListener)
	return outsideClickListener;
}

const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js

const getTransactionStatus = (props, preAuthCapitalized) => {
	return props.transType !== "PREAUTH"
		? props.refundList && props.refundList.length > 0
			? "Refunded"
			: (props.gatewayResponseMessage === "APPROVED" ||
				props.gatewayResponseMessage === "Successful") &&
			(props.gatewayResponseCode === "00" &&
				props.status === "COMPLETED" ||
				props.status === "SETTLED")
				? "Successful"
				: props.gatewayResponseCode === "SM_X23"
					? "Expired"
					: props.gatewayResponseCode === "SM_A"
						? "Aborted"
						: "Failed"
		: preAuthCapitalized &&
		preAuthCapitalized !== "Noauth" &&
		preAuthCapitalized !== "Refund" &&
		preAuthCapitalized !== "Cancel"
			? `${preAuthCapitalized}d`
			: preAuthCapitalized === "Refund"
				? `${preAuthCapitalized}ed`
				: preAuthCapitalized === "Cancel"
					? `${preAuthCapitalized}led`
					: preAuthCapitalized === "Noauth"
						? props.gatewayResponseCode === "00"
							? "Captured"
							: "Failed"
						: null
}

const getTransactionStatusStyle = (props, preAuthCapitalized) => {
	return
	` p-1 ${preAuthCapitalized && preAuthCapitalized === "Refund"
		? "refund"
		: props.refundList && props.refundList.length > 0
			? "refund"
			: (props.gatewayResponseMessage === "APPROVED" ||
				props.gatewayResponseMessage === "Successful") &&
			(props.gatewayResponseCode === "00" &&
				props.status === "COMPLETED" || props.status === "SETTLED")
				? "success"
				: ["SM_X23", "SM_A"].indexOf(
					props.gatewayResponseCode
				) > -1
					? "default"
					: "failed"
	}-transaction`
}

const getTransactionStatusType = (props, preAuthCapitalized) => {
	return props.refundList && props.refundList.length > 0
		? "refund"
		: (props.gatewayResponseMessage === "APPROVED" ||
			props.gatewayResponseMessage === "Successful") &&
		(props.gatewayResponseCode === "00" &&
			props.status === "COMPLETED" || props.status === "SETTLED")
			? "success"
			: ["SM_X23", "SM_A"].indexOf(
				props.gatewayResponseCode
			) > -1
				? "default"
				: "fail"
}

const htmlEncode = (str) => {
	return String(str).replace(/[^\w. ]/gi, function (c) {
		return '&#' + c.charCodeAt(0) + ';';
	});
}

function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function formatNumber(num) {
	return Number(num)
		.toFixed(2)
		.toString()
		.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const StageFourComplete = (docs)=>{
	return docs.filter(item=> item.status === "SUBMITTED")
}

const StageThreePercent = (docs)=>{
	if (docs && Array.isArray(docs)){
		const total = docs.length;
		const completed = docs.filter(item=> item.status === "SUBMITTED").length;
		return Math.ceil(completed / total * 100)
	}

}

const getKycDocType  = (doc)=>{
	let type = null;
	try {
		if (doc){
			if (doc.kycRecordUpdate && typeof(doc.kycRecordUpdate) === 'string' && doc.kycRecordUpdate.length){
				type = 'TEXT';
			}else if (doc.kycDocumentUrl && typeof(doc.kycDocumentUrl) === 'string' && doc.kycDocumentUrl.length){
				try {
					const linkSplit = doc.kycDocumentUrl.split('.');
					const linkType = linkSplit[ linkSplit.length - 1 ];
					if (linkType === 'jpeg' || linkType === 'jpg' || linkType === 'png' || linkType === 'gif') {
						type = 'IMAGE';
					}else if (linkType === 'pdf') {
						type = 'PDF';
					}
				}catch (e) {

				}

			}
		}
		return type;
	}catch (e) {

	}
}

const signatures = {
	JVBERi0: "application/pdf",
	R0lGODdh: "image/gif",
	R0lGODlh: "image/gif",
	iVBORw0KGgo: "image/png",
	"/9j/": "image/jpg"
};

const detectMimeType = (b64) =>{
	for (var s in signatures) {
		if (b64.indexOf(s) !== -1) {
			return signatures[s];
		}
	}
}

function base64toBlob(base64Data) {
	const sliceSize = 1024;
	const byteCharacters = atob(base64Data);
	const bytesLength = byteCharacters.length;
	const slicesCount = Math.ceil(bytesLength / sliceSize);
	const byteArrays = new Array(slicesCount);

	for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		const begin = sliceIndex * sliceSize;
		const end = Math.min(begin + sliceSize, bytesLength);

		const bytes = new Array(end - begin);
		for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	return new Blob(byteArrays, { type: "application/pdf" });
}

function StageOneComplete (data){
	if (
		!isEmpty(data.business_industry) &&
		!isEmpty(data.business_name) &&
		!isEmpty(data.businessDescription) &&
		!isEmpty(data.staffSize) &&
		!isEmpty(data.annualTransaction) &&
		!isEmpty(data.tradingName)
	){
		return true
	}else
	{
		return false
	}
}

function StageTwoComplete (data){
	if (
		!isEmpty(data.business_email) &&
		!isEmpty(data.support_email) &&
		!isEmpty(data.chargeback_email) &&
		!isEmpty(data.business_state) &&
		!isEmpty(data.business_city) &&
		!isEmpty(data.business_address)
	){
		return true
	}else
	{
		return false
	}
}

function StageThreeComplete (data,isNigeria){
	if (
		!isEmpty(data.bank_code) &&
		!isEmpty(data.account_number) &&
		!isEmpty(data.account_name) &&
		(isNigeria ? !isEmpty(data.bvn_number) : true)
	){
		return true
	}else
	{
		return false
	}
}

function StageOnePercent (data){
	let count = 0
	if (data) {
		if (!isEmpty(data.business_industry)) {
			count = 1
		}
		if (!isEmpty(data.business_name)) {
			count += 1
		}
		if (!isEmpty(data.businessDescription)) {
			count += 1
		}
		if (!isEmpty(data.staffSize)) {
			count += 1
		}
		if (!isEmpty(data.annualTransaction)) {
			count += 1
		}
		if (isBoolean(data.acceptInternationalTrans)) {
			count += 1
		}
		if (!isEmpty(data.tradingName)) {
			count += 1
		}
		if (!isEmpty(data.business_address)) {
			count += 1
		}
		if (!isEmpty(data.business_city)) {
			count += 1
		}
		if (!isEmpty(data.business_state)) {
			count += 1
		}
		if (!isEmpty(data.chargeback_email)) {
			count += 1
		}
		if (!isEmpty(data.support_email)) {
			count += 1
		}
		if (!isEmpty(data.business_email)) {
			count += 1
		}
		return Math.ceil(count / 13 * 100)
	}
}

function StageTwoPercent (data,isNigeria){
	let count = 0
	if (data) {
		if (!isEmpty(data.bank_name)) {
			count = 1
		}
		if (!isEmpty(data.account_number)) {
			count += 1
		}
		if (!isEmpty(data.account_name)) {
			count += 1
		}
		if ((isNigeria ? !isEmpty(data.bvn_number) : true) ) {
			count += 1
		}
		return Math.ceil(count / 4 * 100)
	}
}
const cardQuickDection = text => {
	return /^5[1-5][0-9]+/.test(text) || text === '2223000000000007'
		? Mastercard
		: /^4[0-9]+(?:[0-9]{3})?/.test(text)
			? Visa
			: /^5[0][0-9]+/.test(text)
				? Verve
				: '';
};

export {
	calcRange,
	handleCopy,
	hideOnClickOutside,
	shouldHideOnClickOutside,
	getTransactionStatus,
	getTransactionStatusStyle,
	getTransactionStatusType, htmlEncode,
	hostChecker,
	validateEmail,
	hostName,
	formatNumber,
	StageFourComplete,
	getKycDocType,
	detectMimeType,
	base64toBlob,
	StageOneComplete,
	StageOnePercent,
	StageTwoComplete,
	StageThreeComplete,
	StageTwoPercent,
	StageThreePercent,
	cardQuickDection
};
