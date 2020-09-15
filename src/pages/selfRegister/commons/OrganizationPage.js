import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, message, Radio, Button } from 'antd';
import SearchTable from '../../supplierRegister/components/SearchTable'
import { checkSupplierName } from '../../../services/supplierRegister'
import {chineseProvinceTableConfig} from '../../../utils/commonProps'
const { create } = Form;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 14 },
    wrapperCol: { span: 10 },
};
const tipsLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const OrganizatRef = forwardRef(({
    isView,
    form,
    editData = [],
    initialValue = {},
    accountinfo = [],
    approve
}, ref) => {
    useImperativeHandle(ref, () => ({
        getOrganizinfo,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configAcc, setConfigAcc] = useState([]);
    const [configure, setConfigure] = useState([]);
    //const { attachment = null } = initialValues;
    useEffect(() => {
        // let fieldsListed = []
        // accountinfo.map(item => {
        //   fieldsListed.push({
        //     title: item.title,
        //     key: item.key,
        //     verifi: item.verifi,
        //     type: 'input',
        //   })
        // })
    }, [])
    // 表单
    function getOrganizinfo() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                result = values;
            }
        });
        return result;
    }
    //检查供应商名称
    async function handleCheckName() {
        const name = form.getFieldValue('name');
        if (name.indexOf(' ') !== -1) {
            message.error('供应商名称不允许存在空格，请重新输入');
            this.setChecks('checkSupplierNameResult', false);
            return false;
        }
        if (name) {
            const { success, message: msg } = await checkSupplierName({ supplierName: name, supplierId: '' });
            if (success) {
                message.success('供应商名称可以使用');
            } else {
                message.error('供应商名称已存在，请重新输入');
            }
        }
    }
    return (
        <Form>
            <Row>
                <Col span={10}>
                    <FormItem
                        {...formItemLayout}
                        label={'组织全称'}
                    >
                        {
                            getFieldDecorator('name', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入组织全称' },
                                //{ validator: this.checkName },
                                ],
                            })(
                                <Input
                                    //onChange={this.supplierNameChange}
                                    onBlur={handleCheckName}
                                    placeholder={'请输入组织全称'}
                                />,
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <FormItem
                        {...formItemLayout}
                        label={'所在省份'}
                    >
                        {
                            getFieldDecorator('registerProvinceId', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择所在省份' },
                                ],
                            })(
                                <SearchTable
                                    placeholder={'请选择所在省份'}
                                    config={chineseProvinceTableConfig}
                                />,
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <FormItem
                        {...formItemLayout}
                        label={'手机'}
                    >
                        {
                            getFieldDecorator('mobile', {
                                initialValue: '',
                                rules: [{
                                    required: true, message: '手机不能为空'
                                }],
                            })(
                                <Input
                                disabled={true}
                                    maxLength={11}
                                    placeholder={'请输入手机号'} />,
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <FormItem
                        {...formItemLayout}
                        label={'电子邮箱'}
                    >
                        {
                            getFieldDecorator('email', {
                                initialValue: '',
                                rules: [
                                    //{ validator: onMailCheck, message: '请输入正确格式的电子邮箱！', whitespace: true },
                                    { required: true, message: '请输入电子邮箱' }
                                ],
                            })(
                                <Input
                                    disabled={true}
                                    maxLength={50}
                                    placeholder={'请输入电子邮箱'} />,
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}
)
const CommonForm = create()(OrganizatRef)

export default CommonForm