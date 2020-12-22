import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, message } from 'antd';
import { utils, ComboList } from 'suid';
// import { PCNMasterdatalist } from '../../commonProps'
import UploadFile from '../../../../components/Upload/index'
import moment from 'moment';
import { basicServiceUrl, gatewayUrl } from '../../../../utils/commonUrl';
import { PersonliableList } from '../../commonProps'
import styles from '../index.less';
const { create } = Form;
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
    const [data, setData] = useState([]);
    const [rectif, setRectif] = useState(false);
    useEffect(() => {
        handledata()
    }, [])
    // 默认任务完成日期
    function handledata() {
        setData(moment().format('YYYY-MM-DD'))
    }
    //获取表单值
    function modifyinfo() {
        let modifyinfluen = false;
        form.validateFieldsAndScroll(async (err, val) => {
            if (!err) {
                val.completionDate = moment(val.completionDate).format('YYYY-MM-DD')
                modifyinfluen = val;
            }
        })
        return modifyinfluen ? modifyinfluen : false
    }
    // function disabledDate(current) {
    //     return current && current < moment().startOf('day');
    // }
    function handleadopt(e) {
        if (e.target.value === 0) {
            setRectif(true)
        } else {
            setRectif(false)
        }
    }
    return (
        <div >
            <Row>
                <Col span={15}>
                    <FormItem label='是否通过' {...formLayout}>
                        {
                            isView ? <span>{editformData ? editformData.passStatus : ''}</span> :
                                getFieldDecorator('passStatus', {
                                    initialValue: editformData ? editformData.passStatus : '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择是否通过',
                                        },
                                    ],
                                })(
                                    <Group
                                        disabled={isView === true}
                                        options={confirmRadioOptions}
                                        onChange={(value) => handleadopt(value)}
                                    />
                                )
                        }
                    </FormItem>
                </Col>
            </Row>
            {
                rectif ? <Row>
                    <Col span={15}>
                        <FormItem label='是否整改' {...formLayout}>
                            {
                                getFieldDecorator('rectificationStatus', {
                                    initialValue: editformData ? editformData.rectificationStatus : '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择是否整改',
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
                </Row> : null
            }
            <Row>
                <Col span={15}>
                    <FormItem label='本次任务完成日期' {...formLayout}>
                        {
                            getFieldDecorator('completionDate', {
                                initialValue: moment(data, 'YYYY-MM-DD'),
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择本次任务完成日期',
                                    },
                                ],
                            })(
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    //disabledDate={disabledDate}
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
                            getFieldDecorator('executionMan', {
                                initialValue: editformData && editformData.executorName,
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
                            getFieldDecorator('agentMan', {
                                initialValue: editformData && editformData.executorName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择本经办人',
                                    },
                                ],
                            })(
                                <ComboList
                                    form={form}
                                    style={{ width: "100%" }}
                                    name={'agentMan'}
                                    store={{
                                        params: {
                                            includeFrozen: false,
                                            includeSubNode: false,
                                            quickSearchProperties: ['code', 'user.userName'],
                                            organizationId: '',
                                            sortOrders: [{ property: 'code', direction: 'ASC' }],
                                        },
                                        type: 'POST',
                                        autoLoad: false,
                                        url: `${gatewayUrl}${basicServiceUrl}/employee/findByUserQueryParam`,
                                    }}
                                    {...PersonliableList}
                                />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={15}>
                    <FormItem label='过程说明' {...formLayout}>
                        {
                            getFieldDecorator('processDescription', {
                                initialValue: editformData && editformData.processDescription,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入过程说明',
                                    },
                                ],
                            })(
                                <TextArea />
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
                                    entityId={editformData ? editformData.enclosureId : null}
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