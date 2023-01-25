/** @format */

export const playCheckout = ({
	tranref,
	country,
	currency,
	amount,
	callbackurl,
	full_name,
	email,
	mobile_no,
	customization,
	description,
	public_key,
	callback,
	pocketReference,
	close,
}) => {
	window.SeerbitPay && window.SeerbitPay(
		{
			tranref,
			currency,
			description,
			country,
			amount,
			callbackurl,
			public_key,
			full_name,
			email,
			mobile_no,
			customization,
			pocketReference
		},
		callback,
		close
	)
};
