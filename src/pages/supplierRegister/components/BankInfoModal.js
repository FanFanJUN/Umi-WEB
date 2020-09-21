import React, { forwardRef, useImperativeHandle, useEffect,useRef ,useState} from 'react';
import {connect} from 'react-redux';
import { Modal, Form,message} from 'antd';
import BankBase from './BankBase';
import BankOverseas from './BankOverseas'
import {getRelationDocId,saveBankVo} from '../../../services/supplierRegister'
const { create} = Form;
const BankInfoRef = forwardRef(({
    //visible,
    isOverseas = false,
    isView,
    form,
    onCancel = () => null,
    onOk = () => null,
    initialValues = {},
    edit,
    Modeltitle,
    CNCountryId,
    saveData,
    mergeData,
},ref,) => {
        const BankbaseRef = useRef(null);
        const getBankoversRef = useRef(null);
        const [dataSource, setDataSource] = useState([]);
        useImperativeHandle(ref, () => ({ 
            handleModalVisible,
            form
         })); 
        const [visible, setvisible] = useState(false);
        const [loading, triggerLoading] = useState(false);
        const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
        useEffect(() => {
            const {
                id,
                createdDate,
                creatorName,
                ...other
            } = initialValues;
        }, []);
        const title = Modeltitle;
        // 保存银行
        async function handleSave() {
            let bankInfo = BankbaseRef.current.getFormValue();
            console.log(bankInfo)
            if (!bankInfo) {
                return false;
            }
            if (bankInfo) {
                if (edit === false) {
                    //绑定附件
                    if (bankInfo.openingPermit && bankInfo.openingPermit.length > 0 && !bankInfo.openingPermitId) {
                        RelationDocId(bankInfo.openingPermit, bankInfo.openingPermitId).then(id => {
                            bankInfo.openingPermitId = id;
                        })
                    }
                    if (mergeData(bankInfo)) {
                        handleModalVisible(false);
                    }
                    return;
                    
                }else {
                    let editbankInfo = {...initialValues, ...bankInfo};
                    onOk(editbankInfo);
                    handleModalVisible(false);
                }
                triggerLoading(true)
                //生成银行编码
                bankInfo.bankNo = bankInfo.paymentCode + bankInfo.unionpayCode;
                saveBankVo({json: JSON.stringify(bankInfo)}).then((result) => {
                    if (result.success) {
                    handleModalVisible(false);
                    message.success("保存成功！");
                    //this.props.getDataSource && this.props.getDataSource();
                    } else {
                    message.error(result.msg);
                    }
                }).finally(() => {
                    triggerLoading(false)
                });
            }
        }
        async function RelationDocId(ids, docId) {
            const { data, success, message: msg } = await getRelationDocId({json: JSON.stringify(ids), docId: docId});
            if (success) {
                return data;
            }
           
          };
          function handleModalVisible(flag) {
            setvisible(!!flag)
          }
        return (
            <Modal
                confirmLoading={loading}
                visible={visible}
                title={edit ? "编辑" : "新增"}
                onCancel={onCancel}
                destroyOnClose={true}
                width="80vw"
                onCancel={() => handleModalVisible(false)}
                maskClosable={false}
                onOk={handleSave}
            >
                <BankBase
                    isView={isView}
                    initialValues={initialValues}
                    CNCountryId={CNCountryId}
                    wrappedComponentRef={BankbaseRef}
                />
            </Modal>
        );
    },
);
export default create()(BankInfoRef);
