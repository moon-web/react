import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Row, Col, Button, Alert, Table, DatePicker, message, Select } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import '../common/index.css'
import { formatDateToMs, getButtonPrem, getName } from '../../../utils/util'
import moment from 'moment'
const FormItem = Form.Item;
const Option = Select.Option;
export default class ReportTask extends Component {
	constructor() {
		super()
		this.state = {
            pageSize: 10,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            brandId: undefined,
            status: undefined, 
            userName: '',
            taskName: '',
            type: undefined,
            searchData: {
                brandId: '',
                type: '',
                status: '',
                startTime: '',
                endTime: ''
            },
        }
        
	}

	componentWillMount() {
        let { history, reportTaskList,searchData,pageSize } = this.props
		if (!reportTaskList.length || (reportTaskList.length && history.action !== 'POP' && !history.location.query)) {
            this.getReportTaskList([], 1)
        }else {
            this.setState({
                searchData,
                brandId: searchData.brandId || undefined,
                type: searchData.type || undefined,
                status: searchData.status || undefined,
                startTime: searchData.startTime,
                endTime: searchData.endTime,
                startDate: searchData.startTime ? moment(searchData.startTime, "YYYY-MM-DD") : null,
                endDate: searchData.endTime ? moment(searchData.endTime, "YYYY-MM-DD") : null,
                pageSize,
            })
        }
    }

    // 获取数据
    getReportTaskList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData);
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getReportTaskList(data, oldList)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getReportTaskList([], 1)
        })
    }
    // 搜索
    handleSearch() {
        let { searchData, brandId, type, status, startTime, endTime } = this.state;
        searchData = {
            brandId: brandId === undefined ? '' : brandId,
            type: type === undefined ? '' : type,
            status: status === undefined ? '' : status,
            startTime: startTime,
            endTime: endTime
        }
        this.setState({
            searchData
        }, () => this.getReportTaskList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            brandId: '',
            type: '',
            status: '',
            startTime: '',
            endTime: ''
        }
        this.setState({
            pageSize: 10,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            status: undefined, 
            brandId: undefined,
            type: undefined,
            searchData
        }, () => this.getReportTaskList([], 1))
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
            onChange: (page, pageSize) => this.getReportTaskList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
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
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range', defaultMessage: "请选择有效的时间范围", description: "请选择有效的时间范围" }));
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

    //渲染任务类型
    renderTaskType(text,record) {
        let { intl } = this.props
        return(<span>{intl.locale === 'zh' ? record.typeName : record.typeNameEn}</span>)
    }
    //渲染任务状态
    renderStatus(text,record) {
        let { intl } = this.props
        return(<span>{intl.locale === 'zh' ? record.statusName : record.statusNameEn}</span>)
    }
    //渲染操作
    renderOperation(text,record) {
        let { permissionList } = this.props
        if(record.status === 1) {
            return(
                <div className="system-table-resource">
                {
                    getButtonPrem(permissionList, '009003003') ? 
                    <span onClick={() => this.endTask(record)}><a><FormattedMessage id="clue.report.task.end.task" defaultMessage="结束任务" description="结束任务" /></a></span>
                    : ''
                }
                </div>
            )
        }
    }
    // 创建table配置
    createColumns() {
        let { permissionList } = this.props
        const columns = [{
            title: <FormattedMessage id="clue.report.task.name" defaultMessage="任务名称" description="任务名称" />,
            dataIndex: 'name',
            width: '17%',
            render:(text,record)=>{
                return(
                    getButtonPrem(permissionList,'009003004') ?
                        <Link to={`/clue/report/task/detail?id=${record.id}`}>
                            {record.name}
                        </Link> : <span style={{color:'#668fff'}}>{record.name}</span>
                )
            }
        }, {
            title: <FormattedMessage id="clue.report.brand.name" defaultMessage="所属品牌" description="所属品牌" />,
            width: '17%',
            dataIndex: 'brandName',
        },{
            title: <FormattedMessage id="clue.report.task.type" defaultMessage="任务类型" description="任务类型" />,
            dataIndex: 'type',
            width: '17%',
            render: (text,record) => this.renderTaskType(text,record)
        }, {
            title: <FormattedMessage id="clue.report.task.creation.time" defaultMessage="创建时间" description="创建时间" />,
            dataIndex: 'gmtCreate',
            width: '17'
        }, {
            title: <FormattedMessage id="clue.report.task.state" defaultMessage="任务状态" description="任务状态" />,
            dataIndex: 'status',
            width: '17%',
            render: (text,record) => this.renderStatus(text,record)
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            width: '15%',
            render: (text,record) => this.renderOperation(text,record)
        }];
        return columns;
    }
    //结束任务
    endTask(record) {
        let { updateEndTask, intl, userInfo, reportTaskList, reportTaskStatus } = this.props
        let statusData = getName(reportTaskStatus,2, '')
        let data = {
            userId: userInfo.userId,
            id: record.id,
            status: 2,
            statusName: statusData.dictLabel,
            statusNameEn: statusData.dictLabelEn
        }
        updateEndTask(data, reportTaskList, () => {
            message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
        })
    }
	render() {
        let { intl, isFetch, reportTaskList, total, brandList, history, permissionList, reportTaskType, reportTaskStatus  } = this.props;
        let { type, status, brandId } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.clues.task.management', title: '线索及任务管理' },
            { link: '', titleId: 'router.report.task.management', title: '举报任务管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>                        
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "clue.report.brand.name", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "clue.report.choose.brand.name", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    value={brandId}
                                    onChange={value => this.setState({ brandId: value })}
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
                            <FormItem label={intl.formatMessage({ id: "clue.report.task.type", defaultMessage: "任务类型", description: "任务类型" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "clue.report.choose.task.type", defaultMessage: "请选择任务类型", description: "请选择任务类型" })}
                                    value={type}
                                    onChange={value => this.setState({ type: value })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        reportTaskType && reportTaskType.filter(item => item.isDel === 0)
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
                            <Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} value={this.state.startDate} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} value={this.state.endDate} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>                          
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "clue.report.task.state", defaultMessage: "任务状态", description: "任务状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    value={status}
                                    onChange={val => this.setState({ status: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        reportTaskStatus && reportTaskStatus.filter(item => item.isDel === 0)
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
                        <Col span={6}></Col>
                        <Col span={6}></Col>
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
                        getButtonPrem(permissionList, '009003002') ? 
                            <Button type="primary" onClick={() => history.push('/clue/new/task')}><FormattedMessage id="clue.report.task.release.task" defaultMessage="发布任务" description="发布任务" /></Button>
                        : ''
                    }
                    </Col>
				</Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={reportTaskList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
            </Content>
        )
	}
}
