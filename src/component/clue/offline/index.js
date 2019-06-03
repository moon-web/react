import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Select, DatePicker, Button, Alert, message, Modal } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { formatDateToMs } from '../../../utils/util'
import RotaionChart from '../../common/rotationChart/index'
import { getButtonPrem, getName } from '../../../utils/util'
const Option = Select.Option;

export default class OffLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            userName: '',
            goodsType: undefined,
            status: undefined,
            showModalVisible: false,
            showModalImg: '',
            searchData: {
                userNameLikeOrMobile: '',
                goodsType: '',
                gmtStart: '',
                gmtEnd: '',
                status: ''
            }
        }
    }

    componentWillMount() {
        if (this.props.history.location.query) {
            let { userName, goodsType, startTime, endTime, status } = this.props.history.location.query;
            status = status.toString()
            let searchData = {
                userNameLikeOrMobile: userName || '',
                goodsType: goodsType || '',
                gmtStart: startTime || '',
                gmtEnd: endTime || '',
                status: status || ''
            }
            this.setState({
                userName,
                status,
                startTime,
                endTime,
                goodsType: goodsType || '',
                searchData
            }, () => this.getOffLineList([], 1))
        }else {
            this.getOffLineList([], 1) 
        } 
    }

    // 获取数据
    getOffLineList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData);
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getOffLineList(oldList, data)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getOffLineList([], 1)
        })
    }

    // 选择日期
    changeDatePicker(date, dateStr, type) {
        let { startTimeMs, endTimeMs } = this.state;
        if (type === 'startTime') {
            startTimeMs = formatDateToMs(dateStr);
        } else if (type === 'endTime') {
            endTimeMs = formatDateToMs(dateStr)
        }
        if (endTimeMs && (endTimeMs - startTimeMs < 0)) {
            let { intl } = this.props;
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range' }));
            return
        }
        if (type === 'startTime') {
            this.setState({
                startTimeMs,
                startTime: dateStr,
                startDate: date
            })
        } else {
            this.setState({
                endTimeMs,
                endTime: dateStr,
                endDate: date
            })
        }
    }

    // 搜索 
    handleSearch() {
        let { userName, goodsType, status, startTime, endTime, searchData } = this.state;
        searchData = {
            userNameLikeOrMobile: userName,
            goodsType: goodsType === undefined ? '' : goodsType,
            gmtStart: startTime,
            gmtEnd: endTime,
            status: status === undefined ? '' : status
        }
        this.setState({
            searchData
        }, () => this.getOffLineList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            userNameLikeOrMobile: '',
            goodsType: '',
            gmtStart: '',
            gmtEnd: '',
            status: ''
        }
        this.setState({
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            userName: '',
            goodsType: undefined,
            status: undefined,
            searchData
        }, () => this.getOffLineList([], 1))
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
            onChange: (page, pageSize) => this.getOffLineList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
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
            showModalImg: []
        })
    }
    //渲染状态
    renderStatus(text,record) {
        let { intl } = this.props
        return(<span>{intl.locale === 'zh' ? record.statusName : record.statusNameEn}</span>)
    }
    //渲染操作
    renderOperate(text,record) {
        let { permissionList } = this.props
        if(record.status === 1) {
            return(
                getButtonPrem(permissionList, '009002002') ?
                [
                    <a key='pass' onClick={() => this.examineList(record,'pass')}>
                        <FormattedMessage id="global.pass" defaultMessage="通过" description="通过" />
                    </a>,
                    <br key='br' />,
                    <a key='fail' onClick={() => this.examineList(record,'fail')}>
                        <FormattedMessage id="global.fail" defaultMessage="不通过" description="不通过" />
                    </a>
                ] : ''
            )
        }
    }
    // 创建table配置
    createColumns() {
        let { intl } = this.props
        const columns = [{
            title: <FormattedMessage id="clue.online.informant" defaultMessage="举报人" description="举报人" />,
            dataIndex: 'finalName',
            width: '10%',
        }, {
            title: <FormattedMessage id="clue.report.kind" defaultMessage="举报类别" description="举报类别" />,
            dataIndex: 'goodsType',
            width: '10%',
            render: (text,record) => {
                return (
                    intl.locale === 'en'
                        ? record.goodsTypeNameEn
                        : record.goodsTypeName
                )
            }
        }, {
            title: <FormattedMessage id="clue.report.address" defaultMessage="举报地址" description="举报地址" />,
            dataIndex: 'address',
            width: '10%'
        }, {
            title: <FormattedMessage id="clue.report.detail.address" defaultMessage="详细地点" description="详细地点" />,
            dataIndex: 'detailAddress',
            width: '10%'
        }, {
            title: <FormattedMessage id="clue.report.time" defaultMessage="举报时间" description="举报时间" />,
            dataIndex: 'reportTime',
            width: '10%'
        }, {
            title: <FormattedMessage id="clue.report.picture" defaultMessage="缩略图" description="缩略图" />,
            dataIndex: 'mainPics',
            width: '10%',
            render: (text,record) => {
                let imgArrar = []
                imgArrar = record.mainPics.split(',')
                return(
                    <div className="table-info">
                        <p className="table-item table-item-img" style={{justifyContent:'center'}}>
                            <img style={{width: '60px', height: '60px'}} key={0} src={imgArrar && imgArrar.length ? imgArrar[0] : ''} alt=""  onClick={() => this.showModalImg(imgArrar)} /> 
                        </p>
                        {
                            imgArrar && imgArrar.length<=0?'':(
                                <p style={{width:'100%'}}>
                                    <FormattedMessage id ='global.img.data' defaultMessage={ `图片共（${imgArrar && imgArrar.length ? imgArrar.length : 0}）条数据`} values={{count: <b>{imgArrar && imgArrar.length ? imgArrar.length : 0}</b>}}/>
                                </p>
                            )
                        }
                    </div>
                )
            }
        }, {
            title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
            dataIndex: 'status',
            width: '8%',
            render: (text,record) => this.renderStatus(text,record)
        }, {
            title: <FormattedMessage id="clue.report.note" defaultMessage="备注" description="备注" />,
            dataIndex: 'note',
            width: '8%',
        }, {
            title: <FormattedMessage id="clue.report.brand" defaultMessage="假冒品牌" description="假冒品牌" />,
            dataIndex: 'brandName',
            width: '8%',
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            dataIndex: 'operate',
            width: '16%',
            render: (text,record) => this.renderOperate(text,record)
        }];
        return columns;
    }
    
    //审核
    examineList(record,type) {
        let { intl, updateOffLineItem, offLineList, offlineClueStatus } = this.props
        let status = 0
        if(type === 'pass'){
            status = 2
        }else {
            status = 3
        }        
        let statusData = getName(offlineClueStatus,status)
        let data = {
            id: record.id,
            status: status,
            statusName: statusData.dictLabel,
            statusNameEn: statusData.dictLabelEn
        }
        updateOffLineItem(data,offLineList,() => {
            message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
        })
    }

    render() {
        let { intl, total, offLineList, reportKindListType, isFetch, offlineClueStatus } = this.props;
        let { userName, goodsType,  startDate, endDate, status, showModalVisible, showModalImg } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.clues.task.management', title: '线索及任务管理' },
            { link: '', titleId: 'router.offline.clue.tip.off', title: '线下线索管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "clue.online.informant", defaultMessage: "举报人", description: "举报人" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "clue.online.please.informant", defaultMessage: "请输入举报人", description: "请输入举报人" })} 
                                    value={userName} onChange={e => this.setState({ userName: e.target.value.trim() })} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "clue.report.kind", defaultMessage: "举报类别", description: "举报类别" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "clue.report.choose.kind", defaultMessage: "请选择举报类别", description: "请选择举报类别" })}
                                    value={goodsType}
                                    onChange={value => this.setState({ goodsType: value })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        reportKindListType && reportKindListType.map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
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
                            <Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} value={startDate} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} value={endDate} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.status", defaultMessage: "状态", description: "状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    value={status}
                                    onChange={val => this.setState({ status: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        offlineClueStatus && offlineClueStatus.filter(item => item.isDel === 0)
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
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={offLineList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
                <Modal
                    title={intl.formatMessage({ id: "global.picture.details", defaultMessage: "图片详情", description: "图片详情" })}
                    visible={showModalVisible}
                    onCancel={() => this.handleCancelImg()}
                    footer={false}
                    >
                    <RotaionChart
                        imgUrl={showModalImg}
                    />
                </Modal>
            </Content>
        )
    }
}
