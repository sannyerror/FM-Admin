import { ADD_QUESTIONSCATEGORY_REQUEST } from './AddQuestionsCategoryTypes'
import { ADD_QUESTIONSCATEGORY_SUCCESS } from './AddQuestionsCategoryTypes'
import { ADD_QUESTIONSCATEGORY_FAILURE } from './AddQuestionsCategoryTypes'
import { ADD_QUESTIONSCATEGORY_UPDATE }  from './AddQuestionsCategoryTypes'
const initialstate = {
    loading : true , 
    addquestionscategory : [],
    error : '',
    
}
export function AddQuestionsCategoryReducer(state=initialstate ,action) {
    switch(action.type){
        
        case ADD_QUESTIONSCATEGORY_REQUEST :  return {
            ...state,
            loading : true
        }
        case ADD_QUESTIONSCATEGORY_SUCCESS :  return {
            loading : false,
            ...state,
            addquestionscategory : action.addquestionscategory,
            error : ''
        }
        case ADD_QUESTIONSCATEGORY_FAILURE :  return {
            loading : false,
            ...state,
            addquestionscategory : [],
            error : action.payload 
        }
        case ADD_QUESTIONSCATEGORY_UPDATE : return {
            loading : false,
            ...state,
            addquestionscategory : action.addquestionscategory,
            error : ''
        }
        
           default : return state
    }
}

export default { AddQuestionsCategoryReducer  }