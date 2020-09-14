import { useImperativeHandle, forwardRef, useState, useRef, Fragment, useEffect } from 'react';
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList, ExtTable, ExtModal, ComboTree } from 'suid';
import { MaterialConfig, MaterialAllConfig } from '../../commonProps';
import { findByBuCode, sapMaterialGroupMapPurchaseGroup } from '../../../../services/qualitySynergy'
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 12, },
};
const editModal = forwardRef(({ form, initData = {}, buCode, handleTableTada }, ref) => {
    useImperativeHandle(ref, () => ({
        showModal
    }))
    const [visible, setVisible] = useState(false);
    const [bmCode, setBmCode] = useState('')
    const [modalType, setModalType] = useState('');
    const { getFieldDecorator, setFieldsValue, validateFields } = form;

    useEffect(() => {
        if(!buCode) return;
        // 根据业务单元找业务板块
        async function fetchData() {
            const res = await findByBuCode({ buCode: buCode });
            if(res.success) {
                setBmCode(res.data.bmCode)
            }
        }
        fetchData();

    }, [buCode])
    function showModal(type) {
        setModalType(type);
        setVisible(true);
    }
    const handleAfterSelect = async (item) => {
        // 根据物料组+业务板块找战略采购
        const res = await sapMaterialGroupMapPurchaseGroup({
            Q_EQ_materialGroupCode: item.materialGroupCode,
            Q_EQ_businessUnit: bmCode
        })
        if(res.success && res.data && res.data.records === 1) {
            setFieldsValue({
                strategicPurchaseCode: res.data.rows[0].purchaseGroupCode,
                strategicPurchaseName: res.data.rows[0].purchaseGroupName
            })
        } else {
            message.warning('未查询到相关战略采购数据，请检查！');
        }
        // 根据物料描述取环保标准

    }
    const handleOk = () => {
        validateFields((err, values)=>{
            if(!err) {
                console.log(1111)
                let type = initData ? 'edit' : 'add'
                handleTableTada(type, {...values})
            }
        })
    }
    return <Fragment>
        <ExtModal
            destroyOnClose
            onCancel={() => { setVisible(false) }}
            onOk={handleOk}
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
                            getFieldDecorator('environmentalProtectionId', {initialValue: '6310466F-F19A-11EA-B8FC-0242C0A84412'}),
                            getFieldDecorator('environmentalProtectionCode', {initialValue: 'R'}),
                            getFieldDecorator('environmentalProtectionName', {
                                initialValue: 'R环保属性有害物料管控标准',
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