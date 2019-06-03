import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import ReportOnLine from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_ONLINE_REPORT_SUCCESS, UPDATE_ONLINE_REPORT_SUCCESS, UPDATE_ONLINE_REPORT_ERROR } from '../../../contants/clue/reportOnlineTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { platfromList, brandList, prodList, infringementList, permissionList, reportTaskOnlineClueStatus, exportExcelTitle } = state.commonReducer;
    const { isFetch, oldReportOnlineList, newReportOnlineList, searchData, pageNo, pageSize = 10, total } = state.reportOnlineReducer;
    const reportOnlineList = union(oldReportOnlineList, newReportOnlineList)
    return {
        platfromList,
        brandList,
        prodList,
        isFetch,
        searchData,
        pageNo,
        pageSize,
        total,
        reportOnlineList,
        infringementList,
        permissionList,
        reportTaskOnlineClueStatus,
        exportExcelTitle
    }
}
function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        getReportOnlineList: (data, oldReportOnlineList) => {
            dispatch(actionCreator(GET_ONLINE_REPORT_SUCCESS, { isFetch: true }))
            Api.onReportClue(data).then(res => {
                dispatch(actionCreator(GET_ONLINE_REPORT_SUCCESS, { oldReportOnlineList, newReportOnlineList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
            })
		},
		updateClueExamine: (data, oldReportOnlineList, callback) => {
			Api.onReportClueExamine(data).then(res => {
				if(res.success) {                    
					let newReportOnlineList = []
					for(let i = 0; i < oldReportOnlineList.length; i ++){
						const element = oldReportOnlineList[i]
						if(element.id === data.id){
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
						}
						newReportOnlineList.push(element)
                    }
                    typeof callback === 'function' && callback()
					dispatch(actionCreator(UPDATE_ONLINE_REPORT_SUCCESS, { newReportOnlineList }))
				}else {
					dispatch(actionCreator(UPDATE_ONLINE_REPORT_ERROR, { oldReportOnlineList }))
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ReportOnLine))
