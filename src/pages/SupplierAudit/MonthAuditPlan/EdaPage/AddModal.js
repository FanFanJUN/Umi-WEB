// 从年度审核新增
import React, { useState, } from "react";
import { Form, Row, Col, Button } from "antd";
import { ExtTable, ExtModal, ComboList, ComboGrid, ComboTree } from 'suid';
import { AuditCauseManagementConfig } from '../../mainData/commomService';
import { corporationProps, materialClassProps } from '@/utils/commonProps';
import { smBaseUrl } from '@/utils/commonUrl';

const FormItem = Form.Item;
const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddModal = (props) => {
    const { visible, type, handleCancel, handleOk, form } = props
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    console.log("获取到的visivle", visible)
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [cascadeParams, setCascadeParams] = useState({});
    const [selectRows, setselectRows] = useState([]);

    const store = {
        params: {
            valid: 1
        },
        url: `${smBaseUrl}/supplierSupplyList/listPageVo`,
        type: 'GET',
    }

    const columns = [
        {
            title: '需求公司', dataIndex: 'corporation', width: 140, ellipsis: true, render: (text, context) => {
                return text && `${text.code}_${text.name}`;
            }
        },
        {
            title: '采购组织', dataIndex: 'purchaseOrg', ellipsis: true, width: 140, render: (text, context) => {
                return text && `${text.code}_${text.name}`;
            }
        },
        { title: '供应商', dataIndex: 'supplierCode', ellipsis: true, width: 140 },
        { title: '代理商', dataIndex: 'xx', ellipsis: true, width: 140 },
        {
            title: '物料分类', dataIndex: 'materielCategory', ellipsis: true, width: 140, render: (text, context) => {
                return text && text.showName;
            }
        },
        { title: '物料级别', dataIndex: 'materialGrade', ellipsis: true, width: 140 },
        { title: '绩效等级', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
        { title: '采购金额', dataIndex: 'sampleReceiverName', ellipsis: true, width: 140 },
    ].map(item => ({ ...item, align: 'center' }))

    const onOk = () => {
        console.log("执行")
    }

    function handleSearch() {
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            if (!err) {
                setCascadeParams(values);
            }
        });
    }

    function renderForm() {
        if (type === "annual") {
            return <Form>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayoutLong} label={'年度审核计划'}>
                            {
                                getFieldDecorator('fileCategoryName')(
                                    <ComboList
                                        allowClear
                                        style={{ width: '100%' }}
                                        form={form}
                                        name={'name'}
                                        field={['code', 'id']}
                                        {...AuditCauseManagementConfig}
                                    />,
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayoutLong} label={'预计审核月度'}>
                            {
                                getFieldDecorator('fileCategoryName')(
                                    <ComboList
                                        allowClear
                                        style={{ width: '100%' }}
                                        form={form}
                                        name={'name'}
                                        field={['code', 'id']}
                                        {...AuditCauseManagementConfig}
                                    />,
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ textAlign: 'center' }} onClick={handleSearch}><Button type="primary">查询</Button></div>
            </Form>
        } else if (type === "recommand") {
            return <Form>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayoutLong} label={'准入推荐号'}>
                            {
                                getFieldDecorator('fileCategoryName')(
                                    <ComboList
                                        allowClear
                                        style={{ width: '100%' }}
                                        form={form}
                                        name={'name'}
                                        field={['code', 'id']}
                                        {...AuditCauseManagementConfig}
                                    />,
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col style={{ textAlign: 'center' }} onClick={handleSearch}><Button type="primary">查询</Button></Col>
                </Row>
            </Form>
        } else if (type === "demand") {
            return (
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'审核需求号'}>
                                {
                                    getFieldDecorator('Q_EQ_corporationName')(
                                        <ComboGrid
                                            allowClear
                                            style={{ width: '100%' }}
                                            form={form}
                                            name='name'
                                            field={['Q_EQ_corporationCode']}
                                            {...corporationProps}
                                            afterSelect={(item)=>{console.log(item)}}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'需求公司'}>
                                {
                                    getFieldDecorator('Q_EQ_corporationName')(
                                        <ComboGrid
                                            allowClear
                                            style={{ width: '100%' }}
                                            form={form}
                                            name='name'
                                            field={['Q_EQ_corporationCode']}
                                            {...corporationProps}
                                            afterSelect={(item)=>{console.log(item)}}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'物料分类'}>
                                {
                                    getFieldDecorator('materielCategoryCode'),
                                    getFieldDecorator('materielCategory')(
                                        <ComboTree
                                            allowClear
                                            form={form}
                                            name='materialCategoryName'
                                            {...materialClassProps}
                                            field={['materielCategoryCode']}
                                            afterSelect={(item)=>{console.log(item)}}
                                        />,
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'采购组织'}>
                                {
                                    getFieldDecorator('Q_EQ_corporationName')(
                                        <ComboGrid
                                            allowClear
                                            style={{ width: '100%' }}
                                            form={form}
                                            name='name'
                                            field={['Q_EQ_corporationCode']}
                                            {...corporationProps}
                                            afterSelect={(item)=>{console.log(item)}}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'center' }} onClick={handleSearch}><Button type="primary">查询</Button></div>
                </Form>
            );
        } else {
            return ""
        }

    }

    return <ExtModal
        width={'120vh'}
        height={'800px'}
        maskClosable={false}
        visible={visible}
        title={type==="annual" ? "从年度计划新增" : type==="recommand" ? "从准入推荐新增" : "从审核需求新增"}
        onCancel={handleCancel}
        onOk={onOk}
        destroyOnClose
    >
        <div>{renderForm()}</div>
        <ExtTable
            style={{ marginTop: '10px' }}
            rowKey='id'
            allowCancelSelect={true}
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            size='small'
            onSelectRow={(key, rows) => {
                setselectedRowKeys(key);
                setselectRows(rows);
            }}
            selectedRowKeys={selectedRowKeys}
            store={store}
            columns={columns}
        />
    </ExtModal>
}

export default Form.create()(AddModal);