import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, InputNumber, Row, Col, message } from 'antd';
import { utils, ExtTable, ComboList } from 'suid';
import { AddButtonWrapper } from './style'
import { checkCardNo, onlyNumber, onMailCheck, toUpperCase } from '@/utils/index'
import { purchaseCompanyProps, FieldconfigureList } from '@/utils/commonProps'
import {dataTransfer2} from "../CommonUtils";
const { create } = Form;
const FormItem = Form.Item;

const ThreeYearRef = forwardRef(({
    form,
    editData = {},
    isView
}, ref) => {
    useImperativeHandle(ref, () => ({
        getThreeYear,
        ThreeTemporary,
        setHeaderFields,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        incomeinfo(editData);
    }, [editData])

    const tableProps = [
        {
            title: '年份',
            dataIndex: 'particularYear',
            align: 'center',
            width: 100,
        },
        {
            title: <span><label className="ant-form-item-required" title=""></label>收入(万元)</span>,
            dataIndex: 'operatingVolume',
            width: 300,
            align: 'center',
            render: (text, record, index) => {
                if (isView) {
                    return text ? `${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
                }
                return <span>
                    <FormItem style={{ marginBottom: 0 }}>
                        {
                            getFieldDecorator(`operatingVolume[${index}]`, {
                                initialValue: record.operatingVolume,
                                rules: [{ required: true, message: '请输入收入!' }],
                            })(
                                <InputNumber
                                    style={{ width: '100%' }}
                                    className="inputext"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    placeholder={'请输入收入'}
                                    precision={2}
                                    min={0}
                                />
                            )}
                    </FormItem>
                </span>;
            },
        }
    ].map(item => ({ ...item, align: 'center' }))
    function incomeinfo(editData) {
        let initData = [
            {key: 0},
            {key: 1},
            {key: 2},
        ];
        let myDate = new Date().getFullYear();
            let nowYear = myDate + 1;
        for (let i = 0; i <= 2; i++) {
            nowYear = nowYear - 1;
            initData[i].particularYear = nowYear
        }
        if (editData && editData.supplierRecentIncomes && editData.supplierRecentIncomes.length > 0) {
            initData = editData.supplierRecentIncomes.map((item, index) => ({key: index, ...item}));
        }
        setDataSource(initData)
    }
    // 暂存
    function ThreeTemporary () {
        let result = {};
        form.validateFieldsAndScroll((err, values) => {
        if (values) {
            result = dataTransfer2(dataSource, values);
            for (let i = 0; i <= result.length; i++) {
            result[i].particularYear = dataSource[i].particularYear
            }
        }
        });
        return result;
    }
    // 获取表单值
    function getThreeYear() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                result = dataTransfer2(dataSource, values);
              for (let i = 0; i <= result.length; i++) {
                result[i].particularYear = dataSource[i].particularYear
              }
            }
        });
        console.log(result)
        return result;
    }
    // 设置所有表格参数
    const setHeaderFields = (fields) => {
        //const { attachmentId = null, ...fs } = fields;
        // setAttachment(attachmentId)
        // setFieldsValue(fs)
    }
    return (
        <Row>
            <Col span={17}>
                <ExtTable
                    height={320}
                    allowCancelSelect
                    columns={tableProps}
                    dataSource={dataSource}
                    showSearch={false}
                    pagination={{
                        hideOnSinglePage: true,
                        disabled: false,
                        pageSize: 100,
                    }}
                    checkbox={false}
                    rowKey={(item) => `row-${item.key}`}
                />
            </Col>
            <Col offset={1} span={6}>
                <span>
                    说明：营业不足三年，只填营业后年份营业额,其它年份填写0
            </span>
            </Col>
        </Row>
    )
}
)
const CommonForm = create()(ThreeYearRef)

export default CommonForm