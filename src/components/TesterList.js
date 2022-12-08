import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTesters, getCustomerDetails, saveTesters, deleteTesters } from '../api/api';
import { updateExistingTester, removeExistingTester } from '.././redux/Testers/TestersAction';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';

const TesterList = () => {
    //Local State
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    //Redux State
    const { loading, allTesterList, error, fetching, existingTesterList, isError } = useSelector((state) => state.testers);
    const dispatch = useDispatch();
    const { Org, id } = useParams();
    let Org_Id = Number(id);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            await fetchTesters();
            await getCustomerDetails(id);
        };
        fetchCustomerDetails();
    }, [id]);

    const handleChange = (e) => {
        const { value } = e.target;
        setEmail(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let existTesterList = [...existingTesterList];
        let findUser = allTesterList.find((user) => user.email_id == email);
        const findIndex = existTesterList && existTesterList.findIndex((user) => user.email_id == email);

        if (findIndex >= 0) {
            toast.error(`User already existed with given email in *${Org}* Organization`, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
        } else {
            setIsSaving(true);
            let response = await saveTesters(Org_Id, email);
            setIsSaving(false);

            const newTester = {
                email_id: findUser.email_id,
                name: findUser.full_name,
                role: 'Tester'
            };
            if (response.status === 'success') {
                dispatch(updateExistingTester(newTester));
                toast.info(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
            } else {
                toast.error(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
            }
        }
        setEmail('');
    };

    const handleDeleteTester = async (e) => {
        e.preventDefault();
        let email = e.target.dataset.email_id ? e.target.dataset.email_id : '';

        let response = await deleteTesters(Org_Id, email);
        if (response.status === 'success') {
            dispatch(removeExistingTester(email));
            toast.info(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
        } else {
            toast.error(response.message, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
        }
    };

    toast.configure();
    return (
        <Fragment>
            <div className="container-fluid">
                {/* Start - Add Testing User*/}
                <form onSubmit={handleSubmit}>
                    <div className="row p-2 bg-primary text-white">
                        <strong className="fw-bold">{Org}</strong>
                        &nbsp; - Testing Users List
                    </div>
                    <div className="form-group row my-4">
                        <label for="inputTestingUser" className="col-auto col-form-label font-weight-bold">
                            Select Testing User:
                        </label>
                        <div className="col col-sm-4 col-md-2">
                            <select name="testingUserList" className="form-control" onChange={handleChange} required>
                                <option value="" selected={email === ''}>
                                    Select
                                </option>
                                {loading ? (
                                    <>
                                        <option value="">
                                            <BeatLoader size={12} margin={4} color="#0099CC" loading={loading} />
                                        </option>
                                    </>
                                ) : (
                                    <Fragment>
                                        {allTesterList.length > 0 ? (
                                            <>
                                                {allTesterList.map((user) => (
                                                    <option key={user.id} value={user.email_id} selected={user.email_id === email}>
                                                        {user.full_name}
                                                    </option>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                <option value="">No Super Admin Available</option>
                                            </>
                                        )}
                                    </Fragment>
                                )}
                            </select>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-primary">{isSaving ? <BeatLoader size={8} margin={2} color="white" loading={isSaving} /> : 'Save'}</button>
                        </div>
                    </div>
                </form>
                {/* End - Add Testing User*/}
                <div className="table-responsive">
                    <table className="table table-striped-columns table-sm table-bordered mt-3">
                        <thead className="bg-info text-white text-center">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching ? (
                                <tr>
                                    {[0, 1, 2, 3].map((cell) => (
                                        <td key={cell} className="text-center">
                                            <BeatLoader size={12} margin={4} color="#0099CC" loading={fetching} />
                                        </td>
                                    ))}
                                </tr>
                            ) : existingTesterList.length > 0 ? (
                                existingTesterList.map((user, i) => {
                                    const { name, email_id, role } = user;
                                    return (
                                        <Fragment>
                                            <tr key={i}>
                                                <td>{name}</td>
                                                <td>{email_id}</td>
                                                <td>{role}</td>
                                                <td className="text-center">
                                                    <i className="fa fa-trash" style={{ fontSize: '20px', color: 'red' }} data-email_id={email_id} onClick={(e) => window.confirm('Are you sure you wish to delete this Testing User?') && handleDeleteTester(e)}></i>
                                                </td>
                                            </tr>
                                        </Fragment>
                                    );
                                })
                            ) : (
                                <td colSpan={4} className="text-center">
                                    <span>No Testing User Available</span>
                                </td>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
};

export default TesterList;
