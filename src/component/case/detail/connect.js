import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import CaseDetail from './index'
import { actionCreator } from '../../../utils/util'
import {
    GET_BASIC_DETAIL_SUCCESS,
    GET_CASE_DETAIL_SUCCESS,
    GET_COMPANY_DETAIL_SUCCESS,
    GET_PROCESS_DETAIL_SUCCESS,
    GET_PROD_DETAIL_SUCCESS,
    GET_SUIT_DETAIL_SUCCESS,
    GET_WARN_DETAIL_SUCCESS,
    UPDATE_COMPANY_DETAIL_SUCCESS,
    UPDATE_PROCESS_DETAIL_SUCCESS,
    UPDATE_PROD_DETAIL_SUCCESS,
    GET_CASE_PROD_DETILS_LIST
} from '../../../contants/case/caseDetailTypes'
import { GET_CASE_AUDIT_STATUS_LIST} from '../../../contants/commonTypes'
import Api from '../../../api/index'

function mapStateToProps(state, ownProps) {
    const { userInfo } = state.loginReducer;
    const { permissionList,brandList, casePlatform, prodList, infringementList, typeListCase, typeListComplaint, typeListWran, typecaseList, caseAuditStatus } = state.commonReducer;
    const { basicDetail, caseDetail, companyDetail, processDetail, prodDetail, suitDetail, warnDetail,getProDetails } = state.caseDetailReducer;
    return {
        userInfo,
        brandList,
        casePlatform,
        prodList,
        infringementList,
        typeListCase,
        typeListComplaint,
        typeListWran,
        typecaseList,
        caseAuditStatus,
        basicDetail,
        caseDetail,
        companyDetail,
        processDetail,
        prodDetail,
        suitDetail,
        warnDetail,
        getProDetails,
        permissionList
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getBasicDetail: (data) => {
            Api.lawcaseDetail(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_BASIC_DETAIL_SUCCESS, { basicDetail: res.dataObject }))
                } else {
                    dispatch(actionCreator(GET_BASIC_DETAIL_SUCCESS, { basicDetail: {} }))
                }
            })
        },
        getCaseDetail: (data) => {
            Api.lawcaseCaseDetail(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_CASE_DETAIL_SUCCESS, { caseDetail: res.dataObject }))
                } else {
                    dispatch(actionCreator(GET_CASE_DETAIL_SUCCESS, { caseDetail: {} }))
                }
            })
        },
        updateCaseDetail: (data, callback) => {
            Api.lawcaseModifyCase(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info('编辑失败，请稍后再试！')
                }
            })
        },
        getCompanyDetail: (data) => {
            Api.lawcaseCompanyDetail(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_COMPANY_DETAIL_SUCCESS, { companyDetail: res.dataObject }))
                    
                } else {
                    dispatch(actionCreator(GET_COMPANY_DETAIL_SUCCESS, { companyDetail: [] }))
                }
            })
        },
        updateCompanyDetail: (data, callback) => {
            Api.lawcaseModifyCompany(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(UPDATE_COMPANY_DETAIL_SUCCESS, { companyDetail: data.json }))
                    typeof callback === 'function' && callback()
                } else {
                    message.info('编辑失败，请稍后再试！')
                }
            })
        },
        getProcessDetail: (data) => {
            Api.lawcaseProcessDetail(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_PROCESS_DETAIL_SUCCESS, { processDetail: res.dataObject }))
                } else {
                    dispatch(actionCreator(GET_PROCESS_DETAIL_SUCCESS, { processDetail: {} }))
                }
            })
        },
        updateProcessDetail: (data,callback) => {
            Api.lawcaseModifyProcess(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(UPDATE_PROCESS_DETAIL_SUCCESS, { processDetail: data }))
                    typeof callback === 'function' && callback()
                } else {
                    message.info('编辑失败，请稍后再试！')
                }
            })
        },
        getProdDetail: (data) => {
            Api.lawcaseProdDetail(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_PROD_DETAIL_SUCCESS, { prodDetail: res.dataObject }))
                } else {
                    dispatch(actionCreator(GET_PROD_DETAIL_SUCCESS, { prodDetail: {} }))
                }
            })
        },
        updateProdDetail: (data, callback) => {
            Api.lawcaseModifyProd(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(UPDATE_PROD_DETAIL_SUCCESS, { prodDetail: data.json }))
                    typeof callback === 'function' && callback()
                } else {
                    message.info('编辑失败，请稍后再试！')
                }
            })
        },
        getSuitDetail: (data) => {
            Api.lawcaseSuitDetail(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_SUIT_DETAIL_SUCCESS, { suitDetail: res.dataObject }))
                } else {
                    dispatch(actionCreator(GET_SUIT_DETAIL_SUCCESS, { suitDetail: {} }))
                }
            })
        },
        updateSuitDetail: (data, callback) => {
            Api.lawcaseModifySuit(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info('编辑失败，请稍后再试！')
                }
            })
        },
        getWarnDetail: (data) => {
            Api.lawcaseWarnDetail(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_WARN_DETAIL_SUCCESS, { warnDetail: res.dataObject }))
                } else {
                    dispatch(actionCreator(GET_WARN_DETAIL_SUCCESS, { warnDetail: {} }))
                }
            })
        },
        updateWarnDetail: (data, callback) => {
            Api.lawcaseModifyWarn(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info('编辑失败，请稍后再试！')
                }
            })
        },
        updateClassify: (data, callback) => {
            Api.lawcaseClassfy(data).then(res => {
                if(res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info('归类失败，请稍后再试！')
                }
            })
        },
        caseAudit: (data, callback) =>{
            Api.lawcaseAudit(data).then(res => {
                if(res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info('审核失败，请稍后再试！')
                }
            })
        },
        getAuditType: (data) => {
            Api.sysDictlist(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_CASE_AUDIT_STATUS_LIST, {caseAuditStatus: res.dataObject}))
                }
            })
        },
        getProDetailsList: (data) => {
            Api.getProDetails(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_CASE_PROD_DETILS_LIST, {getProDetails: res.dataObject}))
                }
            })
        },
        getAsyncRefresh: (data) =>{
            Api.getAsyncRefresh(data).then(res => {
                if (res.success===true) {
                    message.success('刷新成功')
                }else{
                    message.warn(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CaseDetail))
