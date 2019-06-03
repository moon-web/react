import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Dictonary from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_DICTONARY_LIST_SUCCESS, GET_DICTONARY_TYPE_DATA, UPDATE_DICTONARY_LIST_SUCCESS, UPDATE_DICTONARY_LIST_ERROR } from '../../../contants/system/dictonaryListTypes'
import { GET_SYSTEM_DICTONARY_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'
import { message } from 'antd'
function mapStateToProps(state, props) {
    // 属性 
    const { isFetch, oldDictionaryList, newDictionaryList, searchData, pageNo, pageSize = 10, total, dictonaryType = [] } = state.dictonaryReducer;
    const dictonaryList = union(oldDictionaryList, newDictionaryList)
    const { permissionList } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    return {
        dictonaryList,
        searchData,
        isFetch,
        pageNo,
        pageSize,
        total,
        permissionList,
        dictonaryType,
        userInfo
    }

}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
        getDictonaryList: (data, oldDictionaryList) => {
            dispatch(actionCreator(GET_DICTONARY_LIST_SUCCESS, { isFetch: true }))
            Api.dictonaryList(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_DICTONARY_LIST_SUCCESS, { oldDictionaryList, newDictionaryList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
                }
            })
        },
        //type下拉
        getDictonaryTypeData: () => {
            Api.dictonaryType().then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_DICTONARY_TYPE_DATA, { dictonaryType: res.dataObject.module || [] }))
                }
            })
        },
        //删除
        deleteDictonatyData: (id, callback) => {
            Api.dictonaryDetele(id).then(res => {
                if (res.success) {
                    callback()
                    message.success('删除成功')
                } else {
                    message.error(res.msg)
                }
            })
        },
        //编辑
        dictonarymodify: (data, oldDictionaryList, callback) => {
            Api.dictonarymodify(data).then(res => {
                if (res.success) {
                    let newDictionaryList = []
                    for (let i = 0; i < oldDictionaryList.length; i++) {
                        const element = oldDictionaryList[i]
                        if (element.id === data.id) {
                            element.dictLabel = data.dictLabel
                            element.dictLabelEn = data.dictLabelEn
                            element.dictEng = data.dictEng
                        }
                        newDictionaryList.push(element)
                    }
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(UPDATE_DICTONARY_LIST_SUCCESS, { newDictionaryList }))
                } else {
                    dispatch(actionCreator(UPDATE_DICTONARY_LIST_ERROR, { oldDictionaryList }))
                }
            })
        },
        //新增
        dictonaryCreate: (data, callback) => {
            Api.dictonaryCreate(data).then(res => {
                if (res.success === true) {
                    typeof callback === 'function' && callback()
                } else {
                    message.error(res.msg)
                }
            })
        },
        // 获取字典表数据  11 是平台  42 是类型 39是微信投诉中的平台  1,案件状态，2投诉状态，3警告信状态，5案件来源，6侵权类型，21白名单类型，49举报类别（箱包）,13用户类型, 50线上投诉平台
        getSysDictList: (id, type) => {
            Api.sysDictlist({ userId: id, dictType: type }).then(res => {
                if (res.success) {
                    let data = res.dataObject;
                    let typeListCase = [], typeListComplaint = [], typeListWran = [], typecaseList = [], listTypeTortSource = [],
                        infringementList = [], caseAuditStatus = [], casePlatform = [], platfromList = [], systemUserType = [],
                        systemUserStatusType = [], systemRoleStatusType = [], resourceTypeList = [], reportType = [], trademarkPosition = [],
                        whiteListType = [], b2bUserType = [], b2bUserStatus = [], complaintStatusList = [], complaintVideoStatusList = [],
                        complaintWechatStatusList = [], vTypeList = [], complaintSourceList = [], typeList = [], investigationType = [],
                        reportKindListType = [], complaintPlatfromList = [], confirmationStatus = [], reportConfirmationStatus = [], monitorResultAuditStatus = [];
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        if (element.type === 1) {
                            // 案件-案件进度
                            typeListCase.push(element)
                        } else if (element.type === 2) {
                            // 案件-诉讼状态
                            typeListComplaint.push(element)
                        } else if (element.type === 3) {
                            // 案件-警告信状态
                            typeListWran.push(element)
                        } else if (element.type === 4) {
                            // 案件-案件类型
                            typecaseList.push(element)
                        } else if (element.type === 5) {
                            // 案件-投诉来源
                            listTypeTortSource.push(element)
                        } else if (element.type === 6) {
                            // 案件-侵权类型
                            infringementList.push(element)
                        } else if (element.type === 7) {
                            // 案件-审核状态
                            caseAuditStatus.push(element)
                        } else if (element.type === 10) {
                            // 公用-电商平台
                            casePlatform.push(element)
                        } else if (element.type === 11) {
                            // 爬虫-电商平台
                            platfromList.push(element)
                        } else if (element.type === 13) {
                            // 用户类型
                            systemUserType.push(element)
                        } else if (element.type === 14) {
                            // 后台用户状态
                            systemUserStatusType.push(element)
                        } else if (element.type === 15) {
                            // 后台角色状态
                            systemRoleStatusType.push(element)
                        } else if (element.type === 16) {
                            // 资源管理-类型
                            resourceTypeList.push(element)
                        } else if (element.type === 18) {
                            // 志愿者-举报类型
                            reportType.push(element)
                        } else if (element.type === 20) {
                            // 志愿者举报 商标所在位置
                            trademarkPosition.push(element)
                        } else if (element.type === 21) {
                            // 白名单店铺类型
                            whiteListType.push(element)
                        } else if (element.type === 29) {
                            // b2b用户类型
                            b2bUserType.push(element)
                        } else if (element.type === 30) {
                            // b2b用户状态
                            b2bUserStatus.push(element)
                        } else if (element.type === 36) {
                            // 投诉-投诉状态
                            complaintStatusList.push(element)
                        } else if (element.type === 37) {
                            // 投诉-视频投诉状态
                            complaintVideoStatusList.push(element)
                        } else if (element.type === 38) {
                            // 投诉-微信投诉状态
                            complaintWechatStatusList.push(element)
                        } else if (element.type === 39) {
                            // 投诉-视频平台
                            vTypeList.push(element)
                        } else if (element.type === 41) {
                            // 投诉-投诉来源
                            complaintSourceList.push(element)
                        } else if (element.type === 42) {
                            // 监控-图片监控类目
                            typeList.push(element)
                        } else if (element.type === 47) {
                            //调查举报线索类型
                            investigationType.push(element)
                        } else if (element.type === 49) {
                            // 举报类别
                            reportKindListType.push(element)
                        } else if (element.type === 50) {
                            //线上投诉平台
                            complaintPlatfromList.push(element)
                        } else if (element.type === 55) {
                            // 品牌方确认状态
                            confirmationStatus.push(element)
                        } else if (element.type === 54) {
                            // 
                            reportConfirmationStatus.push(element)
                        } else if (element.type === 58) {
                            monitorResultAuditStatus.push(element)
                        }
                    }
                    dispatch(actionCreator(GET_SYSTEM_DICTONARY_SUCCESS, {
                        typeListCase, typeListComplaint, typeListWran, typecaseList, listTypeTortSource,
                        infringementList, caseAuditStatus, casePlatform, platfromList, systemUserType,
                        systemUserStatusType, systemRoleStatusType, resourceTypeList, reportType, trademarkPosition,
                        whiteListType, b2bUserType, b2bUserStatus, complaintStatusList, complaintVideoStatusList,
                        complaintWechatStatusList, vTypeList, complaintSourceList, typeList, investigationType,
                        reportKindListType, confirmationStatus, complaintPlatfromList, reportConfirmationStatus, monitorResultAuditStatus
                    }))
                }
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Dictonary))
