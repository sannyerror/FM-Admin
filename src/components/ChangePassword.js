import React from 'react';
import '../App.css';
import axios from 'axios';
import { baseApiUrl } from '../api/api';
import { store } from '../App';
import { connect } from 'react-redux';
class ChangePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            password: '',
            retype_password: '',
            old_password: '',
            error: ''
        };
    }
    changePwd = async (e) => {
        e.preventDefault();
        const { retype_password, old_password, password } = this.state;
        if (!password || !retype_password || !old_password) {
            return this.setState({
                error: `Please provide ${password === '' ? 'New Password' : ''}${retype_password === '' ? ', Re-Type New Password' : ''}${old_password === '' ? ', Current Password' : ''}`
            });
        } else if (password !== retype_password) {
            return this.setState({
                error: `New Password and Re-Type New Password must match`
            });
        } else {
            const data = {
                password: password,
                retype_password: retype_password,
                old_password: old_password
            };

            const { token, user_id, email, role_type } = store.getState().loginData.user;

            try {
                const response = await axios
                    .patch(`${baseApiUrl}/users/${user_id}/`, data, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        return response.data;
                    });

                if (response.status === 'failed') {
                    this.setState({
                        error: response.message
                    });
                } else {
                    const user = {
                        email,
                        token,
                        user_id,
                        role_type: role_type,
                        is_pwd_updated: ''
                    };
                    alert('Your Password has been updated successfully, Please login again');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user_role');
                    this.props.dispatch({ type: 'FETCH_USERS_SUCCESS', user });
                    this.props.history.push(`${role_type === 'Coordinator' ? '/admin/eiflist' : '/admin/configure'}`);
                }
            } catch (error) {
                console.log(error, 'error');
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
        const { name, email, role_type, pwd_expires_in, is_pwd_expired } = this.props.loginData.user;
        return (
            <div className="container-fluid">
                <form className="">
                    <div className="row p-2 bg-primary text-white">Profile</div>
                    <br />
                    {this.state.error && <div className="col text-center text-danger mb-3 font-weight-bold">{this.state.error}</div>}
                    <div className="row">
                        <div className="col-sm-12 col-lg-6 my-2">
                            <div className="card rounded shadow-sm">
                                <div className="card-header border-0">
                                    <h5 className="card-title primary  text-center  text-primary my-1">
                                        <strong>Change Password</strong>
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="form-group row ">
                                        <label className="col-sm-4 col-form-label font-weight-bold ">Current Password:​</label>
                                        <div className="col-sm-8">
                                            <input type="password" onChange={this.handleChange} value={this.state.old_password} name="old_password" className="form-control " placeholder="" />
                                        </div>
                                    </div>
                                    <div className="form-group row ">
                                        <label className="col-sm-4 col-form-label font-weight-bold ">New Password:</label>
                                        <div className="col-sm-8">
                                            <input type="password" onChange={this.handleChange} value={this.state.password} name="password" className="form-control " placeholder="" />
                                        </div>
                                    </div>
                                    <div className="form-group row ">
                                        <label className="col-sm-4 col-form-label font-weight-bold ">Re-Type New Password:</label>
                                        <div className="col-sm-8">
                                            <input type="password" onChange={this.handleChange} value={this.state.retype_password} name="retype_password" className="form-control " placeholder="" />
                                        </div>
                                    </div>
                                    <div className="form-group row ">
                                        <label className="col-sm-4 col-form-label font-weight-bold "></label>
                                        <div className="col-sm-8">
                                            <button type="submit" className="btn btn-primary font-weight-bold btn-block" onClick={this.changePwd}>
                                                UPDATE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-6 my-2">
                            <div className="card rounded shadow-sm">
                                <div className="card-header border-0">
                                    <h5 className="card-title primary text-center  text-primary my-1 ">
                                        <strong>User Details</strong>
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <label className="col-sm-2 font-weight-bold ">Name:​</label>
                                        <div className="col">
                                            <p className="card-text">{name}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-2 font-weight-bold ">Role:​</label>
                                        <div className="col">
                                            <p className="card-text">{role_type}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-2 font-weight-bold">Expired In:​</label>
                                        <div className="col">
                                            {is_pwd_expired ? (
                                                <p className="card-text">
                                                    <span className="badge bg-danger p-2 text-white">Already Password Expired !</span>
                                                </p>
                                            ) : (
                                                <p className="card-text">
                                                    <span className="badge bg-warning p-2">{pwd_expires_in} Days</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-2 font-weight-bold ">Email Id:​</label>
                                        <div className="col">
                                            <p className="card-text">{email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        loginData: state.loginData
    };
};
export default connect(mapStateToProps, null)(ChangePassword);
