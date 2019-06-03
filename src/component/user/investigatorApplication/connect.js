import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import InvestigatorManage from './index'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { GET_INVESTIGATION_LIST_SUCCESS } from '../../../contants/users/investigationListTypes'

function mapStateToProps(state, props) {
    const { isFetch, oldInvestigationList, newInvestigationList, searchData, pageNo, pageSize, total } = state.investigatorListReducer;
    const { userInfo } = state.loginReducer
    const { permissionList, b2bUserApplyStatus  } = state.commonReducer
    const investigationList = union(oldInvestigationList, newInvestigationList)
    return {
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        investigationList,
        userInfo,
        permissionList,
        b2bUserApplyStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getInvestigationList: (oldList, data) => {
            dispatch(actionCreator(GET_INVESTIGATION_LIST_SUCCESS, {isFetch: true}))
            Api.investgatorAuditList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_INVESTIGATION_LIST_SUCCESS, { oldInvestigationList: oldList, newInvestigationList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records, isFetch: false  }))
                } else {
                    dispatch(actionCreator(GET_INVESTIGATION_LIST_SUCCESS, {newInvestigationList: [], isFetch: false}))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(InvestigatorManage))
