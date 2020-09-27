
import React, { Fragment, useState, useRef } from 'react';
import { Button, Form, Row, Input, Modal, message, DatePicker, InputNumber, Select } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../../utils/commonUrl';
import { DataImport, ExtTable, ExtModal, utils, AuthAction } from 'suid';
import { AutoSizeLayout } from '../../../../components'
import { BasicUnitList } from '../../../../services/qualitySynergy';
import moment from 'moment'
import {
    exemptionClauseDataInsert,
    exemptionClauseDataDelete,
    JudgeTheListOfExemptionClause,
    SaveTheListOfExemptionClause,
    exemptionClauseDataFrozen
} from '../../../../services/qualitySynergy'
const { authAction } = utils;

const { create, Item: FormItem } = Form;
const { confirm } = Modal;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const ExemptionClause = (props) => {
    const tableRef = useRef(null)
    const [data, setData] = useState({
        visible: false,
        modalSource: '',
        isView: false
    })
    const { form } = props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    const columns = [
        { title: '豁免条款代码', dataIndex: 'exemptionClauseCode', width: 120 },
        { title: '豁免条款物质名称', dataIndex: 'exemptionClauseMaterialName', ellipsis: true, width: 140 },
        { title: 'CAS.NO', dataIndex: 'casNo', ellipsis: true, },
        { title: '限量(ppm)', dataIndex: 'ppmValue', ellipsis: true },
        { title: '限量(%)', dataIndex: 'limitNumber', ellipsis: true },
        {
            title: '比较标识', dataIndex: 'limitNumberMaxSign', ellipsis: true, render: (text) => {
                switch (text) {
                    case 'true':
                    case true:
                        return '最高值';
                    case 'false':
                    case false:
                        return '最低值';
                    default:
                        return '';
                }
            }
        },
        { title: '豁免到期日期', dataIndex: 'exemptionExpireDate', ellipsis: true, width: 180, render: (text) => text ? text.slice(0, 10) : '' },
        { title: '豁免条款具体内容', dataIndex: 'exemptionContent', ellipsis: true, width: 140 },
        { title: '排序号', dataIndex: 'orderNo', ellipsis: true, width: 140 },
        { title: '冻结', dataIndex: 'frozen', ellipsis: true, width: 140, render: (text)=>text?'已冻结':'未冻结'},
    ]
    // 检查传入数据的冻结情况，全冻结返回thaw，全未冻结返回freeze
    const checkFreeze = (dataList) => {
        if (!dataList || dataList.length === 0) return false;
        return dataList.every((item) => item.frozen) ? 'thaw' : dataList.every((item) => !item.frozen) ? 'freeze' : false
    }
    const buttonClick = (type) => {
        console.log('当前选中', selectedRow, selectedRowKeys)
        switch (type) {
            case 'add':
                setData((value) => ({ ...value, visible: true, modalSource: '', isView: false }));
                refresh();
                break;
            case 'edit':
            case 'detail':
                setData((value) => ({
                    ...value,
                    visible: true,
                    modalSource: selectedRow[selectedRow.length - 1],
                    isView: type === 'detail'
                }));
                break;
            case 'freeze':
                confirm({
                    title: `请确认是否${checkFreeze(selectedRow) === 'thaw' ? '解冻' : '冻结'}豁免条款数据`,
                    onOk: async () => {
                        const parmas = selectedRowKeys.join();
                        const res = await exemptionClauseDataFrozen({
                            ids: parmas,
                            operation: checkFreeze(selectedRow) === 'freeze'
                        });
                        if (res.success) {
                            message.success('操作成功');
                            tableRef.current.manualSelectedRows();
                            tableRef.current.remoteDataRefresh();
                        } else {
                            message.error(res.message);
                        }
                    },
                });
                break;
            case 'delete':
                confirm({
                    title: '请确认是否删除选中豁免条款数据',
                    onOk: async () => {
                        const parmas = selectedRowKeys.join();
                        const res = await exemptionClauseDataDelete({ ids: parmas });
                        if (res.success) {
                            message.success('删除成功');
                            refresh();
                        } else {
                            message.error(res.message)
                        }
                    },
                });
                break;
        }
    }
    const validateItem = (data) => {
        return new Promise((resolve, reject) => {
            const dataList = data.map(item => {
                // 避免限量存在%，并给两位小数
                if (item.limitNumber) {
                    if (item.limitNumber.toString().indexOf('%') !== -1) {
                        item.limitNumber = item.limitNumber.split('%')[0];
                    }
                    if (item.ppmValue.toString().indexOf('%') !== -1) {
                        item.ppmValue = item.ppmValue.split('%')[0];
                    }
                    item.limitNumber = Number(item.limitNumber).toFixed(2)
                } else {
                    delete item.limitNumber;
                    delete item.limitNumberMaxSign;
                }
                return item;
            })
            JudgeTheListOfExemptionClause(dataList).then(res => {
                const response = res.data.map((item, index) => ({
                    ...item,
                    key: index,
                    validate: item.importResult,
                    status: item.importResult ? '数据完整' : '失败',
                    statusCode: item.importResult ? 'success' : 'error',
                    message: item.importResult ? '成功' : item.importResultInfo
                }))
                resolve(response);
            }).catch(err => {
                reject(err)
            })
        })
    };

    const importFunc = (value) => {
        SaveTheListOfExemptionClause(value).then(res => {
            if (res.success) {
                message.success('导入成功');
                refresh();
            } else {
                message.error(res.message)
            }
        });
    };
    const headerLeft = <div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
        {
            authAction(<Button
                type='primary'
                onClick={() => buttonClick('add')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_EC_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRowKeys.length !== 1}
                key='QUALITYSYNERGY_EC_EDIT'
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRowKeys.length === 0}
                key='QUALITYSYNERGY_EC_DELETE'
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('freeze')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={checkFreeze(selectedRow) === false}
                key='QUALITYSYNERGY_EC_DETAIL'
            >{checkFreeze(selectedRow) === 'thaw' ? '解冻' : '冻结'}</Button>)
        }
        {
            authAction(<DataImport
                tableProps={{ columns }}
                validateFunc={validateItem}
                importFunc={importFunc}
                ignore={DEVELOPER_ENV}
                validateAll={true}
                key='QUALITYSYNERGY_EC_IMPORT'
                templateFileList={[
                    {
                        download: `${DEVELOPER_ENV === 'true' ? '' : '/react-srm-sm-web'}/templates/主数据-豁免条款-批导模板.xlsx`,
                        fileName: '主数据-豁免条款-批导模板.xlsx',
                        key: 'ExemptionClause',
                    },
                ]}
            />)
        }
    </div>
    // 编辑/新增
    const handleOk = async () => {
        if (data.isView) {
            setData((value) => ({ ...value, visible: false, modalSource: '' }))
        } else {
            validateFields(async (errs, values) => {
                if (!errs) {
                    values.exemptionExpireDate = moment(values.exemptionExpireDate).format('YYYY-MM-DD');
                    if (data.modalSource) {
                        values = { ...data.modalSource, ...values }
                    }
                    if (!values.limitNumber) {
                        delete values.limitNumber;
                        delete values.limitNumberMaxSign;
                    }
                    const res = await exemptionClauseDataInsert(values)
                    if (res.success) {
                        message.success('操作成功');
                        refresh();
                        setData((value) => ({ ...value, visible: false, modalSource: '' }))
                    } else {
                        message.error(res.message)
                    }
                }
            })
        }

    }
    function refresh() {
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    }

    return (
        <Fragment>
            <AutoSizeLayout>
                {(h) => <ExtTable
                    rowKey={(v) => v.id}
                    columns={columns}
                    store={{
                        url: `${baseUrl}/exemptionClauseData/findByPage`,
                        type: 'POST',
                        params: {
                            quickSearchProperties: []
                        }
                    }}
                    height={h}
                    ref={tableRef}
                    checkbox={true}
                    remotePaging={true}
                    allowCancelSelect={true}
                    searchPlaceHolder="输入搜索项"
                    selectedRowKeys={selectedRowKeys}
                    onSelectRow={(selectedRowKeys, selectedRows) => {
                        setSelectedRow(selectedRows);
                        setSelectedRowKeys(selectedRowKeys);
                    }}
                    toolBar={{
                        left: headerLeft
                    }}
                />}
            </AutoSizeLayout>

            <ExtModal
                centered
                destroyOnClose
                maskClosable={false}
                visible={data.visible}
                onCancel={() => { setData((value) => ({ ...value, visible: false })) }}
                onOk={() => { handleOk() }}
                title={data.modalSource ? data.isView ? '明细' : '编辑' : '新增'}
            >
                <Form>
                    <Row>
                        <FormItem label='豁免条款代码' {...formLayout}>
                            {
                                getFieldDecorator('exemptionClauseCode', {
                                    initialValue: data.modalSource && data.modalSource.exemptionClauseCode,
                                    rules: [{ required: true, message: '请填写豁免条款代码' }]
                                })(<Input disabled={data.isView} />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='豁免条款物质名称' {...formLayout}>
                            {
                                getFieldDecorator('exemptionClauseMaterialName', {
                                    initialValue: data.modalSource && data.modalSource.exemptionClauseMaterialName,
                                    rules: [{ required: true, message: '请填写豁免条款物质名称' }]
                                })(<Input disabled={data.isView} />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='CAS.NO' {...formLayout}>
                            {
                                getFieldDecorator('casNo', {
                                    initialValue: data.modalSource && data.modalSource.casNo,
                                    // rules: [{ required: true, message: '请填写CAS.NO' }]
                                })(<Input disabled={data.isView} />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='ppm' {...formLayout}>
                            {
                                getFieldDecorator('ppmValue', {
                                    initialValue: data.modalSource && data.modalSource.ppmValue,
                                    // rules: [{ required: true, message: '请填写限量' }]
                                })(<InputNumber
                                    style={{ width: '100%' }}
                                    min={0} max={100}
                                    disabled={data.isView}
                                />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='限量' {...formLayout}>
                            {
                                getFieldDecorator('limitNumber', {
                                    initialValue: data.modalSource && data.modalSource.limitNumber,
                                    // rules: [{ required: true, message: '请填写限量' }]
                                })(<InputNumber
                                    precision={2}
                                    style={{ width: '100%' }}
                                    step={0.01}
                                    formatter={value => `${value ? value + '%' : ''}`}
                                    parser={value => value.replace('%', '')}
                                    min={0} max={100}
                                    disabled={data.isView}
                                />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='比较标识' {...formLayout}>
                            {
                                getFieldDecorator('limitNumberMaxSign', {
                                    initialValue: data.modalSource && data.modalSource.limitNumberMaxSign,
                                    rules: [{ required: (!!getFieldValue('limitNumber') && getFieldValue('limitNumber') != 0), message: '请选择比较标识' }]
                                })(<Select style={{ width: '100%' }} allowClear>
                                    <Select.Option value={true}>最高值</Select.Option>
                                    <Select.Option value={false}>最低值</Select.Option>
                                </Select>)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='豁免到期日期' {...formLayout}>
                            {
                                getFieldDecorator('exemptionExpireDate', {
                                    initialValue: data.modalSource ? moment(data.modalSource.exemptionExpireDate, "YYYY-MM-DD") : '',
                                    rules: [{ required: true, message: '请填写豁免到期日期' }]
                                })(<DatePicker disabled={data.isView} style={{ width: '100%' }} />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='豁免条款具体内容' {...formLayout}>
                            {
                                getFieldDecorator('exemptionContent', {
                                    initialValue: data.modalSource && data.modalSource.exemptionContent,
                                    rules: [{ required: true, message: '请填写豁免条款具体内容' }]
                                })(<Input disabled={data.isView} />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='排序号' {...formLayout}>
                            {
                                getFieldDecorator('orderNo', {
                                    initialValue: data.modalSource && data.modalSource.orderNo,
                                    rules: [{ required: true, message: '请填写排序号' }]
                                })(<InputNumber disabled={data.isView} min={0} max={99999} style={{ width: '100%' }} />)
                            }
                        </FormItem>
                    </Row>
                </Form>
            </ExtModal>
        </Fragment>
    )

}

export default create()(ExemptionClause)
