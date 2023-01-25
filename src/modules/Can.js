import React, {Fragment} from 'react';
import { useSelector } from 'react-redux';

export const Can = ({ children, access }) => {
	const permissions = useSelector((state) => state.auth.permissions);
	return (
		hasAccess(access, permissions) && (
			<Fragment>{children}</Fragment>
		)
	);
};

export const hasAccess = (access, permissions) => {
	if (permissions && access) {
		if (typeof access === 'string'){
			return permissions.indexOf(access) > -1 || access === '*';
		}else{
			return (
				access.some(r=> permissions.indexOf(r) >= 0) ||
				access.indexOf('*') >= 0
			);
		}
	} else return false;
};

export const CanAccess = (access) => {
	const permissions = useSelector((state) => state.auth.permissions);
	if (permissions && access) {
		if (typeof access === 'string'){
			return permissions.indexOf(access) > -1 ||
				access === '*';
		}else{
			return (
				access.some(r=> permissions.indexOf(r) >= 0) ||
				access.indexOf('*') >= 0
			);
		}
	} else return false;
};
