import { FETCH_QUESTIONS_REQUEST } from './QuestionsTypes'
import { FETCH_QUESTIONS_SUCCESS } from './QuestionsTypes'
import { FETCH_QUESTIONS_FAILURE } from './QuestionsTypes'
import { FETCH_QUESTIONS_UPDATE }  from './QuestionsTypes'

const initialstate = {
    loading : true , 
    questionsList : [],
    error : '',
    
}
export function QuestionsReducer(state=initialstate ,action) {
    switch(action.type){
        
        case FETCH_QUESTIONS_REQUEST :  return {
            ...state,
            loading : true
        }
        case FETCH_QUESTIONS_SUCCESS :  return {
            loading : false,
            ...state,
            questionsList : action.questionsList,
            error : ''
        }
        case FETCH_QUESTIONS_FAILURE :  return {
            loading : false,
            ...state,
            questionsList : [],
            error : action.payload 
        }
        case FETCH_QUESTIONS_UPDATE : return {
            loading : false,
            ...state,
            questionsList : action.questionsList,
            error : ''
        }
        
           default : return state
    }
}
export default { QuestionsReducer  }