/**
 * @Description:省-市-详细地址
 * @Author: CHEHSHUANG
 * @Date: 2018/12/6
 */
import React, {Component} from 'react';
import {Input} from "antd";
import SelectWithService from "./SelectWithService";

class CascadeAddressSelect extends Component {
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
    this.state = {
      province: value.province,
      city: value.city,
      area: value.area,
      street: value.street,
      id:'',
      disabled:value.disabled
    };
  }

  handleStreetChange = (e) => {
    const street = e.target.value;
    if (!('value' in this.props)) {
      this.setState({street});
    }
    this.triggerChange({street});
  }

  handleProvinceChange = (province) => {
    if (!('value' in this.props)) {
      this.setState({province});
    }
    this.triggerChange({province});
  }

  handleCityChange = (city) => {
    if (!('value' in this.props)) {
      this.setState({city});
    }

    this.triggerChange({city});
  }

  handleAreaChange = (area) => {
    if (!('value' in this.props)) {
      this.setState({area});
    }
    this.triggerChange({area});
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }


  render() {
    const {size, placeholder, provinceConfig, cityConfig, areaConfig,isView,disabled} = this.props;
    const {province, city, area,street} = this.state;
    const provinceId = province ? province.key : null;
    const Id = city ? city.key : null;
    return (
      <span>
          <SelectWithService
            labelInValue={true}
            config={provinceConfig}
            value={province}
            size={size}
            placeholder={"请选择省"}
            style={{width: '14%', marginRight: "1%"}}
            onChange={this.handleProvinceChange}
            disabled={disabled === '2'}

          />
          <SelectWithService
            labelInValue={true}
            config={cityConfig}
            params={{provinceId}}
            value={city}
            size={size}
            placeholder={"请选择城市"}
            style={{width: '14%', marginRight: "1%"}}
            onChange={this.handleCityChange}
            disabled={disabled === '2'}
          />
           <SelectWithService
              labelInValue={true}
              config={areaConfig}
              params={{provinceId:Id}}
              value={area}
              size={size}
              placeholder={"请选择区县"}
              style={{width: '15%', marginRight: "1%"}}
              onChange={this.handleAreaChange}
              disabled={disabled === '2'}
            />
            {/* {
              isView === true &&
              <SelectWithService
                labelInValue={true}
                config={areaConfig}
                params={{provinceId:Id}}
                value={area}
                size={size}
                placeholder={"请选择区县"}
                style={{width: '15%', marginRight: "1%"}}
                onChange={this.handleAreaChange}
              />
            } */}
          <Input
            maxLength={35}
            size={'60'}
            value={street}
            onChange={this.handleStreetChange}
            style={{width: '54%'}}
            placeholder={placeholder || "详细地址"}
            disabled={disabled === '2'}
          />
      </span>
    );
  }
}

export default CascadeAddressSelect;
