import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Col, Row , Card, Pagination, Tag} from 'antd';
import '../../index.css'
class TaskLog extends Component {
    constructor() {
        super()
        this.state = {
            checked: true,
            tag:undefined,
            pageNo:1,
            current:1,
            pageSize:10,
            nickName:""
        }
    }

    //日志tab
    getSelectTag(key,name) {
        this.setState({
            tag:key,
            nickName:name
        },()=>{
            
            this.loadTaskLog()
        })
    }

    componentWillMount() {
        this.loadTaskLog()
    }

    //获取当前组团人员日志
    loadTaskLog() {
        let { compensableId, id ,type} = this.props
        let { pageNo ,pageSize,nickName} = this.state
        let data={
            pageSize: pageSize,
            nickName: nickName,
            pageNo: pageNo
        }
        if(type==='1'){
            data.compensableId=id
        }else if(type ==='2'){
            data.compensableId=compensableId
        }
        if(this.props.getTaskLog){
            this.props.getTaskLog(data)
        }
    }

    //分页器
    minPaginationdata(page,pageSize) {
        this.setState({
            pageNo:page,
            current:page
        },()=>{
            this.loadTaskLog()
        })
    }


    render() {
        let { investigationDetailTaskLog, total, journalData } = this.props
        let { tag, pageNo ,pageSize} = this.state
        return (
            <div className="investigation-detail">
                <Row>
                    <div>
                        <Tag className="tagStyle" color={tag === undefined ? '#108ee9':null} onClick={()=>this.getSelectTag(undefined,'')}>
                            <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                        </Tag>
                        {
                            journalData?journalData.map((v,i)=>(
                                <Tag className="tagStyle" color={v.id===tag?'#108ee9':null} key={i} onClick={()=>this.getSelectTag(v.id,v.tag)}>{v.tag}</Tag>
                            )):""
                        }
                    </div>
                </Row>
                <Row gutter={16} className="investigation-card">
                    {
                        investigationDetailTaskLog && investigationDetailTaskLog.length >0 ? investigationDetailTaskLog.map((v,i)=>(
                            <Col span={8} key={i}>
                                <Card
                                    title={v.userType==='4'?v.chargeNick:v.nickName}
                                    extra={<a>{v.opTime?v.opTime:''}</a>}
                                    style={{ width: 300 }}
                                >
                                    <div className="task-log-info">
                                       {v.opStr?v.opStr:''}
                                    </div>
                                </Card>
                            </Col>
                        )):(
                            <Col span={24}>
                                <Card style={{height:300 }} >
                                    <div className="task-log-info logdata">
                                        <FormattedMessage id="investigation.no.data" defaultMessage="暂无数据" description="暂无数据" />
                                    </div>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
                {
                    total===0 || total ===undefined?"":(
                        <Pagination simple current={pageNo} pageSize={pageSize} total={total} style={{float:'right'}} onChange={(page,pageSize)=>this.minPaginationdata(page,pageSize)}/>
                    )
                }
            </div>
        )
    }
}
export default injectIntl(TaskLog)