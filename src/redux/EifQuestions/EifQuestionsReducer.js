import { EIF_QUESTIONS_REQUEST } from './EifQuestionsTypes'
import { EIF_QUESTIONS_SUCCESS } from './EifQuestionsTypes'
import { EIF_QUESTIONS_FAILURE } from './EifQuestionsTypes'
import { EIF_QUESTIONS_UPDATE } from './EifQuestionsTypes'

const initialstate = {
    loading : true , 
    loadquestions : [],
    error : '',
    
}
export function EifQuestionsReducer(state=initialstate ,action) {
    switch(action.type){
        
        case EIF_QUESTIONS_REQUEST :  return {
            ...state,
            loading : true
        }
        case EIF_QUESTIONS_SUCCESS :  return {
            loading : false,
            ...state,
            loadquestions : action.loadquestions,
            error : ''
        }
        case EIF_QUESTIONS_FAILURE :  return {
            loading : false,
            ...state,
            loadquestions : [],
            error : action.payload 
        }
        case EIF_QUESTIONS_UPDATE : return {
            loading : false,
            ...state,
            loadquestions : action.loadquestions,
            error : ''
        }
        
           default : return state
    }
}

export default { EifQuestionsReducer  }