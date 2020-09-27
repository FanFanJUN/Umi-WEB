
import React, { Fragment, useState, useRef } from 'react';
import { Button, Form, Row, Input, Modal, message, Select } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, recommendUrl } from '../../../../utils/commonUrl';
import { DataImport, ExtTable, ExtModal, utils, AuthAction } from 'suid';
import {
    addEpDict,
    editEpDict,
    deleteEpDict,
} from '../../../../services/qualitySynergy';
import { AutoSizeLayout } from '../../../../components';
const { Option } = Select;
const { TextArea } = Input;
const { authAction } = utils;
const { create, Item: FormItem } = Form;
const { confirm } = Modal;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const TechnicalDataFileTypes = (props) => {
    const tableRef = useRef(null);
    const [data, setData] = useState({
        visible: false,
        modalSource: '',
    });
    const { form } = props;
    const { getFieldDecorator, validateFields, setFieldsValue, getFieldValue } = form;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    const columns = [
        { title: '数据类型名称', dataIndex: 'modelName', ellipsis: true, },
        { title: '中文内容', dataIndex: 'chContent', width: 400, ellipsis: true, },
        { title: '英文内容', dataIndex: 'ehContent', width: 500, ellipsis: true, },
        { title: '排序号', dataIndex: 'orderNo', ellipsis: true, },
    ]
    const buttonClick = (type) => {
        switch (type) {
            case 'add':
                setData((value) => ({ ...value, visible: true, modalSource: '' }));
                break;
            case 'edit':
                setData((value) => ({ ...value, visible: true, modalSource: selectedRow[selectedRow.length - 1] }));
                break;
            case 'delete':
                if (selectedRow.length === 0) {
                    message.warning('至少选择一条数据')
                } else {
                    confirm({
                        title: '请确认是否删除选中技术资料类别数据',
                        onOk: async () => {
                            const parmas = selectedRowKeys.join();
                            const res = await deleteEpDict({ ids: parmas });
                            if (res.success) {
                                message.success('删除成功');
                                tableRef.current.manualSelectedRows();
                                tableRef.current.remoteDataRefresh();
                            } else {
                                message.error(res.message);
                            }
                        },
                    });
                }
                break;
        }
    }

    const headerLeft = <div>
        {
            authAction(<Button
                type='primary'
                onClick={() => buttonClick('add')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_EPSTATEMENT_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRowKeys.length !== 1}
                key='QUALITYSYNERGY_EPSTATEMENT_EDIT'
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRowKeys.length === 0}
                key='QUALITYSYNERGY_EPSTATEMENT_DELETE'
            >删除</Button>)
        }
    </div>
    function handleOk() {
        validateFields(async (errs, values) => {
            if (!errs) {
                let res = {}
                if (data.modalSource) {
                    let list = [];
                    values = { ...data.modalSource, ...values }
                    res = await editEpDict(values);
                } else {
                    let list = [];
                    list.push(values);
                    console.log(list)
                    res = await addEpDict(list);
                }
                if (res.success) {
                    message.success('操作成功');
                    tableRef.current.manualSelectedRows();
                    tableRef.current.remoteDataRefresh();
                    setData((value) => ({ ...value, visible: false, modalSource: '' }))
                } else {
                    message.error(res.message)
                }
            }
        })
    }
    function handleSelect(item) {
        if(item==='TXSM'){
            setFieldsValue({
                modelName: '填写说明'
            })
        } else {
            setFieldsValue({
                modelName: '申明'
            })
        }
    }
    return (
        <Fragment>
            <AutoSizeLayout>
                {
                    (h) => <ExtTable
                        Table
                        columns={columns}
                        store={{
                            url: `${recommendUrl}/api/epDictService/findByPage`,
                            type: 'POST'
                        }}
                        height={h}
                        ref={tableRef}
                        checkbox={true}
                        searchPlaceHolder={'输入数据类型名称查询'}
                        remotePaging={true}
                        selectedRowKeys={selectedRowKeys}
                        onSelectRow={(selectedRowKeys, selectedRows) => {
                            setSelectedRow(selectedRows)
                            setSelectedRowKeys(selectedRowKeys)
                        }}
                        toolBar={{
                            left: headerLeft
                        }}
                    />
                }
            </AutoSizeLayout>
            <ExtModal
                centered
                destroyOnClose
                maskClosable={false}
                visible={data.visible}
                onCancel={() => { setData((value) => ({ ...value, visible: false })) }}
                onOk={() => { handleOk() }}
                title={data.modalSource ? '编辑' : '新增'}
            >
                <Form>
                    <Row>
                        <FormItem label='测试结论' {...formLayout}>
                            {
                                getFieldDecorator('modelName', {initialValue: data.modalSource ? data.modalSource.modelName : '填写说明'}),
                                getFieldDecorator('modelType', {
                                    initialValue: data.modalSource ? data.modalSource.modelType : 'TXSM',
                                    rules: [{ required: true, message: '请选择数据类型' }]
                                })(<Select style={{ width: '100%' }} onChange={handleSelect}>
                                    <Option value="SM">申明</Option>
                                    <Option value="TXSM">填写说明</Option>
                                </Select>)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label={getFieldValue('modelType') === 'TXSM' ? '填写说明(中文)' : '申明内容'} {...formLayout}>
                            {
                                getFieldDecorator('chContent', {
                                    initialValue: data.modalSource && data.modalSource.chContent,
                                    rules: [{ required: true, message: '请填写文件类别代码' }]
                                })(<TextArea />)
                            }
                        </FormItem>
                    </Row>
                    {(getFieldValue('modelType') === 'TXSM') && <Row>
                        <FormItem label='填写说明(英文)' {...formLayout}>
                            {
                                getFieldDecorator('ehContent', {
                                    initialValue: data.modalSource && data.modalSource.ehContent,
                                    rules: [{ required: true, message: '请填写文件类别名称' }]
                                })(<TextArea />)
                            }
                        </FormItem>
                    </Row>}
                    <Row>
                        <FormItem label='排序号' {...formLayout}>
                            {
                                getFieldDecorator('orderNo', {
                                    initialValue: data.modalSource && data.modalSource.orderNo,
                                    // rules: [{ required: true, message: '请填写排序号' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Row>
                </Form>
            </ExtModal>
        </Fragment>
    )

}

export default create()(TechnicalDataFileTypes)
