import { GET_OFFLINE_CASE_DETAIL_SUCCESS, GET_OFFLINE_CASE_LOGS_SUCCESS, GET_OFFLINE_CASE_REPORT_SUCCESS, GET_OFFLINE_CASE_PROCESS_DETAIL_SUCCESS, UPDATE_OFFLINE_CASE_PROCESS_DETAIL_SUCCESS } from '../../contants/offlineCase/offlineCaseDetailTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_OFFLINE_CASE_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                offlineCaseDetail: action.offlineCaseDetail,
            })
        case GET_OFFLINE_CASE_LOGS_SUCCESS:
            return Object.assign({}, state, {
                logs: action.logs,
            })
        case GET_OFFLINE_CASE_REPORT_SUCCESS:
            return Object.assign({}, state, {
                offlineCaseReport: action.offlineCaseReport,
            })
        case GET_OFFLINE_CASE_PROCESS_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                processDetail: action.processDetail,
            })
        case UPDATE_OFFLINE_CASE_PROCESS_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                processDetail: action.processDetail,
            })
        default:
            return state
    }
}