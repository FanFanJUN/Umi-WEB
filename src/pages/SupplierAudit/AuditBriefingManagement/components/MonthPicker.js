/**
 * @Description: 月份选择
 * @Author: M!keW
 * @Date: 2020-11-23
 */

import React from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default class MonthPicker extends React.Component {

  state = {
    mode: ['month', 'month'],
    value: [],
  };

  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    }, () => {
      this.props.onChange && this.props.onChange(value);
    });
  };

  handleChange = value => {
    this.setState({ value }, () => {
      this.props.onChange && this.props.onChange(value);
    });
  };
  render() {
    const { value, mode } = this.state;
    return (
      <RangePicker
        placeholder={['开始月份', '结束月份']}
        format="YYYY-MM"
        value={value}
        mode={mode}
        onChange={this.handleChange}
        onPanelChange={this.handlePanelChange}
        disabledDate={this.props.disabledDate}
        disabled={this.props.disabled}
      />
    );
  }
}
