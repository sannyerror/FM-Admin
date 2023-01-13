import { GET_DASHBOARD_REQUEST, GET_DASHBOARD_SUCCESS, GET_DASHBOARD_FAILURE, SAVE_DASHBOARD_REQUEST, SAVE_DASHBOARD_SUCCESS, SAVE_DASHBOARD_FAILURE, PUBLISH_DASHBOARD_REQUEST, PUBLISH_DASHBOARD_SUCCESS, PUBLISH_DASHBOARD_FAILURE, DELETE_DASHBOARD_REQUEST, DELETE_DASHBOARD_SUCCESS, DELETE_DASHBOARD_FAILURE } from './DashBoardTypes';

const initialState = {
    fetching: false,
    getDashboardList: {},
    isError: '',

    saving: false,
    saveDashboardList: {},
    error: '',

    publishing: false,
    deleting: false
};
export function DashboardReducer(state = initialState, action) {
    switch (action.type) {
        // GET Dashboard
        case GET_DASHBOARD_REQUEST:
            return {
                ...state,
                fetching: true,
                getDashboardList: {},
                isError: '',

                saving: false,
                saveDashboardList: {},
                error: '',

                publishing: false,
                deleting: false
            };
        case GET_DASHBOARD_SUCCESS:
            return {
                ...state,
                fetching: false,
                getDashboardList: { ...action.getDashboardList },
                isError: ''
            };
        case GET_DASHBOARD_FAILURE:
            return {
                ...state,
                fetching: false,
                getDashboardList: {},
                isError: action.error
            };

        // Save/Update Dashboard
        case SAVE_DASHBOARD_REQUEST:
            return {
                ...state,
                saving: true,
                saveDashboardList: {},
                error: ''
            };
        case SAVE_DASHBOARD_SUCCESS:
            return {
                ...state,
                saving: false,
                saveDashboardList: { ...action.dashboardList },
                error: ''
            };
        case SAVE_DASHBOARD_FAILURE:
            return {
                ...state,
                saving: false,
                saveDashboardList: {},
                error: action.error
            };

        // Publish Dashboard
        case PUBLISH_DASHBOARD_REQUEST:
            return {
                ...state,
                publishing: true
            };
        case PUBLISH_DASHBOARD_SUCCESS:
            return {
                ...state,
                publishing: false
            };
        case PUBLISH_DASHBOARD_FAILURE:
            return {
                ...state,
                publishing: false
            };

        // Delete Dashboard
        case DELETE_DASHBOARD_REQUEST:
            return {
                ...state,
                deleting: true
            };
        case DELETE_DASHBOARD_SUCCESS:
            return {
                ...state,
                deleting: false
            };
        case DELETE_DASHBOARD_FAILURE:
            return {
                ...state,
                deleting: false
            };
        default:
            return state;
    }
}
export default { DashboardReducer };
