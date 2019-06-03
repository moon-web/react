import React, { Component } from 'react'
import { Button, Input, Select, Radio, Icon, message, Modal, Tooltip, Form, Row, Col } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import PictureModal from '../../common/layout/modal/pictureModal'
import UploadList from '../../common/upload/index'
import Edit from '../../common/editor/editor'
import { getName, queryUrlParams, getFormatDate } from '../../../utils/util';
import './index.css'
const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

export default class ReportAudit extends Component {
    constructor() {
        super()
        this.state = {
            id: '',                     // id
            auditStatus: '',            // 状态
            type: '1',                  // 侵权类型 1盗图 2 商标 3 美术作品
            prodCategoryId: undefined,  // 商品分类ID
            refChannel: '',      // 侵权商标名称/图片
            refChannelId: '',           // 参照渠道ID
            siteToAppear: undefined,    // 商标出现位置
            reportReasonId: '',         // 举报理由ID
            reportReason: '',       // 举报理由名称/图片
            // reportReasonPhoto: '',      // 举报理由截图
            reportReasonPhotoList: [],  // 举报理由截图
            // prodPhoto: '',              // 侵权商品截图
            prodPhotoList: [],          // 侵权商品截图
            officialProdUrl: '',        // 官方商品链接
            // officialProdPhotoUrl: '',   // 官方商品图片
            officialProdPhotoList: [],  // 官方商品图片
            remark: '',                 // 备注
            showImg: '',                // 大图
            visible: false,             // 图片弹窗显示控制
            visibleOperate: false,      // 操作弹窗显示控制
            editType: 'trademark',      // 默认操作弹窗
            result: '',                 // 弹窗操作临时变量
            checkFlag: true,            // 校验链接
            uploadVisible: false,
            uploadList: [],
            uploadListKey: '',
            clearImgs: false,
            auditNoPass: false,//审核不通过弹框
            html: '',
            source: '',
            auditType: '',//审核不通过，驳回类型
        }
    }

    componentWillMount() {
        let id = queryUrlParams('id');
        let reportType = queryUrlParams('reportType');
        let source = queryUrlParams('source')
        let type = parseInt(reportType, 10)
        this.setState({
            id: id,
            reportType: reportType,
            type,
            source
        })
        let data = {
            id: id,
            reportType: reportType
        }
        this.props.queryVReportDetailById(data, () => {
            this.getData()
        })
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps)
    //     if (nextProps.reportDetail !== this.props.reportDetail) {
    //         this.getData(nextProps.reportDetail)
    //     }
    // }

    // 获取详情数据
    getDetail(data) {
        this.props.queryVReportDetailById(data)
    }

    getData() {
        let { reportDetail } = this.props
        if (reportDetail) {
            let { brandId, prodUrl, platformType, prodTypeId, refChannelId, refChannelName, reportReasonId, reportReason, reportReasonPhoto, remark, siteToAppear, reportType, officialProdUrl, officialProdPhoto, prodPhoto } = reportDetail;
            let reportReasonPhotoList = this.formatUploadList(reportReasonPhoto);
            let officialProdPhotoList = this.formatUploadList(officialProdPhoto);
            let prodPhotoList = this.formatUploadList(prodPhoto);
            this.setState({
                //type: reportType,
                brandId,
                prodUrl,
                platformTypeId: platformType,
                prodCategoryId: prodTypeId,
                refChannel: { vrLabel: refChannelName },
                refChannelId,
                reportReason: { vrLabel: reportReason },
                reportReasonId,
                reportReasonPhotoList,
                officialProdUrl,
                officialProdPhotoList,
                prodPhotoList,
                siteToAppear,
                remark,
            }, () => {
                // 默认请求盗图的参照渠道和举报理由
                let data1 = {
                    brandId,
                    type: 1,
                    relationType: reportType
                };
                let data2 = {
                    brandId,
                    type: 3,
                    relationType: reportType
                };
                if (reportType === 2) {
                    data1.type = 2;
                    data1.prodTypeId = prodTypeId;
                    data2.prodTypeId = prodTypeId;
                }
                this.getVrResourcesList(data1)
                this.getVrResourcesList(data2)
                let data = {
                    brandId: brandId
                }
                this.props.getAuditProdList(data)
            })
        }
    }

    // 格式化图片列表
    formatUploadList(str) {
        let temp = [];
        if (str !== '') {
            let result = str.split(',');
            if (result.length) {
                for (let i = 0; i < result.length; i++) {
                    const element = result[i];
                    let obj = {
                        status: 'done',
                        uid: Date.now() + i,
                        type: 'image',
                        response: {
                            success: true,
                            dataObject: element,
                            msgCode: element
                        }
                    }
                    temp.push(obj)
                }
            }
        }
        return temp;
    }

    // 改变选项获取资源
    handleChange(value, key) {
        let { type, brandId = '', prodCategoryId = '' } = this.state;
        this.setData(value, key)
        if (key !== 'type') {
            if (key === 'brandId') {
                brandId = value;
                this.setState({
                    refChannel: '',
                    refChannelId: '',
                    reportReason: '',
                    reportReasonId: '',
                    reportReasonPhotoList: [],
                    prodCategoryId: ''
                })
                let data = {
                    brandId: brandId
                }
                this.props.getAuditProdList(data)
            }
            if (key === 'prodCategoryId') {
                prodCategoryId = value;
                if (type === 2) {
                    this.setState({
                        refChannel: '',
                        refChannelId: '',
                        reportReason: '',
                        reportReasonId: '',
                        reportReasonPhotoList: []
                    })
                }

            }
        }
        if (type === 1) {
            // 盗图
            this.getVrResourcesList({ brandId, type: 1, relationType: 1 })
            this.getVrResourcesList({ brandId, type: 3, relationType: 1 })
        } else if (type === 2) {
            // 商标
            this.getVrResourcesList({ brandId, type: 2, relationType: 2, prodTypeId: prodCategoryId })
            this.getVrResourcesList({ brandId, type: 3, relationType: 2, prodTypeId: prodCategoryId })
        } else if (type === 3) {
            // 美术作品
            this.getVrResourcesList({ brandId, type: 1, relationType: 3 })
            this.getVrResourcesList({ brandId, type: 3, relationType: 3 })
        }
    }

    // 提交确认举报理由、商标
    submitDataToState() {
        let { result, editType } = this.state;
        let { trademarkList, reportReasonList } = this.props;
        let resultData = [], temp = '', key = '';
        if (editType === 'trademark') {
            this.setData(result, 'refChannelId')
            resultData = trademarkList;
            key = 'refChannel';
        } else {
            this.setData(result, 'reportReasonId')
            resultData = reportReasonList;
            key = 'reportReason';
        }
        for (let i = 0; i < resultData.length; i++) {
            const element = resultData[i];
            if (element.id === result) {
                temp = element
            }
        }
        this.setData(temp, key)
        this.setState({
            visibleOperate: false,
            result: ''
        })
    }

    // 获取资源信息
    getVrResourcesList(data) {
        let { getVrResourcesList, userInfo } = this.props;
        data.userId = userInfo.userId;
        getVrResourcesList(data)
    }

    // 输入数据
    setData(value, key) {
        // 如果修改的是商品链接 则重置校验 checkFlag
        if (key === 'prodUrl') {
            this.setState({
                checkFlag: true
            })
        }
        this.setState({
            [key]: value
        })
    }

    // 删除图片
    deleteShopItemImg(file, fileList, key) {
        if (file) {
            let result = fileList.filter(item => {
                return item.uid !== file.uid
            })
            this.setState({ [key]: result })
        }
    }

    // 上传文件转为字符串
    uploadListToString(data) {
        let result = [];
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                if (element.response && element.response.success) {
                    result.push(element.response.msgCode)
                }
            }
        }
        return result.toString()
    }

    // 提交审核
    submitAudit() {
        let { prodUrl, type, brandId, prodCategoryId, siteToAppear, reportReasonId, reportReasonPhotoList, refChannelId, remark, officialProdPhotoList, officialProdUrl, prodPhotoList, id, checkFlag, platformTypeId, source } = this.state;
        let reportReasonPhoto = this.uploadListToString(reportReasonPhotoList);
        let prodPhoto = this.uploadListToString(prodPhotoList);
        let officialProdPhotoUrl = this.uploadListToString(officialProdPhotoList);
        let { modifyVReportDetailById, prodList, newReportList, newReportBaseList, trademarkList, intl, reportConfirmationStatus, reportType, brandList,channelList } = this.props;
        let data = {
            id, 
            reportType: type, 
            prodCategoryId, 
            auditStatus: 6, 
            remark, 
            brandId, 
            refChannelId, 
            reportReasonId,
            platformTypeId,
            reportMgrAuditTime: getFormatDate('yyyy-MM-dd hh:mm:ss'),
            source,
            prodUrl
        }
        let reportTypeTemp = getName(reportType, parseInt(data.reportType, 10))
        data.reportTypeName = reportTypeTemp.dictLabel;
        data.reportTypeNameEn = reportTypeTemp.dictLabelEn;
        let auditStatus = getName(reportConfirmationStatus, data.auditStatus);
        data.auditStatusName = auditStatus.dictLabel;
        data.auditStatusNameEn = auditStatus.dictLabelEn;
        data.brandName = getName(brandList, brandId, 'brand').name
        let prodCategory = getName(prodList, prodCategoryId, 'prod')
        data.prodTypeName = prodCategory.name;
        data.prodTypeNameEn = prodCategory.nameEn;
        data.prodTypeId = prodCategoryId;
        if (!checkFlag) {
            message.info(intl.formatMessage({ id: 'report.product.link.is.invalid.please.reenter.it', defaultMessage: '该商品链接无效，请重新输入' }));
        }
        if (!prodCategoryId) {
            message.info(intl.formatMessage({ id: 'report.please.select.torts.goods.category', defaultMessage: '请选择侵权商品分类' }));
            return;
        } else if (!reportReasonId) {
            message.info(intl.formatMessage({ id: 'report.please.select.report.reason', defaultMessage: '请选择举报理由' }));
            return;
        } else if (!platformTypeId) {
            message.info(intl.formatMessage({ id: 'report.please.select.torts.goods.platform', defaultMessage: '请选择侵权商品平台' }));
            return;
        }
        if (type === 3 && !refChannelId) {
            message.info(intl.formatMessage({ id: 'monitor.please.choose.image.of.infringement', defaultMessage: '请选择侵权形象' }));
            return;
        }
        if (type === 1) {
            if (!refChannelId) {
                message.info(intl.formatMessage({ id: 'report.please.select.channel', defaultMessage: '请选择参照渠道' }));
                return;
            } else if (!prodPhoto) {
                message.info('请上传侵权商品截图');
                return;
            } else if (!officialProdUrl) {
                message.info('请输入官方商品链接');
                return;
            } else if (!officialProdPhotoUrl) {
                message.info('请上传官方商品截图');
                return;
            }
            let refChannel = getName(channelList,refChannelId, 'resource');
            data.refChannelName = refChannel.vrLabel;
            data.refChannelUrl = refChannel.vrResource;
            data.prodPhoto = prodPhoto;
            data.officialProdUrl = officialProdUrl;
            data.officialProdPhotoUrl = officialProdPhotoUrl;
            data.officialProdPhoto = officialProdPhotoUrl;
        } else if (type === 2) {
            if (!refChannelId) {
                message.info('请选择侵权商标');
                return;
            } else if (!siteToAppear) {
                message.info(intl.formatMessage({ id: 'report.please.select.position.of.trademark', defaultMessage: '请选择商标出现位置' }));
                return;
            } else if (!reportReasonId) {
                message.info(intl.formatMessage({ id: 'report.please.select.report.reason', defaultMessage: '请选择举报理由' }));
                return;
            } else if (!reportReasonPhoto) {
                message.info('请上传举报理由截图');
                return;
            }
            let refChannel = getName(trademarkList,refChannelId, 'resource');
            data.refChannelName = refChannel.description;
            data.refChannelUrl = refChannel.vrResource;
            data.siteToAppear = siteToAppear;
            data.reportReasonPhoto = reportReasonPhoto;
        } else if (type === 3) {
            if (!reportReasonPhoto) {
                message.info('请上传举报理由截图');
                return;
            }
            let refChannel = getName(channelList,refChannelId, 'resource');
            data.refChannelName = `${refChannel.vrLabel}(${refChannel.vrResource})`;
            data.reportReasonPhoto = reportReasonPhoto;
        }
        if (modifyVReportDetailById) {
            modifyVReportDetailById(data, newReportList, newReportBaseList)
        }
    }

    // 取消审核
    cancelAudit(type) {
        if(type === 'cancelAudit'){
            this.setState({
                auditNoPass: true,
                auditReason: '',
                auditType: type
            })
        }else {
            this.setState({
                auditNoPass: true,
                rejectReason: '',
                auditType: type
            })
        }
        
    }
    //审核不通过确认，驳回
    auditNoPass() {
        this.setState({
            auditNoPass: false
        })
        let { auditType, id, type, auditReason, rejectReason, source, prodUrl } = this.state       
        let { modifyVReportDetailById, newReportList, newReportBaseList, reportConfirmationStatus } = this.props
        if(auditType === 'cancelAudit') {
            if (modifyVReportDetailById) {
                let data = {
                    id,
                    reportType: type,
                    auditReason,
                    auditStatus: 2,
                    prodUrl
                }
                let auditStatus = getName(reportConfirmationStatus, data.auditStatus);
                data.auditStatusName = auditStatus.dictLabel;
                data.auditStatusNameEn = auditStatus.dictLabelEn;
                data.reportMgrAuditTime = getFormatDate('yyyy-MM-dd hh:mm:ss');
                data.source = source;
                modifyVReportDetailById(data, newReportList, newReportBaseList)
            }
        } else {
            if (modifyVReportDetailById) {
                let data = {
                    id,
                    reportType: type,
                    rejectReason,
                    auditStatus: 9,
                    prodUrl
                }
                let auditStatus = getName(reportConfirmationStatus, data.auditStatus);
                data.auditStatusName = auditStatus.dictLabel;
                data.auditStatusNameEn = auditStatus.dictLabelEn;
                data.reportMgrAuditTime = getFormatDate('yyyy-MM-dd hh:mm:ss');
                data.source = source;
                modifyVReportDetailById(data, newReportList, newReportBaseList)
            }
        }
    }


    checkProdUrl() {
        let { prodUrl, brandId } = this.state;
        let { checkProdUrl } = this.props;
        if (!prodUrl) {
            message.info('请输入商品链接')
        } else {
            this.setState({
                checkFlag: false
            })
            checkProdUrl({ url: prodUrl, brandId: brandId }, () => {
                this.setState({
                    checkFlag: true
                })
            })
        }
    }

    // 获取上传的图片
    getImgSrc(html) {
        let result = [], imgs = [], srcs = [];
        if (html) {
            imgs = html.match(/<img\b.*?(?:>|\/>)/gi);
            if (imgs) {
                for (let i = 0; i < imgs.length; i++) {
                    const element = imgs[i];
                    srcs = element.match(/\bsrc\b\s*=\s*['"]?([^'"]*)['"]?/i);
                    if (srcs) {
                        let data = {
                            type: 'image',
                            response: {
                                success: true,
                                dataObject: srcs[1],
                                msg: "",
                                msgCode: srcs[1]
                            },
                            uid: Date.now() + i
                        }
                        result.push(data)
                    }
                }
            }
        }
        return result;
    }

    // 确认上传
    confirmUpload() {
        let { uploadList, uploadListKey, html } = this.state;
        if (html) {
            let result = this.getImgSrc(html);
            uploadList = uploadList.concat(result);
        }
        this.setData(uploadList, uploadListKey)
        this.cancelUpload()
    }

    // 取消上传
    cancelUpload() {
        // 取消或者确认上传时清空数据
        this.setState({
            uploadVisible: false,
            uploadList: [],
            uploadListKey: '',
            clearImgs: true
        })
    }

    // 显示上传图片弹窗
    showUploadModal(key) {
        // 传入对应的上传数组
        this.setState({
            uploadVisible: true,
            uploadListKey: key,
            uploadList: [].concat(this.state[key]),
            clearImgs: false
        })
    }

    render() {
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '/volunteer/report/List', titleId: 'router.volunteer.report.management', title: '志愿者举报管理', query: { goBack: true } },
            { link: '', titleId: 'router.volunteer.report.audit', title: '志愿者举报审核' }
        ]
        let {
            brandId, type, platformTypeId, prodUrl, prodCategoryId,
            siteToAppear, reportReason, reportReasonPhotoList, refChannelId, refChannel,
            prodPhotoList, officialProdUrl, officialProdPhotoList, remark, showImg,
            visible, visibleOperate, editType, result, uploadVisible, clearImgs,
            reportReasonId, auditNoPass, auditType
        } = this.state;
        let { intl, brandList, platfromList, resourceProdList, channelList, trademarkList, trademarkPosition, reportReasonList, reportDetail } = this.props;
        let modalData = editType === 'trademark' ? trademarkList : reportReasonList;
        return (
            <Content breadcrumbData={breadcrumbData} className="monitor-result-audit report-audit">
                <div className={intl.locale === 'en' ? 'search-form en' : 'search-form'}>
                    {/* 公共 */}
                    <FormItem
                        className='link'
                        label={intl.formatMessage({ id: 'report.report.type', defaultMessage: '举报类型', description: '举报类型' })}
                    >
                        <span>
                            {
                                reportDetail
                                    ? intl.locale === 'en'
                                        ? reportDetail.reportTypeNameEn
                                        : reportDetail.reportTypeName
                                    : ''
                            }

                        </span>
                    </FormItem>
                    <FormItem
                        label={intl.formatMessage({ id: 'report.subordinate.to.the.brand', defaultMessage: '所属品牌', description: '所属品牌' })}
                    >
                        <Select
                            showSearch
                            value={brandId}
                            dropdownMatchSelectWidth={false}
                            onChange={value => this.handleChange(value, 'brandId')}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            placeholder={intl.formatMessage({ id: "monitor.picture.rule.choose.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                        >
                            {
                                brandList && brandList.filter(item => item.isDelete === 0)
                                    .map(opt => <Option value={opt.id} key={opt.id}>{opt.name}</Option>)
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        label={intl.formatMessage({ id: 'report.torts.goods.platform', defaultMessage: '侵权商品平台', description: '侵权商品平台' })}
                    >
                        <Select
                            showSearch
                            value={platformTypeId}
                            dropdownMatchSelectWidth={false}
                            onChange={value => this.setData(value, 'platformTypeId')}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            placeholder={intl.formatMessage({ id: "report.please.select.torts.goods.platform", defaultMessage: "请选择侵权商品平台", description: "请选择侵权商品平台" })}
                        >
                            {
                                platfromList && platfromList.filter(item => item.isDel === 0)
                                    .map(opt => <Option value={opt.dictVal} key={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        className='link'
                        label={intl.formatMessage({ id: 'report.torts.goods.link', defaultMessage: '侵权商品链接', description: '侵权商品链接' })}
                    >
                        <a href={prodUrl} target='_blank'>
                            {prodUrl}
                        </a>
                        <a style={{ marginLeft: 15 }} onClick={() => this.checkProdUrl()} ><FormattedMessage id="report.verification.link" defaultMessage="验证链接" description="验证链接" /></a>
                    </FormItem>
                    {
                        type === 1
                            ? <div className={intl.locale === 'en' ? 'search-form en' : 'search-form'}>
                                {/* 盗图审核 */}
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.torts.goods.category', defaultMessage: '侵权商品类目', description: '侵权商品类目' })}
                                >
                                    <Select
                                        showSearch
                                        value={prodCategoryId ? prodCategoryId : undefined}
                                        dropdownMatchSelectWidth={false}
                                        onChange={value => this.setData(value, 'prodCategoryId')}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        placeholder={intl.formatMessage({ id: "report.please.select.torts.goods.category", defaultMessage: "请选择侵权商品类目", description: "请选择侵权商品类目" })}
                                    >
                                        {
                                            resourceProdList && resourceProdList.filter(item => item.isDel === 0)
                                                .map(opt => <Option value={opt.id} key={opt.id}>{intl.locale === 'en' ? opt.nameEn : opt.name}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.with.reference.to.channel', defaultMessage: '参照渠道', description: '参照渠道' })}
                                >
                                    <ul className="channel-list clearfix">
                                        {
                                            channelList && channelList.filter(item => item.isDel === 0)
                                                .map(opt => (
                                                    <li className={opt.id === refChannelId ? 'channel-item active' : 'channel-item'} onClick={() => this.setData(opt.id, 'refChannelId')} key={opt.id}>
                                                        <p>{opt.vrLabel}</p>
                                                        <p>{opt.vrResource}</p>
                                                    </li>
                                                ))
                                        }
                                    </ul>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.report.reason', defaultMessage: '举报理由', description: '举报理由' })}
                                >
                                    {
                                        reportReason !== ''
                                            ? <Input style={{ marginRight: 10 }} value={reportReason.vrLabel} disabled />
                                            : ''
                                    }
                                    <a onClick={() => this.setState({ visibleOperate: true, editType: 'reason', result: reportReasonId })}>选择</a>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.torts.goods.screenshots', defaultMessage: '侵权商品截图', description: '侵权商品截图' })}
                                >
                                    <a onClick={() => this.showUploadModal('prodPhotoList')}>
                                        <Icon type='upload' />
                                        <FormattedMessage id="case.upload.img" defaultMessage="上传图片" description="上传图片" />
                                    </a>
                                    <UploadList
                                        deleteImg={(file) => this.deleteShopItemImg(file, prodPhotoList, 'prodPhotoList')}
                                        onPreview={(file) => this.setState({ visible: true, showImg: file.response.dataObject.replace(/_/, '')})}
                                        fileList={prodPhotoList}
                                    />
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.links.to.official.merchandise.or.images', defaultMessage: '官方商品/图片链接', description: '官方商品/图片链接' })}
                                >
                                    <Input
                                        value={officialProdUrl}
                                        onChange={e => this.setData(e.target.value.trim(), 'officialProdUrl')}
                                        placeholder={intl.formatMessage({ id: "report.please.enter.links.to.official.merchandise.or.images", defaultMessage: "请输入官方商品/图片链接", description: "请输入官方商品/图片链接" })}
                                    />
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.official.merchandise.or.picture.screenshots', defaultMessage: '官方商品/图片截图', description: '官方商品/图片截图' })}
                                >
                                    <a onClick={() => this.showUploadModal('officialProdPhotoList')}>
                                        <Icon type='upload' />
                                        <FormattedMessage id="case.upload.img" defaultMessage="上传图片" description="上传图片" />
                                    </a>
                                    <UploadList
                                        deleteImg={(file) => this.deleteShopItemImg(file, officialProdPhotoList, 'officialProdPhotoList')}
                                        onPreview={(file) => this.setState({ visible: true, showImg: file.response.dataObject.replace(/_/, '')})}
                                        fileList={officialProdPhotoList}
                                    />
                                </FormItem>
                            </div>
                            : ''
                    }
                    {
                        type === 2
                            ? <div className={intl.locale === 'en' ? 'search-form en' : 'search-form'}>
                                {/* 商标审核 */}
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.torts.goods.category', defaultMessage: '侵权商品类目', description: '侵权商品类目' })}
                                >
                                    <Select
                                        showSearch
                                        value={prodCategoryId ? prodCategoryId : undefined}
                                        dropdownMatchSelectWidth={false}
                                        onChange={value => this.handleChange(value, 'prodCategoryId')}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        placeholder={intl.formatMessage({ id: "report.please.select.torts.goods.category", defaultMessage: "请选择侵权商品类目", description: "请选择侵权商品类目" })}
                                    >
                                        {
                                            resourceProdList && resourceProdList.filter(item => item.isDel === 0)
                                                .map(opt => <Option value={opt.id} key={opt.id}>{intl.locale === 'en' ? opt.nameEn : opt.name}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.torts.trademark', defaultMessage: '侵权商标', description: '侵权商标' })}
                                >
                                    {
                                        refChannelId !== ''
                                            ? <Input style={{ marginRight: 10 }} value={refChannel.vrLabel} disabled />
                                            : ''
                                    }
                                    <a onClick={() => this.setState({ visibleOperate: true, editType: 'trademark', result: refChannelId })} >选择</a>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.position.of.trademark', defaultMessage: '商标出现位置', description: '商标出现位置' })}
                                >
                                    <Select
                                        showSearch
                                        value={siteToAppear}
                                        dropdownMatchSelectWidth={false}
                                        onChange={value => this.setData(value, 'siteToAppear')}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        placeholder={intl.formatMessage({ id: "report.please.select.position.of.trademark", defaultMessage: "请选择商标出现位置", description: "请选择商标出现位置" })}
                                    >
                                        {
                                            trademarkPosition && trademarkPosition.filter(item => item.isDel === 0)
                                                .map(opt => <Option value={opt.dictVal} key={opt.dictVal} >{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.report.reason', defaultMessage: '举报理由', description: '举报理由' })}
                                >
                                    {
                                        reportReason !== ''
                                            ? <Input style={{ marginRight: 10 }} value={reportReason.vrLabel} disabled />
                                            : ''
                                    }
                                    <a onClick={() => this.setState({ visibleOperate: true, editType: 'reason', result: reportReasonId })}>选择</a>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.screenshot.of.reasons.for.reporting', defaultMessage: '举报理由截图', description: '举报理由截图' })}
                                >
                                    <a onClick={() => this.showUploadModal('reportReasonPhotoList')}>
                                        <Icon type='upload' />
                                        <FormattedMessage id="case.upload.img" defaultMessage="上传图片" description="上传图片" />
                                    </a>
                                    <UploadList
                                        deleteImg={(file) => this.deleteShopItemImg(file, reportReasonPhotoList, 'reportReasonPhotoList')}
                                        onPreview={(file) => this.setState({ visible: true, showImg: file.response.dataObject.replace(/_/, '')})}
                                        fileList={reportReasonPhotoList}
                                    />
                                </FormItem>
                            </div>
                            : ''
                    }
                    {
                        type === 3
                            ? <div className={intl.locale === 'en' ? 'search-form en' : 'search-form'}>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.torts.goods.category', defaultMessage: '侵权商品类目', description: '侵权商品类目' })}
                                >
                                    <Select
                                        showSearch
                                        value={prodCategoryId ? prodCategoryId : undefined}
                                        dropdownMatchSelectWidth={false}
                                        onChange={value => this.setData(value, 'prodCategoryId')}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        placeholder={intl.formatMessage({ id: "report.please.select.torts.goods.category", defaultMessage: "请选择侵权商品类目", description: "请选择侵权商品类目" })}
                                    >
                                        {
                                            resourceProdList && resourceProdList.filter(item => item.isDel === 0)
                                                .map(opt => <Option value={opt.id} key={opt.id}>{intl.locale === 'en' ? opt.nameEn : opt.name}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'monitor.image.of.infringement', defaultMessage: '侵权形象', description: '侵权形象' })}
                                >
                                    <ul className="channel-list clearfix">
                                        {
                                            channelList && channelList.filter(item => item.isDel === 0)
                                                .map(opt => (
                                                    <li className={opt.id === refChannelId ? 'channel-item active' : 'channel-item'} onClick={() => this.setData(opt.id, 'refChannelId')} key={opt.id}>
                                                        <p>{opt.vrLabel}</p>
                                                        <p>{opt.vrResource}</p>
                                                    </li>
                                                ))
                                        }
                                    </ul>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.report.reason', defaultMessage: '举报理由', description: '举报理由' })}
                                >
                                    {
                                        reportReason !== ''
                                            ? <Input style={{ marginRight: 10 }} value={reportReason.vrLabel} disabled />
                                            : ''
                                    }
                                    <a onClick={() => this.setState({ visibleOperate: true, editType: 'reason', result: reportReasonId })}>选择</a>
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'report.screenshot.of.reasons.for.reporting', defaultMessage: '举报理由截图', description: '举报理由截图' })}
                                >
                                    <a onClick={() => this.showUploadModal('reportReasonPhotoList')}>
                                        <Icon type='upload' />
                                        <FormattedMessage id="case.upload.img" defaultMessage="上传图片" description="上传图片" />
                                    </a>
                                    <UploadList
                                        deleteImg={(file) => this.deleteShopItemImg(file, reportReasonPhotoList, 'reportReasonPhotoList')}
                                        onPreview={(file) => this.setState({ visible: true, showImg: file.response.dataObject.replace(/_/, '')})}
                                        fileList={reportReasonPhotoList}
                                    />
                                </FormItem>
                            </div>
                            : ''
                    }
                    {/* 公共 */}
                    <FormItem
                        className='remark'
                        label={intl.formatMessage({ id: 'report.note', defaultMessage: '备注', description: '备注' })}
                    >
                        <TextArea
                            value={remark}
                            rows={6}
                            onChange={e => this.setData(e.target.value, 'remark')}
                            placeholder={intl.formatMessage({ id: "report.please.enter.note", defaultMessage: "请输入备注信息", description: "请输入备注信息" })}
                        />
                    </FormItem>
                    <div className="btns">
                        <Button
                            type='primary'
                            onClick={() => this.submitAudit()}
                        >
                            <FormattedMessage id="global.pass" defaultMessage="通过" description="通过" />
                        </Button>
                        <Button
                            onClick={() => this.cancelAudit('cancelAudit')}
                        >
                            <FormattedMessage id="global.fail" defaultMessage="不通过" description="不通过" />
                        </Button>
                        <Button
                            onClick={() => this.cancelAudit('rejectAudit')}
                            className="reject"
                        >
                            <FormattedMessage id="global.reject" defaultMessage="驳回" description="驳回" />
                        </Button>
                    </div>
                </div>
                <Modal
                    title={
                        editType === 'trademark'
                            ? intl.formatMessage({ id: "monitor.choose.trademark", defaultMessage: "选择商标", description: "选择商标" })
                            : intl.formatMessage({ id: "monitor.choose.reason", defaultMessage: "选择理由", description: "选择理由" })
                    }
                    width='880px'
                    visible={visibleOperate}
                    onOk={() => this.submitDataToState()}
                    onCancel={() => this.setState({ visibleOperate: false, result: '' })}
                    className='monitor-result-audit'
                >
                    <div className='modal-info'>
                        <RadioGroup
                            value={result}
                            onChange={e => this.setData(e.target.value, 'result')}
                        >
                            {
                                modalData && modalData.map(opt => (
                                    <Radio key={opt.id} value={opt.id} >
                                        {
                                            opt.vrResource
                                                ? (
                                                    <div className="radio-img">
                                                        <img src={opt.vrResource} alt={opt.typeName} onClick={()=>this.setState({ visible: true, showImg: opt.vrResource.replace('/_','/') })}/>
                                                    </div>
                                                )
                                                : (
                                                    <div className="radio-title">
                                                        {
                                                            opt.type !== 2
                                                                ? opt.vrLabel.length > 7
                                                                    ? (
                                                                        <Tooltip title={opt.vrLabel}>
                                                                            {opt.vrLabel.slice(0, 9)}
                                                                        </Tooltip>
                                                                    )
                                                                    : opt.vrLabel
                                                                : opt.description
                                                        }
                                                    </div>
                                                )
                                        }

                                    </Radio>
                                ))
                            }
                        </RadioGroup>
                    </div>
                </Modal>
                <Modal
                    visible={uploadVisible}
                    title={intl.formatMessage({ id: 'case.upload.img', defaultMessage: '上传图片', description: '上传图片' })}
                    onOk={() => this.confirmUpload()}
                    onCancel={() => this.cancelUpload()}
                    width="70%"
                >
                    <Edit
                        name='upload'
                        menus={[]}
                        clear={clearImgs}
                        onChange={html => this.setState({ html })}
                    />
                </Modal>
                <Modal
                    visible={auditNoPass}
                    title={intl.formatMessage({ id: "report.report.audit", defaultMessage: "举报审核", description: "举报审核" })}
                    onOk={() => this.auditNoPass()}
                    onCancel={() => { this.setState({ auditNoPass: false }) }}
                    className="root"
                >
                    <div className={intl.locale === 'en' ? 'search-form en' : 'search-form'}>
                        <Row>
                            {
                                auditType === 'cancelAudit' ? 
                                <Col span={20}>
                                    <Form.Item label={intl.formatMessage({ id: 'report.refuse.to.reason', defaultMessage: "拒绝理由", description: "拒绝理由" })}>
                                        <Input placeholder={intl.formatMessage({ id: "report.please.enter.refuse.to.reason", defaultMessage: "请输入拒绝理由", description: "请输入拒绝理由" })} value={this.state.auditReason} onChange={e => this.setState({ auditReason: e.target.value.trim() })} />
                                    </Form.Item>
                                </Col> : 
                                <Col span={20}>
                                    <Form.Item label={intl.formatMessage({ id: 'report.reject.to.reason', defaultMessage: "驳回理由", description: "驳回理由" })}>
                                        <Input placeholder={intl.formatMessage({ id: "report.please.enter.reject.to.reason", defaultMessage: "请输入驳回理由", description: "请输入驳回理由" })} value={this.state.rejectReason} onChange={e => this.setState({ rejectReason: e.target.value.trim() })} />
                                    </Form.Item>
                                </Col>
                            }
                            
                        </Row>
                    </div>
                </Modal>
                <PictureModal
                    showImg={showImg}
                    visible={visible}
                    onCancel={() => this.setState({ visible: false, showImg: '' })}
                />
            </Content>
        )
    }
}
