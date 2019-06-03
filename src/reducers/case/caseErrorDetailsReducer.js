import { GET_CASE_ERROR_DETAILS } from '../../contants/case/caseErrorDetails'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_CASE_ERROR_DETAILS:
            return Object.assign({},state, {
                errorDetail:action.errorDetail
            })
        default:
            return state
    }
}