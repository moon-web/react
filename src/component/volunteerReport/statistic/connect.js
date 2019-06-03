import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import ReportTask from './index'
import { GET_REPORT_STATISTIC_SUCCESS,GET_REPORT_BRANDINFO_SUCCESS,GET_REPORT_BRANDINFO_REEOR,GET_REPORT_COUNT_SUCCESS } from '../../../contants/report/volunteerTaskTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import { actionCreator} from '../../../utils/util'
import Api from '../../../api/index'

function mapStateToProps(state, ownProps) {
    const { brandList=[], permissionList, exportExcelTitle } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch,reportStatisticList, pageNo,vSuccNum = 0,total,vTotalNum = 0,deliverTarget,deliverUnitStr,startDateStr,endDateStr,isBlock} = state.volunteerTaskReducer;
    return {
        reportStatisticList,
        isFetch,
        pageNo,
        userInfo,
        brandList,
        vSuccNum,
        vTotalNum,
        deliverTarget,
        deliverUnitStr,
        startDateStr,
        endDateStr,
        isBlock,
        total,
        permissionList,
        exportExcelTitle
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getReportStatisticList: (data) => {
            dispatch(actionCreator(GET_REPORT_STATISTIC_SUCCESS, { isFetch: true }))
            Api.getAllReportPage(data).then(res => {
                if (res.success) {
                    for (let i = 0; i < res.result.length; i++) {
                        const element = res.result[i];
                        element.key = Date.now() + i;
                    }
                }
                dispatch(actionCreator(GET_REPORT_STATISTIC_SUCCESS, { reportStatisticList: res.result || [],total: res.records || 0, pageNo: data.pageNo, isFetch: false }))
            })
        },
        //获取品牌交付数据
        getbrandInfodata:(data,callback) =>{
            dispatch(actionCreator(GET_REPORT_BRANDINFO_SUCCESS, {isBlock:true}))
            Api.getBrandInfo(data).then(res => {
                if(res.success){
                    if(res.dataObject===''){
                        dispatch(actionCreator(GET_REPORT_BRANDINFO_SUCCESS, { 
                            isBlock:false
                        }))
                    }else{
                        dispatch(actionCreator(GET_REPORT_BRANDINFO_SUCCESS, { 
                            deliverTarget: res.dataObject.deliverTarget, 
                            deliverUnitStr: res.dataObject.deliverUnit,
                            startDateStr: res.dataObject.gmtStartStr, 
                            endDateStr:res.dataObject.gmtEndStr,
                            isBlock:true
                        }))
                    }
                    callback()
                }else{
                    dispatch(actionCreator(GET_REPORT_BRANDINFO_REEOR, { 
                        deliverTarget: '', 
                        deliverUnitStr:'',
                        startDateStr: '', 
                        endDateStr:'',
                        isBlock:false
                    }))
                }
            })
        },
        //获取提交量成立量
        getCountReportdata:(data) => {
            Api.getCountReport(data).then((res)=>{
                if(res.success){
                    dispatch(actionCreator(GET_REPORT_COUNT_SUCCESS, {vSuccNum:res.dataObject.vSuccNum,vTotalNum:res.dataObject.vTotalNum}))
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ReportTask))
