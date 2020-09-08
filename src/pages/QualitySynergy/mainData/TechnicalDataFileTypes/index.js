
import React, { Fragment, useState } from 'react';
import { Button, Form, Row, Input, Modal, message } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import { DataImport, ExtTable, ExtModal, utils, AuthAction } from 'suid';
const { authAction } = utils;
const { create, Item: FormItem } = Form;
const { confirm } = Modal;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const TechnicalDataFileTypes = (props) => {

    const [data, setData] = useState({
        visible: false,
        modalSource: '',
    })
    const { form } = props;
    const { getFieldDecorator, validateFields } = form;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    const columns = [
        { title: '文件类别代码', dataIndex: 'name4', width: 200 },
        { title: '文件类别名称', dataIndex: 'name1', ellipsis: true, },
        { title: '排序号', dataIndex: 'name2', ellipsis: true, },
        { title: '冻结', dataIndex: 'name3', ellipsis: true, render: (text) => text ? '已冻结' : '未冻结' },
    ]

    const buttonClick = (type) => {
        switch (type) {
            case 'add':
                setData((value) => ({ ...value, visible: true, modalSource: '' }));
                break;
            case 'edit':
                if (checkSlectOne()) {
                    setData((value) => ({ ...value, visible: true, modalSource: selectedRow[0]}));
                }
                break;
            case 'thaw':
            case 'freeze':
                if (checkSlectOne()) {
                    console.log('冻结', selectedRow[0])
                }

                break;
            case 'delete':
                if (selectedRow.length === 0) {
                    message.warning('至少选择一条数据')
                } else {
                    confirm({
                        title: '请确认是否删除选中技术资料类别数据',
                        onOk: () => {
                            console.log('确认删除', selectedRowKeys);
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
                // ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_TDP_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('edit')}
                className={styles.btn}
                // ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_TDP_EDIT'
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('delete')}
                className={styles.btn}
                // ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_TDP_DELETE'
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('freeze')}
                className={styles.btn}
                // ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_TDP_FREEZE'
            >冻结</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('thaw')}
                className={styles.btn}
                // ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_TDP_THAW'
            >解冻</Button>)
        }
    </div>
    function handleOk() {
        validateFields((errs, values) => {
            if (!errs) {
                console.log(values)
            }
        })
    }
    return (
        <Fragment>
            <ExtTable
                Table
                columns={columns}
                //   store={{
                //     url: `${baseUrl}/limitSubstanceListData/find_by_page`,
                //     type: 'GET'
                //   }}
                checkbox={true}
                selectedRowKeys={selectedRowKeys}
                onSelectRow={(selectedRowKeys, selectedRows) => {
                    setSelectedRow(selectedRows)
                    setSelectedRowKeys(selectedRowKeys)
                }}
                toolBar={{
                    left: headerLeft
                }}
                dataSource={[
                    { id: 1, name1: 'xxx', name2: 'sdhfj', name3: true, name4: 'sdf' },
                    { id: 2, name1: 'xxx', name2: 'sdhfj', name3: false, name4: 'sdf' },
                ]}
            />
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
                        <FormItem label='文件类别代码' {...formLayout}>
                            {
                                getFieldDecorator('name4', {
                                    initialValue: data.modalSource && data.modalSource.name4,
                                    rules: [{ required: true, message: '请填写文件类别代码' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label='文件类别名称' {...formLayout}>
                            {
                                getFieldDecorator('name1', {
                                    initialValue: data.modalSource && data.modalSource.name1,
                                    rules: [{ required: true, message: '请填写文件类别名称' }]
                                })(<Input />)
                            }
                        </FormItem>
                    </Row>

                    <Row>
                        <FormItem label='排序号' {...formLayout}>
                            {
                                getFieldDecorator('name2', {
                                    initialValue: data.modalSource && data.modalSource.name2,
                                    rules: [{ required: true, message: '请填写排序号' }]
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
