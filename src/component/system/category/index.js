import React, { Component } from 'react'
import { Form, Col, Row, Table, Button, Alert, Input, Modal,message } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import '../common/index.css'
import { getButtonPrem } from '../../../utils/util'
import AddDictonary from '../common/createDictonary'
const FormItem = Form.Item;
const confirm = Modal.confirm;
export default class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            pageNo:1,
            dictLabel:'',
            dictLabelEn:"",
            searchData: {
                nameOrNameEnLike:'',
            },
            visible:false,
            type:'add',
            dictonary:{
                name:'',
                abbreviation:'',
                nameEn:'',
                number:''
            },
            editId:''
        }
    }

    componentWillMount() {
        this.getCategoryList([], 1)
    }

    // 获取数据
    getCategoryList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getCategoryList(data, oldList)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getCategoryList([], 1)
        })
    }

    // 搜索
    handleSearch() {
        let { searchData, dictLabel } = this.state;
        searchData = {
            nameOrNameEnLike:dictLabel || ''
        }
        this.setState({
            searchData
        }, () => this.getCategoryList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            nameOrNameEnLike: '',
        }
        this.setState({
            dictLabel: '',
            dictLabelEn:'',
            searchData,
            pageSize:10,
            pageNo:1
        }, () => this.getCategoryList([], 1))
    }

    // 创建分页器配置项
    createPaginationOption() {
        let { pageNo, total } = this.props;
        let { pageSize } = this.state;
        return {
            current: pageNo,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onChange: (page, pageSize) => this.getCategoryList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    //获取modal提交输入框值
    addModalChange(value,type) {
        let dictonary= this.state.dictonary
        dictonary[type]= value
        this.setState({
            dictonary:dictonary
        })
    }

    //取消新增字典数据
    categoryCancel() {
        this.setState({
            visible:false,
            type:'',
            editId:'',
            dictonary:{
                name:'',
                abbreviation:'',
                nameEn:'',
                number:''
            }
        })
    }

    //提交字典数据表信息
    submitCategory() {
        let { dictonary ,type, editId } = this.state
        let { intl ,categorymodify, categoryList,cateforyCreate,getProdList,userInfo} = this.props 
        if( type === 'add' ){
            if( dictonary.number === '' || dictonary.number === undefined ){
                message.warning(intl.formatMessage({ id: 'system.please.enter.category.number' }));
                return
            }
            if( dictonary.abbreviation === '' || dictonary.abbreviation === undefined ){
                message.warning(intl.formatMessage({ id: 'system.please.enter.category.for.short' }));
                return
            }
            if( dictonary.name === '' || dictonary.name === undefined ){
                message.warning(intl.formatMessage({ id: 'system.category.please.enter.name' }));
                return
            }
            let data={
                name:dictonary.name,
                nameEn:dictonary.nameEn,
                cName:dictonary.abbreviation,
                cCode:dictonary.number
            }
            cateforyCreate(data,()=>{
                message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" })) 
                this.categoryCancel()
                this.getCategoryList([], 1)             
                getProdList(userInfo.userId)

            })
        }else if(type === 'edit'){
            let data={
                id:editId,
                name:dictonary.name,
                nameEn:dictonary.nameEn,
                cName:dictonary.abbreviation,
            }
            categorymodify(data,categoryList,()=>{
                message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" })) 
                this.categoryCancel()
                getProdList(userInfo.userId)
            })
        }
    }

    //删除功能
    deleteDictionary(id) {
        let { deleteCategoryData, pageNo, userInfo, getProdList } = this.props
        deleteCategoryData(id,()=>{
            this.getCategoryList([], pageNo)
            getProdList(userInfo.userId)
        })
    }

    // 显示删除资源弹窗
    showDeleteConfirm(id) {
        let { intl } = this.props
        confirm({
            title: intl.formatMessage({ id: "system.delete.category", defaultMessage: "删除类目数据", description: "删除类目数据" }),
            content: intl.formatMessage({ id: 'system.dictonary.delete.this.task', defaultMessage: '你确定删除这条数据吗?', description: '你确定删除这条数据吗?' }),
            onOk: () => this.deleteDictionary(id),
            onCancel: () => { }
        })
    }

    //编辑字典信息
    editDictonary(record) {
        let {dictonary} = this.state
        dictonary.name = record.name
        dictonary.nameEn = record.nameEn
        dictonary.number = record.cCode
        dictonary.abbreviation = record.cName
        this.setState({
            visible:true,
            type:'edit',
            editId:record.id,
            dictonary
        })
    }

    //渲染操作
    renderOperate(text, record) {
        let { permissionList } = this.props
        return (
            <span>
                {
                    getButtonPrem(permissionList,'010007003') ?
                    <a onClick={() => this.editDictonary(record)} style={{width:'100%',display:'block'}}>
                        <FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" />
                    </a>:''
                }
                {
                    getButtonPrem(permissionList,'010007003') ?
                    <a onClick={() => this.showDeleteConfirm(record.id)} style={{width:'100%',display:'block'}}>
                        <FormattedMessage id="global.delete" defaultMessage="删除" description="删除" />
                    </a>:''
                }
            </span>
        )
    }

    // 创建table配置
    createColumns() {
        const columns = [
        {
            title: <FormattedMessage id="system.category.name" defaultMessage="类目名称" description="类目名称" />,
            dataIndex: 'name'
        },
        {
            title: <FormattedMessage id="system.category.abbreviation" defaultMessage="类目简称" description="类目简称" />,
            dataIndex: 'cName'
        },{
            title: <FormattedMessage id="system.category.name.en" defaultMessage="类目英文名称" description="类目英文名称" />,
            dataIndex: 'nameEn'
        },{
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            render: (text, record) => this.renderOperate(text, record)
        }];
        return columns;
    }

    render() {
        let { intl, isFetch, categoryList, total, permissionList} = this.props;
        let { dictLabel, visible, dictonary,type } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.category.management', title: '类目表管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData} className="resource-content">
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "system.category.name", defaultMessage: "类目名称", description: "类目名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "system.category.please.enter.name", defaultMessage: "请输入类目名称", description: "请输入类目名称" })}
                                    onChange={e => this.setState({ dictLabel: e.target.value.trim() })} value={dictLabel}  onPressEnter={(e) => this.handleSearch()}/>
                            </FormItem>
                        </Col>
                        <Col span={6} offset={12}>
                            <div className="search-form-btns">
                                <Button type="primary" onClick={() => this.handleSearch()}>
                                    <FormattedMessage id="global.search" defaultMessage="搜索" description="搜索" />
                                </Button>
                                <Button onClick={() => this.handleReset()}>
                                    <FormattedMessage id="global.reset" defaultMessage="重置" description="重置" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                {
                    getButtonPrem(permissionList,'010007003') ?
                    <Row className="operation-btns">
                        <Col span={24}>
                            <Button type='primary' onClick={() => this.setState({visible: true,type:'add'})}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
                        </Col>
                    </Row>:''
                }
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={categoryList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
                <AddDictonary 
                    visible={visible}
                    addModalChange={(value,type)=>this.addModalChange(value,type)}
                    onOk={()=>this.submitCategory()}
                    onCancel={()=>this.categoryCancel()}
                    dictonary={dictonary}
                    type={type}
                    name={'category'}
                />
            </Content>
        )
    }
}
