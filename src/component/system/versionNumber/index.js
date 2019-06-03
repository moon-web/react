import React, { Component } from 'react'
import {  Table, Button, message ,Icon} from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import ModifyVersion from './children/modifyVersion'
import { getButtonPrem, getFormatDate } from '../../../utils/util'
export default class VersionNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            versionNumber:undefined,
            type:undefined,
			searchData:{
                versionNumber:'',
                type:''
            },
            visible:false,
            modifiyVersion:{
                type:undefined,
                versionNum:'',
                cid:undefined
            },
            refresh:false
        }
    }

    componentWillMount() {
        this.getVersionList([], 1)     
    }

    // 获取数据
    getVersionList(oldList, pageNo, callback) {
        let { searchData } = this.state;
        this.props.getVersionList(searchData, oldList, callback)
    }

    //输入value
    addModalChange(value,key) {
        if( key === 'versionNumber' ) {
            this.setState({
                [key]:value
            })
        }else{
            let { modifiyVersion } = this.state
            modifiyVersion[key] = value
            this.setState({
                modifiyVersion
            })
        }
    }

    //操作  修改
    modifiyVersionOperate(record) {
        this.setState({
            visible:true
        },()=>{
            let { modifiyVersion } = this.state
            modifiyVersion.type = record.type
            modifiyVersion.versionNum = record.versionStr
            modifiyVersion.cid = record.id
            this.setState({
                modifiyVersion
            })
        })
    }

    //提交修改指定版本号
    onOk() {
        let { modifyVersion, versionList } = this.props;
        let { modifiyVersion } = this.state;
        if(modifiyVersion.versionNum==='' || modifiyVersion.versionNum===undefined){
            message.warning('指定版本号不能为空')
        }
        let data={
            id:modifiyVersion.cid,
            type:modifiyVersion.type,
            versionStr:modifiyVersion.versionNum
        }
        modifyVersion(data,versionList,()=>{
            message.success('修改成功')
            this.setState({
                visible:false
            })
        })
    }

    //取消修改
    onCancel() {
        this.setState({
            visible:false,
            modifiyVersion:{
                type:undefined,
                versionNum:'',
                cid:undefined
            }
        })
    }

    //刷新
    refreshList() {
        this.setState({
            refresh: true
        }, () => {
            this.getVersionList([], 1, ()=>{
                this.setState({
                    refresh:false
                })
            })
        })
    }

    //修改指定版本号
    renderOperate(text,record) {
        let { permissionList } = this.props
        return(
            getButtonPrem(permissionList, '010013002') ? (                        
                <a onClick={()=>this.modifiyVersionOperate(record)}>
                    <FormattedMessage id="system.modify.the.specified.version.number" defaultMessage="修改指定版本号" description="修改指定版本号" />
                </a>
            ) : ''
        )
    }

    // 创建table配置
    createColumns() {        
        let { intl } = this.props
        const columns = [{
            title: <FormattedMessage id="system.type" defaultMessage="类型" description="类型" />,
            dataIndex: 'type',
            render:(text,record) =>{
                return(
                    <div>{intl.locale==='zh'?record.typeName:record.typeNameEn}</div>
                )
            }
        },{
            title: <FormattedMessage id="system.version.number" defaultMessage="版本号" description="版本号" />,
            dataIndex: 'versionStr',
        },{
            title: <FormattedMessage id="system.modification.time" defaultMessage="修改时间" description="修改时间" />,
            dataIndex: 'gmtModify',
        },{
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            render: (text, record) => this.renderOperate(text,record)
        }];
        return columns;
    }

    render() {
        let { isFetch, versionList,brandList, versionType } = this.props;
        let { visible, modifiyVersion, refresh } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.version.number.management', title: '版本号管理' }
        ];
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="operation-btns">
                    <Button type='primary'  onClick={() => this.refreshList()}>
                        <Icon type={refresh ? 'loading' : 'reload' } />
                        <FormattedMessage id="global.reload" defaultMessage="刷新" description="刷新" />
                    </Button>
                </div>
                <Table dataSource={versionList} columns={this.createColumns()} rowKey="id" loading={isFetch} pagination={false}/>
                <ModifyVersion
                    visible = { visible }
                    addModalChange ={ (value,key) => this.addModalChange(value,key) }
                    brandList = { brandList }
                    modifiyVersion = { modifiyVersion }
                    onOk = { () => this.onOk() } 
                    onCancel = { () => this.onCancel() }
                    versionType = { versionType }
                />
            </Content>
        )
    }
}
