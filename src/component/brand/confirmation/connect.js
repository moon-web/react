import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import BrandConfirmation from './index'
import { GET_BRAND_CONFIRMATION_LIST_SUCCESS, UPDATE_BRAND_CONFIRMATION_SUCCESS, UPDATE_BRAND_CONFIRMATION_ERROR } from '../../../contants/brand/brandConfirmationTypes'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { message } from 'antd';
import { GET_REPORT_REASON_QUERY_LIST_SUCCESS, GET_TRADEMARK_QUERY_LIST_SUCCESS, GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes';

function mapStateToProps(state, props) {
    const { brandList, platfromList, permissionList, confirmationStatus, reportConfirmationStatus, reportType, reportReasonQueryList, tardemarkQueryList, prodList, exportExcelTitle } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch, oldBrandConfirmationList, newBrandConfirmationList, pageNo, total = 0 } = state.brandConfirmationReducer;
    const brandConfirmationList = union(oldBrandConfirmationList, newBrandConfirmationList)
    return {
        brandConfirmationList,
        isFetch,
        pageNo,
        total,
        userInfo,
        brandList,
        platfromList,
        permissionList,
        confirmationStatus,
        reportConfirmationStatus,
        reportType,
        reportReasonQueryList, 
        tardemarkQueryList, 
        prodList,
        exportExcelTitle
    }
}
function mapDispatchToProps(dispatch, props) {
    return {
        getConfirmationList: (data, oldBrandConfirmationList) => {
            dispatch(actionCreator(GET_BRAND_CONFIRMATION_LIST_SUCCESS, { isFetch: true }))
            Api.brandConfirmation(data).then(res => {
                if (res.success) {
                    for (let i = 0; i < res.result.length; i++) {
                        const element = res.result[i];
                        if(element.refChannelName && /(\([\s\S]*?\))|(（[\s\S]*?）)$/.test(element.refChannelName) && element.reportType === 1) {
                            let result = element.refChannelName.match(/(\([\s\S]*?\))|(（[\s\S]*?）)$/)[0];
                            element.refChannelUrl = result.replace(/(\(|\)|（|）|\s)/g, '')
                            element.refChannelName = element.refChannelName.substring(0,element.refChannelName.search(/(\(|（)/))
                        }
                        element.refChannelUrl = element.refChannelUrl.replace(/\s/g,'');
                        if(element.refChannelUrl && !(/^(https|http):\/\//.test(element.refChannelUrl))) {
                            element.refChannelUrl = 'http://' + element.refChannelUrl;
                        }
                    }
                }
                dispatch(actionCreator(GET_BRAND_CONFIRMATION_LIST_SUCCESS, { oldBrandConfirmationList, newBrandConfirmationList: res.result || [], total: res.records || 0, pageNo: data.pageNo, isFetch: false }))
            })
        },
        confirmExamin: (data, oldBrandConfirmationList, callback, callback2) => {
            Api.confirmExamin(data).then(res => {
                let reload = false;
                if (res.success) {
                    let newBrandConfirmationList = [];
                    if (data.itemAudit) {
                        // 单条审核
                        if (res.dataObject !== 0) {
                            for (let i = 0; i < oldBrandConfirmationList.length; i++) {
                                const element = oldBrandConfirmationList[i];
                                if (data.itemAudit.id == element.id) {
                                    element.auditStatus = data.auditStatusAfter;
                                    element.confirmReason = data.auditReason;
                                    element.auditStatusName = data.auditStatusName;
                                    element.auditStatusNameEn = data.auditStatusNameEn;
                                    element.gmtConfirm = data.gmtConfirm;
                                    element.gmtConfirm = data.SendTime
                                }
                                newBrandConfirmationList.push(element)
                            }
                            dispatch(actionCreator(UPDATE_BRAND_CONFIRMATION_SUCCESS, { newBrandConfirmationList }))
                            message.info('审核成功')
                        } else {
                            message.info('审核失败')
                        }
                    } else {
                        // 多选
                        if (data.chooseCount === res.dataObject && oldBrandConfirmationList.length && data.selectedRowKeys.length) {
                            for (let i = 0; i < oldBrandConfirmationList.length; i++) {
                                const oldItem = oldBrandConfirmationList[i];
                                for (let j = 0; j < data.selectedRowKeys.length; j++) {
                                    const element = data.selectedRowKeys[j];
                                    if (element == oldItem.id) {
                                        oldItem.auditStatus = data.auditStatusAfter;
                                        oldItem.confirmReason = data.auditReason;
                                        oldItem.auditStatusName = data.auditStatusName
                                        oldItem.auditStatusNameEn = data.auditStatusNameEn
                                    }
                                }
                                newBrandConfirmationList.push(oldItem)
                            }
                            dispatch(actionCreator(UPDATE_BRAND_CONFIRMATION_SUCCESS, { newBrandConfirmationList }))
                            reload = false;
                        } else {
                            reload = true;
                        }
                        message.info(`共${data.chooseCount}条数据，成功处理${res.dataObject}条，${data.chooseCount - res.dataObject + '条失败'}`)
                    }
                } else {
                    dispatch(actionCreator(UPDATE_BRAND_CONFIRMATION_ERROR, { oldBrandConfirmationList }))
                    reload = false;
                    message.info(res.msg)
                }
                typeof callback === 'function' && callback(reload)
            })
        },
        saveExcelData: (data) => {
            Api.createExportExcel(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.error(res.msg)
                }
            })
        },
        saveExportData: (data) => {
            Api.confirmationExport(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.error(res.msg)
                }
            })
        },
        
        getConfirmCount: (data, callback) => {
            Api.confirmCount(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback(res)
                }
            })
        },
        getReportReasonQueryList: data => {
            Api.getReportReasonQueryList(data).then(res => {
                dispatch(actionCreator(GET_REPORT_REASON_QUERY_LIST_SUCCESS, { reportReasonQueryList: res.dataObject }))
            })
        },
        getTrademarkQueryList: data => {
            Api.getTrademarkQueryList(data).then(res => {
                dispatch(actionCreator(GET_TRADEMARK_QUERY_LIST_SUCCESS, { tardemarkQueryList: res.dataObject }))
            })
        },
        getExportExcelTitle: data => {
            Api.queryExcelTitle(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_EXPORT_EXCEL_TITLE_SUCCESS, { exportExcelTitle: res.dataObject }))
                } else {
                    dispatch(actionCreator(GET_EXPORT_EXCEL_TITLE_SUCCESS, { exportExcelTitle: [] }))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BrandConfirmation))
