import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, DataImport, ComboList } from 'suid';
import { Button, DatePicker, Form, Modal, Row, Input, Select } from 'antd'
import Upload from '../../../compoent/Upload';
import classnames from 'classnames'
import styles from '../index.less'
import moment from 'moment';
import { splitCheckImport } from '../../../../../services/qualitySynergy'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const { confirm } = Modal;
const { create, Item: FormItem } = Form;
const { Option } = Select;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const supplierModal = forwardRef(({ form, dataList, setSelectedSpilt, setSplitDataList, isView, isImport }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible,
        setRowKeys,
        setRows,
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const { getFieldDecorator, validateFields, setFieldsValue } = form;

    const columns = [
        { title: '拆分部位名称', dataIndex: 'splitPartsName', align: 'center' },
        { title: '均质材料名称', dataIndex: 'homogeneousMaterialName', ellipsis: true, align: 'center' },
        { title: '测试机构', dataIndex: 'testOrganization', ellipsis: true, align: 'center', },
        { title: '测试结论', dataIndex: 'reportResult', ellipsis: true, align: 'center', render: (text) => (text === true || text === 'true') ? '通过' : '不通过' },
        { title: '报告编号', dataIndex: 'reportNumber', ellipsis: true, align: 'center', },
        { title: '报告日期', dataIndex: 'reportDate', ellipsis: true, align: 'center', render: (text) => text ? text.slice(0, 10) : ''},
        { title: '有效截止日期 ', dataIndex: 'effectiveEndDate', ellipsis: true, align: 'center', render: (text) => text ? text.slice(0, 10) : ''},
        {
            title: '报告附件', dataIndex: 'documentInfoList', ellipsis: true, align: 'center', render: (text) => {
                return <Upload entityId={text} type="show" />
            }
        },
        { title: '排序', dataIndex: 'name8', ellipsis: true, align: 'center', },
    ];
    const importC = [
        { title: '验证状态', dataIndex: 'importStatus', align: 'center', width: 80, render: text => <span style={{ color: text ? 'black' : 'red' }}>{text ? '成功' : '失败'}</span> },
        { title: '验证信息', dataIndex: 'failInfo', ellipsis: true, align: 'center' },
    ]
    // 删除
    function handleDelete() {
        confirm({
            title: '删除',
            content: '请确认是否删除选中拆分部件',
            onOk: () => {
                let newList = dataList.filter(item => !(selectedRowKeys.includes(item.rowKey)));
                newList = newList.map((item, index) => ({ ...item, rowKey: index, splitPartsLineNumber: index }));
                setSplitDataList(newList);
                tableRef.current.manualSelectedRows();
            }
        })
    }
    // 新增
    function handleAdd() {
        validateFields((errors, values) => {
            if (!errors) {
                console.log('编辑数据', values)
                values.reportDate = moment(values.reportDate).format('YYYY-MM-DD');
                // values.uploadAttachmentIds = values.documentInfoList;
                // values.testReportAttachmentId = values.documentInfoList ? values.documentInfoList.join() : '';
                let newList = [].concat(dataList);
                if (modalType === 'edit') {
                    newList = newList.map(item => {
                        if (item.rowKey === selectedRows[0].rowKey) {
                            return {
                                ...item,
                                ...values
                            }
                        } else {
                            return item;
                        }
                    })
                } else {
                    values.rowKey = dataList.length;
                    values.splitPartsLineNumber = dataList.length;
                    values.voList = [];
                    values.testLogVoList = [];
                    newList.push({ ...values });
                }
                setSplitDataList(newList);
                setVisible(false);
                tableRef.current.manualSelectedRows();
            }
        });
    }
    // 新增/编辑弹框
    function showEditModal(type) {
        setModalType(type);
        setVisible(true);
    }
    const validateItem = (data) => {
        return new Promise((resolve, reject) => {
            splitCheckImport(data).then(res => {
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
        let newList = [].concat(dataList);
        value.forEach((addItem, index) => {
            delete addItem.status;
            delete addItem.statusCode;
            delete addItem.message;
            delete addItem.validate;
            addItem.rowKey = dataList.length + index;
            addItem.splitPartsLineNumber = dataList.length + index;
            addItem.voList = [];
            addItem.testLogVoList = [];
            newList.push(addItem);
        })
        // newList = newList.map((item, index) => ({ ...item, rowKey: index, splitPartsLineNumber: index }));
        setSplitDataList(newList);
        tableRef.current.manualSelectedRows();
    };
    function setEndDate(date) {
        let pickDate = date.format('YYYY-MM-DD');
        let list = pickDate.split('-');
        list[0] = Number(list[0]) + 1;
        let effectiveEndDate = list.join('-');
        setFieldsValue({
            effectiveEndDate
        });
    }
    return <Fragment>
        <div className={styles.macTitle}>拆分部件</div>
        <div className={classnames({
            [styles.mbt]: true,
            [styles.mtb]: true,
            [styles.hidden]: !!isView
        })}>
            <Button type='primary' className={styles.btn} key="add" onClick={() => { showEditModal('add') }}>新增</Button>
            <Button className={styles.btn} key="edit" onClick={() => { showEditModal('edit') }} disabled={!(selectedRowKeys.length === 1)}>编辑</Button>
            <Button className={styles.btn} onClick={() => { handleDelete() }} key="delete" disabled={(selectedRowKeys.length === 0)}>删除</Button>
            <DataImport
                tableProps={{ columns }}
                validateFunc={validateItem}
                importFunc={importFunc}
                ignore={DEVELOPER_ENV}
                validateAll={true}
                key='import'
                templateFileList={[
                    {
                        download: `${DEVELOPER_ENV === 'true' ? '' : '/react-srm-sm-web'}/templates/拆分部件批导模板V1.0.xlsx`,
                        fileName: '拆分部件批导模板V1.0.xlsx',
                        key: 'ExemptionClause',
                    },
                ]}
            />
        </div>
        <ExtTable
            columns={isImport ? importC.concat(columns) : columns}
            bordered
            allowCancelSelect
            showSearch={false}
            checkbox={{ multiSelect: false }}
            ref={tableRef}
            checkbox={true}
            rowKey={(item) => item.rowKey}
            size='small'
            onSelectRow={(rowKeys, rows) => {
                console.log('拆分部件选中', rows);
                setRowKeys(rowKeys);
                setRows(rows);
                setSelectedSpilt(rows.length === 1 ? rows[0] : {});
            }}
            selectedRowKeys={selectedRowKeys}
            dataSource={dataList}
        />
        {visible && <ExtModal
            centered
            destroyOnClose
            maskClosable={false}
            visible={visible}
            onCancel={() => { setVisible(false) }}
            onOk={() => { handleAdd() }}
            title={`${modalType === 'add' ? '新增' : '编辑'}拆分部件`}
        >
            <Form>
                <Row>
                    <FormItem label='拆分部件名称' {...formLayout}>
                        {
                            getFieldDecorator('splitPartsName', {
                                initialValue: modalType === 'edit' ? selectedRows[0].splitPartsName : '',
                                rules: [{ required: true, message: '请填写拆分部件名称' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='均质材料名称' {...formLayout}>
                        {
                            getFieldDecorator('homogeneousMaterialName', {
                                initialValue: modalType === 'edit' ? selectedRows[0].homogeneousMaterialName : '',
                                rules: [{ required: true, message: '请填写均质材料名称' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='测试机构' {...formLayout}>
                        {
                            getFieldDecorator('testOrganization', {
                                initialValue: modalType === 'edit' ? selectedRows[0].testOrganization : '',
                                rules: [{ required: true, message: '请填写测试机构名称' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='测试结论' {...formLayout}>
                        {
                            getFieldDecorator('reportResult', {
                                initialValue: modalType === 'edit' ? selectedRows[0].reportResult : true,
                                rules: [{ required: true, message: '请选择供应商代码' }]
                            })(<Select style={{ width: '100%' }}>
                                <Option value={true}>通过</Option>
                                <Option value={false}>不通过</Option>
                            </Select>)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='报告编号' {...formLayout}>
                        {
                            getFieldDecorator('reportNumber', {
                                initialValue: modalType === 'edit' ? selectedRows[0].reportNumber : '',
                                rules: [{ required: true, message: '请输入报告编号' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='报告日期' {...formLayout}>
                        {
                            getFieldDecorator('reportDate', {
                                initialValue: modalType === 'edit' ? moment(selectedRows[0].reportDate) : null,
                                rules: [{ required: true, message: '请选择报告日期' }]
                            })(<DatePicker style={{ width: '100%' }} onChange={setEndDate} format="YYYY-MM-DD" />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='有效截止日期' {...formLayout}>
                        {
                            getFieldDecorator('effectiveEndDate', {
                                initialValue: modalType === 'edit' && selectedRows[0].effectiveEndDate ? selectedRows[0].effectiveEndDate.slice(0, 10) : '',
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='报告附件' {...formLayout}>
                        {
                            getFieldDecorator('documentInfoList', {
                                rules: [{ required: true, message: '请上传报告附件' }]
                            })(<Upload entityId={modalType === 'edit' ? selectedRows[0].documentInfoList : ''} />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>}
    </Fragment>
})

const editForm = create()(supplierModal)
export default editForm