import React from 'react';
import styles from './BaseInfo.less';
import { Col, Form, Modal, Row, Input } from 'antd';

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

  const { type } = props;

  const { getFieldDecorator } = props.form;

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem label='物料代码' {...formLayout}>
                {
                  getFieldDecorator('configCode', {
                  })(
                    <Input disabled={true} placeholder='请输入来源' style={{ width: 280 }}/>,
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='物料描述' {...formLayout}>
                {
                  getFieldDecorator('configCode', {
                  })(
                    <Input disabled={true} placeholder='请输入分享需求号' style={{ width: 280 }}/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label='物料组代码' {...formLayout}>
                {
                  getFieldDecorator('configCode', {
                    rules: [
                      {
                        required: true,
                        message: 'BU不能为空',
                      },
                    ],
                  })(
                    <Input disabled={type === 'detail'} placeholder='请输入BU' style={{ width: 280 }}/>,
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='物料组描述' {...formLayout}>
                {
                  getFieldDecorator('configCode', {
                  })(
                    <Input disabled={true} placeholder='请输入申请人' style={{ width: 280 }}/>,
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
                  })(
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
