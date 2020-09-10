/**
 * Created by liusonglin on 2018/7/12.
 */

import React, { Component } from 'react';
import { Select } from 'antd';
import { isEmpty } from '@/utils/index';

const Option = Select.Option;

export default class SelectWithService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            selectValue: undefined,
            loading: false,
            dataLoad: false,
        };
    }

    componentWillMount() {
        const { initValue, params = {} } = this.props;
        if (initValue && !this.props.value) {
            this.getDataSource(params, true);
        } else {
            this.getDataSource(params, false);
        }
    }

    //传入参数，级联操作
    componentWillReceiveProps(nextProps) {
        if (nextProps.params &&
            this.props.params &&
            Object.values(nextProps.params).toString() !== Object.values(this.props.params).toString()) {
            if (this.props.initValue) {
                this.getDataSource(nextProps.params, true);
            } else {
                this.getDataSource(nextProps.params);
            }
            if (this.props.value === nextProps.value && !isEmpty(nextProps.value)) {
                this.props.onChange(undefined);
            }
        }
    }

    getDataSource(params, initValue) {
        this.setState({ loading: true });
        const { key } = this.props.config;
        this.props.config.service({ ...params, Q_EQ_frozen__bool: 0 }).then((res) => {
            this.setState({ dataLoad: true });
            let fliterData;
            if (res.data) {
                fliterData = res.data.filter(item => Object.keys(item).includes('frozen') ? item.frozen === false : true);
                this.setState({ dataSource: fliterData });
            } else if (res.rows) {
                fliterData = res.rows.filter(item => Object.keys(item).includes('frozen') ? item.frozen === false : true);
                this.setState({ dataSource: fliterData });
            } else if (res instanceof Array) {
                fliterData = res.filter(item => Object.keys(item).includes('frozen') ? item.frozen === false : true);
                this.setState({ dataSource: fliterData });
            }
            if (initValue && fliterData) {
                if (this.props.mode === 'multiple') {
                    this.props.onChange([fliterData[0][key]], fliterData[0]);
                } else {
                    this.props.onChange(fliterData[0][key], fliterData[0]);
                }
            }
        }).finally(() => {
            this.setState({ loading: false });
        });
    };

    onSearchHandle = (value) => {
        if (this.props.remoteSearch) {
            this.getDataSource({ Quick_value: value });
        }
    };

    handleChange = (value, Option) => {
        this.props.onChange(value, Option);
    };

    render() {
        const { text, key } = this.props.config;
        const options = this.state.dataSource.map(d => <Option value={d[key]} key={d[key]}>{d[text]}</Option>);
        return (
            <Select
                mode={this.props.mode}
                labelInValue={this.props.labelInValue || false}
                placeholder={this.props.placeholder}
                allowClear={true}
                loading={this.state.loading}
                getPopupContainer={(triggerNode) => triggerNode}
                disabled={this.props.disabled}
                defaultValue={this.props.value}
                value={this.state.dataLoad ? this.props.value : '...正在加载'}
                optionFilterProp="children"
                dropdownMatchSelectWidth={false}
                showSearch={true}
                style={{ width: '100%', ...this.props.style }}
                dropdownStyle={{border:"1px solid #40a9ff",boxShadow:"0 0 0 2px rgba(24,144,255,.2)"}}
                onSearch={this.onSearchHandle}
                onChange={this.handleChange}>
                {options}
            </Select>
        );
    }
}

