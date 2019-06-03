import { connect } from 'react-redux'
import LawsuitsDetail from './index'
import { actionCreator, union, getName } from '../../../../utils/util'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import api from '../../../../api/index';
import { GET_LAW_SUIT_DETAIL_SUCCESS, GET_DEFENDANT_INFO_SUCCESS, GET_LAW_SUIT_PROCESS_SUCCESS, GET_LAW_SUIT_LOGS_SUCCESS } from '../../../../contants/litigation/lawsuitDetailTypes';
import { UPDATE_BRAND_LITIGATION_ALLOT_LIST_ERROR, UPDATE_BRAND_LITIGATION_ALLOT_LIST_SUCCESS } from '../../../../contants/litigation/litigationTypes'
function mapStateToProps(state, props) {
    const { threadMainBodyType=[], litigationCloseCaseWay=[], litigationDocumentType=[], litigationAttributes=[], ligiationStatus = [] } = state.commonReducer
    const { parties, process, logs, suitCaseDetail, cooperativeLawyerList = [], minPageNo, minToltal } = state.lawsuitDetailReducer;
    const { oldBrandLigiationList, newBrandLigiationList } = state.brandLitigationReducer
    const brandLigitaionList = union(oldBrandLigiationList, newBrandLigiationList)
    let result = JSON.stringify(process);
    return {
        brandLigitaionList,
        parties,
        process: JSON.parse(result),
        logs,
        suitCaseDetail,
        cooperativeLawyerList,
        minPageNo,
        minToltal,
        threadMainBodyType,
        litigationCloseCaseWay,
        litigationDocumentType,
        litigationAttributes,
        ligiationStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getSuitCaseDetail: (data, callback) => {
            api.getSuitDetail(data).then(res => {
                if (res.success) {
                    let dataObject = res.dataObject
                    if(dataObject.lawyerClueInfoDO.fileUrl){
                        dataObject.lawyerClueInfoDO.fileUrl = JSON.parse(dataObject.lawyerClueInfoDO.fileUrl)
                    }
                    dispatch(actionCreator(GET_LAW_SUIT_DETAIL_SUCCESS, { suitCaseDetail: dataObject }))
                    typeof callback === 'function' && callback(dataObject)
                } else {
                    dispatch(actionCreator(GET_LAW_SUIT_DETAIL_SUCCESS, { suitCaseDetail: {} }))
                    message.info(res.msg)
                }
            })
        },
        //品牌方诉讼案件审核
        modifyBrandSuitList: (data, oldBrandLigitaionList, callback) => {
            api.modifyBrandSuitList(data).then(res => {
                if(res.success) {
                    let newBrandLigiationList = [];
                    if (oldBrandLigitaionList.length) {
                        for (let i = 0; i < oldBrandLigitaionList.length; i++) {
                            let element = oldBrandLigitaionList[i];
                            if (element.id == data.id) {
                                element.status = data.status;
                                element.statusName = data.statusName;
                                element.statusNameEn = data.statusNameEn;
                                if(data.reason) {
                                    element.auditReason = data.reason
                                }
                            }
                            newBrandLigiationList.push(element);
                        }
                    }
                    dispatch(actionCreator(UPDATE_BRAND_LITIGATION_ALLOT_LIST_SUCCESS, { newBrandLigiationList }))
                    typeof callback === 'function' && callback()
                    props.history.goBack()
                } else {
                    message.error(res.msg)
                    dispatch(actionCreator(UPDATE_BRAND_LITIGATION_ALLOT_LIST_ERROR, { oldBrandLigitaionList }))
                }
            })
        },
        // 查询对方当事人信息
        getDefendantInfo: (data, callback) => {
            api.getDefendantInfo(data).then(res => {
                let result = [];
                if (res.success) {
                    if(res.module){
                        for (let i = 0; i < res.module.length; i++) {
                            let element = res.module[i];
                            element.edit = false;
                            element.level3 = [];
                            if (element.province || element.city || element.area) {
                                element.level3 = [element.province, element.city, element.area];
                            }
                            if (!element.companyJson) {
                                element.companyJson = {     // 公司信息
                                    companyName: '',        // 企业名称
                                    companyLevel3: [],      // 三级省市区
                                    companyProvince: '',    // 省
                                    companyCity: '',        // 市
                                    companyArea: '',        // 区
                                    companyAddress: '',     // 详细地址
                                    companyOnlineAddress: '',// 公司网址
                                    companyMobile: '',      // 公司电话
                                    companyEmail: '',       // 公司邮箱
                                    companyRemark: '',      // 备注
                                    registerFee: '',        // 注册资金
                                    busyLicenseNumber: '',  // 营业执照号
                                    registerTime: ''        // 注册时间
                                };
                            } else {
                                element.companyJson = JSON.parse(element.companyJson)
                            }
                            if (element.contactJson) {
                                element.contactJson = JSON.parse(element.contactJson)
                            } else {
                                element.contactJson = []
                            }
                            result.push(element)
                        }
                    }
                } else {
                    message.info(res.msg)
                }
                dispatch(actionCreator(GET_DEFENDANT_INFO_SUCCESS, { parties: result }))
            })
        },
        
        // 查询进度
        getProcessInfo: data => {
            api.getProcessInfo(data).then(res => {
                if (res.success) {
                    let dataObject = res.dataObject;
                    if (dataObject.lawyerObtainEvidenceDOList.length) {
                        for (let i = 0; i < dataObject.lawyerObtainEvidenceDOList.length; i++) {
                            const element = dataObject.lawyerObtainEvidenceDOList[i];
                            if (element.notarizationStr) {
                                element.notarizationStr = JSON.parse(element.notarizationStr)
                            }
                            if (element.notarizationInvoice) {
                                element.notarizationInvoice = JSON.parse(element.notarizationInvoice)
                            }
                            if (element.annexUrl) {
                                element.annexUrl = JSON.parse(element.annexUrl)
                            }
                            delete element.permUserId;
                            delete element.permUserIdList;
                            delete element.permBrandIdList;
                        }
                    }
                    if (dataObject.lawyerSuitCaseDO) {
                        delete dataObject.lawyerSuitCaseDO.permUserId;
                        delete dataObject.lawyerSuitCaseDO.permUserIdList;
                        delete dataObject.lawyerSuitCaseDO.permBrandIdList;
                        if (dataObject.lawyerSuitCaseDO.authCertificate) {
                            dataObject.lawyerSuitCaseDO.authCertificate = JSON.parse(dataObject.lawyerSuitCaseDO.authCertificate)
                        }
                        if (dataObject.lawyerSuitCaseDO.evidenceIndex) {
                            dataObject.lawyerSuitCaseDO.evidenceIndex = JSON.parse(dataObject.lawyerSuitCaseDO.evidenceIndex)
                        }
                        if (dataObject.lawyerSuitCaseDO.suitText) {
                            dataObject.lawyerSuitCaseDO.suitText = JSON.parse(dataObject.lawyerSuitCaseDO.suitText)
                        }
                        if (dataObject.lawyerSuitCaseDO.annexUrl) {
                            dataObject.lawyerSuitCaseDO.annexUrl = JSON.parse(dataObject.lawyerSuitCaseDO.annexUrl)
                        }
                    }
                    if (dataObject.lawyerRegisterDO) {
                        delete dataObject.lawyerRegisterDO.permUserId;
                        delete dataObject.lawyerRegisterDO.permUserIdList;
                        delete dataObject.lawyerRegisterDO.permBrandIdList;
                        if (dataObject.lawyerRegisterDO.registerNotice) {
                            dataObject.lawyerRegisterDO.registerNotice = JSON.parse(dataObject.lawyerRegisterDO.registerNotice)
                        }
                        if (dataObject.lawyerRegisterDO.summitFeeNotice) {
                            dataObject.lawyerRegisterDO.summitFeeNotice = JSON.parse(dataObject.lawyerRegisterDO.summitFeeNotice)
                        }
                        if (dataObject.lawyerRegisterDO.annexUrl) {
                            dataObject.lawyerRegisterDO.annexUrl = JSON.parse(dataObject.lawyerRegisterDO.annexUrl)
                        }
                    }

                    if (dataObject.lawyerBeforeCourtDO) {
                        delete dataObject.lawyerBeforeCourtDO.permUserId;
                        delete dataObject.lawyerBeforeCourtDO.permUserIdList;
                        delete dataObject.lawyerBeforeCourtDO.permBrandIdList;
                        if (dataObject.lawyerBeforeCourtDO.citation) {
                            dataObject.lawyerBeforeCourtDO.citation = JSON.parse(dataObject.lawyerBeforeCourtDO.citation)
                        }
                        if (dataObject.lawyerBeforeCourtDO.statement) {
                            dataObject.lawyerBeforeCourtDO.statement = JSON.parse(dataObject.lawyerBeforeCourtDO.statement)
                        }
                        if (dataObject.lawyerBeforeCourtDO.annexUrl) {
                            dataObject.lawyerBeforeCourtDO.annexUrl = JSON.parse(dataObject.lawyerBeforeCourtDO.annexUrl)
                        }
                    }
                    if (dataObject.lawyerOnCourtDO) {
                        delete dataObject.lawyerOnCourtDO.permUserId;
                        delete dataObject.lawyerOnCourtDO.permUserIdList;
                        delete dataObject.lawyerOnCourtDO.permBrandIdList;
                        if (dataObject.lawyerOnCourtDO.annexUrl) {
                            dataObject.lawyerOnCourtDO.annexUrl = JSON.parse(dataObject.lawyerOnCourtDO.annexUrl)
                        }
                    }
                    if (dataObject.lawyerJudgmentDO) {
                        delete dataObject.lawyerJudgmentDO.permUserId;
                        delete dataObject.lawyerJudgmentDO.permUserIdList;
                        delete dataObject.lawyerJudgmentDO.permBrandIdList;
                        if (dataObject.lawyerJudgmentDO.judgmentText) {
                            dataObject.lawyerJudgmentDO.judgmentText = JSON.parse(dataObject.lawyerJudgmentDO.judgmentText)
                        }
                        if (dataObject.lawyerJudgmentDO.annexUrl) {
                            dataObject.lawyerJudgmentDO.annexUrl = JSON.parse(dataObject.lawyerJudgmentDO.annexUrl)
                        }
                    }
                    if (dataObject.lawyerCloseCaseDO) {
                        delete dataObject.lawyerCloseCaseDO.permUserId;
                        delete dataObject.lawyerCloseCaseDO.permUserIdList;
                        delete dataObject.lawyerCloseCaseDO.permBrandIdList;
                        if (dataObject.lawyerCloseCaseDO.closeCaseText) {
                            dataObject.lawyerCloseCaseDO.closeCaseText = JSON.parse(dataObject.lawyerCloseCaseDO.closeCaseText)
                        }
                    }
                    dispatch(actionCreator(GET_LAW_SUIT_PROCESS_SUCCESS, { process: dataObject }))
                } else {
                    message.info(res.msg)
                }
            })
        },
        // 查询日志
        getLogs: data => {
            api.queryLogs(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_LAW_SUIT_LOGS_SUCCESS, { logs: res.dataObject }))
                } else {
                    message.info(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LawsuitsDetail))
