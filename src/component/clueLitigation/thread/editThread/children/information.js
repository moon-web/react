import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Divider, Tooltip  } from 'antd'
import PictureModal from '../../../../common/layout/modal/pictureModal'
import FileList from './fileList'
import '../../index.css'
class Information extends Component {
	constructor(props) {
		super(props)
		this.state = {
            visible: false,
            showImage:''
        }
    }

    //打开图片
    onPerive(item) {
        this.setState({
            visible: true, 
            showImage: item ? item.replace('/_', '/') : ''
        })
    }
      
	render() {
        let { intl, queryThreadDetail } = this.props
        let { visible, showImage } = this.state;
		return (
            <div className="search-form thread-detail">
                <div className='store'>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="case.rapporteur" defaultMessage="报告人" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? queryThreadDetail.userName : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.reporting.time" defaultMessage="报告时间" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? queryThreadDetail.gmtCreate : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.clue.name" defaultMessage="线索名称" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? queryThreadDetail.clueName : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? queryThreadDetail.brandName : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.clue.clue.source" defaultMessage="线索来源" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? intl.locale === 'zh' ? queryThreadDetail.clueTypeName :  queryThreadDetail.clueTypeNameEn : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.tort.mode" defaultMessage="侵权方式" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? intl.locale === 'zh' ? queryThreadDetail.tortTypeName :  queryThreadDetail.tortTypeNameEn : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.sales.platform" defaultMessage="销售平台" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? intl.locale === 'zh' ? queryThreadDetail.platformTypeName :  queryThreadDetail.platformTypeNameEn : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="monitor.price" defaultMessage="价格" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? queryThreadDetail.salesPrice : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.sales.volume" defaultMessage="销量" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? queryThreadDetail.salesVolume : ''}</span>
                    </div>
                    <div className='row'>
                        <span className='lable'><FormattedMessage id="thread.sales.volume.value" defaultMessage="销售额" /> :</span>
                        <span className='row-info'>{queryThreadDetail ? queryThreadDetail.salesAmountFormat : ''}</span>
                    </div>
                    <div className='row link-stype'>
                        <span className='lable'><FormattedMessage id="monitor.storeName" defaultMessage="店铺名称" /> :</span>
                        <span className='row-info'>
                            <a href={queryThreadDetail ? queryThreadDetail.storeLink : ''} target='_blank' >
                                { queryThreadDetail ? queryThreadDetail.storeName : ''}
                            </a>
                        </span>
                    </div>
                    <div className='row link-stype'>
                        <span className='lable'><FormattedMessage id="thread.shop.address" defaultMessage="店铺链接" /> :</span>
                        <span className='row-info'>
                            <a href={queryThreadDetail ? queryThreadDetail.storeLink : ''} target='_blank' >
                                { queryThreadDetail ? queryThreadDetail.storeLink : ''}
                            </a>
                        </span>
                    </div>
                    <div className='row link-stype'>
                        <span className='lable'><FormattedMessage id="clue.report.shop.link" defaultMessage="商品链接" /> :</span>
                        <div className='row-info'>
                            {
                                queryThreadDetail && queryThreadDetail.prodUrl
                                    ? queryThreadDetail.prodUrl.split(',').map((item,index) => (
                                        <p key={index}>
                                            <a href={item} target='_blank'> {item}</a>
                                        </p>
                                    ))
                                    : ''
                            }
                        </div>
                    </div>
                    <div className='row link-stype'>
                        <span className='lable'><FormattedMessage id="thread.infringing.picture" defaultMessage="侵权图片" /> :</span>
                        <span className='row-info'>
                            {
                                queryThreadDetail && queryThreadDetail.prodPhoto
                                    ? queryThreadDetail.prodPhoto.split(',').map((item,index) => (
                                        <img src={item} alt="" key={index} onClick={()=>this.onPerive(item)}/>
                                    ))
                                    : ''
                            }
                        </span>
                    </div>
                    {
                        queryThreadDetail && queryThreadDetail.fileUrl ? 
                        <div className='row link-stype'>
                            <span className='lable'><FormattedMessage id="thread.clue.investigation.report" defaultMessage="调查报告" /> :</span>
                            <span className='row-info'><FileList fileList={queryThreadDetail.fileUrl} /></span>
                        </div>
                     : ''                        
                    }
                    {
                        queryThreadDetail && queryThreadDetail.reportDetail ?
                        <div className='row link-stype'>
                            <span className='lable'><FormattedMessage id="thread.clue.investigation.report.detail" defaultMessage="调查报告详情" /> :</span>
                            <span className='row-info enter'>{queryThreadDetail.reportDetail}</span>
                        </div>: ''
                    }
                    <div className='row link-stype'>
                        <span className='lable'><FormattedMessage id="clue.report.note" defaultMessage="备注" /> :</span>
                        <span className='row-info enter'>{queryThreadDetail ? queryThreadDetail.remark : ''}</span>
                    </div>
                </div>
                
                {
                    queryThreadDetail && queryThreadDetail.lawyerClueSubjectDOList && queryThreadDetail.lawyerClueSubjectDOList.length > 0 ? (
                        <div>
                            <Divider />
                            <div className="subject-type" style={{margin:'20px 0px'}}>
                                <FormattedMessage id="thread.main.body" defaultMessage="经营主体" description="经营主体" />
                                <span className="subject-title">( <FormattedMessage id="ligiation.subject.type" defaultMessage="主体类型" /> ：{queryThreadDetail ? intl.locale === 'zh' ? queryThreadDetail.subjectTypeName :  queryThreadDetail.subjectTypeNameEn : ''}) </span>
                            </div>
                        </div>
                    ):""
                }
                {
                    queryThreadDetail && queryThreadDetail.lawyerClueSubjectDOList
                        ? queryThreadDetail.lawyerClueSubjectDOList.map((item,index) => (
                            <div className='operators-detail' key={index}>
                                <Badge count={index+1}  style={{ backgroundColor: '#668fff',margin:'6px 0px' }} overflowCount={999}/>
                                <div className="operators-detail-wrapper">
                                <div className='row'>
                                        <span className='lable'><FormattedMessage id="thread.main.body" defaultMessage="经营主体" /> :</span>
                                        <Tooltip placement="topLeft" title={ intl.locale === 'zh'? item.subjectName :item.subjectNameEn}>
                                            <span className='row-info beyond'>{ intl.locale === 'zh'? item.subjectName :item.subjectNameEn}</span>
                                        </Tooltip>
                                    </div>
                                    <div className='row'>
                                        <span className='lable'><FormattedMessage id="thread.main.tag" defaultMessage="主体标签" /> :</span>
                                        <Tooltip placement="topLeft" title={ intl.locale === 'zh'? item.labelTypeName : item.labelTypeNameEn}>
                                            <span className='row-info beyond'>{ intl.locale === 'zh'? item.labelTypeName : item.labelTypeNameEn }</span>
                                        </Tooltip>
                                    </div>
                                    {
                                        queryThreadDetail ? queryThreadDetail.subjectType === 0 ? (
                                            <div>
                                                    <div className='row'>
                                                    <span className='lable'><FormattedMessage id="thread.main.identification" defaultMessage="主体标识" /> :</span>
                                                    <Tooltip placement="topLeft" title={ item.subjectIdentify }>
                                                        <span className='row-info beyond'>{item.subjectIdentify}</span>
                                                    </Tooltip>
                                                </div>
                                                <div className='row'>
                                                    <span className='lable'><FormattedMessage id="thread.legal.representative" defaultMessage="法定代表人" /> :</span>
                                                    <Tooltip placement="topLeft" title={ item.subjectLegal }>
                                                        <span className='row-info beyond'>{item.subjectLegal}</span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        ): queryThreadDetail.subjectType === 1? (
                                            <div className='row'>
                                                <span className='lable'><FormattedMessage id="case.id.number" defaultMessage="身份证号" /> :</span>
                                                <Tooltip placement="topLeft" title={ item.subjectIdentify }>
                                                    <span className='row-info beyond'>{item.subjectIdentify}</span>
                                                </Tooltip>
                                            </div>
                                        ): queryThreadDetail.subjectType === 2? (
                                            <div>
                                                <div className='row'>
                                                    <span className='lable'><FormattedMessage id="thread.main.identification" defaultMessage="主体标识" /> :</span>
                                                    <Tooltip placement="topLeft" title={ item.subjectIdentify }>
                                                        <span className='row-info beyond'>{item.subjectIdentify}</span>
                                                    </Tooltip>
                                                </div>
                                                <div className='row'>
                                                    <span className='lable'><FormattedMessage id="thread.operator" defaultMessage="经营者" /> :</span>
                                                    <Tooltip placement="topLeft" title={ item.subjectLegal }>
                                                        <span className='row-info beyond'>{item.subjectLegal}</span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        ):'':''
                                    }
                                    <div className='row'>
                                        <span className='lable'><FormattedMessage id="thread.main.area" defaultMessage="主体区域" /> :</span>
                                        <Tooltip placement="topLeft" title={ `${item.province} ${item.city} ${item.area}`}>
                                            <span className='row-info beyond'>{item.province} {item.city} {item.area}</span>
                                        </Tooltip>
                                    </div>
                                    <div className='row'>
                                        <span className='lable'><FormattedMessage id="thread.business.registration.address" defaultMessage="工商登记地址" /> :</span>
                                        <Tooltip placement="topLeft" title={ item.address }>
                                            <span className='row-info beyond'>{item.address}</span>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        ))
                        : ''
                }
                <PictureModal 
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    showImg={showImage}
                />
            </div>
		)
	}
}
export default injectIntl(Information)
