import React from 'react';
import {
    fetchOrganizations,
    fetchBillingStatus,
    isPrediction,
    deleteOrganizations,
    Email_Credetials,
    Org_Super_Admins
} from '../api/api';
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
            active_lbl: "",
            showMessage: "",
            sendEmail: "",
            superAdminList: [],
            super_admin_email_id: []

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
        switch (org_remove) {
            case 'true':
                let is_suspend = e.currentTarget.dataset.suspend;
                let is_active = e.currentTarget.dataset.active;
                this.setState({
                    showPOPUP: true,
                    Delete_Org: true,
                    suspend_lbl: is_suspend === "true" ? "Resume" : "Suspend",
                    active_lbl: is_active === "true" ? "Deactivate" : "Activate",

                })
                break;
            case 'false':
                this.setState({
                    showPOPUP: true,
                    showMessage: true,
                })
                break;
            default:
                const response = await fetchBillingStatus(org_id);
                switch (response.message) {
                    case 'Yet to be configured':
                        this.setState({
                            showPOPUP: true,
                        })
                        break;
                    default:
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
            startBill: false,
            Delete_Org: false,
            showMessage: false,
            sendEmail: false
        })
    }

    handleDelete = async (e) => {
        e.preventDefault();
        let org_id = this.state.Org_Id
        let rmType = e.target.dataset.id;
        let response = await deleteOrganizations(org_id, rmType)
        if (response.status === "failed") {
            this.setState({
                error: response.status
            });
        } else {
            toast.info(response.data.message && response.data.message,
                { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
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

    sendCredentails_1 = async (e) => {
        const name = this.state.Org_Name
        const Id = this.state.Org_Id
        let email_id = (this.state.super_admin_email_id.filter(email => email)).toString()
        if(email_id) {
        let response = await Email_Credetials(Id,email_id)
        
        if (response.status === "failed") {
            toast.error(response.message && response.message,
                { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
            this.setState({
                error: response.status
            });
        } else {
            toast.info(response.message && response.message,
                { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
            this.setState({
                showPOPUP: false,
                sendEmail: false,
                showMessage: false,
                super_admin_email_id: []
            })
        }
    } else {
        toast.error("Please select Email-Id before clicking on Send button",
            { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
    }
    }

    sendCredentails = async (e) => {
        const name = this.state.Org_Name
        const Id = this.state.Org_Id
        let org_SAdmins = await Org_Super_Admins(Id)
        if (org_SAdmins.status === "failed") {
            org_SAdmins.message &&  toast.error(org_SAdmins.message && org_SAdmins.message,
                { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
            this.setState({
                error: org_SAdmins.status
            });
        }
        this.setState({
            superAdminList: org_SAdmins.status === "failed" ? [] : org_SAdmins.response,
            showPOPUP: true,
            sendEmail: true,
            showMessage: false
        })
    }

    Email_Onchange = async (e) => {
        let {name, value} = e.target
        let id = e.target.dataset.id
        let checked = e.target.checked
        let super_admin_email_id = this.state.super_admin_email_id
        super_admin_email_id[id] = checked ? value : ""
        this.setState({
            super_admin_email_id
        })
    }
    render() {
        toast.configure()
        let { Delete_Org, Org_Name, active_lbl, suspend_lbl, showMessage, sendEmail, superAdminList } = this.state;
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white">Organizations List</div>
                <div className="table-responsive ">
                    <table className="table table-striped table-sm table-bordered mt-5 ">
                        <thead className="bg-info text-white text-center">
                            <tr>
                                <th scope="col mb-4">Organization Name</th>
                                <th scope="col">Name</th>
                                <th scope="col">Communication</th>
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
                                        <td className="text-center">
                                            <i style={{ fontSize: "24px", color: "black" }}
                                                class="fa fa-envelope" aria-hidden="true"
                                                data-id={org.id} data-org={org.org_name}
                                                data-remove="false"
                                                onClick={this.handleShow}
                                            ></i>
                                        </td>
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
                                    <button className="btn btn-primary btn-lg" disabled={active_lbl === "Activate" && "true"} data-id={suspend_lbl} onClick={this.handleDelete} >{suspend_lbl}</button>
                                </div>
                                <div className="col text-center ">
                                    <button className="btn btn-primary btn-lg" data-id="delete" onClick={this.handleDelete} >Delete</button>
                                </div>
                                <div className="col text-center ">
                                    <button className="btn btn-primary btn-lg" onClick={this.handleClose} >Cancel</button>
                                </div>
                            </div>
                        </>) :
                        showMessage ? (<>
                            <p className="text-center h5">
                                Is the FirstMatch Tool configuration Done Or Are you sending the credentials again?</p>

                            <div className="row ">
                                <div className="col text-center ">

                                    <button className="button-pop" onClick={this.sendCredentails} >Yes</button>

                                </div>
                                <div className="col text-center ">
                                    <button className="button-pop" onClick={this.handleClose} >No</button>
                                </div>
                            </div>
                        </>) :

                            sendEmail ? (<>
                                <p className="text-center h5">
                                    The organization receives login credentials by clicking the Send button below:</p>
                                    
                                        {   
                                          superAdminList.length>0 ? superAdminList.map((list,i) => 
                                        <div className="row" style={{marginLeft:"10%", marginBottom: "8px", alignContent: "center"}}>
                                    <div className="form-check form-check-inline">
                                    <input
                                        style={{height: "18px", width:"18px"}}
                                        onChange={this.Email_Onchange}
                                        key={i}
                                        data-id={i}
                                        value={list.email_id}
                                        className="form-check-input" name="super_admin_email_id"
                                        checked={this.state.super_admin_email_id[i] === list.email_id}
                                        type="checkbox"  
                                         />
                                    <label className="form-check-label " style={{alignItems:"center"}} >
                                        {list.email_id}
                                    </label>
                                </div>
                                </div> 
                                        )
                                    : 
                                     <h2>There is no List of Super Admin EmailId's</h2>
                                    }
                                    

                                <div className="row " style={{marginTop: "10px"}}>
                                    <div className="col text-center ">

                                        <button className="button-pop" disabled={superAdminList.length===0} onClick={this.sendCredentails_1} >Send</button>

                                    </div>
                                    <div className="col text-center ">
                                        <button className="button-pop" onClick={this.handleClose} >Cancel</button>
                                    </div>
                                </div>
                            </>) :

                                (
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