import React, { useEffect, useState } from 'react';
import { ComboGrid, ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { AllCompanyConfig, AuditCauseManagementConfig } from '../../mainData/commomService';
import { isEmptyArray, guid, hideFormItem, filterEmptyFileds } from '@/utils/utilTool';
// import { getSupplierSupplyList } from '../service';
import { smBaseUrl } from '@/utils/commonUrl';
import { purchaseOrgConfig, corporationProps, materialClassProps } from '@/utils/commonProps';
import LineInfo from './LineInfo';

const FormItem = Form.Item;

const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddModal = (props) => {

    const { visible, title, form, type, handleCancel, handleOk, lineData } = props

    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [selectRows, setselectRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataSource, setdataSource] = useState([]);
    const [cascadeParams, setCascadeParams] = useState({});

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

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //         const res = await getSupplierSupplyList({ supplierRecommendDemandId: '676800B6-F19D-11EA-9F88-0242C0A8442E' });
    //         if (res.success) {
    //             res.data && setdataSource(res.data);
    //         } else {
    //             message.error(res.message);
    //         }
    //         setLoading(false);
    //     };
    //     fetchData();
    // }, []);

    const onCancel = () => {
        handleCancel();
    }

    const onOk = () => {
        if (isEmptyArray(selectRows)) {
            message.info('至少选择一条行信息');
            return;
        }
        const tableData = Object.assign({}, { ...selectRows[0], id: guid() });
        handleOk(tableData);
        setselectedRowKeys([]);
        setselectRows([]);
    }

    const clearSelected = () => {

    }

    const HideFormItem = hideFormItem(getFieldDecorator);

    function handleSelectedRows(key, rows) {
        setselectedRowKeys(key);
        setselectRows(rows);
    }

    function handleSearch() {
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            if (!err) {
                setCascadeParams(values);
            }
        });
    }

    function selectCorPoration(item, index) {
        if (item) {
            setFieldsValue({ Q_EQ_corporationCode: item.code });
        } else {
            setFieldsValue({ Q_EQ_corporationCode: '' });
        }
    }

    function selectpurchaseOrg(item, index) {
        if (item) {
            setFieldsValue({ Q_EQ_purchaseOrgCode: item.code });
        } else {
            setFieldsValue({ Q_EQ_purchaseOrgCode: '' });
        }
    }

    function selectMaterielCategory(item, index) {
        if (item) {
            setFieldsValue({ materielCategoryCode: item.code });
        } else {
            setFieldsValue({ materielCategoryCode: '' });
        }
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
                                        name='name'
                                        field={['Q_EQ_corporationCode']}
                                        {...corporationProps}
                                        afterSelect={selectCorPoration}
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
                                        name={'name'}
                                        {...purchaseOrgConfig}
                                        allowClear
                                        afterSelect={selectpurchaseOrg}
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
                                        afterSelect={selectMaterielCategory}
                                    />,
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayoutLong} label={'原厂'}>
                            {
                                getFieldDecorator('fileCategoryName')(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayoutLong} label={'物料级别'}>
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
            <div style={{ textAlign: 'center' }} onClick={handleSearch}><Button type="primary">查询</Button></div>
            <ExtTable
                style={{ marginTop: '10px' }}
                rowKey='id'
                allowCancelSelect={true}
                showSearch={false}
                remotePaging
                checkbox={{ multiSelect: false }}
                size='small'
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                store={{
                    params: {
                        valid: 1
                    },
                    url: `${smBaseUrl}/supplierSupplyList/listPageVo`,
                    type: 'GET',
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
