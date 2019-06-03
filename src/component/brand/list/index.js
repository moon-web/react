import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Col, Row, Table, Input, Button, Alert, Modal ,message,Select} from 'antd'
import { FormattedMessage ,injectIntl} from 'react-intl'
import Content from '../../common/layout/content/index'
import NewBrandModal from '../common/newBrandModal'
import TagsModal from '../common/tagsModal'
import { getButtonPrem } from '../../../utils/util'
const Option = Select.Option

message.config({
    top: 100,
});
class BrandList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            userName: undefined,//所属品牌商
            name: '',//品牌名称
            screenshotUrl: '',
            modal: false,
            brandName: '',//新增品牌商名
            userId: '',//新增 品牌商的id
            ownerBrand: undefined,
            searchData: {
				userId:'',
				name: ''
            },
            userIddata: undefined,
            tagArr: [],
            modifyId: null
        }
    }

    componentWillMount() {
        let { brandListData, history, pageNo } = this.props
        if (!brandListData.length || (brandListData.length && history.action !== 'POP' && !history.location.query)) {
            this.getBrandList([], 1)
        } else {
            this.getBrandList([], pageNo)
        }
    }

    //获取数据
    getBrandList(oldbrandListData, pageNo) {
        let { searchData, pageSize } = this.state
        let { getBrandListdata } = this.props
        let data = Object.assign({}, searchData);
        data.pageNo = pageNo
        data.pageSize = pageSize
        getBrandListdata(data,oldbrandListData)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getBrandList([], 1)
        })
    }

    // 搜索
    handleSearch() {
        let { userIddata, name, searchData } = this.state;
        searchData = {
            userId: userIddata === undefined ? '' : userIddata,
			name: name || ''
        }
        this.setState({
            searchData
        }, () => this.getBrandList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
			userId: '',
			name: ''
        }
        this.setState({
            userIddata: undefined,
            name: '',
            searchData,
            pageSize: 10,
            pageNo: 1,
        }, () => this.getBrandList([], 1))
    }

    // 创建分页器配置项
    createPaginationOption() {
        let { pageNo, total } = this.props
        let { pageSize } = this.state
        return {
            current: pageNo,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onChange: (page, pageSize) => this.getBrandList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    //取消新增品牌
    cancelOperation() {
        this.setState({
            modal: false,
            ownerBrand: undefined,
            brandName: ''
        })
    }

    //新增信息提交
    submitBrandInfo() {
        let { brandName, userId, } = this.state
        let data = {
            name: brandName,
            userId: userId
        }
        if (data.name === '' || data.name === undefined) {
            message.warning('请输入品牌名称')
            return
        }
        if (data.userId === '' || data.userId === undefined) {
            message.warning('请选择所属品牌商')
            return
        }
        this.props.addBrand(data, () => {
            this.setState({
                brandName: '',
                userId: '',
                ownerBrand: undefined,
                modal: false
            })
            this.getBrandList([], 1)
        })
    }

    //获取品牌modal信息
    getBrandInfo(value, type) {
        if (type === 'ownerBrand') {
            this.setState({
                [type]: value,
                userId: value
            })
        } else {
            this.setState({
                [type]: value
            })
        }
    }

    // 创建table配置
    createColumns() {
        const columns = [
            {
                title: <FormattedMessage id="brand.interaction.name" defaultMessage="品牌名称" />,
                key: 'name',
                dataIndex: 'name',
                width:'14%'
            },
            {
                title: <FormattedMessage id="brand.interaction.brand.owner" defaultMessage="所属品牌商" />,
                dataIndex: 'userName',
                key: 'userName',
                width:'14%'
            },
            {
                title: <FormattedMessage id="brand.interaction.brand.historical" defaultMessage="历史交付量" />,
                dataIndex: 'arrangeNum',
                key:'arrangeNum',
                width:'12%'
            },
            {
                title: <FormattedMessage id="brand.interaction.brand.volume" defaultMessage="当期交付量" />,
                dataIndex: 'arrangeNowNum',
                key:'arrangeNowNum',
                width:'12%'
            },
            {
                title: <FormattedMessage id="brand.delivery.settings" defaultMessage="交付设置" />,
                dataIndex: 'allMonitor',
                key: 'allMonitor',
                width:'23%',
                render: (text,record) => this.renderDeliverSetting(record)
            },
            {
                title: <FormattedMessage id="brand.complaint.settings" defaultMessage="投诉设置"/>,
                dataIndex: 'reportTypeName',
                key: 'reportTypeName',
                width:'14%',
                render: (text,record) => this.renderComplaintSetting(record)
            },
            {
                title: <FormattedMessage id="global.operate" defaultMessage="操作" />,
                width:'11%',
                render: (text, record) => this.renderOperate(record)
            }]
        return columns;
    }

    //渲染交付设置
    renderDeliverSetting(record) {
        return(
            record.deliverTarget || record.gmtStartStr?
                <div>
                    {
                        record.deliverTarget ?
                            <div>{record.deliverTarget}/{record.deliverUnit===1?'月':'周'}</div> : ''
                    }
                    {
                        record.gmtStartStr ?
                        <div>{record.gmtStartStr}~{record.gmtEndStr}</div> : ''
                    }
                    
                </div> : 
                <FormattedMessage id="brand.interaction.brand.no.data" defaultMessage="暂无"/>
        )
    }

    //渲染投诉设置
    renderComplaintSetting(record) {
        let { intl } = this.props
        return(
            record.reportTypeName ?
                <span>
                    {
                        intl.locale === 'en'
                            ? record.reportTypeNameEn
                            : record.reportTypeName
                    }
                </span> : 
                <FormattedMessage id="brand.interaction.brand.no.data" defaultMessage="暂无"/>
        )
    }
    
    //操作
    renderOperate(record) {
        let { permissionList } = this.props
        return(
            <div>
                {
                    getButtonPrem(permissionList,'002001003') ?
                        <div>
                            <Link to={`/brand/edit?id=${record.id}`}>
                                <FormattedMessage id="global.edit" defaultMessage="编辑"/>
                            </Link>
                        </div>
                    : ''
                }
                {
                    getButtonPrem(permissionList,'002001004') ?
                        <div>
                            <a className="operate" onClick={() => this.props.history.push({pathname: '/volunteer/report/task',query: {record}})}>
                                <FormattedMessage id="brand.interaction.brand.total" defaultMessage="查看统计"/>
                            </a>
                        </div> : ''
                }
            </div>
        )
    }

    render() {
        let { intl, isFetch, total, brandListData, brandMerchant, permissionList } = this.props
        let { name, userIddata, modal, brandName, ownerBrand } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.brands.management', title: '品牌管理' },
            { link: '', titleId: 'router.brands.management', title: '品牌管理' },
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'brand.interaction.name', defaultMessage: "品牌名称" })}>
                                <Input placeholder={intl.formatMessage({id: 'please.brand.interaction.name',defaultMessage: '请输入所属品牌'})} onChange={(e) => this.setState({name: e.target.value.trim()})} value={name} onPressEnter={(e) => this.handleSearch()}/>
                            </Form.Item>                    
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'brand.interaction.brand.owner', defaultMessage: "所属品牌商" })}>
                                <Select
                                    placeholder={ intl.formatMessage({ id: "brand.olease.choose.interaction.brand.owner", defaultMessage: "请选择所属品牌商", description: "请选择所属品牌商" })}
                                    onChange={ value => this.setState({ userIddata:value }) }
                                    value={ userIddata }
                                    dropdownMatchSelectWidth={ true }
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        brandMerchant && brandMerchant.map(opt => <Option key={opt.userId} value={opt.userId}>{opt.userName}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                        </Col>
                        <Col span={6}>
                            <div className="search-form-btns">
                                <Button type="primary" onClick={() => this.handleSearch()}>
                                    <FormattedMessage id="global.search" defaultMessage="搜索"/>
                                </Button>
                                <Button onClick={() => this.handleReset()}>
                                    <FormattedMessage id="global.reset" defaultMessage="重置"/>
                                </Button>
                            </div>						
                        </Col>
                    </Row>
                </div>
                {
                    getButtonPrem(permissionList, '002001001') ?
                        <Row className="operation-btns">
                            <Col span={24}>
                                <Button type='primary' onClick={() => this.setState({ modal: true })}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
                            </Col>
                        </Row>
                        : ''
                }
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={brandListData} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey='id' loading={isFetch} />
                <Modal
                    title={intl.formatMessage({ id: "global.add", defaultMessage: "新增" })}
                    visible={modal}
                    onCancel={() => this.cancelOperation()}
                    onOk={() => this.submitBrandInfo()}
                    className="root"
                >
                    <NewBrandModal
                        ownerBrandList={brandMerchant}
                        getBrandInfo={(value, type) => this.getBrandInfo(value, type)}
                        brandName={brandName}
                        ownerBrand={ownerBrand}
                    />
                </Modal>
            </Content>
        )
    }
}
export default injectIntl(BrandList)
