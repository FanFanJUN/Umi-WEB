// 从年度审核新增
import React, { useState, useRef} from "react";
import { Form, Row, Col, Button } from "antd";
import { ExtTable, ExtModal, ComboList, ComboTree } from 'suid';
import {
    AuditCauseManagementConfig,
    AllCompanyConfig,
    AllFindByFiltersConfig,
    materialCodeProps,
    reviewRequirementConfig
} from '../../mainData/commomService';
import { recommendUrl } from '@/utils/commonUrl';
import { findRequirementLine } from "../service"

const FormItem = Form.Item;
const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddModal = (props) => {
    const { visible, type, handleCancel, handleOk, form } = props
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const tableRef = useRef(null)
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [cascadeParams, setCascadeParams] = useState({});
    const [selectRows, setselectRows] = useState([]);

    // 从审核需求新增
    

    const columns = [
        {
            title: '需求公司', dataIndex: 'corporation', width: 140, ellipsis: true, render: (text, context) => {
                return text && `${text.code}_${text.name}`;
            }
        },
        {
            title: '采购组织', dataIndex: 'purchaseOrgName', ellipsis: true, width: 140, render: (text, context) => {
                return text && `${text.code}_${text.name}`;
            }
        },
        { title: '供应商', dataIndex: 'supplierCode', ellipsis: true, width: 140 },
        { title: '代理商', dataIndex: 'xx', ellipsis: true, width: 140 },
        {
            title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 140, render: (text, context) => {
                return text && text.showName;
            }
        },
    ].map(item => ({ ...item, align: 'center' }))

    const getColums = () => {
        switch (type) {
            case "annual":
                return [
                    { title: '预计审核月度', dataIndex: 'data1', ellipsis: true, width: 140 },
                ].concat(columns);
            case "recommand":
                return [
                    { title: '准入推荐号', dataIndex: 'data2', ellipsis: true, width: 140 },
                ].concat(columns);
            case "demand":
                return [
                    {
                        title: '提出日期', dataIndex: 'applyDate', ellipsis: true, width: 140, render: (text, item) => {
                            return item.reviewRequirementVo && item.reviewRequirementVo.applyDate
                        }
                    },
                    { title: '审核需求号', dataIndex: 'reviewRequirementCode', ellipsis: true, width: 140 },
                    {
                        title: '需求公司', dataIndex: 'corporation', width: 140, ellipsis: true, render: (text, item) => {
                            return item.reviewRequirementVo && item.reviewRequirementVo.applyCorporationName
                        }
                    },
                    {
                        title: '采购组织', dataIndex: 'purchaseOrgName', ellipsis: true, width: 140, render: (text, item) => {
                            return item.reviewRequirementVo && item.reviewRequirementVo.purchaseOrgName
                        }
                    },
                    { title: '供应商', dataIndex: 'supplierCode', ellipsis: true, width: 140 },
                    { title: '代理商', dataIndex: 'xagentNamex', ellipsis: true, width: 140 },
                    { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 140 }
                ];
        }
    }

    const getStore = () => {
        if(type === "demand") {
            return {
                params: {
                    usedType: 2,
                    ...cascadeParams
                },
                url: `${recommendUrl}/api/reviewRequirementLineService/findForList`,
                type: 'POST',
            }
        } else {
            return {
                params: {
                    usedType: 2,
                    ...cascadeParams
                },
                url: `${recommendUrl}/api/reviewRequirementLineService/findForList`,
                type: 'POST',
            }
        }
    }
    const onOk = async () => {
        const res = await findRequirementLine({
            ids: selectedRowKeys.join()
        })
        if(res.success) {
            handleOk(res.data);
        }
    }

    function handleSearch() {
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(type === "demand") {
                    delete values.applyCorporationId;
                    delete values.applyCorporationName;
                    delete values.purchaseOrgId;
                    delete values.purchaseOrgName;
                }
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
                                    getFieldDecorator('reviewRequirementCode')(
                                        <ComboList
                                            allowClear
                                            style={{ width: '100%' }}
                                            form={form}
                                            name='reviewRequirementCode'
                                            {...reviewRequirementConfig}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'需求公司'}>
                                {
                                    getFieldDecorator('applyCorporationId'),
                                    getFieldDecorator('applyCorporationCode'),
                                    getFieldDecorator('applyCorporationName')(
                                        <ComboList
                                            allowClear={true}
                                            style={{ width: '100%' }}
                                            form={form}
                                            name={'applyCorporationName'}
                                            field={['applyCorporationCode', 'applyCorporationId']}
                                            {...AllCompanyConfig}
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
                                    getFieldDecorator('materialSecondClassifyCode')(
                                        <ComboTree
                                            allowClear
                                            form={form}
                                            name='materialSecondClassifyCode'
                                            {...materialCodeProps}
                                        />,
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'采购组织'}>
                                {
                                    getFieldDecorator('purchaseOrgCode'),
                                    getFieldDecorator('purchaseOrgId'),
                                    getFieldDecorator('purchaseOrgName')(
                                        <ComboList
                                            allowClear={true}
                                            style={{ width: '100%' }}
                                            form={form}
                                            name={'purchaseOrgName'}
                                            field={['purchaseOrgCode', 'purchaseOrgId']}
                                            {...AllFindByFiltersConfig}
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
        width={'1000px'}
        height={'800px'}
        maskClosable={false}
        visible={visible}
        title={type === "annual" ? "从年度计划新增" : type === "recommand" ? "从准入推荐新增" : "从审核需求新增"}
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
            checkbox={{ multiSelect: true }}
            size='small'
            onSelectRow={(key, rows) => {
                setselectedRowKeys(key);
                setselectRows(rows);
            }}
            cascadeParams={{
                ...cascadeParams
            }}
            ref={tableRef}
            selectedRowKeys={selectedRowKeys}
            store={getStore()}
            columns={getColums()}
        />
    </ExtModal>
}

export default Form.create()(AddModal);