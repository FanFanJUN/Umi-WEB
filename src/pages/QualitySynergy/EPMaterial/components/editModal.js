import { useImperativeHandle, forwardRef, useState, useRef, Fragment } from 'react';
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList, ExtTable, ExtModal, ComboTree } from 'suid';
import { materialCode } from '../../commonProps'
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 12, },
};
const editModal =  forwardRef(({ form }, ref) => {
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
            onCancel={()=>{setVisible(false)}}
            visible={visible}
            centered
            width={500}
            title={modalType === 'add' ? '新增': '编辑'}
        >
            <Form>
                <Row>
                    <FormItem label='物料代码' {...formLayout}>
                        {
                            getFieldDecorator('supplierName', {
                                rules: [{ required: true,  message: '不能为空'}]
                            })(<ComboList form={form} {...materialCode} name='supplierCode' 
                                field={['supplierName', 'supplierId']} 
                                afterSelect={seleteChange} />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料描述' {...formLayout}>
                        {
                            getFieldDecorator('supplierName', {
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料组代码' {...formLayout}>
                        {
                            getFieldDecorator('supplierName', {
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料组名称' {...formLayout}>
                        {
                            getFieldDecorator('supplierName', {
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='环保标准' {...formLayout}>
                        {
                            getFieldDecorator('supplierName')(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='战略采购' {...formLayout}>
                        {
                            getFieldDecorator('supplierName')(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label=' 环保管理人员' {...formLayout}>
                        {
                            getFieldDecorator('supplierName')(<Input disabled />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>
    </Fragment>
})
const editForm = create()(editModal)
export default editForm