import { FETCH_QUESTIONSCATEGORY_REQUEST } from './QuestionsCategoryTypes'
import { FETCH_QUESTIONSCATEGORY_SUCCESS } from './QuestionsCategoryTypes'
import { FETCH_QUESTIONSCATEGORY_FAILURE } from './QuestionsCategoryTypes'
import { FETCH_QUESTIONSCATEGORY_UPDATE }  from './QuestionsCategoryTypes'
const initialstate = {
    loading : true , 
    questionscategoryList : [],
    error : '',
    
}
export function QuestionsCategoryReducer(state=initialstate ,action) {
    switch(action.type){
        
        case FETCH_QUESTIONSCATEGORY_REQUEST :  return {
            ...state,
            loading : true
        }
        case FETCH_QUESTIONSCATEGORY_SUCCESS :  return {
            loading : false,
            ...state,
            questionscategoryList : action.questionscategoryList,
            error : ''
        }
        case FETCH_QUESTIONSCATEGORY_FAILURE :  return {
            loading : false,
            ...state,
            questionscategoryList : [],
            error : action.payload 
        }
        case FETCH_QUESTIONSCATEGORY_UPDATE : return {
            loading : false,
            ...state,
            questionscategoryList : action.questionscategoryList,
            error : ''
        }
        
           default : return state
    }
}

export default { QuestionsCategoryReducer  }