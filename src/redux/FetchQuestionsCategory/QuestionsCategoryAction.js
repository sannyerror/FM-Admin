import { FETCH_QUESTIONSCATEGORY_REQUEST } from './QuestionsCategoryTypes'
import { FETCH_QUESTIONSCATEGORY_SUCCESS } from './QuestionsCategoryTypes'
import { FETCH_QUESTIONSCATEGORY_FAILURE } from './QuestionsCategoryTypes'
import { FETCH_QUESTIONSCATEGORY_UPDATE } from './QuestionsCategoryTypes'

export function fetchQuestionscategoryRequest(){
    return {
        type : FETCH_QUESTIONSCATEGORY_REQUEST
    }
}
export function fetchQuestionscategorySuccess(questionscategoryList){
    return {
      type: FETCH_QUESTIONSCATEGORY_SUCCESS,
      questionscategoryList
    }
}
export function fetchQuestionscategoryFailure(error){
    return {
        type: FETCH_QUESTIONSCATEGORY_FAILURE,
        error
    }
}
export function update(questionscategoryList){
    return {
        type: FETCH_QUESTIONSCATEGORY_UPDATE,
        questionscategoryList
    }
}



export default  { fetchQuestionscategoryRequest ,fetchQuestionscategorySuccess, fetchQuestionscategoryFailure}