import {
    GET_BASIC_DETAIL_SUCCESS,
    GET_CASE_DETAIL_SUCCESS,
    GET_COMPANY_DETAIL_SUCCESS,
    GET_PROCESS_DETAIL_SUCCESS,
    GET_PROD_DETAIL_SUCCESS,
    GET_SUIT_DETAIL_SUCCESS,
    GET_WARN_DETAIL_SUCCESS,
    UPDATE_CASE_DETAIL_SUCCESS,
    UPDATE_COMPANY_DETAIL_SUCCESS,
    UPDATE_PROCESS_DETAIL_SUCCESS,
    UPDATE_PROD_DETAIL_SUCCESS,
    UPDATE_SUIT_DETAIL_SUCCESS,
    UPDATE_WARN_DETAIL_SUCCESS,
    GET_CASE_PROD_DETILS_LIST
} from '../../contants/case/caseDetailTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_BASIC_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                basicDetail: action.basicDetail
            })
        case GET_CASE_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                caseDetail: action.caseDetail
            })
        case GET_COMPANY_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                companyDetail: action.companyDetail
            })
        case GET_PROCESS_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                processDetail: action.processDetail
            })
        case GET_PROD_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                prodDetail: action.prodDetail
            })
        case GET_SUIT_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                suitDetail: action.suitDetail
            })
        case GET_WARN_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                warnDetail: action.warnDetail
            })
        case UPDATE_CASE_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                caseDetail: action.caseDetail
            })
        case UPDATE_COMPANY_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                companyDetail: action.companyDetail
            })
        case UPDATE_PROCESS_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                processDetail: action.processDetail
            })
        case UPDATE_PROD_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                prodDetail: action.prodDetail
            })
        case UPDATE_SUIT_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                suitDetail: action.suitDetail
            })
        case UPDATE_WARN_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                warnDetail: action.warnDetail
            })
        case GET_CASE_PROD_DETILS_LIST:
            return Object.assign({}, state, {
                getProDetails: action.getProDetails
            })
        default:
            return state
    }
}