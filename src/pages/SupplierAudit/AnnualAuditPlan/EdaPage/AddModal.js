import React, { useEffect, useState } from 'react';
import { ComboGrid, ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import { Button, Col, Form, Input, message, Row, Spin } from 'antd';
import { AuditCauseManagementConfig } from '../../mainData/commomService';
import { isEmptyArray, hideFormItem, filterEmptyFileds } from '@/utils/utilTool';
// import { getSupplierSupplyList } from '../service';
import { smBaseUrl } from '@/utils/commonUrl';
import { purchaseOrgConfig, corporationProps, materialClassProps, getListByTypeId } from '@/utils/commonProps';
import { findReviewTypesByCode } from '../service';

const FormItem = Form.Item;

const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddModal = (props) => {

    const { visible, title, form, handleCancel, handleOk } = props

    const { getFieldDecorator } = form;

    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [selectRows, setselectRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cascadeParams, setCascadeParams] = useState({});
    const [page, setPage] = useState({});

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
        {
            title: '供应商', dataIndex: 'supplier', ellipsis: true, width: 140, render: function (text, context) {
                return text && `${text.code}_${text.name}`;
            }
        },
        { title: '代理商', dataIndex: 'originSupplierName', ellipsis: true, width: 140 },
        {
            title: '物料分类', dataIndex: 'materielCategory', ellipsis: true, width: 140, render: (text, context) => {
                return text && text.showName;
            }
        },
        { title: '物料级别', dataIndex: 'materialGrade', ellipsis: true, width: 80, align: 'center' },
        { title: '绩效等级', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
        { title: '采购金额', dataIndex: 'sampleReceiverName', ellipsis: true, width: 140 },
    ];

    const onCancel = () => {
        handleCancel();
    }

    const onOk = () => {
        if (isEmptyArray(selectRows)) {
            message.info('至少选择一条行信息');
            return;
        }
        handleOk(selectRows);
    }

    const clearSelected = () => {

    }

    const HideFormItem = hideFormItem(getFieldDecorator);

    function handleSelectedRows(key, rows) {
        setselectedRowKeys(key);
        setselectRows(rows);
    }

    function handleOnchange(page) {
        console.log(page);
        if (page) {
            setPage(page);
        }
    }

    function handleSearch() {
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            if (!err) {
                delete values.Q_EQ_purchaseOrgName;
                delete values.materialGradeAndName;
                delete values.Q_EQ_corporationName;
                setCascadeParams(values);
            }
        });
    }

    function resetForm() {
        form.resetFields();
    }

    function renderForm() {
        return (
            <Form>
                <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayoutLong} label={'需求公司'}>
                            {
                                getFieldDecorator('Q_EQ_corporationName')(
                                    <ComboGrid
                                        allowClear
                                        style={{ width: '100%' }}
                                        form={form}
                                        name='Q_EQ_corporationName'
                                        field={['Q_EQ_corporationCode']}
                                        {...corporationProps}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    {HideFormItem('Q_EQ_corporationCode')}
                    {HideFormItem('Q_EQ_purchaseOrgCode')}
                    <Col span={8}>
                        <FormItem {...formItemLayoutLong} label={'采购组织'}>
                            {
                                getFieldDecorator('Q_EQ_purchaseOrgName')(
                                    <ComboGrid
                                        form={form}
                                        field={['Q_EQ_purchaseOrgCode']}
                                        name={'Q_EQ_purchaseOrgName'}
                                        {...purchaseOrgConfig}
                                        allowClear
                                    // afterSelect={selectpurchaseOrg}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    {HideFormItem('materielCategoryCode')}
                    <Col span={8}>
                        <FormItem {...formItemLayoutLong} label={'物料分类'}>
                            {
                                getFieldDecorator('materielCategory')(
                                    <ComboTree
                                        allowClear
                                        form={form}
                                        name='materialCategoryName'
                                        {...materialClassProps}
                                        field={['materielCategoryCode']}

                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayoutLong} label={'原厂'}>
                            {
                                getFieldDecorator('originSupplierCode')(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayoutLong} label={'物料级别'}>
                            {
                                getFieldDecorator('materialGrade'),
                                getFieldDecorator('materialGradeAndName')(
                                    <ComboList
                                        allowClear
                                        style={{ width: '100%' }}
                                        form={form}
                                        pagination={false}
                                        name='materialGradeAndName'
                                        field={['materialGrade']}
                                        {...getListByTypeId('F4D69B2D-7949-11EA-920B-0242C0A84416')}
                                    // afterSelect={setMaterialGrade}
                                    />,
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayoutLong} label={'绩效等级'}>
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
            </Form>
        );
    }

    return (
        <ExtModal
            width={'80%'}
            maskClosable={false}
            visible={visible}
            title={title}
            onCancel={onCancel}
            onOk={onOk}
            destroyOnClose={true}
            afterClose={clearSelected}
            footer={[
                <Button key="back" onClick={onCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={onOk}>
                    确定
                </Button>,
            ]}

        >
            <div>{renderForm()}</div>
            <div style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={handleSearch} style={{ marginRight: '10px' }}>查询</Button>
                <Button onClick={resetForm}>重置</Button>
            </div>
            <ExtTable
                style={{ marginTop: '10px' }}
                rowKey='id'
                allowCancelSelect={true}
                showSearch={false}
                remotePaging
                checkbox={true}
                size='small'
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                onChange={handleOnchange}
                store={{
                    params: {
                        valid: 1,
                        page: page.current,
                        rows: page.pageSize,
                    },
                    url: `${smBaseUrl}/supplierSupplyList/listPageVo`,
                    type: 'get',
                }}

                cascadeParams={
                    {
                        valid: 1,
                        ...filterEmptyFileds(cascadeParams),
                    }
                }
                columns={columns}
                loading={loading}
            />
        </ExtModal>
    )

}

export default Form.create()(AddModal);
