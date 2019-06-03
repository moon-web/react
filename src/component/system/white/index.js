import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Button, Alert, Select, Modal, Radio, Upload, message } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { getButtonPrem } from '../../../utils/util'
import Req from '../../../api/req'
import './index.css'
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class WhiteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            platformType: undefined,
            brandId: undefined,
            content1: '',
            searchData: {
                platformType: '',
                brandId: '',
                content1: ''
            },
            visible: false,
            fileUrl: '',
            fileName: '',
            appendOrCover: 11
        }
    }

    componentWillMount() {
        this.getWhiteList([], 1)
    }

    // 获取数据
    getWhiteList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getWhiteList(data, oldList)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getWhiteList([], 1)
        })
    }
    // 搜索
    handleSearch() {
        let { searchData, platformType, brandId, content1 } = this.state;
        searchData = {
            platformType: platformType || '',
            brandId: brandId || '',
            content1: content1 || ''
        }
        this.setState({
            searchData
        }, () => this.getWhiteList([], 1))
    }
    //输入框change事件
    handleChange(value, type) {
        this.setState({
            [type]: value
        })
    }

    // 重置
    handleReset() {
        let searchData = {
            platformType: '',
            brandId: '',
            content1: ''
        }
        this.setState({
            platformType: undefined,
            brandId: undefined,
            content1: '',
            searchData
        }, () => {
            this.getWhiteList([], 1)
        })
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
            onChange: (page, pageSize) => this.getWhiteList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 显示导入弹窗
    showImportModal() {
        this.setState({
            visible: true,
            fileUrl: '',
            fileName: '',
            appendOrCover: 11

        })
    }

    // 确认导入
    handleOk() {
        let { fileUrl, fileName, appendOrCover } = this.state;
        if (!fileUrl) {
            message.info('请选择文件')
        }
        let { saveExcelData } = this.props;
        let data = {
            type: 0,
            excelType: appendOrCover,
            excelUrl: fileUrl,
            excelName: fileName
        };
        if (saveExcelData) {
            saveExcelData(data)
        }
        this.handleCancel()
    }

    // 取消上传
    handleCancel() {
        this.setState({
            visible: false,
            fileUrl: '',
            fileName: '',
            appendOrCover: 11
        })
    }

    // 选择追加or覆盖
    changeRadio(val) {
        this.setState({
            appendOrCover: val
        })
    }

    // 导入
    importExcel({ file }) {
        if (file.status === 'done' && file.response.success) {

            this.setState({
                fileUrl: file.response.dataObject,
                fileName: file.name
            })

            // message.info(file.response.msg)
            // this.getSourceList([], 1)
        } else if (file.status === 'done' && file.response.success) {
            message.info(file.response.msg)
        } else if (file.status === 'error') {
            message.info('导入失败，请稍后再试。')
        }
    }

    // 创建table配置
    createColumns() {
        let { intl } = this.props
        const columns = [{
            title: <FormattedMessage id="system.shop.name" defaultMessage="店铺名称" description="店铺名称" />,
            width: '15%',
            dataIndex: 'content1',
            key: 'dataFrom',
        }, {
            title: <FormattedMessage id="system.platform" defaultMessage="所在平台" description="所在平台" />,
            dataIndex: 'platformTypeName',
            width: '10%',
            render: (text, record) => {
                return (
                    <span>{intl.locale === 'zh' ? record.platformTypeName : record.platformTypeNameEn}</span>
                )
            }
        }, {
            title: <FormattedMessage id="system.shopkeeper" defaultMessage="掌柜用户名" description="掌柜用户名" />,
            dataIndex: 'content2',
            width: '17%',
        }, {
            title: <FormattedMessage id="system.brand.name" defaultMessage="所属品牌" description="所属品牌" />,
            dataIndex: 'brandName',
            width: '17%',
        }, {
            title: <FormattedMessage id="system.type" defaultMessage="类型" description="类型" />,
            dataIndex: 'whiteTypeName',
            width: '16%',
            render: (text, record) => {
                return (
                    <span>{intl.locale === 'zh' ? record.whiteTypeName : record.whiteTypeNameEn}</span>
                )
            }
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            width: '10%',
            render: (text, record) => {
                let { permissionList } = this.props
                return (
                    getButtonPrem(permissionList, '010002003') ?
                        <a onClick={() => this.delWhite(record)}>
                            <FormattedMessage id="global.delete" defaultMessage="删除" description="删除" />
                        </a> : ''
                )
            }
        }];
        return columns;
    }
    //删除
    delWhite(record) {
        let { updateWhiteList, userInfo } = this.props
        let data = {
            userId: userInfo.userId,
            id: record.id
        }
        updateWhiteList(data, () => {
            this.getWhiteList([], 1)
        })
    }

    render() {
        let { intl, isFetch, whiteList, total, brandList, history, permissionList, platfromList } = this.props;
        let { platformType, brandId, content1, visible, fileName, appendOrCover } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.white.list.management', title: '白名单管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "monitor.picture.rule.choose.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    value={brandId}
                                    onChange={(value) => this.handleChange(value, 'brandId')}
                                    showSearch
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
                            <Form.Item label={intl.formatMessage({ id: "system.platform", defaultMessage: "所在平台", description: "所在平台" })}>
                                <Select
                                    value={platformType}
                                    showSearch
                                    placeholder={intl.formatMessage({ id: "system.choose.platform", defaultMessage: "请选择平台", description: "请选择平台" })}
                                    dropdownMatchSelectWidth={true}
                                    onChange={(value) => this.handleChange(value, 'platformType')}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=''><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        platfromList && platfromList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {
                                                    intl.locale === 'en'
                                                        ? opt.dictLabelEn
                                                        : opt.dictLabel
                                                }
                                            </Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.shop.name", defaultMessage: "店铺名称", description: "店铺名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "system.please.enter.shop.name", defaultMessage: "请输入店铺名称", description: "请输入店铺名称" })}
                                    onChange={(e) => this.handleChange(e.target.value.trim(), 'content1')} value={content1} />
                            </Form.Item>
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
                            getButtonPrem(permissionList, '010002002') ?
                                <Button type="primary" onClick={() => history.push('/system/new/white')}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
                                : ''
                        }
                        {
                            getButtonPrem(permissionList, '010002004') ?
                                <Button
                                    className="upload-inport-style"
                                    onClick={() => this.showImportModal()}
                                >
                                    <FormattedMessage id="global.import" defaultMessage="导入" description="导入" />
                                </Button>
                                : ''
                        }
                        {
                            getButtonPrem(permissionList, '010002005')
                                ? <a style={{ marginLeft: '15px', color: '#668fff' }} download="品牌方确认管理导入模板" href={Req.downloadExcelTemplate + `?num=11`}>
                                    <FormattedMessage id="global.download.import.template" defaultMessage="下载导入模板" description="下载导入模板" />
                                </a>
                                : ''
                        }
                    </Col>
                </Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={whiteList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
                <Modal
                    title={intl.formatMessage({id: "system.import.white.excel", defaultMessage:"导入白名单", description:"导入白名单"})}
                    visible={visible}
                    className='import-excel-modal'
                    onOk={() => this.handleOk()}
                    onCancel={() => this.handleCancel()}
                >
                    <div>
                        <Row className='form-row'>
                            <Col span={8} className='label'>
                                <span><FormattedMessage id='system.import.the.way' defaultMessage='导入方式' description='导入方式' /> :</span>
                            </Col>
                            <Col span={16} className='input-wrap'>
                                <RadioGroup
                                    value={appendOrCover}
                                    onChange={e => this.changeRadio(e.target.value)}
                                >
                                    <Radio value={11}><FormattedMessage id='system.additional' defaultMessage='追加' description='追加' /></Radio>
                                    <Radio value={12}><FormattedMessage id='system.cover' defaultMessage='覆盖' description='覆盖' /></Radio>
                                </RadioGroup>
                            </Col>
                        </Row>
                        <Row className='form-row'>
                            <Col span={8} className='label'>
                                <span><FormattedMessage id='system.choose.file' defaultMessage='选择文件' description='选择文件' />:</span>
                            </Col>
                            <Col span={16} className='input-wrap'>
                                {
                                    fileName
                                        ? fileName
                                        : <Upload
                                            action={Req.uploadFile}
                                            showUploadList={false}
                                            withCredentials={true}
                                            onChange={(file) => this.importExcel(file)}
                                        >
                                            <Button>
                                            <FormattedMessage id='system.choose' defaultMessage='选择' description='选择' />
                                            </Button>
                                        </Upload>
                                }
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </Content>
        )
    }
}
