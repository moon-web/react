import { GET_HOME_COUNT_SUCCESS, GET_HOME_SUIT_CASE_COUNT_SUCCESS, GET_IPR_HOME_KEY_AREA_SUCCESS, GET_IPR_HOME_KEY_BRAND_SUCCESS, GET_IPR_HOME_KEY_CATEGORY_SUCCESS, GET_IPR_HOME_KEY_PLATFORM_SUCCESS, GET_IPR_HOME_KEY_TROTS_SUCCESS, GET_IPR_HOME_NETWORK_SUCCESS } from '../../contants/home/homeTypes'
const initState = {
    noticeList: [],
    suitCaseCount: {},
    keyArea: {},
    keyBrand: {},
    keyCategory: {},
    keyPlatform: {},
    keyTrots: {},
    network: {}
}

export default function (state = initState, action) {
    switch (action.type) {
        case GET_HOME_COUNT_SUCCESS:
            return Object.assign({}, state, {
                noticeList: action.noticeList
            })
        case GET_HOME_SUIT_CASE_COUNT_SUCCESS:
            return Object.assign({}, state, {
                suitCaseCount: action.suitCaseCount
            })
        case GET_IPR_HOME_KEY_AREA_SUCCESS:
            return Object.assign({}, state, {
                keyArea: action.keyArea
            })
        case GET_IPR_HOME_KEY_BRAND_SUCCESS:
            return Object.assign({}, state, {
                keyBrand: action.keyBrand
            })
        case GET_IPR_HOME_KEY_CATEGORY_SUCCESS:
            return Object.assign({}, state, {
                keyCategory: action.keyCategory
            })
        case GET_IPR_HOME_KEY_PLATFORM_SUCCESS:
            return Object.assign({}, state, {
                keyPlatform: action.keyPlatform
            })
        case GET_IPR_HOME_KEY_TROTS_SUCCESS:
            return Object.assign({}, state, {
                keyTrots: action.keyTrots
            })
        case GET_IPR_HOME_NETWORK_SUCCESS:
            return Object.assign({}, state, {
                network: action.network
            })
        default:
            return state
    }
}