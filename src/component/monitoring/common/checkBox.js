import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

class PublicCheck extends Component {
    constructor(){
        super()
        this.state = {
            indeterminate: true,
            checkAll: false,
            plainOptions:[],
            checkedList:[]
        };        
    }

    componentWillMount() {
        let { plainOptions , checkedList} = this.props
        if(this.props){
            this.setState({
                checkedList:checkedList,
                checkAll: checkedList.length === plainOptions.length,
                indeterminate: !!checkedList.length && (checkedList.length < this.props.plainOptions.length),
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps){
            this.setState({
                checkedList:nextProps.checkedList,
                checkAll: nextProps.checkedList.length === nextProps.plainOptions.length,
                indeterminate: !!nextProps.checkedList.length && (nextProps.checkedList.length < nextProps.plainOptions.length),
            })
        }   
    }

    //所属类目-单选checkbox回掉
	onChangeCheckedList(checkedList)  {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.props.plainOptions.length),
            checkAll: checkedList.length === this.props.plainOptions.length,
        },()=>{
            this.props.callBack(this.state.checkedList);
        });    
    }
	
	//所属类目-全选回掉
    onCheckAllChange(e) {
		//后台传值value属性
		let allPlainOptions=[];
		this.props.plainOptions.map((v,i) => 
			allPlainOptions.push(v.dictVal)
		)
        this.setState({
            checkedList: e.target.checked ? allPlainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        },()=>{
            this.props.callBack(this.state.checkedList);
        });    
	  }

    render(){
        let { plainOptions ,intl,checkedList} = this.props
        return(
            <div>
                <div>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={(e)=>this.onCheckAllChange(e)}
                        checked={this.state.checkAll}
                    >
                        <FormattedMessage id="global.total.selection" defaultMessage="全选" description="全选" />
                    </Checkbox>
                    <CheckboxGroup
                        className="search-check"
                        value={checkedList}
                        onChange={(checkedList) => this.onChangeCheckedList(checkedList)}
                    >
                        {
                            plainOptions && plainOptions.map(item => (
                                <Checkbox
                                    value={item.dictVal}
                                    key={item.dictVal}
                                    onChange={e => this.onChangeCheckedList(e)}
                                >
                                    {
                                        intl.locale==='zh'?item.dictLabel:item.dictLabelEn
                                    }
                                </Checkbox>
                            ))
                        }
                    </CheckboxGroup>
                </div>
            </div>
        )
    }
}
export default injectIntl(PublicCheck)