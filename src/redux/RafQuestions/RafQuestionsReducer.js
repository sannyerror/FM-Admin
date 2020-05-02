import { RAF_QUESTIONS_REQUEST } from './RafQuestionsTypes'
import { RAF_QUESTIONS_SUCCESS } from './RafQuestionsTypes'
import { RAF_QUESTIONS_FAILURE } from './RafQuestionsTypes'
import { RAF_QUESTIONS_UPDATE } from './RafQuestionsTypes'

const initialstate = {
    loading : true , 
    loadrafquestions : [],
    error : '',
    
}
export function RafQuestionsReducer(state=initialstate ,action) {
    switch(action.type){
        
        case RAF_QUESTIONS_REQUEST :  return {
            ...state,
            loading : true
        }
        case RAF_QUESTIONS_SUCCESS :  return {
            loading : false,
            ...state,
            loadrafquestions : action.loadrafquestions,
            error : ''
        }
        case RAF_QUESTIONS_FAILURE :  return {
            loading : false,
            ...state,
            loadrafquestions : [],
            error : action.payload 
        }
        case RAF_QUESTIONS_UPDATE : return {
            loading : false,
            ...state,
            loadrafquestions : action.loadrafquestions,
            error : ''
        }
        
           default : return state
    }
}

export default { RafQuestionsReducer  }