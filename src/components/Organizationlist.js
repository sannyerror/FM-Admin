import React from 'react';
import { fetchOrganizations, baseApiUrl } from '../api/api';
import axios from 'axios'
import { connect } from 'react-redux';
import '../App.css';
import {  toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { store } from '../App'
export class OrganizationList extends React.Component {
    constructor() {
        super();
        this.state = {
            Organizations: [],
            userID: "",
            prompt: false

        }
    }

    async componentDidMount() {
        const res = await fetchOrganizations();
        this.setState({
            Organizations: res,
        })
    }

    handleDelete = async (e) => {
        e.preventDefault();
        let userID = this.state.userID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            userID = e.currentTarget.dataset.id;
        }
        const currentUser = store.getState().loginData.user.token;
        try {
            const response = await axios.delete(`${baseApiUrl}/customers/${userID}/`, {
                headers: {
                    'Authorization': `Bearer ${currentUser}`
                }
            })
                .then(response => {
                   return response.data; 
                })

            if (response.status === "failed") {
                this.setState({
                    error: response.status
                });
            } else {
                toast.info(`Organization deleted successfully.`, { position: toast.POSITION.TOP_CENTER,autoClose:3000 })
                const res = await fetchOrganizations();
               this.setState({
                Organizations: res,
                })

            }
        }
        catch (error) {
            console.log(error, 'error')
        }
    }

    handleEdit = async (e) => {
        e.preventDefault();
        let userID = this.state.userID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            userID = e.currentTarget.dataset.id;
        }
        this.setState({
            userID: userID,
            prompt: true
        })
        this.props.history.push(`/configure/organization/edit=true&id=${userID}`);
    }
render() {
    toast.configure()
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white">Organizations List</div>
                <div className="table-responsive ">
                    <table className="table table-striped table-sm table-bordered mt-5 ">
                        <thead className="bg-info text-white text-center">
                            <tr>
                                <th scope="col mb-4">Organization Name</th>
                                <th scope="col">Name</th>
                                {/* <th scope="col">Edit</th> */}
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.Organizations &&
                                this.state.Organizations.map((q, index) => (
  
                                    <tr>
                                        <td>{q.org_name}</td>
                                        <td>{q.name}</td>
                                        {/* <td>{q.role_type === "Super Admin" ? "-":(<a href="" data-id={q.id} onClick={this.handleEdit}>
                                            Edit</a>)}</td> */}
                                        <td>
                                             <a href="" data-id={q.id}
                                             onClick={e =>
                                                 window.confirm("Are you sure you wish to delete this Organization?") &&
                                                 this.handleDelete(e)
                                             }>Delete</a>
                                        
                                        </td>
                                    </tr>



                                ))}

                        </tbody>
                    </table>
                </div>
                <div className="form-group row d-flex justify-content-center">
                    &nbsp;
                            </div>
            </div>
        );

    }
}
const mapStateToProps = state => {
    return {
        organizationlist: state.getorganization.organizationlist,
    }
}
export default connect(mapStateToProps)(OrganizationList);