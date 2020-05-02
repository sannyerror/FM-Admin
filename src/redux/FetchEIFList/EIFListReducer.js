import { FETCH_EIFLIST_REQUEST } from './EIFListTypes'
import { FETCH_EIFLIST_SUCCESS } from './EIFListTypes'
import { FETCH_EIFLIST_FAILURE } from './EIFListTypes'
import { FETCH_EIFLIST_UPDATE }  from './EIFListTypes'

const initialstate = {
    loading : true , 
    EifList : [],
    error : '',
    
}
export function EIFListReducer(state=initialstate ,action) {
    switch(action.type){
        
        case FETCH_EIFLIST_REQUEST :  return {
            ...state,
            loading : true
        }
        case FETCH_EIFLIST_SUCCESS :  return {
            loading : false,
            ...state,
            EifList : action.EifList,
            error : ''
        }
        case FETCH_EIFLIST_FAILURE :  return {
            loading : false,
            ...state,
            EifList : [],
            error : action.payload 
        }
        case FETCH_EIFLIST_UPDATE : return {
            loading : false,
            ...state,
            EifList : action.EifList,
            error : ''
        }
        
           default : return state
    }
}

export default { EIFListReducer  }