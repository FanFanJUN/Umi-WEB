import { useImperativeHandle, forwardRef, useState, useRef, Fragment, useEffect } from 'react';
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList, ExtTable, ExtModal, ComboTree } from 'suid';
import { materialCode, MaterialConfig } from '../../commonProps';
import { findByBuCode } from '../../../../services/qualitySynergy'
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 12, },
};
const editModal = forwardRef(({ form, initData = {}, buCode }, ref) => {
    useImperativeHandle(ref, () => ({
        showModal
    }))
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const { getFieldDecorator } = form;

    useEffect(() => {
        if(!buCode) return;
        // 根据业务单元找业务板块
        async function fetchData() {
            console.log('buCode', buCode)
            const res = await findByBuCode({ buCode: buCode });
            console.log(res)
        }
        fetchData();

    }, [buCode])
    function showModal(type) {
        setModalType(type);
        setVisible(true);
    }
    const handleAfterSelect = async (item) => {
        // 根据物料组+业务板块找战略采购

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
                                afterSelect={handleAfterSelect} />)
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
                    <FormItem label='环保管理人员' {...formLayout}>
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