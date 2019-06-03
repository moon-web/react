import { GET_BRAND_CLEANLINESS_PLATFORM_SUCCESS, GET_BRAND_CLEANLINESS_LIST_SUCCESS, GET_BRAND_CLEANLINESS_LIST_ERROR, GET_BRAND_CLEANLINESS_CRAWLER_SUCCESS, 
    GET_BRAND_CLEANLINESS_CRAWLER_LINE_SUCCESS, GET_BRAND_CLEANLINESS_CRAWLER_LINE_ERROR, UPDATE_BRAND_CLEANLINESS_LIST_ERROR, 
    UPDATE_BRAND_CLEANLINESS_LIST_SUCCESS, GET_BRAND_NO_CLEANLINESS_LIST_SUCCESS, GET_BRAND_CLEANLINESS_ADD_SUCCESS } from '../../contants/brand/brandCleanlinessType'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_BRAND_CLEANLINESS_LIST_SUCCESS:
            return Object.assign({}, state, {
                oldbrandCleanlinessListData: action.oldbrandCleanlinessListData,
                newbrandCleanlinessListData: action.newbrandCleanlinessListData,
                isFetch: action.isFetch,  
                cleanlinessSearchData: action.cleanlinessSearchData     
            })
        case GET_BRAND_CLEANLINESS_LIST_ERROR:
            return Object.assign({}, state, {
                oldbrandCleanlinessListData: action.oldbrandCleanlinessListData,
                newbrandCleanlinessListData: action.newbrandCleanlinessListData 
            })
        case GET_BRAND_CLEANLINESS_PLATFORM_SUCCESS: 
            return Object.assign({}, state, {
                brandCleanlinessPlatform: action.brandCleanlinessPlatform
            })
        case GET_BRAND_CLEANLINESS_CRAWLER_SUCCESS:
            return Object.assign({}, state, {
                brandCleanlinessCrawlerData: action.brandCleanlinessCrawlerData,
            })
        case GET_BRAND_CLEANLINESS_CRAWLER_LINE_SUCCESS:
            return Object.assign({}, state, {
                brandCleanlinessCrawlerLineData: action.brandCleanlinessCrawlerLineData,
            })
        case GET_BRAND_CLEANLINESS_CRAWLER_LINE_ERROR:
            return Object.assign({}, state, {
                brandCleanlinessCrawlerLineData: action.brandCleanlinessCrawlerLineData,
            })
        case UPDATE_BRAND_CLEANLINESS_LIST_SUCCESS:
            return Object.assign({}, state, {
                newbrandCleanlinessListData: action.newbrandCleanlinessListData
            })
        case UPDATE_BRAND_CLEANLINESS_LIST_ERROR:
            return Object.assign({}, state, {
                oldbrandCleanlinessListData: action.oldbrandCleanlinessListData
            })
        case GET_BRAND_NO_CLEANLINESS_LIST_SUCCESS: 
            return Object.assign({}, state, {
                oldbrandCleanlinessListData: action.oldbrandCleanlinessListData,
                newbrandCleanlinessListData: action.newbrandCleanlinessListData,
                brandCleanlinessPlatform: action.brandCleanlinessPlatform,
            })
        case GET_BRAND_CLEANLINESS_ADD_SUCCESS:
            return Object.assign({}, state, {
                isFetchBtag: action.isFetchBtag || true
            })
        default:
            return state
    }
}