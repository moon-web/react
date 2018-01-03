//任务管理
import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import E from 'wangeditor'
import $ from 'jquery';
import API from '../../api/index'
import {
    Form,
    Button,
    Table,
    Pagination,
    Select,
    Breadcrumb,
    DatePicker,
    Layout,
    Input,
} from 'antd';
import PropTypes from 'prop-types'
const Option = Select.Option;
const {Header} = Layout;

var columns;
let selectUserId = [];

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        selectUserId = []
        for (let i = 0; i < selectedRows.length; i++) {
            selectUserId.push(selectedRows[i].id)
        }
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
    }),
};


class Task extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            selectedRowKeys: [],
            data: [],
            name: '',
            pageNo: 1,
            records: 0,
            current: 1,
            brandName: '',
            type: '',
            gmtCreate: '',
            status: '',
            introduction: '',
            pageNo: 1,// 页面号  默认1
            user: '',// 用户名称
            size: 'default',
            require: '',
            endTime: '',
            startTime: '',
            aa: '',
            startValue: null,
            endValue: null,
            endOpen: false,
            bb: [],
            brandId: '',
            editorContent: '',
            editorContents: '',
            loading:true
        }
        this.brand_active = this.brand_active.bind(this);
    }
    //举报任务管理
    task_list = (page) =>{
        this.setState({loading:true})
        let userId = localStorage.getItem("userId")
        if (userId === '1') {
            userId = ''
        }
        let taskData = {
            pageNo: this.state.pageNo,
            pageSize: 15,
            brandName: this.state.brandName,
            type: this.state.type,
            status: this.state.status,
            startTime:this.state.startTime,
            endTime:this.state.endTime,
            brandUserId: userId
        }
        API.task(taskData).then(res => {
            let data = [];
            let type = null;
            let status = null;
            this.setState({
                aa: res
            })
            if (res.result && res.result.length > 0) {
                for (let i = 0; i < res.result.length; i++) {
                    if (res.result[i].type === 1) {
                        type = '线上任务'
                    }
                    if (res.result[i].type === 2) {
                        type = '线下任务'
                    }
                    if (res.result[i].status === 1) {
                        status = '已发布'
                    }
                    if (res.result[i].status === 2) {
                        status = '任务结束'
                    }
                    data.push({
                        key: i,
                        id: res.result[i].id,
                        name: res.result[i].name,
                        brandName: res.result[i].brandName,
                        type: type,
                        gmtCreate: res.result[i].gmtCreate,
                        status: status,
                        introduction: res.result[i].introduction,
                        require: res.result[i].require,
                        endTime: res.result[i].endTime,
                        startTime: res.result[i].startTime,
                        totalPages: res.totalPages,
                        pageSize: res.pageSize
                    })
                }
                this.setState({data: data, records: res.records,loading:false})
            }
        })
    }
    componentDidMount() {
        this.task_list(this.state.pageNo)
        //发布任务品牌列表
        let brandData = {
            userId: localStorage.getItem("userId")
        }
        API.brand(brandData).then(res => {
            if (res.success === true) {
                this.setState({bb: res.result})
            }
        })

        //wangeditor
        const elem = this.refs.editorElem
        const elems = this.refs.editorElems
        const editors = new E(elems)
        const editor = new E(elem)
        //配置表情
        // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
        editor.customConfig.emotions = [
            {
                // tab 的标题
                title: '默认',
                // type -> 'emoji' / 'image'
                type: 'image',
                // content -> 数组
                content: [
                    {
                        alt: '[坏笑]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
                    },
                    {
                        alt: '[舔屏]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
                    }
                ]
            },
            {
                // tab 的标题
                title: 'emoji',
                // type -> 'emoji' / 'image'
                type: 'emoji',
                // content -> 数组
                content: ['😀', '😃', '😄', '😁', '😆']
            }
        ]
        //颜色
        editor.customConfig.colors = [
            '#000000',
            '#eeece0',
            '#1c487f',
            '#4d80bf',
            '#c24f4a',
            '#8baa4a',
            '#7b5ba1',
            '#46acc8',
            '#f9963b',
            '#ffffff'
        ]
        editors.customConfig.emotions = [
            {
                // tab 的标题
                title: '默认',
                // type -> 'emoji' / 'image'
                type: 'image',
                // content -> 数组
                content: [
                    {
                        alt: '[坏笑]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
                    },
                    {
                        alt: '[舔屏]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
                    }
                ]
            },
            {
                // tab 的标题
                title: 'emoji',
                // type -> 'emoji' / 'image'
                type: 'emoji',
                // content -> 数组
                content: ['😀', '😃', '😄', '😁', '😆']
            }
        ]


        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            this.setState({
                editorContent: html,
            })
        }

        editor.customConfig.uploadImgServer = 'http://118.89.197.95/ipcommune/image/upload';

        //限制图片上传名称
        editor.customConfig.uploadFileName = 'image';

        //图片上传接受信息
        editor.customConfig.uploadImgHeaders = {

            'Accept': 'text/x-json'

        };
        editor.customConfig.uploadImgHooks = {

            customInsert: function (insertImg, result, editor) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var url = result.msgCode
                insertImg(url)

                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        };
        editor.create()


        editors.customConfig.onchange = html => {
            this.setState({
                editorContents: html
            })
        }

        editors.customConfig.uploadImgServer = 'http://118.89.197.95/ipcommune/image/upload';

        //限制图片上传名称
        editors.customConfig.uploadFileName = 'image';

        //图片上传接受信息
        editors.customConfig.uploadImgHeaders = {

            'Accept': 'text/x-json'

        };
        editors.customConfig.uploadImgHooks = {

            customInsert: function (insertImg, result, editor) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var url = result.msgCode
                insertImg(url)

                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        };
        editors.create()
    }

    componentDidUpdate(){
        //权限菜单
        let permission = this.context.permission;
        if(permission) {
            permission.forEach(v => {
                if (v.permValue === 'report') {
                    v.children.forEach(item => {
                        if (item.permValue === 'report/task') {
                            $('.qiyong').attr({disabled: "disabled"})
                            if (item.children) {
                                item.children.forEach(list => {
                                    if (list.permValue === '3') {
                                        $('.qiyong').attr({disabled: null})
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }
    getbrandName = (e) => {
        this.setState({brandName: e.target.value});
    }
    getType = (value) => {
        this.setState({type: value});
    }
    getStatus = (value) => {
        this.setState({status: value});
    }
    getTime = (e) => {
        this.setState({gmtCreate: e.target.value});
    }
    //搜索
    searchCon = () => {
        this.task_list(this.state.pageNo)
    }
    //分页
    onChangePage = (page) => {
        this.setState({
            current: page,
            pageNo: page,
        });
        this.task_list(page)

    }

    //新增任务
    addtype = (value) => {
        this.setState({type: value})
    }
    addname = (e) => {
        this.setState({name: e.target.value})
    }
    selecthandleChange = (value) => {
        this.setState({brandId: value})
    }
    require = (e) => {
        this.setState({require: this.state.editorContent})
    }

    introduction = (e) => {
        this.setState({introduction: e.target.value})
    }
    //发布任务保存
    baocun = (e) => {
        var ech = (encodeURIComponent(this.state.editorContent))
        var echs = (encodeURIComponent(this.state.editorContents))
        let taskAddData = {
            name: this.state.name,
            type: this.state.type,
            require: ech,
            endTime: this.state.endTime,
            startTime: this.state.startTime,
            introduction: echs,
            brandId: this.state.brandId,
            status: 2
        }
        API.task_add(taskAddData).then(res => {
            if (res.success === true) {
                $(".flex_task").addClass("brand_active");
                this.task_list(this.state.pageNo)
            }
        })
    }

    //取消新增
    cancle = (e) => {
        $(".flex_task").addClass("brand_active");
    }

    brand_active() {
        $(".flex_task").removeClass("brand_active");
    }

    //start
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    //end
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    onStartChange = (value) => {
        if (value && value != undefined) {
            let date = new Date(value._d);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let second = date.getSeconds();

            function checked(test) {
                if (test <= 9) {
                    test = '0' + test
                }
                return test
            }

            let time = `${year}-${checked(month)}-${checked(day)} ${checked(hours)}:${checked(minutes)}:${checked(second)}`;
            this.setState({startTime: time})
        }
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        if (value && value != undefined) {
            let date = new Date(value._d);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let second = date.getSeconds();

            function checked(test) {
                if (test <= 9) {
                    test = '0' + test
                }
                return test
            }

            let time = `${year}-${checked(month)}-${checked(day)} ${checked(hours)}:${checked(minutes)}:${checked(second)}`;
            this.setState({endTime: time})
        }
        this.onChange('endValue', value);
    }


    //结束任务
    forbiden = () => {
        let data = selectUserId.join(',');
        let taskFinishData = {
            status: 2,
            id: data
        }
        API.task_finish(taskFinishData).then(res => {
            if (res.success === true) {
                this.task_list(this.state.pageNo)
            }
        })
    }
//重置
    resetting = () => {
        this.setState({
            brandName: '',
            type: '0',
            status: '0',
            startValue: '',
            startTime: '',
            endTime: ''
        })
    }

    render() {
        const {startValue, endValue, endOpen, size} = this.state
        if (localStorage.lan === 'chinese') {
            columns = [{
                title: '任务名称',
                dataIndex: 'name',
                width: 200
            }, {
                title: '所属品牌',
                dataIndex: 'brandName',
                width: 200
            }, {
                title: '任务类型',
                dataIndex: 'type',
                width: 200
            }, {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                width: 200
            }, {
                title: '任务状态',
                dataIndex: 'status',
                width: 200
            }];
        }
        else {
            columns = [{
                title: 'Task Name',
                dataIndex: 'name',
                width: 200
            }, {
                title: 'Brand',
                dataIndex: 'brandName',
                width: 200
            }, {
                title: 'Task Type',
                dataIndex: 'type',
                width: 200,
                render: (text, record) => {
                    if (record.type === '线上任务') {
                        return (<div>Online</div>)
                    } else if (record.type === '线下任务') {
                        return (<div>Offline</div>)
                    }
                }
            }, {
                title: 'Creation Time',
                dataIndex: 'gmtCreate',
                width: 200
            }, {
                title: 'Task Status',
                dataIndex: 'status',
                width: 200,
                render: (text, record) => {
                    if (record.status === '已发布') {
                        return (<div>Released</div>)
                    } else if (record.status === '任务结束') {
                        return (<div>End</div>)
                    }
                }
            }];
        }

        return (
            <div>
                <div className="search">
                    <div>
                        <Form>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "所属品牌" : "Brand"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.getbrandName}
                                       value={this.state.brandName}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "任务类型" : "Task Type"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    value={this.state.type || '0'}
                                    optionFilterProp="children"
                                    onChange={this.getType}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    <Option value="1">{localStorage.lan === "chinese" ? "线上任务" : "Online"}</Option>
                                    <Option value="2">{localStorage.lan === "chinese" ? "线下任务" : "Offline"}</Option>
                                </Select>
                            </div>
                            <div className="userlist">
                                <label htmlFor=""
                                       className="user_names">{localStorage.lan === "chinese" ? "任务状态" : "Task Status"}
                                    ：</label>
                                <Select
                                    showSearch
                                    style={{width: 130}}
                                    value={this.state.status || '0'}
                                    optionFilterProp="children"
                                    onChange={this.getStatus}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="0">{localStorage.lan === "chinese" ? "全部" : "All"}</Option>
                                    <Option value="1">{localStorage.lan === "chinese" ? "已发布" : "Released"}</Option>
                                    <Option value="2">{localStorage.lan === "chinese" ? "结束任务" : "End"}</Option>

                                </Select>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" className="user_names" style={{width: '104px'}}
                                       onChange={this.getTime}>{localStorage.lan === "chinese" ? "申请时间" : "Creation Time"}
                                    ：</label>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    placeholder="Start"
                                    style={{width: '130px'}}
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    placeholder="End"
                                    onChange={this.onEndChange}
                                    style={{width: '130px', marginLeft: 10}}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                            <Button type="primary" className="buttons"
                                    onClick={this.searchCon}>{localStorage.lan === "chinese" ? "搜索" : "Search"}</Button>
                            <Button type="primary" className="buttons"
                                    onClick={this.resetting}>{localStorage.lan === "chinese" ? "重置" : "Resetting"}</Button>
                        </Form>
                    </div>
                </div>
                <div className="tables_list">
                    <div className="tables_choice">
                        <Button type="primary" className="qiyong qqq"
                                onClick={this.brand_active}>{localStorage.lan === "chinese" ? "发布任务" : "Release Task"}</Button>
                        <Button type="primary" className="qiyong jinyong qqq"
                                onClick={this.forbiden}>{localStorage.lan === "chinese" ? "结束任务" : "End Task"}</Button>
                    </div>
                    <div>
                        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} bordered
                               pagination={false} loading={this.state.loading}/>
                    </div>
                    <div className='pagina'>
                        <Pagination current={this.state.current} onChange={this.onChangePage} total={this.state.records}
                                    pageSize={15}/>
                    </div>
                </div>
                <div className='flex_task brand_active felx_text_height'>
                    <Header className="flex_task_header">
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item
                                onClick={this.cancle}>{localStorage.lan === "chinese" ? "任务管理" : "Tip-off Task Management"}</Breadcrumb.Item>
                            <Breadcrumb.Item>{localStorage.lan === "chinese" ? "新增举报任务" : "Create Tip-off Task"}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Header>
                    <div className="flex_task_content">
                        <div className='flex_task_center' style={{width: '814px'}}>
                            <div className='flex_task_center_list'>
                                <label htmlFor=""
                                       className="user_names flex_task_type user-n">{localStorage.lan === "chinese" ? "任务类型" : "Task Type"}
                                    ：</label>
                                <Select defaultValue="" style={{width: 590, height: 18, lineHeight: 18}}
                                        onChange={this.addtype}>
                                    <Option value="1">{localStorage.lan === "chinese" ? "线上任务" : "Online"}</Option>
                                    <Option value="2">{localStorage.lan === "chinese" ? "线下任务" : "Offline"}</Option>
                                </Select>
                            </div>
                            <div className='flex_task_center_list'>
                                <label htmlFor=""
                                       className="user_names flex_task_type user-n">{localStorage.lan === "chinese" ? "任务名称" : "Task Name"}
                                    ：</label>
                                <Input size="small" placeholder=""
                                       className='flex_brand_small flex_task_width xsxsxs width'
                                       onChange={this.addname}/>
                            </div>
                            <div className='flex_task_center_list'>
                                <label htmlFor=""
                                       className="user_names flex_task_type user-n">{localStorage.lan === "chinese" ? "所属品牌" : "Brand"}
                                    ：</label>
                                <Select defaultValue="" style={{width: 590, height: 18, lineHeight: 18}}
                                        onChange={this.selecthandleChange}>
                                    {
                                        this.state.bb.map(v => (
                                            <Option value={v.id} key={v.id}>{v.name}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className='flex_task_center_list'>
                                <label htmlFor=""
                                       className="user_names flex_task_type user-n">{localStorage.lan === "chinese" ? "任务时间" : "Task Time"}
                                    ：</label>
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    style={{width: '230px'}}
                                    placeholder="Start"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    placeholder="End"
                                    onChange={this.onEndChange}

                                    style={{width: '230px', marginLeft: '129px'}}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                            <div className='flex_task_center_list'>
                                <label htmlFor=""
                                       className="user_names flex_task_type user-n">{localStorage.lan === "chinese" ? "任务要求" : "Task Demands"}
                                    ：</label>
                                <div className="box box_texts" style={{width: '100%'}}>
                                    <div ref="editorElem" style={{textAlign: 'left'}} className='bigbox'
                                         onChange={this.require}>
                                    </div>
                                </div>
                            </div>
                            <div className='flex_task_center_list' style={{marginTop: '150px'}}>
                                <label htmlFor=""
                                       className="user_names flex_task_type user-n">{localStorage.lan === "chinese" ? "任务介绍" : "Task Demands"}
                                    ：</label>
                                <div className="box box_texts" style={{width: '100%'}}>
                                    <div ref="editorElems" style={{textAlign: 'left'}} className='bigbox'
                                         onChange={this.introduction}>
                                    </div>
                                </div>
                            </div>
                            <ul className="flex_task_center_list_top_buttons">
                                <Button type="" className="flex_task_center_list_top_buttons_lis flex_bao"
                                        style={{marginLeft: '250px'}}
                                        onClick={this.baocun}>{localStorage.lan === "chinese" ? "保存" : "Save"}</Button>
                                <Button type="" className="flex_task_center_list_top_buttons_lis gray"
                                        style={{marginLeft: '100px'}}
                                        onClick={this.cancle}>{localStorage.lan === "chinese" ? "取消" : "Public"}</Button>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
Task.contenxtTypes = {
    permission:PropTypes.permission
}
export default Task;