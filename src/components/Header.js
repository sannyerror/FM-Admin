import React from 'react';
import '../App.css';
import { logOut } from '../api/api';
import { connect } from 'react-redux'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom";
export class Header extends React.Component {
  constructor(props){
      super(props)
  }
    handlelogout = () => {
        logOut();

    }

    onformConf = (e)=>{
        this.props.history.push('/admin/org-configure/');
    }
    render() {
        const { token, is_pwd_updated, role_type } = this.props.user
        const { refreshToken } = this.props
        const url = "https://firstmatch.com/"
        return (

            <div id="app" className="container-fluid">
                <nav className="navbar navbar-expand-lg navbar-light ">
                    <Link className="navbar-brand" to={`${token ? "/admin/configure" : url}`}> 
                        <img
                            className="navbar-brand"
                            alt="FirstMatch Logo"
                            src="/img/logo_stroke.png"
                            width="40%" height="40%"
                        />
                    </Link>
                    <div id="navbarNav" className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">

                            <li className="nav-item">

                            </li>

                        </ul>
                        {token ? (
                            <ul className="navbar-nav mr-right">
                                <li className="nav-item">
                                <Link className="btn btn-primary" to="/admin/org-configure/">Configure FirstMatch&trade;</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/changepassword">Profile</Link>
                                </li>
                                {is_pwd_updated === false ? "" : (
                                    <>
                                        {role_type === "Coordinator" ? "" : (
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/admin/configure">Configure</Link>
                                            </li>
                                        )}

                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin/eiflist">Interest Forms</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin/raflist">Assessment Forms
                 </Link>
                                        </li>

                                    </>
                                )}
                                <li className="nav-item">
                                    <button className="btn btn-link" onClick={this.handlelogout}>Logout</button>
                                </li>
                            </ul>
                        )
                            :
                            ""

                        }

                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.loginData.user
});
export default connect(mapStateToProps)(Header);