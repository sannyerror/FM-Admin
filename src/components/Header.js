import React from 'react';
import '../App.css';
import { logOut } from '../api/api';
import { connect } from 'react-redux'
export class Header extends React.Component {
  constructor(props){
      super(props)
  }
    handlelogout = () => {
        logOut();

    }

    onformConf = (e)=>{
        this.props.history.push('/org-configure/');
    }
    render() {
        const { token, is_pwd_updated, role_type } = this.props.user

        const url = "https://firstmatch.com/"
        return (

            <div id="app" className="container-fluid">
                <nav className="navbar navbar-expand-lg navbar-light ">
                    <a className="navbar-brand" href={`${token ? "/configure" : url}`}>
                        <img
                            className="navbar-brand"
                            alt="FirstMatch Logo"
                            src="/img/logo_stroke.png"
                            width="40%" height="40%"
                        />
                    </a>
                    <div id="navbarNav" className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">

                            <li className="nav-item">

                            </li>

                        </ul>
                        {token ? (
                            <ul className="navbar-nav mr-right">
                                <li className="nav-item">
                                <a className="btn btn-primary" href="/org-configure/">Configure FirstMatch&trade;</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/changepassword">Profile</a>
                                </li>
                                {is_pwd_updated === false ? "" : (
                                    <>
                                        {role_type === "Coordinator" ? "" : (
                                            <li className="nav-item">
                                                <a className="nav-link" href="/configure">Configure</a>
                                            </li>
                                        )}

                                        <li className="nav-item">
                                            <a className="nav-link" href="/eiflist">Interest Forms</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/raflist">Assessment Forms
                 </a>
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