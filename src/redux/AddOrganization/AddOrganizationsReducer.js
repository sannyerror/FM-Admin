import { ADD_ORGANIZATIONS_REQUEST } from './AddOrganizationsTypes'
import { ADD_ORGANIZATIONS_SUCCESS } from './AddOrganizationsTypes'
import { ADD_ORGANIZATIONS_FAILURE } from './AddOrganizationsTypes'
import { ADD_ORGANIZATIONS_UPDATE }  from './AddOrganizationsTypes'
const initialstate = {
    loading : true , 
    addedorganizations : [],
    error : '',
    
}
export function AddOrganizationsReducer(state=initialstate ,action) {
    switch(action.type){
        
        case ADD_ORGANIZATIONS_REQUEST :  return {
            ...state,
            loading : true
        }
        case ADD_ORGANIZATIONS_SUCCESS :  return {
            loading : false,
            ...state,
            addedorganizations : action.addedorganizations,
            error : ''
        }
        case ADD_ORGANIZATIONS_FAILURE :  return {
            loading : false,
            ...state,
            addedorganizations : [],
            error : action.payload 
        }
        case ADD_ORGANIZATIONS_UPDATE : return {
            loading : false,
            ...state,
            addedorganizations : action.addedorganizations,
            error : ''
        }
        
           default : return state
    }
}


export default { AddOrganizationsReducer  }