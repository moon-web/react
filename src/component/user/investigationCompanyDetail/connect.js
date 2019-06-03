import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import InvestigatorCompanyDetail from './index'
import { actionCreator, union } from '../../../utils/util'
import { message} from 'antd'
import Api from '../../../api/index'
import { GET_INVESTIGATION_COMPANY_DETAIL_SUCCESS, UPDATE_INVESTIGATION_COMPANY_DETAIL_STATUS_SUCCESS, UPDATE_INVESTIGATION_COMPANY_DETAIL_STATUS_ERROR } from '../../../contants/users/investigationListTypes'

function mapStateToProps(state, props) {
    const { oldInvestigationList, newInvestigationList, companyDetail } = state.investigatorListReducer;
    const { b2bUserApplyStatus } = state.commonReducer;
    const { userInfo } = state.loginReducer
    const investigationList = union(oldInvestigationList, newInvestigationList)
    return {
        investigationList,
        companyDetail,
        userInfo,
        b2bUserApplyStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getInvestigationDetail: (data) => {
            Api.investgatorDetail(data).then(res => {
                if (res.success) {
                    let dataObject = {};
                    if (res.module) {
                        dataObject = res.module;
                        if (dataObject.coverRange) {
                            dataObject.coverRange = JSON.parse(dataObject.coverRange)
                        } else {
                            dataObject.coverRange = []
                        }
                        if (dataObject.iacRange) {
                            dataObject.iacRange = JSON.parse(dataObject.iacRange)
                        } else {
                            dataObject.iacRange = []
                        }
                        if (dataObject.policeRange) {
                            dataObject.policeRange = JSON.parse(dataObject.policeRange)
                        } else {
                            dataObject.policeRange = []
                        }
                    }
                    dispatch(actionCreator(GET_INVESTIGATION_COMPANY_DETAIL_SUCCESS, { companyDetail: res.module }))
                } else {
                    message.error(res.errorDetail)
                    dispatch(actionCreator(GET_INVESTIGATION_COMPANY_DETAIL_SUCCESS, { companyDetail: {} }))
                }
            })
        },
        updateInvestigationItem: (data, oldList, companyDetail, callback) => {
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
                    dispatch(actionCreator(UPDATE_INVESTIGATION_COMPANY_DETAIL_STATUS_SUCCESS, { newInvestigationList: result }))
                    typeof callback === 'function' && callback()
                    props.history.goBack()
                } else {
                    dispatch(actionCreator(UPDATE_INVESTIGATION_COMPANY_DETAIL_STATUS_ERROR, { oldInvestigationList: oldList }))
                }
            })

        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(InvestigatorCompanyDetail))
