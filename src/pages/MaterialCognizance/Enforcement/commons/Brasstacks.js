import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, message } from 'antd';
import { utils, ComboList} from 'suid';
// import { PCNMasterdatalist } from '../../commonProps'
import UploadFile from '../../../../components/Upload/index'
import moment from 'moment';
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
      label: '通过',
      value: 1
    }, {
      label: '不通过',
      value: 0
    }
]
const RectificationRadio = [
    {
      label: '是',
      value: 1
    }, {
      label: '否',
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
    function disabledDate(current) {
        return current && current < moment().endOf('day');
      }
    return (
        <div >
            <Row>
                <Col span={15}>
                    <FormItem label='是否通过' {...formLayout}>
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
                <Col span={15}>
                    <FormItem label='是否整改' {...formLayout}>
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
                                    options={RectificationRadio} />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={15}>
                    <FormItem label='本次任务完成日期' {...formLayout}>
                        {
                            getFieldDecorator('smSecurityImpac', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择本次任务完成日期',
                                    },
                                ],
                            })(
                                <DatePicker 
                                    format="YYYY-MM-DD"
                                    disabledDate={disabledDate}
                                    disabled={isView}
                                    style={{ width: '100%' }}
                                />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={15}>
                    <FormItem label='执行责任人' {...formLayout}>
                        {
                            getFieldDecorator('smMachineImpact', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择其他物料或整机的影响',
                                    },
                                ],
                            })(
                                <Input disabled />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={15}>
                    <FormItem label='经办人' {...formLayout}>
                        {
                            getFieldDecorator('smOtherImpact', {
                                initialValue: editformData && editformData.smOtherImpact,
                            })(
                                <Input disabled />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={15}>
                    <FormItem label='过程说明' {...formLayout}>
                        {
                            getFieldDecorator('smOtherImpact', {
                                initialValue: editformData && editformData.smOtherImpact,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择其他物料或整机的影响',
                                    },
                                ],
                            })(
                                <TextArea disabled />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={15}>
                    <FormItem
                        {...formLayout}
                        label={'附件资料'}
                    >
                        {
                            getFieldDecorator('attachment', {
                                initialValue: [],
                            })(
                                <UploadFile
                                    title={"附件上传"}
                                    entityId={editformData ? editformData.attachmentId : null}
                                    type={isView ? "show" : ""}
                                />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
        </div>
    )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm