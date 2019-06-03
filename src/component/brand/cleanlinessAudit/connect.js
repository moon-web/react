import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import CleanlinessAudit from './index'
import { actionCreator } from '../../../utils/util'
import Api from '../../../api/index'
import { GET_CHANNEL_LIST_SUCCESS, GET_TRADEMARK_LIST_SUCCESS, GET_REPORT_REASON_LIST_SUCCESS } from '../../../contants/commonTypes'
import { GET_CLEANAUDIT_PROD_LIST_SUCCESS, GET_CLEAN_TYPE_LIST_SUCCESS } from '../../../contants/brand/brandCleanlinessAuditType'
import { UPDATE_CLEAN_STATISTICS_LIST_SUCCESS, GET_BRANDCLEAN_CONFIRMED_COUNT, GET_BRANDCLEAN_DETAILS  } from '../../../contants/brand/cleanStatisticsTypes'
function mapStateToProps(state, props) {
    const { brandList, platfromList, channelList, trademarkList, reportReasonList, trademarkPosition, brandCleanlinessStatus, 
        reportType  } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { newCleanStatisticsList, confirmed, tobeConfirmed, tortNum  } = state.cleanStatisticsReducer;
    const { auditbrandCleanTypeList, auditbrandCleanProdList } = state.cleanStatisticsAuditReducer;
    return {
        brandList,
        channelList,
        platfromList,
        trademarkList,
        reportReasonList,
        trademarkPosition,
        reportType,
        userInfo,
        brandCleanlinessStatus,
        newCleanStatisticsList,
        auditbrandCleanTypeList,
        auditbrandCleanProdList,
        confirmed,
        tobeConfirmed,
        tortNum
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        //获取资源
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
        //更新列表数据
        updateCleanStaticsResultItem: (data, oldCleanStatisticsList, callback) => {
            Api.modifyIsTort(data).then(res => {
                if (res.success) {
                    let newCleanStatisticsList = [];
                    for (let i = 0; i < oldCleanStatisticsList.length; i++) {
                        let element = oldCleanStatisticsList[i];
                        if (element.id == data.id) {
                            element.tortFlag = ''
                            element = Object.assign(element, data)
                        }
                        newCleanStatisticsList.push(element)
                    }
                    dispatch(actionCreator(UPDATE_CLEAN_STATISTICS_LIST_SUCCESS, { newCleanStatisticsList }))
                    typeof callback === 'function' && callback()
                    message.success('审核成功')
                    props.history.goBack()
                } else {
                    message.error(res.msg)
                }
            })
        },
        //获取tab
        getReportTypeList: (data) => {
            Api.sysDictlist(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_CLEAN_TYPE_LIST_SUCCESS, { auditbrandCleanTypeList: res.dataObject }))
                }
            })
        },
        // 获取监控结果审核的分类列表
        getAuditProdList: (data) => {
            Api.prodList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_CLEANAUDIT_PROD_LIST_SUCCESS, { auditbrandCleanProdList: res.dataObject }))
                }
            })
        },
        //验证url
        checkProdUrl: (data, callback) => {
            Api.checkProdUrl(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                    if (res.dataObject === '00') {
                        typeof callback === 'function' && callback()
                    }
                } else {
                    message.error(res.msg)
                }
            })
        },
        //统计已确认待确认
        countCleanConfirm(data) {
            Api.countCleanConfirm(data).then((res)=>{
                if(res.success){
                    dispatch(actionCreator(GET_BRANDCLEAN_CONFIRMED_COUNT, { confirmed: res.dataObject.confNum ? res.dataObject.confNum : 0, tobeConfirmed: res.dataObject.waitNum ? res.dataObject.waitNum : 0 ,tortNum: res.dataObject.tortNum ? res.dataObject.tortNum : 0}))
                }else{
                    dispatch(actionCreator(GET_BRANDCLEAN_CONFIRMED_COUNT, { confirmed: 0, tobeConfirmed: 0, tortNum:0 }))
                }
            })
        },
        //查询统计详情信息
        queryBrandCrawleDetail(data) {
            Api.brandCleanlinessCrawlerDetail(data).then((res)=>{
                if(res.success){
                    dispatch(actionCreator(GET_BRANDCLEAN_DETAILS, { queryBrandCleanDetail: res.module }))
                }else{
                    message.error(res.errorDetail)
                    dispatch(actionCreator(GET_BRANDCLEAN_DETAILS, { queryBrandCleanDetail: {}  }))
                }
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CleanlinessAudit));
