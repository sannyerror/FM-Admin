import React from 'react';
import '../App.css';
import axios from 'axios'
import { baseApiUrl } from '../api/api';
import { store } from '../App'
import {connect} from 'react-redux'
class ChangePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            password: "",
            retype_password: "",
            old_password: "",
            error: ""
        }
    }
    changePwd = async (e) => {
        e.preventDefault();
        const { retype_password, old_password, password } = this.state
        if (!password && !retype_password && old_password) {
            return this.setState({
                error: "Please provide Password / Retype-Password / Old-Password"
            })
        } else {
            const data = {
                password: password,
                retype_password: retype_password,
                old_password: old_password
            }

            const { token, user_id, email, role_type} = store.getState().loginData.user;


            try {
                const response = await axios.patch(`${baseApiUrl}/users/${user_id}/`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        console.log(response)
                        return response.data;
                    })
                 
                if (response.status === "failed") {
                    this.setState({
                        error: response.status
                    });
                } else {
                    const user = {
                        email,
                        token,
                        user_id,
                        role_type: role_type,
                        is_pwd_updated: ""
                    }
                    this.props.dispatch({ type: "FETCH_USERS_SUCCESS", user });
                    this.props.history.push(`${role_type === "Coordinator" ? "/eiflist":"/configure"}`);
                }
            }
            catch (error) {
                
                console.log(error, 'error')
            }
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        this.setState({
            [name]: value
        });
    }
    onRadioChange = (e) => {
        const { value } = e.target;
        this.setState({
            gender: value
        })
    }

    render() {
        return (
            <div className="container-fluid">
                <form className="">
                    <div className="row p-2 bg-primary text-white">Change Password</div><br />
                    {this.state.error &&
                        <div className="col text-center text-danger mb-3 font-weight-bold">
                            {this.state.error}
                        </div>
                    }
                    <div className=" ml-4">
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Current Password:​</label>
                            <div className="col-sm-4">
                                <input type="password"
                                    onChange={this.handleChange}
                                    value={this.state.old_password}
                                    name="old_password"
                                    className="form-control " placeholder="" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">New password:</label>
                            <div className="col-sm-4">
                                <input type="password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    name="password"
                                    className="form-control " placeholder="" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Retype password:</label>
                            <div className="col-sm-4">
                                <input type="password"
                                    onChange={this.handleChange}
                                    value={this.state.retype_password}
                                    name="retype_password"
                                    className="form-control " placeholder="" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold "></label>
                            <div className="col-sm-4">
                                <button type="submit" className="btn btn-primary font-weight-bold btn-block" onClick={this.changePwd}>UPDATE</button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>

        );
    }
}
export default connect(null,null)(ChangePassword);