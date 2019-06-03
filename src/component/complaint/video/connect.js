import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import ComplaintVideo from './index'
import { actionCreator } from '../../../utils/util'
import { GET_VIDEO_LIST_SUCCESS } from '../../../contants/complaint/videoListTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    const { brandList = [], vTypeList = [], complaintVideoStatusList, permissionList, exportExcelTitle } = state.commonReducer
    const { complaintVideoList, total, isFetch, pageNo, pageSize } = state.complaintVideoReducer
    // 属性 
    return {
        brandList,
        vTypeList,
        complaintVideoList,
        complaintVideoStatusList,
        total,
        isFetch,
        pageNo,
        pageSize,
        permissionList,
        exportExcelTitle
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
        complaintVideo: (data) => {
            dispatch(actionCreator(GET_VIDEO_LIST_SUCCESS, { isFetch: true }))
            Api.complaintVideo(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_VIDEO_LIST_SUCCESS, { complaintVideoList: res.result, searchData: data, total: res.records, pageNo: data.pageNo, pageSize: data.pageSize, isFetch: false }))
                
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ComplaintVideo))
