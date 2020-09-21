import React, { forwardRef, useImperativeHandle, useEffect, useRef ,useState} from 'react';
import { Modal, Form, Button, message, Input, } from 'antd';
import { Fieldclassification ,countryListConfig} from '@/utils/commonProps'
import { ExtTable } from 'suid';
import { openNewTab, getFrameElement ,isEmpty} from '@/utils';
import { smBaseUrl } from '@/utils/commonUrl';
import UploadFile from '../../../components/Upload/index'
import styles from '../index.less';
import {findCanChooseSupplier} from '@/services/SupplierModifyService'
const { create } = Form;
const getAgentregRef = forwardRef(({
    form,
    editData,
    isView,
    disabled,
    ReaModelOk = () => null,
    hideloading = () => null,
    loading
}, ref,) => {
    useImperativeHandle(ref, () => ({ 
        handleModalVisible,
        form 
    }));
    const headerRef = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    //const [loading, triggerLoading] = useState(false);
    useEffect(() => {
        
    }, []);

    function handleModalVisible (flag) {
        setvisible(!!flag)
        hideloading();
    };
    async function handleOk() {
      let result = false;
      form.validateFieldsAndScroll((err, values) => {
        if (isEmpty(values.modifyReason)) {
          message.error('请将填写变更原因！');
          return false;
        }else {
          result = values;
          ReaModelOk(result)
        }
      });
    }

    return (
        <Modal
            confirmLoading={loading}
            width={1000}
            className={"choose-supplier"}
            centered
            destroyOnClose={true}
            maskClosable={false}
            title={"变更原因"}
            visible={visible}
            onCancel={() => handleModalVisible(false)}
            onOk={handleOk}
        >
            <Form>
            <Form.Item
            labelCol={{span: 4}}
            wrapperCol={{span: 18}}
            label={"原因"}
          >
            {
              getFieldDecorator("modifyReason", {
                initialValue: editData && editData.modifyReason,
                rules: [{
                  required: true, message: "请填写原因",
                  whitespace: false
                }]
              })(
                <Input.TextArea
                  disabled={isView}
                  rows={6}
                  placeholder={disabled ? "" : "请填写原因"}
                />
              )
            }
          </Form.Item>
          <Form.Item
            style={{width: "100%"}}
            labelCol={{span: 4}}
            wrapperCol={{span: 18}}
            label="附件"
          >

            {getFieldDecorator('attachments', {
              initialValue: [],
            })(
              <UploadFile entityId={editData.id} type={isView ? 'show' : ''}/>

            )}
            <a style={{marginLeft: 30}}
                href='/srm-se-web/供应商更名申请函.docx'>
                  <b>下载更名模版</b>
            </a>
            <a key='downloadTemplate' style={{marginLeft: 30}}
                href='/srm-se-web/公司账户变更通知函.doc'>
                  <b>下载银行帐号变更模版</b>
            </a>

          </Form.Item>

        </Form>
      </Modal>
    );
},
);

export default create()(getAgentregRef);
