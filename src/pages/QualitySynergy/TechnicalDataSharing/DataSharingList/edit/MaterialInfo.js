import React, { useImperativeHandle } from 'react';
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

const MaterialInfo = React.forwardRef((props, ref) => {

  const { type, data, form } = props;

  const { getFieldDecorator, getFieldValue } = props.form;

  useImperativeHandle(ref, () => ({
    getMaterialInfoData: props.form.validateFieldsAndScroll
  }))

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {
        getFieldDecorator(name, {
          initialValue: initialValue,
        })(
          <Input type={'hidden'}/>,
        )
      }
    </FormItem>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>物料信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={0}>
              {hideFormItem('materialId', type === 'add' ? '' : data.materialId)}
            </Col>
            <Col span={12}>
              <FormItem {...formLayout} label={'物料代码'}>
                {
                  getFieldDecorator('materialCode', {
                    initialValue: type === 'add' ? '' : data.materialCode,
                  })(<ComboList
                    style={{ width: '100%' }}
                    form={form}
                    name={'materialCode'}
                    field={['materialId', 'materialDesc', 'materialGroupCode', 'materialGroupDesc', 'materialGroupId']}
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
                    <Input disabled={true} placeholder='请输入物料描述' style={{ width: '100%' }}/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Col span={0}>
            {hideFormItem('materialGroupId', type === 'add' ? '' : data.materialGroupId)}
          </Col>
          <Row>
            <Col span={12}>
              <FormItem {...formLayout} label={'物料组代码'}>
                {
                  getFieldDecorator('materialGroupCode', {
                    initialValue: type === 'add' ? '' : data.materialGroupCode,
                    rules: [
                      {
                        required: true,
                        message: '物料组代码不能为空',
                      },
                    ],
                  })(<ComboList
                    disabled={getFieldValue('materialCode') ? true : false}
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
                  getFieldDecorator('materialGroupDesc', {
                    initialValue: type === 'add' ? '' : data.materialGroupDesc,
                  })(
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
                  getFieldDecorator('configCode', {
                    initialValue: type === 'add' ? '123' : data.configCode,
                  })(
                    <Input disabled={true} placeholder='请输入战略采购代码' style={{ width: '100%' }}/>,
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='战略采购名称' {...formLayout}>
                {
                  getFieldDecorator('configCode', {
                    initialValue: type === 'add' ? '123' : data.configCode,
                    rules: [
                      {
                        required: true,
                        message: '申请人联系方式不能为空',
                      },
                    ],
                  })(
                    <Input disabled={true} placeholder='请输入战略采购名称' style={{ width: '100%' }}/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );

})

export default Form.create()(MaterialInfo);
