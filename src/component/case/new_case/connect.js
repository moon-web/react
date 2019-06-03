import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import NewCaseInformation from './index'
import Api from '../../../api/index'
import { message } from 'antd'
import {GET_CASE_ERROR_DETAILS} from '../../../contants/case/caseErrorDetails'
import { actionCreator } from '../../../utils/util'
function mapStateToProps(state,props) {
    const userInfo = state.loginReducer.userInfo || {};
    const { casePlatform = [], brandList = [], typeList = [] ,prodList=[],infringementList = [], typeListComplaint = [], listTypeTortSource = [], typeListCase = [], typeListWran = [], typecaseList = []} = state.commonReducer;   
    const { errorDetail} = state.caseErrorReducer
    return {
        brandList,
        userInfo,
        typeList,
        listTypeTort:infringementList,//侵权类型
        typeListCase,
        typeListComplaint,
        listTypeTortSource,//来源
        typeListWran,
        prodList,//产品分类
        typecaseList,//案件类型
        errorDetail,//验证案件编号唯一状态
        casePlatform
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getSubmitCaseInfo:(data)=>{
            Api.Addlawcase(data).then((res)=>{
                if(res.success===true){
                    props.history.push('/case/list')
                }else{
                    message.warning(res.msg)
                }
            })
        },
        verifyCaseNumber(data) {
            Api.verifyCaseNumber(data).then((res)=>{
                if(res.success===true){
                    dispatch(actionCreator(GET_CASE_ERROR_DETAILS, { errorDetail: res.dataObject }))
                }else{
                    dispatch(actionCreator(GET_CASE_ERROR_DETAILS, { errorDetail: '' }))
                }
            })
        }       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NewCaseInformation))
