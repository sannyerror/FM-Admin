import React from 'react';
import '../App.css';
import { AddOrgUsers } from '../api/api';
import axios from 'axios'
import { store } from '../App'
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AddOrgUser extends React.Component {
    constructor() {
        super();
        this.state = {
            customer: "",
            first_name: "",
            last_name: "",
            email_id: "",
            gender: '',
            mobile: "",
            error: {
               
            }
        }
    }
    async componentDidMount() {
        const { id } = this.props.match.params;
        console.log(id.replace("=",""))
        const currentUser = store.getState().loginData.user.token;
                   this.setState({ customer: parseInt(id.replace("=","")) })
        // if (id) {

        //     const response = await axios.get(`${baseApiUrl}/org/super/admins/${id}/`, {
        //         headers: {
        //             'Authorization': `Bearer ${currentUser}`
        //         }
        //     })
        //         .then(response => {
        //             return response.data;
        //         })
        //     const role = res.data.filter(v => v.name === response.role_type)
        //     this.setState({
        //         customer: response.customer,
        //         first_name: response.first_name,
        //         last_name: response.last_name,
        //         email_id: response.email_id,
        //         gender: `${response.gender}`,
        //         mobile: response.mobile,
        //     })
        // }
    }
    
    AddOrgUser = async (e) => {
        e.preventDefault();
        //  const { id } = this.props.match.params;
        let id = ""
        const data = this.state
        try {
            const response = await AddOrgUsers(data);
            if (response.status === "failed") {
                if(response.message === "user already existed with given email or mobile."){
                    toast.info(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
                }else{
                const err = response.message
                this.setState({
                    error: err
                })
            }
            } else {
                toast.info(`User ${id ? "updated" : "added"}  successfully.`, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
                this.props.history.push('/admin/configure/organizationlist');
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
        // const { id } = this.props.match.params
        let id = ""
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white">{id ? "Edit" : "Add"} Organization User</div><br />
                <form onSubmit={this.AddOrgUser}>
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
                                    {this.state.error["last_name"] && 
                            <span className="text-center text-danger">{this.state.error["last_name"]}
                            </span>}
                            </div>
                            
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Email ID:</label>
                            <div className="col-sm-4">
                                <input type="email"
                                    onChange={this.handleChange}
                                    value={this.state.email_id}
                                    name="email_id"
                                    className="form-control " required />
                                     {this.state.error["email_id"] && 
                            <span className="text-center text-danger">
                                {this.state.error["email_id"]}
                            </span>}
                            </div>
                           
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
                                        {this.state.error["gender"] && 
                                        <span className="text-center text-danger ml-5">{this.state.error["gender"]}
                                        </span>}
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
                                    {this.state.error["mobile"] && <span className="text-center text-danger">{this.state.error["mobile"]}
                            </span>}
                            </div>
                            
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

export default connect(mapStateToProps)(AddOrgUser);