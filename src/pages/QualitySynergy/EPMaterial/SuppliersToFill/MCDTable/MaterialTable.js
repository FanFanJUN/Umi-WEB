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
const supplierModal = forwardRef(({ form, selectedSplitData, handleSplitDataList }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    useEffect(() => {
        console.log('进入这里执行', selectedSplitData)
        setDataSource(selectedSplitData.voList ? selectedSplitData.voList.map((item, index) => ({ ...item, rowKey: index})) : []);
        if (!selectedSplitData.voList || selectedSplitData.voList.length === 0) {
            tableRef.current.manualSelectedRows();
        }
    }, [selectedSplitData])
    const columns = [
        { title: '物质代码', dataIndex: 'substanceCode', align: 'center' },
        { title: '物质名称', dataIndex: 'substanceName', ellipsis: true, align: 'center' },
        { title: '是否限用物质', dataIndex: 'isRestricted', ellipsis: true, align: 'center', render: (text) => { return text == 'true' ? '是' : '否' } },
        { title: 'CAS.NO', dataIndex: 'casNo', ellipsis: true, align: 'center', },
        { title: '适用范围', dataIndex: 'practicalRangeName', ellipsis: true, align: 'center', },
        { title: '物质重量(mg)', dataIndex: 'scopeApplication', ellipsis: true, align: 'center', },
        { title: '均质材料中的含量(%) ', dataIndex: 'materialWeight', ellipsis: true, align: 'center', },
        { title: '豁免条款', dataIndex: 'exemptionClause', ellipsis: true, align: 'center' },
        { title: '符合性', dataIndex: 'compliance', ellipsis: true, align: 'center', },
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
            onOk: () => {
                let newList = dataSource.filter(item => !(selectedRowKeys.includes(item.rowKey)));
                newList = newList.map((item, index) => ({ ...item, rowKey: index }));
                handleSplitDataList({
                    rowKey: selectedSplitData.rowKey,
                    voList: newList
                })
                tableRef.current.manualSelectedRows();
            }
        })
    }
    // 新增
    function handleAdd() {
        validateFields((errors, values) => {
            if (!errors) {
                console.log(values)
                let newList = [].concat(dataSource);
                if (modalType === 'add') {
                    newList.push({ ...values, rowKey: dataSource.length});
                } else {
                    newList = newList.map(item => {
                        return item.rowKey === selectedRows[0].rowKey ? { ...selectedRows[0], ...values } : item
                    })
                }
                setDataSource(newList);
                handleSplitDataList({
                    rowKey: selectedSplitData.rowKey,
                    voList: newList
                })
                setVisible(false);
                tableRef.current.manualSelectedRows();
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
            <Button type='primary' className={styles.btn} key="add" onClick={() => { showEditModal('add') }}
                disabled={(!selectedSplitData.testLogVoList)}>新增</Button>
            <Button className={styles.btn} key="edit" onClick={() => { showEditModal('edit') }}
                disabled={!(selectedRowKeys.length === 1)}>编辑</Button>
            <Button className={styles.btn} onClick={handleDelete} key="delete"
                disabled={(selectedRowKeys.length === 0)}>删除</Button>
            <Button className={styles.btn} key="import"
                disabled={(!selectedSplitData.testLogVoList)}>批量导入</Button>
        </div>
        <ExtTable
            columns={columns}
            bordered
            allowCancelSelect
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            ref={tableRef}
            rowKey={(item) => item.rowKey}
            checkbox={true}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectedRowKeys}
            dataSource={dataSource}
        />
        {visible && <ExtModal
            centered
            destroyOnClose
            visible={visible}
            onCancel={() => { setVisible(false) }}
            onOk={() => { handleAdd() }}
            title={`${modalType === 'add' ? '新增' : '编辑'}材料成分表物质`}
        >
            <Form>
                <Row>
                    <FormItem label='物质代码' {...formLayout}>
                        {
                            getFieldDecorator('substanceId', {initialValue: modalType === 'edit' ? selectedRows[0].substanceId : ''}),
                            getFieldDecorator('substanceName', {initialValue: modalType === 'edit' ? selectedRows[0].substanceName : ''}),
                            (!getFieldValue('isRestricted') && modalType === 'add') ? <Input disabled={true} placeholder="请先选择是否为限用物质" />
                                : getFieldValue('isRestricted') === '0' ? getFieldDecorator('substanceCode', {
                                    initialValue: modalType === 'edit' ? selectedRows[0].substanceCode : '',
                                    rules: [{ required: true, message: '请填写物质名称' }]
                                })(<Input placeholder="请输入" />)
                                    : getFieldDecorator('substanceCode', {
                                        initialValue: modalType === 'edit' ? selectedRows[0].substanceCode : '',
                                        rules: [{ required: true, message: '请选择物质名称' }]
                                    })(<ComboList form={form}
                                        {...limitMaterialList}
                                        name='substanceCode'
                                        field={['substanceId', 'substanceName', 'casNo']}
                                        placeholder="请选择"
                                    />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='是否限用物质' {...formLayout}>
                        {
                            getFieldDecorator('isRestricted', {
                                initialValue: modalType === 'edit' ? selectedRows[0].isRestricted : '',
                                rules: [{ required: true, message: '请选择' }]
                            })(<Select style={{ width: '100%' }}>
                                <Option value="true">是</Option>
                                <Option value="false">否</Option>
                            </Select>)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='CAS.NO' {...formLayout}>
                        {
                            getFieldDecorator('casNo', {
                                initialValue: modalType === 'edit' ? selectedRows[0].casNo : '',
                            })(<Input disabled={getFieldValue('isRestricted') === '1'} />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='适用范围' {...formLayout}>
                        {
                            getFieldDecorator('practicalRangeId', {initialValue: modalType === 'edit' ? selectedRows[0].practicalRangeId : ''}),
                            getFieldDecorator('practicalRangeCode', {initialValue: modalType === 'edit' ? selectedRows[0].practicalRangeCode : ''}),
                            getFieldDecorator('practicalRangeName', {
                                initialValue: modalType === 'edit' ? selectedRows[0].practicalRangeName : '',
                                rules: [{ required: true, message: '请选择适用范围' }]
                            })(<ComboList
                                form={form}
                                {...limitScopeList}
                                name='practicalRangeName'
                                field={['practicalRangeId', 'practicalRangeCode']} />)
                        }
                    </FormItem>
                </Row>

                <Row>
                    <FormItem label='物质重量(mg)' {...formLayout}>
                        {
                            getFieldDecorator('scopeApplication', {
                                initialValue: modalType === 'edit' ? selectedRows[0].scopeApplication : '',
                                rules: [{ required: true, message: '请填入物质重量(mg)' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='均质材料中的含量(%)' {...formLayout}>
                        {
                            getFieldDecorator('materialWeight', {
                                initialValue: modalType === 'edit' ? selectedRows[0].materialWeight : '',
                                rules: [{ required: true, message: '请填入均质材料中的含量' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='豁免条款' {...formLayout}>
                        {
                            getFieldDecorator('exemptionClauseId', {initialValue: modalType === 'edit' ? selectedRows[0].exemptionClauseId : '',}),
                            getFieldDecorator('exemptionClauseCode', {initialValue: modalType === 'edit' ? selectedRows[0].exemptionClauseCode : '',}),
                            getFieldDecorator('exemptionClause', {
                                initialValue: modalType === 'edit' ? selectedRows[0].exemptionClause : '',
                            })(<ComboList
                                form={form}
                                {...exemptionClauseDataList}
                                name='exemptionClause'
                                field={['exemptionClauseId', 'exemptionClauseCode']}
                            />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>}
    </Fragment>
})

const editForm = create()(supplierModal)
export default editForm
