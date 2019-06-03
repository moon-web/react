import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import OfflineCaseDetail from './index'
import { actionCreator, union } from '../../../../utils/util'
import api from '../../../../api/index';
import { GET_OFFLINE_CASE_DETAIL_SUCCESS, GET_OFFLINE_CASE_LOGS_SUCCESS, GET_OFFLINE_CASE_REPORT_SUCCESS, GET_OFFLINE_CASE_PROCESS_DETAIL_SUCCESS, UPDATE_OFFLINE_CASE_PROCESS_DETAIL_SUCCESS } from '../../../../contants/offlineCase/offlineCaseDetailTypes';
import { UPDATE_OFFLINE_LIST_STATUS_SUCCESS, UPDATE_OFFLINE_LIST_STATUS_ERROR } from '../../../../contants/offlineCase/offlineCaseTypes';
import { UPDATE_BRABD_OFFLINE_CASE_SUCCESS, UPDATE_BRABD_OFFLINE_CASE_ERROR } from '../../../../contants/offlineCase/brandOfflineCaseTypes'

function mapStateToProps(state, props) {
    const { brandOffLineCaseStatusList, offlineCaseStatusList } = state.commonReducer;
    const { offlineCaseDetail, logs, offlineCaseReport, processDetail } = state.offlineCaseDetailReducer;
    const { oldOfflineCaseList, newOfflineCaseList } = state.offlineCaseReducer;
    const { oldBrandOfflineCaseList, newBrandOfflineCaseList } = state.brandOfflineCaseReducer;
    const offlineCaseList = union(oldOfflineCaseList, newOfflineCaseList)
    const brandOfflineCaseList = union(oldBrandOfflineCaseList, newBrandOfflineCaseList)
    return {
        logs,
        offlineCaseDetail,
        offlineCaseList,
        brandOfflineCaseList,
        offlineCaseReport,
        brandOffLineCaseStatusList,
        offlineCaseStatusList,
        processDetail
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        //获取详情
        getOfflineCaseDetail: (data, callback) => {
            api.getOfflineCaseDetail(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_OFFLINE_CASE_DETAIL_SUCCESS, { offlineCaseDetail: res.dataObject }))
                    typeof callback === 'function' && callback(res.dataObject.id)
                } else {
                    dispatch(actionCreator(GET_OFFLINE_CASE_DETAIL_SUCCESS, { offlineCaseDetail: {} }))
                    message.info(res.msg)
                }
            })
        },
        // 查询日志
        getLogs: data => {
            api.getOfflineLogList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_OFFLINE_CASE_LOGS_SUCCESS, { logs: res.dataObject }))
                } else {
                    message.info(res.msg)
                }
            })
        },
        //结案
        closeCase: (data, oldOfflineCaseList) => {
            api.closeCase(data).then(res => {
                if (res.success) {
                    message.success('操作成功')
                    let newOfflineCaseList = [];
                    for (let i = 0; i < oldOfflineCaseList.length; i++) {
                        let element = oldOfflineCaseList[i];
                        if (element.id == data.id) {
                            element.status = data.status;
                            element.statusName = data.statusName;
                            element.statusNameEn = data.statusNameEn;
                        }
                        newOfflineCaseList.push(element)
                    }
                    dispatch(actionCreator(UPDATE_OFFLINE_LIST_STATUS_SUCCESS, { newOfflineCaseList }))
                    props.history.goBack()
                } else {
                    dispatch(actionCreator(UPDATE_OFFLINE_LIST_STATUS_ERROR, { oldOfflineCaseList }))
                    message.error(res.msg)
                }
            })
        },
        //推送
        pushBrandCase: (data, oldOfflineCaseList ) =>{
            api.pushBrandCase(data).then(res => {
                if (res.success) {
                    message.success('操作成功')
                    let newOfflineCaseList = [];
                    for (let i = 0; i < oldOfflineCaseList.length; i++) {
                        let element = oldOfflineCaseList[i];
                        if (element.id == data.id) {
                            element.status = data.status;
                            element.statusName = data.statusName;
                            element.statusNameEn = data.statusNameEn;
                        }
                        newOfflineCaseList.push(element)
                    }
                    dispatch(actionCreator( UPDATE_OFFLINE_LIST_STATUS_SUCCESS, { newOfflineCaseList }))
                    props.history.goBack()
               }else{
                    dispatch(actionCreator( UPDATE_OFFLINE_LIST_STATUS_ERROR, { oldOfflineCaseList }))
                   message.error(res.msg)
               }
             })
        },
        //放弃
        giveUpCase: (data, oldOfflineCaseList) => {
            api.giveUpCase(data).then(res => {
                if (res.success) {
                    message.success('操作成功')
                    let newOfflineCaseList = [];
                    for (let i = 0; i < oldOfflineCaseList.length; i++) {
                        let element = oldOfflineCaseList[i];
                        if (element.id == data.id) {
                            element.status = data.status;
                            element.statusName = data.statusName;
                            element.statusNameEn = data.statusNameEn;
                            element.quitReason = data.quitReason;
                        }
                        newOfflineCaseList.push(element)
                    }
                    dispatch(actionCreator(UPDATE_OFFLINE_LIST_STATUS_SUCCESS, { newOfflineCaseList }))
                    props.history.goBack()
                } else {
                    dispatch(actionCreator(UPDATE_OFFLINE_LIST_STATUS_ERROR, { oldOfflineCaseList }))
                    message.error(res.msg)
                }
            })
        },
        //品牌方审核通过或不通过
        brandAuditPass(data, oldBrandOfflineCaseList, callback) {
            api.updateBrandOffline(data).then(res => {
                if (res.success) {
                    message.success('操作成功')
                    let newBrandOfflineCaseList = [];
                    for (let i = 0; i < oldBrandOfflineCaseList.length; i++) {
                        let element = oldBrandOfflineCaseList[i];
                        if (element.id == data.id) {
                            element.status = data.status;
                            element.statusName = data.statusName;
                            element.statusNameEn = data.statusNameEn;
                            element.auditReason = data.auditReason;
                        }
                        newBrandOfflineCaseList.push(element)
                    }
                    dispatch(actionCreator(UPDATE_BRABD_OFFLINE_CASE_SUCCESS, { newBrandOfflineCaseList }))
                    typeof callback === 'function' && callback()
                    props.history.goBack()
                } else {
                    dispatch(actionCreator(UPDATE_BRABD_OFFLINE_CASE_ERROR, { oldBrandOfflineCaseList }))
                    message.error(res.msg)
                }
            })
        },
        // 提交调查结果
        addOfflineReportResult(data, callback) {
            api.saveLawyerCaseReport(data).then(res => {
                if (res.success) {
                    message.success('新增成功')
                    typeof callback === 'function' && callback()
                } else {
                    message.error(res.msg)
                }
            })
        },
        // 提交执行结果
        saveProcessInfo(data, oldProcessDetail, callback) {
            api.saveProcessInfo(data).then(res => {
                if (res.success) {
                    if (data.processType === '3') {
                        oldProcessDetail.lawyerCaseXSActDO = JSON.parse(data.processJson)
                        if (data.saveFlag === 1) {
                            oldProcessDetail.lawyerCaseXSActDO.status = 1;
                        } else {
                            oldProcessDetail.lawyerCaseXSActDO.status = 2;
                        }
                    } else if (data.processType === '4') {
                        oldProcessDetail.lawyerCaseXSArrestDO = JSON.parse(data.processJson)
                        if (data.saveFlag === 1) {
                            oldProcessDetail.lawyerCaseXSArrestDO.status = 1;
                        } else {
                            oldProcessDetail.lawyerCaseXSArrestDO.status = 2;
                        }
                    } else if (data.processType === '5') {
                        oldProcessDetail.lawyerCaseXSJudgmentDO = JSON.parse(data.processJson)
                        if (data.saveFlag === 1) {
                            oldProcessDetail.lawyerCaseXSJudgmentDO.status = 1;
                        } else {
                            oldProcessDetail.lawyerCaseXSJudgmentDO.status = 2;
                        }
                    } else if (data.processType === '6') {
                        oldProcessDetail.lawyerCaseXZActDO = JSON.parse(data.processJson)
                        if (data.saveFlag === 1) {
                            oldProcessDetail.lawyerCaseXZActDO.status = 1;
                        } else {
                            oldProcessDetail.lawyerCaseXZActDO.status = 2;
                        }
                    } else if (data.processType === '7') {
                        oldProcessDetail.lawyerCaseXZPunishDO = JSON.parse(data.processJson)
                        if (data.saveFlag === 1) {
                            oldProcessDetail.lawyerCaseXZPunishDO.status = 1;
                        } else {
                            oldProcessDetail.lawyerCaseXZPunishDO.status = 2;
                        }
                    }
                    typeof callback && callback()
                    message.info('保存成功')
                    dispatch(actionCreator(UPDATE_OFFLINE_CASE_PROCESS_DETAIL_SUCCESS, { processDetail: oldProcessDetail }))
                } else {
                    message.error(res.msg)
                }
            })
        },
        // 查询执行结果
        queryProcessInfo(data, callback) {
            api.queryProcessInfo(data).then(res => {
                if (res.success) {
                    let dataObject = res.dataObject;
                    if (dataObject.lawyerCaseXSActDO) {
                        delete dataObject.lawyerCaseXSActDO.permBrandIdList
                        delete dataObject.lawyerCaseXSActDO.permUserId
                        delete dataObject.lawyerCaseXSActDO.permUserIdList
                        if (dataObject.lawyerCaseXSActDO.actReport) {
                            dataObject.lawyerCaseXSActDO.actReport = JSON.parse(dataObject.lawyerCaseXSActDO.actReport)
                        }
                        if (dataObject.lawyerCaseXSActDO.attachmentList) {
                            dataObject.lawyerCaseXSActDO.attachmentList = JSON.parse(dataObject.lawyerCaseXSActDO.attachmentList)
                        }
                        if (dataObject.lawyerCaseXSActDO.detentionWarrant) {
                            dataObject.lawyerCaseXSActDO.detentionWarrant = JSON.parse(dataObject.lawyerCaseXSActDO.detentionWarrant)
                        }
                        if (dataObject.lawyerCaseXSActDO.onBailNote) {
                            dataObject.lawyerCaseXSActDO.onBailNote = JSON.parse(dataObject.lawyerCaseXSActDO.onBailNote)
                        }
                        if (dataObject.lawyerCaseXSActDO.registerDecision) {
                            dataObject.lawyerCaseXSActDO.registerDecision = JSON.parse(dataObject.lawyerCaseXSActDO.registerDecision)
                        }
                    } else {
                        dataObject.lawyerCaseXSActDO = {
                            actTime: '',
                            lawUnit: '',
                            registerDecision: [],
                            attachmentList: [],
                            detentionWarrant: [],
                            onBailNote: [],
                            actReport: []
                        }
                    }
                    if (dataObject.lawyerCaseXSArrestDO) {
                        delete dataObject.lawyerCaseXSArrestDO.permBrandIdList
                        delete dataObject.lawyerCaseXSArrestDO.permUserId
                        delete dataObject.lawyerCaseXSArrestDO.permUserIdList
                        if (dataObject.lawyerCaseXSArrestDO.arrestNote) {
                            dataObject.lawyerCaseXSArrestDO.arrestNote = JSON.parse(dataObject.lawyerCaseXSArrestDO.arrestNote)
                        }
                    } else {
                        dataObject.lawyerCaseXSArrestDO = {
                            arrestTime: '',
                            arrestNote: []
                        }
                    }
                    if (dataObject.lawyerCaseXSJudgmentDO) {
                        delete dataObject.lawyerCaseXSJudgmentDO.permBrandIdList
                        delete dataObject.lawyerCaseXSJudgmentDO.permUserId
                        delete dataObject.lawyerCaseXSJudgmentDO.permUserIdList
                        if (dataObject.lawyerCaseXSJudgmentDO.judgmentNote) {
                            dataObject.lawyerCaseXSJudgmentDO.judgmentNote = JSON.parse(dataObject.lawyerCaseXSJudgmentDO.judgmentNote)
                        }
                    } else {
                        dataObject.lawyerCaseXSJudgmentDO = {
                            judgmentNote: []
                        }
                    }
                    if (dataObject.lawyerCaseXZActDO) {
                        delete dataObject.lawyerCaseXZActDO.permBrandIdList
                        delete dataObject.lawyerCaseXZActDO.permUserId
                        delete dataObject.lawyerCaseXZActDO.permUserIdList
                        if (dataObject.lawyerCaseXZActDO.attachmentList) {
                            dataObject.lawyerCaseXZActDO.attachmentList = JSON.parse(dataObject.lawyerCaseXZActDO.attachmentList)
                        }
                        if (dataObject.lawyerCaseXZActDO.brandPayBill) {
                            dataObject.lawyerCaseXZActDO.brandPayBill = JSON.parse(dataObject.lawyerCaseXZActDO.brandPayBill)
                        }
                        if (dataObject.lawyerCaseXZActDO.cooprateBill) {
                            dataObject.lawyerCaseXZActDO.cooprateBill = JSON.parse(dataObject.lawyerCaseXZActDO.cooprateBill)
                        }
                    } else {
                        dataObject.lawyerCaseXZActDO = {
                            punishTime: '',
                            attachmentList: [],
                            brandPayFeeFormat: '',
                            brandPayBill: [],
                            cooprateFeeFormat: '',
                            cooprateBill: []
                        }
                    }
                    if (dataObject.lawyerCaseXZPunishDO) {
                        delete dataObject.lawyerCaseXZPunishDO.permBrandIdList
                        delete dataObject.lawyerCaseXZPunishDO.permUserId
                        delete dataObject.lawyerCaseXZPunishDO.permUserIdList
                        if (dataObject.lawyerCaseXZPunishDO.punishNote) {
                            dataObject.lawyerCaseXZPunishDO.punishNote = JSON.parse(dataObject.lawyerCaseXZPunishDO.punishNote)
                        }
                        if (dataObject.lawyerCaseXZPunishDO.brandPayBill) {
                            dataObject.lawyerCaseXZPunishDO.brandPayBill = JSON.parse(dataObject.lawyerCaseXZPunishDO.brandPayBill)
                        }
                        if (dataObject.lawyerCaseXZPunishDO.cooprateBill) {
                            dataObject.lawyerCaseXZPunishDO.cooprateBill = JSON.parse(dataObject.lawyerCaseXZPunishDO.cooprateBill)
                        }
                    } else {
                        dataObject.lawyerCaseXZPunishDO = {
                            punishTime: '',
                            punishNote: [],
                            brandPayFeeFormat: '',
                            brandPayBill: [],
                            cooprateFeeFormat: '',
                            cooprateBill: []
                        }
                    }
                    dispatch(actionCreator(GET_OFFLINE_CASE_PROCESS_DETAIL_SUCCESS, { processDetail: dataObject }))
                } else {
                    message.error(res.msg)
                }
            })
        },
        // 查询调查结果
        queryLawyerCaseReport(data, callback) {
            api.queryLawyerCaseReport(data).then(res => {
                if (res.success) {
                    let result = []
                    if(res.module){
                        for (let i = 0; i < res.module.length; i++) {
                            let element = res.module[i];
                            if (element.fileUrl) {
                                element.fileUrl = JSON.parse(element.fileUrl)
                            } else {
                                element.fileUrl = []
                            }
                            result.push(element)
                        }
                    }
                    dispatch(actionCreator(GET_OFFLINE_CASE_REPORT_SUCCESS, { offlineCaseReport: result }))
                } else {
                    message.error(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OfflineCaseDetail))
