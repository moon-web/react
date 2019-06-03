import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import PermissionsManage from './index'
import { actionCreator } from '../../../../../utils/util'
import { GET_LAWYER_USER_ROLE_AUTH_TREE_SUCCESS } from '../../../../../contants/system/lawyerRoleTypes'
import Api from '../../../../../api/index'

function mapStateToProps(state, props) {
    const { userRoleAuthTree } = state.lawyerRoleReducer;
    return {
        userRoleAuthTree
    }
}

function mapDispatchToProps(dispatch, props) {
    
    return {
        getUserAuthTree: (data) => {
            Api.lawyerRoleAuthTree(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_LAWYER_USER_ROLE_AUTH_TREE_SUCCESS,  {userRoleAuthTree: res.dataObject}))
                } else {
                    dispatch(actionCreator(GET_LAWYER_USER_ROLE_AUTH_TREE_SUCCESS,  {userRoleAuthTree: []}))
                }
            })
        },
        updateRoleAuth: (data, callBack) => {
            Api.lawyerRoleAuth(data).then(res => {
                typeof callBack === 'function' && callBack(res)
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PermissionsManage))
