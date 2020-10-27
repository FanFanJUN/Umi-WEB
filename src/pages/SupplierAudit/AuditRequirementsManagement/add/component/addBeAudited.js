import React, { useEffect } from 'react';
import {ComboTree, ComboList, ExtModal } from 'suid';
import { Col, Form, Input, message, Row } from 'antd';
import {
  DocumentAuditCauseManagementConfig,
  NormalSupplierConfig,
  SelectionStrategyConfig,
} from '../../../mainData/commomService';
import { smBaseUrl } from '../../../../../utils/commonUrl';
import { documentMaterialClassProps } from '../../../../../utils/commonProps';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};


const AddBeAudited = (props) => {

  const { visible, title, form, type } = props;

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  const clearSelected = () => {

  };

  useEffect(() => {
    if (props.allAuditType && props.allAuditType.length !== 0) {
      props.allAuditType.map(item => {
        if (item.name === '追加审核') {
          console.log(item);
          setFieldsValue({
            reviewTypeId: item.id,
            reviewTypeCode: item.code,
          });
        }
      });
    }
  }, [props.allAuditType]);

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
    <ExtModal
      width={'90vh'}
      maskClosable={false}
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={0}>
            {hideFormItem('reviewTypeId', type === 'add' ? '' : fatherData.reviewTypeId)}
          </Col>
          <Col span={0}>
            {hideFormItem('reviewTypeCode', type === 'add' ? '' : fatherData.reviewTypeCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核类型'}>
              {
                getFieldDecorator('reviewTypeName', {
                  initialValue: type === 'add' ? '追加审核' : '',
                  rules: [
                    {
                      required: true,
                      message: '审核类型不能为空',
                    },
                  ],
                })(
                  <Input disabled={true}/>,
                )
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('reviewReasonId', type === 'add' ? '' : fatherData.reviewReasonId)}
          </Col>
          <Col span={0}>
            {hideFormItem('reviewReasonCode', type === 'add' ? '' : fatherData.reviewReasonCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核原因'}>
              {
                getFieldDecorator('reviewReasonName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '审核原因不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'reviewReasonName'}
                    field={['reviewReasonCode', 'reviewReasonId']}
                    {...DocumentAuditCauseManagementConfig}
                  />,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商选择方式'}>
              {
                getFieldDecorator('supplierStrategyName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '供应商选择方式不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'supplierStrategyName'}
                    {...SelectionStrategyConfig}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('supplierId', type === 'add' ? '' : fatherData.supplierId)}
          </Col>
          <Col span={0}>
            {hideFormItem('supplierCode', type === 'add' ? '' : fatherData.supplierCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商'}>
              {
                getFieldDecorator('supplierName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '供应商不能为空',
                    },
                  ],
                })(
                  <ComboList
                    disabled={getFieldValue('supplierStrategyName') !== '正常供应商'}
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'supplierName'}
                    field={['supplierCode', 'supplierId']}
                    store={{
                      params: {
                        corpAndPurOrgs: [{
                          corporationCode: props.companyCode,
                          purchaseOrgCode: props.organizationCode,
                        }],
                      },
                      type: 'POST',
                      autoLoad: false,
                      url: `${smBaseUrl}/api/supplierService/findNormalSuppliersByInfo `,
                    }}
                    {...NormalSupplierConfig}
                  />,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={0}>
            {hideFormItem('agentId', type === 'add' ? '' : fatherData.agentId)}
          </Col>
          <Col span={0}>
            {hideFormItem('agentCode', type === 'add' ? '' : fatherData.agentCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'代理商'}>
              {
                getFieldDecorator('agentName', {
                  initialValue: type === 'add' ? '' : '',
                })(
                  <Input/>,
                )
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('materialGroupId', type === 'add' ? '' : fatherData.materialGroupId)}
          </Col>
          <Col span={0}>
            {hideFormItem('materialGroupCode', type === 'add' ? '' : fatherData.materialGroupCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'物料分类'}>
              {
                getFieldDecorator('materialGroupName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '物料分类不能为空',
                    },
                  ],
                })(
                  <ComboTree
                    disabled={getFieldValue('supplierStrategyName') !== '正常供应商'}
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'materialGroupName'}
                    field={['materialGroupCode', 'materialGroupId']}
                    {...documentMaterialClassProps}
                  />,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={0}>
            {hideFormItem('countryId', type === 'add' ? '' : fatherData.countryId)}
          </Col>
          <Col span={0}>
            {hideFormItem('countryCode', type === 'add' ? '' : fatherData.countryCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('provinceId', type === 'add' ? '' : fatherData.provinceId)}
          </Col>
          <Col span={0}>
            {hideFormItem('provinceCode', type === 'add' ? '' : fatherData.provinceCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('cityId', type === 'add' ? '' : fatherData.cityId)}
          </Col>
          <Col span={0}>
            {hideFormItem('cityCode', type === 'add' ? '' : fatherData.cityCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('countyId', type === 'add' ? '' : fatherData.countyId)}
          </Col>
          <Col span={0}>
            {hideFormItem('countyCode', type === 'add' ? '' : fatherData.countyCode)}
          </Col>

          <Col span={24}>
            <FormItem {...formItemLayout} label={'生产厂地址'}>
              {
                getFieldDecorator('countryName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '国家不能为空',
                    },
                  ],
                })(
                  <ComboList
                    disabled={getFieldValue('supplierStrategyName') !== '正常供应商'}
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'supplierName'}
                    field={['supplierCode', 'supplierId']}
                    {...NormalSupplierConfig}
                  />,
                )
              }
              {
                getFieldDecorator('provinceName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '省不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '15%' }}/>,
                )
              }
              {
                getFieldDecorator('cityName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '市不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '15%' }}/>,
                )
              }
              {
                getFieldDecorator('countyName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '区/县不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '15%' }}/>,
                )
              }
              {
                getFieldDecorator('address', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '详细地址不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '40%' }}/>,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商联系人'}>
              {
                getFieldDecorator('contactUserName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '供应商联系人不能为空',
                    },
                  ],
                })(
                  <Input/>,
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商联系方式'}>
              {
                getFieldDecorator('contactUserTel', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '供应商联系方式不能为空',
                    },
                  ],
                })(
                  <Input/>,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'备注'}>
              {
                getFieldDecorator('remark', {
                  initialValue: type === 'add' ? '' : '',
                })(
                  <Input.TextArea rows={6} style={{ width: '100%' }}/>,
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  );

};

export default Form.create()(AddBeAudited);
