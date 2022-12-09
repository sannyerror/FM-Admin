import { GET_TESTERS_REQUEST, GET_TESTERS_SUCCESS, GET_TESTERS_FAILURE, GET_EXISTING_TESTERS_REQUEST, GET_EXISTING_TESTERS_SUCCESS, GET_EXISTING_TESTERS_FAILURE, GET_EXISTING_TESTERS_UPDATE, REMOVE_EXISTING_TESTER } from './TestersTypes';

const initialstate = {
    loading: true,
    allTesterList: [],
    error: '',

    fetching: true,
    existingTesterList: [],
    isError: ''
};
export function TestersReducer(state = initialstate, action) {
    switch (action.type) {
        // allTesterList -> Only Super Admin In dropdown
        case GET_TESTERS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_TESTERS_SUCCESS:
            return {
                ...state,
                loading: false,
                allTesterList: [...action.testerList],
                error: ''
            };
        case GET_TESTERS_FAILURE:
            return {
                ...state,
                loading: false,
                allTesterList: [],
                error: action.error
            };

        // Existing Testers for table view
        case GET_EXISTING_TESTERS_REQUEST:
            return {
                ...state,
                fetching: true,
                existingTesterList: []
            };
        case GET_EXISTING_TESTERS_SUCCESS:
            return {
                ...state,
                fetching: false,
                existingTesterList: [...action.existingTesterList],
                isError: ''
            };
        case GET_EXISTING_TESTERS_FAILURE:
            return {
                ...state,
                fetching: false,
                existingTesterList: [],
                isError: action.error
            };

        // Updating Testing User
        case GET_EXISTING_TESTERS_UPDATE:
            return {
                ...state,
                existingTesterList: [action.newTester, ...state.existingTesterList],
                error: ''
            };
        // Deleting Testing User
        case REMOVE_EXISTING_TESTER:
            return {
                ...state,
                existingTesterList: [...state.existingTesterList.filter((testerEmail) => testerEmail.email_id != action.email)]
            };

        default:
            return state;
    }
}
export default { TestersReducer };
