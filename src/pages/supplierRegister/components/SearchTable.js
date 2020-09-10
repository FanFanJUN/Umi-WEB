/**
 * @description 弹出选择表单
 * @author 刘松林
 * @date 2018.12.19
 */
import React, {Component} from 'react';
import Dropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
import {Input, Icon, Button, Col, Row} from 'antd';
import {isEmpty} from "@/utils/index";
import './SearchTable.css'
import SimpleTable from "./SimpleTable";
import PropTypes from 'prop-types';


class SearchTable extends Component {
    params = null
    value = ''

    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {},
            searchValue: '',
            textValue: '',
            value: '',
            loading: false,
            dataLoad: false,
            selectedRows: [],
            show: false,
          style: {borderColor:"#40a9ff"},
          dataSource: [],
            filterData: []
        };
        this.params = props.params
    }

    //传入参数，级联操作
    componentWillReceiveProps(nextProps) {

        if (nextProps.value && typeof nextProps.value === 'string' && nextProps.value.indexOf(',') === -1) {
            if (this.state.value !== nextProps.value) {
               // console.log("nextProps2",nextProps,this.state.value)
                this.initValue(nextProps.value)
            }
        } else if (this.state.textValue && !nextProps.value) {
           // console.log("nextProps3",nextProps,this.state.value)
            if (this.state.searchValue || this.state.searchValue.length > 0) {
               // this.getDataSource();
                this.setState({textValue: '', value: '', searchValue: ''})
            } else {
                this.setState({textValue: '', value: ''})
            }
            if (this.props.multiple) {
                this.handleClean()
            }
        }
        if(nextProps.dataSource && nextProps.dataSource.length !== this.state.dataSource.length){
            const {key, text} = this.props.config;
            let res = nextProps.dataSource;
            let  textVal = res[0][text];
            this.setState({dataSource: res, filterData: res,
                    // textValue: textVal, value: res[0][key]  //加上之后就会有初始值
            })
        }
        if (nextProps.params &&
            this.props.params &&
            Object.values(nextProps.params).toString() !== Object.values(this.props.params).toString()) {
            this.params = nextProps.params
            if (this.props.initValue) {
                this.getInitData()
            } else {
              /*  console.log(".........................................",nextProps)*/
                this.getDataSource();
                //this.initValue(nextProps.value)
            }
            if(Object.values(this.props.params)[0]){
                this.setState({searchValue: '', pageInfo: {}},()=>{

                    if (this.props.value === nextProps.value && !isEmpty(nextProps.value)) {
                        if(this.props.onChange){
                            this.props.onChange('');
                        }
                    }
                })
            }
            return;
        }
    }

    componentDidUpdate(){
        if (this.state.show&&this.innerInput) {
            this.innerInput.input.focus()
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (e) => {
        if (this.mainContent && !this.mainContent.contains(e.target)) {
            if (this.state.show) {
                this.setState({show: false})
            }
        }
    }

    componentWillMount() {
        if (!this.props.value) {
            this.setState({textValue: '', value: ''})
        }
        const {initValue} = this.props;
        if (initValue && !this.props.value) {

            this.getInitData()
        } else {
            if(!this.props.config.requset){

                this.getDataSource()
            }


        }
    }

    initValue=(value)=>{
        if(value){
            const {text,key,searchKey,secondSearchKey,SingleService}=this.props.config;
            if (this.props.config.searchService) {
                let searchParam = {keyword: value}
                this.props.config.searchService(this.state.dataSource, searchParam, [key]).then(data => {
                    if (data && data.length > 0) {
                        let textVal='';
                        if(text.includes(',')){
                            textVal = data[0][text.split(',')[0]]+' '+data[0][text.split(',')[1]]
                            this.setState({value: value, textValue: textVal})
                        }else if(this.props.multiple){
                            let textVal = [];
                            let keyValue = [];
                            for (let i = 0; i < data.length; i++) {
                                textVal.push(data[i][text]);
                                keyValue.push(data[i][key])
                            }
                            this.setState({textValue: textVal.toString(), value: keyValue.toString(), selectedRows:data}, () => {
                                if (this.props.onChange) {
                                    this.props.onChange(keyValue, data);
                                }
                            })
                        }

                        else{
                            textVal=data[0][text]
                            this.setState({value: value, textValue: textVal})
                        }
                        return
                    }
                })
            }
           else {
                let searchParam = {};
                let textVal=''
                if(searchKey){
                    searchParam[searchKey] = value;
                }
                else{
                    searchParam['Q_EQ_' + key] = value;
                }
                //用于查询时第二个参数为空但必须传的情况
                if(secondSearchKey){
                    searchParam[secondSearchKey] = '';
                }
                if(SingleService){
                    this.props.config.SingleService({...searchParam}).then(res => {
                        let list
                        if (res.rows) {
                            list = res.rows
                        } else {
                            list = res.data?[res.data]:[];
                        }
                        let result = this.bulidByCloumns(list)

                        if(result && result.length>0){
                            let index = result.findIndex(item => item[key] === value);

                            if(index!==-1){

                                if(text.includes(',')){
                                    textVal = result[index][text.split(',')[0]]+' '+result[index][text.split(',')[1]]
                                }

                                else{
                                    textVal=result[index][text]
                                }
                            }
                            else{
                                textVal=""
                            }
                            this.setState({value:value,textValue: textVal})
                        }
                    })
                }
                else{
                    this.props.config.dataService({...searchParam}).then(res => {
                        let list
                        if (res.rows) {
                            list = res.rows
                        } else {
                            list = res;
                        }
                        let result = this.bulidByCloumns(list)
                        if(result && result.length>0){
                            let index = result.findIndex(item => item[key] === value);
                            if(index!==-1){
                                if(text.includes(',')){
                                    textVal = result[index][text.split(',')[0]]+' '+result[index][text.split(',')[1]]
                                }

                                else{
                                    textVal=result[index][text]
                                }
                            }
                            else{
                                textVal=""
                            }
                            this.setState({value:value,textValue: textVal})
                        }
                    })
                }
               /* this.props.config.dataService({...searchParam}).then(res => {
                    let list
                    if (res.rows) {
                        list = res.rows
                    } else {
                        list = res;
                    }
                    let result = this.bulidByCloumns(list)
                    if(result && result.length>0){
                        let index = result.findIndex(item => item[key] === value);
                        if(index!==-1){
                            if(text.includes(',')){
                                textVal = result[index][text.split(',')[0]]+' '+result[index][text.split(',')[1]]
                            }

                            else{
                                textVal=result[index][text]
                            }
                        }
                        else{
                            textVal=""
                        }
                        this.setState({value:value,textValue: textVal})
                    }
                })*/

            }
        }
    }

    getInitData(value) {
        const {key, text} = this.props.config;
        if(this.props.dataSource){
            if(this.props.dataSource.length===0){
                this.setState({dataSource: [], filterData: [], textValue: '', value: ''},
                    //状态更新完毕之后执行
                    () => {
                        if (this.props.onChange) {
                            this.props.onChange('', '');
                        }
                        if (this.props.selectChange) {
                            this.props.selectChange('');
                        }
                    })
            }else{
                let res=this.props.dataSource;
                let  textVal = res[0][text];
                this.setState({dataSource: res, filterData: res, textValue: textVal, value: res[0][key]},
                    //状态更新完毕之后执行
                    () => {
                        if (this.props.onChange) {
                            this.props.onChange(res[0][key], res[0]);
                        }
                        if (this.props.selectChange) {
                            this.props.selectChange(res[0]);
                        }
                    })
            }

        }else {
            this.props.config.dataService({...value, ...this.params, Q_EQ_frozen__bool: 0}).then((res) => {
                let list;
                if (res && res.rows) {
                    list = res.rows;
                } else {
                    list = res;
                }
                let result = this.bulidByCloumns(list)
                if (result && result.length > 0) {
                    let textVal = ''
                    if (text.includes('.')) {
                        textVal = result[0][text.split('.')[0]][text.split('.')[1]]
                    }
                    else if (text.includes(',')) {
                        textVal = result[0][text.split(',')[0]] + " " + result[0][text.split(',')[1]]
                    }
                    else {
                        textVal = result[0][text];
                    }
                    this.setState({dataSource: res, filterData: res, textValue: textVal, value: list[0][key]},
                        //状态更新完毕之后执行
                        () => {
                            if (this.props.onChange) {
                                this.props.onChange(list[0][key], list[0]);
                            }
                            if (this.props.selectChange) {
                                this.props.selectChange(list[0]);
                            }
                        })
                }
            });
        }
    };

    getDataSource(value, pageInfo) {
        this.setState({loading: true});
        if(this.props.dataSource){
          this.setState({dataLoad:true})
            let res=this.props.dataSource;
            this.setState({dataSource: res, filterData: res})
            this.setState({loading: false});
            if (this.props.value && this.props.selectChange) {
                let list = res;
                let index = list.findIndex(item => item.id === this.props.value);
                if (index !== -1) {
                    this.props.selectChange(list[index]);
                }
            }
            this.initValue(this.props.value)
        }
        else {
            this.props.config.dataService({
                ...value, ...pageInfo, ...this.params,
                Q_EQ_frozen__bool: 0
            }).then((res = []) => {
              this.setState({dataLoad:true})
              if (res.data === null) {
                    res = [];
                }
                else if (res.data && res.data.rows) {
                    if(res.data.rows.some(item => Object.keys(item).includes('frozen'))){
                        res = res.data.rows.filter(item => Object.keys(item).includes('frozen') ? item.frozen !== true : true)
                    }else {
                        res=res.data
                    }
                }
                else if (res && res.data && res.status === 'SUCCESS') {
                    res = res.data.filter(item => Object.keys(item).includes('frozen') ? item.frozen !== true : true)
                } else if (res && !res.rows) {
                    res = res.filter(item => Object.keys(item).includes('frozen') ? item.frozen !== true : true)
                }
                this.setState({dataSource: res, filterData: res})
                this.setState({loading: false});
                if (this.props.value && this.props.selectChange) {
                    let list;
                    if (res && res.rows) {
                        list = res.rows;
                    }
                    else if (res && res.status === 'SUCCESS') {
                        list = res.data;
                    } else {
                        list = res;
                    }
                    let index = list.findIndex(item => item.id === this.props.value);
                    if (index !== -1) {
                        this.props.selectChange(list[index]);
                    }
                }
                this.initValue(this.props.value)
            }).catch(err => {
                this.setState({loading: false});
            })
        }
    };

    pageChange = (pagination) => {
        this.setState({pageInfo: pagination});
        if (!this.props.config.searchService) {
            this.getDataSource(
                {Quick_value: this.state.searchValue,quickSearchValue:this.state.searchValue},
                this.props.config.isPageInfo?{'pageInfo.page': pagination.page, 'pageInfo.rows': pagination.rows,}:pagination,
        );
        }
    };

    handleSearch = (values) => {
        if (this.props.config.searchService) {
            let searchParam = {keyword: values}
            this.props.config.searchService(this.state.dataSource, searchParam).then(data => {
                this.setState({filterData: data.rows ? data.rows : data})
            })
        } else {
            let searchParam = {}
           if(this.props.config.Quick_value){
               searchParam = {[this.props.config.Quick_value]: values}
           }
           else{
               searchParam = {Quick_value: values}
           }

            this.getDataSource(searchParam)
        }
        this.setState({searchValue: values})
    }

    refreshData = (value) => {
        this.getDataSource(value);
    }

    rowOnChange = (selectedRows) => {
        const {key, text} = this.props.config;
        if (!this.props.multiple) {
            if (selectedRows.length > 0) {
                let textVal = ''
                if(text.includes('.')){
                    textVal = selectedRows[0][text.split('.')[0]][text.split('.')[1]]
                }
                else  if(text.includes(',')){
                    textVal = selectedRows[0][text.split(',')[0]]+" "+selectedRows[0][text.split(',')[1]]
                }
                else {
                    textVal = selectedRows[0][text];
                }
                this.setState({
                    show: false,
                    textValue: textVal,
                    value: selectedRows[0][key],
                    selectedRows: []
                },()=>{
                    if(this.props.onChange){
                        this.props.onChange(selectedRows[0][key], selectedRows[0]);
                    }
                })
            }
        } else {
            let textValue = [];
            let keyValue = [];
            for (let i = 0; i < selectedRows.length; i++) {
                textValue.push(selectedRows[i][text]);
                keyValue.push(selectedRows[i][key])
            }
            this.setState({textValue: textValue.toString(), value: keyValue, selectedRows}, () => {
                if (this.props.onChange) {
                    this.props.onChange(keyValue, selectedRows);
                }
            })
        }
        if (this.props.selectChange) {
            if (!this.props.multiple){
                this.props.selectChange(selectedRows[0]);
            }else {
                this.props.selectChange(selectedRows);
            }

        }
    }

    emptyValue = () => {
        this.setState({textValue: '', value: '', selectedRows: []},()=>{
            if(this.props.onChange){
                this.props.onChange('')
            }
            if (this.props.selectChange){
                this.props.selectChange([])
            }
        })
    }

    bulidByCloumns = (list) => {
        const {columns} = this.props.config;
        for (let i = 0; i < list.length; i++) {
            let data = list[i];
            columns.map(item => {
                if (item['render']) {
                    item.render(data[item['dataIndex']], data)
                }
            })
        }
        return list;
    }

    handleSure = () => {
        this.setState({show: false})
    }
    handleClean = () => {
        this.setState({textValue: '', value: '', selectedRows: []}, () => {
            if (this.props.onChange) {
                this.props.onChange([])
            }
            if (this.props.selectChange) {
                this.props.selectChange([])
            }
        })
    }

    searchChange = (e) => {
        this.setState({searchValue: e.target.value})
    }

    dropDown = () =>{
        const {columns} = this.props.config
        const {filterData} = this.state;
        const style= {border:"1px solid #40a9ff",boxShadow:"0 0 0 2px rgba(24,144,255,.2)"}
        return <div id={'SearchTableChild'} ref={(ref) => this.mainContent = ref} style={style}>
          <Row style={{background: '#F3F8FC', padding: 1}}>
            <Col span={this.props.multiple ? 16 : 24}>{this.search()}</Col>
            {this.props.multiple ? <Col>
              <div style={{float: 'right'}}>
                <Button key="clean" onClick={this.handleClean}>清空</Button>
                <Button key="sure" style={{marginLeft: '5px'}} onClick={this.handleSure}>确认</Button>
              </div></Col> : null}
          </Row>
                    <SimpleTable
                        radio={this.props.radio}
                        checkBox={this.props.multiple}
                        rowsSelected={this.state.selectedRows}
                        loading={this.state.loading}
                        onSelectRow={this.rowOnChange}
                        data={filterData}
                        columns={columns}
                        heightY={180}
                        pageChange={this.props.config.searchService?null:this.pageChange}
                        rowKey={this.props.rowKey}
                    />
                </div>
    }

    showDrop = (e) => {
        this.setState({show:true})
        setTimeout(() => {
          this.setState({show:true})
        }, 0);
    }

    search = () => {
        return (<Input.Search
            key="TableSearchI"
            placeholder="请输入查询关键字"
            value={this.state.searchValue}
            onChange={this.searchChange}
            onSearch={value => this.handleSearch(value)}
            ref={(ref) => this.innerInput = ref}
            style={{marginRight: '5px'}}
            enterButton
        />)
    }

    render() {
      let {style}=this.props;
      if (this.state.show){
        style={...style,border:"1px solid #40a9ff",boxShadow:"0 0 0 2px rgba(24,144,255,.2)"};
      }
        const suffix = !this.props.disabled && ([
            this.props.value && <Icon key="emptyClick" type="close" onClick={this.emptyValue}/>,
            <Icon key="selectClict" type="down" onClick={this.showDrop}/>,
        ])
        return (
            <Dropdown
                overlay={this.dropDown()}
                animation="slide-up"
                visible={this.state.show}
            >
                {this.props.multiple?  <Input.TextArea autosize={{ minRows: 1, maxRows: 6 }}
                                                       placeholder={this.props.placeholder} disabled={this.props.disabled} onFocus={this.showDrop}
                                                       readOnly style={style}
                                                       value={this.state.dataLoad?this.state.textValue:'...正在加载'} ref={(ref) => this.searchInput = ref} suffix={suffix}/>:
                    <Input placeholder={this.props.placeholder} disabled={this.props.disabled} onFocus={this.showDrop}
                           readOnly style={style}
                           value={this.state.dataLoad?this.state.textValue:'...正在加载'} ref={(ref) => this.searchInput = ref} suffix={suffix}/>
                }
            </Dropdown>
        );
    }
}

SearchTable.propTypes={
    //默认
    placeholder:PropTypes.string,
    //选择回调方法,formItem使用，一般不用自己实现
    onChange:PropTypes.func,
    //选择回调方法，自主回调选择变化
    selectChange:PropTypes.func,
    //过滤条件动态请求参数
    params:PropTypes.object,
    //
    value:PropTypes.string,
    //
    config:PropTypes.object,

}


export default SearchTable;
