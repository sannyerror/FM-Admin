import React from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';
class Configure extends React.Component {
    render() {
        const { role_type } = this.props.user;
        return (
            <div className="container-fluid">
                <form>
                    <div className="form-group d-flex flex-column bd-highlight mb-2">
                        <div className="row p-2 bg-primary text-white">Forms</div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3">
                                {/* <Link to="/admin/configure/questioncategorylist">Question Categories</Link> */}
                                <Link to="/admin/configure/questioncategorylist">Question Categories</Link>
                            </div>
                            <div className="col col-2">
                                <Link to="/admin/configure/questioncategory">
                                    <i className="fa fa-plus" style={{ color: '#000000', fontSize: '13px' }}></i> Add
                                </Link>
                            </div>
                        </div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3">
                                <Link to="/admin/configure/questions">Questions</Link>
                            </div>
                            <div className="col col-2">
                                <Link to="/admin/configure/addquestion">
                                    <i className="fa fa-plus" style={{ color: '#000000', fontSize: '13px' }}></i> Add
                                </Link>
                            </div>
                        </div>
                        <div className="row p-2 bg-primary text-white">Users</div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3">
                                <Link to="/admin/configure/userslist">Users List</Link>
                            </div>
                            <div className="col col-2">
                                <Link to="/admin/configure/adduser">
                                    <i className="fa fa-plus" style={{ color: '#000000', fontSize: '13px' }}></i> Add
                                </Link>
                            </div>
                        </div>
                        <div className="row p-2 bg-primary text-white">Organizations</div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3">
                                <Link to="/admin/configure/organizationlist">Organizations List</Link>
                            </div>
                            <div className="col col-2">
                                <Link to="/admin/configure/addorganization">
                                    <i className="fa fa-plus" style={{ color: '#000000', fontSize: '13px' }}></i> Add
                                </Link>
                            </div>
                            <div className="col col-2">
                                <Link to="/admin/eif">EIF Link</Link>
                            </div>
                        </div>
                        <div className="row p-2 bg-primary text-white">Communication</div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3">
                                <Link to="/admin/configure/emailslist">Emails List</Link>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row d-flex justify-content-center">
                        <span>&nbsp;</span>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.loginData.user
    };
};

export default connect(mapStateToProps)(Configure);
