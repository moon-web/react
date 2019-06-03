import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Col, Row, Input, Select, Upload, Button, message, Modal, Icon } from 'antd';
import './index.css';
import Contnet from '../../common/layout/content/index';
import Req from '../../../api/req';
import AddCommodityInformationModal from './common/addCommodityInformationModal'
import PictureModal from '../../common/layout/modal/pictureModal'
import AddEnterprise from './common/addEnterpriseInformation'
import InputNumber from '../../common/form/numberInput'
const { TextArea } = Input;
const Option = Select.Option;
class NewCaseInformation extends Component {
    constructor() {
        super()
        this.state = {
            lawCaseBasicInfo: {
                caseNum: "",//案件编号
                caseSource: undefined,//来源
                reporter: '',//报告人
                tortsType: undefined,//侵权类型
                brandId: undefined,//侵权品牌
                platformType: undefined,//所在平台
                caseType: undefined,//案件类型
                saleProdNum: '',//销售数量
                saleProdPriceStr: '',//销售商品均价
                saleProdMoneyStr: '',//案值
                caseAddr: '',//案件所在地
                suggest: '',//建议
                prodTypeId: undefined,//产品分类 
            },
            fileList: [],//案件报告上传
            legalInstrumentList: [],//法律文书list

            //商品信息数据
            commodityInformationList: [],//商品信息数组
            visible: false,//商品信息新增modal
            commodityInformationStatus: 'add',//商品信息新增编辑状态
            commodityinformationinfo: '',//商品信息inputValue
            fileImgList: [],//上传图片
            activeObj: [],
            editKey: '',

            //新增企业个人信息
            enterpriseStatus: 'add',
            enterpriseVisable: false,
            enterpriseList: [],//新增企业个人信息数组
            enterpriseEditKey: '',
            imgVisible: false,//小图放大modal
            ImageInfo: '',//图片路径

            enterpriseObj: {
                companyName: '',
                legalPerson: '',
                comRegisNumber: '',
                telephone: '',
                idCard: '',
                registerAddr: '',
                wareAddr: '',
                factoryAddr: '',
            }

        }
    }

    componentWillMount() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    //inputOnchange事件给数据值
    getcaseDataInfo(value, type) {
        let lawCaseBasicInfo = this.state.lawCaseBasicInfo
        lawCaseBasicInfo[type] = value
        this.setState({
            lawCaseBasicInfo
        })
    }

    // 整理文件格式
    formattedFileList(fileList, type, status) {
        let result = [];
        if (fileList.length) {
            for (let i = 0; i < fileList.length; i++) {
                const element = fileList[i];
                let item = {}
                if (status === 'file') {
                    item = {
                        fileType: type,
                        fileName: element.name,
                        fileUrl: element.response.dataObject
                    }
                } else {
                    item = {
                        id: element.key,
                        prodName: element.commodityinformationinfo,
                        photoUrl: element.imgurl
                    }
                }
                result.push(item)
            }
        }
        return result;
    }

    //提交信息按钮
    addCaseInformations() {
        let { caseNum, caseSource, reporter, tortsType, brandId, platformType, caseType, saleProdNum, saleProdPriceStr, saleProdMoneyStr, caseAddr, suggest, prodTypeId } = this.state.lawCaseBasicInfo;
        let { fileList, legalInstrumentList, commodityInformationList, enterpriseList } = this.state

        //整合案件报告+法律文书
        let fileListdata = this.formattedFileList(fileList, 1, 'file')
        let legalInstrumentListdata = this.formattedFileList(legalInstrumentList, 2, 'file')
        let lawCaseFileArr = fileListdata.concat(legalInstrumentListdata)
        //商品信息数组
        let lawCaseProdArr = this.formattedFileList(commodityInformationList, 2, 'commodityInformationList')

        if (this.props.errorDetail) {
            message.warning(this.props.errorDetail.errorDetail)
        } else {
            if (brandId === '' || brandId === undefined) {
                message.warn('请选择所属品牌')
                return
            }
            let data = {
                userId: this.props.userInfo.userId,
                lawCaseBasicInfo: {
                    caseNo: caseNum || "",//案件编号
                    reporter: reporter || "",//报告人
                    brandId: brandId || "",//侵权品牌
                    platformType: platformType || "",//所在平台
                    tortsType: tortsType || '',//侵权类型
                    caseType: caseType || "",//案件类型
                    saleProdNum: saleProdNum || "",//销售数量
                    saleProdPriceStr: saleProdPriceStr || "",//销售商品均价
                    saleProdMoneyStr: saleProdMoneyStr || "",//案值
                    caseAddr: caseAddr || "",//案件所在地
                    caseSource: caseSource || "",//来源
                    suggest: suggest || "",//建议
                    prodTypeId: prodTypeId || "",//产品分类
                },
                lawCaseFileArr: lawCaseFileArr,//案件报告+法律文书
                lawCaseProdArr: lawCaseProdArr,//商品信息
                lawCaseCompArr: enterpriseList,//企业信息
            }
            this.props.getSubmitCaseInfo(data)
        }
    }

    //取消信息
    cancel() {
        this.props.history.goBack()
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    //上传案件报告 + 法律文书
    addCaseReport(info, key) {
        let fileList = info.fileList;
        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = file.response.dataObject
            }
            return file
        });
        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.success === true;
            }
            return true;
        });
        fileList = fileList.filter(item => {
            return item.uid !== this.uid
        });
        this.setState({
            [key]: fileList
        })
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    }

    //判断文件上传大小
    beforeUpload(file, fileList) {
        if ((file.size / 1024 / 1024) > 10) {
            message.info('上传文件过大');
            this.uid = file.uid;
            return false;
        }
    }

    //商品信息小图放大
    getPictureImg(img) {
        this.setState({
            imgVisible: true,
            ImageInfo: img
        })
    }


    //商品信息详情
    renderQueryCommodityList(data) {
        let { intl } = this.props
        let CommodityInformation = [];
        data.map((item, key) =>
            CommodityInformation.push(
                <div className="query_item" key={key}>
                    <Row>
                        <Col span={6} offset={18}>
                            <span className="condition_edit" onClick={() => this.editQueryCondition(key, true, 'edit')}>
                                <FormattedMessage id="global.edit" defaultMessage="编辑" />
                            </span>
                            <span className="condition_del" onClick={() => this.delQueryCondition(item.key)}>
                                <FormattedMessage id="global.delete" defaultMessage="删除" />
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ height: 'auto' }}>
                        <Col span={12}>
                            <span className="commodityLable">
                                <FormattedMessage id="case.commodity.information" defaultMessage="商品信息" />:
                            </span>
                            <div className="commodity">
                                <a target="_blank" href={item.commodityinformationinfo ? item.commodityinformationinfo : ''}>{item.commodityinformationinfo ? item.commodityinformationinfo : ''}</a>
                            </div>
                        </Col>
                        {
                            item.imgurl ? (
                                <Col span={12}>
                                    <Form.Item style={{ height: '70px' }} label={intl.formatMessage({ id: "case.upload.img", formatMessage: "上传图片" })}>
                                        <img src={item.imgurl} alt="" style={{ width: '60px', height: '60px' }} onClick={() => this.getPictureImg(item.imgurl)} />
                                    </Form.Item>
                                </Col>
                            ) : ''
                        }
                    </Row>
                </div>
            )
        )
        return CommodityInformation
    }

    //开启商品信息新增modal
    addModalVisible(visible, status) {
        let addCondition = { commodityinformationinfo: '', officialImages: [], imgurl: '', key: Date.now() }
        this.setState({
            visible: visible,
            commodityInformationStatus: status,
            activeObj: addCondition
        })
    }

    //取消商品信息新增
    handleCancel() {
        this.setState({
            visible: false
        })
    }

    //商品信息提交
    commodityInformationSubmit(data) {
        let { commodityInformationStatus, commodityInformationList, editKey } = this.state;
        if (data.commodityinformationinfo === '' || data.commodityinformationinfo === undefined) {
            message.warn('请输入商品信息')
            return
        }
        if (commodityInformationStatus === 'add') {
            commodityInformationList.push(data)
        } else {
            commodityInformationList[editKey] = data
        }
        this.setState({
            commodityInformationList,
            visible: false
        })
    }

    //编辑商品信息
    editQueryCondition(key, visible, commodityInformationStatus) {
        let { activeObj, commodityInformationList } = this.state
        activeObj = commodityInformationList[key]
        this.setState({
            activeObj,
            visible,
            commodityInformationStatus,
            editKey: key
        })
    }

    //删除商品信息
    delQueryCondition(key) {
        let commodityInformationList = this.state.commodityInformationList
        commodityInformationList = commodityInformationList.filter(item => {
            return item.key !== key
        })
        this.setState({
            commodityInformationList
        })
    }

    //新增企业(个人)信息modal
    addEnterpriseStatusVisible(visable, status) {
        let condition = { companyName: '', legalPerson: '', comRegisNumber: '', telephone: '', idCard: '', registerAddr: '', wareAddr: '', factoryAddr: '', id: Date.now() }
        this.setState({
            enterpriseStatus: status,
            enterpriseVisable: visable,
            enterpriseObj: condition
        })
    }

    //取消新增企业个人信息
    enterPriseCancel() {
        this.setState({
            enterpriseVisable: false
        })
    }

    //企业信息确定按钮提交
    enterpriseSubmit() {
        let { enterpriseList, enterpriseStatus, enterpriseEditKey, enterpriseObj } = this.state
        if (enterpriseObj.companyName === '' || enterpriseObj.companyName === undefined) {
            message.warn('请输入公司名称')
            return
        }
        if (enterpriseStatus === 'add') {
            enterpriseList.push(enterpriseObj)
        } else {
            enterpriseList[enterpriseEditKey] = enterpriseObj
        }
        this.setState({
            enterpriseList,
            enterpriseVisable: false
        })
    }

    //新增个人企业信息详情
    renderQueryEnterpriseList(data) {
        let queryEnterpriseList = [];
        let { intl } = this.props
        data.map((item, key) =>
            queryEnterpriseList.push(
                <div className="query_item" key={key}>
                    <Row>
                        <Col span={6} offset={18}>
                            <span className="condition_edit" onClick={() => this.editEnterPriseList(key, true, 'edit')}>
                                <FormattedMessage id="global.edit" defaultMessage="编辑" />
                            </span>
                            <span className="condition_del" onClick={() => this.deleteEnterPrise(item.id)}>
                                <FormattedMessage id="global.delete" defaultMessage="删除" />
                            </span>
                        </Col>
                    </Row>
                    <Row style={{ height: 'auto' }}>
                        {
                            item.companyName ? (
                                <Col span={20}>
                                    <Form.Item label={intl.formatMessage({ id: "case.corporate.name", defaultMessage: "名称" })}>
                                        {item.companyName ? item.companyName : ''}
                                    </Form.Item>
                                </Col>
                            ) : ''
                        }
                        {
                            item.legalPerson ? (
                                <Col span={12}>
                                    <span className="commodityLable">
                                        <FormattedMessage id="case.legal.information" defaultMessage="法人信息" />:
                                    </span>
                                    <div className="commodity">{item.legalPerson}</div>
                                </Col>
                            ) : ''
                        }
                        {
                            item.comRegisNumber ? (
                                <Col span={12}>
                                    <span className="commodityLable">
                                        <FormattedMessage id="case.registration.number" defaultMessage="企业登记号" />:
                                    </span>
                                    <div className="commodity">{item.comRegisNumber}</div>
                                </Col>
                            ) : ''
                        }
                        {
                            item.telephone ? (
                                <Col span={12}>
                                    <span className="commodityLable">
                                        <FormattedMessage id="case.contact.information" defaultMessage="联系方式" />:
                                    </span>
                                    <div className="commodity">{item.telephone}</div>
                                </Col>
                            ) : ''
                        }
                        {
                            item.idCard ? (
                                <Col span={12}>
                                    <span className="commodityLable">
                                        <FormattedMessage id="case.id.number" defaultMessage="身份证号" />:
                                    </span>
                                    <div className="commodity">{item.idCard}</div>
                                </Col>
                            ) : ''
                        }
                        {
                            item.registerAddr ? (
                                <Col span={12}>
                                    <span className="commodityLable">
                                        <FormattedMessage id="case.registered.address" defaultMessage="注册地址" />:
                                    </span>
                                    <div className="commodity">{item.registerAddr}</div>
                                </Col>
                            ) : ''
                        }
                        {
                            item.wareAddr ? (
                                <Col span={12}>
                                    <span className="commodityLable">
                                        <FormattedMessage id="case.warehouse.address" defaultMessage="仓库地址" />:
                                    </span>
                                    <div className="commodity">{item.wareAddr}</div>
                                </Col>
                            ) : ''
                        }
                        {
                            item.factoryAddr ? (
                                <Col span={12}>
                                    <span className="commodityLable">
                                        <FormattedMessage id="case.factory.address" defaultMessage="工厂地址" />:
                                    </span>
                                    <div className="commodity">{item.factoryAddr}</div>
                                </Col>
                            ) : ''
                        }
                    </Row>
                </div>
            )
        )
        return queryEnterpriseList
    }

    //编辑企业个人信息
    editEnterPriseList(key, enterpriseVisable, enterpriseStatus) {
        let { enterpriseObj, enterpriseList } = this.state
        enterpriseObj = enterpriseList[key]
        this.setState({
            enterpriseObj,
            enterpriseVisable,
            enterpriseStatus,
            enterpriseEditKey: key
        })
    }

    //删除企业个人信息
    deleteEnterPrise(key) {
        let enterpriseList = this.state.enterpriseList
        enterpriseList = enterpriseList.filter(item => {
            return item.id !== key
        })
        this.setState({
            enterpriseList
        })
    }

    //验证案件编号
    verificationNumber(e) {
        let { userInfo } = this.props
        let dataInfo = {
            userId: userInfo.userId,
            caseNo: e.target.value.trim()
        }
        this.props.verifyCaseNumber(dataInfo)
    }

    //获取inutValue
    getcommodityinformationinfo(e, type) {
        let enterpriseObj = Object.assign({}, this.state.enterpriseObj);
        enterpriseObj[type] = e.target.value.trim()
        this.setState({ enterpriseObj })
    }

    render() {
        let { brandId, caseNum, caseSource, reporter, tortsType, platformType, prodTypeId, saleProdNum, saleProdPriceStr, saleProdMoneyStr, caseAddr, caseType, suggest } = this.state.lawCaseBasicInfo
        let { intl, brandList, userInfo, listTypeTortSource, listTypeTort, casePlatform, prodList, typecaseList } = this.props
        let { fileList, commodityInformationList, commodityInformationStatus, visible, activeObj, imgVisible, ImageInfo, enterpriseStatus, enterpriseVisable, enterpriseList, legalInstrumentList } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '/case/list', titleId: "router.case.management", title: '案件管理' },
            { link: '', titleId: 'case.new.caseinfomation', title: '新增案件' }
        ];
        return (
            <Contnet breadcrumbData={breadcrumbData}>
                <div className="search-form new-addcase-infomation newCase">
                    <Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label={intl.formatMessage({ id: "case.add.casenum", defaultMessage: "案件编号" })}>
                                    <Input placeholder={intl.formatMessage({ id: "case.please.enter.case.number", defaultMessage: "请输入案件编号" })} onChange={(e) => this.getcaseDataInfo(e.target.value.trim(), 'caseNum')} value={caseNum} onBlur={(e) => this.verificationNumber(e)} />
                                    {this.props.errorDetail ? (<div style={{ color: 'red' }}>{this.props.errorDetail.errorDetail}</div>) : ''}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "monitor.source", defaultMessage: '来源' })}>
                                    <Select
                                        placeholder={intl.formatMessage({ id: "complaint.please.choose.source", defaultMessage: '请选择来源' })}
                                        onChange={(value) => this.getcaseDataInfo(value, 'caseSource')}
                                        value={caseSource}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            listTypeTortSource && listTypeTortSource.filter(item => item.isDel === 0)
                                                .map(opt => <Option key={opt.id} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "case.rapporteur", defaultMessage: "报告人" })}>
                                    <Input placeholder={intl.formatMessage({ id: "case.please.input.the.rapporteur", defaultMessage: "请输入报告人" })} onChange={(e) => { this.getcaseDataInfo(e.target.value.trim(), 'reporter') }} value={reporter} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: '侵权品牌' })}>
                                    <Select
                                        placeholder={intl.formatMessage({ id: "monitor.please.input.picture.rule.brand", defaultMessage: '请选择侵权品牌' })}
                                        onChange={(value) => this.getcaseDataInfo(value, 'brandId')}
                                        value={brandId}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            brandList && brandList.filter(item => item.isDelete === 0)
                                                .map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "monitor.tort.type", defaultMessage: '侵权类型' })}>
                                    <Select
                                        placeholder={intl.formatMessage({ id: "monitor.please.select.the.type.of.infringement", defaultMessage: '请选择侵权类型' })}
                                        onChange={(value) => this.getcaseDataInfo(value, 'tortsType')}
                                        value={tortsType}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            listTypeTort && listTypeTort.filter(item => item.isDel === 0)
                                                .map(opt => <Option key={opt.id} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "global.platform", defaultMessage: '所在平台' })}>
                                    <Select
                                        placeholder={intl.formatMessage({ id: "report.please.select.the.platform", defaultMessage: '请选择所在平台' })}
                                        onChange={(value) => this.getcaseDataInfo(value, 'platformType')}
                                        value={platformType}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            casePlatform && casePlatform.filter(item => item.isDel === 0)
                                                .map(opt => <Option key={opt.id} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "monitor.product.classification", defaultMessage: '产品分类' })}>
                                    <Select
                                        placeholder={intl.formatMessage({ id: "monitor.please.select.product.category", defaultMessage: '请选择产品分类' })}
                                        onChange={(value) => this.getcaseDataInfo(value, 'prodTypeId')}
                                        value={prodTypeId}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            prodList && prodList.filter(item => item.isDel === 0)
                                                .map(opt => <Option key={opt.id} value={opt.id}>{intl.locale === 'zh' ? opt.name : opt.nameEn}</Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "case.sales.volume", defaultMessage: "销售商品数" })}>
                                    <InputNumber 
                                        placeholder={intl.formatMessage({ id: "case.please.enter.the.number.of.sales.items", defaultMessage: "请输入销售商品数" })} 
                                        onChange={value => this.getcaseDataInfo(value, 'saleProdNum')} 
                                        value={saleProdNum} 
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "case.average.selling.price.of.goods", defaultMessage: "销售商品均价" })}>
                                    <InputNumber 
                                        placeholder={intl.formatMessage({ id: "case.please.enter.the.average.selling.price.of.goods", defaultMessage: "请输入销售商品均价" })} 
                                        onChange={value => this.getcaseDataInfo(value, 'saleProdPriceStr')} 
                                        value={saleProdPriceStr}     
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "case.value.of.a.case", defaultMessage: "案值" })}>
                                    <InputNumber 
                                        placeholder={intl.formatMessage({ id: "case.please.enter.the.case.value", defaultMessage: "请输入案值" })} 
                                        onChange={value => this.getcaseDataInfo(value, 'saleProdMoneyStr')} 
                                        value={saleProdMoneyStr}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "case.location.of.case", defaultMessage: "案件所在地" })}>
                                    <Input placeholder={intl.formatMessage({ id: "case.please.enter.the.location.of.the.case", defaultMessage: "请输入案件所在地" })} onChange={(e) => { this.getcaseDataInfo(e.target.value.trim(), 'caseAddr') }} value={caseAddr} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label={intl.formatMessage({ id: "case.type", defaultMessage: '案件类型' })}>
                                    <Select
                                        placeholder={intl.formatMessage({ id: "case.please.please.choose.the.type.of.case", defaultMessage: '请选择案件类型' })}
                                        onChange={(value) => this.getcaseDataInfo(value, 'caseType')}
                                        value={caseType}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            typecaseList && typecaseList.filter(item => item.isDel === 0)
                                                .map(opt => <Option key={opt.id} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Col span={24}>
                            <Form.Item label={intl.formatMessage({ id: "case.uploading.case.report", defaultMessage: "案件相关报告" })}>
                                <Upload
                                    action={Req.uploadFile}
                                    withCredentials={true}
                                    onChange={obj => this.addCaseReport(obj, 'fileList')}
                                    beforeUpload={(file, fileList) => this.beforeUpload(file, fileList)}
                                    multiple={true}
                                    fileList={fileList}
                                    data={{ userId: userInfo.userId }}
                                >
                                    <a className="query_condition" style={{ marginLeft: '0' }}>
                                        <Icon type='upload' />
                                        <FormattedMessage id="case.uploading.case.report" defaultMessage="上传案件相关报告" />
                                    </a>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={intl.formatMessage({ id: "case.legal.documents.no", defaultMessage: "法律文书" })}>
                                <Upload
                                    action={Req.uploadFile}
                                    withCredentials={true}
                                    onChange={obj => this.addCaseReport(obj, 'legalInstrumentList')}
                                    beforeUpload={(file, fileList) => this.beforeUpload(file, fileList)}
                                    multiple={true}
                                    fileList={legalInstrumentList}
                                    data={{ userId: userInfo.userId }}

                                >
                                    <a className="query_condition" style={{ marginLeft: '0' }}>
                                        <Icon type='upload' />
                                        <FormattedMessage id="case.legal.documents" defaultMessage="上传法律文书" />
                                    </a>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={intl.formatMessage({ id: "case.suggest", defaultMessage: "建议" })}>
                                <TextArea rows={10} onChange={(e) => this.getcaseDataInfo(e.target.value, 'suggest')} value={suggest} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={intl.formatMessage({ id: "case.commodity.information", defaultMessage: "商品信息" })}>
                                {
                                    this.renderQueryCommodityList(commodityInformationList)
                                }
                                <a className="query_condition" onClick={() => this.addModalVisible(true, 'add')}>
                                    <Icon type='plus' />
                                    <FormattedMessage id="case.add.merchandise.information" defaultMessage="添加商品信息" />
                                </a>
                                <AddCommodityInformationModal
                                    visible={visible}
                                    handleCancel={() => this.handleCancel()}
                                    commodityInformationSubmit={(data) => { this.commodityInformationSubmit(data) }}
                                    commodityInformationStatus={commodityInformationStatus}
                                    activeObj={activeObj}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={intl.formatMessage({ id: "case.enterprise.personal.information", defaultMessage: "企业(个人)信息" })}>
                                {
                                    this.renderQueryEnterpriseList(enterpriseList)
                                }
                                <a className="query_condition" onClick={() => this.addEnterpriseStatusVisible(true, 'add')}>
                                    <Icon type='plus' />
                                    <FormattedMessage id="case.add.enterprise.personal.information" defaultMessage="添加企业(个人)信息" />
                                </a>
                                <Modal
                                    title={enterpriseStatus === 'add' ?
                                        intl.formatMessage({ id: "case.new.enterprise.personal.information", defaultMessage: "新增(企业)个人信息" }) :
                                        intl.formatMessage({ id: "case.edit.enterprise.personal.information", defaultMessage: "编辑(企业)个人信息" })
                                    }
                                    visible={enterpriseVisable}
                                    onOk={() => this.enterpriseSubmit()}
                                    onCancel={() => this.enterPriseCancel()}
                                    className="root"
                                >
                                    <AddEnterprise enterpriseObj={this.state.enterpriseObj} getcommodityinformationinfo={(e, type) => this.getcommodityinformationinfo(e, type)} />
                                </Modal>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="new-monitoring-rules btns">
                        <Button type="primary" onClick={() => this.addCaseInformations()}>
                            <FormattedMessage id="global.determine" defaultMessage="确定" />
                        </Button>
                        <Button onClick={() => this.cancel()}>
                            <FormattedMessage id="global.cancel" defaultMessage="取消" />
                        </Button>
                    </div>
                    <PictureModal
                        visible={imgVisible}
                        onCancel={() => this.setState({ imgVisible: false, ImageInfo: '' })}
                        showImg={ImageInfo}
                    />
                </div>
            </Contnet>
        )
    }
}
export default injectIntl(NewCaseInformation)