import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import OnLine from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_ON_LINE_SUCCESS, UPDATE_ON_LINE_SUCCESS, UPDATE_ON_LINE_ERROR } from '../../../contants/clue/onlineTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 brandList, resourceTypeList,
    const { platfromList, brandList, prodList, infringementList, permissionList, onlineClueStatus, exportExcelTitle } = state.commonReducer;
    const { isFetch, oldOnlineList, newOnlineList, searchData, pageNo, pageSize = 10, total } = state.onLineReducer;
    const onLineList = union(oldOnlineList, newOnlineList)
    return {
        platfromList,
        brandList,
        prodList,
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        onLineList,
        infringementList,
        permissionList,
        onlineClueStatus,
        exportExcelTitle
    }
}
function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getOnlineList: (data, oldOnlineList) => {
            dispatch(actionCreator(GET_ON_LINE_SUCCESS, { isFetch: true }))
            Api.onLineClue(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_ON_LINE_SUCCESS, { oldOnlineList, newOnlineList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records, isFetch: false }))
                }
            })
        },
        // 更新列表数据
        updateOnLineItem: (data, oldOnlineList, callback) => {
            Api.onLineClueExamin(data).then(res => {
                if (res.success) {
                    let newOnlineList = [];
                    for (let i = 0; i < oldOnlineList.length; i++) {
                        const element = oldOnlineList[i]
                        if (element.id === data.id) {
                            if (data.status === 3) {
                                element.status = data.status
                                element.statusName = data.statusName
                                element.statusNameEn = data.statusNameEn
                            }else {
                                element.status = data.status
                                element.brandId = data.brandId
                                element.tortsType = data.tortsType
                                element.prodCategoryId = data.prodCategoryId
                                element.prodCategoryName = data.prodCategoryName
                                element.prodCategoryNameEng = data.prodCategoryNameEng
                                element.brandName = data.brandName
                                element.statusName = data.statusName
                                element.statusNameEn = data.statusNameEn
                            }
                        }
                        newOnlineList.push(element)
                    }
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(UPDATE_ON_LINE_SUCCESS, { newOnlineList }))
                } else {
                    dispatch(actionCreator(UPDATE_ON_LINE_ERROR, { oldOnlineList }))
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OnLine))
