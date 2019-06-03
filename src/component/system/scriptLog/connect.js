import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd';
import ScriptLog from './index'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api';
import { GET_SCRIPT_LOG_LIST_SUCCESS, GET_SCRIPT_LOG_LIST_ERROR, UPDATE_SCRIPT_LOG_LIST_SUCCESS, UPDATE_SCRIPT_LOG_LIST_ERROR } from '../../../contants/system/scriptLogListTypes'


function mapStateToProps (state, props) {
    const { permissionList, scriptLogTypeList } = state.commonReducer;
    const { isFetch, oldScriptLogList, newScriptLogList, pageNo, total } = state.scriptLogListReducer;
    const scriptLogList = union(oldScriptLogList, newScriptLogList)
    return {
        permissionList,
        scriptLogTypeList,
        scriptLogList,
        pageNo,
        total,
        isFetch
    }
}

function mapDispatchToProps (dispatch, props) {
    return {
        getScriptLogList: (data, oldList, callBack) => {
            Api.queryScriptLog(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_SCRIPT_LOG_LIST_SUCCESS, { isFetch: false, newScriptLogList: res.result || [], pageNo: data.pageNo, total: res.records  }))
                } else {
                    dispatch(actionCreator(GET_SCRIPT_LOG_LIST_ERROR, { isFetch: false, oldScriptLogList: oldList, pageNo: data.pageNo, total: 0 }))
                }
            })
        },
        modifyScriptLog: (data, oldList, callBack) => {
            Api.modifyScriptLog(data).then(res => {
                if (res.success) {
                    let result = [];
                    if (oldList) {
                        for (let i = 0; i < oldList.length; i++) {
                            let element = oldList[i];
                            if (element.id === data.id) {
                                element = Object.assign({}, element, data);
                            }
                            result.push(element);
                        }
                    }
                    dispatch(actionCreator(UPDATE_SCRIPT_LOG_LIST_SUCCESS, { newScriptLogList: result }))
                } else {
                    dispatch(actionCreator(UPDATE_SCRIPT_LOG_LIST_ERROR, { oldScriptLogList: oldList }))
                }
            })
        },
        delScriptLog: (data, callBack) => {
            Api.delScriptLog(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.info(res.msg)
                }
                typeof callBack === 'function' && callBack()
            })  
        },
        createScriptLog: (data, callBack) => {
            Api.createScriptLog(data).then(res => {
                if (res.success) {
                    typeof callBack === 'function' && callBack()
                } else {
                    message.info(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ScriptLog))
