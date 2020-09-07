import React, { Component } from 'react';
import { login, forgotPassWord } from '../api/api';
import Modal from 'react-modal';
import {connect} from 'react-redux'
import '../App.css'

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
    if (isLoggedIn && isLoggedIn.length>0&&isLoggedIn.token !== "") {
       this.props.history.push(`${isLoggedIn.role_type === "Coordinator" ? "/eiflist" : "/configure"}`);
    }
        this.state = {
            email: '',
            password: '',
            email_id:"",
            user: '',
            showPOPUP: false,
            error: ''
        }
    }

    handleShow = () => {

        this.setState({
            showPOPUP: true
        })
    }
    handleClose = () => {
        this.setState({
            showPOPUP: false
        })
    }
    forgotPassword = async (e) => {
        e.preventDefault();
        const { email_id } = this.state
        try {
            const response = await forgotPassWord(email_id);
            if(response.status === "success"){
                this.setState({
                    error: "Reset password sent to your Email ID.",
                    showPOPUP: false
                })
            }else {
                this.setState({
                    error: "Invalid Email ID.",
                    showPOPUP: false
                })   
            }
            
        }
        catch (e) {
            this.setState({
                error: "Invalid Email ID / Password entered."
            })
        }
    }
    signin = async (e) => {
        e.preventDefault();
        const { email, password } = this.state
        if (!email && !password) {
            return this.setState({
                error: "Please provide Email ID / Password"
            })
        } else {
            try {
                const response = await login(email, password);
                if (response.data.response.is_pwd_updated) {
                    if (response && response.data) {
                        const { token, refresh_token, role_type } = response.data.response;
                        this.setState({
                            accessToken: token,
                            refreshToken: refresh_token
                        })
                        this.props.history.push(`${role_type === "Coordinator" ? "/eiflist" : "/configure"}`);

                    } 
                } else {
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
            <div className="shadow-lg p-5 mb-5 bg-white rounded">
                <form >
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
                            <span className="btn btn-link text-primary" onClick={this.handleShow} >Forgot Password</span>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col text-center mb-3">
                            <button className="button" onClick={this.signin} >Login</button>
                        </div>
                    </div>


                </form>
                <Modal
                    isOpen={this.state.showPOPUP}
                    //   onAfterOpen={afterOpenModal}
                    onRequestClose={this.handleClose}
                    style={customStyles}
                    contentLabel="Forgot Password"
                    ariaHideApp={false}
                >

                   <div className="text-center text-primary"><h2>Forgot Password</h2></div>
                   <p className="text-center">Please enter registered Email ID below to get reset password.</p>
                    <form>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right font-weight-bold">Email ID:</label>
                            <div className="col-md-8">
                                <input type="text" className="form-control" name="email_id" onChange={this.handleChange}
                                    value={this.state.email_id} required />
                            </div>
                        </div>
                        <div className="row ">
                        <div className="col text-center ">
                            <button className="button-pop" onClick={this.forgotPassword} >Submit</button>
                        </div>
                        <div className="col text-center ">
                            <button className="button-pop" onClick={this.handleClose} >Close</button>
                        </div>
                    </div>
                        
                    </form>
                </Modal>
            </div>


        )
    }
}

const mapStateToProps = state => ({
    user: state.loginData.user
  });
  export default connect(mapStateToProps)(Login)

