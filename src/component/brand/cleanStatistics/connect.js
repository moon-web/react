import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import CleanStatistics from './index'
import { message } from 'antd'
import { GET_CLEAN_STATISTICS_LIST_SUCCESS, GET_CLEAN_STATISTICS_LIST_ERROR, GET_BRANDCLEAN_PENDING_COUNT,
        UPDATE_CLEAN_STATISTICS_LIST_SUCCESS, UPDATE_CLEAN_STATISTICS_LIST_ERROR, GET_BRANDCLEAN_VOLUNTEER_LIST_SUCCESS, 
        GET_BRANDCLEAN_VOLUNTEER_LIST_ERROR, GET_BRANDCLEAN_CONFIRMED_COUNT, GET_BRANDCLEAN_DETAILS
      } from '../../../contants/brand/cleanStatisticsTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes';
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'

function mapStateToProps(state, ownProps) {
    const { permissionList, brandCleanlinessStatus, exportExcelTitle } = state.commonReducer;
    const { isFetch, pageNo, total, oldCleanStatisticsList, newCleanStatisticsList, brandCleanVolunteerList, barndCleanTotal, searchFetch,
        confirmed, tobeConfirmed, tortNum, searchData, queryBrandCleanDetail } = state.cleanStatisticsReducer;
    const cleanStatisticsList = union(oldCleanStatisticsList, newCleanStatisticsList);
    return {
        isFetch,
        pageNo,
        total,
        searchData,
        cleanStatisticsList,
        permissionList,
        brandCleanlinessStatus,
        brandCleanVolunteerList,
        barndCleanTotal,
        searchFetch,
        confirmed,
        tobeConfirmed,
        tortNum,
        queryBrandCleanDetail,
        exportExcelTitle
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        //获取列表
        getCleanStatisticsList: (data, oldList, callback) => {
            dispatch(actionCreator(GET_CLEAN_STATISTICS_LIST_SUCCESS, { isFetch: true }))
            Api.getCleanLIst(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_CLEAN_STATISTICS_LIST_SUCCESS,
                        {
                            oldCleanStatisticsList: oldList,
                            newCleanStatisticsList: res.result === '' ? [] :  res.result,
                            pageNo: data.pageNo,
                            total: res.records,
                            isFetch: false,
                            searchData:data
                        }
                    ))
                    typeof callback === 'function' && callback()
                } else {
                    message.error(res.msg)
                    dispatch(actionCreator(GET_CLEAN_STATISTICS_LIST_ERROR,
                        {
                            newCleanStatisticsList: oldList,
                            pageNo: data.pageNo,
                            isFetch: false,
                            searchData:data
                        }
                    ))
                }
            })
        },
        // 获取志愿者数据
        getVolunteerList: (data) => {
            if (!data || !data.nameOrMobile) {
                dispatch(actionCreator(GET_BRANDCLEAN_VOLUNTEER_LIST_ERROR, { brandCleanVolunteerList: [] }))
            } else {
                Api.queryVolunterrList(data).then(res => {
                    if (res.success) {
                        dispatch(actionCreator(GET_BRANDCLEAN_VOLUNTEER_LIST_SUCCESS, { brandCleanVolunteerList: res.dataObject }))
                    } else {
                        dispatch(actionCreator(GET_BRANDCLEAN_VOLUNTEER_LIST_ERROR, { brandCleanVolunteerList: [] }))
                        message.error(res.msg)
                    }
                })
            }
        },
        // 查找待分配的数量
        queryBrandCleanPendingCount: (data) => {
            dispatch(actionCreator(GET_BRANDCLEAN_PENDING_COUNT, { searchFetch: true }))
            Api.getAllocatedCount(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_BRANDCLEAN_PENDING_COUNT, { barndCleanTotal: res.dataObject, searchFetch: false }))
                } else {
                    dispatch(actionCreator(GET_BRANDCLEAN_PENDING_COUNT, { barndCleanTotal: 0, searchFetch: false }))
                    message.error(res.msg)
                }
            })
        },
        // 分配任务
        distributeBrandClean: (data, callback) => {
            Api.cleanLIstDistribution(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                    message.success('分配任务成功！')
                } else {
                    message.error(res.msg)
                }
            })
        },
        //取消分配任务
        cancellationDistribution: (data, oldCleanStatisticsList) => {
            Api.cancellationDistribution(data).then(res => {
                if (res.success) {
                    let newCleanStatisticsList = [];
                    for (let i = 0; i < oldCleanStatisticsList.length; i++) {
                        const element = oldCleanStatisticsList[i];
                        if (element.id == data.id) {
                            element.detailStatus = data.detailStatus;
                            element.detailStatusName = data.detailStatusName;
                            element.detailStatusNameEn = data.detailStatusNameEn;
                            element.tortFlag = 1
                            element.allotFlag = 1
                        }
                        newCleanStatisticsList.push(element)
                    }
                    message.success('取消分配任务成功！')
                    dispatch(actionCreator(UPDATE_CLEAN_STATISTICS_LIST_SUCCESS, { newCleanStatisticsList }))
                } else {
                    message.error(res.msg)
                    dispatch(actionCreator(UPDATE_CLEAN_STATISTICS_LIST_ERROR, { oldCleanStatisticsList }))
                }
            })
        },
        //洁净度确认按钮
        cleanConfirm(data, callback) {
            Api.cleanConfirm(data).then(res =>{
                if(res.success){
                    typeof callback === 'function' && callback()
                }else{
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
        //不侵权审核
        updateDistributionStatus: (data, oldList, callback) => {
            Api.modifyIsTort(data).then(res => {
                if (res.success) {
                    let result = [];
                    if (oldList.length) {
                        for (let i = 0; i < oldList.length; i++) {
                            let element = oldList[i];
                            if (element.id === data.id) {
                                element.detailStatus = data.detailStatus;
                                element.detailStatusName = data.detailStatusName;
                                element.detailStatusNameEn = data.detailStatusNameEn;
                                element.remark = data.remark;
                                element.tortFlag = ''
                            }
                            result.push(element);
                        }
                    }
                    dispatch(actionCreator(UPDATE_CLEAN_STATISTICS_LIST_SUCCESS, { newCleanStatisticsList: result }))
                    typeof callback === 'function' && callback()
                    message.success('审核成功')
                } else {
                    message.error(res.msg)
                    dispatch(actionCreator(UPDATE_CLEAN_STATISTICS_LIST_ERROR, { oldCleanStatisticsList: oldList }))
                }
            })
        },
        //导出
        saveExcelData: (data) => {
            Api.createExportExcel(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.error(res.msg)
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CleanStatistics))
