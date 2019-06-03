import { GET_AUTHORITY_SUCCESS, UPDATE_AUTHORITY_SUCCESS, UPDATE_AUTHORITY_ERROR } from '../../contants/system/authorityTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_AUTHORITY_SUCCESS:
            return Object.assign({}, state, {
                oldAuthorityList: action.oldAuthorityList,
                newAuthorityList: action.newAuthorityList,
                isFetch: action.isFetch
            })
        case UPDATE_AUTHORITY_SUCCESS:
            return Object.assign({}, state, {
                newAuthorityList: action.newAuthorityList,
                isFetch: action.isFetch
            })
        case UPDATE_AUTHORITY_ERROR:
            return Object.assign({}, state, {
                newAuthorityList: action.oldAuthorityList,
                isFetch: action.isFetch
            })
        default:
            return state
    }
}