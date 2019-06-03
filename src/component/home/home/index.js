//主页
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom';
import Content from '../../common/layout/content/index'
import caseLitigation1 from '../../../assets/images/ssajgk_icon_1.png'
import caseLitigation2 from '../../../assets/images/ssajgk_icon_2.png'
import caseLitigation3 from '../../../assets/images/ssajgk_icon_3.png'
import caseLitigation4 from '../../../assets/images/ssajgk_icon_4.png'
import caseLitigation5 from '../../../assets/images/ssajgk_icon_5.png'
import caseLitigation6 from '../../../assets/images/ssajgk_icon_6.png'
import caseLitigation7 from '../../../assets/images/ssajgk_icon_7.png'
import caseLitigation8 from '../../../assets/images/ssajgk_icon_8.png'
import caseLitigation9 from '../../../assets/images/ssajgk_icon_9.png'
import './index.css'

export default class Home extends Component {
    componentWillMount() {
        this.getNoticeList()
        this.getSuitCase()
    }

    getNoticeList() {
        let { userInfo, getNotice } = this.props;
        if (getNotice) {
            getNotice({ userId: userInfo.userId })
        }
    }

    getSuitCase() {
        let { getSuitCaseCount } = this.props;
        if (getSuitCaseCount) {
            getSuitCaseCount()
        }
    }

    // 渲染路由
    renderRouterPath(id) {
        switch (id) {
            case 1:
                return { pathname: '/monitor/result', query: { auditStatus: '0' } }
            case 2:
                return { pathname: '/clue/line', query: { status: 1 } }
            case 3:
                return { pathname: '/clue/offline', query: { status: 1 } }
            case 4:
                return { pathname: '/clue/report/line', query: { status: 1 } }
            case 5:
                return { pathname: '/clue/report/offline', query: { status: 1 } }
            default:
                return ''
        }
    }

    // 渲染文案
    renderCountName(id) {
        switch (id) {
            case 1:
                return <FormattedMessage id="home.monitoring.task.check" defaultMessage="数据监测待审核" description="数据监测待审核" />
            case 2:
                return <FormattedMessage id="home.online.tip.off.report.check" defaultMessage="线上举报待审核" description="线上举报待审核" />
            case 3:
                return <FormattedMessage id="home.offline.tip.off.report.check" defaultMessage="线下举报待审核" description="线下举报待审核" />
            case 4:
                return <FormattedMessage id="home.online.tip.off.task.check" defaultMessage="线上任务待审核" description="线上任务待审核" />
            case 5:
                return <FormattedMessage id="home.offline.tip.off.task.check" defaultMessage="线下任务待审核" description="线下任务待审核" />
            default:
                return ''
        }
    }

    //渲染dom
    render() {
        let { noticeList, suitCaseCount } = this.props;
        let count2 = suitCaseCount && suitCaseCount.status2 ? suitCaseCount.status2 : 0
        let count3 = suitCaseCount && suitCaseCount.status3 ? suitCaseCount.status3 : 0
        let count4 = suitCaseCount && suitCaseCount.status4 ? suitCaseCount.status4 : 0
        let count5 = suitCaseCount && suitCaseCount.status5 ? suitCaseCount.status5 : 0
        let count6 = suitCaseCount && suitCaseCount.status6 ? suitCaseCount.status6 : 0
        let count7 = suitCaseCount && suitCaseCount.status7 ? suitCaseCount.status7 : 0
        let count8 = suitCaseCount && suitCaseCount.status8 ? suitCaseCount.status8 : 0
        let count9 = suitCaseCount && suitCaseCount.status9 ? suitCaseCount.status9 : 0
        let count10 = suitCaseCount && suitCaseCount.status10 ? suitCaseCount.status10 : 0
        let count11 = suitCaseCount && suitCaseCount.status11 ? suitCaseCount.status11 : 0
        let count12 = count9 + count10 + count11
        let count1 = count2 + count3 + count4 + count5 + count6 + count7 + count8 + count12
        return (
            <Content>
                <div className="Admincontent">
                    <div className="top_sub">
                        <div className="left_list">
                            <div className="top_name">
                                <FormattedMessage id="home.common.function" defaultMessage="常用功能" description="常用功能" />
                                &nbsp;
                            </div>
                            <div className="left_content">
                                <div className="contents">
                                    <ul className="left_content_ul">
                                        <li className="left_content_lis">
                                            <Link to={'/line'}>
                                                <div className="left_content_item">
                                                    <div className="left_imgs">
                                                        <img src={require('../../../assets/images/3.png')} alt="" />
                                                    </div>
                                                    <div className="left_title">
                                                        <FormattedMessage id="home.tip.off.task.check" defaultMessage="举报任务审核" description="举报任务审核" />
                                                        <br />
                                                        <FormattedMessage id="home.check.and.analyze.online.and.offline.clues.tipped.off.by.users" defaultMessage="对用户的线上、线下举报线索进行分析、审核" description="对用户的线上、线下举报线索进行分析、审核" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="left_content_lis">
                                            <Link to={'/task'}>
                                                <div className="left_content_item">
                                                    <div className="left_imgs">
                                                        <img src={require('../../../assets/images/1.png')} alt="" />
                                                    </div>
                                                    <div className="left_title">
                                                        <FormattedMessage id="home.create.tip.off.task" defaultMessage="新建举报任务" description="新建举报任务" />
                                                        <br />
                                                        <FormattedMessage id="home.release.specific.tasks.or.time.limited.activities.for.users.to.participate" defaultMessage="发布具体任务，或者限时活动组织用户参与" description="发布具体任务，或者限时活动组织用户参与" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="left_content_lis">
                                            <Link to={'/monitoringRule'}>
                                                <div className="left_content_item">
                                                    <div className="left_imgs">
                                                        <img src={require('../../../assets/images/2.png')} alt="" />
                                                    </div>
                                                    <div className="left_title">
                                                        <FormattedMessage id="home.create.monitoring.rule" defaultMessage="新建监控规则" description="新建监控规则" />
                                                        <br />
                                                        <FormattedMessage id="home.dimensions.for.the.use.of.monitoring.commodities.on.various.platforms" defaultMessage="增加不同纬度的条件，监测各网站平台商品" description="增加不同纬度的条件，监测各网站平台商品" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="left_content_lis">
                                            <Link to={'/monitoringTask'}>
                                                <div className="left_content_item">
                                                    <div className="left_imgs">
                                                        <img src={require('../../../assets/images/4.png')} alt="" />
                                                    </div>
                                                    <div className="left_title">
                                                        <FormattedMessage id="home.monitoring.task.audit" defaultMessage="监控任务审核" description="监控任务审核" />
                                                        <br />
                                                        <FormattedMessage id="home.check.the.data.monitored.by.rules" defaultMessage="审核任务监测到的具体数据情况" description="审核任务监测到的具体数据情况" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="left_list">
                            <div className="top_name">
                                <FormattedMessage id="home.data.analysis" defaultMessage="数据分析" description="数据分析" />
                                &nbsp;
                            </div>
                            <div className="left_content">
                                <div className="contents">
                                    <div className="Chart" style={{ height: '100%' }}>
                                        {/*<EChart/>*/}
                                        <div className="displays">
                                            <div className="msg">
                                                <FormattedMessage id="home.the.function.is.not.available.yet.please.look.forward.to.it" defaultMessage="功能暂未开放，敬请期待！" description="功能暂未开放，敬请期待！" />
                                            </div>
                                            <div className="img-wrap">
                                                <img src={require('../../../assets/images/img_echarts.png')} alt="示例" style={{ width: '106%' }} />
                                                {/*<EChart/>*/}
                                            </div>
                                            <div className="">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="left_list">
                            <div className="top_name">
                                <FormattedMessage id="home.notification" defaultMessage="消息通知" description="消息通知" />
                                &nbsp;
                            </div>
                            <div className="left_content">
                                <div className="contents">
                                    <ul>
                                        {
                                            noticeList && noticeList.filter(item => item.count !== 0)
                                                .map(item => (
                                                    <li className="Message_list" key={item.id}>
                                                        <Link
                                                            to={this.renderRouterPath(item.id)}>
                                                            <span className="watchName number">{item.count}
                                                                <span className="black">
                                                                    <FormattedMessage id="home.pending" defaultMessage="条" description="条" />
                                                                </span>
                                                            </span>
                                                            <span className="watchName">
                                                                {this.renderCountName(item.id)}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="homeBoxKan">
                        <h3 className="homeTitleKan">
                            <FormattedMessage id='home.overview.of.litigation.cases' defaultMessage='案件诉讼概况' />
                    </h3>
                        <div className="homeContentTop caseLitigationBox">
                            <div className="caseLitigation-item">
                                <span><img src={caseLitigation1} alt="更多" /></span>
                                <span className="caseLitigation-more">{count1}</span>
                                <span><FormattedMessage id='home.have.accepted' defaultMessage='已接受' /></span>
                            </div>
                            <div className="caseLitigation-item">
                                <span><img src={caseLitigation2} alt="更多" /></span>
                                <span className="caseLitigation-more"><Link to={{pathname: '/thread/litigation/list', query: { status: 2 }}}>{count2}</Link></span>
                                <span><FormattedMessage id='home.forensics' defaultMessage='取证' /></span>
                            </div>
                            <div className="caseLitigation-item">
                                <span><img src={caseLitigation3} alt="更多" /></span>
                                <span className="caseLitigation-more"><Link to={{pathname: '/thread/litigation/list', query: { status: 3 }}}>{count3}</Link></span>
                                <span><FormattedMessage id='home.action.plan' defaultMessage='诉讼方案' /></span>
                            </div>
                            <div className="caseLitigation-item">
                                <span><img src={caseLitigation4} alt="更多" /></span>
                                <span className="caseLitigation-more"><Link to={{pathname: '/thread/litigation/list', query: { status: 4 }}}>{count4}</Link></span>
                                <span><FormattedMessage id='home.put.on.record' defaultMessage='立案' /></span>
                            </div>
                            <div className="caseLitigation-item">
                                <span><img src={caseLitigation5} alt="更多" /></span>
                                <span className="caseLitigation-more"><Link to={{pathname: '/thread/litigation/list', query: { status: 5 }}}>{count5}</Link></span>
                                <span><FormattedMessage id='home.before.the.court' defaultMessage='庭前' /></span>
                            </div>
                            <div className="caseLitigation-item">
                                <span><img src={caseLitigation6} alt="更多" /></span>
                                <span className="caseLitigation-more"><Link to={{pathname: '/thread/litigation/list', query: { status: 6 }}}>{count6}</Link></span>
                                <span><FormattedMessage id='home.the.trial' defaultMessage='庭审' /></span>
                            </div>
                            <div className="caseLitigation-item">
                                <span><img src={caseLitigation7} alt="更多" /></span>
                                <span className="caseLitigation-more"><Link to={{pathname: '/thread/litigation/list', query: { status: 7 }}}>{count7}</Link></span>
                                <span><FormattedMessage id='home.judgment' defaultMessage='判决' /></span>
                            </div>
                            <div className="caseLitigation-item">
                                <span><img src={caseLitigation8} alt="更多" /></span>
                                <span className="caseLitigation-more"><Link to={{pathname: '/thread/litigation/list', query: { status: 8 }}}>{count8}</Link></span>
                                <span><FormattedMessage id='home.in.the.end' defaultMessage='结案中' /></span>
                            </div>
                            <div className="caseLitigation-item">
                                <span><img src={caseLitigation9} alt="更多" /></span>
                                <span className="caseLitigation-more">{count12}</span>
                                {/* <span className="caseLitigation-more"><Link to={{pathname: '/thread/litigation/list', query: { status: 9 }}}>{count12}</Link></span> */}
                                <span><FormattedMessage id='home.the.case' defaultMessage='结案' /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
        )
    }
}