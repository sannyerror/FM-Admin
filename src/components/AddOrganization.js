import React from "react";
import "../App.css";
import { AddOrganizations, baseApiUrl } from "../api/api";
import axios from "axios";
import { store } from "../App";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
class AddOrganization extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      country: "US",
      org_name: "",
      mobile: "",
      email_id: "",
      error: "",
      org_type:null,
    };
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    const currentUser = store.getState().loginData.user.token;
    if (id) {
      try {
        const response = await axios
          .get(`${baseApiUrl}/customers/${id}/`, {
            headers: {
              Authorization: `Bearer ${currentUser}`,
            },
          })
          .then((response) => {
            return response.data;
          });
        this.setState({
          name: response.name,
          org_name: response.org_name,
          email_id: response.email_id,
          mobile: response.mobile,
          org_type: response.org_type,
        }); 
      } catch (error) {
        console.log(error, "error");
      }
    }
  }
  addORG = async (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const data = this.state; 
    try {
      const response = await AddOrganizations(data, id);
      if (response.status === "failed") {
        const err = response.response;
        const msg = Object.keys(err).map((m) => err[m]);
        this.setState({
          error: msg,
        });
      } else {
        toast.info(`User ${id ? "updated" : "added"}  successfully.`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
        this.props.history.push("/admin/configure/organizationlist");
      }
    } catch (e) {
      this.setState({
        error: e.message,
      });
      return;
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email_id") {
      this.setState({
        [name]: value,
      });
    }else if (name === "org_type"){
      this.setState({
        [name]: value && parseInt(value)
      });
    }
    else {
       this.setState({
        [name]: value.charAt(0).toUpperCase() + value.substr(1),
      });
    }
  };
  onRadioChange = (e) => {
    this.setState({
      gender: e.currentTarget.value,
    });
  };

  render() { 
    const { id } = this.props.match.params;
    const org_options = [
      {value: '', label : 'Select'},
      {value: '1', label : 'Provider'},
      {value: '2', label : 'County'},
    ]
    toast.configure();
    return (
      <div className="container-fluid">
        <form className="" onSubmit={this.addORG}>
          <div className="row p-2 bg-primary text-white">Organization</div>
          <br />

          <div className=" ml-4">
            {this.state.error && (
              <div className="col -4 text-center text-danger mb-3 font-weight-bold">
                {this.state.error}
              </div>
            )}
            <div className="form-group row">
              <label className="col-sm-2 col-form-label font-weight-bold ">
                Name:
              </label>
              <div className="col-sm-4">
                <input
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.name}
                  name="name"
                  className="form-control "
                  required
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label font-weight-bold ">
                Organization Name:
              </label>
              <div className="col-sm-4">
                <input
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.org_name}
                  name="org_name"
                  className="form-control "
                  required
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label font-weight-bold ">
                Mobile Number:
              </label>
              <div className="col-sm-4">
                <input
                  type="number"
                  onChange={this.handleChange}
                  value={this.state.mobile}
                  name="mobile"
                  className="form-control "
                  required
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label font-weight-bold ">
                Email ID:
              </label>
              <div className="col-sm-4">
                <input
                  type="email"
                  onChange={this.handleChange}
                  value={this.state.email_id}
                  name="email_id"
                  className="form-control "
                  required
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label font-weight-bold">
                Organization Type:
              </label>
              <div className="col-sm-4">
                <div class="dropdown">
                <select className="form-control" 
                  id="org_type" 
                  name="org_type" 
                  onChange={this.handleChange} 
                  value={this.state.org_type}
                  required
                  disabled={
                    id
                  }> 
                  {org_options.map((org, i)=> (
                   <option key={i} value={org.value}>{org.label}</option>
                  ))} 
                </select> 
               { 
                this.state.org_type ? <span className={`small ${id ? "text-danger" : "text-primary"}`}>{`You can not ${id ? "change" : "re-change"} organization type, after successful creation of organization.`}</span>
                : ''
               }
                 </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label font-weight-bold "></label>
              <div className="col-sm-4">
                <button
                  type="submit"
                  className="btn btn-primary font-weight-bold btn-block"
                >
                  {id ? "UPDATE" : "ADD ORGANIZATION"}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="row p-2 bd-highlight">
          <div className="col col-3">
            {/* <Link to="/admin/configure/questioncategorylist">Question Categories</Link> */}
            <Link to={`/admin/configure/organization/adduser/id=${id}`}>
              Add Admin Users
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.loginData.user,
  };
};

export default connect(mapStateToProps)(AddOrganization);
