import { ADD_QUESTIONS_REQUEST } from './AddQuestionsTypes'
import { ADD_QUESTIONS_SUCCESS } from './AddQuestionsTypes'
import { ADD_QUESTIONS_FAILURE } from './AddQuestionsTypes'
import { ADD_QUESTIONS_UPDATE } from './AddQuestionsTypes'

export function addQuestionsRequest(){
    return {
        type : ADD_QUESTIONS_REQUEST
    }
}
export function addQuestionsSuccess(addedquestions){
    return {
      type: ADD_QUESTIONS_SUCCESS,
      addedquestions
    }
}
export function addQuestionsFailure(error){
    return {
        type: ADD_QUESTIONS_FAILURE,
        error
    }
}
export function update(addedquestions){
    return {
        type: ADD_QUESTIONS_UPDATE,
        addedquestions
    }
}



export default  { addQuestionsRequest ,addQuestionsSuccess, addQuestionsFailure}