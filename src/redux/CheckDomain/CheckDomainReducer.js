import { CHECK_DOMAIN_REQUEST } from './CheckDomainTypes'
import { CHECK_DOMAIN_SUCCESS } from './CheckDomainTypes'
import { CHECK_DOMAIN_FAILURE } from './CheckDomainTypes'
import { CHECK_DOMAIN_UPDATE }  from './CheckDomainTypes'
const initialstate = {
    loading : true , 
    checkdomain : [],
    error : '',
    
}
export function CheckDomainReducer(state=initialstate ,action) {
    switch(action.type){
        
        case CHECK_DOMAIN_REQUEST :  return {
            ...state,
            loading : true
        }
        case CHECK_DOMAIN_SUCCESS :  return {
            loading : false,
            ...state,
            checkdomain : action.checkdomain,
            error : ''
        }
        case CHECK_DOMAIN_FAILURE :  return {
            loading : false,
            ...state,
            checkdomain : [],
            error : action.payload 
        }
        case CHECK_DOMAIN_UPDATE : return {
            loading : false,
            ...state,
            checkdomain : action.checkdomain,
            error : ''
        }
        
           default : return state
    }
}


export default { CheckDomainReducer  }