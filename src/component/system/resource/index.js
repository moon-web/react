import React, { Component } from 'react'
import { Form, Col, Row, Table, message, Button, Alert, Select, Tooltip, Upload, Modal } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import PictureModal from '../../common/layout/modal/pictureModal'
import '../common/index.css'
import AddResourceModal from './children/addResourceModal'
import AddTaobaoReason from './children/addTaobaoReason'
import Req from '../../../api/req'
import { getButtonPrem, getName } from '../../../utils/util'
const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

export default class ResourceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            resourceType: undefined,
            ownedBrand: undefined,
            showModalImg: '',
            showModalVisible: false,
            resourceModalVisible: false,//添加著作权地址
            type: 1,//添加类型
            fileList: '',
            edit: false,//编辑
            systemResourceId: '',//资源id
            searchData: {
                brandId: '',
                type: ''
            },
            addResourceData: {
                brandId: undefined,
                vrLabel: '',
                vrResource: '',
                description: '',
                prodTypeId: undefined,
                relationType: undefined,
                tbReason: '',
            },
            tabbaoReasonVisible: false,
        }
    }

    componentWillMount() {
        this.getSourceList([], 1)
    }

    // 获取数据
    getSourceList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getSourceList(data, oldList)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getSourceList([], 1)
        })
    }
    // 搜索
    handleSearch() {
        let { searchData, resourceType, ownedBrand } = this.state;
        searchData = {
            brandId: ownedBrand || '',
            type: resourceType || ''
        }
        this.setState({
            searchData
        }, () => this.getSourceList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            brandId: '',
            type: ''
        }
        this.setState({
            resourceType: undefined,
            ownedBrand: undefined,
            searchData
        }, () => this.getSourceList([], 1))
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
            onChange: (page, pageSize) => this.getSourceList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    //渲染类型
    renderTpye(text, record) {
        let { intl } = this.props
        return (
            <span>{intl.locale === 'en'? record.typeNameEn: record.typeName}</span>
        )
    }
    //渲染资源
    renderResource(text, record) {
        let { intl, reportType } = this.props
        let reportTypeName = getName(reportType, record.relationType)
        if (record.type === 1) {
            return (
                <div className="table-info">
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="clue.report.kind" defaultMessage="举报类别" description="举报类别" />：</span>
                        <Tooltip title={intl.locale === 'en' ? reportTypeName.dictLabelEn : reportTypeName.dictLabel}>
                            <span>{intl.locale === 'en' ? reportTypeName.dictLabelEn : reportTypeName.dictLabel}</span>
                        </Tooltip>
                    </p>
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="system.name.of.copyright" defaultMessage="著作权名称" description="著作权名称" />：</span>
                        <Tooltip title={record.vrLabel}>
                            <span>{record.vrLabel}</span>
                        </Tooltip>
                    </p>
                </div>
            )
        } else if (record.type === 2) {
            return (
                <div className="table-info">
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="system.trademark.number" defaultMessage="商标号" description="商标号" />：</span>
                        <Tooltip title={record.vrLabel}>
                            <span>{record.vrLabel}</span>
                        </Tooltip>
                    </p>
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="system.category" defaultMessage="商品类目" description="商品类目" />：</span>
                        {
                            <span style={{ width: '50px' }}>
                                <Tooltip placement="leftTop" record={intl.locale === 'en' ? record.prodTypeNameEn : record.prodTypeName}>
                                    {
                                        intl.locale === 'en'
                                            ? record.prodTypeNameEn.length > 15
                                                ? record.prodTypeNameEn.slice(0, 15) + '...'
                                                : record.prodTypeNameEn
                                            : record.prodTypeName.length > 15
                                                ? record.prodTypeName.slice(0, 15) + '...'
                                                : record.prodTypeName
                                    }
                                </Tooltip>
                            </span>
                        }
                    </p>
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="system.trademark.theme" defaultMessage="商标主体" description="商标主体" />：</span>
                        {
                            record.vrResource ?
                                <img src={record.vrResource} alt="" style={{ width: '60px' }} onClick={() => this.showModalImg(record.vrResource.replace('/_','/'))} />
                                : <Tooltip title={record.description}>
                                    <span>{record.description}</span>
                                </Tooltip>
                                
                        }
                    </p>
                </div>
            )
        } else if (record.type === 3) {
            return (
                <div className="table-info">
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="clue.report.kind" defaultMessage="举报类别" description="举报类别" />：</span>
                        <Tooltip title={intl.locale === 'en' ? reportTypeName.dictLabelEn : reportTypeName.dictLabel}>
                            <span>{intl.locale === 'en' ? reportTypeName.dictLabelEn : reportTypeName.dictLabel}</span>
                        </Tooltip>
                    </p>
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="system.reason.number" defaultMessage="理由名称" description="理由名称" />：</span>
                        <Tooltip title={record.vrLabel}>
                            <span>{record.vrLabel}</span>
                        </Tooltip>
                    </p>
                    {
                        record.tbReason
                            ? (
                                <p className="table-item">
                                    <span className="table-lable"><FormattedMessage id="system.tb.reason" defaultMessage="淘宝理由" description="淘宝理由" />：</span>
                                    {
                                        record.tbReason.length > 15
                                            ? <Tooltip title={record.tbReason}>
                                                <span>{record.tbReason.slice(0, 15)}...</span>
                                            </Tooltip>
                                            : <span>{record.tbReason}</span>
                                    }
                                </p>
                            )
                            : ''
                    }
                    {
                        record.vrResource ?
                            <p className="table-item">
                                <span><FormattedMessage id="system.reason.picture" defaultMessage="理由图片" description="理由图片" />：</span>
                                <img src={record.vrResource} alt="" style={{ width: '60px', height: '60px' }} onClick={() => this.showModalImg(record.vrResource.replace('/_','/'))} />
                            </p> : ''
                    }
                </div>
            )
        } else if ( record.type === 4 ) {
            return (
                <div className="table-info">                
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="clue.report.kind" defaultMessage="举报类别" description="举报类别" />：</span>
                        <Tooltip title={intl.locale === 'en' ? reportTypeName.dictLabelEn : reportTypeName.dictLabel}>
                            <span>{intl.locale === 'en' ? reportTypeName.dictLabelEn : reportTypeName.dictLabel}</span>
                        </Tooltip>
                    </p>
                    {
                        record.relationType === 2 ?
                            <p className="table-item">
                                <span className="table-lable"><FormattedMessage id="system.trademark" defaultMessage="商标" description="商标" />：</span>
                                {
                                    record.relationLabel.length > 15
                                        ? <Tooltip title={record.relationLabel}>
                                            <span>{record.relationLabel.slice(0, 15)}...</span>
                                        </Tooltip>
                                        : <span>{record.relationLabel}</span>
                                }
                            </p> : ''
                    }
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="system.taobao.complaint" defaultMessage="投诉理由" description="投诉理由" />：</span>
                        {
                            record.reasonLabel.length > 15
                                ? <Tooltip title={record.reasonLabel}>
                                    <span>{record.reasonLabel.slice(0, 15)}...</span>
                                </Tooltip>
                                : <span>{record.reasonLabel}</span>
                        }
                    </p>
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="system.tb.reason.description" defaultMessage="淘宝理由说明" description="淘宝理由说明" />：</span>
                        {
                            record.tbReason.length > 15
                                ? <Tooltip title={record.tbReason}>
                                    <span>{record.tbReason.slice(0, 15)}...</span>
                                </Tooltip>
                                : <span>{record.tbReason}</span>
                        }
                    </p>
                </div>
            )
        }
    }
    //渲染操作
    renderOperate(text, record) {
        let { permissionList } = this.props
        return (
            <span>
                {
                    getButtonPrem(permissionList, '010003003') ?
                        <a key='pass' onClick={() => this.editResourceList(record)}>
                            <FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" />
                        </a> : ''
                }
                <br key='br1' />
                {
                    getButtonPrem(permissionList, '010003004') ?
                        <a key='del' onClick={() => this.showDeleteConfirm(record.id)}>
                            <FormattedMessage id="global.delete" defaultMessage="删除" description="删除" />
                        </a> : ''
                }
            </span>
        )
    }
    // 创建table配置
    createColumns() {
        const columns = [{
            title: <FormattedMessage id="system.brand.name" defaultMessage="所属品牌" description="所属品牌" />,
            width: '25%',
            dataIndex: 'brandName'
        }, {
            title: <FormattedMessage id="system.type" defaultMessage="类型" description="类型" />,
            width: '25%',
            render: (text, record) => this.renderTpye(text, record)
        }, {
            title: <FormattedMessage id="system.resource" defaultMessage="资源" description="资源" />,
            width: '30%',
            render: (text, record) => this.renderResource(text, record)
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            width: '20%',
            render: (text, record) => this.renderOperate(text, record)
        }];
        return columns;
    }

    // 显示删除资源弹窗
    showDeleteConfirm(id) {
        let { intl } = this.props
        confirm({
            title: intl.formatMessage({ id: "system.delete.resource", defaultMessage: "删除资源", description: "删除资源" }),
            content: intl.formatMessage({ id: 'system.delete.this.task', defaultMessage: '你确定删除这个资源吗?', description: '你确定删除这个资源吗?' }),
            onOk: () => this.deleteResourceTask(id),
            onCancel: () => { }
        })
    }
    //表格任务删除
    deleteResourceTask(id) {
        let { userInfo, pageNo, delResource } = this.props
        let data = {
            id: id,
            userId: userInfo.userId
        }
        delResource(data, () => {
            this.getSourceList([], pageNo)
        })
    }
    //表格任务编辑
    editResourceList(record) {
        if (record.type === 4) {
            this.setState({
                tabbaoReasonVisible: true,
                edit: true,
                systemResourceId: record.id,
                tabbaoReasonData: {
                    brandId: record.brandId,
                    relationType: record.relationType, 
                    relationId: record.relationId,
                    reasonId: record.reasonId ? record.reasonId : undefined,
                    tbReason: record.tbReason,
                }
            })
        } else {
            const fileList = [], tempObj = {}
            if (record.vrResource) {
                tempObj.uid = '-1'
                tempObj.name = ''
                tempObj.status = 'done'
                tempObj.url = record.vrResource
                tempObj.thumbUrl = record.vrResource
                fileList[0] = tempObj
            }
            this.setState({
                type: record.type,
                resourceModalVisible: true,
                edit: true,
                fileList,
                systemResourceId: record.id,
                addResourceData: {
                    brandId: record.brandId ? record.brandId : undefined,
                    vrLabel: record.vrLabel ? record.vrLabel : '',
                    vrResource: record.vrResource ? record.vrResource : '',
                    description: record.description ? record.description : '',
                    prodTypeId: record.prodTypeId ? record.prodTypeId : undefined,
                    relationType: record.relationType ? record.relationType : undefined,
                    tbReason: record.tbReason ? record.tbReason : ''
                }
            })
        }
    }

    //显示页面截图
    showModalImg(imgUrl) {
        this.setState({
            showModalVisible: true,
            showModalImg: imgUrl
        })
    }
    handleCancelImg() {
        this.setState({
            showModalVisible: false,
            showModalImg: ''
        })
    }
    //添加Modal
    addResourceModal(type) {
        if (type === 4) {
            this.setState({
                tabbaoReasonVisible: true,
                type,
                fileList: '',
                edit: false,
                tabbaoReasonData: {
                    brandId: undefined,
                    relationType: undefined, 
                    relationId: undefined,
                    reasonId: undefined,
                    tbReason: '',
                },
            })
        } else {
            this.setState({                
                resourceModalVisible: true,
                type,
                fileList: '',
                edit: false,
                addResourceData: {
                    brandId: undefined,
                    relationType: undefined,
                    vrLabel: '',
                    vrResource: '',
                    description: '',
                    tbReason: '',
                    prodTypeId: undefined,
                }
            })
        }
    }
    //modal取消事件
    addResourceModalCancel() {
        this.setState({
            resourceModalVisible: false,
            edit: false,
        })
    }
    //modal确定事件
    addResourceModalOk() {
        let { intl, userInfo, pageNo } = this.props
        let { addResourceData, type, edit, systemResourceId } = this.state
        if (type === 1) {
            addResourceData.prodTypeId = ''
            if (addResourceData.relationType === '' || addResourceData.relationType === undefined) {
                message.info(intl.formatMessage({ id: "clue.report.choose.kind", defaultMessage: "请选择举报类别", description: "请选择举报类别" }))
                return
            }            
            if (addResourceData.brandId === '' || addResourceData.brandId === undefined) {
                message.info(intl.formatMessage({ id: "system.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" }))
                return
            }
            if (addResourceData.vrLabel === '' || addResourceData.vrLabel === undefined) {
                message.info(intl.formatMessage({ id: 'system.trademark.copyright', defaultMessage: '请输入著作权名称', description: '请输入著作权名称' }))
                return
            }
        }
        if (type === 2) {
            addResourceData.relationType = 2                      
            if (addResourceData.brandId === '' || addResourceData.brandId === undefined) {
                message.info(intl.formatMessage({ id: "system.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" }))
                return
            }
            if (addResourceData.vrLabel === '' || addResourceData.vrLabel === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.trademark.number', defaultMessage: '请输入商标号', description: '请输入商标号' }))
                return
            }
            if (addResourceData.description === '' || addResourceData.description === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.trademark.theme', defaultMessage: '请输入商标主题', description: '请输入商标主题' }))
                return
            }
            if (addResourceData.prodTypeId === '' || addResourceData.prodTypeId === undefined) {
                message.info(intl.formatMessage({ id: "system.choose.category", defaultMessage: "请选择商品类目", description: "请选择商品类目" }))
                return
            }
        }
        if (type === 3) {
            addResourceData.prodTypeId = ''
            if (addResourceData.relationType === '' || addResourceData.relationType === undefined) {
                message.info(intl.formatMessage({ id: "clue.report.choose.kind", defaultMessage: "请选择举报类别", description: "请选择举报类别" }))
                return
            }          
            if (addResourceData.brandId === '' || addResourceData.brandId === undefined) {
                message.info(intl.formatMessage({ id: "system.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" }))
                return
            }
            if (addResourceData.vrLabel === '' || addResourceData.vrLabel === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.reason.number', defaultMessage: '请输入理由名称', description: '请输入理由名称' }))
                return
            }
            if (addResourceData.tbReason === '' || addResourceData.tbReason === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.enter.tb.reason', defaultMessage: '请输入淘宝理由', description: '请输入淘宝理由' }))
                return
            }
            
        }
        addResourceData.userId = userInfo.userId
        addResourceData.type = type
        if (edit) {
            let editData = {
                id: systemResourceId,
                vrLabel: addResourceData.vrLabel,
                vrResource: addResourceData.vrResource,
                tbReason: addResourceData.tbReason,
                description: addResourceData.description,
                prodTypeId: addResourceData.prodTypeId,
            }      
            this.props.editResources(editData, () => {
                this.setState({
                    resourceModalVisible: false,
                    edit: false
                })
                this.getSourceList([], pageNo)
            })
        } else {
            this.props.addResource(addResourceData, () => {
                this.setState({
                    resourceModalVisible: false,
                    edit: false
                })
                this.getSourceList([], 1)
            })
        }
    }
    //Modal输入选择事件
    addModalChange(value, type) {
        let tempData = this.state.addResourceData
        tempData[type] = value
        this.setState({
            addResourceData: tempData
        })
    }
    //上传图片
    uploadHandleChange({ fileList }) {
        let tempData = this.state.addResourceData
        if (fileList[0] && fileList[0].response) {
            tempData.vrResource = fileList[0].response.msgCode
        } else {
            tempData.vrResource = ''
        }
        this.setState({
            fileList,
            addResourceData: tempData
        })
    }
    // 导入
    importExcel({ file }) {
        if (file.status === 'done' && file.response.success) {
            let data = {
                type: 0,
                excelType: 8,
                excelUrl: file.response.dataObject,
                excelName: file.name
            };
            this.props.saveExcelData(data)
            // message.info(file.response.msg)
            this.getSourceList([], 1)
        } else if (file.status === 'done' && file.response.success) {
            message.info(file.response.msg)
        } else if (file.status === 'error') {
            message.info('导入失败，请稍后再试。')
        }
    }


    // 关闭自动投诉弹窗
    closeTaobaoReason() {
        this.setState({
            tabbaoReasonVisible: false,
        })
    }

    // 提交自动投诉数据
    taobaoHandleOk(data) {
        let { pageNo } = this.props
        let { edit, systemResourceId } = this.state
        if(edit) { 
            let editData = {
                id: systemResourceId,
                reasonId: data.reasonId,
                relationId: data.relationId,
                tbReason: data.tbReason
            }
            this.props.editResources(editData, () => {
                this.setState({
                    tabbaoReasonVisible: false,
                    edit: false
                })
                this.getSourceList([], pageNo)
            })
        }else {
            this.props.addResource(data, () => {
                this.setState({
                    tabbaoReasonVisible: false,
                    edit: false,
                })
                this.getSourceList([], 1)
            })
        }
    }
    render() {
        let { intl, isFetch, resourceList, total, brandList, resourceTypeList, userInfo, permissionList, getResourceBrand, resourceBrandList, getResourceForData, resourceTraList, reportType, resourceReasonList, prodList } = this.props;
        let { resourceType, ownedBrand, showModalVisible, showModalImg, resourceModalVisible, type, addResourceData, fileList, edit, tabbaoReasonVisible, tabbaoReasonData } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.resource.management', title: '资源管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData} className="resource-content">
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.brand.name", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    showSearch
                                    value={ownedBrand}
                                    onChange={value => this.setState({ ownedBrand: value })}
                                    placeholder={intl.formatMessage({ id: "system.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        brandList && brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "system.type", defaultMessage: "类型", description: "类型" })}>
                                <Select
                                    showSearch
                                    value={resourceType}
                                    dropdownMatchSelectWidth={true}
                                    onChange={value => this.setState({ resourceType: value })}
                                    placeholder={intl.formatMessage({ id: "system.choose.resource.type", defaultMessage: "请选择资源类型", description: "请选择资源类型" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=''><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        resourceTypeList && resourceTypeList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {
                                                    intl.locale === 'en'
                                                        ? opt.dictLabelEn
                                                        : opt.dictLabel
                                                }
                                            </Option>)
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
                <Row className="operation-btns">
                    <Col span={24}>
                        {
                            getButtonPrem(permissionList, '010003002') ?
                                <span>
                                    <Button type="primary" onClick={() => this.addResourceModal(1)}>
                                        <FormattedMessage id="system.add.address" defaultMessage="添加官方地址" description="添加官方地址" />
                                    </Button>
                                    <Button type="primary" onClick={() => this.addResourceModal(2)}>
                                        <FormattedMessage id="system.add.trademark" defaultMessage="添加商标" description="添加商标" />
                                    </Button>
                                    <Button type="primary" onClick={() => this.addResourceModal(3)}>
                                        <FormattedMessage id="system.add.reason" defaultMessage="添加理由" description="添加理由" />
                                    </Button>
                                    <Button type="primary" onClick={() => this.addResourceModal(4)}>
                                        <FormattedMessage id="system.add.tb.reason.description" defaultMessage="添加淘宝理由" description="添加淘宝理由" />
                                    </Button>
                                </span> : ''
                        }
                        {
                            getButtonPrem(permissionList, '010003005') ?
                                <Upload
                                    action={Req.uploadFile}
                                    showUploadList={false}
                                    withCredentials={true}
                                    onChange={(file) => this.importExcel(file)}
                                >
                                    <Button className="upload-inport-style">
                                        <FormattedMessage id="global.import" defaultMessage="导入" description="导入" />
                                    </Button>
                                </Upload> : ''
                        }
                        {
                            getButtonPrem(permissionList, '010003005') ?
                                <a style={{ marginLeft: '15px', color: '#668fff' }} download="资源导入模板" href={Req.downloadExcelTemplate + `?num=1`}>
                                    <FormattedMessage id="global.download.import.template" defaultMessage="下载导入模板" description="下载导入模板" />
                                </a> : ''
                        }
                    </Col>
                </Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={resourceList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
                <PictureModal
                    visible={showModalVisible}
                    onCancel={() => this.handleCancelImg()}
                    showImg={showModalImg}
                />
                <AddResourceModal
                    visible={resourceModalVisible}
                    brandList={brandList}
                    prodList={prodList}
                    addResourceData={addResourceData}
                    reportType={reportType}
                    type={type}
                    onCancel={() => this.addResourceModalCancel()}
                    onOk={() => this.addResourceModalOk()}
                    addModalChange={(value, type) => this.addModalChange(value, type)}
                    uploadHandleChange={(fileList) => this.uploadHandleChange(fileList)}
                    fileList={fileList}
                    edit={edit}
                />
                <AddTaobaoReason 
                    visible={tabbaoReasonVisible}
                    tabbaoReasonData={tabbaoReasonData}
                    resourceBrandList={resourceBrandList}
                    getResourceForData={getResourceForData}
                    getResourceBrand={getResourceBrand}
                    brandList={brandList}
                    reportType={reportType}
                    resourceTraList={resourceTraList}
                    resourceReasonList={resourceReasonList}
                    handleOk={(data) => this.taobaoHandleOk(data)}
                    onCancel={() => this.closeTaobaoReason()}
                    edit={edit}
                />
            </Content>
        )
    }
}
