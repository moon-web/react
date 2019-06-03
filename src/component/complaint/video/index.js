import React, { Component } from 'react'
import { Form, Col, Row, Table, Select, DatePicker, Button, Alert, message, Upload, Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { formatDateToMs, getButtonPrem, getName, getFormatDate } from '../../../utils/util'
import Req from '../../../api/req'
import PictureModal from '../../common/layout/modal/pictureModal';
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
import '../online/index.css'
const Option = Select.Option;

export default class ComplaintVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTimeMs: '',
            endTimeMs: '',
            startDate: null,
            endDate: null,
            startTime: '',//开始时间
            endTime: '',//结束时间
            pageSize: 10,
            videoPlatformId: undefined,
            status: undefined,//投诉状态
            brandId: undefined,
            visible: false,
            screenshotUrl: '',
            searchData: {
                videoPlatformId: '',
                status: '',//投诉状态
                brandId: '',
                gmtComplaintTimeS: '',//开始时间
                gmtComplaintTimeE: ''//结束时间
            },
            visibleExcelExport: false,  // 自定义导出数据的弹窗控制
			autoTitleParam: [],  //  自定义数据
            autoPageNum: 100,  // 自定义数据量
            tbName: '视频投诉-'+ getFormatDate('yyyy-MM-dd-hh:mm')
        }
    }

    componentWillMount() {
        this.getComplaintVideo(1)
        if (this.props.getExportExcelTitle) {
            this.props.getExportExcelTitle({excelType: 7})
        }
    }

    //获取数据
    getComplaintVideo(pageNo) {
        let { searchData, pageSize } = this.state
        let data = Object.assign({}, searchData);
        data.pageNo = pageNo
        data.pageSize = pageSize
        this.props.complaintVideo(data)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getComplaintVideo(1)
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
        let { videoPlatformId, status, brandId, startTime, endTime, searchData } = this.state;
        searchData = {
            videoPlatformId: videoPlatformId || '',
            status: status === undefined ? '' : status,//投诉状态
            brandId: brandId || '',
            gmtComplaintTimeS: startTime || '',//开始时间
            gmtComplaintTimeE: endTime || '',//结束时间
        }
        this.setState({
            searchData
        }, () => this.getComplaintVideo(1))
    }

    // 重置
    handleReset() {
        let searchData = {
            videoPlatformId: '',
            status: '',//投诉状态
            brandId: '',
            gmtComplaintTimeS: '',//开始时间
            gmtComplaintTimeE: ''//结束时间
        }
        this.setState({
            videoPlatformId: undefined,
            status: undefined,
            brandId: undefined,
            startTime: '',
            endTime: '',
            startTimeMs: '',
            endTimeMs: '',
            startDate: null,
            endDate: null,
            searchData
        }, () => this.getComplaintVideo(1))
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
            onChange: (page, pageSize) => this.getComplaintVideo(page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 创建table配置
    createColumns() {
        let { intl } = this.props
        const columns = [{
            title: <FormattedMessage id="system.complaint.platform" defaultMessage="投诉平台" description="投诉平台" />,
            dataIndex: 'videoName',
            key: 'videoName',
            width: '15%',
            render: (text, item) => intl.locale === 'zh' ? item.videoName : item.videoNameEn
        }, {
            title: <FormattedMessage id="complaint.link.address" defaultMessage="链接" description="链接" />,
            dataIndex: 'url',
            key: 'url',
            width: '15%',
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
            title: <FormattedMessage id="complaint.blog" defaultMessage="博客" description="博客" />,
            dataIndex: 'blog',
            key: 'blog',
            width: '15%'
        }, {
            title: <FormattedMessage id="complaint.page.screenshot" defaultMessage="页面截图" description="页面截图" />,
            dataIndex: 'screenshotUrl',
            key: 'screenshotUrl',
            width: '15%',
            render: (text, record) => {
                return (
                    record.screenshotUrl === '0' || record.screenshotUrl === '' ? '' :
                        <div className="wrappser_img">
                            <img src={record.screenshotUrl ? record.screenshotUrl : ''} alt="" style={{ width: '60px', height: '60px' }} onClick={() => this.showModalImg(record.screenshotUrl ? record.screenshotUrl.replace('/_', '/') : '')} />
                        </div>
                )

            }
        }, {
            title: <FormattedMessage id="complaint.brand" defaultMessage="侵权品牌" description="侵权品牌" />,
            dataIndex: 'brandName',
            key: 'brandName',
            width: '15%'
        }, {
            title: <FormattedMessage id="complaint.time" defaultMessage="投诉时间" description="投诉时间" />,
            dataIndex: 'gmtComplaintTime',
            key: 'gmtComplaintTime',
            width: '15%',
        }, {
            title: <FormattedMessage id="complaint.status" defaultMessage="投诉状态" description="投诉状态" />,
            dataIndex: 'statusName',
            key: 'statusName',
            width: '15%',
            render: (text, item) => intl.locale === 'zh' ? item.statusName : item.statusNameEn
        }]
        return columns;
    }

    //导入
    importExcel({ file }) {
        if (file.status === 'done' && file.response.success) {
            let data = {
                type: 0,
                excelType: 5,
                excelUrl: file.response.dataObject,
                excelName: file.name
            };
            this.props.saveExcelData(data)
            // message.info(file.response.msg)
            this.setState({
                pageNo: 1
            }, () => {
                this.getComplaintVideo(1)
            })
        } else if (file.status === 'done' && !file.response.success) {
            message.info(file.response.msg)
        } else if (file.status === 'error') {
            message.info('上传失败，请稍后重试')
        }
    }

    // 显示自定义导出弹窗
	showExportExcelModal() {
		let result = localStorage.getItem('excelImport');
		let { exportExcelTitle } = this.props;
		if (result) {
			result = JSON.parse(result);
			if (!result.complaintVideo) {
				let autoTitleParam = [];
				for (let i = 0; i < exportExcelTitle.length; i++) {
					const element = exportExcelTitle[i];
					if (element.excelType === 7) {
						autoTitleParam.push(element.num)
					}
				}
				this.setState({
					autoTitleParam,
					visibleExcelExport: true
				})
			} else {
				this.setState({
					autoTitleParam: result.complaintVideo,
					visibleExcelExport: true
				})
			}
		} else if (!result) {
			let autoTitleParam = [];
			for (let i = 0; i < exportExcelTitle.length; i++) {
				const element = exportExcelTitle[i];
				if (element.excelType === 7) {
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
		result.complaintVideo = data.autoTitleParam;
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
        let { saveExcelData, vTypeList, brandList, complaintVideoStatusList } = this.props
        let { searchData, autoTitleParam, autoPageNum, tbName } = this.state
        let queryParamStr = [];
        if (searchData.videoPlatformId || searchData.videoPlatformId === 0) {
            let platform = getName(vTypeList,searchData.videoPlatformId);
            queryParamStr.push(`平台:${platform.dictLabel}`)
        } 
        if (searchData.brandId || searchData.brandId === 0) {
            let brandId = getName(brandList,searchData.brandId, 'brand');
            queryParamStr.push(`侵权品牌:${brandId.name}`)
        } 
        if (searchData.status || searchData.status === 0) {
            let status = getName(complaintVideoStatusList,searchData.status);
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
            excelType: 7,
            queryParam: JSON.stringify(searchData),
            queryParamStr: queryParamStr.toString(),
			autoTitleParam: autoTitleParam.toString(),
            autoPageNum,
            tbName
        }
        saveExcelData(data)
    }
    
    //显示页面截图
    showModalImg(imgUrl) {
        this.setState({
            visible: true,
            screenshotUrl: imgUrl
        })
    }
    handleCancelImg() {
        this.setState({
            visible: false,
            screenshotUrl: ''
        })
    }

    render() {
        let { intl, complaintVideoList, vTypeList, brandList, isFetch, total, complaintVideoStatusList, permissionList, exportExcelTitle } = this.props
        let { videoPlatformId, status, brandId, startDate, endDate, visible, screenshotUrl, visibleExcelExport, autoTitleParam, tbName } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.complaint.management', title: '投诉管理' },
            { link: '', titleId: 'router.video.complaint.management', title: '视频投诉管理' }
        ]

        return (
            <Content breadcrumbData={breadcrumbData} className="online-wrapper">
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.platform", defaultMessage: "平台", description: "平台" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "complaint.choose.platform", defaultMessage: "请选择平台", description: "请选择平台" })}
                                    value={videoPlatformId}
                                    onChange={value => this.setState({ videoPlatformId: value })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        vTypeList.filter(item => item.isDel === 0)
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
                            <Form.Item label={intl.formatMessage({ id: "complaint.brand", defaultMessage: "侵权品牌", description: "侵权品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "complaint.choose.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    value={brandId}
                                    onChange={value => this.setState({ brandId: value })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
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
                            <Form.Item label={intl.formatMessage({ id: "complaint.status", defaultMessage: "投诉状态", description: "投诉状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "complaint.choose.type", defaultMessage: "请选择投诉状态", description: "请选择投诉状态" })}
                                    value={status}
                                    dropdownMatchSelectWidth={true}
                                    onChange={value => this.setState({ status: value })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        complaintVideoStatusList && complaintVideoStatusList.filter(item => item.isDel === 0)
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
                <Row className="operation-btns">
                    <Col span={24}>
                        {
                            getButtonPrem(permissionList, '006003002') ?
                                <Upload
                                    action={Req.uploadFile}
                                    showUploadList={false}
                                    withCredentials={true}
                                    onChange={file => this.importExcel(file)}
                                >
                                    <Button className="first upload-inport-style"><FormattedMessage id="global.import" defaultMessage="导入" description="导入" /></Button>
                                </Upload> : ''
                        }

                        {
                            getButtonPrem(permissionList, '006003003')
                                ? <Button onClick={() => this.showExportExcelModal()}>
                                    <FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
                                </Button>
                                : ''
                        }
                        {
                            getButtonPrem(permissionList, '006003002') ?
                                <a style={{ marginLeft: '15px', color: '#668fff' }} download="视频投诉管理导入模板" href={Req.downloadExcelTemplate + `?num=4`}>
                                <FormattedMessage id="global.download.import.template" defaultMessage="下载导入模板" description="下载导入模板" />
                                </a>
                                : ''
                        }
                    </Col>
                </Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={complaintVideoList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
                <PictureModal
                    visible={visible}
                    onCancel={() => this.handleCancelImg()}
                    showImg={screenshotUrl}
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
