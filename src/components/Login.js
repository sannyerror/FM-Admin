import React, { Component } from 'react';
import { login, forgotPassWord } from '../api/api';
import Modal from 'react-modal';
import CountdownTimer from './CountdownTimer';

import { connect } from 'react-redux';
import '../App.css';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export class Login extends Component {
    constructor(props) {
        super(props);
        const isLoggedIn = props.user && props.user;
        let token = localStorage.refreshToken ? (localStorage.refreshToken === undefined ? '' : localStorage.refreshToken === 'undefined' ? '' : localStorage.refreshToken) : '';

        if (token) {
            this.props.history.push(`${isLoggedIn.role_type === 'Coordinator' ? '/admin/eiflist' : '/admin/configure'}`);
        }
        this.state = {
            email: '',
            password: '',
            email_id: '',
            user: '',
            showPOPUP: false,
            error: '',
            lock_user: false
        };
    }
    componentDidMount = () => {
        localStorage.getItem('lock_user') &&
            this.setState((prev) => ({
                ...prev,
                lock_user: true,
                error: 'Your account has been temporarily locked after 3 failed attempts. If you feel you have received this message in error, please contact a FirstMatch team member. Otherwise, please try logging in again in 5 minutes.'
            }));
        this.unlockUserTimer();
    };
    unlockUserTimer = () => {
        return setTimeout(() => {
            localStorage.removeItem('lock_user');
            this.setState((prev) => ({
                ...prev,
                lock_user: false,
                error: ''
            }));
        }, 300000);
    };
    handleShow = () => {
        this.setState({
            showPOPUP: true
        });
    };
    handleClose = () => {
        this.setState({
            showPOPUP: false
        });
    };
    forgotPassword = async (e) => {
        e.preventDefault();
        const { email_id } = this.state;
        try {
            const response = await forgotPassWord(email_id);
            if (response.status === 'success') {
                this.setState({
                    error: 'Reset password sent to your Email ID.',
                    showPOPUP: false
                });
            } else {
                this.setState({
                    error: 'Invalid Email ID.',
                    showPOPUP: false
                });
            }
        } catch (e) {
            this.setState({
                error: 'Invalid Email ID / Password entered.'
            });
        }
    };
    signin = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        if (!email && !password) {
            return this.setState({
                error: 'Please provide Email ID / Password'
            });
        } else {
            try {
                const response = await login(email, password);

                if (response.data.status == 'failed') {
                    this.setState((prev) => ({ ...prev, error: response.data.message }));
                    if (response.data.message === 'Your account has been temporarily locked after 3 failed attempts. If you feel you have received this message in error, please contact a FirstMatch team member. Otherwise, please try logging in again in 5 minutes.' || response.data.message === 'Please try again after some time') {
                        this.setState((prev) => ({ ...prev, lock_user: true }));
                        localStorage.setItem('lock_user', 'true');
                        this.unlockUserTimer();
                    } else {
                        this.setState((prev) => ({ ...prev, lock_user: false }));
                        localStorage.setItem('lock_user', 'false');
                    }
                } else if (response.data.response.is_pwd_expired) {
                    this.props.history.push('/admin/changepassword');
                } else if (response.data.response.is_pwd_updated) {
                    if (response && response.data) {
                        const { token, refresh_token, role_type } = response.data.response;
                        this.setState({
                            accessToken: token,
                            refreshToken: refresh_token
                        });
                        this.props.history.push(`${role_type === 'Coordinator' ? '/admin/eiflist' : '/admin/configure'}`);
                    }
                } else {
                    this.props.history.push('/admin/changepassword');
                }
            } catch (e) {
                this.setState({
                    error: 'Invalid Email ID / Password entered.'
                });
            }
        }
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };
    render() {
        const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
        const NOW_IN_MS = new Date().getTime();
        const afterFiveMinutes = NOW_IN_MS + FIVE_MINUTES_IN_MS;
        return (
            <div className="shadow-lg p-5 mb-5 bg-white rounded">
                {this.state.lock_user ? (
                    <div className="my-2">
                        <CountdownTimer targetDate={afterFiveMinutes} />
                        {this.state.error && <div className="text-center text-danger mt-5 mb-3">{this.state.error}</div>}
                    </div>
                ) : (
                    <form>
                        <div className="text-center">
                            <h2>Login</h2>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right">Email ID:</label>
                            <div className="col-md-4">
                                <input type="text" className="form-control" name="email" onChange={this.handleChange} value={this.state.email} required />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right">Password:</label>
                            <div className="col-md-4">
                                <input type="password" className="form-control" name="password" onChange={this.handleChange} value={this.state.password} required />
                            </div>
                        </div>
                        {this.state.error && <div className="col text-center text-danger mb-3">{this.state.error}</div>}
                        <div className="row ">
                            <div className="col text-center mb-3">
                                <span className="btn btn-link text-primary" onClick={this.handleShow}>
                                    Forgot Password
                                </span>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col text-center mb-3">
                                <button className={`button ${this.state.lock_user ? 'bg-secondary border border-0' : ''}`} onClick={this.signin} disabled={this.state.lock_user}>
                                    {this.state.lock_user ? <s>Login</s> : <span>Login</span>}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                <Modal
                    isOpen={this.state.showPOPUP}
                    //   onAfterOpen={afterOpenModal}
                    onRequestClose={this.handleClose}
                    style={customStyles}
                    contentLabel="Forgot Password"
                    ariaHideApp={false}
                >
                    <div className="text-center text-primary">
                        <h2>Forgot Password</h2>
                    </div>
                    <p className="text-center">Please enter registered Email ID below to get reset password.</p>
                    <form>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right font-weight-bold">Email ID:</label>
                            <div className="col-md-8">
                                <input type="text" className="form-control" name="email_id" onChange={this.handleChange} value={this.state.email_id} required />
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col text-center ">
                                <button className="button-pop" onClick={this.forgotPassword}>
                                    Submit
                                </button>
                            </div>
                            <div className="col text-center ">
                                <button className="button-pop" onClick={this.handleClose}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.loginData.user
});
export default connect(mapStateToProps)(Login);
