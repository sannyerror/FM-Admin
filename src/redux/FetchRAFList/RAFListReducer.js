import { FETCH_RAFLIST_REQUEST } from './RAFListTypes'
import { FETCH_RAFLIST_SUCCESS } from './RAFListTypes'
import { FETCH_RAFLIST_FAILURE } from './RAFListTypes'
import { FETCH_RAFLIST_UPDATE }  from './RAFListTypes'

const initialstate = {
    loading : true , 
    RafList : [],
    error : '',
    
}
export function RAFListReducer(state=initialstate ,action) {
    switch(action.type){
        
        case FETCH_RAFLIST_REQUEST :  return {
            ...state,
            loading : true
        }
        case FETCH_RAFLIST_SUCCESS :  return {
            loading : false,
            ...state,
            RafList : action.RafList,
            error : ''
        }
        case FETCH_RAFLIST_FAILURE :  return {
            loading : false,
            ...state,
            RafList : [],
            error : action.payload 
        }
        case FETCH_RAFLIST_UPDATE : return {
            loading : false,
            ...state,
            RafList : action.RafList,
            error : ''
        }
        
           default : return state
    }
}

export default { RAFListReducer  }