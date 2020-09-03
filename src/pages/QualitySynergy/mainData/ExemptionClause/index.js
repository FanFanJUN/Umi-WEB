
import React, { Fragment, useState } from 'react';
import { Button, Form, Row, Input, Modal, message, DatePicker, InputNumber } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import { DataImport, ExtTable, ExtModal, utils, ComboList } from 'suid';
import { materialCode } from '../../commonProps';
const { authAction } = utils;
const { create, Item: FormItem } = Form;
const { confirm } = Modal;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const ExemptionClause = (props) => {

    const [data, setData] = useState({
        visible: false,
        modalSource: '',
        isView: false
    })
    const { form } = props;
    const { getFieldDecorator, validateFields } = form;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    const columns = [
        { title: '豁免条款代码', dataIndex: 'name1', width: 200 },
        { title: '豁免条款物质名称', dataIndex: 'name2', ellipsis: true, },
        { title: 'CAS.NO', dataIndex: 'name3', ellipsis: true, },
        { title: '限量', dataIndex: 'name4', ellipsis: true },
        { title: '基本单位', dataIndex: 'name5', ellipsis: true },
        { title: '豁免到期日期', dataIndex: 'name6', ellipsis: true },
        { title: '豁免条款具体内容', dataIndex: 'name7', ellipsis: true },
    ]

    const buttonClick = (type) => {
        switch (type) {
            case 'add':
                setData((value) => ({ ...value, visible: true, modalSource: '', isView: false }));
                break;
            case 'edit':
            case 'detail':
                if (checkSlectOne()) {
                    setData((value) => ({
                        ...value,
                        visible: true,
                        modalSource: selectedRow[0],
                        isView: type === 'detail'
                    }));
                }
                break;
            case 'delete':
                if (selectedRow.length === 0) {
                    message.warning('至少选择一条数据')
                } else {
                    confirm({
                        title: '请确认是否删除选中技术资料类别数据',
                        onOk: () => {
                            console.log('确认删除', selectedRowKeys);
                        },
                    });
                }
                break;
        }
    }

    function checkSlectOne() {
        if (selectedRow.length === 0) {
            message.warning('请选择一条数据');
            return false;
        } else if (selectedRow.length > 1) {
            message.warning('只能选择一条数据');
            return false;
        }
        return true
    }


    const headerLeft = <div>
        {
            authAction(<Button
                type='primary'
                onClick={() => buttonClick('add')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='1'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='2'
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='3'
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('detail')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='4'
            >明细</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('thaw')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='5'
            >导入</Button>)
        }
    </div>
    function handleOk() {
        validateFields((errs, values) => {
            if (!errs) {
                console.log(values)
            }
        })
    }
    return (
        <Fragment>
            <ExtTable
                Table
                columns={columns}
                //   store={{
                //     url: `${baseUrl}/limitSubstanceListData/find_by_page`,
                //     type: 'GET'
                //   }}
                checkbox={true}
                selectedRowKeys={selectedRowKeys}
                onSelectRow={(selectedRowKeys, selectedRows) => {
                    setSelectedRow(selectedRows)
                    setSelectedRowKeys(selectedRowKeys)
                }}
                toolBar={{
                    left: headerLeft
                }}
                dataSource={[
                    { id: 1, name1: 'xxx', name2: 'sdhfj', name3: true, name4: 'sdf' },
                    { id: 2, name1: 'xxx', name2: 'sdhfj', name3: false, name4: 'sdf' },
                ]}
            />
            <ExtModal
                centered
                destroyOnClose
                visible={data.visible}
                onCancel={() => { setData((value) => ({ ...value, visible: false })) }}
                onOk={() => { handleOk() }}
                title={data.modalSource ? '编辑' : '新增'}
            >
                <Form>
                    <Row>
                        <FormItem label='豁免条款代码' {...formLayout}>
                            {
                                getFieldDecorator('name1', {
                                    initialValue: data.modalSource && data.modalSource.name1,
                                    rules: [{ required: true, message: '请填写豁免条款代码' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='豁免条款物质名称' {...formLayout}>
                            {
                                getFieldDecorator('name2', {
                                    initialValue: data.modalSource && data.modalSource.name2,
                                    rules: [{ required: true, message: '请填写豁免条款物质名称' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='CAS.NO' {...formLayout}>
                            {
                                getFieldDecorator('name3', {
                                    initialValue: data.modalSource && data.modalSource.name3,
                                    rules: [{ required: true, message: '请填写CAS.NO' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='限量' {...formLayout}>
                            {
                                getFieldDecorator('name4', {
                                    initialValue: data.modalSource && data.modalSource.name4,
                                    rules: [{ required: true, message: '请填写限量' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='基本单位' {...formLayout}>
                            {
                                getFieldDecorator('name5', {
                                    initialValue: data.modalSource && data.modalSource.name5,
                                    rules: [{ required: true, message: '请选择基本单位' }]
                                })(<ComboList form={form} {...materialCode} name='supplierCode'
                                    field={['supplierName', 'supplierId']}
                                    afterSelect={() => { console.log(111) }} />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='豁免到期日期' {...formLayout}>
                            {
                                getFieldDecorator('name6', {
                                    initialValue: data.modalSource && data.modalSource.name6,
                                    rules: [{ required: true, message: '请填写豁免到期日期' }]
                                })(<DatePicker style={{ width: '100%' }} />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='豁免条款具体内容' {...formLayout}>
                            {
                                getFieldDecorator('name7', {
                                    initialValue: data.modalSource && data.modalSource.name7,
                                    rules: [{ required: true, message: '请填写豁免条款具体内容' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Row>
                </Form>
            </ExtModal>
        </Fragment>
    )

}

export default create()(ExemptionClause)
