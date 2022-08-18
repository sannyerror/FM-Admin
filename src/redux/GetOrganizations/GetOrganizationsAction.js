import { GET_ORGANIZATIONS_REQUEST } from './GetOrganizationsTypes';
import { GET_ORGANIZATIONS_SUCCESS } from './GetOrganizationsTypes';
import { GET_ORGANIZATIONS_FAILURE } from './GetOrganizationsTypes';
import { GET_ORGANIZATIONS_UPDATE } from './GetOrganizationsTypes';

export function getOrganizationsRequest() {
    return {
        type: GET_ORGANIZATIONS_REQUEST
    };
}
export function getOrganizationsSuccess(organizationsList) {
    return {
        type: GET_ORGANIZATIONS_SUCCESS,
        organizationsList
    };
}
export function getOrganizationsFailure(error) {
    return {
        type: GET_ORGANIZATIONS_FAILURE,
        error
    };
}
export function update(organizationsList) {
    return {
        type: GET_ORGANIZATIONS_UPDATE,
        organizationsList
    };
}

export default { getOrganizationsRequest, getOrganizationsSuccess, getOrganizationsFailure };
