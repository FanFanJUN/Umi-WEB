import { useImperativeHandle, forwardRef, useState, useRef, Fragment, useEffect } from 'react';
import { Form, Row, Col, Input, Button, Modal, message, Spin } from 'antd';
import { ComboList, ExtTable, ExtModal, ComboTree } from 'suid';
import { MaterialConfig, allPersonList } from '../../commonProps';
import {
    findByBuCode,
    sapMaterialGroupMapPurchaseGroup,
    epsFindByCode,
    findOrgTreeWithoutFrozen,
    checkEnvironmentalProtectionData
} from '../../../../services/qualitySynergy';
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 12, },
};
const editModal = forwardRef(({ form, initData, buCode, handleTableTada, materialCodes }, ref) => {
    useImperativeHandle(ref, () => ({
        showModal
    }))
    const [visible, setVisible] = useState(false);
    const [bmCode, setBmCode] = useState('');
    const [modalType, setModalType] = useState('');
    const [OrgId, setOrgId] = useState('');
    const { getFieldDecorator, setFieldsValue, validateFields } = form;

    useEffect(() => {
        if (!buCode) return;
        // 根据业务单元找业务板块
        async function fetchData() {
            const res = await findByBuCode({ buCode: buCode });
            if (res.success) {
                setBmCode(res.data.bmCode)
            }
        }
        fetchData();
        findOrgTreeWithoutFrozen().then(res => {
            if (res.success) {
                setOrgId(res.data[0].id);
            }
        })
    }, [buCode])
    function showModal(type) {
        setModalType(type);
        setVisible(true);
    }
    const handleAfterSelect = async (item) => {
        const resCheck = await checkEnvironmentalProtectionData({
            environmentalProtectionName: item.materialDesc
        })
        if(!resCheck.success) {
            setFieldsValue({ materialId: '', materialCode: '', materialName: '', materialGroupCode: '', materialGroupName: '', materialGroupId: '' })
            message.warning(resCheck.message);
            return;
        }
        if (materialCodes && materialCodes.includes(item.materialCode)) {
            message.error('此物料已存在表格中，不能再次添加！');
            setFieldsValue({ materialId: '', materialCode: '', materialName: '', materialGroupCode: '', materialGroupName: '', materialGroupId: '' })
            return;
        }
        let tag1, tag2;
        // 根据物料组+业务板块找战略采购
        sapMaterialGroupMapPurchaseGroup({
            Q_EQ_materialGroupCode: item.materialGroupCode,
            Q_EQ_businessUnit: bmCode
        }).then(res => {
            tag1 = true;
            if (res.success && res.data && res.data.records === 1) {
                setFieldsValue({
                    strategicPurchaseCode: res.data.rows[0].purchaseGroupCode,
                    strategicPurchaseName: res.data.rows[0].purchaseGroupName,
                })
            } else {
                setFieldsValue({
                    strategicPurchaseCode: '',
                    strategicPurchaseName: '',
                })
                // message.warning('未查询到相关战略采购数据！');
            }
        })

        // 根据物料描述取环保标准
        const code = item.materialDesc ? item.materialDesc.split('-')[0] : ''
        epsFindByCode({ code }).then(espRes => {
            tag2 = true;
            if (espRes.success) {
                console.log(222)
                setFieldsValue({
                    environmentalProtectionId: espRes.data.id,
                    environmentalProtectionCode: espRes.data.environmentalProtectionCode,
                    environmentalProtectionName: espRes.data.environmentalProtectionName,
                })
            } else {
                message.warning('未查询到相关环保标准，请检查！');
            }
        })
    }
    const handleOk = () => {
        validateFields((err, values) => {
            if (!err) {
                let type = initData ? 'edit' : 'add'
                let obj = initData ? { ...initData, ...values } : { ...values }
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
            maskClosable={false}
            centered
            width={500}
            title={modalType === 'add' ? '新增' : '编辑'}
        >
            <Form>
                <Row>
                    <FormItem label='物料代码' {...formLayout}>
                        {
                            getFieldDecorator('materialId', { initialValue: modalType === 'add' ? '' : initData && initData.materialId }),
                            getFieldDecorator('materialCode', {
                                initialValue: modalType === 'add' ? '' : initData && initData.materialCode,
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
                                initialValue: modalType === 'add' ? '' : initData && initData.materialName,
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料组代码' {...formLayout}>
                        {
                            getFieldDecorator('materialGroupId', { initialValue: modalType === 'add' ? '' : initData && initData.materialGroupId }),
                            getFieldDecorator('materialGroupCode', {
                                initialValue: modalType === 'add' ? '' : initData && initData.materialGroupCode,
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='物料组名称' {...formLayout}>
                        {
                            getFieldDecorator('materialGroupName', {
                                initialValue: modalType === 'add' ? '' : initData && initData.materialGroupName,
                                rules: [{ required: true, message: '不能为空' }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='环保标准' {...formLayout}>
                        {
                            getFieldDecorator('environmentalProtectionId', { initialValue: modalType === 'add' ? '' : initData && initData.environmentalProtectionId }),
                            getFieldDecorator('environmentalProtectionCode', { initialValue: modalType === 'add' ? '' : initData && initData.environmentalProtectionCode }),
                            getFieldDecorator('environmentalProtectionName', {
                                initialValue: modalType === 'add' ? '' : initData && initData.environmentalProtectionName,
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='战略采购' {...formLayout}>
                        {
                            getFieldDecorator('strategicPurchaseId', { initialValue: initData && initData.strategicPurchaseId }),
                            getFieldDecorator('strategicPurchaseCode', { initialValue: initData && initData.strategicPurchaseCode }),
                            getFieldDecorator('strategicPurchaseName', {
                                initialValue: initData && initData.strategicPurchaseName,
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='环保管理人员' {...formLayout}>
                        {
                            getFieldDecorator('environmentAdminId', { initialValue: initData && initData.environmentAdminId }),
                            getFieldDecorator('environmentAdminAccount', { initialValue: initData && initData.environmentAdminAccount }),
                            getFieldDecorator('environmentAdminName', {
                                initialValue: initData && initData.environmentAdminName,
                            })(<ComboList form={form}
                                {...allPersonList}
                                cascadeParams={{ organizationId: OrgId }}
                                name='environmentAdminName'
                                field={['environmentAdminId', 'environmentAdminAccount']}
                            />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>
    </Fragment>
})
const editForm = create()(editModal)
export default editForm