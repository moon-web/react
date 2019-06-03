import React, { Component } from 'react'
import { Form, Col, Row, Table, Select, Button, Alert, Input, Modal, message} from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import '../common/index.css'
import { getButtonPrem } from '../../../utils/util'
import AddDictonary from '../common/createDictonary'
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
export default class Dictonary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            pageNo:1,
            description:undefined,
            dictLabel:'',
            searchData: {
                type:'', 
                labelOrLabelEnLike:'',
            },
            visible:false,
            dictonary:{
                name:'',
                description:undefined,
                nameEn:'',
                dictVal: ''
            },
            type:'',
            editId:''
        }
    }

    componentWillMount() {
        let { getDictonaryTypeData } = this.props
        getDictonaryTypeData()
        this.getDictonaryList([], 1)
    }

    // 获取数据
    getDictonaryList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getDictonaryList(data, oldList)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getDictonaryList([], 1)
        })
    }

    // 搜索
    handleSearch() {
        let { searchData, description, dictLabel } = this.state;
        searchData = {
            type:description || '', 
            labelOrLabelEnLike:dictLabel || ''
        }
        this.setState({
            searchData
        }, () => this.getDictonaryList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            type:'',
            labelOrLabelEnLike: '',
        }
        this.setState({
            description: undefined,
            dictLabel: '',
            searchData,
            pageSize:10,
            pageNo:1
        }, () => this.getDictonaryList([], 1))
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
            onChange: (page, pageSize) => this.getDictonaryList([], page),
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
    dictonaryCancel() {
        this.setState({
            visible:false,
            editId:'',
            type:'',
            dictonary:{
                name:'',
                description:undefined,
                nameEn:'',
                dictVal: ''
            }
        })
    }

    //提交字典数据表信息
    submitDictonary() {
        let { dictonary, type,editId} = this.state
        let { intl ,dictonarymodify, dictonaryList,dictonaryCreate,getSysDictList,userInfo} = this.props 
        if( type ==='add' ){
            if( dictonary.name === '' || dictonary.name === undefined ){
                message.warning(intl.formatMessage({ id: 'system.dictonary.please.enter.name' }));
                return
            }
            if( dictonary.description === '' || dictonary.description === undefined ){
                message.warning(intl.formatMessage({ id: 'system.choose.dictonary.type'}));
                return
            }
            if( dictonary.dictVal === '' || dictonary.dictVal === undefined ){
                message.warning(intl.formatMessage({ id: 'system.please.enter.dictonary.value'}));
                return
            }
            let data={
                dictLabel:dictonary.name,
                dictLabelEn:dictonary.nameEn,
                type:dictonary.description,
                dictVal: dictonary.dictVal
            }
            dictonaryCreate(data,()=>{
                message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" })) 
                this.getDictonaryList([], 1)
                this.dictonaryCancel()
                getSysDictList(userInfo.userId,'')
            })
        }
        else if(type ==='edit'){
            let data={
                id:editId,
                dictLabel:dictonary.name,
                dictLabelEn:dictonary.nameEn
            }
            dictonarymodify(data,dictonaryList,()=>{
                message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" })) 
                this.dictonaryCancel()
                getSysDictList(userInfo.userId,'')
            })
        }
        
    }

    //删除功能
    deleteDictionary(id) {
        let { deleteDictonatyData ,pageNo,getSysDictList,userInfo} = this.props
        deleteDictonatyData(id,()=>{
            this.getDictonaryList([], pageNo)
            getSysDictList(userInfo.userId,'')
        })
    }

    // 显示删除资源弹窗
    showDeleteConfirm(id) {
        let { intl } = this.props
        confirm({
            title: intl.formatMessage({ id: "system.delete.dictonary", defaultMessage: "删除字典数据", description: "删除字典数据" }),
            content: intl.formatMessage({ id: 'system.dictonary.delete.this.task', defaultMessage: '你确定删除这条数据吗?', description: '你确定删除这条数据吗?' }),
            onOk: () => this.deleteDictionary(id),
            onCancel: () => { }
        })
    }

    //编辑字典信息
    editDictonary(record) {
        let {dictonary} = this.state
        dictonary.name = record.dictLabel;
        dictonary.description = record.type;
        dictonary.nameEn = record.dictLabelEn;
        dictonary.dictVal = record.dictVal;
        this.setState({
            visible:true,
            type:'edit',
            editId:record.id,
            dictonary,
        })
    }

    //渲染操作
    renderOperate(text, record) {
        let { permissionList } = this.props
        return (
            <span>
                { getButtonPrem(permissionList,'010006002') ?
                    <a onClick={() => this.editDictonary(record)} style={{width:'100%',display:'block'}}>
                        <FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" />
                    </a>:''
                }
                {
                    getButtonPrem(permissionList,'010006002') ?
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
            title: <FormattedMessage id="system.dictonary.name" defaultMessage="字典名称" description="字典名称" />,
            dataIndex: 'dictLabel'
        },{
            title: <FormattedMessage id="system.dictonary.name.en" defaultMessage="字典英文名称" description="字典英文名称" />,
            dataIndex: 'dictLabelEn'
        },{
            title: <FormattedMessage id="system.dictonary.type" defaultMessage="字典类型" description="字典类型" />,
            dataIndex: 'description'
        },
        {
            title: <FormattedMessage id="system.create.tiem" defaultMessage="创建时间" description="创建时间" />,
            dataIndex: 'gmtCreate'
        },{
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            render: (text, record) => this.renderOperate(text, record)
        }];
        return columns;
    }

    render() {
        let { intl, isFetch, dictonaryList, total, dictonaryType, permissionList } = this.props;
        let { dictLabel, visible, dictonary, description, type} = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.dictionary.management', title: '字典表管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData} className="resource-content">
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "system.dictonary.name", defaultMessage: "字典名称", description: "字典名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()}  placeholder={intl.formatMessage({ id: "system.dictonary.please.enter.name", defaultMessage: "请输入字典名称", description: "请输入字典名称" })}
                                    onChange={e => this.setState({ dictLabel: e.target.value.trim() })} value={dictLabel} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "system.dictonary.type", defaultMessage: "字典类型", description: "字典类型" })}>
                                <Select
                                    placeholder={ intl.formatMessage({ id: "system.choose.dictonary.type", defaultMessage: "请选择字典类型", description: "请选择字典类型" })}
                                    onChange={ value => this.setState({ description:value }) }
                                    value={ description }
                                    dropdownMatchSelectWidth={false}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        dictonaryType && dictonaryType.map(opt => <Option key={opt.type} value={opt.type}>{opt.type + ' ' + opt.description}</Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                        </Col>
                        <Col span={6}>
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
                    getButtonPrem(permissionList,'010006002') ?
                    <Row className="operation-btns">
                        <Col span={24}>
                            <Button type='primary' onClick={() => this.setState({visible: true,type:'add'})}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
                        </Col>
                    </Row>:''
                }
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={dictonaryList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
                <AddDictonary 
                    visible={visible}
                    addModalChange={(value,type)=>this.addModalChange(value,type)}
                    onOk={()=>this.submitDictonary()}
                    onCancel={()=>this.dictonaryCancel()}
                    dictonary={dictonary}
                    type={type}
                    dictonaryType={dictonaryType}
                    name={'dictonary'}
                />
            </Content>
        )
    }
}
