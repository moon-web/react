import React, { Component } from 'react'
import { Modal, Input, Row, Col, Pagination } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
const Search = Input.Search
class DistributionModal extends Component {
    constructor() {
        super()
        this.state = {
        }
    }

    //确认提交
    handleOkVisible() {
        let { handleOkVisible } = this.props;
        if(handleOkVisible){
            handleOkVisible()
        }
    }

    //取消分配
    closeVisible() {
        let { closeVisible } = this.props;
        if(closeVisible){
            closeVisible()
        }
    }
    
    //赋值
    handleChange(key, value) {
        let { handleChange } = this.props
        if(handleChange){
            handleChange(key, value)
        }
    }

    //分页器
    minPaginationdata(page,pageSize) {
        if(this.props.minPaginationdata){
            this.props.minPaginationdata(page,pageSize)
        }
    }

    //选择合作律师
    selectUser(item){
        let {selectUser} = this.props;
        if(selectUser){
            selectUser(item)
        }
    }
 
    //渲染表格
    tableData(getDistributionList) {
        let { allotedId } = this.props;
        return(
            <div style={{width:'100%'}}>
               { getDistributionList ? getDistributionList.map( item => (
                    <Row key={item.userId} id={item.userId} onClick={() => this.selectUser(item)} className={allotedId === item.userId ? 'text-row text-row-active' : 'text-row'}>
                        <Col span={12}>
                            <div className="text">{item.userName}</div>
                        </Col>
                        <Col span={12}>
                            <div className="text">{item.mobile}</div>
                        </Col>
                    </Row>
                )):<tr key={1} className='search-option'><td><FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" /></td></tr>}
            </div>
        )
    }

    render() {
        let { intl, visible, cooperativeLawyerList, nameLikeOrMobile, minPageNo, minToltal } = this.props;
        return (
            <Modal
                visible={visible}
                className='root monitor-result-modal ligigation-modal'
                title={ intl.formatMessage({ id: "monitor.task.allocation", defaultMessage: "任务分配", description: "任务分配" }) }
                onOk={() => this.handleOkVisible()}
                onCancel={() => this.closeVisible()}
            >
                <div className="search-form">
                    <Search
                        placeholder={ intl.formatMessage({ id: "ligiation.please.enter.a.colawyer", defaultMessage: "请输入合作律师", description: "请输入合作律师" }) }
                        style={{width: '100%'}}
                        onSearch={(value) => this.handleChange(value)}
                        value={nameLikeOrMobile}
                        onChange={e => this.handleChange('nameLikeOrMobile', e.target.value.trim())}
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
                        { this.tableData(cooperativeLawyerList) }
                    </div>
                    <Pagination simple 
                        current={minPageNo} 
                        total={minToltal} 
                        pageSize={10} 
                        onChange={(page,pageSize)=>this.minPaginationdata(page,pageSize)}/>
                </div>
            </Modal>
        )
    }
}

export default injectIntl(DistributionModal)