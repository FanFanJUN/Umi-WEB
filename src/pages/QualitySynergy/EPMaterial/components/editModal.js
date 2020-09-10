import { useImperativeHandle, forwardRef, useState, useRef, Fragment } from 'react';
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList, ExtTable, ExtModal, ComboTree } from 'suid';
import { materialCode, MaterialConfig } from '../../commonProps'
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 12, },
};
const editModal = forwardRef(({ form, initData = {} }, ref) => {
    useImperativeHandle(ref, () => ({
        showModal
    }))
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const { getFieldDecorator } = form;
    function seleteChange(item) {
        console.log('选中', item)
    }
    function showModal(type) {
        setModalType(type);
        setVisible(true);
    }
    return <Fragment>
        <ExtModal
            destroyOnClose
            onCancel={() => { setVisible(false) }}
            visible={visible}
            centered
            width={500}
            title={modalType === 'add' ? '新增' : '编辑'}
        >
            <Form>
                <Row>
                    <FormItem label='物料代码' {...formLayout}>
                        {
                            getFieldDecorator('materialId'),
                            getFieldDecorator('materialCode', {
                                initialValue: '',
                                rules: [{ required: true, message: '不能为空' }]
                            })(<ComboList form={form}
                                {...MaterialConfig}
                                name='materialCode'
                                field={['materialId', 'materialName', 'materialGroupCode', 'materialGroupName', 'materialGroupId']}
                                afterSelect={(item)=>{
                                    console.log('选中', item)
                                }} />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料描述' {...formLayout}>
                        {
                            getFieldDecorator('materialName', {
                                initialValue: '',
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料组代码' {...formLayout}>
                        {
                            getFieldDecorator('materialGroupId'),
                            getFieldDecorator('materialGroupCode', {
                                initialValue: '',
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料组名称' {...formLayout}>
                        {
                            getFieldDecorator('materialGroupName', {
                                initialValue: '',
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='环保标准' {...formLayout}>
                        {
                            getFieldDecorator('environmentalProtectionId'),
                            getFieldDecorator('environmentalProtectionCode'),
                            getFieldDecorator('environmentalProtectionName', {
                                initialValue: '',
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='战略采购' {...formLayout}>
                        {
                            getFieldDecorator('strategicPurchaseId'),
                            getFieldDecorator('strategicPurchaseCode'),
                            getFieldDecorator('strategicPurchaseName', {
                                initialValue: '',
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label=' 环保管理人员' {...formLayout}>
                        {
                            getFieldDecorator('environmentAdminId'),
                            getFieldDecorator('environmentAdminAccount'),
                            getFieldDecorator('environmentAdminName', {
                                initialValue: '',
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>
    </Fragment>
})
const editForm = create()(editModal)
export default editForm