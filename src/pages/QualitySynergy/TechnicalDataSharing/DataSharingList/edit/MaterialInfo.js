import React, { useEffect, useImperativeHandle } from 'react';
import styles from './BaseInfo.less';
import { Col, Form, Modal, Row, Input, message } from 'antd';
import moment from 'moment/moment';
import { ComboList, ExtModal } from 'suid';
import { BUConfig, MaterialConfig, MaterialGroupConfig, FindTacticByBuCodeAndGroupCode } from '../../../commonProps';

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

  const { type, data, form, buCode, isView } = props;

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  useImperativeHandle(ref, () => ({
    getMaterialInfoData: props.form.validateFieldsAndScroll
  }))

  useEffect(() => {
    // console.log(buCode, 'bucode', getFieldValue('materialGroupCode'), getFieldValue('materialGroupName'))
    if (buCode && getFieldValue('materialGroupCode')) {
      FindTacticByBuCodeAndGroupCode({
        materialGroupCode: getFieldValue('materialGroupCode'),
        buCode: buCode
      }).then(res => {
        if (res.success) {
          if (res.data) {
            setFieldsValue({
              strategicPurchaseId: res.data.id,
              strategicPurchaseName: res.data.name,
              strategicPurchaseCode: res.data.code
            })
          }
        } else {
          message.error(res.message)
        }
      })
    }
  }, [getFieldValue('materialGroupCode'), buCode])

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
                 isView ? <span>{data.materialCode}</span> :  getFieldDecorator('materialCode', {
                   initialValue: type === 'add' ? '' : data.materialCode,
                 })(<ComboList
                   allowClear={true}
                   style={{ width: '100%' }}
                   form={form}
                   name={'materialCode'}
                   field={['materialId', 'materialName', 'materialGroupCode', 'materialGroupName', 'materialGroupId']}
                   {...MaterialConfig}
                 />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='物料描述' {...formLayout}>
                {
                  isView ? <span>{data.materialName}</span> : getFieldDecorator('materialName', {
                    initialValue: type === 'add' ? '' : data.materialName,
                    rules: [
                      {
                        required: true,
                        message: '物料描述不能为空',
                      },
                    ],
                  })(
                    <Input disabled={getFieldValue('materialCode') ? true : false} placeholder='请输入物料描述' style={{ width: '100%' }}/>,
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
                  isView ? <span>{data.materialGroupCode}</span> :getFieldDecorator('materialGroupCode', {
                    initialValue: type === 'add' ? '' : data.materialGroupCode,
                    rules: [
                      {
                        required: true,
                        message: '物料组代码不能为空',
                      },
                    ],
                  })(<ComboList
                    allowClear={true}
                    disabled={getFieldValue('materialCode') ? true : false}
                    style={{ width: '100%' }}
                    form={form}
                    name={'materialGroupCode'}
                    field={['materialGroupId', 'materialGroupName']}
                    {...MaterialGroupConfig}
                  />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='物料组描述' {...formLayout}>
                {
                  isView ? <span>{data.materialGroupName}</span> :getFieldDecorator('materialGroupName', {
                    initialValue: type === 'add' ? '' : data.materialGroupName,
                  })(
                    <Input disabled={true} placeholder='请输入物料组描述' style={{ width: '100%' }}/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Col span={0}>
            {hideFormItem('strategicPurchaseId', type === 'add' ? '' : data.strategicPurchaseId)}
          </Col>
          <Row>
            <Col span={12}>
              <FormItem label='战略采购代码' {...formLayout}>
                {
                  isView ? <span>{data.strategicPurchaseCode}</span> :getFieldDecorator('strategicPurchaseCode', {
                    initialValue: type === 'add' ? '' : data.strategicPurchaseCode,
                  })(
                    <Input disabled={true} placeholder='请输入战略采购代码' style={{ width: '100%' }}/>,
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='战略采购名称' {...formLayout}>
                {
                  isView ? <span>{data.strategicPurchaseName}</span> :getFieldDecorator('strategicPurchaseName', {
                    initialValue: type === 'add' ? '' : data.strategicPurchaseName,
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
