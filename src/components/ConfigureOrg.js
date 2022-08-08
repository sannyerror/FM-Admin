import React, { createRef } from 'react';
import fs from 'fs';
import '../App.css';
import { fetchOrganizations, uploadLogo, baseApiUrl, uploadHeaderColor } from '../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SketchPicker, PhotoshopPicker } from 'react-color';
import Modal from 'react-modal';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { GrDocumentUser } from 'react-icons/gr';
import { MdOutlineEditCalendar } from 'react-icons/md';

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

class ConfigureOrg extends React.Component {
    constructor() {
        super();
        this.imageUploader = createRef();
        this.uploadedImage = createRef();
        this.state = {
            Organizations: [],
            userID: '',
            prompt: false,
            startBill: false,
            Org_Name: '',
            Org_Type: null,
            Org_Id: '',
            logoPath: '',
            color: '#fff',
            isOpen: false,
            header_color: ''
        };
    }
    async componentDidMount() {
        const res = await fetchOrganizations();
        this.setState({
            Organizations: res
        });
    }

    handleClose = () => {
        this.setState({
            isOpen: false,
            startBill: false,
            header_color: this.state.color
        });
    };

    handleShow = () => {
        this.setState({
            isOpen: true
        });
    };

    handleChange = (e) => {
        e.preventDefault();
        const id = e.target.value;
        const org_name = this.state.Organizations.filter((org) => org.id == id);
        this.setState({
            Org_Name: org_name[0].org_name,
            Org_Type: org_name[0].org_type,
            Org_Id: org_name[0].id,
            logoPath: org_name[0].logo_path,
            color: org_name[0].header_color,
            header_color: org_name[0].header_color
        });
    };

    fileChangedHandler = (e) => {
        let [file] = e.target.files;
        if (file) {
            const reader = new FileReader();
            let { current } = this.uploadedImage;
            current.file = file;

            reader.onload = (e) => {
                current.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        this.setState({ selectedFile: e.target.files[0] });
    };

    uploadHandler = async (e) => {
        e.preventDefault();
        let org_id = this.state.Org_Id;
        var formdata = new FormData();
        formdata.append('customer', org_id);
        formdata.append('logo', this.state.selectedFile, this.state.selectedFile.name);
        const response = await uploadLogo(formdata);
        if (response.message === 'logo uploaded successfully') {
            const res = await fetchOrganizations();
            let logoPath = res.filter((p) => p.id === org_id);
            this.setState({
                logoPath: logoPath[0].logo_path
            });
            toast.info(`Logo uploaded successfully.`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            });

            //     window.location.reload(true);
        } else {
            toast.error(response.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            });
        }
    };

    selectColor = async (e) => {
        let org_id = this.state.Org_Id;
        let { header_color } = this.state;
        this.setState({
            isOpen: false
        });
        const response = await uploadHeaderColor(org_id, header_color);
        if (response.message === 'header color saved successfully') {
            toast.info(`Color updated successfully.`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            });
        }
    };
    render() {
        toast.configure();
        const { Org_Name, Org_Type, Org_Id, header_color } = this.state;
        return (
            <div className="container-fluid">
                <form>
                    <div className="form-group d-flex flex-column bd-highlight mb-2">
                        <div className="row p-2 bg-primary text-white">{Org_Name ? `Configure FirstMatch® Tool for ${Org_Name}:` : 'Choose an organization:'}</div>
                        {Org_Name ? (
                            <div className="ml-5 mt-3">
                                <div className="row p-2 bd-highlight">
                                    <div className="col col-4 " style={{ alignSelf: 'center', fontSize: '18px' }}>
                                        <div className="">
                                            <ul class="list-group">
                                                {/* {Org_Type && Org_Type === 2 ? (
                                                    <li className="list-group-item border-0">
                                                        <Link to={`/admin/configure-form/Org=${Org_Name}&id=${Org_Id}`}>
                                                            <span className="h4">
                                                                <GrDocumentUser />
                                                            </span>
                                                            <strong className="px-3">Forms</strong>
                                                        </Link>
                                                    </li>
                                                ) : (
                                                    ''
                                                )} */}
                                                <li className="list-group-item border-0">
                                                    <Link to={`/admin/questions-configure/Org=${Org_Name}&id=${Org_Id}`}>
                                                        <span className="h3">
                                                            <MdOutlineEditCalendar color="black" />
                                                        </span>
                                                        <strong className="px-2">Questions</strong>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col col-4 border-left border-right">
                                        <div className="px-3">
                                            <div className="row">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={this.fileChangedHandler}
                                                    ref={this.imageUploader}
                                                    style={{
                                                        display: 'none'
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        height: '220px',
                                                        width: '220px',
                                                        border: '1px dashed black'
                                                    }}
                                                    onClick={() => this.imageUploader.current.click()}
                                                >
                                                    <img
                                                        ref={this.uploadedImage}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'contain'
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
                                                    <button className="btn btn-primary" onClick={this.uploadHandler}>
                                                        Upload
                                                    </button>
                                                </div>
                                            </div>
                                            {Org_Type && Org_Type === 2 ? (
                                                <div className="row mt-2">
                                                    <div className="col col-2">Or</div>
                                                    <div className="col col-4">
                                                        <button className="btn btn-primary" type="button">
                                                            Enter a Text
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-1" style={{ alignSelf: 'center', fontSize: '18px' }}>
                                        <strong>Pick a color:</strong>
                                    </div>
                                    <div
                                        className="col-1"
                                        onClick={this.handleShow}
                                        style={{
                                            alignSelf: 'center',
                                            backgroundColor: header_color,
                                            borderRadius: '50%',
                                            height: '100px',
                                            color: '#fff',
                                            width: '50px',
                                            position: 'relative'
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'flex',
                                                height: '100%',
                                                hyphens: 'auto',
                                                justifyContent: 'center',
                                                left: '50%',
                                                padding: '0.75em',
                                                position: 'absolute',
                                                textAlign: 'center',
                                                transform: ' translate(-60%, -77%)',
                                                top: '30%',
                                                width: '30%'
                                            }}
                                        >
                                            &nbsp;
                                        </span>
                                    </div>
                                    {/* <div className="row" > 
                                           <span >Click on here to pick a Color</span> 
                                        </div> */}
                                </div>
                            </div>
                        ) : (
                            <div className="form-group row mt-4">
                                <label className="col-sm-2 col-form-label font-weight-bold ">Organization:</label>
                                <div className="col-sm-3">
                                    <select name="group_id" className="form-control" id="exampleFormControlSelect1" onChange={this.handleChange} required>
                                        <option value="">Select</option>
                                        {this.state.Organizations &&
                                            this.state.Organizations?.map((org, i) => (
                                                <option key={i} value={org.id} selected={this.state.org === org.name}>
                                                    {org.org_name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                {this.state.group_idError && <div className="text-center text-danger">{this.state.group_idError}</div>}
                            </div>
                        )}
                    </div>
                    <div className="form-group row d-flex justify-content-center">&nbsp;</div>
                </form>
                <Modal
                    isOpen={this.state.isOpen}
                    //   onAfterOpen={afterOpenModal}
                    onRequestClose={this.handleClose}
                    style={customStyles}
                    contentLabel="Forgot Password"
                    ariaHideApp={false}
                >
                    <div className="row">
                        <div className="col col-3" style={{ alignContent: 'center' }}>
                            <PhotoshopPicker color={this.state.header_color} onChange={(updatedColor) => this.setState({ header_color: updatedColor.hex })} onAccept={this.selectColor} onCancel={this.handleClose} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.loginData.user
    };
};

export default connect(mapStateToProps)(ConfigureOrg);
