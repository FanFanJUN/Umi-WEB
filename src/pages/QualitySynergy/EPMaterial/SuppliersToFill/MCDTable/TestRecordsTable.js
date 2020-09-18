import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, DataImport, ComboList } from 'suid';
import { Button, Col, Form, Modal, Row, Input, Select, InputNumber } from 'antd'
import { limitScopeList, findByIsRecordCheckListTrue } from '../../../commonProps';
import { findByProtectionCodeAndMaterialCodeAndRangeCode } from '../../../../../services/qualitySynergy'
import { smBaseUrl } from '@/utils/commonUrl';
import classnames from 'classnames'
import styles from '../index.less'
import moment from 'moment';
import { testRecordCheckImport } from '../../../../../services/qualitySynergy';
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const { confirm } = Modal;
const { create, Item: FormItem } = Form;
const { Option } = Select;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const supplierModal = forwardRef(({ form, selectedSplitData, handleSplitDataList, environmentalProtectionCode }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue, isView } = form;
    useEffect(() => {
        setDataSource(selectedSplitData.testLogVoList ? selectedSplitData.testLogVoList.map((item, index) => ({ ...item, rowKey: index })) : []);
        if (!selectedSplitData.testLogVoList || selectedSplitData.testLogVoList.length === 0) {
            tableRef.current.manualSelectedRows();
        }
    }, [selectedSplitData])
    const columns = [
        { title: '物质代码', dataIndex: 'materialCode', align: 'center' },
        { title: '物质名称', dataIndex: 'materialName', ellipsis: true, align: 'center' },
        { title: 'CAS.NO', dataIndex: 'casNo', ellipsis: true, align: 'center', },
        { title: '适用范围', dataIndex: 'scopeApplicationName', ellipsis: true, align: 'center', },
        { title: '含量', dataIndex: 'content', ellipsis: true, align: 'center', },
        { title: '基本单位', dataIndex: 'unitName', ellipsis: true, align: 'center', },
        { title: '符合性 ', dataIndex: 'compliance', ellipsis: true, align: 'center', render: (text) => text ? '符合' : '不符合' },
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
                    testLogVoList: newList
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
                    newList.push({ ...values, rowKey: dataSource.length });
                } else {
                    newList = newList.map(item => {
                        return item.rowKey === selectedRows[0].rowKey ? { ...selectedRows[0], ...values } : item
                    })
                }
                setDataSource(newList);
                handleSplitDataList({
                    rowKey: selectedSplitData.rowKey,
                    testLogVoList: newList
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
    async function getUnit(materialCode, scopeApplicationCode) {
        if (!materialCode || !scopeApplicationCode) return;
        const res = await findByProtectionCodeAndMaterialCodeAndRangeCode({
            protectionCode: environmentalProtectionCode,
            materialCode: materialCode,
            rangeCode: scopeApplicationCode
        })
        if (res.statusCode === 200 && res.data) {
            setFieldsValue({
                unitCode: res.data.basicUnitCode,
                unitName: res.data.basicUnitName,
            })
        }
    }
    const validateItem = (data) => {
        return new Promise((resolve, reject) => {
            let sendList = data.map(item => ({ ...item, code: environmentalProtectionCode }))
            testRecordCheckImport(sendList).then(res => {
                const response = res.data.map((item, index) => ({
                    ...item,
                    key: index,
                    validate: item.importStatus,
                    status: item.importStatus ? '数据完整' : '失败',
                    statusCode: item.importStatus ? 'success' : 'error',
                    message: item.importStatus ? '成功' : item.failInfo
                }))
                resolve(response);
            }).catch(err => {
                reject(err)
            })
        })
    };

    const importFunc = (value) => {
        let newList = [].concat(dataSource);
        value.forEach((addItem, index) => {
            delete addItem.status;
            delete addItem.statusCode;
            delete addItem.message;
            delete addItem.validate;
            addItem.rowKey = dataSource.length + index;
            newList.push(addItem);
        })
        newList = newList.map((item, index) => ({ ...item, rowKey: index }));
        setDataSource(newList);
        handleSplitDataList({
            rowKey: selectedSplitData.rowKey,
            testLogVoList: newList
        })
        tableRef.current.manualSelectedRows();
        // setSplitDataList(newList);
        // tableRef.current.manualSelectedRows();
    };
    return <Fragment>
        <div className={styles.macTitle}>测试记录表</div>
        <div className={classnames({
            [styles.mbt]: true,
            [styles.mtb]: true,
            [styles.hidden]: !!isView
        })}>
            <Button type='primary' className={styles.btn} key="add" onClick={() => { showEditModal('add') }}
                disabled={(!selectedSplitData.testLogVoList)}
            >新增</Button>
            <Button className={styles.btn} key="edit" onClick={() => { showEditModal('edit') }}
                disabled={!(selectedRowKeys.length === 1)}
            >编辑</Button>
            <Button className={styles.btn} onClick={handleDelete} key="delete"
                disabled={(selectedRowKeys.length === 0)}
            >删除</Button>
            {selectedSplitData.testLogVoList && <DataImport
                tableProps={{ columns }}
                validateFunc={validateItem}
                importFunc={importFunc}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                validateAll={true}
                key='import'
                templateFileList={[
                    {
                        download: `${DEVELOPER_ENV === 'true' ? '' : '/react-srm-sm-web'}/templates/测试记录表批导模板V1.0.xlsx`,
                        fileName: '测试记录表批导模板V1.0.xlsx',
                        key: 'ExemptionClause',
                    },
                ]}
            />}
        </div>
        <ExtTable
            columns={columns}
            bordered
            allowCancelSelect
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            ref={tableRef}
            checkbox={true}
            rowKey={(item) => item.rowKey}
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
            title={`${modalType === 'add' ? '新增' : '编辑'}测试记录表物质`}
        >
            <Form>
                <Row>
                    <FormItem label='物质名称' {...formLayout}>
                        {
                            getFieldDecorator('materialId', { initialValue: modalType === 'edit' ? selectedRows[0].materialId : '' }),
                            getFieldDecorator('materialCode', { initialValue: modalType === 'edit' ? selectedRows[0].materialCode : '' }),
                            getFieldDecorator('materialName', {
                                initialValue: modalType === 'edit' ? selectedRows[0].materialName : '',
                                rules: [{ required: true, message: '请填写拆分部件名称' }]
                            })(<ComboList form={form}
                                {...findByIsRecordCheckListTrue}
                                name='materialName'
                                field={['materialId', 'materialCode', 'casNo']}
                                afterSelect={(item) => {
                                    let scopeApplicationCode = getFieldValue('scopeApplicationCode');;
                                    getUnit(item.limitMaterialCode, scopeApplicationCode)
                                }}
                            />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='CAS.NO' {...formLayout}>
                        {
                            getFieldDecorator('casNo', {
                                initialValue: modalType === 'edit' ? selectedRows[0].casNo : '',
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='适用范围' {...formLayout}>
                        {
                            getFieldDecorator('scopeApplicationId', { initialValue: modalType === 'edit' ? selectedRows[0].scopeApplicationId : '' }),
                            getFieldDecorator('scopeApplicationCode', { initialValue: modalType === 'edit' ? selectedRows[0].scopeApplicationCode : '' }),
                            getFieldDecorator('scopeApplicationName', {
                                initialValue: modalType === 'edit' ? selectedRows[0].scopeApplicationName : '',
                                rules: [{ required: true, message: '请选择适用范围' }]
                            })(<ComboList form={form}
                                {...limitScopeList}
                                name='scopeApplicationName'
                                field={['scopeApplicationId', 'scopeApplicationCode']}
                                afterSelect={(item) => {
                                    let materialCode = getFieldValue('materialCode');;
                                    getUnit(materialCode, item.scopeCode)
                                }}
                            />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='含量' {...formLayout}>
                        {
                            getFieldDecorator('contentType', {
                                initialValue: modalType === 'edit' ? selectedRows[0].contentType : '',
                                rules: [{ required: true, message: '请选择含量类型' }]
                            })(<Select style={{ width: '40%', marginRight: '10px' }}>
                                <Option value="RANGE_VALUE">范围值</Option>
                                <Option value="DEFINITE_VALUE">精确值</Option>
                            </Select>)
                        }
                        {
                            getFieldDecorator('content', {
                                initialValue: modalType === 'edit' ? selectedRows[0].content : '',
                                rules: [{ required: true, message: '请输入' }]
                            })(<InputNumber style={{ width: '40%' }} />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='基本单位' {...formLayout}>
                        {
                            getFieldDecorator('unitCode', { initialValue: modalType === 'edit' ? selectedRows[0].unitCode : '' }),
                            getFieldDecorator('unitName', {
                                initialValue: modalType === 'edit' ? selectedRows[0].unitCode : '',
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>}
    </Fragment>
})

const editForm = create()(supplierModal)
export default editForm