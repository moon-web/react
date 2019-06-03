import { GET_MONITOR_DETAILS_SUCCESS} from '../../contants/monitoring/monitoringDetailsTypes'

export default function(state = {}, action) {
    switch (action.type) {
        case GET_MONITOR_DETAILS_SUCCESS:
            return Object.assign({}, state, {
                monitorDetailsList: action.monitorDetailsList
            })
        default:
            return state
    }
}