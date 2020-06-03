import { ADD_ORGANIZATIONS_REQUEST } from './AddOrganizationsTypes'
import { ADD_ORGANIZATIONS_SUCCESS } from './AddOrganizationsTypes'
import { ADD_ORGANIZATIONS_FAILURE } from './AddOrganizationsTypes'
import { ADD_ORGANIZATIONS_UPDATE } from './AddOrganizationsTypes'

export function addOrganizationsRequest(){
    return {
        type : ADD_ORGANIZATIONS_REQUEST
    }
}
export function addOrganizationsSuccess(addedorganizations){
    return {
      type: ADD_ORGANIZATIONS_SUCCESS,
      addedorganizations
    }
}
export function addOrganizationsFailure(error){
    return {
        type: ADD_ORGANIZATIONS_FAILURE,
        error
    }
}
export function update(addedorganizations){
    return {
        type: ADD_ORGANIZATIONS_UPDATE,
        addedorganizations
    }
}



export default  { addOrganizationsRequest ,addOrganizationsSuccess, addOrganizationsFailure}