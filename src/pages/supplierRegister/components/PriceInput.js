/**
 * @Description:
 * @Author: CHEHSHUANG
 * @Date: 2018/12/6
 */
import React, {Component} from 'react';
import { InputNumber,Input} from 'antd';
import SelectWithService from "./SelectWithService";
import { values } from 'lodash';
class PriceInput extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.isInit = true;  //用isInit处理进入页面就校验的情况。因为SelectWithService 调用onChange赋默认值，会触发校验
    this.state = {
      number: value.number ,
      currency: value.currency,
      disabled: value.disabled
    };
  }

  handleNumberChange = (number) => {
    if (!('value' in this.props)) {
      this.setState({ number });
    }
    this.triggerChange({ number });
  }

  handleCurrencyChange = (currency,isInit) => {
    if(!isInit){ //SelectWithService 调用onChange赋默认值的第二个参数不为空，其他onChange情况都是空的
      this.isInit = false;
    }
    if (!('value' in this.props)) {
      this.setState({ currency });
    }
    if(this.state.number){
      this.triggerChange({ currency});
    }else{
      if(this.isInit){ // 赋默认值优化
        this.triggerChange({ currency,number:undefined});
      }else{
        this.triggerChange({ currency,number:""});
      }
    }

  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const {size,placeholder,currencyConfig,initValue,max,unit,disabled} = this.props;
    const {number,currency} = this.state;
    return (
      <span>
                <InputNumber
                  size={size}
                  value={number}
                  onChange={this.handleNumberChange}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  style={{width: unit?'42%':"55%",marginRight:unit?"0%":"1"}}
                  placeholder={placeholder}
                  precision={2}
                  min={0}
                  max={max?max:9999999999999999999}
                  disabled={disabled === '2'}
                />
        {/*万元单位*/}
        {unit==="10000"&&<Input  style={{width: '16%',marginLeft: "-1%",marginRight: "1%",textAlign:"left"}} value="万"/>}
        <SelectWithService
          initValue={initValue}
          config={currencyConfig}
          value={currency}
          size={size}
          placeholder={"请选择币种"}
          style={{width: '42%'}}
          onChange={this.handleCurrencyChange}
          disabled={disabled === '2'}
        />
            </span>
    );
  }
}

export default PriceInput;
