/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import NotificationManager from "../../utils/notifications";
import { connect } from 'react-redux';
import { recoverPassword } from '../../../actions/postActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ResetResponse from './reset-response';
import logo from '../../../assets/images/logo.png';
import Loader from 'components/loader'

class Reset extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			payload: {},
			process: false,
			error: {},
			success: false,
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

	handleEmail(e) {
		var thenum = e.target.value.match(/[\w@.-]*/, '');
		if (thenum !== null) {
			this.setState({
				email: thenum[0],
			});
		}
	}

	initAuthorization = async (e, email) => {
		e.preventDefault();
		if (
			!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/.test(
				this.state.email
			)
		) {
			this.NotificationPrompt(
				'warning',
				'Invalid Email',
				'Enter a valid email'
			);
			this.setState({ process: false });
		} else {
			this.setState({ process: true });
			const params = {
				data: {
					email,
				},
				location: 'emailnotification',
			};
			this.props.recoverPassword(params);
			setTimeout(() => {
				if (this.state.process) {
					this.NotificationPrompt(
						'danger',
						'CONNECTION_TIMEOUT',
						'Please check your internet connection and try again'
					);
					this.setState({ process: false });
				}
			}, 100000);
		}
	};

	UNSAFE_componentWillReceiveProps(newProps) {
		if (
			newProps.recover_password !== this.props.recover_password &&
			newProps.location === 'emailnotification'
		) {
			this.setState({ process: false, success: true });
			this.NotificationPrompt(
				'success',
				'Successful',
				`An email has been sent to ${this.state.email}`
			);
		}
		if (
			newProps.error_details &&
			newProps.error_details.error_source === 'emailnotification'
		) {
			this.setState({ process: false });
			this.NotificationPrompt(
				'danger',
				newProps.error_details.status,
				newProps.error_details.message
			);
		}
	}

	render() {
		const head = 'Password Reset Mail Sent';
		const body = `An email has being sent to
    <span style='color: #0d6cb4'>${this.state.email}</span> Please follow the
    instructions to reset your password`;
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
							{/* <h2 className="signin-title-primary">
              Need help with your password?
            </h2> */}
							<h5 className='signin-title-secondary'>
								Enter the email you used for our SeerBit account, and we’ll help
								you create a new password.
							</h5>
							{/* <NotificationManager msg={this.state.error} /> */}
							<form
								className='w-100'
								onSubmit={(e) => {
									e.preventDefault();
									this.initAuthorization(e, this.state.email);
								}}
							>
								<div className='form-group'>
									<input
										type='email'
										className='form-control  h-50px'
										placeholder='Enter your email'
										onChange={this.handleEmail.bind(this)}
										value={this.state.email}
									/>
								</div>

								<button
									type='submit'
									className='bn bn-seerbn bn-block bn-signin'
									disabled={this.state.process}
								>
									{this.state.process ? (
										<FontAwesomeIcon
											icon={faSpinner}
											spin
											className='font-20'
										/>
									) : (
										'Send'
									)}
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
Reset.propTypes = {
	recoverPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	recover_password: state.data.recover_password,
	error_details: state.data.error_details,
	location: state.data.location,
});

export default connect(mapStateToProps, { recoverPassword })(Reset);
