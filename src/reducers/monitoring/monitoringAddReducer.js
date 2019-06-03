import { GET_MONITOR_MONITORING_SUCCESS } from '../../contants/monitoring/monitoringAddTypes'

export default function(state = {}, action) {
    switch (action.type) {
        case GET_MONITOR_MONITORING_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch || true
            })
        default:
            return state
    }
}