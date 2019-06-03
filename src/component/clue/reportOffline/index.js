import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Select, DatePicker, Button, Alert, message, Modal } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { formatDateToMs, getButtonPrem, getName, getFormatDate } from '../../../utils/util'
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
import RotaionChart from '../../common/rotationChart/index'
const Option = Select.Option;

export default class ReportOffLine extends Component {
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
            userNameLikeOrMobile: '',
            taskName: '',
            status: undefined,
            address: '',
            showModalVisible: false,
            showModalImg: [],
            searchData: {
                userNameLikeOrMobile: '',
                taskName: '',
                status: '',
                address: '',
                startTime: '',
                endTime: ''
            },
            visibleExcelExport: false,  // 自定义导出数据的弹窗控制
			autoTitleParam: [],  //  自定义数据
            autoPageNum: 100,  // 自定义数据量
            tbName: '举报任务线下线索-'+ getFormatDate('yyyy-MM-dd-hh:mm')
        }
    }

    componentWillMount() {
        if (this.props.history.location.query) {
            let { userNameLikeOrMobile, taskName, status, address, startTime, endTime, searchData } = this.props.history.location.query
            searchData = {
                userNameLikeOrMobile: userNameLikeOrMobile || '',
                taskName: taskName || '',
                status: status || '',
                address: address || '',
                startTime: startTime || '',
                endTime: endTime || '',
            }
            status = status.toString()
            this.setState({
                taskName,
                userNameLikeOrMobile,
                address,
                status,
                startTime,
                endTime,
                searchData
            }, () => this.getReportOffLineList([], 1))
        } else {
            this.getReportOffLineList([], 1)
        }
        if (this.props.getExportExcelTitle) {
            this.props.getExportExcelTitle({excelType: 12})
        }
    }

    // 获取数据
    getReportOffLineList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData);
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getReportOffLineList(oldList, data)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getReportOffLineList([], 1)
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
        let { userNameLikeOrMobile, taskName, status, address, startTime, endTime, searchData } = this.state;
        searchData = {
            userNameLikeOrMobile: userNameLikeOrMobile || '',
            taskName: taskName || '',
            status: status || '',
            address: address || '',
            startTime: startTime || '',
            endTime: endTime || '',
        }
        this.setState({
            searchData
        }, () => this.getReportOffLineList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            userNameLikeOrMobile: '',
            taskName: '',
            address: '',
            startTime: '',
            endTime: '',
            status: ''
        }
        this.setState({
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            userNameLikeOrMobile: '',
            taskName: '',
            status: undefined,
            address: '',
            searchData
        }, () => this.getReportOffLineList([], 1))
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
            onChange: (page, pageSize) => this.getReportOffLineList([], page),
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

    // 显示自定义导出弹窗
	showExportExcelModal() {
		let result = localStorage.getItem('excelImport');
		let { exportExcelTitle } = this.props;
		if (result) {
			result = JSON.parse(result);
			if (!result.clueReportOffline) {
				let autoTitleParam = [];
				for (let i = 0; i < exportExcelTitle.length; i++) {
					const element = exportExcelTitle[i];
					if (element.excelType === 12) {
						autoTitleParam.push(element.num)
					}
				}
				this.setState({
					autoTitleParam,
					visibleExcelExport: true
				})
			} else {
				this.setState({
					autoTitleParam: result.clueReportOffline,
					visibleExcelExport: true
				})
			}
		} else if (!result) {
			let autoTitleParam = [];
			for (let i = 0; i < exportExcelTitle.length; i++) {
				const element = exportExcelTitle[i];
				if (element.excelType === 12) {
					autoTitleParam.push(element.num)
				}
			}
			this.setState({
				autoTitleParam,
				visibleExcelExport: true
			})
		}
	}

	// 确认导出
	confirmExcel(data) {
		let result = localStorage.getItem('excelImport');
		if (!result) {
			result = {}
		} else {
			result = JSON.parse(result);
		}
		result.clueReportOffline = data.autoTitleParam;
		localStorage.setItem('excelImport', JSON.stringify(result))
		this.setState({
			autoTitleParam: data.autoTitleParam,
            autoPageNum: data.autoPageNum,
            tbName: data.tbName,
			visibleExcelExport: false
		}, () => {
			this.exportExcel()
		})
    }

    // 导出
	exportExcel() {
		let { searchData, autoTitleParam, autoPageNum, tbName } = this.state;
		let { saveExcelData, reportTaskOfflineClueStatus } = this.props;
		let queryParamStr = [];
		if (searchData.userNameLikeOrMobile) {
            queryParamStr.push(`举报人:${searchData.userNameLikeOrMobile}`)
        }
        if (searchData.taskName) {
            queryParamStr.push(`任务名称:${searchData.taskName}`)
		} 
		if (searchData.address) {
            queryParamStr.push(`举报地址:${searchData.address}`)
        }
        if (searchData.status) {
            let tortsType = getName(reportTaskOfflineClueStatus,searchData.status);
            queryParamStr.push(`状态:${tortsType.dictLabel}`)
		}
		if (searchData.startTime) {
            queryParamStr.push(`开始时间:${searchData.startTime}`)
        } 
        if (searchData.endTime) {
            queryParamStr.push(`截止时间:${searchData.endTime}`)
        }
		let data = {
			type: 1,
			excelType: 12,
			queryParam: JSON.stringify(searchData),
			queryParamStr: queryParamStr.toString(),
			autoTitleParam: autoTitleParam.toString(),
            autoPageNum,
            tbName
		}
		saveExcelData(data)
	}

    //渲染现场照片
    renderNowOicture(text, record) {
        let icons = [], types = [];
        if (record.mainPics) {
            types = record.mainPics.split(",");
            icons = <img style={{ width: '60px', height: '60px' }} className="checkbox-icon" src={types && types.length ? types[0] : ''} key={0} alt="icon" onClick={() => this.showModalImg(types)} />
        }
        return (
            <div className="table-info">
                <p className="table-item table-item-img" style={{ justifyContent: 'center' }}>
                    {icons}
                </p>
                {
                    types && types.length <= 0 ? '' : (
                        <p style={{ width: '100%' }}>
                            <FormattedMessage id='global.img.data' defaultMessage={`图片共（${types && types.length ? types.length : 0}）条数据`} values={{ count: <b>{types && types.length ? types.length : 0}</b> }} />
                        </p>
                    )
                }
            </div>
        )
    }
    //渲染状态
    renderStatus(text, record) {
        let { intl } = this.props
        return (
            <span>{intl.locale === 'zh' ? record.statusName : record.statusNameEn}</span>
        )
    }
    //渲染操作
    renderOperate(record) {
        let { permissionList } = this.props
        if (record.status === 1) {
            return (
                getButtonPrem(permissionList, '009006002') ?
                    [
                        <a key='pass' onClick={() => this.examineList(record, 'pass')}>
                            <FormattedMessage id="global.pass" defaultMessage="通过" description="通过" />
                        </a>,
                        <br key='br' />,
                        <a key='fail' onClick={() => this.examineList(record, 'fail')}>
                            <FormattedMessage id="global.fail" defaultMessage="不通过" description="不通过" />
                        </a>
                    ] : ''
            )
        }
    }
    // 创建table配置
    createColumns() {
        const columns = [{
            title: <FormattedMessage id="clue.report.owner.task" defaultMessage="所属任务" description="所属任务" />,
            dataIndex: 'taskName',
            width: '10%',
        }, {
            title: <FormattedMessage id="clue.report.brand.name" defaultMessage="所属品牌" description="所属品牌" />,
            dataIndex: 'brandName',
            width: '10%',
        }, {
            title: <FormattedMessage id="clue.online.informant" defaultMessage="举报人" description="举报人" />,
            dataIndex: 'finalName',
            width: '8%',
        }, {
            title: <FormattedMessage id="clue.report.kind" defaultMessage="举报类别" description="举报类别" />,
            dataIndex: 'goodsType',
            width: '8%',
            render: (text, record) => {
                return (
                    <span>
                        {
                            record.reportTypeNameEng ?
                                <FormattedMessage id={record.reportTypeNameEng} defaultMessage={record.reportTypeName} description={record.reportTypeName} />
                                : ''
                        }
                    </span>
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
            width: '10%',
            render: (text, record) => {
                return (<span>{record.reportTime ? record.reportTime.split(' ')[0] : ''}</span>)
            }
        }, {
            title: <FormattedMessage id="clue.report.now.picture" defaultMessage="现场照片" description="现场照片" />,
            dataIndex: 'mainPics',
            width: '10%',
            render: (text, record) => this.renderNowOicture(text, record)
        }, {
            title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
            dataIndex: 'status',
            width: '8%',
            render: (text, record) => this.renderStatus(text, record)
        }, {
            title: <FormattedMessage id="clue.report.note" defaultMessage="备注" description="备注" />,
            dataIndex: 'note',
            width: '8%',
        }, {
            title: <FormattedMessage id="clue.report.brand" defaultMessage="假冒品牌" description="假冒品牌" />,
            dataIndex: 'brand',
            width: '8%',
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            dataIndex: 'operate',
            width: '15%',
            render: (text, record) => this.renderOperate(record)
        }];
        return columns;
    }

    //审核
    examineList(record, type) {
        let { intl, updateOffLineItem, reportOfflineList, userInfo, reportTaskOfflineClueStatus } = this.props
        let status = 0
        if (type === 'pass') {
            status = 2
        } else {
            status = 3
        }
        let statusData = getName(reportTaskOfflineClueStatus, status)
        let data = {
            id: record.id,
            status: status,
            type: 2,
            userId: userInfo.userId,
            statusName: statusData.dictLabel,
            statusNameEn: statusData.dictLabelEn
        }
        updateOffLineItem(data, reportOfflineList, () => {
            message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
        })
    }

    render() {
        let { intl, total, reportOfflineList, isFetch, reportTaskOfflineClueStatus, permissionList, exportExcelTitle } = this.props;
        let { userNameLikeOrMobile, taskName, status, address, showModalVisible, showModalImg, startDate, endDate, visibleExcelExport, autoTitleParam, tbName } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.clues.task.management', title: '线索及任务管理' },
            { link: '', titleId: 'router.offline.task.management.reporting', title: '线下线索管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "clue.online.informant", defaultMessage: "举报人", description: "举报人" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "clue.online.please.informant", defaultMessage: "请输入举报人", description: "请输入举报人" })}
                                    onChange={e => this.setState({ userNameLikeOrMobile: e.target.value.trim() })} value={userNameLikeOrMobile} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "clue.report.task.name", defaultMessage: "任务名称", description: "任务名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "clue.report.please.task.name", defaultMessage: "请输入任务名称", description: "请输入任务名称" })}
                                    onChange={e => this.setState({ taskName: e.target.value.trim() })} value={taskName} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.status", defaultMessage: "状态", description: "状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    value={status}
                                    onChange={val => this.setState({ status: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        reportTaskOfflineClueStatus && reportTaskOfflineClueStatus.filter(item => item.isDel === 0)
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
                            <Form.Item label={intl.formatMessage({ id: "clue.report.address", defaultMessage: "举报地址", description: "举报地址" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "clue.report.please.address", defaultMessage: "请输入举报地址", description: "请输入举报地址" })}
                                    onChange={e => this.setState({ address: e.target.value.trim() })} value={address} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
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
                            getButtonPrem(permissionList, '009006003')
                                ? <Button onClick={() => this.showExportExcelModal()}>
                                    <FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
                                </Button>
                                : ''
                        }
                    </Col>
                </Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={reportOfflineList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
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
                <ExcelExportModal
					onCancel={() => this.setState({ visibleExcelExport: false, autoTitleParam: [] })}
					onOk={data => this.confirmExcel(data)}
					visible={visibleExcelExport}
					data={exportExcelTitle}
					checkedData={autoTitleParam}
					title={intl.formatMessage({ id: "global.export", defaultMessage: "导出", description: "导出" })}
                    total={total}
                    tbName={tbName}
				/>
            </Content>
        )
    }
}
