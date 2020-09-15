import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar, ComboList } from 'suid';
import { Button, DatePicker, Form, Modal, Row, Input, Select } from 'antd';
import { limitMaterialList, limitScopeList, exemptionClauseDataList } from '../../../commonProps';
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
const supplierModal = forwardRef(({ form, selectedSplitData }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const { getFieldDecorator, validateFields, getFieldValue } = form;

    const columns = [
        { title: '物质代码', dataIndex: 'turnNumber', align: 'center' },
        { title: '物质名称', dataIndex: 'name1', ellipsis: true, align: 'center' },
        { title: '是否限用物质', dataIndex: 'name2', ellipsis: true, align: 'center', render: (text) => { return text ? '是' : '否' } },
        { title: 'CAS.NO', dataIndex: 'name3', ellipsis: true, align: 'center', },
        { title: '适用范围', dataIndex: 'name4', ellipsis: true, align: 'center', },
        { title: '物质重量(mg)', dataIndex: 'name5', ellipsis: true, align: 'center', },
        { title: '均质材料中的含量(%) ', dataIndex: 'name6', ellipsis: true, align: 'center', },
        { title: '豁免条款', dataIndex: 'name7', ellipsis: true, align: 'center' },
        { title: '符合性', dataIndex: 'name8', ellipsis: true, align: 'center', },
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
        <div className={styles.macTitle}>材料成分表</div>
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
            dataSource={selectedSplitData.voList}
        />
        <ExtModal
            centered
            destroyOnClose
            visible={visible}
            onCancel={() => { setVisible(false) }}
            onOk={() => { handleAdd() }}
            title={`${modalType === 'add' ? '新增' : '编辑'}材料成分表物质`}
        >
            <Form>
                <Row>
                    <FormItem label='物质名称' {...formLayout}>
                        {!getFieldValue('isRestricted') ? <Input disabled={true} placeholder="请先选择是否为限用物质" />
                            : getFieldValue('isRestricted') === '0' ? getFieldDecorator('substanceName', {
                                initialValue: '',
                                rules: [{ required: true, message: '请填写物质名称' }]
                            })(<Input placeholder="请输入" />)
                                : getFieldDecorator('substanceName', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请选择物质名称' }]
                                })(<ComboList form={form}
                                    {...limitMaterialList}
                                    name='substanceName'
                                    // field={['supplierName', 'supplierId']}
                                    placeholder="请选择"
                                />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='是否限用物质' {...formLayout}>
                        {
                            getFieldDecorator('isRestricted', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择' }]
                            })(<Select style={{ width: '100%' }}>
                                <Option value="1">是</Option>
                                <Option value="0">否</Option>
                            </Select>)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='CAS.NO' {...formLayout}>
                        {
                            getFieldDecorator('casNo', {
                                initialValue: '',
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='适用范围' {...formLayout}>
                        {
                            getFieldDecorator('practicalRangeId'),
                            getFieldDecorator('practicalRangeCode'),
                            getFieldDecorator('practicalRangeName', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择适用范围' }]
                            })(<ComboList
                                form={form}
                                {...limitScopeList}
                                name='supplierCode'
                                field={['practicalRangeId', 'practicalRangeCode']} />)
                        }
                    </FormItem>
                </Row>

                <Row>
                    <FormItem label='物质重量(mg)' {...formLayout}>
                        {
                            getFieldDecorator('scopeApplication', {
                                initialValue: '',
                                rules: [{ required: true, message: '请填入物质重量(mg)' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='均质材料中的含量(%)' {...formLayout}>
                        {
                            getFieldDecorator('materialWeight', {
                                initialValue: '',
                                rules: [{ required: true, message: '请填入均质材料中的含量' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='豁免条款' {...formLayout}>
                        {
                            getFieldDecorator('exemptionClauseId'),
                            getFieldDecorator('exemptionClauseCode'),
                            getFieldDecorator('exemptionClause', {
                                initialValue: '',
                            })(<ComboList
                                form={form}
                                {...exemptionClauseDataList}
                                name='supplierCode'
                                field={['exemptionClauseId', 'exemptionClauseCode']}
                            />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>
    </Fragment>
})

const editForm = create()(supplierModal)
export default editForm
