
import React, { Fragment, useState, useRef } from 'react';
import { Button, Form, Row, Input, Modal, message } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import { DataImport, ExtTable, ExtModal, utils, AuthAction } from 'suid';
import { getUserTenantCode } from '../../../../utils'
import {
    addBU,
    updateTechnicalDataCategory,
    deleteBU,
    frozenBU
} from '../../../../services/qualitySynergy'
import { AutoSizeLayout } from '../../../../components';
const { authAction } = utils;
const { create, Item: FormItem } = Form;
const { confirm } = Modal;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development';
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const BU = (props) => {
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
        { title: '业务单元代码', dataIndex: 'buCode', width: 200 },
        { title: '业务单元名称', dataIndex: 'buName', ellipsis: true, },
        { title: '排序号', dataIndex: 'orderNo', ellipsis: true, },
        { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (text) => text ? '已冻结' : '未冻结' },
    ]

    const buttonClick = (type) => {
        switch (type) {
            case 'add':
                setData((value) => ({ ...value, visible: true, modalSource: '' }));
                break;
            case 'edit':
                setData((value) => ({ ...value, visible: true, modalSource: selectedRow[selectedRow.length - 1] }));
                break;
            case 'thaw':
            case 'freeze':
                confirm({
                    title: `请确认是否${type === 'thaw' ? '解冻' : '冻结'}选中业务单元数据`,
                    onOk: async () => {
                        const parmas = selectedRowKeys.join();
                        const res = await frozenBU({
                            ids: parmas,
                            frozen: type === 'freeze'
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
                if (selectedRow.length === 0) {
                    message.warning('至少选择一条数据')
                } else {
                    confirm({
                        title: '请确认是否删除选中业务单元类别数据',
                        onOk: async () => {
                            const parmas = selectedRowKeys.join();
                            const res = await deleteBU({ ids: parmas });
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
                key='QUALITYSYNERGY_BU_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRowKeys.length !== 1}
                key='QUALITYSYNERGY_BU_EDIT'
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRowKeys.length === 0}
                key='QUALITYSYNERGY_BU_DELETE'
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('freeze')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRowKeys.length === 0}
                key='QUALITYSYNERGY_BU_FREEZE'
            >冻结</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('thaw')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRowKeys.length === 0}
                key='QUALITYSYNERGY_BU_THAW'
            >解冻</Button>)
        }
    </div>
    function handleOk() {
        validateFields(async (errs, values) => {
            if (!errs) {
                let res = {}
                if (data.modalSource) {
                    values = { ...data.modalSource, ...values }
                    res = await addBU(values);
                } else {
                    values = { frozen: false, tenantCode: getUserTenantCode(), ...values }
                    res = await addBU(values);
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
                            url: `${baseUrl}/bu/findByPage`,
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
                visible={data.visible}
                onCancel={() => { setData((value) => ({ ...value, visible: false })) }}
                onOk={() => { handleOk() }}
                title={data.modalSource ? '编辑' : '新增'}
            >
                <Form>
                    <Row>
                        <FormItem label='业务单元代码' {...formLayout}>
                            {
                                getFieldDecorator('buCode', {
                                    initialValue: data.modalSource && data.modalSource.buCode,
                                    rules: [{ required: true, message: '请填写业务单元代码' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='业务单元名称' {...formLayout}>
                            {
                                getFieldDecorator('buName', {
                                    initialValue: data.modalSource && data.modalSource.buName,
                                    rules: [{ required: true, message: '请填写业务单元名称' }]
                                })(<Input />)
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

export default create()(BU)
