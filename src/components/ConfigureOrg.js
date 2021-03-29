import React, { createRef } from 'react';
import fs from 'fs';
import '../App.css';
import { fetchOrganizations, uploadLogo, baseApiUrl } from '../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom";
import { connect } from 'react-redux';
class ConfigureOrg extends React.Component {
    constructor() {
        super();
        this.imageUploader = createRef();
        this.uploadedImage = createRef();
        this.state = {
            Organizations: [],
            userID: "",
            prompt: false,
            startBill: false,
            Org_Name: "",
            Org_Id: "",
            logoPath: ""

        }
    }
    async componentDidMount() {
        const res = await fetchOrganizations();
        this.setState({
            Organizations: res,
        })
    }
    handleChange = (e) => {
        e.preventDefault();
        const id = e.target.value
        const org_name = this.state.Organizations.filter(org => org.id == id)
        this.setState({
            Org_Name: org_name[0].org_name,
            Org_Id: org_name[0].id,
            logoPath: org_name[0].logo_path
        })

    }

    fileChangedHandler = e => {
        let [file] = e.target.files;
        if (file) {
            const reader = new FileReader();
            let { current } = this.uploadedImage;
            current.file = file;

            reader.onload = e => {
                current.src = e.target.result;
            };
            reader.readAsDataURL(file);

        }

        this.setState({ selectedFile: e.target.files[0] })
    }

    uploadHandler = async (e) => {
        e.preventDefault()
        let org_id = this.state.Org_Id
        var formdata = new FormData();
        formdata.append("customer", org_id);
        formdata.append("logo", this.state.selectedFile, this.state.selectedFile.name);
        const response = await uploadLogo(formdata);
         if (response.message === "logo uploaded successfully") {
            const res = await fetchOrganizations();
            let logoPath = res.filter(p=> p.id === org_id)
            this.setState({
                logoPath: logoPath[0].logo_path
             })
            toast.info(`Logo uploaded successfully.`, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
            
        //     window.location.reload(true);
         } else {
            toast.error(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 })
          
        }
    }

    render() {
        toast.configure()
        const { role_type } = this.props.user;
        const { Org_Name, Org_Id } = this.state;
        return (

            <div className="container-fluid">
                <form>
                    <div className="form-group d-flex flex-column bd-highlight mb-2">
                        <div className="row p-2 bg-primary text-white">{Org_Name ? `Configure FirstMatch™ Tool for ${Org_Name}:` : "Choose an organization:"}</div>
                        {Org_Name ?
                            <div className="ml-5 mt-3">
                                <div className="row p-2 bd-highlight">
                                    <div className="col col-3">
                                        <Link to={`/admin/questions-configure/Org=${Org_Name}&id=${Org_Id}`}>Questions</Link>
                                        </div>
                                    
                                    <div className="col col-3">
                                        <div className="row">
                                        <input
                                        type="file"
                                        accept="image/*"
                                        onChange={this.fileChangedHandler}
                                        ref={this.imageUploader}
                                        style={{
                                            display: "none"
                                        }}
                                    />
                                        <div
                                            style={{
                                                height: "220px",
                                                width: "220px",
                                                border: "1px dashed black",

                                            }}
                                            onClick={() => this.imageUploader.current.click()}
                                        >
                                            <img
                                                ref={this.uploadedImage}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    //position: "absolute"
                                                }}
                                                src={`${baseApiUrl}/${this.state.logoPath}`}

                                            />
                                            </div>
                                        </div>
                                        <div className="row">
                                           <span className="text-center">Click on above to select an Image</span>
                                         </div>
                                         <div className="row">
                                           <span className="text-danger small">Logo should be in PNG/JPEG format and size should be less or equal to 10kb. 120X40 px - Ideal size</span>
                                         </div>
                                         <div className="row">
                                             <div className="col col-2">&nbsp;</div>
                                             <div className="col col-4"> 
                                             <button className="btn btn-primary" onClick={this.uploadHandler} >Upload</button>
                                             </div>
                                         <div className="col col-4">&nbsp;</div>
                                         </div>
                                        
                                        
                                        {/* <button 
                                        style={{
                                                    width: "78%",
                                                    height: "10%",
                                                    //position: "absolute"
                                                }} 
                                                className="btn btn-primary btn-block" onClick={this.uploadHandler} >Upload</button>
                                        <br /> */}
                                        </div>
                                        {/* <div className="col col-1">Upload logo</div>
                                    <div className="col col-1"><a href="/configure/addquestion">Upload</a></div>  */}

                                   
                                </div>
                            </div> :
                            <div className="form-group row mt-4">
                                <label className="col-sm-2 col-form-label font-weight-bold " >Organization:</label>
                                <div className="col-sm-3">
                                    <select name="group_id" className="form-control" id="exampleFormControlSelect1" onChange={this.handleChange} required>
                                        <option value="" >Select</option>
                                        {this.state.Organizations.map((org, i) => <option key={i} value={org.id} selected={this.state.org === org.name}>{org.org_name}</option>)}
                                    </select>
                                </div>
                                {this.state.group_idError && <div className="text-center text-danger">{this.state.group_idError}
                                </div>}
                            </div>}


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

export default connect(mapStateToProps)(ConfigureOrg);