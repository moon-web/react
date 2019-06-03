import React, { Component } from 'react'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../../common/layout/content/index'
import { queryUrlParams, getName } from '../../../../utils/util'
import Information from './children/information'
import AuditModal from './children/audit'
export default class ThreadEdit extends Component {
	constructor(props) {
		super(props)
		this.state = {           
            visibleAudit: false,
            statusAudit: ''
        }
    }
    
	componentDidMount() {
        //获取详情
        let id = queryUrlParams('id')
        let { queryThreadDetails } = this.props;
        let data = {
            id: id
        }
        if( queryThreadDetails ){
            queryThreadDetails(data, (result) => {
                this.setState({
                    id,
                    statusAudit: result.status
                })
            })
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    

    //审核
    onVisibleAudit() {
        this.setState({
            visibleAudit: true
        })
    }
    //审核Modal确定
    onOkAudit(data) {
        let { threadStatus } = this.props
        let { id } = this.state
        let detailStatus = getName(threadStatus, data.status)
        data.statusName = detailStatus.dictLabel
        data.statusNameEn = detailStatus.dictLabelEn      
        data.id = id
        let { clueAudit, threadList} = this.props
        clueAudit(data, threadList, () => {
            this.setState({
                visibleAudit: false
            })
        })
    }
    //审核Modal取消
    onCancelAudit() {
        this.setState({
            visibleAudit: false
        })
    }

	render() {
		let { queryThreadDetail, cluesClassification, cluesValue } = this.props
        let { visibleAudit, statusAudit } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '/thread/list', titleId: 'router.thread.management', title: '线索管理', query: { goBack: true } },
            { link: '', titleId: 'router.thread.management.detail', title: '线索管理详情' },
        ]
		return (
			<Content breadcrumbData = {breadcrumbData} className="brand-edit-wrapper thread-submit thread-detail">
				<div>
					<div className="subject-type">
						<FormattedMessage id="users.essential.information" defaultMessage="基本信息" description="基本信息" />
					</div>
                    <Information
                        queryThreadDetail = { queryThreadDetail }
                    />
			    </div>
                {
                    queryThreadDetail && (queryThreadDetail.status === 0 || queryThreadDetail.status === 6) ?
                        <div className="btns">
                            <Button type="primary" onClick={() => this.onVisibleAudit()}>
                                <FormattedMessage id="global.audit" defaultMessage="审核" description="审核" />
                            </Button>
                        </div> : ''
                }                
                {
                    visibleAudit ? 
                    <AuditModal 
                        visible={visibleAudit}
                        statusAudit={statusAudit}
                        cluesValue={cluesValue}
                        cluesClassification={cluesClassification}
                        onOk={(data) => this.onOkAudit(data)}
                        onCancel={() => this.onCancelAudit()}
                    /> : ''
                }  
			</Content>
		)
	}  
}
