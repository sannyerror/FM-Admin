import React from 'react';
import '../App.css';
import {connect} from 'react-redux';
class Configure extends React.Component {
   
    render() {
        const { role_type} = this.props.user
        return (

            <div className="container-fluid">
                <form>
                    <div className="form-group d-flex flex-column bd-highlight mb-2">
                        <div className="row p-2 bg-primary text-white">Forms</div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3"><a href="/admin/configure/questioncategorylist">Question Categories</a></div>
                            <div className="col col-2"><a href="/admin/configure/questioncategory"><i className="fa fa-plus" style={{color:"#000000", fontSize:"13px"}}></i> Add</a></div>
                            
                        </div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3"><a href="/admin/configure/questions">Questions</a></div>
                            <div className="col col-2"><a href="/admin/configure/addquestion"><i className="fa fa-plus" style={{color:"#000000", fontSize:"13px"}}></i> Add</a></div>
                            
                        </div>
                        {role_type === "Super Admin" || role_type === "Admin" ? (
                            <><div className="row p-2 bg-primary text-white">Users</div>
                            <div className="row p-2 bd-highlight">
                                <div className="col col-3"><a href="/admin/configure/userslist">Users List</a></div>
                                <div className="col col-2"><a href="/admin/configure/adduser"><i className="fa fa-plus" style={{color:"#000000", fontSize:"13px"}}></i> Add</a></div>
                                
                                
                            </div>
                            <div className="row p-2 bg-primary text-white">Organizations</div>
                            <div className="row p-2 bd-highlight">
                                <div className="col col-3"><a href="/admin/configure/organizationlist">Organizations List</a></div>
                                <div className="col col-2"><a href="/admin/configure/addorganization" target="_blank"><i className="fa fa-plus" style={{color:"#000000", fontSize:"13px"}}></i> Add</a></div>
                                <div className="col col-2"><a href="/admin/eif">EIF Link</a></div>
                                
                                
                            </div>
                            <div className="row p-2 bg-primary text-white">Communication</div>
                            <div className="row p-2 bd-highlight">
                                <div className="col col-3"><a href="/admin/configure/emailslist">Emails List</a></div>
                               </div>
                            </>
                        ):""}
                        
                    </div>
                    <div className="form-group row d-flex justify-content-center">
                        &nbsp;
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

export default connect(mapStateToProps)( Configure);