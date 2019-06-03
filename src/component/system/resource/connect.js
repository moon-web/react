import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import ResourceList from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_RESOURCE_LIST_SUCCESS, GET_RESOURCE_BRAND_SUCCESS, GET_RESOURCE_FOR_BRAND_AND_TYPE } from '../../../contants/system/resourceListTypes'
import Api from '../../../api/index'
import { message } from 'antd'

function mapStateToProps(state, props) {
    // 属性 
    const { platfromList, brandList, resourceTypeList, permissionList, reportType, prodList } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch, oldSourceList, newSourceList, searchData, pageNo, pageSize = 10, total, resourceBrandList = [], resourceTraList, resourceReasonList, typeBrandList } = state.resourceListReducer;
    const resourceList = union(oldSourceList, newSourceList)
    return {
        platfromList,
        brandList,
        permissionList,
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        resourceList,
        userInfo,
        resourceTypeList,
        resourceBrandList,
        resourceTraList,
        reportType,
        resourceReasonList,
        typeBrandList,
        prodList
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
        getSourceList: (data, oldSourceList) => {
            dispatch(actionCreator(GET_RESOURCE_LIST_SUCCESS, { isFetch: true }))
            Api.resoucesList(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_RESOURCE_LIST_SUCCESS, { oldSourceList, newSourceList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
                }
            })
        },
        //删除
        delResource: (data, callback) => {
            Api.deleteResources(data).then(res => {
                if(res.success){
                    callback()
                }else {
                    message.info(res.msg)
                }
            })
        },
        //新增
        addResource: (data,callback) => {
            Api.createResources(data).then(res => {
                if(res.success) {
                    callback()
                }else {
                    message.info(res.msg)
                }
            })
        },
        //编辑
        editResources: (data,callback) => {
            Api.editResources(data).then(res => {
                if(res.success) {
                    callback()
                }else {
                    message.info(res.msg)
                }
            })
        },
        getResourceBrand: data => {
            Api.resourceBrand(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_RESOURCE_BRAND_SUCCESS, {resourceBrandList: res.dataObject}))
                } else {
                    dispatch(actionCreator(GET_RESOURCE_BRAND_SUCCESS, {resourceBrandList: []}))
                }
            })
        },
        getResourceForData: (data) => {
            Api.queryResourceForData(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_RESOURCE_FOR_BRAND_AND_TYPE, { resourceTraList: res.dataObject.traList, resourceReasonList: res.dataObject.reasonList }))
                } else {
                    dispatch(actionCreator(GET_RESOURCE_FOR_BRAND_AND_TYPE, { resourceTraList: {}, resourceReasonList: {} }))
                }
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ResourceList))
