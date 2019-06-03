import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Col, Row, Button, Modal, message, Input } from 'antd';
import CueBonusModal from '../common/Cuebonus'
import Distribution from '../../common/distribution'
import { getButtonPrem} from '../../../../utils/util'
import '../../index.css'
class EssentialInformation extends Component {
    constructor() {
        super()
        this.state = {
            cueBonusVisible:false,
            createMoney:'',//线索奖励金额
            //分配modal
            visible:false,
            // 分配modal
            distribution:{
                investigationTime: '',
                investigationDate: null,//调查响应时间
                investigationLawTime: '',
                investigationLawDate: null,//调查+执法响应时间
                investigationMoney:'',//调查奖励
                investigationLawMoney:'',//调查+执法奖励
                lawTime:'',//执法时间
                lawDate:null,
                lawMoney:'',//执法奖励
                name:'',//调查员
                userId:''
            },
            editinvestigationMoney:"",
            editinvestigationLawMoney:"",
            editlawMoney:"",
            searchVisible:false,
            minPageNo:1,
            distributionType:null,
            isEdit:false
        }
    }

    //获取详情
    getData() {
        let {userInfo,id } =this.props
        if(this.props.getInvestigationDetail){
            let obj={
                id:id,
                userId:userInfo.userId
            }
            this.props.getInvestigationDetail(obj,()=>{

            })
        }
    }

     //审核通过-打开提交线索金额modal
     openCueBonusModal() {
        this.setState({
            cueBonusVisible:true,
            createMoney:''
        })
    }
       
    //(线索)审核通过-提交请输入线索奖励金
    submitCueBonusHandleOk() {
        let { createMoney } = this.state;
        let { id, intl } =this.props
        let data={
            createMoney:createMoney,
            id:id
        }
        if(createMoney==="" || createMoney===undefined){
            message.warning(intl.formatMessage({ id: 'investigation.please.input.thread.rewards', defaultMessage: "请输入线索奖励", description: "请输入线索奖励" }));
            return
        }
        if(this.props.getCueBonus){
            this.props.getCueBonus(data,()=>{
                this.setState({
                    cueBonusVisible:false
                },()=>{
                    this.eidtCheckCompensable(80)
                })
            })
        }
    }

    //审核通过-不通过
    eidtCheckCompensable(status) {
        let { id ,investigationReportList,updateInvestigationDetail ,eidtCheckCompensable,investigationDetail} =this.props
        let { createMoney } = this.state
        let data={
            status:status,
            id:id,
            createMoney:createMoney
        }
        if(eidtCheckCompensable){
            eidtCheckCompensable(data,investigationReportList,()=>{
                updateInvestigationDetail(data,investigationDetail)
            })
        }        
    }

    //(线索)审核通过-取消请输入线索奖励金
    handleCancelCueBonus() {
        this.setState({
            createMoney:'',
            cueBonusVisible:false
        })
    }

    //获取inputValue
    getInputValue(value,type) {
        if(type ==='investigationMoney' || type==='investigationLawMoney' || type==="lawMoney"){
            let { distribution } = this.state;
            distribution[type] = value;
            this.setState({
                distribution
            })
        }else{
            this.setState({
                [type]:value
            })   
        }
    }

    //获取调查员用户
    selectUserInfo(value) {
        let { distribution } = this.state
        distribution.name=value.userName
        distribution.userId=value.userId
        this.setState({
            distribution,
            searchVisible:false
        })
    }

    //搜索调查员
    showSearchlist() {
        this.setState({
            searchVisible:true
        },()=>{
            this.searchByName()
        })
    }

    //搜索distribution调查员信息
    searchByName(value) {
        let data={
            userName:value || '',
            pageSize:10,
            pageNo:1
        }
        if(this.props.getDistributionData){
            this.props.getDistributionData(data)
        }
    }

    //取消分配操作
    cancelOperation() {
        this.setState({
            visible:false,
            distribution:{
                investigationTime: '',
                investigationDate: null,//调查响应时间
                investigationLawTime: '',
                investigationLawDate: null,//调查+执法响应时间
                investigationMoney:'',//调查奖励
                investigationLawMoney:'',//调查+执法奖励
                lawTime:'',//执法时间
                lawDate:null,
                lawMoney:'',//执法奖励
                name:'',//调查员
            },
            distributionType:null//分配操作类型  1.调查+执法  2.执法
        }) 
    }

    //取消搜索值
    onSelectCancel() {
        this.setState({
            searchVisible:false
        })
    }

    // 选择日期
    changeDatePicker(date, dateStr, type, key) {
        //分配modal调查函数
        if(date){
            let { distribution } = this.state;
                distribution[type]=dateStr;
                distribution[key]=date;
                this.setState({
                    distribution
                })
        }
    }

    //获取调查员信息modal分页器
    minPaginationdata(page,pageSize) {
        this.setState({
            minPageNo:page,
        },()=>{
            this.openDistributionModal(null,this.state.distributionType)
        })
    }

    //获取调查员信息 modal信息
    openDistributionModal(id,type) {
        let { minPageNo } = this.state
        this.setState({
            visible:true,
            distributionType:type
        },()=>{
            let data={
                pageSize:10,
                pageNo:minPageNo
            }
            this.props.getDistributionData(data)
        })
    }

    //分配
    submitDistributionInfo() {
        let {id,investigationReportList, intl} =this.props
        let { distributionType, distribution } = this.state
        if(distribution.userId==="" || distribution.userId===undefined){
            message.warning(intl.formatMessage({ id: 'investigation.please.select.investigators', defaultMessage: "请选择调查员", description: "请选择调查员" }));
            return
        }
        let data={}
        data.compensableId = id;
        data.b2bUserId = distribution.userId;
        if( distributionType === 1 ){
            if(distribution.investigationMoney==="" || distribution.investigationMoney===undefined){
                message.warning(intl.formatMessage({ id: 'investigation.please.enter.awards', defaultMessage: "请输入调查奖励", description: "请输入调查奖励" }));
                return
            }
            if(distribution.investigationTime==="" || distribution.investigationTime===undefined){
                message.warning(intl.formatMessage({ id: 'investigation.please.select.the.survey.response.time', defaultMessage: "请选择调查响应时间", description: "请选择调查响应时间" }));
                return
            }
            if(distribution.investigationLawMoney==="" || distribution.investigationLawMoney===undefined){
                message.warning(intl.formatMessage({ id: 'investigation.Please.enter.the.amount.of.investigation.enforcement.award', defaultMessage: "请输入调查+执法奖励金额", description: "请输入调查+执法奖励金额" }));
                return
            }
            if(distribution.investigationLawTime==="" || distribution.investigationLawTime===undefined){
                message.warning(intl.formatMessage({ id: 'investigation.please.select.the.survey.enforcement.time', defaultMessage: "请选择调查+执法响应时间", description: "请选择调查+执法响应时间" }));
                return
            }
            data.researchMoney=distribution.investigationMoney
            data.researchTime=distribution.investigationTime
            data.money=distribution.investigationLawMoney
            data.allTime=distribution.investigationLawTime
            data.status = 31
        }else{
            if(distribution.lawMoney==="" || distribution.lawMoney===undefined){
                message.warning(intl.formatMessage({ id: 'investigation.please.enter.the.amount.enforcement.award', defaultMessage: "请输入执法奖励金额", description: "请输入执法奖励金额" }));
                return
            }
            if(distribution.lawTime==="" || distribution.lawTime===undefined){
                message.warning(intl.formatMessage({ id: 'investigation.please.choose.the.response.time', defaultMessage: "请选择执法响应时间", description: "请选择执法响应时间" }));
                return
            }
            data.lawTime=distribution.lawTime
            data.lawMoney=distribution.lawMoney
            data.status = 21
        }
        if(this.props.geteditInvestigationAllot){
            this.props.geteditInvestigationAllot(data,investigationReportList,()=>{
                this.cancelOperation()
                this.getData()
            })
        }
    }

    //线索完结
    eidtFinish(status) {
        let {  id } = this.props
        let data = {
            compensableId:id,
        }
        if(this.props.getFinishOperate){
            this.props.getFinishOperate(data,()=>{
                this.getData()
            })
        }
    }

    //任务-编辑
    isEdit() {
        let { investigationDetail } = this.props
        this.setState({
            isEdit:true,
            editinvestigationMoney : investigationDetail ? investigationDetail.b2bCompensableDetailDO.researchMoney:'',
            editinvestigationLawMoney : investigationDetail ? investigationDetail.b2bCompensableDetailDO.money:'',
            editlawMoney : investigationDetail ? investigationDetail.b2bCompensableDetailDO.lawMoney:''
        })
    }
    
    //任务-取消编辑
    cancelisEdit() {
        this.setState({
            isEdit:false,
        })
    }

    //任务-保存
    saveEditData() {
        let { editinvestigationMoney, editinvestigationLawMoney, editlawMoney } = this.state
        let { compensableId } =this.props
        let data={
            researchMoney:editinvestigationMoney,
            money:editinvestigationLawMoney,
            lawMoney:editlawMoney,
            compensableId:compensableId
        }
        if(this.props.getCreateMoney){
            this.props.getCreateMoney(data,()=>{
                this.setState({
                    isEdit:false
                },()=>{
                    this.getData()
                })
            })
        }
    }

    //任务完成 + 中止
    finishCompensable(type) {
        let { compensableId } = this.props
        let data={
            compensableId:compensableId
        }
        if(type==='finish'){
            if(this.props.getEditOverCompensable){
                this.props.getEditOverCompensable(data,()=>{
                    this.getData()
                })
            }
        }else{
            if(this.props.getStopCompensable){
                this.props.getStopCompensable(data,()=>{
                    this.getData()
                })
            }
        } 
    }

    //协商
    consultComensable(type) {
        let { compensableId } = this.props
        let data={
            compensableId:compensableId,
            type:type
        }
        if(this.props.getEditCheckConsult){
            this.props.getEditCheckConsult(data,()=>{
                this.getData()
            })
        }
    }

    render() {
        let { intl, getDistributionList, minTotal, minPageNo,investigationDetail,compensableId,typeDic,dic,type,journalData,permissionList} = this.props
        let { cueBonusVisible, createMoney ,visible, distribution, searchVisible,editinvestigationLawMoney, editlawMoney, editinvestigationMoney,isEdit,distributionType} = this.state
        return (
            <div className="investigation-detail">
                <div className="basic-info bottom-line investigation-detail-line">
                    <div className="investigation-info-title investigation-detail-title">
                        <FormattedMessage id="users.essential.information" defaultMessage="基本信息" description="基本信息" />
                        <div className="investigation-detail-title-en">BASIC INFORMATION</div>
                    </div>
                    <Row>
                        {
                            type==='1'?(
                                <div>
                                    {
                                        getButtonPrem(permissionList,'007001002') ?
                                            <div>
                                                {
                                                    investigationDetail?investigationDetail.status === 0 ?(
                                                        <Col span={6} offset={18}>
                                                            <Button type="primary" onClick={()=>this.openCueBonusModal()}><FormattedMessage id="global.volunteer.audit.type.pass" defaultMessage="审核通过" description="审核通过" /></Button>
                                                            <Button style={{marginLeft:'10px'}} onClick={()=>this.eidtCheckCompensable(90)}><FormattedMessage id="global.volunteer.audit.type.no.pass" defaultMessage="审核不通过" description="审核不通过" /></Button>
                                                        </Col>
                                                    ):"":""
                                                }
                                            </div>:''
                                    }
                                    {
                                        investigationDetail?investigationDetail.status === 80 || investigationDetail.status === 15 || investigationDetail.status === 35?(
                                            <Col span={6} offset={18}>
                                            {
                                                getButtonPrem(permissionList,'007001003')?
                                                <Button type="primary" onClick={()=>this.openDistributionModal(compensableId,1)}><FormattedMessage id="global.distribution" defaultMessage="分配" description="分配" /></Button>
                                                :''
                                            }
                                            {
                                                getButtonPrem(permissionList,'007001004')?
                                                <Button style={{marginLeft:'10px'}} onClick={()=>this.eidtFinish()}><FormattedMessage id="global.end" defaultMessage="完结" description="完结" /></Button>
                                                :''
                                            }
                                            </Col>
                                        ):"":""
                                    }
                                    {
                                        investigationDetail?investigationDetail.status === 25 || investigationDetail.status === 16 ?(
                                            <Col span={6} offset={18}>
                                                <Button type="primary" onClick={()=>this.openDistributionModal(compensableId,2)}><FormattedMessage id="global.distribution" defaultMessage="分配" description="分配" /></Button>
                                                <Button style={{marginLeft:'10px'}} onClick={()=>this.eidtFinish()}><FormattedMessage id="global.end" defaultMessage="完结" description="完结" /></Button>
                                            </Col>
                                        ):"":""
                                    }
                                </div>
                            ):(
                                <div>
                                    {
                                        getButtonPrem(permissionList,'007002004')?
                                            investigationDetail?investigationDetail.status === 12 || investigationDetail.status === 22 ||  investigationDetail.status === 32 ?(
                                                <Col span={6} offset={18}>
                                                    <Button type="primary" onClick={()=>this.consultComensable(1)}><FormattedMessage id="global.volunteer.consult.pass" defaultMessage="协商通过" description="协商通过" /></Button>
                                                    <Button style={{marginLeft:'10px'}} onClick={()=>this.consultComensable(2)}><FormattedMessage id="global.volunteer.consult.no.pass" defaultMessage="协商不通过" description="协商不通过" /></Button>
                                                </Col>
                                            ):"":""
                                        :""
                                    }
                                    {
                                        isEdit?(
                                            <div>
                                                <Col span={6} offset={18}>
                                                    <Button type="primary" onClick={()=>this.saveEditData()}><FormattedMessage id="global.save" defaultMessage="保存" description="保存" /></Button>
                                                    <Button style={{marginLeft:'10px'}} onClick={()=>this.cancelisEdit()}><FormattedMessage id="global.cancel" defaultMessage="取消" description="取消" /></Button>
                                                </Col>
                                            </div>
                                        ):(
                                            <div>
                                                {
                                                    investigationDetail ? parseInt(investigationDetail.status % 10,10) ===3 || parseInt(investigationDetail.status % 10,10) ===4 ?(
                                                        <Col span={12} offset={12} className="press-flex-end">
                                                            {
                                                                getButtonPrem(permissionList,'007002006')?
                                                                    investigationDetail ? parseInt(investigationDetail.b2bCompensableDetailDO.status % 10,10) === 2 || parseInt(investigationDetail.b2bCompensableDetailDO.status % 10,10) === 3 || parseInt(investigationDetail.b2bCompensableDetailDO.status % 10,10) === 4 ? (
                                                                        <Button type="primary" onClick={()=>this.isEdit()}><FormattedMessage id="global.edit" defaultMessage="编辑" description="编辑" /></Button>
                                                                    ):"":""
                                                                :""
                                                            }
                                                            {
                                                                getButtonPrem(permissionList,'007002003')?
                                                                    <Button style={{marginLeft:'10px'}} onClick={()=>this.finishCompensable('finish')}><FormattedMessage id="global.finish" defaultMessage="完成" description="完成" /></Button>
                                                                    :""
                                                            }
                                                            {
                                                                getButtonPrem(permissionList,'007002002')?
                                                                    <Button style={{marginLeft:'10px'}} onClick={()=>this.finishCompensable('stop')}><FormattedMessage id="global.suspension" defaultMessage="中止" description="中止" /></Button>
                                                                :""
                                                            }  
                                                            </Col>
                                                    ):"":""
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </Row>
                    <div className="investigation-detail-wrapper">
                        <div className="investigation-detail-basic">
                            <Col span={24} className="info-flex">
                                <div className="input-wrap text">
                                    { investigationDetail ? investigationDetail.name : '' }
                                </div>
                            </Col>
                        </div>
                        <div className="investigation-detail-info">
                            <Row> 
                                <Col span={8} className="info-flex">
                                    <p className="info-label text">
                                        <FormattedMessage id="investigation.detail.task.phase" defaultMessage="任务阶段" description="任务阶段" /> :
                                    </p>
                                    <div className="input-wrap text">
                                        { investigationDetail ? type==='1'? dic[investigationDetail.status] : dic[investigationDetail.b2bCompensableDetailDO.status] : '' }
                                    </div>
                                </Col>
                                {
                                    type==='1'?(
                                        <Col span={8} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.lead.type" defaultMessage="线索类型" description="线索类型" /> :
                                            </p>
                                            <div className="input-wrap text">
                                                { investigationDetail ? typeDic[investigationDetail.type] : ''}
                                            </div>
                                        </Col>
                                    ):(
                                        <Col span={8} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.lead.type.task" defaultMessage="任务类型" description="任务类型" /> :
                                            </p>
                                            <div className="input-wrap text">
                                                { investigationDetail ? typeDic[investigationDetail.type] : ''}
                                            </div>
                                        </Col>
                                    )
                                }
                                {
                                    type==='1'?(
                                        <Col span={8} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.detail.clue.reward" defaultMessage="线索奖励" description="线索奖励" /> :
                                            </p>
                                            <div className="input-wrap text">
                                                {investigationDetail ? investigationDetail.createMoney : ''}
                                            </div>
                                        </Col>
                                    ):''
                                }
                                {
                                    type==='1'?(
                                        <div>
                                            {
                                                investigationDetail ?  investigationDetail.status===97 || investigationDetail.status === 35 ?'':investigationDetail.b2bCompensableDetailDO?investigationDetail.b2bCompensableDetailDO.researchMoney?(
                                                    <Col span={8}>
                                                        <div className="info-wrapper">
                                                            <div className="info-label text">
                                                                <FormattedMessage id="investigation.detail.investigation.awards" defaultMessage="调查奖励" description="调查奖励" /> :
                                                            </div>
                                                            <div className="input-wrap text">
                                                                {investigationDetail ? investigationDetail.b2bCompensableDetailDO.researchMoney : ''}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ):'':'':''
                                            }
                                            {
                                                investigationDetail ? investigationDetail.status===25 || investigationDetail.status === 17 || investigationDetail.status === 97 ? '':investigationDetail.b2bCompensableDetailDO?investigationDetail.b2bCompensableDetailDO.lawMoney?(
                                                    <Col span={8}>
                                                        <div className="info-wrapper">
                                                            <div className="info-label text">
                                                                <FormattedMessage id="investigation.detail.law.enforcement.award" defaultMessage="执法奖励" description="执法奖励" /> :
                                                            </div>
                                                            <div className="input-wrap text">
                                                                {investigationDetail ? investigationDetail.b2bCompensableDetailDO.lawMoney : ''}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ):'':'':''
                                            }
                                            {
                                                investigationDetail ? investigationDetail.status===35 ? '' : investigationDetail.b2bCompensableDetailDO?investigationDetail.b2bCompensableDetailDO.money?(
                                                    <Col span={8}>
                                                        <div className="info-wrapper">
                                                            <div className="info-label text">
                                                                <FormattedMessage id="investigation.law.enforcement.award" defaultMessage="调查+执法奖励" description="调查+执法奖励" /> :
                                                            </div>
                                                            <div className="input-wrap text">
                                                                {investigationDetail ? investigationDetail.b2bCompensableDetailDO.money : ''}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ):'':'':''
                                            }
                                        </div>
                                    ):(
                                        <div>
                                            {
                                                investigationDetail ? investigationDetail.b2bCompensableDetailDO ? parseInt(investigationDetail.b2bCompensableDetailDO.status / 10, 10) === 1 ?(
                                                    <Col span={8}>
                                                        {
                                                            isEdit?(
                                                                <Form.Item label={intl.formatMessage({ id: 'investigation.awards', defaultMessage: "调查奖励" })}>
                                                                    <Input 
                                                                        type='number' 
                                                                        placeholder={intl.formatMessage({id: 'investigation.please.enter.awards',defaultMessage: '请输入调查奖励'})} 
                                                                        onChange={(e)=>{this.getInputValue(e.target.value.trim(),'editinvestigationMoney')}} 
                                                                        value={editinvestigationMoney}
                                                                    />
                                                                </Form.Item>
                                                            ):(
                                                                <div className="info-wrapper">
                                                                    <div className="info-label text">
                                                                        <FormattedMessage id="investigation.detail.investigation.awards" defaultMessage="调查奖励" description="调查奖励" /> :
                                                                    </div>
                                                                    <div className="input-wrap text">
                                                                        {investigationDetail ? investigationDetail.b2bCompensableDetailDO.researchMoney : ''}
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </Col>
                                                ):"":"":''
                                            }
                                            {
                                                investigationDetail ? investigationDetail.b2bCompensableDetailDO ? parseInt(investigationDetail.b2bCompensableDetailDO.status / 10, 10) === 2 ?(
                                                    <Col span={8}>
                                                        {
                                                            isEdit?(
                                                                <Form.Item label={intl.formatMessage({ id: 'investigation.law.awards', defaultMessage: "执法奖励" })}>
                                                                    <Input  type='number' placeholder={intl.formatMessage({id: 'investigation.please.enter.law.awards',defaultMessage: '请输入执法奖励'})} onChange={(e)=>{this.getInputValue(e.target.value.trim(),'editlawMoney')}} value={editlawMoney}/>
                                                                </Form.Item>
                                                            ):(
                                                                <div className="info-wrapper">
                                                                    <div className="info-label text">
                                                                        <FormattedMessage id="investigation.detail.law.enforcement.award" defaultMessage="执法奖励" description="执法奖励" /> :
                                                                    </div>
                                                                    <div className="input-wrap text">
                                                                        {investigationDetail ? investigationDetail.b2bCompensableDetailDO.lawMoney : ''}
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </Col>
                                                ):'':'':''
                                            }
                                            {
                                                investigationDetail ? investigationDetail.b2bCompensableDetailDO ? parseInt(investigationDetail.b2bCompensableDetailDO.status / 10, 10) === 3 ?(
                                                    <Col span={8}>
                                                    {
                                                        isEdit?(
                                                            <Form.Item label={intl.formatMessage({ id: 'investigation.law.enforcement.award', defaultMessage: "调查+执法奖励" })}>
                                                                <Input  type='number' placeholder={intl.formatMessage({id: 'investigation.please.enter.law.enforcement.award',defaultMessage: '请输入调查+执法奖励'})} onChange={(e)=>{this.getInputValue(e.target.value.trim(),'editinvestigationLawMoney')}} value={editinvestigationLawMoney}/>
                                                            </Form.Item>
                                                        ):(
                                                            <div className="info-wrapper">
                                                                <div className="info-label text">
                                                                    <FormattedMessage id="investigation.law.enforcement.award" defaultMessage="调查+执法奖励" description="调查+执法奖励" /> :
                                                                </div>
                                                                <div className="input-wrap text">
                                                                    {investigationDetail ? investigationDetail.b2bCompensableDetailDO.money : ''}
                                                                </div>
                                                            </div>
                                                        )
                                                    } 
                                                </Col>
                                                ):'':'':''
                                            }
                                        </div>
                                    )
                                }
                                {/* type==='2'  type==='1' 调查举报线索详情   type==='2'  调查任务详情*/}
                                {
                                    investigationDetail ? investigationDetail.b2bCompensableDetailDO ? parseInt(investigationDetail.b2bCompensableDetailDO.status/10,10) === 1 && type==='2'?(
                                        <Col span={8} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.response.time" defaultMessage="响应时间" description="响应时间" /> :
                                            </p>
                                            <div className="input-wrap text">
                                                { investigationDetail ? investigationDetail.b2bCompensableDetailDO.researchTime.split(' ')[0] : ''}
                                            </div>
                                        </Col>
                                    ):"":"":""
                                }
                                {
                                    investigationDetail ? investigationDetail.b2bCompensableDetailDO ? parseInt(investigationDetail.b2bCompensableDetailDO.status/10,10) === 2 && type==='2'?(
                                        <Col span={8} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.response.time" defaultMessage="响应时间" description="响应时间" /> :
                                            </p>
                                            <div className="input-wrap text">
                                                { investigationDetail ? investigationDetail.b2bCompensableDetailDO.lawTime.split(' ')[0] : ''}
                                            </div>
                                        </Col>
                                    ):"":"":""
                                }
                                {
                                    investigationDetail ? investigationDetail.b2bCompensableDetailDO ? parseInt(investigationDetail.b2bCompensableDetailDO.status/10,10) === 3  && type==='2'?(
                                        <Col span={8} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.response.time" defaultMessage="响应时间" description="响应时间" /> :
                                            </p>
                                            <div className="input-wrap text">
                                                { investigationDetail ? investigationDetail.b2bCompensableDetailDO.allTime.split(' ')[0] : ''}
                                            </div>
                                        </Col>
                                    ):"":"":""
                                }
                                {
                                    investigationDetail ? investigationDetail.b2bCompensableDetailDO?investigationDetail.b2bCompensableDetailDO.status=== 80?(
                                        <Col span={8} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.response.time" defaultMessage="响应时间" description="响应时间" /> :
                                            </p>
                                            <div className="input-wrap text">
                                                { investigationDetail ? investigationDetail.b2bCompensableDetailDO.allTime.split(' ')[0] : ''}
                                            </div>
                                        </Col>
                                    ):"":"":""
                                }
                                {
                                    type==='1'?"":(
                                        <Col span={8} className="info-flex">
                                            <p className="info-label text">
                                                <FormattedMessage id="investigation.detail.group.members" defaultMessage="组团人员" description="组团人员" /> :
                                            </p>
                                            <div className="input-wrap text">
                                            {
                                                journalData?journalData.map((v,i)=>(
                                                    <span key={v.id} style={{marginRight:'10px'}}>{v.tag}</span>
                                                )):''
                                            }
                                            </div>
                                        </Col>
                                    )
                                }
                                {
                                    investigationDetail?investigationDetail.b2bCompensableDetailDO?investigationDetail.b2bCompensableDetailDO.status === 12 || investigationDetail.b2bCompensableDetailDO.status === 22 || investigationDetail.b2bCompensableDetailDO.status === 32 ?(
                                        <div>
                                            <Col span={8} className="info-flex">
                                                <p className="info-label text">
                                                    <FormattedMessage id="investigation.detail.negotiated.amount" defaultMessage="协商金额" description="协商金额" /> :
                                                </p>
                                                <div className="input-wrap text">
                                                    { investigationDetail ? investigationDetail.consultMoney : ''}
                                                </div>
                                            </Col>
                                            <Col span={8} className="info-flex">
                                                <p className="info-label text">
                                                    <FormattedMessage id="investigation.detail.negotiated.time" defaultMessage="协商时间" description="协商时间" /> :
                                                </p>
                                                <div className="input-wrap text">
                                                    { investigationDetail ? investigationDetail.consultTime : ''}
                                                </div>
                                            </Col>
                                        </div>
                                    ):"" :"":""
                                }
                            </Row>
                        </div>
                    </div>
                </div>
                <Modal
                    title={'请输入线索奖励金额'}
                    visible={cueBonusVisible}
                    onOk={() => this.submitCueBonusHandleOk()}
                    onCancel={()=>this.handleCancelCueBonus()}
                    >
                    <CueBonusModal
                        getInputValue={ (value,type) => this.getInputValue(value,type) }
                        createMoney={createMoney}
                    />
                </Modal>    
                <Modal
                    visible={visible}
                    onCancel={() => this.cancelOperation()}
                    onOk={()=>this.submitDistributionInfo()}
					className="root"
                    >
                        <Distribution
                            distribution={ distribution }
                            getInputValue={ (value,type)=>this.getInputValue(value,type) }
                            changeDatePicker={ (date, dateStr, type, key)=>this.changeDatePicker(date, dateStr, type, key) }
                            getDistributionList={ getDistributionList }
                            searchVisible={ searchVisible }
                            selectUserInfo={ (value) => this.selectUserInfo( value ) }
                            showSearchlist={ () => this.showSearchlist() }
                            minTotal={ minTotal }
                            minPaginationdata={ (pageNo,pageSize) => this.minPaginationdata(pageNo,pageSize) }
                            searchByName={ (value) => this.searchByName(value) }
                            distributionType={ distributionType }
                            onSelectCancel={() => this.onSelectCancel()}
                            minPageNo={minPageNo}
                        />
                </Modal>
            </div>
        )
    }
}
export default injectIntl(EssentialInformation)