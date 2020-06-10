import React from 'react';
import '../App.css';
import { AddOrganizations, baseApiUrl } from '../api/api';
import axios from 'axios'
import { store } from '../App'
import {connect} from 'react-redux';
class AddOrganization extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "",
            country: "US",
            org_name: "", 
            mobile: "",
            email_id: "",
           error: ""
        }
    }
    async componentDidMount() {
         const { id } = this.props.match.params;
        const currentUser = store.getState().loginData.user.token;
        if (id) {
            
            try {
                const response = await axios.get(`${baseApiUrl}/customers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser}`
                    }
                })
                    .then(response => {

                        return response.data;
                    })
               this.setState({
                    name: response.name,
                    org_name: response.org_name,
                    email_id: response.email_id,
                    mobile: response.mobile,
                    
                })
            }
            catch (error) {
                console.log(error, 'error')
            }
        }
    }
    addORG = async (e) => {
        e.preventDefault();
        const { id } = this.props.match.params;
        const data = this.state
        try {
            const response = await AddOrganizations(data,id);
            if (response.status === "failed") {
                this.setState({
                    error: response.message
                });
            } else {
                this.props.history.push('/configure/organizationlist');
            }

        }
        catch (e) {
            this.setState({
                error: e.message
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
        return (
            <div className="container-fluid">
                <form className="">
                    <div className="row p-2 bg-primary text-white">
                        {/* {id ? "Edit" : "Add"}  */}
                        Organization</div><br />
                    
                    <div className=" ml-4">
                    {this.state.error &&
                        <div className="col -4 text-center text-danger mb-3 font-weight-bold">
                            {this.state.error}
                        </div>
                    }
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Name:</label>
                            <div className="col-sm-4">
                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.name}
                                    name="name"
                                    className="form-control " placeholder="" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold ">Organization Name:</label>
                            <div className="col-sm-4">
                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.org_name}
                                    name="org_name"
                                    className="form-control " placeholder="" />
                            </div>
                        </div>
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
                            <label className="col-sm-2 col-form-label font-weight-bold ">Email ID:</label>
                            <div className="col-sm-4">
                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.email_id}
                                    name="email_id"
                                    className="form-control " placeholder="" />
                            </div>
                        </div>
                        
                           <div className="form-group row">
                            <label className="col-sm-2 col-form-label font-weight-bold "></label>
                            <div className="col-sm-4">
                                <button type="submit" className="btn btn-primary font-weight-bold btn-block" onClick={this.addORG}>{id ? "UPDATE" : "ADD ORGANIZATION"}</button>
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

export default connect(mapStateToProps)(AddOrganization);