import React, {Component} from 'react';
import '../../assets/css/admin.css';
import 'antd/dist/antd.min.css';
import $ from 'jquery';
import {
    Link
} from 'react-router-dom';
import {Form, Input, Button, Table, Pagination, Select, message} from 'antd';
import API from '../../api/index'
import PropTypes from 'prop-types'

const Option = Select.Option;
var columns;

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
    }),
};

//品牌管理按钮
class Brandmanagement extends Component {
    constructor() {
        super();
        this.state = {
            pageNo: '1',
            name: '',
            userName: '',
            data: [],
            current: 1,
            addName: '',
            userId: '',
            aa: [],
            lastdayExamine: '',
            lastdayMonitor: '',
            allExamine: '',
            allMonitor: '',
            loading: true
        }
        this.brand_active = this.brand_active.bind(this);
    }

    brand_active() {
        $(".flex_brand").removeClass("brand_active");
    }

    cancleAddBrand = () => {
        $(".flex_brand").addClass("brand_active");
    }

    //品牌管理列表
    brand = (page) => {
        this.setState({loading:true})
        let userId = localStorage.getItem("userId")
        let brandData = {
            pageNo: page,
            pageSize: 15,
            userName: this.state.userName,
            name: this.state.name,
            userId: userId
        }
        API.brand(brandData).then(res => {
            if(res.success === true) {
                if (res.result && res.result.length > 0) {
                    this.setState({data: res.result, records: res.records, loading: false})
                }
            }
        })
    }
    //渲染数据
    componentDidMount() {
        this.brand(this.state.pageNo);
        let userId = localStorage.getItem("userId")
        let brandOwnerData = {
            userId: userId
        }
        API.brand_owner(brandOwnerData).then(res => {
            if (res.success === true) {
                this.setState({aa: res.result})
            }
        })
    }

    componentDidUpdate(){
        //权限菜单
        let permission = this.context.permission;
        if(permission) {
            permission.forEach(v => {
                if (v.permValue === 'brand') {
                    v.children.forEach(item => {
                        if (item.permValue === '/admin/brand_list') {
                            $('.qiyong').attr({disabled: "disabled"})
                            if (item.children) {
                                item.children.forEach(list => {
                                    if (list.permValue === '/brand/list/3') {
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

    //分页
    onChangePage = (page) => {
        this.setState({
            current: page,
            pageNo: page,
        });
        this.brand(page);
    }

    //搜索
    searchBrand = () => {
        this.brand(this.state.pageNo);
    }
    getBrandName = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    getBrand = (e) => {
        this.setState({
            userName: e.target.value
        })
    }

    //新增
    saveAdd = () => {
        let brandAddData = {
            name: this.state.addName,
            userId: this.state.userId
        }
        API.brand_add(brandAddData).then(res => {
            if (res.success == true) {
                message.success("新增成功");
                $(".flex_brand").addClass("brand_active");
                this.searchBrand();
            } else {
                message.error(res.msg)
            }
        })
    }
    addBrand = (e) => {
        this.setState({
            addName: e.target.value
        })
    }
    handleChange = (value) => {
        this.setState({
            userId: `${value}`
        })
    }
    //重置
    resetting = () => {
        this.setState({
            userName: '',
            name: ''
        })
    }

    render() {
        //品牌管理
        if (localStorage.lan === "chinese") {
            columns = [
                {
                    title: '品牌名称',
                    dataIndex: 'name',
                    width: 200
                },
                {
                    title: '所属品牌商',
                    dataIndex: 'userName',
                    width: 200
                },
                {
                    title: '今日规则监控总量',
                    dataIndex: 'lastdayMonitor',
                    width: 200
                },
                {
                    title: '今日规则匹配总量',
                    dataIndex: 'lastdayExamine',
                    width: 200
                },
                {
                    title: '历史规则监控量',
                    dataIndex: 'allMonitor',
                    width: 200
                },
                {
                    title: '历史规则匹配量',
                    dataIndex: 'allExamine',
                    width: 200

                }];
        } else {
            columns = [
                {
                    title: 'Brand Name',
                    dataIndex: 'name',
                    width: 200
                },
                {
                    title: 'Brand Owner',
                    dataIndex: 'userName',
                    width: 200
                },
                {
                    title: 'Daily Total Monitoring Quantity',
                    dataIndex: 'lastdayMonitor',
                    width: 200
                },
                {
                    title: 'Daily Total Matching Quantity',
                    dataIndex: 'lastdayExamine',
                    width: 200
                },
                {
                    title: 'Historical Total Monitoring Quantity',
                    dataIndex: 'allMonitor',
                    width: 200
                },
                {
                    title: 'Historical Total Matching Quantity',
                    dataIndex: 'allExamine',
                    width: 200

                }];
        }
        return (
            <div>
                <div className="search">
                    <div>
                        <Form>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '93px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "品牌名称" : "Brand Name"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.getBrandName}
                                       value={this.state.name}/>
                            </div>
                            <div className="userlist">
                                <label htmlFor="" style={{width: '93px'}}
                                       className="user_names">{localStorage.lan === "chinese" ? "所属品牌商" : "Brand Owner"}
                                    ：</label>
                                <input type="text" className="inputstyle" onChange={this.getBrand}
                                       value={this.state.userName}/>
                            </div>
                            <Button type="primary" className="buttons"
                                    onClick={this.searchBrand}>{localStorage.lan === "chinese" ? "搜索" : "Search"}</Button>
                            <Button type="primary" className="buttons"
                                    onClick={this.resetting}>{localStorage.lan === "chinese" ? "重置" : "Resetting"}</Button>
                        </Form>
                    </div>
                </div>
                <div className="tables_list">
                    <div className="tables_choice">
                        <Button type="primary" className="qiyong"
                                onClick={this.brand_active}>{localStorage.lan === "chinese" ? "新增" : "Add"}</Button>
                        <div className='flex_brand brand_active'>
                            <Form className="flex_brand_form">
                                <div className="flex_brand_userlist">
                                    <div className='flex_brand_input'>
                                        <label htmlFor=""
                                               className="user_names  flex_brand_username">{localStorage.lan === "chinese" ? "品牌名称" : "Brand Name"}
                                            ：</label>
                                        <Input size="small" placeholder="" className='flex_brand_small sn btand'
                                               onChange={this.addBrand}/>
                                    </div>
                                    <div className='flex_brand_input'>
                                        <label htmlFor=""
                                               className="user_names flex_brand_username">{localStorage.lan === "chinese" ? "所属品牌商" : "Brand Owner"}
                                            ：</label>
                                        <Select
                                            showSearch
                                            style={{width: 166, height: 22}}
                                            placeholder={localStorage.lan === "chinese" ? "所属品牌商" : "Brand Owner"}
                                            onChange={this.handleChange}
                                            className="flex_brand_select"
                                        >
                                            {
                                                this.state.aa.map(v => (
                                                    <Option value={v.userId} key={v.userId}>{v.userName}</Option>
                                                ))
                                            }
                                        </Select>
                                        <div className="flex_brand_buttons">
                                            <Button type="primary" className="flex_brand_Primary"
                                                    onClick={this.saveAdd}>{localStorage.lan === "chinese" ? "保存" : "Save"}</Button>
                                            <Button type="primary" className='flex_brand_out'
                                                    onClick={this.cancleAddBrand}>{localStorage.lan === "chinese" ? "取消" : "Cancel"}</Button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div>
                        <Table rowSelection={rowSelection} columns={columns}
                               dataSource={this.state.data} bordered pagination={false}
                               loading={this.state.loading}
                        />
                        <div className='pagina'>
                            <Pagination current={this.state.current} onChange={this.onChangePage} total={this.state.records}
                                        pageSize={15}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
Brandmanagement.contextTypes = {
    permission:PropTypes.array
}

export default Brandmanagement;