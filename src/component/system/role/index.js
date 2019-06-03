import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Button, Alert, Select, Modal ,message } from 'antd'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import AddSRole from './children/addRole'
import '../common/index.css'
import { getButtonPrem, getName } from '../../../utils/util'
const Option = Select.Option;
const confirm = Modal.confirm;
export default class RoleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo:1,
            pageSize:10,
            status:undefined,
            addModalVisible: false,
            roleName:"",
            searchData:{
                roleName:'',
                status:''
            },
            addSystemRoleData: {
                roleName: '',
                note: ''
            }
        }
    }

    componentWillMount() {  
        let { history, rolelist } = this.props
		if (!rolelist.length || (rolelist.length && history.action !== 'POP' && !history.location.query)) {
			this.getData([], 1)
		}    
    }

    //获取数据
    getData(oldList,pageNo){
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        if(this.props.getRoleList){
            this.props.getRoleList(data,oldList)
        }
    }

    // 搜索
    handleSearch() {
        let { searchData, roleName,  status } = this.state;
        searchData = {
            roleName:roleName,
            status:status === undefined ? '' : status
        }
        this.setState({
            searchData
        }, () => this.getData([], 1))
    }

    //重置
    handleReset() {
        let searchData = {
            roleName: '',
            status: ''
        }
        this.setState({
            status: undefined,
            roleName: '',
            searchData
        }, () => this.getData([], 1))
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
            onChange: (page, pageSize) => this.getData([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

     // 改变分页大小
     changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getData([],1)
        })
    }

    //渲染状态
    renderStatus(record) {
        let { intl } = this.props
        return (
            <span>{intl.locale === 'en'? record.statusNameEn: record.statusName}</span>
        )
    }
    //渲染操作
    renderOperate(record) {
        let { permissionList } = this.props
        return(
            <div className='roleOperate'>
                {
                    getButtonPrem(permissionList, '010005004') ? (
                        record.status === 0 ? (
                            <a className="opreateStyle" onClick={() => this.roleDisable(record.roleId,1)}>
                                <FormattedMessage id="global.enable" defaultMessage="启用" description="启用" />
                            </a>
                        ):(
                            <a className="opreateStyle" onClick={() => this.roleDisable(record.roleId,0)}>
                                <FormattedMessage id="global.disable" defaultMessage="禁用" description="禁用" />
                            </a>
                        )
                    ) : ''
                }
                {
                    getButtonPrem(permissionList, '010005003') ? (
                        record.canDelete === 1 ? (
                            <span className="opreateStyle">
                                <a onClick={() => this.deleteConfirm(record.roleId) }>
                                    <FormattedMessage id="global.delete" defaultMessage="删除" description="删除" />
                                </a>
                            </span>
                        ) : ''
                    ) : ''
                }
                {
                    getButtonPrem(permissionList, '010005005') ?
                    <Link className="opreateStyle" to={`/system/auth?roleId=${record.roleId}`} >
                        <FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" />
                    </Link> : ''
                }                
            </div>
        )      
    }
    // 创建table配置
    createColumns() {
        const columns = [{
            title: <FormattedMessage id="system.role" defaultMessage="角色" description="角色" />,
            key: 'roleName',
            render: (text,record) => {
                return(
                    <span>
                        {
                        record.roleNameEng ?
                            <FormattedMessage id={record.roleNameEng} defaultMessage={record.roleName} description={record.roleName}/>
                            : <span>{record.roleName}</span>
                        }
                    </span>
                )
            }
        },{
            title: <FormattedMessage id="system.explain" defaultMessage="说明" description="说明" />,
            key: 'note',
            dataIndex: 'note',
        },{
            title: <FormattedMessage id="system.create.tiem" defaultMessage="创建时间" description="创建时间" />,
            dataIndex: 'gmtCreate',
        }, {
            title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
            dataIndex: 'userStatus',
            render: (text,record) =>this.renderStatus(record)
        },{
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            render: (text,record) => this.renderOperate(record)
        }];
        return columns;
    }


    //0禁用 1启用
    roleDisable(roleId,type) {
        let { rolelist, intl, systemRoleStatusType} = this.props
        let stateData = getName(systemRoleStatusType, type)
        let data = {}
        data.status = type
        data.roleId = roleId
        data.statusName = stateData.dictLabel
        data.statusNameEn = stateData.dictLabelEn
        if(this.props.editRoleStatus){
            this.props.editRoleStatus(data,rolelist,()=>{
                message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
            })
        }
    }


    //删除角色
    deleteConfirm(roleId) {
        let intl = this.props.intl;
        confirm({
            title: intl.formatMessage({ id: "system.role.deletion", defaultMessage: "角色删除", description: "角色删除" }),
            content: intl.formatMessage({ id: "system.role.delete", defaultMessage: "您确认删除这个角色吗？", description: "您确认删除这个角色吗？" }),
            onOk : ()=> this.deleteRole(roleId)
          });
    }

    //删除角色操作
    deleteRole(roleId) {
        let {pageNo,editRoleDel} = this.props
        let data={
            roleId:roleId
        }
        if(editRoleDel){
            editRoleDel(data,()=>{
                this.getData([],pageNo)
            })
        }
    }

    //新增角色
    addRole() {
        let addSystemRoleData = {
            roleName: '',
            note: ''
        }
        this.setState({
            addModalVisible: true,
            addSystemRoleData
        })
    }

    //Modal取消
    addSystemModalCancel() {
        this.setState({
            addModalVisible: false
        })
    }

    //Modal确认
    addSystemModalOk() {
        let { intl, roleAdd } = this.props
        let { addSystemRoleData } = this.state
        roleAdd(addSystemRoleData,() => {
            message.success(intl.formatMessage({ id: "global.add.success", defaultMessage: "新增成功", description: "新增成功" }))
            this.getData([],1)
            this.setState({
                addModalVisible: false
            })
        })

    }

    //Modal输入选择事件
    addModalChange(value,type) {
        let tempData = this.state.addSystemRoleData  
        tempData[type] = value
        this.setState({
            addSystemRoleData: tempData 
        })
    }

    render() {
        let { intl, isFetch, rolelist, total, permissionList , systemRoleStatusType } = this.props;
        let { roleName,status, addModalVisible, addSystemRoleData } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.system.role.management', title: '角色管理' }
        ];
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.role.name", defaultMessage: "角色名称", description: "角色名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()}  placeholder={intl.formatMessage({ id: "system.role.please.enter.role.name", defaultMessage: "请输入角色名称", description: "请输入角色名称" })} 
                                    onChange={e => this.setState({ roleName: e.target.value.trim() })} value={roleName}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.role.status", defaultMessage: "角色状态", description: "角色状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "system.role.please.select.role.status", defaultMessage: "请选择角色状态", description: "请选择角色状态" })}
                                    value={status}
                                    onChange={val => this.setState({ status: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        systemRoleStatusType && systemRoleStatusType.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
                                    }
                                </Select>
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
                            getButtonPrem(permissionList, '010005002') ?
                                <Button type="primary" onClick={() => this.addRole()}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
                            : ''
                        }
                    </Col>
				</Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={rolelist} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="roleId" loading={isFetch} />
                <AddSRole
                    visible={addModalVisible}
                    addRole={addSystemRoleData}
                    onCancel={() => this.addSystemModalCancel()}
                    onOk={() => this.addSystemModalOk()}
                    addModalChange={(value,type) => this.addModalChange(value,type)}
                />
            </Content>
        )
    }
}
