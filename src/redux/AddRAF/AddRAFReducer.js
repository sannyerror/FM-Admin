import { ADD_RAF_REQUEST } from './AddRAFTypes'
import { ADD_RAF_SUCCESS } from './AddRAFTypes'
import { ADD_RAF_FAILURE } from './AddRAFTypes'
import { ADD_RAF_UPDATE } from './AddRAFTypes'

const initialstate = {
    loading : true , 
    addraf : [],
    error : '',
    
}
export function AddRAFReducer(state=initialstate ,action) {
    switch(action.type){
        
        case ADD_RAF_REQUEST :  return {
            ...state,
            loading : true
        }
        case ADD_RAF_SUCCESS :  return {
            loading : false,
            ...state,
            addraf : action.addraf,
            error : ''
        }
        case ADD_RAF_FAILURE :  return {
            loading : false,
            ...state,
            addraf : [],
            error : action.payload 
        }
        case ADD_RAF_UPDATE : return {
            loading : false,
            ...state,
            addraf : action.addraf,
            error : ''
        }
        
           default : return state
    }
}

export default { AddRAFReducer  }