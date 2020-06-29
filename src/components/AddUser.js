import React from 'react';
import '../App.css';
import { AddUsers, baseApiUrl } from '../api/api';
import axios from 'axios'
import { store } from '../App'
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AddUser extends React.Component {
    constructor() {
        super();
        this.state = {
            first_name: "",
            last_name: "",
            email_id: "",
            gender: '',
            mobile: "",
            group_id: "",
            role_type: "",
            Roles: [],
            error: {
                first_name: "",
                last_name: "",
                email_id: "",
                gender: '',
                mobile: "",
                group_id: "",
            }
        }
    }
    async componentDidMount() {
        let res = await this.getRoles();

        this.setState({
            Roles: res.data
        })
        const { id } = this.props.match.params;
        const currentUser = store.getState().loginData.user.token;
        if (id) {

            try {
                const response = await axios.get(`${baseApiUrl}/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser}`
                    }
                })
                    .then(response => {

                        return response.data;
                    })
                const role = res.data.filter(v => v.name === response.role_type)
                this.setState({
                    first_name: response.first_name,
                    last_name: response.last_name,
                    email_id: response.email_id,
                    gender: `${response.gender}`,
                    mobile: response.mobile,
                    role_type: response.role_type,
                    group_id: role[0].id,
                })
            }
            catch (error) {
                console.log(error, 'error')
            }
        }
    }
    getRoles = async () => {
        const currentUser = store.getState().loginData.user.token;
        return await axios.get(`${baseApiUrl}/groups/`, {
            headers: {
                'Authorization': `Bearer ${currentUser}`
            }
        });
    }
    addUser = async (e) => {
        e.preventDefault();
        const { id } = this.props.match.params;
        const data = this.state
        try {
            const response = await AddUsers(data, id);
            if (response.status === "failed") {
                const err = response.response
                const msg = Object.keys(err).map(m => err[m])
                this.setState({
                    error: msg
                })
            } else {
                toast.info(`User ${id ? "updated" : "added"}  successfully.`, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
                this.props.history.push('/configure/userslist');
            }

        }
        catch (e) {
            this.setState({
                error: e
            });
            return;
        }

    };

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (name === "email_id") {
            this.setState({
                [name]: value
            });
        } else {
            this.setState({
                [name]: value.charAt(0).toUpperCase() + value.substr(1)
            });
        }

    }
    onRadioChange = (e) => {
        this.setState({
            gender: e.currentTarget.value
        });

    }

    render() {
        toast.configure()
        const { id } = this.props.match.params
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white">{id ? "Edit" : "Add"} User</div><br />
                <form onSubmit={this.addUser}>
                    <div className=" ml-4">
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">First name</label>
                            <div className="col-sm-4">
                                <input type="text" className="form-control" id="validationDefault01" onChange={this.handleChange}
                                    value={this.state.first_name}
                                    name="first_name" required />
                            </div>

                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Last Name:</label>
                            <div className="col-sm-4">
                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.last_name}
                                    name="last_name"
                                    className="form-control " placeholder="" required />
                            </div>
                            {this.state.last_nameError && <div className="text-center text-danger">{this.state.last_nameError}
                            </div>}
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Email ID:</label>
                            <div className="col-sm-4">
                                <input type="email"
                                    onChange={this.handleChange}
                                    value={this.state.email_id}
                                    name="email_id"
                                    className="form-control " required />
                            </div>
                            {this.state.email_idError && <div className="text-center text-danger">{this.state.email_idError}
                            </div>}
                        </div>
                        <fieldset className="form-group">
                            <div className="row">
                                <legend className="col-form-label col-sm-2 font-weight-bold">Gender:</legend>
                                <div className="col-sm-10">
                                    <div className="form-check form-check-inline">
                                        <input
                                            onChange={this.onRadioChange}
                                            className="form-check-input" name="gender" type="radio"
                                            value="1" id="female"
                                            checked={this.state.gender === "1"}
                                            required />
                                        <label className="form-check-label" >
                                            Female
                                    </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            onChange={this.onRadioChange}
                                            className="form-check-input" name="gender"
                                            type="radio" value="2" id="male"
                                            checked={this.state.gender === "2"}
                                            required />
                                        <label className="form-check-label" >
                                            Male
                                    </label>
                                        {this.state.genderError && <div className="text-center text-danger ml-5">{this.state.genderError}
                                        </div>}
                                    </div>

                                </div>
                            </div>

                        </fieldset>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Mobile Number:</label>
                            <div className="col-sm-4">
                                <input type="number"
                                    onChange={this.handleChange}
                                    value={this.state.mobile}
                                    name="mobile"
                                    className="form-control " required />
                            </div>
                            {this.state.mobileError && <div className="text-center text-danger">{this.state.mobileError}
                            </div>}
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold " >Role:</label>
                            <div className="col-sm-4">
                                <select name="group_id" className="form-control" id="exampleFormControlSelect1" onChange={this.handleChange} required>
                                    <option value="" >Select</option>
                                    {this.state.Roles.map((role,i) => <option key={i} value={role.id} selected={this.state.role_type === role.name}>{role.name}</option>)}

                                </select>
                            </div>
                            {this.state.group_idError && <div className="text-center text-danger">{this.state.group_idError}
                            </div>}
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold "></label>
                            <div className="col-sm-4">
                                <button type="submit" className="btn btn-primary font-weight-bold btn-block" >{id ? "UPDATE" : "ADD USER"}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.loginData.user
    }
}

export default connect(mapStateToProps)(AddUser);