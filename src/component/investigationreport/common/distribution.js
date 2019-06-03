import React, { Component } from 'react'
import { Input, Form,Row,Col,DatePicker, Modal, Pagination } from 'antd'
import { FormattedMessage,injectIntl } from 'react-intl'
import '../index.css'
const Search = Input.Search
class Distribution extends Component {
    constructor() {
        super()
        this.state={
            value:''
        }
    }

    //获取inputvalue
    getInputValue(value,type) {
        if(this.props.getInputValue){
            this.props.getInputValue(value,type)
        }
    }

    // 选择日期
    changeDatePicker(date, dateStr, type, key) {
        if(this.props.changeDatePicker){
            this.props.changeDatePicker(date, dateStr, type, key)
        }
    }

    //view
    interfaceDisplay(distribution,distributionType) {
        let { intl } = this.props
        return(
            <div>
                {
                    distributionType ===1 ?
                    <div>
                        <Row style={{marginBottom:'20px'}}>
                            <Col span={24} style={{marginBottom:'10px'}}>
                                <Form.Item label={intl.formatMessage({ id: 'investigation.awards', defaultMessage: "调查奖励" })}>
                                    <Input  type='number' placeholder={intl.formatMessage({id: 'investigation.please.enter.awards',defaultMessage: '请输入调查奖励'})} onChange={(e)=>{this.getInputValue(e.target.value.trim(),'investigationMoney')}} value={distribution.investigationMoney}/>
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <Form.Item label={intl.formatMessage({ id: 'investigation.response.time', defaultMessage: "响应时间" })}>
                                    <DatePicker style={{width:'100%'}} onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'investigationTime','investigationDate')} value={distribution.investigationDate} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{marginBottom:'10px'}}>
                                <Form.Item label={intl.formatMessage({ id: 'investigation.law.enforcement.award', defaultMessage: "调查+执法奖励" })}>
                                    <Input  type='number' placeholder={intl.formatMessage({id: 'investigation.please.enter.law.enforcement.award',defaultMessage: '请输入调查+执法奖励'})} onChange={(e)=>{this.getInputValue(e.target.value.trim(),'investigationLawMoney')}} value={distribution.investigationLawMoney}/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label={intl.formatMessage({ id: 'investigation.response.time', defaultMessage: "响应时间" })}>
                                    <DatePicker style={{width:'100%'}} onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'investigationLawTime','investigationLawDate')} value={distribution.investigationLawDate} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    :
                    <div>
                        <Row style={{marginBottom:'20px'}}>
                            <Col span={24} style={{marginBottom:'10px'}}>
                                <Form.Item label={intl.formatMessage({ id: 'investigation.law.awards', defaultMessage: "执法奖励" })}>
                                    <Input  type='number' placeholder={intl.formatMessage({id: 'investigation.please.enter.law.awards',defaultMessage: '请输入执法奖励'})} onChange={(e)=>{this.getInputValue(e.target.value.trim(),'lawMoney')}} value={distribution.lawMoney}/>
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <Form.Item label={intl.formatMessage({ id: 'investigation.response.time', defaultMessage: "响应时间" })}>
                                    <DatePicker style={{width:'100%'}} onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'lawTime','lawDate')} value={distribution.lawDate} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }

    //搜索选择调查员
    selectUserInfo(v) {
        if(this.props.selectUserInfo){
            this.props.selectUserInfo(v)
        }
    }

    //渲染表格
    tableData(getDistributionList) {
        return(
            <div style={{width:'100%'}}>
               { getDistributionList ? getDistributionList.map( v => (
                    <Row key={v.userId} id={v.userId} onClick={() => this.selectUserInfo(v)} className="text-row">
                        <Col span={12}>
                            <div className="text">{v.userName}</div>
                        </Col>
                        <Col span={12}>
                            <div className="text">{v.mobile}</div>
                        </Col>
                    </Row>
                )):<tr key={1} className='search-option'><td>暂无数据</td></tr>}
            </div>
        )
    }

    //搜索调查员
    showSearchlist() {
        this.setState({
            value:''
        },()=>{
            if(this.props.showSearchlist){
                this.props.showSearchlist()
            }
        })
    }

    //分页器
    minPaginationdata(page,pageSize) {
        if(this.props.minPaginationdata){
            this.props.minPaginationdata(page,pageSize)
        }
    }

    //搜索调查员inputvalue
    searchByName(value) {
        this.setState({
            value:value
        },()=>{
            if(this.props.searchByName){
                this.props.searchByName(value)
            }
        })
    }

    //取消搜索调查员
    onSelectCancel() {
        this.setState({
            value:''
        },()=>{
            if(this.props.onSelectCancel){
                this.props.onSelectCancel()
            }
        })
    }
    render() {
        let { intl, distribution, getDistributionList, searchVisible,minPageNo, minTotal, distributionType} = this.props
        let { value } = this.state
        return (
            <div className="search-form investigation-report" style={{marginBottom:0}}>
                <Row className="title">
                    <FormattedMessage id="investigation.select.investigators" defaultMessage="选择调查员"/>
                </Row>
                <Row>
                    <Input 
                        placeholder={intl.formatMessage({id: "investigation.please.investigation.select.investigators",defaultMessage: '选择调查员'})} 
                        onClick={() => this.showSearchlist()}
                        value={distribution.name}
                    />
                </Row>
                { this.interfaceDisplay(distribution,distributionType) } 
                <Modal
                    title="搜索调查员"
                    visible={searchVisible}
                    zIndex={10000}
                    className='root'
                    footer={false}
                    onCancel={()=>this.onSelectCancel()}
                >
                    <Search
                        placeholder='请输入调查员姓名或手机号'
                        style={{width: '100%'}}
                        onSearch={(value) => this.searchByName(value)}
                        value={value}
                        onChange={(e)=>this.setState({value:e.target.value.trim()})}
                    />
                        <div className='search-form distribution-search-modal'>
                            <Row>
                                <Col span={12}>
                                    <div className="text"><FormattedMessage id="investigation.detail.full.name" defaultMessage="姓名" /></div>
                                </Col>
                                <Col span={12}>
                                    <div className="text"><FormattedMessage id="users.user.cellphone.number" defaultMessage="手机号码" /></div>
                                </Col>
                            </Row>
                            { this.tableData(getDistributionList) }
                        </div>
                    <Pagination simple current={minPageNo} total={minTotal} pageSize={10} onChange={(page,pageSize)=>this.minPaginationdata(page,pageSize)}/>
                </Modal>               
			</div>
        )
    }
}
export default injectIntl(Distribution)