import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar, ComboList } from 'suid';
import { Button, Col, Form, Modal, Row, Input, Select, InputNumber } from 'antd'
import { materialCode } from '../../../commonProps';
import { Upload } from '@/components';
import { smBaseUrl } from '@/utils/commonUrl';
import classnames from 'classnames'
import styles from '../index.less'
import moment from 'moment';
const { confirm } = Modal;
const { create, Item: FormItem } = Form;
const { Option } = Select;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const supplierModal = forwardRef(({ form }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const { getFieldDecorator, validateFields } = form;
    const tableProps = {
        store: {
            url: `${smBaseUrl}/api/supplierFinanceViewModifyService/findByPage`,
            params: {
            },
            type: 'POST'
        }
    }
    const columns = [
        { title: '物质代码', dataIndex: 'turnNumber', align: 'center' },
        { title: '物质名称', dataIndex: 'name1', ellipsis: true, align: 'center' },
        { title: 'CAS.NO', dataIndex: 'name2', ellipsis: true, align: 'center', },
        { title: '适用范围', dataIndex: 'name3', ellipsis: true, align: 'center', },
        { title: '含量', dataIndex: 'name4', ellipsis: true, align: 'center', },
        { title: '基本单位', dataIndex: 'name5', ellipsis: true, align: 'center', },
        { title: '符合性 ', dataIndex: 'name6', ellipsis: true, align: 'center', render: (text) => text ? '符合' : '不符合' },
    ];
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 删除
    function handleDelete(v) {
        confirm({
            title: '删除',
            content: '请确认是否删除选中拆分部件',
            onOk: async () => {
                console.log('确定删除')
            }
        })
    }
    // 新增
    function handleAdd() {
        validateFields((errors, values) => {
            if (!errors) {
                console.log(values)
            }
        });
    }
    // 新增/编辑弹框
    function showEditModal(type) {
        setModalType(type)
        setVisible(true)
    }
    return <Fragment>
        <div className={styles.macTitle}>拆分部件</div>
        <div className={classnames(styles.mbt, styles.mtb)}>
            <Button type='primary' className={styles.btn} key="add" onClick={() => { showEditModal('add') }}>新增</Button>
            <Button className={styles.btn} key="edit" onClick={() => { showEditModal('edit') }}>编辑</Button>
            <Button className={styles.btn} onClick={handleDelete} key="delete">删除</Button>
            <Button className={styles.btn} key="import">批量导入</Button>
        </div>
        <ExtTable
            columns={columns}
            bordered
            allowCancelSelect
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            ref={tableRef}
            rowKey={(item) => item.id}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectedRowKeys}
            {...tableProps}
        />
        <ExtModal
            centered
            destroyOnClose
            visible={visible}
            onCancel={() => { setVisible(false) }}
            onOk={() => { handleAdd() }}
            title={`${modalType === 'add' ? '新增' : '编辑'}测试记录表物质`}
        >
            <Form>
                <Row>
                    <FormItem label='物质名称' {...formLayout}>
                        {
                            getFieldDecorator('data1', {
                                initialValue: '',
                                rules: [{ required: true, message: '请填写拆分部件名称' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='CAS.NO' {...formLayout}>
                        {
                            getFieldDecorator('data2', {
                                initialValue: '',
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='适用范围' {...formLayout}>
                        {
                            getFieldDecorator('data3', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择适用范围' }]
                            })(<ComboList form={form} {...materialCode} name='supplierCode'
                                field={['supplierName', 'supplierId']}
                                afterSelect={() => { console.log(111) }} />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='含量' {...formLayout}>
                        {
                            getFieldDecorator('data4', {
                                initialValue: 'pass',
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<Select style={{width: '40%',marginRight:'10px'}}>
                                <Option value="pass">范围值</Option>
                                <Option value="nopass">精确值</Option>
                            </Select>)
                        }
                        {
                            getFieldDecorator('data5', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<InputNumber style={{width: '40%'}} />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='基本单位' {...formLayout}>
                        {
                            getFieldDecorator('data6', {
                                initialValue: '',
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>
    </Fragment>
})

const editForm = create()(supplierModal)
export default editForm