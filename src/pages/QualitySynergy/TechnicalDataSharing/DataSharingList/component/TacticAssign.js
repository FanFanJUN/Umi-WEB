import React, { Fragment } from 'react';
import { Col, DatePicker, Form, Input, message, Modal, Row, Select } from 'antd';
import { ComboList } from 'suid';
import { baseUrl } from '../../../../../utils/commonUrl';
import {
  OrganizationByCompanyCodeConfig,
  StrategicPurchasingAll,
  StrategyAssignedDataSharingList,
} from '../../../commonProps';

const FormItem = Form.Item

const TacticAssign = (props) => {

  const formItemLayoutLong = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
  };

  const {visible, form, selectedRowKeys} = props
  const {getFieldDecorator, getFieldValue} = props.form;


  const handleOk = () => {
    if (getFieldValue('strategicPurchaseCode')) {
      StrategyAssignedDataSharingList({
        ids: selectedRowKeys.toString(),
        strategicPurchaseCode: getFieldValue('strategicPurchaseCode'),
        strategicPurchaseId: getFieldValue('strategicPurchaseId'),
        strategicPurchaseName: getFieldValue('strategicPurchaseName'),
      }).then(res => {
        if (res.success) {
          props.form.resetFields();
          props.onCancel()
          props.tableRef.current.remoteDataRefresh()
        } else {
          message.error(res.message)
        }
      })
    } else {
      message.error('请选择战略指派')
    }
  }

  const handleCancel = () => {
    props.form.resetFields();
    props.onCancel()
  }

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {
        getFieldDecorator(name, {
          initialValue: initialValue,
        })(
          <Input type={'hidden'} />,
        )
      }
    </FormItem>
  );

  return(
    <Modal
      title='指派战略采购'
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div style={{height: '50px'}}>
        <Form>
          <Col span={0}>
            {hideFormItem('strategicPurchaseCode')}
          </Col>
          <Col span={0}>
            {hideFormItem('strategicPurchaseId')}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'战略采购'}>
              {
                getFieldDecorator('strategicPurchaseName', {
                })(<ComboList
                  form={form}
                  field={['strategicPurchaseCode', 'strategicPurchaseId']}
                  name={'strategicPurchaseName'}
                  {...StrategicPurchasingAll}
                />)
              }
            </FormItem>
          </Col>
        </Form>
      </div>
    </Modal>
  )
}
TacticAssign.defaultPorps ={
  onCancel: () => {},
  visible: false
}

export default Form.create()(TacticAssign);
