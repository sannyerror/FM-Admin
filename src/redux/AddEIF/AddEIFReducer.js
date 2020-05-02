import { ADD_EIF_REQUEST } from './AddEIFTypes'
import { ADD_EIF_SUCCESS } from './AddEIFTypes'
import { ADD_EIF_FAILURE } from './AddEIFTypes'
import { ADD_EIF_UPDATE } from './AddEIFTypes'

const initialstate = {
    loading : true , 
    addeif : [],
    error : '',
    
}
export function AddEIFReducer(state=initialstate ,action) {
    switch(action.type){
        
        case ADD_EIF_REQUEST :  return {
            ...state,
            loading : true
        }
        case ADD_EIF_SUCCESS :  return {
            loading : false,
            ...state,
            addeif : action.addeif,
            error : ''
        }
        case ADD_EIF_FAILURE :  return {
            loading : false,
            ...state,
            addeif : [],
            error : action.payload 
        }
        case ADD_EIF_UPDATE : return {
            loading : false,
            ...state,
            addeif : action.addeif,
            error : ''
        }
        
           default : return state
    }
}

export default { AddEIFReducer  }