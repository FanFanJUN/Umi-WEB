import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, message } from 'antd';
import { utils, ComboList} from 'suid';
import { PCNMasterdatalist } from '../../commonProps'
const {create } = Form;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Group } = Radio;
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
      label: '有影响',
      value: 1
    }, {
      label: '无影响',
      value: 0
    }
  ]
const HeadFormRef = forwardRef(({
    form,
    isView,
    editformData
}, ref) => {
    useImperativeHandle(ref, () => ({
        form,
        modifyinfo
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configure, setConfigure] = useState([]);
    useEffect(() => {
        setFieldsValue({
            smEnvironmentalImpact: editformData && editformData.smEnvironmentalImpact,
            smSafetyImpact: editformData && editformData.smSafetyImpact,
            smSecurityImpac: editformData && editformData.smSecurityImpac,
            smMachineImpact: editformData && editformData.smMachineImpact
        })
    }, [editformData])
    // 
    function scienceEnvir(e) {
        console.log(e.target.value)
    }
    function modifyinfo() {
        let modifyinfluen = false;
        form.validateFieldsAndScroll(async (err, val) => {
            if (!err) {
                modifyinfluen = val;
            } 
        })
        return modifyinfluen ? modifyinfluen : false
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
                                        //initialValue: editformData.smEnvironmentalImpact,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择环保影响',
                                            },
                                        ],
                                    })(
                                        <Group 
                                            disabled={isView === true}
                                            options={confirmRadioOptions} />
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
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择安规影响',
                                            },
                                        ],
                                    })(
                                        <Group 
                                            disabled={isView === true}
                                            options={confirmRadioOptions} />
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
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择安全可靠性、电性能影响',
                                            },
                                        ],
                                    })(
                                        <Group 
                                            disabled={isView === true}
                                            options={confirmRadioOptions} />
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
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择其他物料或整机的影响',
                                            },
                                        ],
                                    })(
                                        <Group 
                                            disabled={isView === true}
                                            options={confirmRadioOptions} />
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
                                        initialValue: editformData && editformData.smOtherImpact,
                                    })(
                                        <TextArea
                                            style={{
                                                width: "100%"
                                            }}
                                            maxLength={100}
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