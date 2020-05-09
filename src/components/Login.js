import React, { Component } from 'react';
import { login } from '../api/api';
import '../App.css'
export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            user: '',
            error: ''
        }
    }
    signin = async (e) => {
        e.preventDefault();
        const { email,password} = this.state
        if (!email && !password) {
            return this.setState({
                error: "Please provide Email ID / Password"
            })
        } else {
            try {
                const response = await login(email, password);
                if(response.data.response.is_pwd_updated){
                    if (response && response.data) {
                        const { token, refresh_token, role_type } = response.data.response;
                        this.setState({
                            accessToken: token,
                            refreshToken: refresh_token
                        })
                         console.log(role_type,"roletype")
                        this.props.history.push(`${role_type === "Coordinator" ? "/eiflist":"/configure"}`);
    
                    } else {
                        console.log("failed")
                    }
                }else{
                    this.props.history.push("/changepassword");
                }
                

            }
            catch (e) {
                this.setState({
                    error: "Invalid Email ID / Password entered."
                })
            }
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    render() {

        return (
            <div>
                <form>
                    <div className="text-center"><h2>Login</h2></div>
                    <div className="form-group row">
                        <label className="col-md-4 col-form-label text-md-right">Email ID:</label>
                        <div className="col-md-4">
                            <input type="text" className="form-control" name="email" onChange={this.handleChange}
                                value={this.state.email} required />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-md-4 col-form-label text-md-right">Password:</label>
                        <div className="col-md-4">
                            <input type="password" className="form-control" name="password" onChange={this.handleChange}
                                value={this.state.password} required />
                        </div>
                    </div>
                         {this.state.error && 
                         <div className="col text-center text-danger mb-3">
                         {this.state.error}
                     </div>
                      }
                        <div className="row ">
                            <div className="col text-center mb-3">
                                <button className="button" onClick={this.signin} >Login</button>
                            </div>
                        </div>
                    

                </form>
                
            </div>


        )
    }
}

export default Login

