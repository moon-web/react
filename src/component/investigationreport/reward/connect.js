import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Reward from './index'
import { actionCreator ,union} from '../../../utils/util'
import { GET_REWORD_LIST_SUCCESS ,GET_REWORD_STATUS_SUCCESS, GET_REWORD_STATUS_ERROR } from '../../../contants/investigationreport/rewardTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    const { oldRewordList, newRewordList, total, isFetch, pageNo, pageSize, ownerBrandList = [] } = state.rewardReducer
    const investigationRewardList = union(oldRewordList, newRewordList)
    const { permissionList=[], reportRewardDistributionStatus=[] } = state.commonReducer
    // 属性 
    return {
        investigationRewardList,
        total,
        isFetch,
        pageNo,
        pageSize,
        ownerBrandList,
        permissionList,
        reportRewardDistributionStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //获取listdata
        getRewardList: (oldRewordList, data) => {
            dispatch(actionCreator(GET_REWORD_LIST_SUCCESS, { isFetch: true }))
            Api.getReportAwardList(data).then(res=>{
                if(res.success){
                    dispatch(actionCreator(GET_REWORD_LIST_SUCCESS, { oldRewordList, newRewordList: res.result || [], total: res.records, pageNo: data.pageNo, pageSize: data.pageSize, isFetch: false }))
                }else {
                    dispatch(actionCreator(GET_REWORD_LIST_SUCCESS, { newRewordList: [], isFetch: false }))
                }
            })
        },
        //审核通过
        geteditGiveOut:(data, oldRewordList, callback) =>{
            Api.editGiveOut(data).then(res=>{
                if(res.success){
                    let newRewordList=[];
                    for ( let i = 0; i < oldRewordList.length; i++ ) {
                        const element = oldRewordList[i];
                        if (element.id === data.id) {
                            if(data.isGiveout){
                                element.isGiveout = data.isGiveout;
                                element.isGiveoutName = '已发放';
                                element.isGiveoutNameEn = 'Already issued';
                            }
                        }
                        newRewordList.push(element)
                    }
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(GET_REWORD_STATUS_SUCCESS, { newRewordList }))
                }else{
                    dispatch(actionCreator(GET_REWORD_STATUS_ERROR, { oldRewordList }))
                }
            })
        }
       
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Reward))
