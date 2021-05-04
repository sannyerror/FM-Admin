import React from 'react';
import { fetchEmails, baseApiUrl } from '../api/api';
import axios from 'axios'
import '../App.css';
import { store } from '../App'
import { toast } from 'react-toastify';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

export class EmailList extends React.Component {
    constructor() {
        super();
        this.state = {
            Emails: [],
            userID: "",
            prompt: false

        }
    }

    async componentDidMount() {
        const res = await fetchEmails();
        this.setState({
            Emails: res&&res.response,
        })
    }

    handleResend = async (e) => {
        e.preventDefault();
       let userID = this.state.userID;
        if (e.currentTarget.dataset.id === 0 || e.currentTarget.dataset.id) {
            userID = e.currentTarget.dataset.id;
        }
        const currentUser = store.getState().loginData.user.token;
        try {
            const response = await axios.post(`${baseApiUrl}/admin/email-statuses`,
                { status_id: userID }, {
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
                const res = await fetchEmails();
                this.setState({
                    Emails: res.response,
                })
                toast.info('Email resent successfully.', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
            }
        }
        catch (error) {
            console.log(error, 'error')
        }
    }


    render() {
        toast.configure()
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white">Emails List</div>
                <div className="table-responsive ">
                    <table className="table table-striped table-sm table-bordered mt-5 ">
                        <thead className="bg-info text-white text-center">
                            <tr>
                                <th scope="col mb-4">Email</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Created on</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.Emails &&
                                this.state.Emails.map((q, index) => (

                                    <tr>
                                        <td>{q.recipient}</td>
                                        <td>{q.subject}</td>
                                        <td>{q.date_created}</td>
                                        <td>{q.status === "success" ? "Success" : (<Link to="" data-id={q.id} onClick={this.handleResend}>
                                            Resend Email</Link>)}</td>

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

export default EmailList;