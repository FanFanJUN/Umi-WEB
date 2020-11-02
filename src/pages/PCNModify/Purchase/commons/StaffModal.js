import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboGrid, ComboList } from 'suid';
import UploadFile from '../../../../components/Upload/index'
// import { baseUrl } from '../../../utils/commonUrl';
import UserSelect from '../../UserSelect/index'
const { create, Item } = Form;
const formLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 19
    },
};
const data = [
    {
        name: '单值',
        code: '0',
    },
    {
        name: '多值',
        code: '1',
    }
];
const StaffForm = forwardRef(
    (
        {
            visible,
            form,
            onCancel = () => null,
            onOk = () => null,
            initialValues = {},
            type = 'add',
            loading,
            dataSource,
            isView,
            title
        },
        ref,
    ) => {
        useImperativeHandle(ref, () => ({ form }));
        const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
        useEffect(() => {
            if (type === 'editor' && visible) {
                const {
                    id,
                    createdDate,
                    creatorName,
                    ...other
                } = initialValues;
                const fields = {
                    ...other
                }
                setFieldsValue(fields);
            }
        }, [visible]);
        function handleSubmit() {
            validateFieldsAndScroll((err, val) => {
                if (!err) {
                    let newdata = [];
                    val.emloyeeName.map((item,index)=> {
                        val.emloyeeNumber.map((items,indexs)=> {
                            if (index === indexs) {
                                newdata.push({
                                    key: index,
                                    emloyeeName:item.userName,
                                    emloyeeNumber:items
                                })
                            }
                        })
                    })
                    onOk(newdata);
                }
            });
        }
        return (
            <Modal
                confirmLoading={loading}
                visible={visible}
                title={'新增'}
                onCancel={onCancel}
                destroyOnClose={true}
                width="40vw"
                maskClosable={false}
                onOk={handleSubmit}
            >  
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="员工姓名">
                            {
                            getFieldDecorator('emloyeeNumber'),    
                            getFieldDecorator('emloyeeName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择员工姓名',
                                    },
                                ],
                            })(
                                <UserSelect name="emloyeeName" style={{width:"100%",zIndex:10}}
                                    disabled={type === 'detail'}
                                    wrapperStyle={{width:1000}}
                                    reader={{name:'userName',field:['code']}} 
                                    form={form}
                                    field={['emloyeeNumber']}
                                    multiple={true}
                                    placeholder="请选择参与人员"
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="员工编号">
                            {getFieldDecorator('emloyeeNumber', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请选择员工编号',
                                    },
                                ],
                            })(
                                <Input disabled
                                    style={{width: "100%"}}
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
            </Modal>
        );
    },
);

export default create()(StaffForm);
