import React from 'react';
import { fetchRaflist, baseApiUrl, UpdateDomain, resendRAF } from '../api/api';
import { connect } from 'react-redux';
import axios from 'axios'
import { toast } from 'react-toastify';
import '../App.css';
import { BeatLoader } from 'react-spinners'
import { store } from '../App'
export class RAFList extends React.Component {
    constructor() {
        super();
        this.state = {
            RafList: [],
            listID: "",
            listData: [],
            customerId: "",
            categoryId: "",
            formstatus: "",
            success: "",
            domain: "",
            username: "",
            password: "",
            list_status: "",
            domain_updated: false,
            Host: window.location.host


        }
    }
    async componentDidMount() {
        this.setState({ loading: true })
        const RafList = await fetchRaflist();
        this.setState({
            RafList: this.props.RafList,
            loading: false
        })

    }

    getDetails = (e) => {
        e.preventDefault();
        let listID = this.state.listID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            listID = e.currentTarget.dataset.id;
        }
        const List = this.state.RafList.response.filter(listdata => listdata.id == listID)
        let customer_id = List.find(obj => obj.customer_id);
        this.setState({
            listID: listID,
            listData: List,
            customerId: customer_id.customer_id,
            categoryId: customer_id.category_id,
            list_status: customer_id.is_status_updated
        });
    }
    addDecision = async (e) => {
        const { categoryId, customerId } = this.state
        const { value } = e.target
        const data = {
            customer: customerId,
            category: categoryId,
            form_status: value
        }
        const currentUser = store.getState().loginData.user.token;
        const response = await axios.post(`${baseApiUrl}/stages/validate/`,
            data, {
            headers: {
                'Authorization': `Bearer ${currentUser}`
            }
        })
            .then(response => {

                return response.data;
            })
        this.setState({
            listID: "",
            success: response.status,
            domain: response.response.custom_domain,
            username: response.response.username,
            password: response.response.password

        });
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            domain_updated: true
        })

    }
    SendEmail = async(e) => {
        e.preventDefault();
        const {customerId,domain,domain_updated} = this.state;
      let response = await UpdateDomain(customerId,domain,domain_updated)
      if(response.status === "success"){
        toast.info(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
        this.setState({
            listID: "",
            loading: true,
            RafList:"",
            success: "",
            domain: "",
            username: "",
            password: "",
            domain_updated: false,
        })
        await fetchRaflist();
        this.setState({
            loading: false
        });
                
      }else {
        toast.error(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
      }
    }

    resend_raf = async(e) => {
        const {  customerId } = this.state
       const response = await resendRAF(Number(customerId))
       if(response.status === "success"){
        toast.info(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
        this.setState({
            listID: "",
            loading: true,
            RafList:""
        })
        await fetchRaflist();
        this.setState({
            listID: "",
            success: "",
            domain: "",
            username: "",
            password: "",
            domain_updated: false,
            RafList: this.props.RafList,
            loading: false
        });
        
      }else {
        toast.error(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
      }
      
    }

    render() {
        toast.configure()
        let { listID, success, domain, username, password, list_status, loading, domain_updated } = this.state;
        
        if (listID !== "") {
            return (
                <div className="container-fluid">
                    <div className="row p-2 bg-primary text-white mb-1">RAF List Details</div>

                    <ul className="list-group">
                        {this.state.listData.map(info => (info.children.map(r =>
                        (r.questions.map(q => (q.answers.map(z => (
                            <li className="list-group-item mb-1" >
                                <span className="text-primary "> {q.question}</span> <br />
                                <span className=" ">(A)</span> -
                                {z.answer.includes('static') ? (<a href={`${baseApiUrl}/${z.answer}`} className="font-weight-bold">View File</a>) : (<span className="text-primary font-weight-bold">{z.answer}</span>)}

                            </li>
                        )
                        )))))))}
                    </ul>
                    {list_status === true ? "" : (
                        <div className="form-group row mt-3 mb-3">
                            <div className="col-sm-1  ">
                                &nbsp;
                            </div>
                            <div className="col-sm-3 d-flex justify-content-center">
                                <button type="submit" value="resend" className="btn btn-primary pr-5 pl-5" onClick={e => this.resend_raf(e, "value")}>Resend</button>
                            </div>
                            <div className="col-sm-3 d-flex justify-content-center">
                                <button type="submit" value="approved" className="btn btn-primary pr-5 pl-5" onClick={e => this.addDecision(e, "value")}>Approve</button>
                            </div>
                            <div className="col-sm-3 d-flex justify-content-center">
                                <button type="submit" value="rejected" className="btn btn-secondary pr-5 pl-5" onClick={e => this.addDecision(e, "value")}>Reject</button>
                            </div>
                            <div className="col-sm-1">
                                &nbsp;
                            </div>
                        </div>
                    )}
                    <div className="m-0">
                        &nbsp;
                                </div>
                </div>
            );
        }
        else {
            if (success !== "") {
                return (
                    <div className="container-fluid">
                        <div className="row p-2 bg-primary text-white">New Organization Details</div><br />
                        <form onSubmit={this.SendEmail}>
                            <div className=" ml-4">
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label font-weight-bold ">Domain:</label>
                                    <div className="col-sm-4">
                                        <input type="text" className="form-control" id="validationDefault01" onChange={this.handleChange}
                                            value={this.state.domain}
                                            name="domain" required />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label font-weight-bold ">User Name:</label>
                                    <div className="col-sm-4">
                                        {username}
                                    </div>

                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label font-weight-bold ">Password:</label>
                                    <div className="col-sm-4">
                                        {password}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label font-weight-bold "></label>
                                    <div className="col-sm-4">
                                        <button type="submit" className="btn btn-primary font-weight-bold btn-block" >
                                            {domain_updated ? "Update Domain & Send Email" : "Send Email"}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                );
            } else {
                return (
                    <div className="container-fluid">
                        <div className="row p-2 bg-primary text-white mb-1">RAF List</div>
                        {loading ? <div className="form-group mt-5 row d-flex justify-content-center"><span className="font-weight-bold h5">Loading</span><BeatLoader size={24} color='#0099CC' loading={loading} /><BeatLoader size={24} color='#0099CC' loading={loading} /></div> : ""}
                        <ul className="list-group">
                            {this.state.RafList.response && this.state.RafList.response.map((ques, index) =>

                            (
                                <li key={index} className="list-group-item mb-1" data-id={ques.id} onClick={this.getDetails}>
                                    <span className="text-primary ">{ques.org_name}</span> <br />
                                    <span className=" ">Created On: </span>
                                    <span className="text-primary font-weight-bold">{ques.date_created}</span>
                                    <br />
                                    <span className=" ">Status: </span>
                                    <span className="text-primary font-weight-bold">

                                        {ques.is_approved === ques.is_rejected ? "Pending" :
                                            ques.is_approved !== true ? "Rejected" : "Approved"}</span>
                                </li>))}
                        </ul>

                    </div>
                );
            }

        }


    }
}
const mapStateToProps = state => {
    return {
        RafList: state.raflists.RafList,
    }
}
export default connect(mapStateToProps)(RAFList);