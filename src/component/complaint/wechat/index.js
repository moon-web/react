import React, { Component } from 'react'
import { Form, Col, Row, Table, Select, DatePicker, Button, Alert, message, Upload, Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { formatDateToMs, getButtonPrem, getName, getFormatDate } from '../../../utils/util'
import Req from '../../../api/req'
import PictureModal from '../../common/layout/modal/pictureModal';
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
const Option = Select.Option;

export default class WeChartComplaint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            ownedBrand: undefined,
            pageSize: 10,
            ComplaintStatus: undefined,
            searchData: {
                status: '',
                brandId: '',
                gmtComplaintTimeS: '',
                gmtComplaintTimeE: ''
            },
            PictureIsBlock: false,//图片放大
            isBlockImg: '',
            visibleExcelExport: false,  // 自定义导出数据的弹窗控制
			autoTitleParam: [],  //  自定义数据
            autoPageNum: 100,  // 自定义数据量
            tbName: '微信投诉-'+ getFormatDate('yyyy-MM-dd-hh:mm')
        }
    }

    componentWillMount() {
        this.getWeChartList(1)
        if (this.props.getExportExcelTitle) {
            this.props.getExportExcelTitle({excelType: 6})
        }
    }

    // 获取数据
    getWeChartList(pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData);
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getWeChartList(data)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getWeChartList(1)
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
        let { ComplaintStatus, ownedBrand, startTime, endTime, searchData } = this.state;
        searchData = {
            status: ComplaintStatus === undefined ? '' : ComplaintStatus,
            brandId: ownedBrand || '',
            gmtComplaintTimeS: startTime || '',
            gmtComplaintTimeE: endTime || ''
        }
        this.setState({
            searchData
        }, () => this.getWeChartList(1))
    }

    // 重置
    handleReset() {
        let searchData = {
            status: '',
            brandId: '',
            gmtComplaintTimeS: '',
            gmtComplaintTimeE: ''
        }
        this.setState({
            ComplaintStatus: undefined,
            ownedBrand: undefined,
            startTime: '',
            startDate: null,
            endTime: '',
            endDate: null,
            pageSize: 10,
            searchData
        }, () => this.getWeChartList(1))
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
            onChange: (page, pageSize) => this.getWeChartList(page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 显示自定义导出弹窗
	showExportExcelModal() {
		let result = localStorage.getItem('excelImport');
		let { exportExcelTitle } = this.props;
		if (result) {
			result = JSON.parse(result);
			if (!result.complaintWechat) {
				let autoTitleParam = [];
				for (let i = 0; i < exportExcelTitle.length; i++) {
					const element = exportExcelTitle[i];
					if (element.excelType === 6) {
						autoTitleParam.push(element.num)
					}
				}
				this.setState({
					autoTitleParam,
					visibleExcelExport: true
				})
			} else {
				this.setState({
					autoTitleParam: result.complaintWechat,
					visibleExcelExport: true
				})
			}
		} else if (!result) {
			let autoTitleParam = [];
			for (let i = 0; i < exportExcelTitle.length; i++) {
				const element = exportExcelTitle[i];
				if (element.excelType === 6) {
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
		result.complaintWechat = data.autoTitleParam;
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
    
    //导出
    exportExcel() {
        let { saveExcelData, brandList, complaintWechatStatusList } = this.props;
        let { searchData, autoTitleParam, autoPageNum, tbName } = this.state;
        let queryParamStr = [];
        if (searchData.brandId || searchData.brandId === 0) {
            let brandId = getName(brandList,searchData.brandId, 'brand');
            queryParamStr.push(`侵权品牌:${brandId.name}`)
        } 
        if (searchData.status || searchData.status === 0) {
            let status = getName(complaintWechatStatusList,searchData.status);
            queryParamStr.push(`投诉状态:${status.dictLabel}`)
        }
		if (searchData.gmtComplaintTimeS) {
            queryParamStr.push(`开始时间:${searchData.gmtComplaintTimeS}`)
        }
        if (searchData.gmtComplaintTimeE) {
            queryParamStr.push(`截止时间:${searchData.gmtComplaintTimeE}`)
        }
        let data = {
            type: 1,
            excelType: 6,
            queryParam: JSON.stringify(searchData),
            queryParamStr: queryParamStr.toString(),
			autoTitleParam: autoTitleParam.toString(),
            autoPageNum,
            tbName
        };
        saveExcelData(data)
    }

    //下载投诉管理模板
    ComplaintTemplate = () => {
        window.location.href = `${Req.downloadExcelTemplate}?num=3`;
    }

    //导入
    importExcel({ file }) {
        if (file.status === 'done' && file.response.success) {
            let data = {
                type: 0,
                excelType: 4,
                excelUrl: file.response.dataObject,
                excelName: file.name
            };
            this.props.saveExcelData(data)
            // message.info(file.response.msg)
            this.setState({
                pageNo: 1,
            }, () => {
                this.getWeChartList(this.state.pageNo)
            })
        } else if (file.status === 'done' && !file.response.success) {
            message.info(file.response.msg)
        } else if (file.status === 'error') {
            message.info('上传失败，请稍后重试')
        }
    }

    //打开缩略图
    openScreenshotUrl(img) {
        this.setState({
            PictureIsBlock: true,
            isBlockImg: img
        })
    }

    //关闭缩略图
    closeScreenshotUrl() {
        this.setState({
            PictureIsBlock: false,
            isBlockImg: ''
        })
    }

    // 创建table配置
    createColumns() {
        let { intl } = this.props
        const columns = [{
            title: <FormattedMessage id="complaint.account.name" defaultMessage="账号名称" description="账号名称" />,
            dataIndex: 'name',
            key: 'name',
        }, {
            title: <FormattedMessage id="complaint.link.address" defaultMessage="链接" description="链接" />,
            key: 'link',
            render: (text, record) => {
                return (
                    <div className="table-info">
                        <p className="table-item">
                            <span className="item-link">
                                <Tooltip placement="topLeft">
                                    <a href={record.url} target="_blank" className="recorda">{record.url}</a>
                                </Tooltip>
                            </span>
                        </p>
                    </div>
                )
            }
        }, {
            title: <FormattedMessage id="complaint.page.screenshot" defaultMessage="页面截图" description="页面截图" />,
            key: 'screenshot',
            render: (text, record) => {
                return (
                    record.screenshotUrl === '0' || record.screenshotUrl === '' ? '' :
                        <div className="wrappser_img">
                            <img src={record.screenshotUrl ? record.screenshotUrl : ''} alt="" style={{ width: '60px', height: '60px' }} onClick={() => this.openScreenshotUrl(record.screenshotUrl ? record.screenshotUrl.replace('/_', '/') : '')} />
                        </div>
                )
            }
        }, {
            title: <FormattedMessage id="complaint.account.type" defaultMessage="账号类型" description="账号类型" />,
            dataIndex: 'typeName',
            key: 'typeName',
            render: (text, item) => intl.locale === 'zh' ? item.typeName : item.typeNameEn
        }, {
            title: <FormattedMessage id="complaint.brand" defaultMessage="侵权品牌" description="侵权品牌" />,
            dataIndex: 'brandName',
            key: 'brandName'
        }, {
            title: <FormattedMessage id="complaint.time" defaultMessage="投诉时间" description="投诉时间" />,
            dataIndex: 'gmtComplaintTime',
            key: 'gmtComplaintTime'
        }, {
            title: <FormattedMessage id="complaint.status" defaultMessage="投诉状态" description="投诉状态" />,
            dataIndex: 'statusName',
            key: 'statusName',
            render: (text, item) => intl.locale === 'zh' ? item.statusName : item.statusNameEn
        }];
        return columns;
    }

    render() {
        let { intl, total, WechartcomplainList, brandList, isFetch, complaintWechatStatusList, permissionList, exportExcelTitle } = this.props;
        let { ComplaintStatus, ownedBrand, startDate, endDate, PictureIsBlock, isBlockImg, visibleExcelExport, autoTitleParam, tbName } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: "router.complaint.management", title: '投诉管理' },
            { link: '', titleId: "router.wechat.complaint.management", title: '微信投诉管理' },
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "complaint.brand", defaultMessage: "侵权品牌", description: "侵权品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "complaint.choose.brand", defaultMessage: "请选择侵权品牌", description: "请选择侵权品牌" })}
                                    value={ownedBrand}
                                    onChange={value => this.setState({ ownedBrand: value })}
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
                            <Form.Item label={intl.formatMessage({ id: "complaint.status", defaultMessage: "投诉状态", description: "投诉状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "complaint.choose.type", defaultMessage: "请选择投诉状态", description: "请选择投诉状态" })}
                                    value={ComplaintStatus}
                                    dropdownMatchSelectWidth={true}
                                    onChange={value => this.setState({ ComplaintStatus: value })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        complaintWechatStatusList && complaintWechatStatusList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}
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
                        <Col span={6} offset={18}>
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
                    <Col span={24} >
                        {
                            getButtonPrem(permissionList, '006002001') ?
                                <Upload
                                    action={Req.uploadFile}
                                    showUploadList={false}
                                    withCredentials={true}
                                    onChange={obj => this.importExcel(obj)}
                                >
                                    <Button className="first upload-inport-style"><FormattedMessage id="global.import" defaultMessage="导入" description="导入" /></Button>
                                </Upload> : ''
                        }
                        {
                            getButtonPrem(permissionList, '006002002')
                                ? <Button onClick={() => this.showExportExcelModal()}>
                                    <FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
                                </Button>
                                : ''
                        }
                        {
                            getButtonPrem(permissionList, '006002001') ?
                                <a style={{ marginLeft: '15px', color: '#668fff' }} download="微信投诉管理导入模板" href={Req.downloadExcelTemplate + `?num=3`}>
                                <FormattedMessage id="global.download.import.template" defaultMessage="下载导入模板" description="下载导入模板" />
                                </a>
                                : ''
                        }
                    </Col>
                </Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={WechartcomplainList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
                <PictureModal
                    visible={PictureIsBlock}
                    onCancel={() => this.closeScreenshotUrl()}
                    showImg={isBlockImg}
                />
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
