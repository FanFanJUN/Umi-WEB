/**
 * @Description:日期选择（自动加时间）
 * @Author: WANGXIAO
 * @Date: 2020/3/13
 */
import React, {Component} from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';

export default class RangeDatePicker extends Component {
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
      defaultStartDate: value.startDate || null,
      defaultEndDate: value.startDate || null,
      startDate: value.startDate || null,
      endDate: value.endDate || null,
    };
  }

  disabledDateStart = (current) => {
    let date = new Date();
    if (this.props.type === 'currentTime' || this.props.type === 'endTime' ) {
      //与当前时间有关
      return current >= moment().valueOf();
    }else {
      if (!this.state.endDate) return false;
      return current && current > this.state.endDate;
    }
  };
  disabledDateEnd = (current) => {
    let date = new Date();
    if (this.props.type === 'currentTime') {
      //与当前时间有关
      return current <= moment().add(-1, 'days').valueOf();
    }  else if (this.props.type === 'endTime') {
      let endDate = moment((parseInt(date.toString().substring(11, 15)) + 1) + '-06-01');
      //与当前时间有关
      return current >= endDate.add(+1, 'days').valueOf();
    }else {
      if (!this.state.startDate) return false;
      return current && current < this.state.startDate;
    }
  };
  triggerChange = (changeValue) => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changeValue));
    }
  };
  handleChangeEnd = (endDate) => {
    if (!('value' in this.props)) {
      this.setState({endDate});
    }
    this.triggerChange({endDate});
  };
  handleChangeStart = (startDate) => {
    if (!('value' in this.props)) {
      this.setState({startDate});
    }
    this.triggerChange({startDate});
  };
  onClick = (e) => {
    e.stopPropagation();
  };

  render() {
    const {startDate, endDate, defaultStartDate, defaultEndDate} = this.state;
    const {format, splitStr = '~'} = this.props;
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{flex: 1}} onClick={this.onClick}>
          <DatePicker
            placeholder={'开始日期'}
            style={{width: '100%'}}
            value={startDate}
            defaultValue={defaultStartDate}
            disabled={this.props.disabled}
            onChange={this.handleChangeStart}
            format={format}
            disabledDate={this.disabledDateStart}
          />
        </div>
        <div style={{width: 20, textAlign: 'center'}}>{splitStr}</div>
        <div style={{flex: 1}} onClick={this.onClick}>
          <DatePicker
            placeholder={'结束日期'}
            style={{width: '100%'}}
            value={endDate}
            defaultValue={defaultEndDate}
            format={format}
            disabled={this.props.disabled}
            onChange={this.handleChangeEnd}
            disabledDate={this.disabledDateEnd}
          />
        </div>
      </div>
    );
  }
}
