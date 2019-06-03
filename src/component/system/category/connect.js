import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import CategoryList from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_CATEGORY_LIST_SUCCESS , UPDATE_CATEGORY_LIST_SUCCESS, UPDATE_CATEGORY_LIST_ERROR} from '../../../contants/system/categoryListTypes'
import { GET_PROD_LIST_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'
import { message } from 'antd'
function mapStateToProps(state, props) {
    // 属性 
    const { isFetch, oldCategoryList, newCategoryList, searchData, pageNo, pageSize = 10, total} = state.categoryReducer;
    const categoryList = union(oldCategoryList, newCategoryList)
    const {  permissionList } = state.commonReducer;
    const {  userInfo } = state.loginReducer;
    return {
        categoryList,
        searchData,
        isFetch,
        pageNo,
        pageSize,
        total,
        permissionList,
        userInfo
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        //列表
        getCategoryList: (data, oldCategoryList) => {
            dispatch(actionCreator(GET_CATEGORY_LIST_SUCCESS, { isFetch: true }))
            Api.categoryList(data).then(res => {
                if(res.success) {
                    dispatch(actionCreator(GET_CATEGORY_LIST_SUCCESS, { oldCategoryList, newCategoryList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, total: res.records || 0, isFetch: false }))
                }
            })
        },
        //删除
        deleteCategoryData:(id,callback) =>{
            Api.categoryDetele(id).then(res =>{
                if (res.success) {
                    callback()
                    message.success('删除成功')
                }else{
                    message.error(res.msg)
                }
            })
        },
        //编辑
        categorymodify:(data,oldCategoryList,callback)=>{
            Api.categoryModify(data).then(res => {
                if(res.success) {                    
					let newCategoryList = []
					for(let i = 0; i < oldCategoryList.length; i ++){
						const element = oldCategoryList[i]
						if(element.id === data.id){
                            element.name = data.name
                            element.nameEn = data.nameEn
                            element.nameEng = data.nameEng
                            element.cName = data.cName
						}
						newCategoryList.push(element)
                    }
                    typeof callback === 'function' && callback()
					dispatch(actionCreator(UPDATE_CATEGORY_LIST_SUCCESS, { newCategoryList }))
				}else {
                    message.error(res.msg)
					dispatch(actionCreator(UPDATE_CATEGORY_LIST_ERROR, { oldCategoryList }))
				} 
            }) 
        },
        //新增
        cateforyCreate:(data,callback)=>{
            Api.categoryCreate(data).then(res =>{
                if(res.success===true){
                    typeof callback === 'function' && callback()
                }else{
                    message.error(res.msg)
                }
            })
        },
        //common类目数据
        getProdList: (id) => {
            Api.prodList({ userId: id }).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_PROD_LIST_SUCCESS, { prodList: res.dataObject }))
                }
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CategoryList))
