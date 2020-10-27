import React, { useEffect, useState } from 'react';
import { ComboTree, ComboList, ExtModal } from 'suid';
import { Col, Form, Input, message, Row } from 'antd';
import {
  AreaConfig, CountryIdConfig,
  DocumentAuditCauseManagementConfig,
  NormalSupplierConfig,
  SelectionStrategyConfig,
} from '../../../mainData/commomService';
import { basicServiceUrl, gatewayUrl, smBaseUrl } from '../../../../../utils/commonUrl';
import { documentMaterialClassProps } from '../../../../../utils/commonProps';
import AddSupplier from './addSupplier';

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

  const [data, setData] = useState({
    visible: false
  })

  const { visible, title, form, type } = props;

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.onOk(values)
      }
    });
  };

  const clearSelected = () => {

  };

  const supplierSelect = (value) => {
    const { supplierExtend } = value;
    setFieldsValue({
      countryId: supplierExtend.countryId,
      countryName: supplierExtend.countryName,
      provinceId: supplierExtend.officeProvinceId,
      provinceName: supplierExtend.officeProvinceName,
      cityId: supplierExtend.officeRegionId,
      cityName: supplierExtend.officeRegionId,
      countyId: supplierExtend.officeDistrictId,
      countyName: supplierExtend.officeDistrictName,
      address: supplierExtend.officeStreet,
    });
    getSupplierContact()
    console.log(value, '供应商');
  };

  // 获取供应商联系人
  const getSupplierContact = () => {

  }

  useEffect(() => {
    if (props.allAuditType && props.allAuditType.length !== 0) {
      props.allAuditType.map(item => {
        if (item.name === '追加审核') {
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

  const openSupplierModal = () => {
    if (getFieldValue('supplierStrategyName')) {
      setData(v => ({...v, visible: true}))
    } else {
      message.error('请先选择供应商选择策略!')
    }
  }

  const supplierOk = (value) => {
    const {materielCategory, supplier} = value
    setFieldsValue({
      materialGroupName: materielCategory.name,
      materialGroupCode: materielCategory.code,
      materialGroupId: materielCategory.id,
      supplierName: supplier.name,
      supplierCode: supplier.code,
      supplierId: supplier.id
    })
    setData(v => ({...v, visible: false}))
    console.log(value)
  }

  return (
    <ExtModal
      width={'110vh'}
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
                    style={getFieldValue('supplierStrategyName') !== '正常供应商' ? { width: '88%' } : { width: '100%' }}
                    form={form}
                    name={'supplierName'}
                    field={['supplierCode', 'supplierId']}
                    afterSelect={supplierSelect}
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
              {
                getFieldValue('supplierStrategyName') !== '正常供应商' && <a style={{ marginLeft: '2%' }} onClick={openSupplierModal}>选择</a>
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
            {hideFormItem('provinceId', type === 'add' ? '' : fatherData.provinceId)}
          </Col>
          <Col span={0}>
            {hideFormItem('cityId', type === 'add' ? '' : fatherData.cityId)}
          </Col>
          <Col span={0}>
            {hideFormItem('countyId', type === 'add' ? '' : fatherData.countyId)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'生产厂地址'}>
              {
                getFieldDecorator('countryName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '国家/省/市/区县/详细地址不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '15%' }}
                    form={form}
                    name={'countryName'}
                    field={['countryId']}
                    store={{
                      params: {
                        filters: [{ fieldName: 'code', fieldType: 'string', operator: 'EQ', value: 'CN' }],
                      },
                      type: 'POST',
                      autoLoad: false,
                      url: `${gatewayUrl}${basicServiceUrl}/region/findByPage`,
                    }}
                    placeholder={'选择国家'}
                    {...CountryIdConfig}
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
                  <ComboList
                    allowClear={true}
                    style={{ width: '15%' }}
                    form={form}
                    name={'provinceName'}
                    field={['provinceId']}
                    cascadeParams={{
                      countryId: getFieldValue('countryId'),
                    }}
                    store={{
                      params: {
                        countryId: getFieldValue('countryId'),
                      },
                      type: 'GET',
                      autoLoad: false,
                      url: `${gatewayUrl}${basicServiceUrl}/region/getProvinceByCountry`,
                    }}
                    placeholder={'选择省'}
                    {...AreaConfig}
                  />,
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
                  <ComboList
                    allowClear={true}
                    style={{ width: '15%' }}
                    form={form}
                    name={'cityName'}
                    field={['cityId']}
                    cascadeParams={{
                      provinceId: getFieldValue('provinceId'),
                    }}
                    store={{
                      params: {
                        provinceId: getFieldValue('provinceId'),
                      },
                      type: 'GET',
                      autoLoad: false,
                      url: `${gatewayUrl}${basicServiceUrl}/region/getCityByProvince`,
                    }}
                    placeholder={'选择市'}
                    {...AreaConfig}
                  />,
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
                  <ComboList
                    allowClear={true}
                    style={{ width: '15%' }}
                    form={form}
                    name={'countyName'}
                    field={['countyId']}
                    store={{
                      params: {
                        includeSelf: false,
                        nodeId: getFieldValue('cityId'),
                      },
                      type: 'GET',
                      autoLoad: false,
                      url: `${gatewayUrl}${basicServiceUrl}/region/getChildrenNodes`,
                    }}
                    placeholder={'选择区/县'}
                    {...AreaConfig}
                  />,
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
                  <Input style={{ width: '40%' }} placeholder={'请输入详细地址'}/>,
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
      <AddSupplier
        visible={data.visible}
        onOk={supplierOk}
        onCancel={() => setData(v => ({...v, visible: false}))}
      />
    </ExtModal>
  );

};

export default Form.create()(AddBeAudited);
