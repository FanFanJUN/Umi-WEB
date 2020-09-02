import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar, ComboList } from 'suid';
import { Button, DatePicker, Form, Modal, Row, Input } from 'antd'
import { smBaseUrl } from '@/utils/commonUrl';
import { materialCode } from '../../../commonProps'
import styles from '../index.less'
const { confirm } = Modal;
const { create, Item: FormItem } = Form;
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
    const [addVisible, setAddVisible] = useState(false);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const { getFieldDecorator, } = form;
    const tableProps = {
        store: {
            url: `${smBaseUrl}/api/supplierFinanceViewModifyService/findByPage`,
            params: {
            },
            type: 'POST'
        }
    }
    const columns = [
        {
            title: '是否暂停', dataIndex: 'turnNumber', width: 70, align: 'center', render: (text) => {
                return text ? '是' : '否'
            }
        },
        {
            title: '是否发布', dataIndex: 'name1', ellipsis: true, align: 'center', render: (text) => {
                return text ? '是' : '否'
            }
        },
        { title: '供应商代码', dataIndex: 'name2', ellipsis: true, align: 'center', },
        { title: '供应商名称', dataIndex: 'name3', ellipsis: true, align: 'center', },
        { title: '填报截止日期', dataIndex: 'name4', ellipsis: true, align: 'center', },
        { title: '分配日期', dataIndex: 'name5', ellipsis: true, align: 'center', },
        { title: '分配批次 ', dataIndex: 'name6', ellipsis: true, align: 'center', },
        { title: '分配人', dataIndex: 'name7', ellipsis: true, align: 'center', },
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
            content: '请确认是否删除选中供应商',
            onOk: async () => {
                console.log('确定删除')
            }
        })
    }
    // 新增
    function handleAdd() {

    }
    return <Fragment>
        <div className={styles.mbt}>
            <Button type='primary' className={styles.btn} key="add" onClick={() => { setAddVisible(true) }}>新增</Button>
            <Button className={styles.btn} key="edit">编辑填报截止日期</Button>
            <Button className={styles.btn} onClick={handleDelete} key="delete">删除</Button>
            <Button className={styles.btn} key="suspend">暂停/取消暂停</Button>
            <Button className={styles.btn}>保存</Button>
            <Button className={styles.btn}>保存并发布</Button>
            <Button className={styles.btn}>取消发布</Button>
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
            visible={addVisible}
            onCancel={() => { setAddVisible(false) }}
            onOk={() => { handleAdd() }}
            title="新增拆分部件"
        >
            <Form>
                <Row>
                    <FormItem label='拆分部件名称' {...formLayout}>
                        {
                            getFieldDecorator('data1', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='均质材料名称' {...formLayout}>
                        {
                            getFieldDecorator('data2', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='测试机构' {...formLayout}>
                        {
                            getFieldDecorator('data3', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='测试结论' {...formLayout}>
                        {
                            getFieldDecorator('data4', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='报告编号' {...formLayout}>
                        {
                            getFieldDecorator('data5', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='报告日期' {...formLayout}>
                        {
                            getFieldDecorator('data6', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<DatePicker />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='有效截止日期' {...formLayout}>
                        {
                            getFieldDecorator('data7', {
                                initialValue: '',
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='报告附件' {...formLayout}>
                        {
                            getFieldDecorator('data8', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
            </Form>

        </ExtModal>
    </Fragment>
})

const editForm = create()(supplierModal)
export default editForm