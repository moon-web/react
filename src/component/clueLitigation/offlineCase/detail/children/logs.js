import React, { Component } from 'react'
import {  Table } from 'antd'
import { injectIntl } from 'react-intl'
class Logs extends Component {
    
    createColumns() {
        const columns = [{
            title: '名字',
            dataIndex: 'operateName',
            key: 'operateName',
            width: '20%'
        },{
            title: '操作',
            dataIndex: 'operateStatusStr',
            key: 'operateStatusStr',            
            width: '20%',
            render: (text, record) => {
                return(
                    record.operateStatusStr + record.operateObjStr
                )
            }
        },{
            title: '驳回理由',
            dataIndex: 'suitBackReason',
            key: 'suitBackReason',
            render: (text, record) => {
                return(
                    record.suitBackReason ? 
                    <span className="table-reject">驳回理由：{record.suitBackReason}</span> : ''
                )
            }
        },{
            title: '时间',
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',            
            width: '20%'
        }]
        return columns
    }

    rowClassName(record, index) {
        const className = index%2 ===0 ? 'table-even' : ''
        return className
    }

    render() {
        let { logs } = this.props;
        return (
            <div className='logs'>
                <Table 
                    dataSource={logs}
                    bordered={false}
                    pagination={false}
                    showHeader={false}
                    rowKey="id"
                    columns={this.createColumns()}
                    rowClassName={(record, index) => this.rowClassName(record, index)}
                />
            </div>
        )
    }
}

export default injectIntl(Logs)
