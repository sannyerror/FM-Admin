import React from 'react';
import '../App.css';
import axios from 'axios';
import { baseApiUrl } from '../api/api';
import { store } from '../App';
import { connect } from 'react-redux';
import '../App.css';
class CreatePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            password: '',
            retype_password: '',
            error: ''
        };
    }
    createPwd = async (e) => {
        e.preventDefault();
        const { password, retype_password } = this.state;
        const { token } = this.props && this.props.match && this.props.match.params && this.props.match.params;

        if (!password && !retype_password) {
            return this.setState({
                error: 'Please provide Password / Retype-Password '
            });
        } else {
            let pattern1 = /^(?=.*[!@#\$%\^&\*+=])/;
            let pattern2 = /[a-zA-Z0-9]{8,12}/g;
            if (password != retype_password) {
                this.setState({
                    error: 'Passwords must match'
                });
            } else if (pattern1.test(password) && pattern2.test(password)) {
                const data = {
                    password: password,
                    retype_password: retype_password
                };

                try {
                    const response = await axios
                        .post(`${baseApiUrl}/admin/create-password`, data, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then((response) => {
                            return response.data;
                        });

                    if (response.status === 'success') {
                        this.setState({
                            error: 'Your password has been changed successfully. Go for Login!'
                        });
                    } else if (response.error) {
                        this.setState({ error: response.error });
                    } else {
                        this.setState({ error: response.message });
                    }
                } catch (error) {
                    const error1 = error.data ? (e.data.message ? e.data.message : 'Something went wrong. Please try again later. ') : 'Something went wrong. Please try again later. ';
                    this.setState({
                        error: error1
                    });
                }
            } else {
                return this.setState({
                    error: 'Invalid password; allows 8 to 12 alphanumeric and "@#$%^&+=!*"'
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
        return (
            <div className="">
                <div className="shadow p-5 mb-5 bg-white rounded">
                    <form className="">
                        <div className="text-center">
                            <h2>Create New Password</h2>
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
                                    UPDATE
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
export default connect(null, null)(CreatePassword);
