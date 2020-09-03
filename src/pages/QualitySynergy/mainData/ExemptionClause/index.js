
import React, { Fragment, useState } from 'react';
import { Button, Form, Row, Input, Modal, message, DatePicker, InputNumber } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import { DataImport, ExtTable, ExtModal, utils, ComboList } from 'suid';
import { BasicUnitList } from '../../../../services/qualitySynergy';
import moment from 'moment'
import { exemptionClauseDataInsert, exemptionClauseDataDelete } from '../../commonProps'
const { authAction } = utils;
const { create, Item: FormItem } = Form;
const { confirm } = Modal;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const ExemptionClause = (props) => {

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
        switch (type) {
            case 'add':
                setData((value) => ({ ...value, visible: true, modalSource: '', isView: false }));
                break;
            case 'edit':
            case 'detail':
                if (checkSlectOne()) {
                    setData((value) => ({
                        ...value,
                        visible: true,
                        modalSource: selectedRow[0],
                        isView: type === 'detail'
                    }));
                }
                break;
            case 'delete':
                if (selectedRow.length === 0) {
                    message.warning('至少选择一条数据')
                } else {
                    confirm({
                        title: '请确认是否删除选中技术资料类别数据',
                        onOk: async () => {
                            
                            const parmas = selectedRowKeys.join();
                            console.log('确认删除', parmas);
                            const data = await exemptionClauseDataDelete({ids: parmas});
                            console.log(data);
                        },
                    });
                }
                break;
        }
    }

    function checkSlectOne() {
        if (selectedRow.length === 0) {
            message.warning('请选择一条数据');
            return false;
        } else if (selectedRow.length > 1) {
            message.warning('只能选择一条数据');
            return false;
        }
        return true
    }


    const headerLeft = <div>
        {
            authAction(<Button
                type='primary'
                onClick={() => buttonClick('add')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='1'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='2'
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='3'
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('detail')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='4'
            >明细</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('thaw')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='5'
            >导入</Button>)
        }
    </div>
    // 编辑/新增
    const handleOk = async () => {
        validateFields(async (errs, values) => {
            if (!errs) {
                console.log(values)
                const data = await exemptionClauseDataInsert(values)
            }
        })
    }
    return (
        <Fragment>
            <ExtTable
                columns={columns}
                store={{
                    url: `${baseUrl}/exemptionClauseData/findByPage`,
                    type: 'POST',
                    params: {
                        quickSearchProperties: []
                    }
                }}
                remotePaging={true}
                searchPlaceHolder="请输入豁免条款代码，豁免条款物质名称查询"
                checkbox={true}
                selectedRowKeys={selectedRowKeys}
                onSelectRow={(selectedRowKeys, selectedRows) => {
                    setSelectedRow(selectedRows)
                    setSelectedRowKeys(selectedRowKeys)
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
                                })(<Input disabled={data.isView}/>)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='豁免条款物质名称' {...formLayout}>
                            {
                                getFieldDecorator('exemptionClauseMaterialName', {
                                    initialValue: data.modalSource && data.modalSource.exemptionClauseMaterialName,
                                    rules: [{ required: true, message: '请填写豁免条款物质名称' }]
                                })(<Input disabled={data.isView}/>)
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
                                    style={{width: '100%'}}
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
