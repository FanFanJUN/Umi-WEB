import React, { useEffect, useImperativeHandle } from 'react';
import styles from './BaseInfo.less';
import { ComboList, ExtModal } from 'suid';
import { Col, Form, Modal, Row, Input, DatePicker } from 'antd';
import { BUConfig, BUConfigNoFrost } from '../../../commonProps';
import moment from 'moment/moment';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

let BaseInfo = React.forwardRef((props, ref) => {
  const { isView } = props;

  const { type, form, data, userInfo } = props;

  const { getFieldDecorator, setFieldsValue } = props.form;

  useEffect(() => {
    if (props.form.getFieldValue('buCode')) {
      props.setBuCode(props.form.getFieldValue('buCode'))
    }
  }, [props.form.getFieldValue('buCode')])

  useImperativeHandle(ref, () => ({
    getBaseInfoData: props.form.validateFieldsAndScroll
  }))

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {getFieldDecorator(name, {
        initialValue: initialValue,
      })(<Input type={'hidden'} />)}
    </FormItem>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem label="来源" {...formLayout}>
                {isView ? <span>{data.source}</span> : getFieldDecorator('source', {
                  initialValue: type === 'add' ? 'SRM' : data.source,
                })(
                  <Input disabled={true} placeholder="请输入来源" style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="分享需求号" {...formLayout}>
                {isView ? <span>{data.shareDemanNumber}</span> : getFieldDecorator('shareDemanNumber', {
                  initialValue: type === 'add' ? '' : data.shareDemanNumber,
                })(
                  <Input
                    disabled={true}
                    placeholder="请输入分享需求号"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Col span={0}>{hideFormItem('buCode', type === 'add' ? '' : data.buCode)}</Col>
          <Col span={0}>{hideFormItem('buId', type === 'add' ? '' : data.buId)}</Col>
          <Row>
            <Col span={12}>
              <FormItem {...formLayout} label={'基本单位'}>
                {isView ? <span>{data.buName}</span> : getFieldDecorator('buName', {
                  initialValue: type === 'add' ? '' : data.buName,
                  rules: [
                    {
                      required: true,
                      message: '基本单位不能为空',
                    },
                  ],
                })(
                  <ComboList
                    style={{ width: '100%' }}
                    form={form}
                    name={'buName'}
                    field={['buCode', 'buId']}
                    {...BUConfigNoFrost}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={0}>
              {hideFormItem('applyPeopleId', type === 'add' ? userInfo.userId : data.applyPeopleId)}
            </Col>
            <Col span={0}>
              {hideFormItem(
                'applyPeopleAccount',
                type === 'add' ? userInfo.userMobile : data.applyPeopleAccount,
              )}
            </Col>
            <Col span={12}>
              <FormItem label="申请人" {...formLayout}>
                {isView ? <span>{data.applyPeopleName}</span> : getFieldDecorator('applyPeopleName', {
                  initialValue: type === 'add' ? userInfo.userName : data.applyPeopleName,
                })(<Input disabled={true} placeholder="请输入申请人" style={{ width: '100' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="申请日期" {...formLayout}>
                {isView ? <span>{data.applyDate}</span> : getFieldDecorator('applyDate', {
                  initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : moment(data.applyDate),
                })(<DatePicker disabled={true} style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="申请人联系方式" {...formLayout}>
                {isView ? <span>{data.applyPeoplePhone}</span> : getFieldDecorator('applyPeoplePhone', {
                  initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                  rules: [
                    {
                      required: true,
                      message: '申请人联系方式不能为空',
                    },
                  ],
                })(
                  <Input
                    disabled={type === 'detail'}
                    placeholder="请输入申请人联系方式"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
})
export default Form.create()(BaseInfo);
