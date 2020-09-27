import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form } from 'antd';
import AgentregisterForm from './AgentregisterForm';
import BankOverseas from './BankOverseas'
import { getRelationDocId } from '../../../services/supplierRegister'
const { create } = Form;
const AgentModelRef = forwardRef(({
    isOverseas = false,
    form,
    onCancel = () => null,
    onOk = () => null,
    initialValues = {},
    type,
    edit,
    mergeData,
    editData = {},
    loading }, ref,) => {
    const getAgentregRef = useRef(null);
    const getBankoversRef = useRef(null);
    useImperativeHandle(ref, () => ({
        getAgentValue,
        handleModalVisible,
        form
    }));
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    const [confirmLoading, setconfirmLoading] = useState(false);
    useEffect(() => {
        const {
            id,
            createdDate,
            creatorName,
            ...other
        } = initialValues;
        // const fields = {
        //     ...other
        // }
        // console.log(fields)
        // setFieldsValue(fields);
    }, []);

    function handleModalVisible(flag) {
        setvisible(!!flag)
    }
    // 保存代理商
    async function handleSave() {
        let agentInfo = getAgentregRef.current.getFormValue()
        console.log(agentInfo)
        if (!agentInfo) {
            return false;
        }
        if (agentInfo) {
            //绑定附件
            if (agentInfo.businessLicenseDocIds && agentInfo.businessLicenseDocIds.length > 0) {
                await RelationDocId(agentInfo.businessLicenseDocIds,
                    agentInfo.businessLicenseDocId).then(id => {
                        agentInfo.businessLicenseDocId = id;
                    })
            }
            //绑定附件
            if (agentInfo.powerAttorneyDocIds && agentInfo.powerAttorneyDocIds.length > 0) {
                await RelationDocId(agentInfo.powerAttorneyDocIds, agentInfo.powerAttorneyDocId).then(id => {
                    agentInfo.powerAttorneyDocId = id;
                })
            }
            if (edit === false) {
                if (await mergeData(agentInfo)) {
                    setconfirmLoading(true)
                    handleModalVisible(false);
                    setconfirmLoading(false)
                }
                return;

            } else {
                let editbankInfo = { ...initialValues, ...agentInfo };
                setconfirmLoading(true)
                await onOk(editbankInfo);
                handleModalVisible(false);
                setconfirmLoading(false)
            }
        }
    }
    async function RelationDocId(ids, docId) {
        const { data, success, message: msg } = await getRelationDocId({json: JSON.stringify(ids), docId: docId});
        if (success) {
            return data;
        }
    
    };
    // 获取表单值
    async function getAgentValue() {
        let agentInfo = getAgentregRef.current.getFormValue();
        if (!agentInfo) {
            return false;
        }
        if (initialValues && initialValues.supplierAgents && initialValues.supplierAgents.length > 0) {
            agentInfo.id = initialValues.supplierAgents[0].id || null;
            agentInfo.key = initialValues.supplierAgents[0].key || null;
            agentInfo.supplierId = initialValues.supplierAgents[0].supplierId || null;
        }
        return agentInfo;

    }
    return (
        <Modal
            confirmLoading={loading}
            visible={visible}
            title={edit ? "编辑" : "新增"}
            onCancel={onCancel}
            destroyOnClose={true}
            width="80vw"
            maskClosable={false}
            onCancel={() => handleModalVisible(false)}
            onOk={handleSave}
        >
            {!isOverseas ?
                <AgentregisterForm
                    editData={editData}
                    initialValues={initialValues}
                    wrappedComponentRef={getAgentregRef}
                /> :
                <BankOverseas
                    wrappedComponentRef={getBankoversRef}
                />
            }
        </Modal>
    );
},
);

export default create()(AgentModelRef);
