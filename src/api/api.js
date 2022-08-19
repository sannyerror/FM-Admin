import axios from 'axios';
import { fetchPreLoginRequest, fetchPreLoginSuccess, fetchPreLoginFailure } from '../redux/login/loginAction';
import { fetchUsersFailure } from '../redux/login/loginAction';
import { fetchUsersRequest } from '../redux/login/loginAction';
import { fetchUsersSuccess } from '../redux/login/loginAction';
import { fetchQuestionsFailure } from '../redux/FetchQuestions/QuestionsAction';
import { fetchQuestionsRequest } from '../redux/FetchQuestions/QuestionsAction';
import { fetchQuestionsSuccess } from '../redux/FetchQuestions/QuestionsAction';
import { addQuestionsFailure } from '../redux/AddQuestions/AddQuestionsAction';
import { addQuestionsRequest } from '../redux/AddQuestions/AddQuestionsAction';
import { addQuestionsSuccess } from '../redux/AddQuestions/AddQuestionsAction';
import { eifQuestionsFailure } from '../redux/EifQuestions/EifQuestionsAction';
import { eifQuestionsRequest } from '../redux/EifQuestions/EifQuestionsAction';
import { eifQuestionsSuccess } from '../redux/EifQuestions/EifQuestionsAction';
import { rafQuestionsFailure } from '../redux/RafQuestions/RafQuestionsAction';
import { rafQuestionsRequest } from '../redux/RafQuestions/RafQuestionsAction';
import { rafQuestionsSuccess } from '../redux/RafQuestions/RafQuestionsAction';
import { addQuestionsCategoryFailure, addQuestionsCategoryRequest, addQuestionsCategorySuccess } from '../redux/AddQuestionsCategory/AddQuestionsCategoryAction';
import { fetchQuestionscategoryFailure, fetchQuestionscategoryRequest, fetchQuestionscategorySuccess } from '../redux/FetchQuestionsCategory/QuestionsCategoryAction';
import { addEifFailure, addEifRequest, addEifSuccess } from '../redux/AddEIF/AddEIFAction';
import { addRafFailure, addRafRequest, addRafSuccess } from '../redux/AddRAF/AddRAFAction';
import { fetchEifListFailure, fetchEifListRequest, fetchEifListSuccess } from '../redux/FetchEIFList/EIFListAction';
import { fetchRafListFailure, fetchRafListRequest, fetchRafListSuccess } from '../redux/FetchRAFList/RAFListAction';
import { checkDomainFailure, checkDomainSuccess, checkDomainRequest } from '../redux/CheckDomain/CheckDomainAction';
import { addUsersFailure, addUsersRequest, addUsersSuccess } from '../redux/AddUsers/AddUsersAction';
import { getUsersFailure, getUsersRequest, getUsersSuccess } from '../redux/GetUsers/GetUsersAction';
import { getOrganizationsFailure, getOrganizationsRequest, getOrganizationsSuccess } from '../redux/GetOrganizations/GetOrganizationsAction';
import { addOrganizationsFailure, addOrganizationsRequest, addOrganizationsSuccess } from '../redux/AddOrganization/AddOrganizationsAction';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { update } from '../redux/login/loginAction';
import { clearUser } from '../redux/login/loginAction';
import { store } from '../App';

//DEV
export const baseApiUrl = 'http://13.232.194.174/api';

export const OrgbaseApiUrl = 'http://13.232.194.174/';

const refreshAuthLogic = async (failedRequest) => {
    //  const { store } = store
    const userState = store.getState().user;
    const currentUser = userState.user;
    if (!userState) {
        return Promise.reject();
    }
    const tokenRefreshResponse = await axios.post(`${baseApiUrl}/admin/refresh/`, {
        refresh: currentUser.refreshToken
    });
    localStorage.setItem('refreshtoken', tokenRefreshResponse.data.token);
    const accessToken = tokenRefreshResponse.data.access_token;

    store.dispatch(
        update({
            user: {
                ...currentUser,
                accessToken
            }
        })
    );
    failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.token;
    return Promise.resolve();
};

createAuthRefreshInterceptor(axios, refreshAuthLogic);

export const login = async (email, password) => {
    const { dispatch } = store;
    try {
        dispatch(fetchUsersRequest);
        const response = await axios.post(`${baseApiUrl}/admin/login`, { username: email, password: password });

        const { token, user_id, role_type, is_pwd_updated, is_pwd_expired, pwd_expires_in, count_down } = response.data.response;
        const user = {
            email,
            token,
            user_id,
            role_type: role_type,
            is_pwd_updated: is_pwd_updated,
            is_pwd_expired: is_pwd_expired,
            pwd_expires_in: pwd_expires_in,
            count_down: count_down ? count_down : 0
        };

        localStorage.setItem('refreshToken', response.data.response.token);
        localStorage.setItem('user_role', response.data.response.role_type);
        localStorage.removeItem('forgotPassword');

        dispatch(fetchUsersSuccess(user));
        return response;
    } catch (error) {
        dispatch(fetchUsersFailure(error.message));
        throwError(error);
    }
};

export const preLogin = async () => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.email ? store.getState().loginData.user.email : '';

    const formData = new FormData();
    formData.append('username', currentUser);
    try {
        const preUserinfo = {
            email: currentUser,
            count_down: 0
        };
        dispatch(fetchPreLoginRequest(preUserinfo));
        const response = await axios.post(`${baseApiUrl}/admin/pre-login-check`, formData);
        const user = {
            email: currentUser,
            count_down: response.data.response.count_down
        };
        dispatch(fetchPreLoginSuccess(user));
        return response.data;
    } catch (error) {
        dispatch(fetchPreLoginFailure(error.message));
        throwError(error);
    }
};

export const forgotPassWord = async (email_id) => {
    const { dispatch } = store;

    try {
        return await axios.get(`${baseApiUrl}/admin/forgot-password?email_id=${email_id}`).then((response) => {
            return response.data;
        });
    } catch (error) {
        console.log('error');
        dispatch(checkDomainFailure(error.message));
        throwError(error);
    }
};

export const UpdateDomain = async (id, domain, isUpdated) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    try {
        if (isUpdated) {
            return await axios
                .put(
                    `${baseApiUrl}/after-raf/`,
                    { customer: id, domain: domain },
                    {
                        headers: {
                            Authorization: `Bearer ${currentUser}`
                        }
                    }
                )
                .then((response) => {
                    return response.data;
                });
        } else {
            return await axios
                .post(
                    `${baseApiUrl}/after-raf/`,
                    { customer: id },
                    {
                        headers: {
                            Authorization: `Bearer ${currentUser}`
                        }
                    }
                )
                .then((response) => {
                    return response.data;
                });
        }
    } catch (error) {
        console.log('error');
        dispatch(checkDomainFailure(error.message));
        throwError(error);
    }
};

export const checkDomain = async (domain) => {
    const { dispatch } = store;
    const data = `${domain}`;

    try {
        dispatch(checkDomainRequest);
        return await axios.post(`${baseApiUrl}/check/domain`, { domain: data }).then((response) => {
            const checkdomain = response.data;
            dispatch(checkDomainSuccess(checkdomain));
            return response.data;
        });
    } catch (error) {
        console.log('error');
        dispatch(checkDomainFailure(error.message));
        throwError(error);
    }
};

export const resendRAF = async (customer) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .post(
                `${baseApiUrl}/resend-raf/`,
                { customer: customer },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                }
            )
            .then((response) => {
                return response.data;
            });
    } catch (error) {
        console.log('error');
        throwError(error);
    }
};

export const saveClientConfigure = async (data) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .post(
                `${baseApiUrl}/client-config`,
                {
                    customer: data.customer,
                    sections: data.sections
                },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                }
            )
            .then((response) => {
                const saveConfig = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');
        throwError(error);
    }
};

export const fetchConfigureQuestions = async (value) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .get(`${baseApiUrl}/client-config?customer=${value}`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const questionsList = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');
        throwError(error);
    }
};

export const fetchQuestions = async (value) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    try {
        dispatch(fetchQuestionsRequest);
        return await axios
            .get(`${baseApiUrl}/questions/?category=${value}`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const questionsList = response.data;

                dispatch(fetchQuestionsSuccess(questionsList));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(fetchQuestionsFailure(error.message));
        throwError(error);
    }
};

export const fetchEmails = async () => {
    const currentUser = store.getState().loginData.user.token;

    try {
        return await axios
            .get(`${baseApiUrl}/admin/email-statuses`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                return response.data;
            });
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const fetchBillingStatus = async (id) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .get(`${baseApiUrl}/billing-status/?customer=${id}`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const bill = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const isPrediction = async (id) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${currentUser}`);

        const formdata = new FormData();
        formdata.append('customer', id);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(`${baseApiUrl}/billing-status/`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error));
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const Email_Credetials = async (org_id, email_id) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .post(
                `${baseApiUrl}/after-raf/`,
                { customer: org_id, send_to: 'customer', email_id: email_id },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                }
            )
            .then((response) => {
                const bill = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');
        throwError(error);
    }
};

export const fetchAllRecords = async (id, sDate, EDate) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .get(`${baseApiUrl}/orders/?customer=${id}&start_date=${sDate}&end_date=${EDate}`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const bill = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');
        throwError(error);
    }
};

export const getRecord = async (id) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .get(`${baseApiUrl}/orders/${id}/`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const bill = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const configureBilling = async (data, update) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        if (update) {
            return await axios
                .put(
                    `${baseApiUrl}/billing/${data.customer}/`,
                    {
                        billing_cycle: data.billing_cycle,
                        base_fare: data.base_fare,
                        other_fare_per_cycle: data.other_fare_per_cycle
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${currentUser}`
                        }
                    }
                )
                .then((response) => {
                    const bill = response.data;
                    return response.data;
                });
        } else {
            return await axios
                .post(`${baseApiUrl}/billing/`, data, {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                })
                .then((response) => {
                    const bill = response.data;
                    return response.data;
                });
        }
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const downloadAllRecords = async (id) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .get(`${baseApiUrl}/download/?customer=${id}`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const path = response.data.response;
                window.open(`${baseApiUrl}/${path}`);
                const records = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const getOrderDownload = async (id, sDate, eDate) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .get(`${baseApiUrl}/download/?customer=${id}&start_date=${sDate}&end_date=${eDate}`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const path = response.data.response;

                window.open(`${baseApiUrl}/${path}`);
                const records = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const downloadReportCSV = async (id) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .get(`${baseApiUrl}/download/${id}/`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const bill = response.data;
                const path = response.data.response;
                window.open(`${baseApiUrl}/${path}`);
                return response.data;
            });
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const uploadLogo = async (data) => {
    const currentUser = store.getState().loginData.user.token;
    try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${currentUser}`);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
        };
        return await fetch(`${baseApiUrl}/logos`, requestOptions).then((response) => {
            const logo = response.json();
            return logo;
        });
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const uploadHeaderColor = async (org_id, header_color) => {
    const currentUser = store.getState().loginData.user.token;
    let data = { customer: org_id, header_color: header_color };
    try {
        return await axios
            .post(`${baseApiUrl}/client-css`, data, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                return response.data;
            });
    } catch (error) {
        console.log('error');

        throwError(error);
    }
};

export const alterQuestions = async (srcI, desI) => {
    const currentUser = store.getState().loginData.user.token;
    const data = {
        parent_question: srcI,
        child_question_id: desI
    };
    return await axios.post(`${baseApiUrl}/questionsrelation/`, data, {
        headers: {
            Authorization: `Bearer ${currentUser}`
        }
    });
};

export const fetchUsers = async () => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;

    try {
        dispatch(getUsersRequest);
        return await axios
            .get(`${baseApiUrl}/users/`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const usersList = response.data;

                dispatch(getUsersSuccess(usersList));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(getUsersFailure(error.message));
        throwError(error);
    }
};

export const fetchOrganizations = async () => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;

    try {
        dispatch(getOrganizationsRequest);
        return await axios
            .get(`${baseApiUrl}/customers/`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const organizationsList = response.data;

                dispatch(getOrganizationsSuccess(organizationsList));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(getOrganizationsFailure(error.message));
        throwError(error);
    }
};

export const deleteOrganizations = async (customer, remove_type) => {
    const currentUser = store.getState().loginData.user.token;
    let data = {
        customer: customer
    };
    try {
        if (remove_type === 'delete') {
            return axios.delete(`${baseApiUrl}/customers/${customer}/`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            });
        } else {
            return axios.post(`${baseApiUrl}/customer/${remove_type.toLowerCase()}/`, data, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            });
        }
    } catch (error) {
        console.log('error');
        throwError(error);
    }
};

export const fetchEiflist = async () => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;

    try {
        dispatch(fetchEifListRequest);
        return await axios
            .get(`${baseApiUrl}/staging?category=1`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const EifList = response.data;
                dispatch(fetchEifListSuccess(EifList));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(fetchEifListFailure(error.message));
        throwError(error);
    }
};

export const fetchRaflist = async () => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    try {
        dispatch(fetchRafListRequest);
        return await axios
            .get(`${baseApiUrl}/staging?category=2`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const RafList = response.data;
                dispatch(fetchRafListSuccess(RafList));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(fetchRafListFailure(error.message));
        throwError(error);
    }
};
export const Change_RAFtype = async () => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    try {
        dispatch(fetchRafListRequest);
        return await axios
            .get(`${baseApiUrl}/staging?category=2&q=drafts`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const RafList = response.data;
                dispatch(fetchRafListSuccess(RafList));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(fetchRafListFailure(error.message));
        throwError(error);
    }
};
export const fetchQuestionsCategory = async () => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    try {
        dispatch(fetchQuestionscategoryRequest);
        return await axios
            .get(`${baseApiUrl}/questionscategory/`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const questionscategoryList = response.data;
                dispatch(fetchQuestionscategorySuccess(questionscategoryList));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(fetchQuestionscategoryFailure(error.message));
        throwError(error);
    }
};

export const AddQuestions = async (data, id) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    if (id) {
        try {
            dispatch(addQuestionsRequest);
            return await axios
                .put(`${baseApiUrl}/questions/${id}/`, data, {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                })
                .then((response) => {
                    const addedquestions = response.data;
                    dispatch(addQuestionsSuccess(addedquestions));
                    return response.data;
                });
        } catch (error) {
            console.log('error');
            dispatch(addQuestionsFailure(error.message));
            throwError(error);
        }
    } else {
        try {
            dispatch(addQuestionsRequest);
            return await axios
                .post(`${baseApiUrl}/questions/`, data, {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                })
                .then((response) => {
                    const addedquestions = response.data;
                    dispatch(addQuestionsSuccess(addedquestions));
                    return response.data;
                });
        } catch (error) {
            console.log('error');
            dispatch(addQuestionsFailure(error.message));
            throwError(error);
        }
    }
};

export const AddUsers = async (data, id) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    if (id) {
        try {
            dispatch(addUsersRequest);
            return await axios
                .put(`${baseApiUrl}/users/${id}/`, data, {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                })
                .then((response) => {
                    const addedusers = response.data;
                    dispatch(addUsersSuccess(addedusers));

                    return response.data;
                });
        } catch (error) {
            console.log('error');
            dispatch(addUsersFailure(error.message));
            throwError(error);
        }
    } else {
        try {
            dispatch(addUsersRequest);
            return await axios
                .post(`${baseApiUrl}/users/`, data, {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                })
                .then((response) => {
                    const addedusers = response.data;
                    dispatch(addUsersSuccess(addedusers));

                    return response.data;
                });
        } catch (error) {
            console.log('error');
            dispatch(addUsersFailure(error.message));
            throwError(error);
        }
    }
};

export const AddOrgUsers = async (data) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .post(`${baseApiUrl}/org/super/admins`, data, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                console.log(response);
                const addedusers = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');
        throwError(error);
    }
};

export const AddOrganizations = async (data, id) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    if (id) {
        try {
            dispatch(addOrganizationsRequest);
            const d = {
                name: data.name,
                country: data.country,
                org_name: data.org_name,
                mobile: data.mobile,
                email_id: data.email_id,
                gender: '2',
                org_type: data.org_type
            };

            return await axios
                .put(`${baseApiUrl}/customers/${id}/`, d, {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                })
                .then((response) => {
                    const addedOrganizations = response.data;
                    dispatch(addOrganizationsSuccess(addedOrganizations));

                    return response.data;
                });
        } catch (error) {
            console.log(error, 'error');
            dispatch(addOrganizationsFailure(error.message));
            throwError(error);
        }
    } else {
        try {
            dispatch(addOrganizationsRequest);
            const d = {
                name: data.name,
                country: data.country,
                org_name: data.org_name,
                mobile: data.mobile,
                email_id: data.email_id,
                gender: '2',
                org_type: data.org_type
            };
            return await axios
                .post(`${baseApiUrl}/customers/`, d, {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                })
                .then((response) => {
                    const addedOrganizations = response.data;
                    dispatch(addOrganizationsSuccess(addedOrganizations));

                    return response.data;
                });
        } catch (error) {
            console.log(error, 'error');
            dispatch(addOrganizationsFailure(error.message));
            throwError(error);
        }
    }
};

export const submitEIF = async (data) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;

    try {
        dispatch(addEifRequest);
        return await axios
            .post(
                `${baseApiUrl}/staging`,
                {
                    category: 1,
                    answers: data,
                    is_completely_filled: 'true'
                },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                }
            )
            .then((response) => {
                const addeif = response.data;
                dispatch(addEifSuccess(addeif));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(addEifFailure(error.message));
        throwError(error);
    }
};

export const submitRAF = async (data, customer, is_completely_filled) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    try {
        dispatch(addRafRequest);
        return await axios
            .post(
                `${baseApiUrl}/staging`,
                {
                    category: 2,
                    customer: customer,
                    answers: data,
                    is_completely_filled: is_completely_filled
                },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser}`
                    }
                }
            )
            .then((response) => {
                const addraf = response.data;
                dispatch(addRafSuccess(addraf));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(addRafFailure(error.message));
        throwError(error);
    }
};

export const eifQuestions = async () => {
    const { dispatch } = store;
    try {
        dispatch(eifQuestionsRequest);
        await axios.get(`${baseApiUrl}/stages?category=1`).then((response) => {
            const loadquestions = response.data;
            dispatch(eifQuestionsSuccess(loadquestions));
            return response.data;
        });
    } catch (error) {
        console.log('error');
        dispatch(eifQuestionsFailure(error.message));
        throwError(error);
    }
};

export const rafQuestions = async (customer) => {
    const { dispatch } = store;
    try {
        dispatch(rafQuestionsRequest);
        return await axios.get(`${baseApiUrl}/stages?category=2&customer=${customer}`).then((response) => {
            const loadrafquestions = response.data;
            dispatch(rafQuestionsSuccess(loadrafquestions));
            return response.data;
        });
    } catch (error) {
        console.log('error');
        dispatch(rafQuestionsFailure(error.message));
        throwError(error);
    }
};

export const Org_Super_Admins = async (customer) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    try {
        return await axios
            .get(`${baseApiUrl}/org/super/admins?customer=${customer}`, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const loadrafquestions = response.data;
                return response.data;
            });
    } catch (error) {
        console.log('error');
        throwError(error);
    }
};

export const AddQuestionsCategory = async (data) => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;

    try {
        dispatch(addQuestionsCategoryRequest);
        return await axios
            .post(`${baseApiUrl}/questionscategory/`, data, {
                headers: {
                    Authorization: `Bearer ${currentUser}`
                }
            })
            .then((response) => {
                const addquestionscategory = response.data;
                dispatch(addQuestionsCategorySuccess(addquestionscategory));
                return response.data;
            });
    } catch (error) {
        console.log('error');
        dispatch(addQuestionsCategoryFailure(error.message));
        throwError(error);
    }
};

export const logOut = () => {
    const { dispatch } = store;
    const currentUser = store.getState().loginData.user.token;
    let token = localStorage.refreshToken ? (localStorage.refreshToken === undefined ? '' : localStorage.refreshToken === 'undefined' ? '' : localStorage.refreshToken) : '';
    let config = {
        method: 'post',
        url: `${baseApiUrl}/admin/logout`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    axios(config).then((response) => {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user_role');
        dispatch(clearUser());
        return response.data;
    });
};

function throwError(error) {
    if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status, 'status');
        console.log(error.response.headers);
        if (error.response.status === 403) {
            const { dispatch } = store;
            logOut();
            dispatch(clearUser());
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user_role');
        } else {
            const errorResponse = {
                data: error.response.data || undefined,
                status: error.response.status || undefined
            };
            throw errorResponse;
        }
    } else if (error.request) {
        console.log(error.request);
        const errorResponse = {
            data: { Error: 'unknown error occurred while contacting the server' },
            status: undefined
        };
        throw errorResponse;
    } else {
        console.log('Error', error.message);
    }
}

export default createAuthRefreshInterceptor;
