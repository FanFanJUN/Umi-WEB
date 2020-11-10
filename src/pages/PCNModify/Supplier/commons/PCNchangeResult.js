import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Checkbox } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import UploadFile from '../../../../components/Upload/index'
import {isEmpty} from '../../../../utils'
const { Item, create } = Form;
const { TextArea } = Input;
const { storage } = utils;
const formLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 12,
    }
};
const HeadFormRef = forwardRef(({
    form,
    isView,
    editformData
}, ref) => {
    useImperativeHandle(ref, () => ({
        getResultBaseInfo,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [dataSource, setDataSource] = useState([]);
    const [opinion, setOpinion] = useState({});
    useEffect(() => {
        setDataSource(editformData)
        setOpinion(editformData.pcnResult)
    }, [editformData])
    // 表单
    function getResultBaseInfo() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            let technology,quality,other
            if (values.technicalAgreement) {
                technology = values.technicalAgreement === 'undefined' ? 0 : 1;
            }
            if (values.technicalAgreement) {
                quality = values.qualityAgreement === 'undefined' ? 0 : 1;
            }
            if (values.technicalAgreement) {
                other = values.otherAgreement === 'undefined' ? 0 : 1;
            }
            if (!err) {
                //values.resultAttachments = values.resultEnclosure
                values.technicalAgreement = technology
                values.qualityAgreement = quality
                values.otherAgreement = other
                //delete values.resultEnclosure;
                result = {...dataSource, ...values}
            }
        });
        return result;
    }
    function opinionChange(e) {
        setOpinion(e.target.value)
    }
    return (
        <>
            <Row>
                <Col span={20}>
                    <Item {...formLayout} label="结果">
                        {

                                getFieldDecorator('pcnResult', {
                                    initialValue: dataSource && dataSource.pcnResult,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择结果',
                                        },
                                    ],
                                })(
                                    <Radio.Group disabled={isView === true} onChange={(e) => opinionChange(e)}>
                                        <Radio value={0}>同意</Radio>
                                        <Radio value={1}>不同意</Radio>
                                    </Radio.Group>
                                ) 
                        }
                        
                    </Item>
                </Col>
            </Row>
            {/* <Row>
                <Col span={20}>
                    <Item
                        {...formLayout}
                        label={'附件资料'}
                    >
                        {
                            getFieldDecorator('resultEnclosure', {
                                initialValue: [],
                                rules: [
                                    {
                                        required: !isView,
                                        message: '请上传附件',
                                    },
                                ],
                            })(
                                <UploadFile
                                    title={"附件上传"}
                                    entityId={dataSource ? dataSource.resultEnclosure : null}
                                    type={isView ? "show" : ""}
                                />
                            )
                        }
                    </Item>
                </Col>
            </Row> */}
            {
                opinion === 0 ? <Row>
                    <Col span={20}>
                        <Item
                            {...formLayout}
                                label={'需要签的协议'}
                            >
                            {
                                getFieldDecorator('technicalAgreement', {
                                    initialValue: dataSource && String(dataSource.technicalAgreement),
                                })(
                                    <Checkbox.Group style={{ width: '100%' }} disabled={isView === true}>
                                        <Row>
                                            <Col>
                                                <Checkbox checked="1" value="1">技术协议</Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                )
                            }
                            {
                            
                                getFieldDecorator('qualityAgreement', {
                                    initialValue: dataSource && String(dataSource.qualityAgreement),
                                })(
                                    <Checkbox.Group style={{ width: '100%' }} disabled={isView === true}>
                                        <Row>
                                            <Col>
                                                <Checkbox checked="1" value="1">质量协议</Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                )
                            }
                            {
                            
                                getFieldDecorator('otherAgreement', {
                                    initialValue: dataSource && String(dataSource.otherAgreement),
                                })(
                                    <Checkbox.Group style={{ width: '100%' }} disabled={isView === true}>
                                        <Row>
                                            <Col>
                                                <Checkbox checked="1" value="1">其他协议</Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                )
                            }
                        </Item>
                    </Col>
                    {/* <Col span={8}>
                        <Item
                            {...formLayout}
                            label=''
                        >
                            {
                            
                                getFieldDecorator('otherAgreement', {
                                    initialValue: [],
                                })(
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Row>
                                            <Col span={8}>
                                                <Checkbox   Checkbox value="E">其他协议</Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                )
                            }
                        </Item>
                    </Col> */}
                </Row> : null
            }
            
            <Row>
                <Col span={20}>
                    <Item
                        {...formLayout}
                        label={'备注'}
                    >
                        {
                            getFieldDecorator('remark', {
                                initialValue: dataSource && dataSource.remark,
                            })(
                                <TextArea
                                    style={{
                                        width: "100%"
                                    }}
                                    maxLength={100}
                                    placeholder="请输入备注"
                                    disabled={isView === true}
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                            )
                        }
                    </Item>
                </Col>
            </Row>
        </>
    )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm