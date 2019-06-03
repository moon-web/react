import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import ReportAudit from './index'
import { actionCreator } from '../../../utils/util'
import Api from '../../../api/index'
import { GET_REPORT_DETAIL_BYID } from '../../../contants/report/volunteerReportTypes'
import { UPDATE_REPORT_STATUS_SUCCESS, UPDATE_REPORT_BASE_LIST_SUCCESS } from '../../../contants/report/volunteerReportTypes'
import { GET_RESOURCE_PROD_LIST_SUCCESS } from '../../../contants/system/resourceListTypes'

import { GET_CHANNEL_LIST_SUCCESS, GET_TRADEMARK_LIST_SUCCESS, GET_REPORT_REASON_LIST_SUCCESS } from '../../../contants/commonTypes'

function mapStateToProps(state, ownProps) {
    const { brandList, platfromList, prodList, channelList, trademarkList, reportReasonList, trademarkPosition, reportType, reportConfirmationStatus } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { reportDetail, resourceProdList } = state.volunteerReportDetailReducer;
    const { newReportList } = state.volunteerReportReducer
    const { newReportBaseList } = state.volunteerReportBaseReducer
    return {
        brandList,
        platfromList,
        prodList,
        channelList,
        trademarkList,
        reportReasonList,
        trademarkPosition,
        userInfo,
        reportType,
        reportDetail,
        reportConfirmationStatus,
        newReportList,
        resourceProdList,
        newReportBaseList
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        //获取详情
        queryVReportDetailById: (data, callback) => {
            Api.queryVReportDetailById(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_REPORT_DETAIL_BYID, { reportDetail: res.dataObject }))
                    typeof callback === 'function' && callback()
                }
            })
        },
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
        modifyVReportDetailById: (data, oldReportList, oldReportBaseList, callback) => {
            Api.modifyVReportDetailById(data).then(res => {
                if (res.success) {
                    let newReportList = [];
                    if(oldReportList){
                        for (let i = 0; i < oldReportList.length; i++) {
                            let element = oldReportList[i];
                            if (element.id == data.id) {
                                element = Object.assign({},element,data)                          
                            }
                            newReportList.push(element)
                        }
                        dispatch(actionCreator(UPDATE_REPORT_STATUS_SUCCESS, { newReportList: newReportList }))
                    }
                    let newReportBaseList = [];
                    if(oldReportBaseList){
                        for (let i = 0; i < oldReportBaseList.length; i++) {
                            let element = oldReportBaseList[i];
                            if (element.id == data.id) {
                                element = Object.assign({},element,data)                          
                            }
                            newReportBaseList.push(element)
                        }
                        dispatch(actionCreator(UPDATE_REPORT_BASE_LIST_SUCCESS, { newReportBaseList: newReportBaseList }))
                    }
                    ownProps.history.goBack()
                }else {
                    message.info(res.msg)
                }
            })
        },        
        //根据品牌获取侵权类目        
        getAuditProdList: (data) => {
            Api.prodList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_RESOURCE_PROD_LIST_SUCCESS, { resourceProdList: res.dataObject }))
                }
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ReportAudit))
