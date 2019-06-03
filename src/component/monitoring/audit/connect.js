import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import ResultAudit from './index'
import { actionCreator } from '../../../utils/util'
import Api from '../../../api/index'
import { UPDATE_MONITOR_RESULT_STATUS_SUCCESS, GET_AUDIT_PROD_LIST_SUCCESS, GET_REPORT_TYPE_LIST_SUCCESS, GET_PROD_URL_LIST_SUCCESS } from '../../../contants/monitoring/monitorResultListTypes'
import { GET_CHANNEL_LIST_SUCCESS, GET_TRADEMARK_LIST_SUCCESS, GET_REPORT_REASON_LIST_SUCCESS } from '../../../contants/commonTypes'

function mapStateToProps(state, ownProps) {
    const { brandList, platfromList, channelList, trademarkList, reportReasonList, trademarkPosition, monitorResultAuditStatus, reportType } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { newMonitorResultList, auditProdList, auditreportTypeList = [], prodUrlList = [] } = state.monitorResultListReducer;
    return {
        brandList,
        platfromList,
        auditProdList,
        channelList,
        trademarkList,
        reportReasonList,
        trademarkPosition,
        newMonitorResultList,
        userInfo,
        monitorResultAuditStatus,
        reportType,
        auditreportTypeList,
        prodUrlList
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        getVrResourcesList: data => {
            Api.vrResourcesList(data).then(res => {
                if (data.type === 1) {
                    if (res.success) {
                        for (let i = 0; i < res.dataObject.length; i++) {
                            const element = res.dataObject[i];
                            if(element.vrLabel && /(\([\s\S]*?\))|(（[\s\S]*?）)$/.test(element.vrLabel)) {
                                let result = element.vrLabel.match(/(\([\s\S]*?\))|(（[\s\S]*?）)$/)[0];
                                element.vrResource = result.replace(/(\(|\)|（|）|\s)/g, '')
                                element.vrLabel = element.vrLabel.substring(0,element.vrLabel.search(/(\(|（)/))
                            }
                            element.vrResource = element.vrResource.replace(/\s/g,'');
                            if(element.vrResource && !(/^(https|http):\/\//.test(element.vrResource)) && data.relationType === 1) {
                                element.vrResource = 'http://' + element.vrResource;
                            }
                        }
                        dispatch(actionCreator(GET_CHANNEL_LIST_SUCCESS, { channelList: res.dataObject }))
                    } else {
                        dispatch(actionCreator(GET_CHANNEL_LIST_SUCCESS, { channelList: [] }))
                    }
                } else if (data.type === 2) {
                    if (res.success) {
                        let data1 = [], data2 = [];
                        for (let i = 0; i < res.dataObject.length; i++) {
                            const element = res.dataObject[i];
                            if (element.vrResource) {
                                data2.push(element)
                            } else {
                                data1.push(element)
                            }
                        }
                        dispatch(actionCreator(GET_TRADEMARK_LIST_SUCCESS, { trademarkList: data1.concat(data2) }))
                    } else {
                        dispatch(actionCreator(GET_TRADEMARK_LIST_SUCCESS, { trademarkList: [] }))
                    }
                } else if (data.type === 3) {
                    if (res.success) {
                        let arr1 = [], arr2 = [];
                        for (let i = 0; i < res.dataObject.length; i++) {
                            const element = res.dataObject[i];
                            if (element.vrResource) {
                                arr2.push(element)
                            } else {
                                arr1.push(element)
                            }
                        }
                        dispatch(actionCreator(GET_REPORT_REASON_LIST_SUCCESS, { reportReasonList: arr1.concat(arr2) }))
                    } else {
                        dispatch(actionCreator(GET_REPORT_REASON_LIST_SUCCESS, { reportReasonList: [] }))
                    }
                }
            })
        },
        // 更新列表数据
        updateMonitorResultItem: (data, oldMonitorResultList) => {
            Api.monitorlistCheck(data).then(res => {
                if (res.success) {
                    let newMonitorResultList = [];
                    for (let i = 0; i < oldMonitorResultList.length; i++) {
                        let element = oldMonitorResultList[i];
                        if (element.id == data.id) {
                            element = Object.assign(element, data)
                        }
                        newMonitorResultList.push(element)
                    }
                    dispatch(actionCreator(UPDATE_MONITOR_RESULT_STATUS_SUCCESS, { newMonitorResultList }))
                    ownProps.history.goBack()
                } else {
                    message.info(res.msg)
                }
            })
        },
        updateMonitorResultList: (data, oldList, callback) => {
            Api.monitorListAuditByList(data).then(res => {
                if (res.success) {
                    let result = [];
                    if (data.idList) {
                        if (oldList.length) {
                            for (let i = 0; i < oldList.length; i++) {
                                let element = oldList[i];
                                for (let j = 0; j < data.idList.length; j++) {
                                    if (element.id == data.idList[j]) {
                                        element = Object.assign({}, element, data)
                                    }
                                }
                                result.push(element);
                            }
                        }
                        dispatch(actionCreator(UPDATE_MONITOR_RESULT_STATUS_SUCCESS, { newMonitorResultList: result }));
                        ownProps.history.goBack();
                    } else {
                        dispatch(actionCreator(UPDATE_MONITOR_RESULT_STATUS_SUCCESS, { newMonitorResultList: [] }));
                        ownProps.history.goBack()
                    }
                    message.success(`成功处理${res.dataObject}条`)
                } else {
                    message.info(res.msg)
                }
            })
        },
        getReportTypeList: (data) => {
            Api.sysDictlist(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_REPORT_TYPE_LIST_SUCCESS, { auditreportTypeList: res.dataObject }))
                }
            })
        },
        // 获取监控结果审核的分类列表
        getAuditProdList: (data) => {
            Api.prodList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_AUDIT_PROD_LIST_SUCCESS, { auditProdList: res.dataObject }))
                }
            })
        },
        checkProdUrl: (data, callback) => {
            Api.checkProdUrl(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                    if (res.dataObject === '00') {
                        typeof callback === 'function' && callback()
                    }
                } else {
                    message.info(res.msg)
                }
            })
        },
        getProdUrlList: data => {
            Api.getProdUrlList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_PROD_URL_LIST_SUCCESS, { prodUrlList: res.dataObject }))
                } else {
                    message.info(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ResultAudit))
