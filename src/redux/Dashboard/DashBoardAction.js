import { GET_DASHBOARD_REQUEST, GET_DASHBOARD_SUCCESS, GET_DASHBOARD_FAILURE, SAVE_DASHBOARD_REQUEST, SAVE_DASHBOARD_SUCCESS, SAVE_DASHBOARD_FAILURE, PUBLISH_DASHBOARD_REQUEST, PUBLISH_DASHBOARD_SUCCESS, PUBLISH_DASHBOARD_FAILURE, DELETE_DASHBOARD_REQUEST, DELETE_DASHBOARD_SUCCESS, DELETE_DASHBOARD_FAILURE } from './DashBoardTypes';

// Get DashBoard Action Types
export function getDashboardRequest() {
    return {
        type: GET_DASHBOARD_REQUEST
    };
}
export function getDashboardSuccess(getDashboardList) {
    return {
        type: GET_DASHBOARD_SUCCESS,
        getDashboardList
    };
}
export function getDashboardFailure(error) {
    return {
        type: GET_DASHBOARD_FAILURE,
        error
    };
}

// Save DashBoard Action Types
export function saveDashboardRequest() {
    return {
        type: SAVE_DASHBOARD_REQUEST
    };
}
export function saveDashboardSuccess(dashboardList) {
    return {
        type: SAVE_DASHBOARD_SUCCESS,
        dashboardList
    };
}
export function saveDashboardFailure(error) {
    return {
        type: SAVE_DASHBOARD_FAILURE,
        error
    };
}

// Publish DashBoard Action Types
export function publishDashboardRequest() {
    return {
        type: PUBLISH_DASHBOARD_REQUEST
    };
}
export function publishDashboardSuccess() {
    return {
        type: PUBLISH_DASHBOARD_SUCCESS
    };
}
export function publishDashboardFailure() {
    return {
        type: PUBLISH_DASHBOARD_FAILURE
    };
}

// Delete Dashboard Action Types
export function deleteDashboardRequest() {
    return {
        type: DELETE_DASHBOARD_REQUEST
    };
}
export function deleteDashboardSuccess() {
    return {
        type: DELETE_DASHBOARD_SUCCESS
    };
}
export function deleteDashboardFailure() {
    return {
        type: DELETE_DASHBOARD_FAILURE
    };
}

export default { getDashboardRequest, getDashboardSuccess, getDashboardFailure, saveDashboardRequest, saveDashboardSuccess, saveDashboardFailure, publishDashboardRequest, publishDashboardSuccess, publishDashboardFailure, deleteDashboardRequest, deleteDashboardSuccess, deleteDashboardFailure };
