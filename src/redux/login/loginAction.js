import { SIGNIN_PIN } from './loginTypes';
import { FETCH_USERS_REQUEST } from './loginTypes';
import { FETCH_USERS_SUCCESS } from './loginTypes';
import { FETCH_USERS_FAILURE } from './loginTypes';
import { FETCH_USERS_UPDATE } from './loginTypes';
import { FETCH_PRE_LOGIN_REQUEST, FETCH_PRE_LOGIN_SUCCESS, FETCH_PRE_LOGIN_FAILURE } from './loginTypes';
import { CLEAR_USER } from './loginTypes';

export const signin = (username, password) => {
    return {
        type: SIGNIN_PIN
    };
};

//PreLogin Action
export function fetchPreLoginRequest(user) {
    return {
        type: FETCH_PRE_LOGIN_REQUEST,
        user
    };
}
export function fetchPreLoginSuccess(user) {
    return {
        type: FETCH_PRE_LOGIN_SUCCESS,
        user
    };
}
export function fetchPreLoginFailure(error) {
    return {
        type: FETCH_PRE_LOGIN_FAILURE,
        error
    };
}

//Login Action
export function fetchUsersRequest() {
    return {
        type: FETCH_USERS_REQUEST
    };
}
export function fetchUsersSuccess(user) {
    return {
        type: FETCH_USERS_SUCCESS,
        user
    };
}
export function fetchUsersFailure(error) {
    return {
        type: FETCH_USERS_FAILURE,
        error
    };
}
export function update(user) {
    return {
        type: FETCH_USERS_UPDATE,
        user
    };
}
export function clearUser() {
    return {
        type: CLEAR_USER
    };
}

export default { signin, fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure, update, clearUser };
