
import React, { Fragment, useState, useRef } from 'react';
import { Button, Form, Row, Input, Modal, message, DatePicker, InputNumber } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../../utils/commonUrl';
import { DataImport, ExtTable, ExtModal, utils, AuthAction } from 'suid';
import { BasicUnitList } from '../../../../services/qualitySynergy';
import moment from 'moment'
import {
    exemptionClauseDataInsert,
    exemptionClauseDataDelete,
    JudgeTheListOfExemptionClause,
    SaveTheListOfExemptionClause
} from '../../../../services/qualitySynergy'
const { authAction } = utils;

const { create, Item: FormItem } = Form;
const { confirm } = Modal;
const DEVELOPER_ENV = true;
// const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
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
    const { getFieldDecorator, validateFields } = form;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    const columns = [
        { title: '豁免条款代码', dataIndex: 'exemptionClauseCode', width: 120 },
        { title: '豁免条款物质名称', dataIndex: 'exemptionClauseMaterialName', ellipsis: true, width: 140 },
        { title: 'CAS.NO', dataIndex: 'casNo', ellipsis: true, },
        { title: '限量', dataIndex: 'limitNumber', ellipsis: true },
        { title: '豁免到期日期', dataIndex: 'exemptionExpireDate', ellipsis: true, width: 180 },
        { title: '豁免条款具体内容', dataIndex: 'exemptionContent', ellipsis: true, width: 140 },
        { title: '排序号', dataIndex: 'orderNo', ellipsis: true, width: 140 },
    ]

    const buttonClick = (type) => {
        console.log('当前选中', selectedRow)
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
                    modalSource: selectedRow[0],
                    isView: type === 'detail'
                }));
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
        const listData = data.map(item => {
            delete item.key
            item.limitNumber = Number(item.limitNumber).toFixed(2);
            return item;
        })
        return new Promise((resolve, reject) => {
            JudgeTheListOfExemptionClause(listData).then(res => {
                let response = [];
                if(res.success) {
                    console.log('遍历数据', res)
                    response = res.data.map((item, index) => ({
                        ...item,
                        key: index,
                        validate: item.importResult,
                        status: item.importResult ? '数据完整' : item.importResultInfo,
                        statusCode: item.importResult ? 'success' : 'error',
                        message: item.importResult ? '成功' : item.importResultInfo
                    }));
                } else {
                    message.error(res.message);
                }
                console.log('整合数据response', response)
                resolve(response);
            }).catch(err => {
                reject(err)
            })
        });
    };

    const importFunc = (value) => {
        console.log(value);
        SaveTheListOfExemptionClause(value).then(res => {
            if (res.success) {
                refresh();
            } else {
                message.error(res.msg)
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
                disabled={selectedRow.length !== 1}
                key='QUALITYSYNERGY_EC_EDIT'
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRow.length === 0}
                key='QUALITYSYNERGY_EC_DELETE'
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('detail')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRow.length !== 1}
                key='QUALITYSYNERGY_EC_DETAIL'
            >明细</Button>)
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
                        download: '/templates/主数据-豁免条款-批导模板.xlsx',
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
        tableRef.current.remoteDataRefresh();
        setSelectedRow([]);
        setSelectedRowKeys([]);
    }

    return (
        <Fragment>
            <ExtTable
                rowKey={(v) => v.id}
                columns={columns}
                store={{
                    url: `${baseUrl}/exemptionClauseData/findByPage`,
                    type: 'GET',
                    params: {
                        quickSearchProperties: []
                    }
                }}
                ref={tableRef}
                checkbox={true}
                remotePaging={true}
                searchPlaceHolder="输入搜索项"
                selectedRowKeys={selectedRowKeys}
                onSelectRow={(selectedRowKeys, selectedRows) => {
                    setSelectedRow(selectedRows);
                    setSelectedRowKeys(selectedRowKeys);
                }}
                toolBar={{
                    left: headerLeft
                }}
            />
            <ExtModal
                centered
                destroyOnClose
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
                                    rules: [{ required: true, message: '请填写CAS.NO' }]
                                })(<Input disabled={data.isView} />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='限量' {...formLayout}>
                            {
                                getFieldDecorator('limitNumber', {
                                    initialValue: data.modalSource && data.modalSource.limitNumber,
                                    rules: [{ required: true, message: '请填写限量' }]
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
                        <FormItem label='豁免到期日期' {...formLayout}>
                            {
                                getFieldDecorator('exemptionExpireDate', {
                                    initialValue: data.modalSource && moment(data.modalSource.exemptionExpireDate, "YYYY-MM-DD"),
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
                                })(<Input disabled={data.isView} />)
                            }
                        </FormItem>
                    </Row>
                </Form>
            </ExtModal>
        </Fragment>
    )

}

export default create()(ExemptionClause)
