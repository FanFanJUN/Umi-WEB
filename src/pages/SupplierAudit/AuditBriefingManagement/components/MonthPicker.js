/**
 * @Description: 月份选择
 * @Author: M!keW
 * @Date: 2020-12-08
 */
import React, { Component } from 'react';
import { DatePicker } from 'antd';
const { MonthPicker} = DatePicker;
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
    if (!this.state.endDate) return false;
    return current && current > this.state.endDate;
  };
  disabledDateEnd = (current) => {
    let date = new Date();
    if (!this.state.startDate) return false;
    return current && current < this.state.startDate;
  };
  triggerChange = (changeValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changeValue));
    }
  };
  handleChangeEnd = (endDate) => {
    if (!('value' in this.props)) {
      this.setState({ endDate });
    }
    this.triggerChange({ endDate });
  };
  handleChangeStart = (startDate) => {
    if (!('value' in this.props)) {
      this.setState({ startDate });
    }
    this.triggerChange({ startDate });
  };
  onClick = (e) => {
    e.stopPropagation();
  };

  render() {
    const { startDate, endDate, defaultStartDate, defaultEndDate } = this.state;
    const { format, splitStr = '~' } = this.props;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }} onClick={this.onClick}>
          <MonthPicker
            placeholder={'开始月份'}
            style={{ width: '100%' }}
            value={startDate}
            defaultValue={defaultStartDate}
            disabled={this.props.disabled}
            onChange={this.handleChangeStart}
            format={format}
            disabledDate={this.disabledDateStart}
          />
        </div>
        <div style={{ width: 20, textAlign: 'center' }}>{splitStr}</div>
        <div style={{ flex: 1 }} onClick={this.onClick}>
          <MonthPicker
            placeholder={'结束月份'}
            style={{ width: '100%' }}
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
