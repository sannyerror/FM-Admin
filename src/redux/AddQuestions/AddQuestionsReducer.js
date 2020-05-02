import { ADD_QUESTIONS_REQUEST } from './AddQuestionsTypes'
import { ADD_QUESTIONS_SUCCESS } from './AddQuestionsTypes'
import { ADD_QUESTIONS_FAILURE } from './AddQuestionsTypes'
import { ADD_QUESTIONS_UPDATE }  from './AddQuestionsTypes'
const initialstate = {
    loading : true , 
    addedquestions : [],
    error : '',
    
}
export function AddQuestionsReducer(state=initialstate ,action) {
    switch(action.type){
        
        case ADD_QUESTIONS_REQUEST :  return {
            ...state,
            loading : true
        }
        case ADD_QUESTIONS_SUCCESS :  return {
            loading : false,
            ...state,
            addedquestions : action.addedquestions,
            error : ''
        }
        case ADD_QUESTIONS_FAILURE :  return {
            loading : false,
            ...state,
            addedquestions : [],
            error : action.payload 
        }
        case ADD_QUESTIONS_UPDATE : return {
            loading : false,
            ...state,
            addedquestions : action.addedquestions,
            error : ''
        }
        
           default : return state
    }
}


export default { AddQuestionsReducer  }