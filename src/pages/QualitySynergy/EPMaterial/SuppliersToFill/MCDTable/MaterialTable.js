import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, DataImport, ComboList } from 'suid';
import { Button, InputNumber, Form, Modal, Row, Input, Select, message } from 'antd';
import { limitMaterialList, limitScopeList, exemptionClauseDataList } from '../../../commonProps';
import { materialCompositionVerification, findByProtectionCodeAndMaterialCodeAndRangeCode } from '../../../../../services/qualitySynergy';
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
const supplierModal = forwardRef(({ form, selectedSplitData, handleSplitDataList, isView, environmentalProtectionCode, isImport }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = form;
    useEffect(() => {
        // console.log('进入这里执行', selectedSplitData)
        setDataSource(selectedSplitData.voList ? selectedSplitData.voList.map((item, index) => ({ ...item, rowKey: index })) : []);
        if (!selectedSplitData.voList || selectedSplitData.voList.length === 0) {
            tableRef.current.manualSelectedRows();
        }
    }, [selectedSplitData]);
    // 解决编辑状态下-是否为限用物质控制物料输入的bug
    useEffect(() => {
        if (visible) {
            if (modalType === 'edit') {
                setFieldsValue({
                    isRestricted: selectedRows[0].isRestricted
                })
            } else {
                setFieldsValue({
                    isRestricted: undefined
                })
            }
        }
    }, [visible])
    const columns = [
        { title: '物质代码', dataIndex: 'substanceCode', align: 'center' },
        { title: '物质名称', dataIndex: 'substanceName', ellipsis: true, align: 'center' },
        { title: '是否限用物质', dataIndex: 'isRestricted', ellipsis: true, align: 'center', render: (text) => { return (text===true||text==='true') ? '是' : '否' } },
        { title: 'CAS.NO', dataIndex: 'casNo', ellipsis: true, align: 'center', },
        { title: '适用范围代码', dataIndex: 'practicalRangeCode', ellipsis: true, align: 'center', },
        { title: '适用范围名称', dataIndex: 'practicalRangeName', ellipsis: true, align: 'center', },
        { title: '物质重量(mg)', dataIndex: 'scopeApplication', ellipsis: true, align: 'center', },
        { title: '均质材料中的含量(%) ', dataIndex: 'materialWeight', ellipsis: true, align: 'center', },
        { title: '豁免条款', dataIndex: 'exemptionClauseCode', ellipsis: true, align: 'center' },
        { title: '基本单位', dataIndex: 'unitName', ellipsis: true, align: 'center', },
        { title: '符合性', dataIndex: 'compliance', ellipsis: true, align: 'center', render: (text) => text === 'FIT' ? '符合' : text === 'NOTFIT' ? '不符合' : '' },
    ];
    const importC = [
        { title: '验证状态', dataIndex: 'importStatus', align: 'center', width: 80, render: text => <span style={{ color: text ? 'black' : 'red' }}>{text ? '成功' : '失败'}</span> },
        { title: '验证信息', dataIndex: 'failInfo', ellipsis: true, align: 'center' },
    ]
    async function getUnit(materialCode, scopeApplicationCode) {
        if (!materialCode || !scopeApplicationCode) return;
        const res = await findByProtectionCodeAndMaterialCodeAndRangeCode({
            protectionCode: environmentalProtectionCode,
            materialCode: materialCode,
            rangeCode: scopeApplicationCode
        })
        if (res.statusCode === 200 && res.data && res.data.basicUnitCode) {
            console.log(1, res)
            setFieldsValue({
                unitCode: res.data.basicUnitCode,
                unitName: res.data.basicUnitName,
            })
        } else {
            setFieldsValue({ unitCode: '', unitName: '', })
            message.warning('选中物质和适用范围无法带出基本单位，请先联系管理员维护数据！')
        }
    }
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
                setDataSource(newList);
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
                    newList.push({ ...values, rowKey: dataSource.length });
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
    const validateItem = (data) => {
        return new Promise((resolve, reject) => {
            materialCompositionVerification(data).then(res => {
                if (res.success) {
                    let response = res.data.map((item, index) => ({
                        ...item,
                        key: index,
                        validate: item.importStatus,
                        status: item.importStatus ? '数据完整' : '失败',
                        statusCode: item.importStatus ? 'success' : 'error',
                        message: item.importStatus ? '成功' : item.failInfo,
                    }));
                    console.log(response)
                    resolve(response);
                } else {
                    message.error(res.message);
                }
                console.log(res);
            }).catch(err => {
                reject(err);
            });
        });
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
        // newList = newList.map((item, index) => ({ ...item, rowKey: index }))
        setDataSource(newList)
        handleSplitDataList({
            rowKey: selectedSplitData.rowKey,
            voList: newList,
        });
        tableRef.current.manualSelectedRows();
    };
    // console.
    return <Fragment>
        <div className={styles.macTitle}>材料成分表</div>
        <div className={classnames({
            [styles.mbt]: true,
            [styles.mtb]: true,
            [styles.hidden]: !!isView
        })}>
            <Button type='primary' className={styles.btn} key="add" onClick={() => { showEditModal('add') }}
                disabled={(!selectedSplitData.testLogVoList)}>新增</Button>
            <Button className={styles.btn} key="edit" onClick={() => { showEditModal('edit') }}
                disabled={!(selectedRowKeys.length === 1)}>编辑</Button>
            <Button className={styles.btn} onClick={handleDelete} key="delete"
                disabled={(selectedRowKeys.length === 0)}>删除</Button>
            {selectedSplitData.testLogVoList && <DataImport
                tableProps={{ columns }}
                validateAll={true}
                validateFunc={validateItem}
                importFunc={importFunc}
                disabled={(!selectedSplitData.testLogVoList)}
                templateFileList={[
                    {
                        download: `${(process.env.NODE_ENV === 'development') ? '/' : '/react-srm-sm-web/'}templates/材料成分表批导模板V2.0.xlsx`,
                        fileName: '材料成分表批导模板V2.0.xlsx',
                        key: 'MaterialComposition',
                    },
                ]}
            />}
        </div>
        <ExtTable
            columns={isImport ? importC.concat(columns) :columns}
            bordered
            allowCancelSelect
            showSearch={false}
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
            maskClosable={false}
            width="600px"
            onCancel={() => { form.resetFields(); setVisible(false); }}
            onOk={() => { handleAdd() }}
            title={`${modalType === 'add' ? '新增' : '编辑'}材料成分表物质`}
        >
            <Form>
                <Row>
                    <FormItem label='是否限用物质' {...formLayout}>
                        {
                            getFieldDecorator('isRestricted', {
                                initialValue: modalType === 'edit' ? selectedRows[0].isRestricted : '',
                                rules: [{ required: true, message: '请选择' }]
                            })(<Select style={{ width: '100%' }} onChange={(item) => {
                                if (item === false) {
                                    setFieldsValue({ substanceCode: '', substanceId: '', substanceName: '', casNo: '', unitCode: '', unitName: '' })
                                }
                            }}>
                                <Option value={true}>是</Option>
                                <Option value={false}>否</Option>
                            </Select>)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label={getFieldValue('isRestricted') ? '物质代码' : '物质名称'} {...formLayout}>
                        {
                            getFieldDecorator('substanceId', { initialValue: modalType === 'edit' ? selectedRows[0].substanceId : '' }),
                            getFieldDecorator('substanceName', { initialValue: modalType === 'edit' ? selectedRows[0].substanceName : '' }),
                            (getFieldValue('isRestricted') === undefined && modalType === 'add') ? <Input disabled={true} placeholder="请先选择是否为限用物质" />
                                : getFieldValue('isRestricted') ? getFieldDecorator('substanceCode', {
                                    initialValue: modalType === 'edit' ? selectedRows[0].substanceCode : '',
                                    rules: [{ required: true, message: '请选择物质名称' }]
                                })(<ComboList form={form}
                                    {...limitMaterialList}
                                    name='substanceCode'
                                    field={['substanceId', 'substanceName', 'casNo']}
                                    afterSelect={(item) => {
                                        let practicalRangeCode = getFieldValue('practicalRangeCode');
                                        getUnit(item.limitMaterialCode, practicalRangeCode);
                                        setFieldsValue({ practicalRangeId: '', practicalRangeCode: '', practicalRangeName: '' })
                                    }}
                                />) : getFieldDecorator('substanceName', {
                                    initialValue: modalType === 'edit' ? selectedRows[0].substanceName : '',
                                    rules: [{ required: true, message: '请填写物质名称' }]
                                })(<Input placeholder="请输入" />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='CAS.NO' {...formLayout}>
                        {
                            getFieldDecorator('casNo', {
                                initialValue: modalType === 'edit' ? selectedRows[0].casNo : '',
                            })(<Input disabled={getFieldValue('isRestricted') === true} />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='适用范围' {...formLayout}>
                        {
                            getFieldDecorator('practicalRangeId', { initialValue: modalType === 'edit' ? selectedRows[0].practicalRangeId : '' }),
                            getFieldDecorator('practicalRangeCode', { initialValue: modalType === 'edit' ? selectedRows[0].practicalRangeCode : '' }),
                            getFieldDecorator('practicalRangeName', {
                                initialValue: modalType === 'edit' ? selectedRows[0].practicalRangeName : '',
                                rules: [{ required: true, message: '请选择适用范围' }]
                            })(<ComboList
                                form={form}
                                {...limitScopeList}
                                name='practicalRangeName'
                                field={['practicalRangeId', 'practicalRangeCode']}
                                afterSelect={(item) => {
                                    let substanceCode = getFieldValue('substanceCode');;
                                    getUnit(substanceCode, item.scopeCode)
                                }}
                            />)
                        }
                    </FormItem>
                </Row>

                <Row>
                    <FormItem label='物质重量(mg)' {...formLayout}>
                        {
                            getFieldDecorator('scopeApplication', {
                                initialValue: modalType === 'edit' ? selectedRows[0].scopeApplication : '',
                                rules: [{ required: true, message: '请填入物质重量' }]
                            })(<InputNumber style={{ width: '100%' }} min={0} onBlur={() => {
                                if (getFieldValue('scopeApplication') === 0) {
                                    setFieldsValue({ scopeApplication: '' })
                                }
                            }} />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='均质材料中的含量(%)' {...formLayout}>
                        {
                            getFieldDecorator('materialWeight', {
                                initialValue: modalType === 'edit' ? selectedRows[0].materialWeight : '',
                                rules: [{ required: true, message: '请填入均质材料中的含量' }]
                            })(<InputNumber style={{ width: '100%' }} min={0} onBlur={() => {
                                if (getFieldValue('materialWeight') === 0) {
                                    setFieldsValue({ materialWeight: '' })
                                }
                            }} />)
                        }
                    </FormItem>
                </Row>
                {!(getFieldValue('isRestricted') === false) && <Row>
                    <FormItem label='豁免条款' {...formLayout}>
                        {
                            getFieldDecorator('exemptionClauseId', { initialValue: modalType === 'edit' ? selectedRows[0].exemptionClauseId : '', }),
                            getFieldDecorator('exemptionClauseCode', { initialValue: modalType === 'edit' ? selectedRows[0].exemptionClauseCode : '', }),
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
                </Row>}
                <Row>
                    <FormItem label='基本单位' {...formLayout}>
                        {
                            getFieldDecorator('unitCode', { initialValue: modalType === 'edit' ? selectedRows[0].unitCode : '' }),
                            getFieldDecorator('unitName', {
                                initialValue: modalType === 'edit' ? selectedRows[0].unitName : '',
                                rules: [{ required: (getFieldValue('isRestricted') === true), message: '基本单位不能为空' }]
                            })(<Input disabled={getFieldValue('isRestricted') === true} />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>}
    </Fragment>
})

const editForm = create()(supplierModal)
export default editForm
