import { GET_BRAND_EDIT_DETAIL_SUCCESS} from '../../contants/brand/brandListTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_BRAND_EDIT_DETAIL_SUCCESS: {
            return Object.assign({}, state, {
				brandEditDetail: action.brandEditDetail,
            })
        }
        default:
            return state
    }
}