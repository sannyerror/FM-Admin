import React from 'react';
import '../App.css';
import { AddUsers, baseApiUrl } from '../api/api';
import axios from 'axios'
import { store } from '../App'
import {connect} from 'react-redux';
class AddUser extends React.Component {
    constructor() {
        super();
        this.state = {
            first_name: "",
            last_name: "",
            email_id: "",
            gender: '',
            mobile: "",
            role_type:"",
            Roles:[],
            error: ""
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
               
                this.setState({
                    first_name: response.first_name,
                    last_name: response.last_name,
                    email_id: response.email_id,
                    gender: `${response.gender}`,
                    mobile: response.mobile,
                    role_type: response.role_type,
                })
            }
            catch (error) {
                console.log(error, 'error')
            }
        }
    }
    getRoles = async() =>{
        const currentUser = store.getState().loginData.user.token;
        return await axios.get(`${baseApiUrl}/groups/`,{
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
            const response = await AddUsers(data,id);
            console.log(response,"rr")
            
            if (response.status === "failed") {
                // this.setState({
                //     error: response
                // });
            } else {
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
        const { name, value } = e.target;
        if(name === "email_id"){
            this.setState({            
                [name]: value
            });                
        }else{
            this.setState({            
                [name]: value.charAt(0).toUpperCase() + value.substr(1)
            });
        }
       
    }
    onRadioChange = (e) => {
        // const { name, value } = e.target;
        this.setState({
            gender: e.currentTarget.value
        });
        
    }

    render() {
        const { id } = this.props.match.params
        const { role_type} = this.props.user
        
        return (
            <div className="container-fluid">
                <form className="">
                    <div className="row p-2 bg-primary text-white">{id ? "Edit" : "Add"} User</div><br />
                    {this.state.error &&
                        <div className="col text-center text-danger mb-3 font-weight-bold">
                            {this.state.error}
                        </div>
                    }
                    <div className=" ml-4">
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">First Name:</label>
                            <div className="col-sm-4">
                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.first_name}
                                    name="first_name"
                                    className="form-control " placeholder="" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Last Name:</label>
                            <div className="col-sm-4">
                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.last_name}
                                    name="last_name"
                                    className="form-control " placeholder="" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Email ID:</label>
                            <div className="col-sm-4">
                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.email_id}
                                    name="email_id"
                                    className="form-control " placeholder="" />
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
                                             />
                                        <label className="form-check-label" >
                                            Female
                                    </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            onChange={this.onRadioChange}
                                            className="form-check-input" name="gender" 
                                            type="radio" value="2"  id="male"
                                            checked={this.state.gender === "2"}
                                             />
                                        <label className="form-check-label" >
                                            Male
                                    </label>
                                    </div>

                                </div>
                            </div>
                        </fieldset>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Mobile Number:</label>
                            <div className="col-sm-4">
                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.mobile}
                                    name="mobile"
                                    className="form-control " placeholder="" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold " >Role:</label>
                            <div className="col-sm-4">
                                <select name="group_id" className="form-control" id="exampleFormControlSelect1" onChange={this.handleChange}>
                                <option value="" checked={this.state.group_id === "0"}>Select</option>
                                {this.state.Roles.map(role => <option value={role.id} selected={this.state.role_type === role.name}>{role.name}</option> )}
                                {/* {role_type === "Super Admin" ? (<option value="Admin" checked={this.state.group-id === "Admin"}>Admin</option>): ""} */}
                                  {/* <option value="Contributor" checked={this.state.group-id === "Contributor"}>Contributor</option>
                                    <option value="Coordinator" checked={this.state.group-id === "Coordinator"}>Coordinator</option> */}
                                </select> 
                            </div>
                        </div>
                           <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold "></label>
                            <div className="col-sm-4">
                                <button type="submit" className="btn btn-primary font-weight-bold btn-block" onClick={this.addUser}>{id ? "UPDATE" : "ADD USER"}</button>
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