import React from 'react';
import { fetchOrganizations,
          fetchBillingStatus,
           isPrediction, 
           deleteOrganizations } from '../api/api';
import axios from 'axios';
import { connect } from 'react-redux';
import '../App.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';


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

export class OrganizationList extends React.Component {
    constructor() {
        super();
        this.state = {
            Organizations: [],
            userID: "",
            prompt: false,
            startBill: false,
            Org_Name: "",
            Org_Id: "",
            Delete_Org: "",
            suspend_lbl: "",
            active_lbl:""

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
        const org_remove = e.currentTarget.dataset.remove ? e.currentTarget.dataset.remove : '';
        this.setState({
            Org_Name: org_name,
            Org_Id: org_id
        })
        if (org_remove) {
            let is_suspend = e.currentTarget.dataset.suspend; 
            let is_active = e.currentTarget.dataset.active;
            this.setState({
                showPOPUP: true,
                Delete_Org: true,
                suspend_lbl: is_suspend === "true" ? "Resume" : "Suspend",
                active_lbl:  is_active === "true" ? "Deactivate" : "Activate",

            })
            
            
        } else {
            const response = await fetchBillingStatus(org_id);
            if (response.message === "Yet to be configured") {
                this.setState({
                    showPOPUP: true,
                })
            } else {
                this.setState({
                    showPOPUP: false,
                })

                this.props.history.push(`/admin/billing/org=${org_id}&name=${org_name}`);
            }
            this.setState({
                showPOPUP: true,
            })
        }

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
        let org_id = this.state.Org_Id
        let rmType = e.target.dataset.id;
        let response = await deleteOrganizations(org_id,rmType)
        if (response.status === "failed") {
            this.setState({
                error: response.status
            });
        } else {
            toast.info(response.data.message&&response.data.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
            const res = await fetchOrganizations();
            this.setState({
                Organizations: res,
                showPOPUP: false,
            })

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
        this.props.history.push(`/admin/configure/organization/edit=true&id=${userID}`);
    }

    onBilling = async (e) => {
        const name = this.state.Org_Name
        const Id = this.state.Org_Id
        await isPrediction(Id);
        this.setState({
            showPOPUP: false,
            startBill: false
        })

        this.props.history.push(`/admin/billing/org=${Id}&name=${name}`);
    }

    render() {
        toast.configure()
        let { Delete_Org, Org_Name, active_lbl, suspend_lbl } = this.state;
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
                                <th scope="col">Configure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.Organizations &&
                                this.state.Organizations.map((org, index) => (

                                    <tr key={index}>
                                        <td>{org.org_name}</td>
                                        <td>{org.name}</td>
                                        <td className="text-center text-primary">
                                            <i className="fa fa-money" style={{ fontSize: "24px", color: "" }} 
                                            data-id={org.id} data-org={org.org_name} 
                                            onClick={this.handleShow}></i>
                                        </td>
                                        {/* <td>{q.role_type === "Super Admin" ? "-":(<a href="" data-id={q.id} onClick={this.handleEdit}>
                                            Edit</a>)}</td> */}
                                        <td className="text-center">
                                            <i className="fa fa-cog" style={{ fontSize: "24px", color: "black" }}
                                                data-id={org.id}
                                                data-org={org.org_name}
                                                data-remove="true"
                                                data-active={org.is_active} data-suspend={org.is_suspend} 
                                                onClick={this.handleShow}></i> 

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
                    {Delete_Org ? (
                        <>
                            <p className="text-center h5">Do you want to {active_lbl} / {suspend_lbl} / Delete <strong>{Org_Name}</strong> Organization.</p>

                            <div className="row ">
                                <div className="col text-center ">
                                    <button className="btn btn-primary btn-lg" data-id={active_lbl} onClick={this.handleDelete} >{active_lbl}</button>
                                </div>
                                <div className="col text-center ">
                                    <button className="btn btn-primary btn-lg" disabled = {active_lbl === "Activate" && "true"}  data-id={suspend_lbl} onClick={this.handleDelete} >{suspend_lbl}</button>
                                </div>
                                <div className="col text-center ">
                                    <button className="btn btn-primary btn-lg" data-id="delete" onClick={this.handleDelete} >Delete</button>
                                </div>
                                <div className="col text-center ">
                                    <button className="btn btn-primary btn-lg" onClick={this.handleClose} >Cancel</button>
                                </div>
                            </div>
                        </> ): (
                            <>
                                <p className="text-center h5">{this.state.startBill ? "Do you want to start the billing?" : "Is the Prediction Model done?"}</p>

                                <div className="row ">
                                    <div className="col text-center ">

                                        <button className="button-pop" onClick={this.state.startBill ? this.onBilling : this.start_Bill} >Yes</button>

                                    </div>
                                    <div className="col text-center ">
                                        <button className="button-pop" onClick={this.handleClose} >No</button>
                                    </div>
                                </div>
                            </>
                        )
                    }

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