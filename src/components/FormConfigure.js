import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BeatLoader } from 'react-spinners';

const FormConfigure = () => {
    const [organization, setOrganization] = useState([]);
    // const dispatch = useDispatch();
    const { organizationsList } = useSelector((state) => state.getorganization);
    const { id } = useParams();

    const [forms, setForms] = useState([
        {
            id: 0,
            form: 'Social History',
            sections: ['Title1', 'Title2', 'Title3', 'Title4']
        },
        {
            id: 1,
            form: 'Diversion',
            sections: ['Title1', 'Title2', 'Title3', 'Title4']
        },
        {
            id: 2,
            form: 'Probation Supervision',
            sections: ['Title1', 'Title2', 'Title3', 'Title4']
        },
        {
            id: 3,
            form: 'Community - Based',
            sections: ['Title1', 'Title2', 'Title3', 'Title4']
        }
    ]);

    useEffect(() => {
        if (organizationsList.length > 0) {
            const findOrganization = organizationsList.find((org) => org.id == id && org);
            setOrganization(findOrganization);
        } else {
            setOrganization([]);
        }
    }, []);

    // console.log('FormConfigure Redux', organizationsList);
    // console.log('FormConfigure organization', organization);
    // console.log('FormConfihgurer sid', id);

    if (organization.length == 0) {
        return (
            <div className="container-fluid">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '75vh' }}>
                    <span className="font-weight-bold h5">Loading</span>
                    <BeatLoader size={24} color="#0099CC" loading={organization.length == 0} />
                    <BeatLoader size={24} color="#0099CC" loading={organization.length == 0} />
                </div>
            </div>
        );
    } else {
        const { org_name } = organization;
        return (
            <div className="container-fluid">
                <div className="row p-2 bg-primary text-white">Form Categories:</div>
                <div className="row py-4 px-2 shadow-sm text-body font-weight-bold">{org_name}</div>

                {/*From and sections*/}
                <div className="row mx-4 w-100">
                    <div className="accordion" id="accordionExample">
                        {forms.length > 0 ? (
                            forms.map((forms) => (
                                <div className="card flex-flow">
                                    <div className="card-header" id="headingOne">
                                        <h2 className="mb-0">
                                            <button className="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                {forms.form}
                                            </button>
                                        </h2>
                                    </div>

                                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                {forms.sections.map((section) => (
                                                    <li>{section}</li>
                                                ))}{' '}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Create New Form</p>
                        )}
                    </div>
                </div>

                <br />
            </div>
        );
    }
};
export default FormConfigure;
