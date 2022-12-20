import React from 'react';
import '../App.css';
import { logOut } from '../api/api';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            profilePage: false
        };
    }
    handlelogout = () => {
        logOut();
    };

    onformConf = (e) => {
        this.props.history.push('/admin/org-configure/');
    };
    tabChange = () => {
        this.setState({ profilePage: false });
    };
    render() {
        const { token, is_pwd_updated, role_type, pwd_expires_in, is_pwd_expired } = this.props.user;

        const { refreshToken } = this.props;
        const url = 'https://firstmatch.com/';
        const screenName = window.location.pathname.split('/').pop();
        return (
            <div id="app" className="container-fluid">
                {token && pwd_expires_in <= 10 ? (
                    this.state.show ? (
                        ''
                    ) : (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            Your password {is_pwd_expired ? 'has expired' : `will expire in ${pwd_expires_in} days`}.
                            {this.state.profilePage || screenName === 'changepassword' ? (
                                ''
                            ) : (
                                <>
                                    &nbsp;Please{' '}
                                    <Link className="text-danger fw-semibold" to={`${token && '/admin/changepassword'}`}>
                                        <strong>click here</strong>
                                    </Link>{' '}
                                    to change your password!
                                </>
                            )}
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.setState({ show: true })}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    )
                ) : (
                    ''
                )}
                <nav className="navbar navbar-expand-lg navbar-light ">
                    <Link className="navbar-brand" onClick={this.tabChange} to={`${token ? (is_pwd_expired ? '/admin/changepassword' : '/admin/configure') : url}`}>
                        <img className="navbar-brand" alt="FirstMatch Logo" src="/img/logo_stroke.png" width="40%" height="40%" />
                    </Link>

                    <div id="navbarNav" className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item"></li>
                        </ul>
                        {token ? (
                            <ul className="navbar-nav mr-right">
                                <li className={`nav-item ${is_pwd_expired ? 'd-none' : 'd-inline'}`}>
                                    <Link className="btn btn-primary" onClick={this.tabChange} to="/admin/org-configure/">
                                        Configure FirstMatch&reg;
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/changepassword" onClick={() => this.setState({ profilePage: true })}>
                                        Profile
                                    </Link>
                                </li>
                                {is_pwd_updated === false ? (
                                    ''
                                ) : (
                                    <>
                                        <li className={`nav-item ${is_pwd_expired ? 'd-none' : 'd-inline'}`}>
                                            <Link className="nav-link" onClick={this.tabChange} to="/admin/configure">
                                                Configure
                                            </Link>
                                        </li>

                                        <li className={`nav-item ${is_pwd_expired ? 'd-none' : 'd-inline'}`}>
                                            <Link className="nav-link" onClick={this.tabChange} to="/admin/eiflist">
                                                Interest Forms
                                            </Link>
                                        </li>
                                        <li className={`nav-item ${is_pwd_expired ? 'd-none' : 'd-inline'}`}>
                                            <Link className="nav-link" onClick={this.tabChange} to="/admin/raflist">
                                                Assessment Forms
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li className="nav-item">
                                    <button className="btn btn-link" onClick={this.handlelogout}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        ) : (
                            ''
                        )}
                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.loginData.user
});
export default connect(mapStateToProps)(Header);
