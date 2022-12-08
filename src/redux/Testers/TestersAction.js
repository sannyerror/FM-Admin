import { GET_TESTERS_REQUEST, GET_TESTERS_SUCCESS, GET_TESTERS_FAILURE, GET_EXISTING_TESTERS_REQUEST, GET_EXISTING_TESTERS_SUCCESS, GET_EXISTING_TESTERS_FAILURE, GET_EXISTING_TESTERS_UPDATE, REMOVE_EXISTING_TESTER } from './TestersTypes';

// All Testers in dropdown
export function getTestersRequest() {
    return {
        type: GET_TESTERS_REQUEST
    };
}
export function getTestersSuccess(testerList) {
    return {
        type: GET_TESTERS_SUCCESS,
        testerList
    };
}
export function getTestersFailure(error) {
    return {
        type: GET_TESTERS_FAILURE,
        error
    };
}

// Existing Testers for table view
export function getExistingTesterRequest() {
    return {
        type: GET_EXISTING_TESTERS_REQUEST
    };
}
export function getExistingTesterSuccess(existingTesterList) {
    return {
        type: GET_EXISTING_TESTERS_SUCCESS,
        existingTesterList
    };
}
export function getExistingTesterFailure(error) {
    return {
        type: GET_EXISTING_TESTERS_FAILURE,
        error
    };
}
export function updateExistingTester(newTester) {
    return {
        type: GET_EXISTING_TESTERS_UPDATE,
        newTester
    };
}
export function removeExistingTester(email) {
    return {
        type: REMOVE_EXISTING_TESTER,
        email
    };
}

export default { getTestersRequest, getTestersSuccess, getTestersFailure, getExistingTesterRequest, getExistingTesterSuccess, getExistingTesterFailure, updateExistingTester, removeExistingTester };
