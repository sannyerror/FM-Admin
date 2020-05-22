import React from 'react';
import '../App.css';
import {connect} from 'react-redux';
class Configure extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        const { role_type} = this.props.user
        return (

            <div className="container-fluid">
                <form>
                    <div className="form-group d-flex flex-column bd-highlight mb-2">
                        <div className="row p-2 bg-primary text-white">Forms</div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3"><a href="/configure/questioncategorylist">Question Categories</a></div>
                            <div className="col col-2"><a href="/configure/questioncategory">Add</a></div>
                            
                        </div>
                        <div className="row p-2 bd-highlight">
                            <div className="col col-3"><a href="/configure/questions">Questions</a></div>
                            <div className="col col-2"><a href="/configure/addquestion">Add</a></div>
                            
                        </div>
                        {role_type === "Super Admin" | "Admin" ? (
                            <><div className="row p-2 bg-primary text-white">Users</div>
                            <div className="row p-2 bd-highlight">
                                <div className="col col-3"><a href="/configure/userslist">Users List</a></div>
                                <div className="col col-2"><a href="/configure/adduser">Add</a></div>
                                
                                
                            </div>
                            <div className="row p-2 bg-primary text-white">Organizations</div>
                            <div className="row p-2 bd-highlight">
                                <div className="col col-3"><a href="/configure/userslist">Organizations List</a></div>
                                <div className="col col-2"><a href="/configure/adduser">Add</a></div>
                                
                                
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