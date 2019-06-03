import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import AddBrandCleanliness from './index'
import Api from '../../../api/index'
import { message } from 'antd'
import { GET_BRAND_CLEANLINESS_ADD_SUCCESS } from '../../../contants/brand/brandCleanlinessType'
import { actionCreator } from '../../../utils/util'
function mapStateToProps(state,props) {
    const { brandList, platfromList, monitorRulesQueryParamsSort } = state.commonReducer;
    const { isFetchBtag } = state.brandCleanlinessReducer
    return {
        brandList,
        platfromList,
        isFetchBtag,
        monitorRulesQueryParamsSort
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        addBrandCleanliness:(data)=>{
            dispatch(actionCreator(GET_BRAND_CLEANLINESS_ADD_SUCCESS, { isFetchBtag: false })) 
            Api.addBrandCleanliness(data).then((res)=>{
                if(res.success===true){
                    dispatch(actionCreator(GET_BRAND_CLEANLINESS_ADD_SUCCESS, { isFetchBtag: true })) 
                    props.history.goBack()
                }else{ 
                    message.warning(res.msg)
                }
            })
        }    
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AddBrandCleanliness))
