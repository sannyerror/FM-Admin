import { ADD_QUESTIONSCATEGORY_REQUEST } from './AddQuestionsCategoryTypes'
import { ADD_QUESTIONSCATEGORY_SUCCESS } from './AddQuestionsCategoryTypes'
import { ADD_QUESTIONSCATEGORY_FAILURE } from './AddQuestionsCategoryTypes'
import { ADD_QUESTIONSCATEGORY_UPDATE } from './AddQuestionsCategoryTypes'

export function addQuestionsCategoryRequest(){
    return {
        type : ADD_QUESTIONSCATEGORY_REQUEST
    }
}
export function addQuestionsCategorySuccess(addedquestions){
    return {
      type: ADD_QUESTIONSCATEGORY_SUCCESS,
      addedquestions
    }
}
export function addQuestionsCategoryFailure(error){
    return {
        type: ADD_QUESTIONSCATEGORY_FAILURE,
        error
    }
}
export function update(addedquestions){
    return {
        type: ADD_QUESTIONSCATEGORY_UPDATE,
        addedquestions
    }
}



export default  { addQuestionsCategoryRequest ,addQuestionsCategorySuccess, addQuestionsCategoryFailure}