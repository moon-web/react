import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import AddWhite from './index'
import Api from '../../../../../api/index'
import { message } from 'antd'
import { actionCreator } from '../../../../../utils/util'
import { GET_ADD_WHITE_SUCCESS } from '../../../../../contants/system/whiteListTypes'
function mapStateToProps(state,props) {
    const { brandList = [], platfromList = [], whiteListType = [] } = state.commonReducer;
    const userInfo = state.loginReducer.userInfo || {};
    return {
		brandList,
		platfromList,
		whiteListType,
        userInfo
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        addWhite: (data,callback) => {
            dispatch(actionCreator(GET_ADD_WHITE_SUCCESS, { isFetch: false }))         
            Api.addWhite(data).then(res => {
                if(res.success===true){
                    dispatch(actionCreator(GET_ADD_WHITE_SUCCESS, { isFetch: true }))
                    props.history.push('/system/white')                    
                }else{
                    message.warn(res.msg)
                }
            })             
		}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AddWhite))
