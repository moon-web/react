import { GET_REWORDDETAILS_SUCCESS } from '../../../contants/investigationreport/details/rewardDetailsTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_REWORDDETAILS_SUCCESS:
            return Object.assign({}, state, {
				rewardDetails: action.rewardDetails,
            })
        default:
            return state
    }
}