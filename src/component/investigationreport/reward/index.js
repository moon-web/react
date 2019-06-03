import React, { Component } from 'react'
import {Button, Select, Alert, Table, Row, Col, Form ,Input, message} from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import Content from '../../common/layout/content/index'
import '../index.css'
import { Link } from 'react-router-dom'
import { getButtonPrem} from '../../../utils/util'
const Option = Select.Option
class Reward extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName:"",
            pageNo:1,
            pageSize:10,
            isGiveout:undefined,
            search:{
                userName: '',
                isGiveout: '',
            }
        }
        this.columns = []
    }

    //获取数据
    getData(oldList,pageNo) {
        let {search, pageSize} = this.state
        let { getRewardList } = this.props
        let data = Object.assign({}, search);
        data.pageNo = pageNo;
        data.pageSize = pageSize;
        getRewardList(oldList,data)
    }


    componentWillMount() {
        let { history, investigationRewardList } = this.props;
		if (!investigationRewardList.length || (investigationRewardList.length && history.action !== 'POP' && !history.location.query)) {
            this.getData([],1)
		}
    }

    //搜索
    handleSearch() {
        let {search,userName,isGiveout} = this.state
        search={
            userName:userName || "",
            isGiveout:isGiveout === undefined ? '' : isGiveout
        }
        this.setState({
            search
        },()=>{
            this.getData([],1)
        })
    }

    //重置
    reSetting() {
        let search={
            userName: '',
            isGiveout: '',
        }
        this.setState({
            userName: '',
            isGiveout: undefined,
            search,
            pageSize:10,
            pageNo:1
        },() => {
            this.getData([],1)
        })
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size,
        }, () => {
            this.getData([],1)
        })
    }

    //翻页
    getTableDate(page,pageSize) {
        this.setState({
            pageNo:page
        },()=>{
            this.getData([], page)
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
            onChange: (page, pageSize) => this.getTableDate(page, pageSize),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }


    //审核通过
    editGiveOut(id) {
        let {investigationRewardList,intl} = this.props
        let data={
            id:id,
            isGiveout:1
        }
        if(this.props.geteditGiveOut){
            this.props.geteditGiveOut(data,investigationRewardList,()=>{
                message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
            })
        }
    }

    //渲染操作
	renderOperation(record) {
        let { permissionList } = this.props
		return (
			<div>
                {
                    getButtonPrem(permissionList,'007003002')?
                        record.isGiveout === 0?(
                            <div>
                                <a onClick={()=>this.editGiveOut(record.id)}>
                                    <FormattedMessage id="global.volunteer.audit.type.pass" defaultMessage="审核通过" description="审核通过" />
                                </a>
                            </div>
                        ):"":""
                }
            </div>
		)
    }
    
    // 创建table配置
    createColumns() {
        let { permissionList ,intl } = this.props
        const columns = [ 
			{
                title: <FormattedMessage id="investigation.report.pepole" defaultMessage="申请人" />,
                dataIndex: 'userName',
                key:"userName",
                render:(text,record)=>
                    <div>
                        {
                            getButtonPrem(permissionList,'007003003') ?
                            <Link to={`/report/reward/detail?id=${record.id}`}>{text}</Link>:
                            <span style={{color:'#668fff'}}>{text}</span>
                        }
                    </div>
            },
            {
                title: <FormattedMessage id="users.user.cellphone.number" defaultMessage="手机号码"/>,
                dataIndex: 'fmobile',
                key:"fmobile",
            },
            {
                title: <FormattedMessage id="users.registrationTime" defaultMessage="注册时间"/>,
                dataIndex: 'gmtCreate',
                key:"gmtCreate",
            },
            {
                title: <FormattedMessage id="investigation.report.money" defaultMessage="申请金额"/>,
                dataIndex: 'price',
                key:"price",
            },
            {
                title: <FormattedMessage id="global.status" defaultMessage="状态"/>,
                key:"isGiveout",
                dataIndex: "isGiveout",
                render:(text,record) =>
                    <div>
                        { intl.locale==='zh'?record.isGiveoutName:record.isGiveoutNameEn }
                    </div>
            },
            {
                title: <FormattedMessage id="global.operate" defaultMessage="操作"/>,
                key:"operate",
                render: (text, record) => this.renderOperation(record),
            }]
        return columns;
    }

    render() {
        let { intl, investigationRewardList,isFetch, total,reportRewardDistributionStatus} = this.props;   
        let { userName, isGiveout } = this.state 
        let breadcrumbData = [
			{ link: '/', titleId: 'router.home', title: '首页' },
			{ link: '', titleId: "router.investigator.report.management", title: '调查举报管理' },
			{ link: '', titleId: "router.reward.distribution", title: '举报奖励发放' },
        ]
        return (
            <Content breadcrumbData={ breadcrumbData } >
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id:"investigation.report.pepole", defaultMessage: "申请人" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({id:"investigation.report.please.input.the.applicant",defaultMessage: '请输入申请人'})} onChange={(e) => this.setState({userName: e.target.value.trim()})} value={userName}/>
                            </Form.Item>                    
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.status", defaultMessage: "状态" })}>
                                <Select
                                    placeholder={ intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    onChange={ value => this.setState({ isGiveout:value }) }
                                    value={ isGiveout }
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        reportRewardDistributionStatus && reportRewardDistributionStatus.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
					    </Col>
                        <Col span={6} offset={6}>
                            <div className="search-form-btns">
                                <Button type="primary" onClick={() => this.handleSearch()}>
                                    <FormattedMessage id="global.search" defaultMessage="搜索"/>
                                </Button>
                                <Button onClick={() => this.reSetting()}>
                                    <FormattedMessage id="global.reset" defaultMessage="重置"/>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={investigationRewardList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey='id' loading={isFetch} />
            </Content>
        )
    }
}
export default injectIntl(Reward)