import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList} from 'suid';
import moment from 'moment';
import { PCNMasterdatalist } from '../../commonProps'
const {create } = Form;
const FormItem = Form.Item;
const RadioGroup=Radio.Group;
const { TextArea } = Input;
const { storage } = utils;
const formLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 12,
    }
};
const confirmRadioOptions = [
    {
        label: '新增',
        value: '1'
    }, {
        label: '变更',
        value: '2'
    }, {
        label: '明细',
        value: '3'
    }
]
const HeadFormRef = forwardRef(({
    form,
    isView,
    dataSource,
}, ref) => {
    useImperativeHandle(ref, () => ({
        form,
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const authorizations = storage.sessionStorage.get("Authorization");
    const [configure, setConfigure] = useState([]);
    useEffect(() => {

    }, [])
    // 
    function scienceEnvir(e) {
        console.log(e.target.value)
    }
    return (
        <div >
            <div >
                <div >
                    <Row>
                        <Col span={20}>
                            <FormItem label='环保影响' {...formLayout}>
                                {
                                    getFieldDecorator('smEnvironmentalImpact', {
                                        initialValue: dataSource && dataSource.smEnvironmentalImpact,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择环保影响',
                                            },
                                        ],
                                    })(
                                        <RadioGroup disabled={isView === true} onChange={(e) => scienceEnvir(e)}>
                                            <Radio value="Organize" >有影响</Radio>
                                            <Radio value="Organized" >无影响</Radio>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem label='安规影响' {...formLayout}>
                                {
                                    getFieldDecorator('smSafetyImpact', {
                                        initialValue: dataSource && dataSource.smSafetyImpact,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择安规影响',
                                            },
                                        ],
                                    })(
                                        <RadioGroup disabled={isView === true}>
                                            <Radio value="Safety">有影响</Radio>
                                            <Radio value="Safetyno">无影响</Radio>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem label='安全可靠性、电性能影响' {...formLayout}>
                                {
                                    getFieldDecorator('smSecurityImpac', {
                                        initialValue: dataSource && dataSource.smSecurityImpac,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择安全可靠性、电性能影响',
                                            },
                                        ],
                                    })(
                                        <RadioGroup disabled={isView === true}>
                                            <Radio value="security">有影响</Radio>
                                            <Radio value="securityno">无影响</Radio>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem label='其他物料或整机的影响' {...formLayout}>
                                {
                                    getFieldDecorator('smMachineImpact', {
                                        initialValue: dataSource && dataSource.smMachineImpact,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择其他物料或整机的影响',
                                            },
                                        ],
                                    })(
                                        <RadioGroup disabled={isView === true}>
                                            <Radio value="machine">有影响</Radio>
                                            <Radio value="machineno">无影响</Radio>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem label='其他物料或整机的影响' {...formLayout}>
                                {
                                    getFieldDecorator('smOtherImpact', {
                                        initialValue: dataSource && dataSource.smOtherImpact,
                                    })(
                                        <TextArea
                                            style={{
                                                width: "100%"
                                            }}
                                            placeholder="请输入其他物料或整机的影响"
                                            disabled={isView === true}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm