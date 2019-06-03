import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import InvestigatorManage from './index'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { GET_INVESTIGATION_LIST_SUCCESS, UPDATE_INVESTIGATION_STATUS_SUCCESS, UPDATE_INVESTIGATION_STATUS_ERROR } from '../../../contants/users/investigationListTypes'

function mapStateToProps(state, props) {
    const { isFetch, oldInvestigationList, newInvestigationList, searchData, pageNo, pageSize, total } = state.investigatorListReducer;
    const { userInfo } = state.loginReducer
    const { permissionList, b2bUserStatus, b2bUserType } = state.commonReducer
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
        b2bUserStatus,
        b2bUserType
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getInvestigationList: (oldList, data) => {
            dispatch(actionCreator(GET_INVESTIGATION_LIST_SUCCESS, { isFetch: true }))
            Api.investgatorsList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_INVESTIGATION_LIST_SUCCESS, { oldInvestigationList: oldList, newInvestigationList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records, isFetch: false }))
                } else {
                    dispatch(actionCreator(GET_INVESTIGATION_LIST_SUCCESS, { newInvestigationList: [], isFetch: false }))
                }
            })
        },
        updateInvestigationItem: (data, oldList, callback) => {
            Api.investgatorAudit(data).then(res => {
                if (res.success) {
                    let result = [];
                    for (let i = 0; i < oldList.length; i++) {
                        const element = oldList[i];
                        if (element.userId === data.userId) {
                            element.status = data.status;
                            element.statusName = data.statusName;
                            element.statusNameEn = data.statusNameEn;
                        }
                        result.push(element)
                    }
                    dispatch(actionCreator(UPDATE_INVESTIGATION_STATUS_SUCCESS, {newInvestigationList: result}))
                    typeof callback === 'function' && callback()
                } else {
                    dispatch(actionCreator(UPDATE_INVESTIGATION_STATUS_ERROR, {oldInvestigationList: oldList}))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(InvestigatorManage))
