import React from 'react';
import '../App.css';
import { fetchBillingStatus, configureBilling, 
          fetchAllRecords, getRecord,
          downloadAllRecords,getOrderDownload,downloadReportCSV  } from '../api/api';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class BillingDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            sDate: "",
            startDate: "",
            endDate: "",
            eDate: "",
            billing_cycle: "",
            base_fare: "",
            other_charges: "",
            config: false,
            org: "",
            org_name: "",
            billingOn: "",
            displayFrom: "",
            displayTo: "",
            allRecords: [],
            singlerecord: [],
            error: "",
            record_id:""
        }
    }

    async componentDidMount() {
        const { org, name } = this.props.match.params
        const response = await fetchBillingStatus(org);
        if (response.status === "failed") {
            const msg = response.message === "Billing not started" ? true : false
            const btn = response.message === "Billing not started" ? "invisible" : "visible"
            this.setState({
                error: response.message,
                config: msg,
                org: org,
                org_name: name,
                btnvisible: btn,
                billingOn: msg,


            })
        } else {

            this.setState({
                error: "",
                billing_cycle: response.response[0].billing_cycle ? response.response[0].billing_cycle : "",
                base_fare: response.response[0].base_fare ? response.response[0].base_fare : "",
                other_charges: response.response[0].other_fare_per_cycle ? response.response[0].other_fare_per_cycle : "",
                org: response.response[0].customer ? response.response[0].customer : "",
                org_name: name,
            })
        }
    }

    setStartDate = (date) => {
        let event = new Date(date);
        let year = event.getFullYear();
        let month = 1 + (event.getMonth())
        let datee = event.getDate();
        let date1 = [year, month, datee].join("-")
        let date2 = event.toDateString().slice(4);
        this.setState({ startDate: date, sDate: date1, displayFrom: date2 })
    }

    setEndDate = (date) => {
        let event = new Date(date);
        let year = event.getFullYear();
        let month = 1 + (event.getMonth())
        let datee = event.getDate();
        let date1 = [year, month, datee].join("-")
        let date2 = event.toDateString().slice(4);
        this.setState({ endDate: date, eDate: date1, displayTo: date2 })
    }

    configBilling = async (e) => {
        e.preventDefault();
        const { org, billing_cycle, base_fare, other_charges } = this.state;
        const data = {
            customer: org,
            billing_cycle: billing_cycle,
            base_fare: base_fare,
            other_fare_per_cycle: other_charges
        }
        try {
            
            const { billingOn } = this.state;
            const response = await configureBilling(data, billingOn ? "" : "true");
            if (response.status === "failed") {
                this.setState({
                    config: true
                });
            } else {
                toast.success(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
                this.setState({
                    config: true,
                })

            }

        }
        catch (e) {
            this.setState({
                error: e.data.title
            });
            return;
        }
    };
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    onConfigure = (e) => {
        this.setState({
            config: true
        })
    }

    onBack = (e) => {
        this.setState({
            config: false,
            singlerecord: []
        })
    }

    onRadioChange = (e) => {
        const {  value } = e.target;
        this.setState({
            billing_cycle: value
        })
    }

    onLoad = async (e) => {
        e.preventDefault();
        const { org, sDate, eDate } = this.state;
        const response = await fetchAllRecords(org, sDate, eDate);

        if (response.status === "failed") {
            this.setState({
                error: response.message,
                config: false
            })
        } else {
            this.setState({
                allRecords: response,
                config: false,
                error: "",
                singlerecord:[]
            })
        }

    }

    singleRecord = async (e) => {
        e.preventDefault();
        const id = e.currentTarget.dataset.id
        const response = await getRecord(id);
        this.setState({
            singlerecord: response,
            record_id: id
        })
    }
     
    downloadAllorders=async(e)=>{
        const { org, sDate, eDate } = this.state;
       const res = await downloadAllRecords(org); 
       const path = res.response
       
    }

    downloadOrder=async(e)=>{
        const { org, sDate, eDate } = this.state;
       const res = await getOrderDownload(org,sDate, eDate);
      
    }

    downloadReport=async(e)=>{
        const id = e.currentTarget.dataset.id
       const res = await downloadReportCSV(id ); 
       const path = res.response
       
    }
    render() {
        toast.configure()
        const { config, btnvisible, org_name   } = this.state;
        return (

            <div className="container-fluid">
                {config ? <form onSubmit={this.configBilling}>
                    <div className="row p-2 bg-primary text-white mb-3">Billing Details</div>

                    {this.state.error &&
                        <div className="col text-center text-danger mb-3 font-weight-bold">
                            {this.state.error === "Billing not started" ? `${this.state.error}. Please enter below details to start billing.` : this.state.error}
                        </div>
                    }
                    <div className=" ml-4">
                        <p className="ml-5">Configuring billing details for {org_name}</p>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label font-weight-bold ">Billing Cycle:</label>
                            <div className="col-sm-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="billing_cycle" onChange={this.onRadioChange} value="monthly" checked={this.state.billing_cycle == "monthly"} />
                                    <label className="form-check-label" >
                                        Monthly
                                       </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="billing_cycle" onChange={this.onRadioChange} id="exampleRadios1" value="15th to 15th" checked={this.state.billing_cycle == "15th to 15th"} />
                                    <label className="form-check-label" >
                                        15th to 15th
                                        </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label font-weight-bold ">Base fare:</label>
                            <div className="col-sm-1 input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">$</span>
                                </div>

                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.base_fare}
                                    name="base_fare"
                                    aria-label="Amount (to the nearest dollar)"
                                    className="form-control " placeholder="" required />
                            </div>
                            <div className="col-sm-8">Please enter an amount to be billed for each report generated using the prediction model per unique client</div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label font-weight-bold ">Other charges per billing cycle:</label>
                            <div className="col-sm-1 input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">$</span>
                                </div>
                                <input type="text"
                                    onChange={this.handleChange}
                                    value={this.state.other_charges}
                                    name="other_charges"
                                    className="form-control " required />
                            </div>
                            <div className="col-sm-8">Please enter an amount which needs to be used in the calculation per billing cycle. This value can be a positive or negative number or a zero too. This value acts as a monthly discount on the overall billing amount.</div>
                        </div>

                        <div className="form-group row">
                            <div className="col-sm-4 ml-5">
                                <button type="submit" className="button-pop " >Save</button>
                                <button type="submit" className={`button-pop ml-3 ${btnvisible} `} onClick={this.onBack} >back</button>
                            </div>
                        </div>
                    </div>
                </form>
                    :
                    <>
                        <div className="form-group d-flex flex-column bd-highlight mb-2">
                            <div className="row p-2 bg-primary text-white mb-3">Billing Details</div>
                            <div className="row p-2 ml-0 mr-0 bd-highlight align border border-primary">
                                <div className="form-check col col-3 p-3 form-check-inline ml-3">
                                    <label className="form-check-label" >
                                        Organization: 
                             </label>
                                    <div className="ml-4 font-weight-bold">{org_name}</div>

                                </div>
                                <div className="form-check col col-3 p-3 form-check-inline ml-3">

                                    <div className="d-flex justify-content-end"><a href="#" onClick={this.onConfigure}>Configure</a></div>
                                </div>
                            </div>
                            {this.state.allRecords && this.state.allRecords.response && this.state.singlerecord.response ?
                                <>
                                    <p className="mt-4 ml-3">Order report for {this.state.org_name}. {this.state.singlerecord&&this.state.singlerecord.response.started_on.slice(0, 10)} to {this.state.singlerecord&&this.state.singlerecord.response.completed_on.slice(0, 10)}. Order ID - {this.state.singlerecord.response.id}</p>
                                    <div className="table-responsive">
                                        <table className="table table-striped table-sm table-bordered">

                                            <thead className="bg-info text-white text-center">
                                                <tr>
                                                    <th scope="col mb-4">Time Stamp</th>
                                                    <th scope="col">Report ID​</th>
                                                    <th scope="col">Client Code​</th>
                                                    <th scope="col">Referral Source​</th>
                                                    <th scope="col">Amount​</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.singlerecord &&
                                                    this.state.singlerecord.response.order_reports.map((q, index) => (

                                                        <tr key ={index} className="text-center">
                                                            <td>{q.date_created}</td>
                                                            <td>{q.report_id}</td>
                                                            <td>{q.client_code}</td>
                                                            <td>{q.referral_source}</td>
                                                            <td>{q.amount}</td>
                                                        </tr>
                                                    ))}
                                                <tr className="text-center">
                                                    <td>Total amount:</td>
                                                    <td>${this.state.singlerecord.response.amount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="form-group row d-flex justify-content-center mr-3">
                                            <button className="btn btn-primary" data-id={this.state.record_id} onClick={this.downloadReport}>Download CSV</button>
                                            <button type="submit" className="btn btn-primary ml-3" onClick={this.onBack} >back</button>
                                        </div>
                                    </div>
                                </>
                                : (this.state.allRecords&&this.state.allRecords.response &&
                                    <>
                                        <p className="mt-4 ml-3">Order report for {this.state.org_name}. {this.state.displayFrom} to {this.state.displayTo}.​</p>

                                        <div className="table-responsive col-4">
                                            <table className="table table-striped table-sm table-bordered">

                                                <thead className="bg-info text-white text-center">
                                                    <tr>
                                                        <th scope="col mb-4">Order Id</th>
                                                        <th scope="col">Billing Period</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.allRecords.response.length > 0 ?
                                                        this.state.allRecords.response.map((q, index) => (

                                                            <tr key={index} className="text-center">
                                                                <td data-id={q.id} onClick={this.singleRecord}>{q.id}</td>
                                                                <td>{q.started_on.slice(0, 10)} to {q.completed_on.slice(0, 10)}</td>
                                                            </tr>
                                                        )) : "No records were found"}

                                                </tbody>
                                            </table>
                                            <div className="form-group row d-flex justify-content-center mr-3">
                            <button className="btn btn-primary mr-3" onClick={this.downloadOrder}>Download CSV</button>
                        </div>
                                        </div>
                                    </>
                                )}
                            <form >
                                {this.state.error &&
                                    <div className="col text-center text-danger mb-3 font-weight-bold">
                                        {this.state.error === "Billing not started" ? `${this.state.error}. Please enter below details to start billing.` : this.state.error}
                                    </div>
                                }
                                <div className="row p-4 mt-4 ml-0 mr-0 bd-highlight align border border-primary">
                                    <div className="form-check col-2 form-check-inline ml-3">
                                        <label className="form-check-label" >
                                            Order Report:
                             </label>

                                    </div>
                                    <div className="form-check col-3 form-check-inline ">

                                        <div className="d-flex justify-content-end mr-2">From</div>
                                        <DatePicker
                                            selected={this.state.startDate}
                                            onChange={date => this.setStartDate(date)}
                                            placeholderText={'mm/dd/yyyy'}
                                            showYearDropdown
                                            scrollableYearDropdown
                                        />
                                    </div>
                                    <div className="form-check col-3 form-check-inline ">

                                        <div className="d-flex justify-content-end mr-2">To</div>
                                        <DatePicker
                                            selected={this.state.endDate}
                                            onChange={date => this.setEndDate(date)}
                                            placeholderText={'mm/dd/yyyy'}
                                            showYearDropdown
                                            scrollableYearDropdown
                                        />
                                    </div>
                                    <div className="form-check col-2 form-check-inline ">

                                        <div ><a href="#" onClick={this.onLoad} >Load</a></div>
                                    </div>
                                </div>
                            </form>
                        </div>


                        <div className="form-group row d-flex justify-content-end mr-3">
                            <button className="btn btn-primary" onClick={this.downloadAllorders}>Download all order reports</button>
                        </div>
                    </>
                }
</div>

        );
    }
}

export default BillingDetails;