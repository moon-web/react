import { GET_ADD_WHITE_SUCCESS } from '../../contants/system/whiteListTypes'

export default function(state = {}, action) {
    switch (action.type) {
        case GET_ADD_WHITE_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch || true
            })
        default:
            return state
    }
}