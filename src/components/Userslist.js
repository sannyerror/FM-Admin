import React from 'react';
import { fetchUsers, baseApiUrl } from '../api/api';
import axios from 'axios';
import { connect } from 'react-redux';
import '../App.css';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import { store } from '../App';
export class UsersList extends React.Component {
    constructor() {
        super();
        this.state = {
            Users: [],
            userID: '',
            prompt: false,
            role_type: ''
        };
    }

    async componentDidMount() {
        const res = await fetchUsers();
        this.setState({
            Users: res,
            role_type: this.props.user.role_type
        });
    }

    handleDelete = async (e) => {
        e.preventDefault();
        let userID = this.state.userID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            userID = e.currentTarget.dataset.id;
        }
        const currentUser = store.getState().loginData.user.token;
        try {
            const response = await axios
                .delete(`${baseApiUrl}/users/${userID}/`, {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                })
                .then((response) => {
                    return response.data;
                });

            if (response.status === 'failed') {
                this.setState({
                    error: response.status
                });
            } else {
                toast.info(`User deleted successfully.`, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
                const res = await fetchUsers();
                this.setState({
                    Users: res
                });
            }
        } catch (error) {
            console.log(error, 'error');
        }
    };

    handleEdit = async (e) => {
        e.preventDefault();
        let userID = this.state.userID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            userID = e.currentTarget.dataset.id;
        }
        this.setState({
            userID: userID,
            prompt: true
        });
        this.props.history.push(`/admin/configure/user/edit=true&id=${userID}`);
    };

    render() {
        toast.configure();
        const { role_type } = this.state;
        const { loading, usersList } = this.props.getusers;
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white">Users List</div>
                <div className="table-responsive ">
                    <table className="table table-striped table-sm table-bordered mt-5 ">
                        <thead className="bg-info text-white text-center">
                            <tr>
                                <th scope="col mb-4">Name</th>
                                <th scope="col">Email ID</th>
                                <th scope="col">Role</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    {[0, 1, 2, 3, 4].map((cell) => (
                                        <td key={cell} className="text-center">
                                            <BeatLoader size={12} margin={4} color="#0099CC" loading={loading} />
                                        </td>
                                    ))}
                                </tr>
                            ) : usersList.length > 0 ? (
                                this.state.Users.map((ques, index) => (
                                    <tr key={index}>
                                        <td>{ques.full_name}</td>
                                        <td>{ques.email_id}</td>
                                        <td>{ques.role_type}</td>
                                        <td className="text-center">{(role_type === 'Coordinator' ? '-' : role_type === 'Admin' && (ques.role_type === 'Super Admin' || ques.role_type === 'Admin')) ? '-' : <i className="fa fa-edit" style={{ fontSize: '20px', color: '#000000' }} data-id={ques.id} onClick={this.handleEdit}></i>}</td>
                                        <td className="text-center">{(role_type === 'Coordinator' ? '-' : role_type === 'Admin' && (ques.role_type === 'Super Admin' || ques.role_type === 'Admin')) ? '-' : <i className="fa fa-trash" style={{ fontSize: '20px', color: 'red' }} data-id={ques.id} onClick={(e) => window.confirm('Are you sure you wish to delete this User?') && this.handleDelete(e)}></i>}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        <span>No Users Available</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="form-group row d-flex justify-content-center">&nbsp;</div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        getusers: state.getusers,
        user: state.loginData.user
    };
};
export default connect(mapStateToProps)(UsersList);
