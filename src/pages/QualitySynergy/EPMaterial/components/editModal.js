import { useImperativeHandle, forwardRef, useState, useRef, Fragment, useEffect } from 'react';
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList, ExtTable, ExtModal, ComboTree } from 'suid';
import { MaterialConfig, MaterialAllConfig } from '../../commonProps';
import { findByBuCode, sapMaterialGroupMapPurchaseGroup, epsFindByCode } from '../../../../services/qualitySynergy'
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 12, },
};
const editModal = forwardRef(({ form, initData, buCode, handleTableTada }, ref) => {
    useImperativeHandle(ref, () => ({
        showModal
    }))
    const [visible, setVisible] = useState(false);
    const [bmCode, setBmCode] = useState('');
    const [loading, setLoading] = useState(false);
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
    const handleAfterSelect = (item) => {
        setLoading(true);
        let tag = true;
        // 根据物料组+业务板块找战略采购
        sapMaterialGroupMapPurchaseGroup({
            Q_EQ_materialGroupCode: item.materialGroupCode,
            Q_EQ_businessUnit: bmCode
        }).then(res => {
            if(res.success && res.data && res.data.records === 1) {
                setFieldsValue({
                    strategicPurchaseCode: res.data.rows[0].purchaseGroupCode,
                    strategicPurchaseName: res.data.rows[0].purchaseGroupName,
                    loading: tag && false
                })
            } else {
                message.warning('未查询到相关战略采购数据，请检查！');
            }
        })
        
        // 根据物料描述取环保标准
        const code = item.materialDesc ? item.materialDesc.split('-')[0] : ''
        epsFindByCode({ code }).then(espRes => {
            if(espRes.success) {
                console.log(222)
                setFieldsValue({
                    environmentalProtectionId: espRes.data.id,
                    environmentalProtectionCode: espRes.data.environmentalProtectionCode,
                    environmentalProtectionName: espRes.data.environmentalProtectionName,
                    loading: tag && false
                })
            } else {
                message.warning('未查询到相关环保标准，请检查！');
            }
        })
    }
    const handleOk = () => {
        validateFields((err, values)=>{
            if(!err) {
                let type = initData ? 'edit' : 'add'
                let obj = initData ? {...initData, ...values} : {...values}
                handleTableTada(type, obj);
                setVisible(false);
            }
        })
    }
    return <Fragment>
        <ExtModal
            destroyOnClose
            onCancel={() => { setVisible(false) }}
            onOk={handleOk}
            visible={visible}
            loading={loading}
            centered
            width={500}
            title={modalType === 'add' ? '新增' : '编辑'}
        >
            <Form>
                <Row>
                    <FormItem label='物料代码' {...formLayout}>
                        {
                            getFieldDecorator('materialId', {initialValue: initData && initData.materialId}),
                            getFieldDecorator('materialCode', {
                                initialValue: initData && initData.materialCode,
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
                                initialValue: initData && initData.materialName,
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料组代码' {...formLayout}>
                        {
                            getFieldDecorator('materialGroupId', {initialValue: initData && initData.materialGroupId}),
                            getFieldDecorator('materialGroupCode', {
                                initialValue: initData && initData.materialGroupCode,
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料组名称' {...formLayout}>
                        {
                            getFieldDecorator('materialGroupName', {
                                initialValue: initData && initData.materialGroupName,
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='环保标准' {...formLayout}>
                        {
                            getFieldDecorator('environmentalProtectionId', {initialValue: initData && initData.environmentalProtectionId}),
                            getFieldDecorator('environmentalProtectionCode', {initialValue: initData && initData.environmentalProtectionCode}),
                            getFieldDecorator('environmentalProtectionName', {
                                initialValue: initData && initData.environmentalProtectionName,
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='战略采购' {...formLayout}>
                        {
                            getFieldDecorator('strategicPurchaseId', {initialValue: initData && initData.strategicPurchaseId}),
                            getFieldDecorator('strategicPurchaseCode', {initialValue: initData && initData.strategicPurchaseCode}),
                            getFieldDecorator('strategicPurchaseName', {
                                initialValue: initData && initData.strategicPurchaseName,
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='环保管理人员' {...formLayout}>
                        {
                            getFieldDecorator('environmentAdminId', {initialValue: initData && initData.environmentAdminId}),
                            getFieldDecorator('environmentAdminAccount', {initialValue: initData && initData.environmentAdminAccount}),
                            getFieldDecorator('environmentAdminName', {
                                initialValue: initData && initData.environmentAdminName,
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