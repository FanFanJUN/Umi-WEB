import React from 'react';
import styles from './BaseInfo.less';
import { Col, Form, Modal, Row, Input } from 'antd';
import moment from 'moment/moment';
import { ComboList, ExtModal } from 'suid';
import { BUConfig, MaterialConfig } from '../../../commonProps';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const MaterialInfo = (props) => {

  const { type, data, form } = props;

  const { getFieldDecorator } = props.form;

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem {...formLayout} label={'物料代码'}>
                {
                  getFieldDecorator('materialId'),
                  getFieldDecorator('materialCode', {
                  initialValue: type === 'add' ? '' : data.materialCode,
                })(<ComboList
                  style={{ width: '100%' }}
                  form={form}
                  name={'materialCode'}
                  field={['materialId', 'materialDesc']}
                  {...MaterialConfig}
                  />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='物料描述' {...formLayout}>
                {
                  getFieldDecorator('materialDesc', {
                    rules: [
                      {
                        required: true,
                        message: '物料描述不能为空',
                      },
                    ],
                  })(
                    <Input placeholder='请输入物料描述' style={{ width: '100%' }}/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formLayout} label={'物料组代码'}>
                {
                  getFieldDecorator('materialGroupId'),
                  getFieldDecorator('materialGroupCode', {
                  initialValue: type === 'add' ? '' : data.materialGroupCode,
                  rules: [
                {
                  required: true,
                  message: '物料组代码不能为空',
                },
                  ],
                })(<ComboList
                  style={{ width: '100%' }}
                  form={form}
                  name={'materialGroupCode'}
                  field={['materialGroupId']}
                  {...BUConfig}
                  />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='物料组描述' {...formLayout}>
                {
                  getFieldDecorator('materialGroupName', {})(
                    <Input disabled={true} placeholder='请输入物料组描述' style={{ width: '100%' }}/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label='战略采购代码' {...formLayout}>
                {
                  getFieldDecorator('configCode', {})(
                    <Input disabled={true} placeholder='请输入申请日期' style={{ width: 280 }}/>,
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='战略采购名称' {...formLayout}>
                {
                  getFieldDecorator('configCode', {
                    rules: [
                      {
                        required: true,
                        message: '申请人联系方式不能为空',
                      },
                    ],
                  })(
                    <Input disabled={type === 'detail'} placeholder='请输入申请人联系方式' style={{ width: 280 }}/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );

};

export default Form.create()(MaterialInfo);
