import { GET_REPORT_DETAIL_BYID } from '../../contants/report/volunteerReportTypes'
import { GET_RESOURCE_PROD_LIST_SUCCESS } from '../../contants/system/resourceListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_REPORT_DETAIL_BYID:
            return Object.assign({}, state, {
                reportDetail: action.reportDetail
            })    
        case GET_RESOURCE_PROD_LIST_SUCCESS:
            return Object.assign({}, state, {
                resourceProdList: action.resourceProdList
            })        
        default:
            return state
    }
}