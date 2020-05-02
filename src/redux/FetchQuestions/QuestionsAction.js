import { FETCH_QUESTIONS_REQUEST } from './QuestionsTypes'
import { FETCH_QUESTIONS_SUCCESS } from './QuestionsTypes'
import { FETCH_QUESTIONS_FAILURE } from './QuestionsTypes'
import { FETCH_QUESTIONS_UPDATE } from './QuestionsTypes'

export function fetchQuestionsRequest(){
    return {
        type : FETCH_QUESTIONS_REQUEST
    }
}
export function fetchQuestionsSuccess(questionsList){
    return {
      type: FETCH_QUESTIONS_SUCCESS,
      questionsList
    }
}
export function fetchQuestionsFailure(error){
    return {
        type: FETCH_QUESTIONS_FAILURE,
        error
    }
}
export function update(questionsList){
    return {
        type: FETCH_QUESTIONS_UPDATE,
        questionsList
    }
}



export default  { fetchQuestionsRequest ,fetchQuestionsSuccess, fetchQuestionsFailure}