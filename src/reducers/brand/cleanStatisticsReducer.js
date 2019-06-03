import { GET_CLEAN_STATISTICS_LIST_SUCCESS, GET_CLEAN_STATISTICS_LIST_ERROR, UPDATE_CLEAN_STATISTICS_LIST_SUCCESS, UPDATE_CLEAN_STATISTICS_LIST_ERROR,
    GET_BRANDCLEAN_VOLUNTEER_LIST_SUCCESS, GET_BRANDCLEAN_VOLUNTEER_LIST_ERROR, GET_BRANDCLEAN_PENDING_COUNT,GET_BRANDCLEAN_CONFIRMED_COUNT,
    GET_BRANDCLEAN_DETAILS } from '../../contants/brand/cleanStatisticsTypes'

export default function reducerName(state = {}, action) {
    switch (action.type) {
        case GET_CLEAN_STATISTICS_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldCleanStatisticsList: action.oldCleanStatisticsList,
                newCleanStatisticsList: action.newCleanStatisticsList,
                pageNo: action.pageNo !== undefined ? action.pageNo : 1,
                total: action.total !== undefined ? action.total : 0,
                searchData: action.searchData
            })
        case GET_CLEAN_STATISTICS_LIST_ERROR:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                newCleanStatisticsList: action.oldCleanStatisticsList,
                pageNo: action.pageNo !== undefined ? action.pageNo - 1 : 1,
                total: action.total !== undefined ? action.total : 0
            })
        case UPDATE_CLEAN_STATISTICS_LIST_SUCCESS:
            return Object.assign({}, state, {
                newCleanStatisticsList: action.newCleanStatisticsList,
            })
        case UPDATE_CLEAN_STATISTICS_LIST_ERROR:
            return Object.assign({}, state, {
                newCleanStatisticsList: action.oldCleanStatisticsList,
            })
        case GET_BRANDCLEAN_VOLUNTEER_LIST_SUCCESS:
            return Object.assign({}, state, {
                brandCleanVolunteerList: action.brandCleanVolunteerList,
            })
        case GET_BRANDCLEAN_VOLUNTEER_LIST_ERROR:
            return Object.assign({}, state, {
                brandCleanVolunteerList: action.brandCleanVolunteerList,
            })
        case GET_BRANDCLEAN_PENDING_COUNT:
            return Object.assign({}, state, {
                barndCleanTotal: action.barndCleanTotal,
                searchFetch: action.searchFetch
            })
        case GET_BRANDCLEAN_CONFIRMED_COUNT:
            return Object.assign({}, state, {
                confirmed: action.confirmed,
                tobeConfirmed: action.tobeConfirmed,
                tortNum: action.tortNum
            })
        case GET_BRANDCLEAN_DETAILS:
            return Object.assign({}, state, {
                queryBrandCleanDetail: action.queryBrandCleanDetail
            });
        default:
            return state
    }
}