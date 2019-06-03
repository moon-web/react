import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import ReleaseTask from './index'
import Api from '../../../api/index'
import { actionCreator } from '../../../utils/util'
import { GET_RELEASE_TASK_SUCCESS } from '../../../contants/clue/releaseTaskTypes'
import { message } from 'antd'
function mapStateToProps(state, props) {
     // 属性 
     const { brandList, reportTaskType, b2bUserType } = state.commonReducer;
     const { userInfo } = state.loginReducer;
	return {
        brandList,
        userInfo,
        reportTaskType,
        b2bUserType
	}
}
function mapDispatchToProps(dispatch, props) {
	return {
		addReleaseTask: (data) => {
			dispatch(actionCreator(GET_RELEASE_TASK_SUCCESS, { isFetch: false }))         
            Api.reportAddTask(data).then(res => {
                if(res.success===true){
                    dispatch(actionCreator(GET_RELEASE_TASK_SUCCESS, { isFetch: true }))
                    props.history.push('/clue/task')                    
                }else{
                    message.warn(res.msg)
                }
            })
		}
	}
	
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ReleaseTask))