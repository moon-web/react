import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import InvestigatorDetail from './index'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { GET_INVESTIGATION_DETAIL_SUCCESS, UPDATE_INVESTIGATION_DETAIL_STATUS_SUCCESS, UPDATE_INVESTIGATION_DETAIL_STATUS_ERROR } from '../../../contants/users/investigationListTypes'
import { message } from 'antd';

function mapStateToProps(state, props) {
    const { oldInvestigationList, newInvestigationList, detail } = state.investigatorListReducer;
    const { b2bUserApplyStatus } = state.commonReducer;
    const { userInfo } = state.loginReducer
    const investigationList = union(oldInvestigationList, newInvestigationList)
    return {
        investigationList,
        detail,
        userInfo,
        b2bUserApplyStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getInvestigationDetail: (data) => {
            Api.investgatorDetail(data).then(res => {
                if (res.success) {
                    let dataObject = res.module;
                    if (dataObject.coverRange) {
                        dataObject.coverRange = JSON.parse(dataObject.coverRange)
                    }
                    dispatch(actionCreator(GET_INVESTIGATION_DETAIL_SUCCESS, { detail: dataObject }))
                } else {
                    message.error(res.errorDetail)
                    dispatch(actionCreator(GET_INVESTIGATION_DETAIL_SUCCESS, { detail: {} }))
                }
            })
        },
        updateInvestigationItem: (data, oldList, detail, callback) => {
            Api.investgatorApplyAudit(data).then(res => {
                if (res.success) {
                    let result = [];
                    for (let i = 0; i < oldList.length; i++) {
                        let element = oldList[i];
                        if (element.userId.toString() === data.b2bUserId) {
                            element.checkStatus = data.checkStatus;
                            element.checkStatusName = data.checkStatusName;
                            element.checkStatusNameEn = data.checkStatusNameEn;
                        }
                        result.push(element)
                    }
                    dispatch(actionCreator(UPDATE_INVESTIGATION_DETAIL_STATUS_SUCCESS, { newInvestigationList: result }))
                    typeof callback === 'function' && callback()
                    props.history.goBack()
                } else {
                    message.error(res.msg)
                    dispatch(actionCreator(UPDATE_INVESTIGATION_DETAIL_STATUS_ERROR, { oldInvestigationList: oldList }))
                }
            })

        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(InvestigatorDetail))
