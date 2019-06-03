import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Button, Alert, message, Select, Modal } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { getButtonPrem , getName} from '../../../utils/util'
import AddAccount from './children/addAccount'
import CookieModal from './children/cookieModal'
import BindModal from './children/bindModal'
import './index.css'
const Option = Select.Option;
const confirm = Modal.confirm;

export default class SystemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            id: '',
            edit: true,
            userName: '',
            addModalVisible: false,
            bindVisible: false,
            platformId: undefined,
            accountId: '',
            searchData: {
                userName: '',
                platformId: '',
            },
            addComplaintAccount: {
                userName: '',
                password: '',
                cookie: '',
                platformId: [],
            },
            bindBrandData: {
                userName: '',
                userId: undefined,
                id: ''
            },
            cookieModalVisible: false,
            modalCookie: '',
        }
    }

    componentWillMount() {
        this.getComplaintAccountList([], 1)
    }

    // 获取数据
    getComplaintAccountList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        searchData.pageSize = pageSize;
        searchData.pageNo = pageNo;
        this.props.getComplaintAccountList(searchData, oldList)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getComplaintAccountList([], 1)
        })
    }

    // 搜索
    handleSearch() {
        let { searchData, userName, platformId } = this.state;
        searchData = {
            userName: userName || '',
            platformId: platformId || '',
        }
        this.setState({
            searchData
        }, () => this.getComplaintAccountList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            userName: '',
            platformId: ''
        }
        this.setState({
            userName: '',
            platformId: undefined,
            searchData
        }, () => this.getComplaintAccountList([], 1))
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
            onChange: (page, pageSize) => this.getComplaintAccountList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }
     
    //解除关联
    getOffBind(record,type) {
        let bindBrandData = {
            id: record.id,
            userId: -1                
        }
        let { complaintBindBrand, pageNo } = this.props
        complaintBindBrand(bindBrandData,() => {
            let bindBrandData = {
                userName: '',
                userId: undefined,
                id: ''
            }
            this.setState({
                bindVisible: false,
                bindBrandData
            })
            this.getComplaintAccountList([], pageNo)
        })
    }
    //解除关联确定按钮
    getOffBindData(record, type) {
        let { intl } = this.props
        confirm({
            title: intl.formatMessage({ id: "complaint.remove.bind.account.role", defaultMessage: "解除关联品牌商", description: "解除关联品牌商" }),
            content: intl.formatMessage({ id: 'complaint.remove.bind.account.role.sure', defaultMessage: '你确定解除关联的品牌商?', description: '你确定解除关联的品牌商?' }),
            onOk: () => this.getOffBind(record,type),
            onCancel: () => { }
        })
    }
    //关联品牌商
    getBindData(record) {
        let bindBrandData = {
            userName: record.userName,
            id: record.id,
            userId: undefined                
        }
        this.setState({
            bindVisible: true,
            bindBrandData
        })
    }
    //取消关联品牌商modal
    onCancelBind() {
        let bindBrandData = {
            userName: '',
            userId: undefined,
            id: ''
        }
        this.setState({
            bindVisible: false,
            bindBrandData
        })
    }
    
    //确定关联品牌商modal
    onOkBind(){
        let { intl } = this.props
        let { bindBrandData } = this.state
        let { complaintBindBrand, pageNo } = this.props
        let data = {
            id: bindBrandData.id,
            userId: bindBrandData.userId,
        }
        if(bindBrandData.userId === undefined || bindBrandData.userId === ''){
            message.info(intl.formatMessage({ id: 'complaint.please.bind.account.role', defaultMessage: '请选择关联品牌商', description:'请选择关联品牌商' }))
            return
        }
        complaintBindBrand(data,() => {
            let bindBrandData = {
                userName: '',
                userId: undefined,
                id: ''
            }
            this.setState({
                bindVisible: false,
                bindBrandData
            })
            this.getComplaintAccountList([], pageNo)
        })
    } 
    //modal关联品牌 chnage事件
    bindModalChange(value, type) {
        let tempData = this.state.bindBrandData
        tempData[type] = value
        this.setState({
            bindBrandData: tempData
        })
    } 

    //获取自动cookie
    getCookieNum(id) {
        let data={
            ids:id
        }
        let { getCookitNumData ,complaintAccountList} = this.props
        getCookitNumData(data,complaintAccountList)
    }
    //自动投诉开启
    getAutomatedComplaint(id) {
        let { intl } = this.props
        confirm({
            title: intl.formatMessage({ id: "complaint.auto", defaultMessage: "开启自动投诉", description: "开启自动投诉" }),
            content: intl.formatMessage({ id: 'complaint.auto.sure', defaultMessage: '你确定开启自动投诉?', description: '你确定开启自动投诉?' }),
            onOk: () => this.getAutomatedComplaintOk(id, 1),
            onCancel: () => { }
        })
    }
    //自动投诉关闭
    getTurnDownAutomatedComplaint(id) {
        let { intl } = this.props
        confirm({
            title: intl.formatMessage({ id: "complaint.auto.turn.domn", defaultMessage: "关闭自动投诉", description: "关闭自动投诉" }),
            content: intl.formatMessage({ id: 'complaint.auto.sure.turn.domn', defaultMessage: '你确定关闭自动投诉?', description: '你确定关闭自动投诉?' }),
            onOk: () => this.getAutomatedComplaintOk(id, 0),
            onCancel: () => { }
        })
    }
    //自动投诉确定开启或关闭
    getAutomatedComplaintOk(id, type) {
        let { getAutomatedComplaintData, complaintAccountList } = this.props
        let data = {
            id: id,
            isAllowedAutoComplaint: type
        } 
        getAutomatedComplaintData(data, complaintAccountList)
    }

    //渲染操作
    renderOperate(record) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    getButtonPrem(permissionList, '006004003') ?
                        <div>
                            <a onClick={() => this.complaintAccountEdit(record)}>
                                <FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" />
                            </a>
                        </div> : ''
                }
                {
                    getButtonPrem(permissionList, '006004003') ?
                        <div>
                            <a onClick={() => this.showDeleteConfirm(record)}>
                                <FormattedMessage id="global.delete" defaultMessage="删除" description="删除" />
                            </a>
                        </div> : ''
                }
                {
                    getButtonPrem(permissionList, '006004005') ? 
                        record.userId ?
                            <div>
                                <a onClick={() => this.getOffBindData(record,'off')}>
                                    <FormattedMessage id="complaint.remove.bind.account.role" defaultMessage="解除关联" description="解除关联" />
                                </a>
                            </div> : 
                            <div>   
                                <a onClick={() => this.getBindData(record)}>
                                    <FormattedMessage id="complaint.bind.account.role" defaultMessage="关联品牌商" description="关联品牌商" />
                                </a>
                            </div>
                        : ''
                }      
                {
                    getButtonPrem(permissionList, '006004005') ?
                        record.sign === 1 ? '' :
                            <div>
                                <a onClick={() => this.getPullLineData(record)}>
                                    <FormattedMessage id="system.pull.line.data" defaultMessage="下拉线上数据" description="下拉线上数据" />
                                </a> 
                            </div> : ''
                }                          
                {
                    getButtonPrem(permissionList, '006004005') ?
                        record.autoCookiesStatus === 1 ? '' :
                            <div>
                                <a onClick={()=>this.getCookieNum(record.id)}>
                                    <FormattedMessage id="complaint.get.cookie" defaultMessage="获取cookie" description="获取cookie" />
                                </a>
                            </div>
                        : ''
                }
                {
                    getButtonPrem(permissionList, '006004005') ?
                        record.isAllowedAutoComplaint === 0 ? 
                            <div>
                                <a onClick={()=>this.getAutomatedComplaint(record.id)}>
                                    <FormattedMessage id="complaint.auto" defaultMessage="开启自动投诉" description="开启自动投诉" />
                                </a>
                            </div>:
                            <div>
                                <a onClick={()=>this.getTurnDownAutomatedComplaint(record.id)}>
                                    <FormattedMessage id="complaint.auto.turn.domn" defaultMessage="关闭自动投诉" description="关闭自动投诉" />
                                </a>                   
                            </div> 
                        : ''
                }    
            </div>
        )
    } 
    
    //渲染投诉平台
    renderComplaintPlatfrom(record) {
        let { intl } = this.props
        return (
            <span>
                {
                    intl.locale === 'en'
                        ? record.platform
                        : record.platformName
                }
            </span>
        )
    }

    // 创建table配置
    createColumns() {
        const columns = [{
            title: <FormattedMessage id="system.user.name" defaultMessage="用户名称" description="用户名称" />,
            dataIndex: 'userName',
            width: '25%',
        }, 
        {
            title: <FormattedMessage id="system.cookie" defaultMessage="Cookie" description="Cookie" />,
            key:'cookie',
            width: '10%',
            render: (text,record) => this.renderCookie(record)
        },
        {
            title: <FormattedMessage id="system.complaint.platform" defaultMessage="投诉平台" description="投诉平台" />,
            dataIndex: 'platform',
            width: '10%',
            render: (text, record) => this.renderComplaintPlatfrom(record)
        }, {
            title: <FormattedMessage id="complaint.bind.account.role" defaultMessage="关联品牌商" description="关联品牌商" />,
            dataIndex: 'userIdName',
            width: '15%',
        }, {
            title: <FormattedMessage id="system.create.execute" defaultMessage="上次执行时间" description="上次执行时间" />,
            dataIndex: 'gmtExecute',
            width: '15%',
        }, {
            title: <FormattedMessage id="complaint.last.acquisition.time" defaultMessage="上次获取时间" description="上次获取时间" />,
            dataIndex: 'gmtModify',
            width: '15%',
        }, {
            title: <FormattedMessage id="complaint.data.status" defaultMessage="数据/状态" description="数据/状态" />,
            width: '15%',
            render: (text,record) => this.renderDataStatus(record)            
        }, {
            title: <FormattedMessage id="complaint.auto.status" defaultMessage="是否开启自动投诉" description="是否开启自动投诉" />,
            width: '15%',
            dataIndex: 'isAllowedAutoComplaintName'         
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            width: '15%',
            render: (text, record) => this.renderOperate(record)
        }];
        return columns;
    }
    //渲染cookie
    renderCookie(record) {
        if(record.cookie && record.autoComplaintecookie) {
            return(
                <div className="complaint_account_cookie">
                    <span onClick={() => this.modalCookie(record.cookie)}><FormattedMessage id="complaint.cookie.have" defaultMessage="有" description="有" /></span>/
                    <span onClick={() => this.modalCookie(record.autoComplaintecookie)}><FormattedMessage id="complaint.cookie.have" defaultMessage="有" description="有" /></span>
                </div>
            )

        }else if(record.cookie && !record.autoComplaintecookie) {
            return(
                <div className="complaint_account_cookie">
                    <span onClick={() => this.modalCookie(record.cookie)}><FormattedMessage id="complaint.cookie.have" defaultMessage="有" description="有" /></span>/
                    <span><FormattedMessage id="complaint.cookie.nothing" defaultMessage="无" description="无" /></span>
                </div>
            )
        }else if(!record.cookie && record.autoComplaintecookie) {
            return(
                <div className="complaint_account_cookie">
                    <span><FormattedMessage id="complaint.cookie.nothing" defaultMessage="无" description="无" /></span>/
                    <span onClick={() => this.modalCookie(record.autoComplaintecookie)}><FormattedMessage id="complaint.cookie.have" defaultMessage="有" description="有" /></span>
                </div>
            )
        }else {
            return(
                <div className="complaint_account_cookie">
                    <span><FormattedMessage id="complaint.cookie.nothing" defaultMessage="无" description="无" /></span>/
                    <span><FormattedMessage id="complaint.cookie.nothing" defaultMessage="无" description="无" /></span>
                </div>
            )
        }
    }
    //渲染cookie对应的状态
    renderDataStatus(record) {
        let { intl } = this.props
        return(
            intl.locale === 'en' ? 
                <div className="complaint_account_cookie_status">
                    <span>{record.signNameEn}</span>/<span>{record.autoCookiesStatusNameEn}</span>
                </div>
            : <div>
                    <span>{record.signName}</span>/<span>{record.autoCookiesStatusName}</span>
            </div>
        )
    }
    //显示全部cookie
    modalCookie(cookie) {
        this.setState({
            cookieModalVisible: true,
            modalCookie: cookie
        })
    }
    //取消cookie modal
    onCancelCookieModal() {
        this.setState({
            cookieModalVisible: false
        })
    }

    //新增
    addAccountModal() {
        let addComplaintAccount = {
            userName: '',
            password: '',
            cookie: '',
            platformId: [],
        }
        this.setState({
            addModalVisible: true,
            edit: true,
            addComplaintAccount
        })
    }

    //编辑
    complaintAccountEdit(record) {
        let addComplaintAccount = {
            userName: record.userName,
            password: '',
            cookie: '',
            platformId: record.platformIdList
        }
        this.setState({
            addModalVisible: true,
            edit: false,
            addComplaintAccount,
            accountId: record.id
        })
    }
    //取消 modal
    addAccountCancel() {
        this.setState({
            addModalVisible: false
        })
    }
    //确定 modal
    addAccountModalOk() {
        let { addAccount, isFetchBtag, intl, complaintAccountList,complaintPlatfromList } = this.props
        let { addComplaintAccount, edit, accountId } = this.state
        if (edit) {
            if (addComplaintAccount.userName === '' || addComplaintAccount.userName === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.enter.user.name', defaultMessage: '请输入用户名' }))
                return
            }
            if (addComplaintAccount.platformId.length <= 0) {
                message.info(intl.formatMessage({ id: 'system.choose.complaint.platform', defaultMessage: '请选择投诉平台' }))
                return
            }
            if (isFetchBtag || isFetchBtag === undefined) {
                addAccount(addComplaintAccount, () => {
                    this.setState({
                        addModalVisible: false,
                        edit: true
                    })
                    message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
                    this.getComplaintAccountList([], 1)
                })
            }
        } else {
            if (addComplaintAccount.platformId.length <= 0) {
                message.info(intl.formatMessage({ id: 'system.choose.complaint.platform', defaultMessage: '请选择投诉平台' }))
                return
            }
            let platformIdArr = [],platformIdArrEn = [];
            if(addComplaintAccount.platformId && addComplaintAccount.platformId.length){
                for(let i=0;i<addComplaintAccount.platformId.length;i++){
                    if(complaintPlatfromList && complaintPlatfromList.length){
                        for(let j=0;j<complaintPlatfromList.length;j++){
                            if(addComplaintAccount.platformId[i]===complaintPlatfromList[j].dictVal){
                                platformIdArr.push(complaintPlatfromList[j].dictLabel)
                                platformIdArrEn.push(complaintPlatfromList[j].dictLabelEn)
                            }
                        }
                    }
                }
            }
            let data = {
                id: accountId,
                password: addComplaintAccount.password,
                cookie: addComplaintAccount.cookie,
                platformId:addComplaintAccount.platformId,
                platform:platformIdArr.toString(),
                platformEn:platformIdArrEn.toString()
            }
            this.props.complaintAccountEdit(data, complaintAccountList, () => {
                this.setState({
                    addModalVisible: false,
                    edit: true
                })
                message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
            })
        }
    }
    //modal chnage事件
    addModalChange(value, type) {
        let tempData = this.state.addComplaintAccount
        tempData[type] = value
        this.setState({
            addComplaintAccount: tempData
        })
    }

    //删除
    showDeleteConfirm(record) {
        let { intl } = this.props
        confirm({
            title: intl.formatMessage({ id: "system.del.complaint.account", defaultMessage: "删除投诉账号", description: "删除投诉账号" }),
            content: intl.formatMessage({ id: 'system.sure.del.complaint.account', defaultMessage: '你确定删除这个投诉账号吗?', description: '你确定删除这个投诉账号吗?' }),
            onOk: () => this.deleteAccountTask(record.id),
            onCancel: () => { }
        })
    }
    //表格任务删除
    deleteAccountTask(id) {
        let { pageNo, deleteAccount } = this.props
        let data = {
            id: id,
        }
        deleteAccount(data, () => {
            this.getComplaintAccountList([], pageNo)
        })
    }
    //下拉线上数据
    getPullLineData(record) {
        let { complaintPullData, complaintAccountList } = this.props
        let data = {
            id: record.id,
        }
        complaintPullData(data, complaintAccountList)
    }

    render() {
        let { intl, isFetch, complaintAccountList, total, complaintPlatfromList, permissionList, brandMerchant } = this.props;
        let { userName, platformId, addModalVisible, addComplaintAccount, edit, cookieModalVisible, modalCookie, bindVisible, bindBrandData } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.complaint.management', title: '投诉管理' },
            { link: '', titleId: 'router.complaint.account.management', title: '投诉账号管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData} className="complaint_account_wrapper">
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.user.name", defaultMessage: "用户名", description: "用户名" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "system.please.enter.user.name", defaultMessage: "请输入用户名", description: "请输入用户名" })}
                                    onChange={e => this.setState({ userName: e.target.value.trim() })} value={userName} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.complaint.platform", defaultMessage: "投诉平台", description: "投诉平台" })}>
                                <Select
                                    value={platformId}
                                    onChange={val => this.setState({ platformId: val })}
                                    placeholder={intl.formatMessage({ id: "system.choose.complaint.platform", defaultMessage: "请选择投诉平台", description: "请选择投诉平台" })}
                                >
                                    <Option value=''><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        complaintPlatfromList && complaintPlatfromList.filter(item => item.isDel === 0)
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
                            getButtonPrem(permissionList, '006004002') ?
                                <Button type="primary" onClick={() => this.addAccountModal()}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
                                : ''
                        }
                    </Col>
                </Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={complaintAccountList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
                <AddAccount
                    visible={addModalVisible}
                    edit={edit}
                    addComplaintAccount={addComplaintAccount}
                    platfromList={complaintPlatfromList}
                    onCancel={() => this.addAccountCancel()}
                    onOk={() => this.addAccountModalOk()}
                    addModalChange={(value, type) => this.addModalChange(value, type)}
                />
                <BindModal
                    bindVisible={bindVisible}
                    bindBrandData={bindBrandData}
                    bindBrand={brandMerchant}
                    onCancel={() => this.onCancelBind()}
                    onOk={() => this.onOkBind()}
                    bindModalChange={(value, type) => this.bindModalChange(value, type)}
                />
                <CookieModal 
                    visible={cookieModalVisible}
                    modalCookie={modalCookie}
                    onCancel={() => this.onCancelCookieModal()}
                />
            </Content>
        )
    }
}
