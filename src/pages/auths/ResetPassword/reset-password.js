/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { passwordReset } from '../../../actions/postActions';
import { Link } from 'react-router-dom';
// import NotificationManager from "../../utils/notifications";
import PasswordInput from '../../auth/utils/password/passwordInput';
import ResetResponse from './reset-response';
import logo from '../../../assets/images/logo.png';
import Loader from 'components/loader'

class ResetPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			password_confirmation: '',
			process: false,
			error: {},
		};
	}
	NotificationPrompt(type, title, details) {
		const self = this;
		this.setState({
			error: {
				type,
				details,
				title,
				display: 'block',
				self,
			},
		});
	}

	handleInput(e) {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}
	handlePassword(e) {
		this.setState({
			password: e.target.value,
		});
	}

	handleCPassword(e) {
		this.setState({
			password_confirmation: e.target.value,
		});
		this.setState({
			passwordMatch: e.target.value === this.state.password ? true : false,
		});
	}

	initAuthorization = async (
		e,
		password,
		password_confirmation,
		recovery_token
	) => {
		e.preventDefault();
		if (
			!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[=+!@#\$%\^&\*\._\-\`\/()])(.{8,})$/.test(
				this.state.password
			)
		) {
			this.setState({ process: false });
			this.NotificationPrompt(
				'warning',
				'Password not Strong',
				`Password must
       contain at least 8 characters including;
        one uppercase,
        one lowercase and
       one special character.`
			);
		} else if (this.state.password !== this.state.password_confirmation) {
			this.setState({ process: false });
			this.NotificationPrompt(
				'warning',
				'Invalid Password',
				'Passwords mismatch'
			);
		} else {
			this.setState({ process: true });
			const params = {
				data: {
					password,
					password_confirmation,
					recovery_token,
				},
				location: 'resetpassword',
			};
			this.props.passwordReset(params);
			setTimeout(() => {
				if (this.state.process) {
					this.NotificationPrompt(
						'danger',
						'ERR_CONNECTION_CLOSED',
						'Please check your internet connection and try again'
					);
					this.setState({ process: false });
				}
			}, 100000);
		}
	};

	UNSAFE_componentWillReceiveProps(newProps) {
		if (
			newProps.password_reset !== this.props.password_reset &&
			newProps.location === 'resetpassword'
		) {
			this.setState({ process: false, success: true });
			this.NotificationPrompt(
				'success',
				'Successful',
				`Password Changed Successful`
			);
		}
		if (
			newProps.error_details &&
			newProps.error_details.error_source === 'resetpassword'
		) {
			this.setState({ process: false });
			this.NotificationPrompt(
				'danger',
				newProps.error_details.status,
				newProps.error_details.message
			);
		}
	}

	componentDidMount() {
		this.setState({ recovery_token: this.props.match.params.auth });
	}
	render() {
		const head = 'Password Reset Successful';
		const body = `Your password has been reset, you can now login with your new password`;
		return (
			<div>
				{this.state.success && <ResetResponse data={{ head, body }} />}
				{!this.state.success && (
					<div
						className='signin-wrapper'
						onClick={(e) => {
							this.setState({
								error: {
									...this.state.error,
									display: false,
								},
							});
						}}
					>
						<div className='signin-box'>
							<h2 className='seerbit-logo'>
								<a href='https://seerbit.com' className=''>
									<div className='pt-4 pb-2'>
										<img src={logo} className='seerbit logo' alt='Seerbit' />
									</div>
								</a>
							</h2>
							<h5 className='signin-title-secondary'>Create a new password</h5>
							{/* <NotificationManager msg={this.state.error} /> */}
							<form
								className='w-100'
								onSubmit={(e) => {
									e.preventDefault();
									this.initAuthorization(
										e,
										this.state.password,
										this.state.password_confirmation,
										this.state.recovery_token
									);
								}}
							>
								<div className='form-group'>
									<PasswordInput
										className='form-control  h-50px'
										type='password'
										placeholder='Enter a new password'
										name='password'
										onChange={this.handlePassword.bind(this)}
										value={this.state.password}
									/>
								</div>
								<div className='form-group'>
									<input
										type='password'
										className={`form-control  h-50px ${
											this.state.passwordMatch ? 'successIndicator' : ''
										}`}
										placeholder='Confirm password'
										name='password_confirmation'
										onChange={this.handleCPassword.bind(this)}
										value={this.state.password_confirmation}
									/>
								</div>

								<button className='bn bn-seerbn bn-block bn-signin'>
									Continue
								</button>
							</form>
							<div className='registerlink  font-14'>
								<Link to='/auth/login'>Return to seerBit Login</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
ResetPassword.propTypes = {
	passwordReset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	password_reset: state.data.password_reset,
	error_details: state.data.error_details,
	location: state.data.location,
});

export default connect(mapStateToProps, { passwordReset })(ResetPassword);
