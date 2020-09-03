import React, { Fragment, useState } from 'react';
import { Button, Form, Row, Input, Modal, message, Card, Col, Empty, InputNumber } from 'antd';
import { ExtTable, ExtModal, utils, ComboList } from 'suid';
import { materialCode } from '../../commonProps';
import { AutoSizeLayout} from '../../../../components'
import { getUserName } from '../../../../utils'
import styles from './index.less'
import moment from 'moment'
const { authAction } = utils;
const { create, Item: FormItem } = Form;
const { confirm } = Modal;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const LimitMaterial = ({ form }) => {
    const [data, setData] = useState({
        visible: false,
        modalSource: '',
        isView: false
    })
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRightKeys, setSelectedRightKeys] = useState([]);
    const [selectedRight, setSelectedRight] = useState([]);
    const { getFieldDecorator, validateFields } = form;
    const columns = [
        { title: '环保标准代码', dataIndex: 'name1', width: 200 },
        { title: '环保标准名称', dataIndex: 'name2', ellipsis: true, },
        { title: 'REACH环保符合性声明', dataIndex: 'name3', ellipsis: true, },
        { title: '备注', dataIndex: 'name4', ellipsis: true },
        { title: '排序号', dataIndex: 'name5', ellipsis: true },
        { title: '冻结', dataIndex: 'name6', ellipsis: true },
    ]
    const rightColums = [
        { title: '限用物质代码', dataIndex: 'name1', width: 200 },
        { title: '限用物质名称', dataIndex: 'name2', ellipsis: true, },
        { title: 'CAS.NO', dataIndex: 'name3', ellipsis: true, },
        { title: '限量', dataIndex: 'name4', ellipsis: true },
        { title: '基本单位代码', dataIndex: 'name5', ellipsis: true },
        { title: '均质材质中的含量(%)', dataIndex: 'name6', ellipsis: true },
        { title: '适用范围名称排序号', dataIndex: 'name7', ellipsis: true },
        { title: '冻结', dataIndex: 'name8', ellipsis: true },
        { title: '处理人', dataIndex: 'name9', ellipsis: true },
        { title: '处理时间', dataIndex: 'name10', ellipsis: true },
    ]
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
                onClick={() => buttonClick('freeze')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='4'
            >冻结</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('thaw')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='5'
            >批量导入</Button>)
        }
    </div>
    const buttonClick = (type) => {
        switch (type) {
            case 'add':
                setData((value) => ({ ...value, visible: true, modalSource: '', isView: false }));
                break;
            case 'edit':
                if (checkSlectOne()) {
                    setData((value) => ({
                        ...value,
                        visible: true,
                        modalSource: selectedRow[0],
                        isView: type === 'detail'
                    }));
                }
                break;
            case 'freeze':
                if (checkSlectOne()) {
                    confirm({
                        title: '请确认是否删除选中技术资料类别数据',
                        onOk: () => {
                            console.log('确认删除', selectedRowKeys);
                        },
                    });
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
        if (selectedRight.length === 0) {
            message.warning('请选择一条数据');
            return false;
        } else if (selectedRight.length > 1) {
            message.warning('只能选择一条数据');
            return false;
        }
        return true
    }
    function handleOk() {
        validateFields((errs, values) => {
            if (!errs) {
                console.log(values)
            }
        })
    }
    return <Fragment>
        <Row className={styles.around}>
            <Col span={10}>
                <Card
                    title="环保标准"
                    bordered={false}
                >
                    <ExtTable
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
                        checkbox={{
                            multiSelect: false
                        }}
                        dataSource={[
                            { id: 1, name1: 'xxx', name2: 'sdhfj', name3: true, name4: 'sdf' },
                            { id: 2, name1: 'xxx', name2: 'sdhfj', name3: false, name4: 'sdf' },
                        ]}
                    />
                </Card>
            </Col>
            <Col span={13} className={styles.right}>
                <div className={styles.triangle}></div>
                <Card
                    title="限用物质"
                    bordered={false}
                    className={styles.maxHeight}
                >
                    {
                        selectedRowKeys.length === 0 ? <Empty description="请选择左边的环保标准进行操作" className={styles.mt} /> :
                            <div>
                                <ExtTable
                                    columns={columns}
                                    checkbox={true}
                                    selectedRowKeys={selectedRightKeys}
                                    onSelectRow={(selectedRightKeys, selectedRows) => {
                                        setSelectedRight(selectedRows)
                                        setSelectedRightKeys(selectedRightKeys)
                                    }}
                                    toolBar={{
                                        left: headerLeft
                                    }}
                                    dataSource={[
                                        { id: 1, name1: 'xxx', name2: 'sdhfj', name3: true, name4: 'sdf' },
                                        { id: 2, name1: 'xxx', name2: 'sdhfj', name3: false, name4: 'sdf' },
                                    ]}
                                />
                            </div>

                    }

                </Card>
            </Col>
        </Row>
        <ExtModal
            centered
            destroyOnClose
            visible={data.visible}
            width={1000}
            okText="保存"
            onCancel={() => { setData((value) => ({ ...value, visible: false })) }}
            onOk={() => { handleOk() }}
            title={data.modalSource ? '编辑' : '新增'}
        >
            <Form>
                <Row>
                    <Col span={12}>
                        <FormItem label='限用物质代码' {...formLayout}>
                            {
                                getFieldDecorator('name1', {
                                    initialValue: data.modalSource && data.modalSource.name1,
                                    rules: [{ required: true, message: '请选择限用物质代码' }]
                                })(<ComboList form={form} {...materialCode} name='supplierCode'
                                field={['supplierName', 'supplierId']}
                                afterSelect={() => { console.log(111) }} />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='限用物质名称' {...formLayout}>
                            {
                                getFieldDecorator('name1', {
                                    initialValue: data.modalSource && data.modalSource.name1,
                                })(<Input disabled />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='CAS.NO' {...formLayout}>
                            {
                                getFieldDecorator('name2', {
                                    initialValue: data.modalSource && data.modalSource.name2,
                                })(<Input disabled />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='限量' {...formLayout}>
                            {
                                getFieldDecorator('name1', {
                                    initialValue: data.modalSource && data.modalSource.name1,
                                    rules: [{ required: true, message: '请填写限量' }]
                                })(<InputNumber />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='基本单位' {...formLayout}>
                            {
                                getFieldDecorator('name3', {
                                    initialValue: data.modalSource && data.modalSource.name3,
                                })(<Input disabled />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='均质材质中的含量(%)' {...formLayout}>
                            {
                                getFieldDecorator('name1', {
                                    initialValue: data.modalSource && data.modalSource.name1,
                                    rules: [{ required: true, message: '请填写均质材质中的含量' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='适用范围' {...formLayout}>
                            {
                                getFieldDecorator('name4', {
                                    initialValue: data.modalSource && data.modalSource.name4,
                                    rules: [{ required: true, message: '请选择适用范围' }]
                                })(<ComboList form={form} {...materialCode} name='supplierCode'
                                field={['supplierName', 'supplierId']}
                                afterSelect={() => { console.log(111) }} />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label=' 排序号' {...formLayout}>
                            {
                                getFieldDecorator('name1', {
                                    initialValue: data.modalSource && data.modalSource.name1,
                                })(<InputNumber />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='处理人' {...formLayout}>
                            {
                                getFieldDecorator('name5', {
                                    initialValue: getUserName(),
                                })(<Input disabled />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label=' 处理时间' {...formLayout}>
                            {
                                getFieldDecorator('name1', {
                                    initialValue: moment().format('YYYY-MM-DD hh:mm:ss'),
                                })(<Input disabled />)
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </ExtModal>
    </Fragment>

}
export default create()(LimitMaterial)