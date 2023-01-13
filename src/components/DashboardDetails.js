import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDashboard, saveDashboard, publishDashboard, deleteDashboard } from '../api/api';
import { toast } from 'react-toastify';
import { BeatLoader, ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';

const DashboardDetails = () => {
    const { Org, id } = useParams();
    const [Dashboard, setDashBoard] = useState({
        client_id: '',
        client_secret_value: '',
        tenant_id: '',
        group_id: '',
        report_id: '',
        func_app_name: '',
        func_app_url: '',

        customer: '',
        id: '',
        is_published: ''
    });
    const allFields = [
        {
            title: 'Client Id',
            name: 'client_id'
        },
        {
            title: 'Client Secret Value',
            name: 'client_secret_value'
        },
        {
            title: 'Tenant Id',
            name: 'tenant_id'
        },
        {
            title: 'Group Id',
            name: 'group_id'
        },
        {
            title: 'Report Id',
            name: 'report_id'
        },
        {
            title: 'Function App Name',
            name: 'func_app_name'
        },
        {
            title: 'Function App URL',
            name: 'func_app_url'
        }
    ];
    const [fieldError, setFieldError] = useState({});
    const { fetching, isError, saving, publishing, deleting } = useSelector((state) => state.dashboard);

    useEffect(() => {
        let fetchDashboardDetails = async () => {
            let response = await getDashboard(id);

            if (response.hasOwnProperty('customer')) {
                for (const [key, value] of Object.entries(response)) {
                    if (key in Dashboard) {
                        setDashBoard((preState) => ({
                            ...preState,
                            [key]: value
                        }));
                    }
                }
            } else {
                setDashBoard((preState) => ({
                    ...preState,
                    ['customer']: id
                }));
            }
        };
        fetchDashboardDetails();
    }, [id]);

    // Collect input from handleChange event
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDashBoard((preState) => ({
            ...preState,
            [name]: value
        }));
    };

    // Custom Alert Message
    const customAlertMessage = (response) => {
        if (response.status == 'success') {
            toast.info(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
        } else {
            toast.error(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
        }
    };

    // Save Dashboard and Update Dashboard
    const handleSave = async (e) => {
        e.preventDefault();
        let dashboard = { ...Dashboard };
        ['id', 'is_published'].forEach((e) => delete dashboard[e]);

        let response = await saveDashboard(dashboard, Dashboard.id);
        customAlertMessage(response);

        if (response.status === 'success') {
            response.response &&
                setDashBoard((preState) => ({
                    ...preState,
                    ['id']: response.response.id
                }));
            setFieldError({});
        } else {
            response.response && setFieldError({ ...response.response });
        }
    };

    // Publish and Unpublish Dashboard
    const handlePublish = async (e) => {
        e.preventDefault();
        const { id, is_published } = Dashboard;
        let publish = is_published === 'yes' ? 'no' : 'yes';

        let response = await publishDashboard(id, publish);
        customAlertMessage(response);

        let resPublish = response.message === 'PBI Dashboard Published' ? 'yes' : 'no';
        setDashBoard((preState) => ({
            ...preState,
            ['is_published']: resPublish
        }));
    };

    // Delete Dashboard
    const handleDelete = async (e) => {
        e.preventDefault();

        const { id } = Dashboard;
        const response = await deleteDashboard(id);
        customAlertMessage(response);

        if (response.status === 'success') {
            for (const [key, value] of Object.entries(Dashboard)) {
                if (key != 'customer') {
                    setDashBoard((preState) => ({
                        ...preState,
                        [key]: ''
                    }));
                }
            }
        }
    };

    toast.configure();
    return (
        <div className="container-fluid">
            <div>
                <div className="row p-2 bg-primary text-white mb-4">
                    <strong>{Org} </strong> &nbsp;- Dashboard Details
                </div>
                {isError && <p className="text-center text-danger">{isError}</p>}
                {fetching ? (
                    <div className="text-center">
                        <BeatLoader size={12} margin={2} color="#0099CC" loading={fetching} />
                    </div>
                ) : (
                    <form>
                        <div>
                            {allFields.map((field) => (
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label font-weight-bold ">{field.title}:</label>
                                    <div className="col-sm-4">
                                        <input type="text" className="form-control" name={field.name} value={Dashboard[field.name]} disabled={Dashboard.is_published === 'yes'} onChange={handleInputChange} required />
                                        {fieldError && fieldError[field.name] && (
                                            <small id="emailHelp" class="form-text text-danger">
                                                {fieldError[field.name]}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="form-group row">
                                <div className="col-sm-2"></div>
                                <div className="col-sm-4">
                                    <div className="d-flex justify-content-between">
                                        {Dashboard.is_published === 'yes' ? (
                                            ''
                                        ) : (
                                            <div className="flex-grow-1">
                                                <button className="btn btn-primary" onClick={handleSave}>
                                                    {saving ? <BeatLoader size={8} margin={2} color="white" loading={saving} /> : Dashboard.id ? 'Update' : 'Save'}
                                                </button>
                                            </div>
                                        )}

                                        {Dashboard.id ? (
                                            <Fragment>
                                                <button className="btn btn-outline-info " onClick={handlePublish}>
                                                    {publishing ? <BeatLoader size={8} margin={2} color="white" loading={publishing} /> : <span className="font-weight-bolder">{Dashboard.is_published === 'yes' ? 'Un-Publish' : 'Publish'}</span>}
                                                </button>
                                                {Dashboard.is_published === 'yes' ? (
                                                    ''
                                                ) : (
                                                    <button className="btn btn-danger ml-4" onClick={handleDelete}>
                                                        {deleting ? <ClipLoader color="#bac0c4" loading={deleting} size={20} speedMultiplier={1} /> : 'Delete'}
                                                    </button>
                                                )}
                                            </Fragment>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
export default DashboardDetails;
