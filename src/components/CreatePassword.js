import React from 'react';
import '../App.css';
import axios from 'axios';
import Modal from 'react-modal';
import { baseApiUrl } from '../api/api';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import '../App.css';
class CreatePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            password: '',
            retype_password: '',
            error: '',
            isSuccess: false,
            modalIsOpen: false,
            user: [],
            expire: ''
        };
    }

    componentDidMount = async () => {
        const { token } = await this.props.match.params;

        if (token.toString().length > 15) {
            localStorage.setItem('forgotPassword', token);
        }
        this.props.history.push(`./${localStorage.getItem('forgotPassword')}-password`);
        try {
            let response = await axios
                .post(
                    `${baseApiUrl}/admin/validate/pwd-token`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('forgotPassword')}`
                        }
                    }
                )
                .then((response) => {
                    return response.data;
                });

            if (response.status === 'success') {
                this.props.history.push(`./${response.mode === 'set' ? 'create-password' : 'forgot-password'}`);
                this.setState({
                    expire: '',
                    user: response
                });
            } else {
                this.props.history.push('./expire-password');
                this.setState({ expire: response.message });
            }
        } catch (error) {
            const error1 = error.data ? (error.data.message ? error.data.message : 'Something went wrong. Please try again later. ') : 'Something went wrong. Please try again later. ';
            this.props.history.push('./expire-password');
            this.setState({ expire: error1 });
        }
    };
    openModal = () => {
        this.setState({ modalIsOpen: true });
    };
    closeModal = () => {
        this.setState({ modalIsOpen: false });
    };
    createPwd = async (e) => {
        e.preventDefault();
        const { password, retype_password } = this.state;

        if (!password && !retype_password) {
            return this.setState({
                error: 'Please provide Password / Retype-Password '
            });
        } else {
            // let pattern1 = /(?=.*[!@#\$%\^&\*+=])/;
            // let pattern1 = /[a-zA-Z0-9!@#$%^&*+=]{8,12}/g;
            const lowerCase = new RegExp('(?=.*[a-z])');
            const upperCase = new RegExp('(?=.*[A-Z])');
            const number = new RegExp('(?=.*[0-9])');
            const specialChar = new RegExp('(?=.*[!@#$%^&*+=])');
            const length = new RegExp('[A-Za-z0-9!@#$%^&*+=]{8,12}');

            if (password != retype_password) {
                this.setState({
                    error: 'Passwords must match'
                });
            } else if (length.test(password) && specialChar.test(password) && number.test(password) && upperCase.test(password) && lowerCase.test(password)) {
                const data = {
                    password: password,
                    retype_password: retype_password
                };
                if (password.length < 8 || password.length > 12) {
                    this.setState({
                        error: '"Must contain 8-12 characters, at least one capital letter, one number, and one special character (+@#$%^&+=!*)"'
                    });
                } else {
                    try {
                        const response = await axios
                            .post(`${baseApiUrl}/admin/create-password`, data, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('forgotPassword')}`
                                }
                            })
                            .then((response) => {
                                return response.data;
                            });

                        if (response.status === 'success') {
                            this.setState({
                                isSuccess: true,
                                error: 'Your password has been changed successfully.'
                            });
                            this.openModal();
                        } else if (response.error) {
                            this.setState({ error: response.error, isSuccess: false });
                        } else {
                            this.setState({ error: response.message, isSuccess: false });
                        }
                    } catch (error) {
                        const error1 = error.data ? (e.data.message ? e.data.message : 'Something went wrong. Please try again later. ') : 'Something went wrong. Please try again later. ';
                        this.setState({
                            error: error1,
                            isSuccess: false
                        });
                    }
                }
            } else {
                return this.setState({
                    error: '"Must contain 8-12 characters, at least one capital letter, one number, and one special character (+@#$%^&+=!*)"'
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
    onRadioChange = (e) => {
        const { value } = e.target;
        this.setState({
            gender: value
        });
    };

    render() {
        const { org_name, name, mode } = this.state.user;
        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -110%)'
            }
        };
        if (this.state.expire) {
            return (
                <div className="shadow-lg p-5 mb-5  bg-none rounded">
                    <div className="text-center">
                        <h3 className="text-danger text-capitalize p-4">{this.state.expire}</h3>
                        <div className="my-3">
                            <p className="text-secondary fw-normal">Please revisit the login screen and select Forgot Password to generate a new link</p>
                            <Link to="./login">
                                <button type="button" className="btn btn-primary">
                                    Go to login
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="shadow-lg p-5 mb-5 bg-white rounded">
                    <form className="">
                        <div className="text-center">
                            <h3 className="text">
                                {mode === 'set' ? 'Create New' : 'Forget'} Password <i className="text-success">{name}</i> ! <small>{org_name}</small>
                            </h3>
                        </div>
                        <br />
                        <div className="form-group row">
                            <label className="col-md-4  col-form-label text-md-right ">New password:</label>
                            <div className="col-sm-4">
                                <input type="password" onChange={this.handleChange} value={this.state.password} name="password" className="form-control " placeholder="" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right">Retype password:</label>
                            <div className="col-sm-4">
                                <input type="password" onChange={this.handleChange} value={this.state.retype_password} name="retype_password" className="form-control " placeholder="" />
                            </div>
                        </div>
                        <br />
                        {this.state.error && <div className="col text-center text-danger mb-3">{this.state.error}</div>}
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label font-weight-bold"></label>
                            <div className="col-sm-4">
                                <button type="submit" className="btn btn-primary btn-block" onClick={this.createPwd}>
                                    {mode === 'set' ? 'Submit' : 'Update'}
                                </button>
                            </div>
                        </div>
                        {this.state.isSuccess && (
                            <Modal isOpen={this.state.modalIsOpen} ariaHideApp={false} onRequestClose={this.closeModal} style={customStyles} contentLabel="Example Modal">
                                <form>
                                    {this.state.error && this.state.error ? (
                                        <React.Fragment>
                                            <h4 className="text text-primary">
                                                {this.state.error} Please&nbsp;{' '}
                                                <Link onClick={() => this.props.history.push('./login')}>
                                                    <span style={{ color: 'red' }}>Click Here</span>
                                                </Link>{' '}
                                                &nbsp;to login
                                            </h4>
                                            <div className="row" style={{ justifyContent: 'center' }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        this.closeModal();
                                                        this.props.history.push('./login');
                                                    }}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment></React.Fragment>
                                    )}
                                </form>
                            </Modal>
                        )}
                    </form>
                </div>
            );
        }
    }
}
export default connect(null, null)(CreatePassword);
