import React from 'react';
import { fetchOrganizations, baseApiUrl, fetchBillingStatus, isPrediction } from '../api/api';
import axios from 'axios'
import { connect } from 'react-redux';
import '../App.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { store } from '../App'
export class OrganizationList extends React.Component {
    constructor() {
        super();
        this.state = {
            Organizations: [],
            userID: "",
            prompt: false,
            startBill: false,
            Org_Name: "",
            Org_Id: ""

        }
    }

    async componentDidMount() {
        const res = await fetchOrganizations();
        this.setState({
            Organizations: res,
        })
    }

    handleShow = async (e) => {
        const org_id = e.currentTarget.dataset.id;
        const org_name = e.currentTarget.dataset.org;
        const response = await fetchBillingStatus(org_id);
        if (response.message === "Yet to be configured") {
            this.setState({
                showPOPUP: true,
                Org_Name: org_name,
                Org_Id: org_id
            })
        } else {
            this.setState({
                showPOPUP: false,
                Org_Name: org_name,
                Org_Id: org_id
            })

            this.props.history.push(`/billing/org=${org_id}&name=${org_name}`);
        }
        this.setState({
            showPOPUP: true,
            Org_Name: org_name,
            Org_Id: org_id
        })
    }

    start_Bill = () => {
        this.setState({
            showPOPUP: true,
            startBill: true
        })
    }

    handleClose = () => {
        this.setState({
            showPOPUP: false,
            startBill: false
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
                toast.info(`Organization deleted successfully.`, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
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

    onBilling = async (e) => {
        const name = this.state.Org_Name
        const Id = this.state.Org_Id
         await isPrediction(Id);
        this.setState({
            showPOPUP: false,
            startBill: false
        })

        this.props.history.push(`/billing/org=${Id}&name=${name}`);
    }

    render() {
        toast.configure()
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
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white">Organizations List</div>
                <div className="table-responsive ">
                    <table className="table table-striped table-sm table-bordered mt-5 ">
                        <thead className="bg-info text-white text-center">
                            <tr>
                                <th scope="col mb-4">Organization Name</th>
                                <th scope="col">Name</th>
                                <th scope="col">Billing</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.Organizations &&
                                this.state.Organizations.map((q, index) => (

                                    <tr key={index}>
                                        <td>{q.org_name}</td>
                                        <td>{q.name}</td>
                                        <td className="text-center text-primary"><button className="btn btn-link" data-id={q.id} data-org={q.org_name} onClick={this.handleShow} >Billing</button></td>
                                        {/* <td>{q.role_type === "Super Admin" ? "-":(<a href="" data-id={q.id} onClick={this.handleEdit}>
                                            Edit</a>)}</td> */}
                                        <td className="text-center">
                                            <i className="fa fa-trash" style={{fontSize:"24px", color:"red"}} data-id={q.id}
                                                onClick={e =>
                                                    window.confirm("Are you sure you wish to delete this Organization?") &&
                                                    this.handleDelete(e)
                                                }></i>

                                        </td>
                                    </tr>
                                ))}

                        </tbody>
                    </table>
                </div>
                <Modal
                    isOpen={this.state.showPOPUP}
                    //   onAfterOpen={afterOpenModal}
                    onRequestClose={this.handleClose}
                    style={customStyles}
                    contentLabel="Forgot Password"
                    ariaHideApp={false}
                >
                    <p className="text-center h5">{this.state.startBill ? "Do you want to start the billing?" : "Is the Prediction Model done?"}</p>

                    <div className="row ">
                        <div className="col text-center ">

                            <button className="button-pop" onClick={this.state.startBill ? this.onBilling : this.start_Bill} >Yes</button>

                        </div>
                        <div className="col text-center ">
                            <button className="button-pop" onClick={this.handleClose} >No</button>
                        </div>
                    </div>
                </Modal>
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