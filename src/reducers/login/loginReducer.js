import { LOGIN, LOGOUT, GET_USERINFO_SUCCESS } from '../../contants/login/loginTypes'

export default function(state = {}, action) {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, {
                login: true,
                userInfo: action.userInfo
            })
        case LOGOUT:
            return Object.assign({}, state, {
                login: false,
                userInfo: {}
            })
        case GET_USERINFO_SUCCESS:
            return Object.assign({}, state, {
                userInfo: action.userInfo
            })
        default:
            return state
    }
}