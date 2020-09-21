
import React, { Fragment, useState, useRef } from 'react';
import { Button, Form, Row, Input, Modal, message } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, recommendUrl } from '../../../../utils/commonUrl';
import { DataImport, ExtTable, ExtModal, utils, AuthAction } from 'suid';
import {
    addEpDict,
    editEpDict,
    deleteEpDict,
} from '../../../../services/qualitySynergy';
import { AutoSizeLayout } from '../../../../components';
const { TextArea } = Input;
const { authAction } = utils;
const { create, Item: FormItem } = Form;
const { confirm } = Modal;
const DEVELOPER_ENV = true;
// const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
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
    const { getFieldDecorator, validateFields } = form;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    const columns = [
        { title: '文件类别代码', dataIndex: 'fileCategoryCode', width: 200 },
        { title: '文件类别名称', dataIndex: 'fileCategoryName', ellipsis: true, },
        { title: '排序号', dataIndex: 'orderNo', ellipsis: true, },
        { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (text) => text ? '已冻结' : '未冻结' },
    ]
    // 检查传入数据的冻结情况，全冻结返回thaw，全未冻结返回freeze
    const checkFreeze = (dataList) => {
        if(!dataList || dataList.length===0) return false;
        return dataList.every((item)=>item.frozen)?'thaw':dataList.every((item)=>!item.frozen)?'freeze':false
    }
    const buttonClick = (type) => {
        console.log('选中数据', selectedRow)
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
                            const res = await deleteEpDict({ id: parmas });
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
                    values = { ...data.modalSource, ...values }
                    res = await editEpDict(values);
                } else {
                    res = await addEpDict(values);
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
    return (
        <Fragment>
            <AutoSizeLayout>
                {
                    (h) => <ExtTable
                        Table
                        columns={columns}
                        store={{
                            url: `${recommendUrl}/epDictService/findByPage`,
                            type: 'POST'
                        }}
                        height={h}
                        ref={tableRef}
                        checkbox={true}
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
                        <FormItem label='填写说明(中文)' {...formLayout}>
                            {
                                getFieldDecorator('chContent', {
                                    initialValue: data.modalSource && data.modalSource.chContent,
                                    rules: [{ required: true, message: '请填写文件类别代码' }]
                                })(<TextArea />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='填写说明(英文)' {...formLayout}>
                            {
                                getFieldDecorator('ehContent', {
                                    initialValue: data.modalSource && data.modalSource.ehContent,
                                    rules: [{ required: true, message: '请填写文件类别名称' }]
                                })(<TextArea />)
                            }
                        </FormItem>
                    </Row>

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
