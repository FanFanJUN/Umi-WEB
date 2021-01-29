import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, InputNumber, Row, Col, message } from 'antd';
import { utils, ExtTable, ComboList } from 'suid';
import { CurrencyAllList } from '@/utils/commonProps'
import { dataTransfer2 } from "../CommonUtils";
import { isEmpty } from '../../../utils'
const { create } = Form;
const FormItem = Form.Item;

const ThreeYearRef = forwardRef(({
    form,
    editData = {},
    isView,
    maintype
}, ref) => {
    useImperativeHandle(ref, () => ({
        getThreeYear,
        ThreeTemporary,
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
            title: <span>
                {
                    maintype === '0' ? <label className="ant-form-item-required" title=""></label> : ''
                }
                含税销售金额(万元)</span>,
            dataIndex: 'operatingVolume',
            width: 200,
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
                                rules: [{ required: maintype === '0', message: '请输入收入!' }],
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
        },
        {
            title: <span><label className="ant-form-item-required" title=""></label>币种</span>,
            dataIndex: 'currencyName',
            width: 200,
            align: 'center',
            render: (text, record, index) => {
                if (isView) {
                    return record.currencyName;
                }
                return <span>
                    <FormItem style={{ marginBottom: 0 }}>
                        {
                            getFieldDecorator(`currencyCode[${index}]`, { initialValue: record ? record.currencyCode : '', }),
                            getFieldDecorator(`currencyName[${index}]`, {
                                initialValue: record.currencyName,
                            })(
                                <ComboList
                                    form={form}
                                    {...CurrencyAllList}
                                    showSearch={false}
                                    name={`currencyName[${index}]`}
                                    field={[`currencyCode[${index}]`]}
                                />
                            )}
                    </FormItem>
                </span>;
            },
        }
    ].map(item => ({ ...item, align: 'center' }))
    function incomeinfo(editData) {
        let initData = [
            { key: 0 },
            { key: 1 },
            { key: 2 },
        ];
        let myDate = new Date().getFullYear();
        let nowYear = myDate;
        for (let i = 0; i <= 2; i++) {
            nowYear = nowYear - 1;
            initData[i].particularYear = nowYear
        }
        let handledata = [];
        if (editData && editData.supplierRecentIncomes && editData.supplierRecentIncomes.length > 0) {

            editData.supplierRecentIncomes.map((items, indexs) => {
                if (isEmpty(items.currencyName) && isEmpty(items.currencyCode)) {
                    handledata.push({
                        key: indexs,
                        currencyName: '人民币',
                        currencyCode: 'RMB',
                        key: indexs,
                        ...items
                    })
                } else {
                    handledata.push({
                        key: indexs, ...items
                    })
                }
            })
            initData = handledata
        } else {
            initData.map((item) => {
                item.currencyName = '人民币'
                item.currencyCode = 'RMB'
            })
        }
        setDataSource(initData)
    }
    // 暂存
    function ThreeTemporary() {
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
        return result;
    }
    return (
        <Row>
            <Col span={16}>
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