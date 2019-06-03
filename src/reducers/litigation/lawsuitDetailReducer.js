
import {
    GET_LAW_SUIT_DETAIL_SUCCESS, UPDATE_LAW_SUIT_DETAIL_SUCCESS, GET_DEFENDANT_INFO_SUCCESS, GET_LAW_SUIT_PROCESS_DETAIL_SUCCESS, UPDATE_DEFENDANT_INFO_SUCCESS,
    UPDATE_DEFENDANT_INFO_ERROR, GET_LAW_SUIT_PROCESS_SUCCESS, UPDATE_LAW_SUIT_PROCESS_SUCCESS, GET_LAW_SUIT_LOGS_SUCCESS, GET_LAW_SUIT_LOGS_ERROR, 
    GET_LAW_SUIT_DETAIL_ERROR, GET_LAW_SUIT_COOPERATIVE_LAWYER_SUCCESS, GET_LAW_SUIT_COOPERATIVE_LAWYER_ERROR
} from '../../contants/litigation/lawsuitDetailTypes'

const initState = {
    parties: [],
    process: {},
    logs: [],
    suitCaseDetail: {},
    cooperativeLawyerList: []
}
export default function (state = initState, action) {
    switch (action.type) {
        case GET_LAW_SUIT_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                suitCaseDetail: action.suitCaseDetail
            })
        case UPDATE_LAW_SUIT_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                suitCaseDetail: action.suitCaseDetail
            })
        case GET_LAW_SUIT_DETAIL_ERROR:
            return Object.assign({}, state, {
                
            })
        case GET_DEFENDANT_INFO_SUCCESS:
            return Object.assign({}, state, {
                parties: action.parties
            })

        case UPDATE_DEFENDANT_INFO_SUCCESS:
            return Object.assign({}, state, {
                parties: action.parties
            })
        case UPDATE_DEFENDANT_INFO_ERROR:
            return Object.assign({}, state, {

            })
        case GET_LAW_SUIT_PROCESS_SUCCESS:
            return Object.assign({}, state, {
                process: action.process
            })
        case UPDATE_LAW_SUIT_PROCESS_SUCCESS:
            return Object.assign({}, state, {
                process: action.process
            })
        case GET_LAW_SUIT_LOGS_SUCCESS:
            return Object.assign({}, state, {
                logs: action.logs
            })
        case GET_LAW_SUIT_LOGS_ERROR:
            return Object.assign({}, state, {

            })
        case GET_LAW_SUIT_COOPERATIVE_LAWYER_SUCCESS:
            return Object.assign({}, state, {
                cooperativeLawyerList: action.cooperativeLawyerList,
                minPageNo: action.minPageNo,
                minToltal: action.minToltal,
            })
        case GET_LAW_SUIT_COOPERATIVE_LAWYER_ERROR:
            return Object.assign({}, state, {
                cooperativeLawyerList: action.cooperativeLawyerList
            })
        default:
            return state
    }
}