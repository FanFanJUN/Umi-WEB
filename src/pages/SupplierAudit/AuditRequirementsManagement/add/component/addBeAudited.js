import React, { useEffect, useState } from 'react';
import { ComboTree, ComboList, ExtModal } from 'suid';
import { Col, Form, Input, message, Row } from 'antd';
import {
  AreaConfig, CountryIdConfig,
  DocumentAuditCauseManagementConfig, GetSupplierContact, length_200_n,
  NormalSupplierConfig,
  SelectionStrategyConfig,
} from '../../../mainData/commomService';
import { basicServiceUrl, gatewayUrl, recommendUrl, smBaseUrl } from '../../../../../utils/commonUrl';
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
    visible: false,
  });

  const { visible, title, form, type, editData } = props;

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        props.onOk(values);
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
    getSupplierContact(value.id);
    console.log(value, '供应商');
  };

  // 获取供应商联系人
  const getSupplierContact = (id) => {
    GetSupplierContact({
      supplierId: id,
    }).then(res => {
      console.log(res, '联系人');
    });
  };

  useEffect(() => {
    if (props.allAuditType && props.allAuditType.length !== 0 && visible) {
      props.allAuditType.map(item => {
        if (item.name === '追加审核') {
          setFieldsValue({
            reviewTypeId: item.id,
            reviewTypeCode: item.code,
          });
        }
      });
    }
  }, [visible]);

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

  const openSupplierModal = () => {
    if (getFieldValue('supplierStrategyName')) {
      setData(v => ({ ...v, visible: true }));
    } else {
      message.error('请先选择供应商选择策略!');
    }
  };

  const supplierStrategyChange = () => {
    setFieldsValue({
      agentName: '',
      agentCode: '',
      agentId: '',
      supplierName: '',
      supplierCode: '',
      supplierId: '',
    });
  };

  const supplierOk = (value) => {
    const { materielCategory, supplier, supplier: { supplierExtend } } = value;
    if (value.originSupplierName) {
      setFieldsValue({
        supplierName: value.originSupplierName,
        supplierCode: value.originSupplierCode,
        supplierId: value.originSupplierId,
        agentName: supplier.name,
        agentCode: supplier.code,
        agentId: supplier.id,
      });
    } else {
      setFieldsValue({
        agentName: value.originSupplierName,
        agentCode: value.originSupplierCode,
        agentId: value.originSupplierId,
        supplierName: supplier.name,
        supplierCode: supplier.code,
        supplierId: supplier.id,
      });
    }
    setFieldsValue({
      materialGroupName: materielCategory.name,
      materialGroupCode: materielCategory.code,
      materialGroupId: materielCategory.id,
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
    getSupplierContact(value.supplierId);
    setData(v => ({ ...v, visible: false }));
    console.log(value);
  };

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
            {hideFormItem('reviewTypeId', type === 'add' ? '' : editData.reviewTypeId)}
          </Col>
          <Col span={0}>
            {hideFormItem('reviewTypeCode', type === 'add' ? '' : editData.reviewTypeCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核类型'}>
              {
                getFieldDecorator('reviewTypeName', {
                  initialValue: editData.reviewTypeName ? editData.reviewTypeName : '追加审核',
                  rules: [
                    {
                      required: true,
                      message: '审核类型不能为空',
                    },
                  ],
                })(
                  <Input disabled={true} />,
                )
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('reviewReasonId', type === 'add' ? '' : editData.reviewReasonId)}
          </Col>
          <Col span={0}>
            {hideFormItem('reviewReasonCode', type === 'add' ? '' : editData.reviewReasonCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核原因'}>
              {
                getFieldDecorator('reviewReasonName', {
                  initialValue: editData.reviewReasonName ? editData.reviewReasonName : '',
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
        <Col span={0}>
          {hideFormItem('supplierStrategyCode', type === 'add' ? '' : editData.supplierStrategyCode)}
        </Col>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商选择方式'}>
              {
                getFieldDecorator('supplierStrategyName', {
                  initialValue: editData.supplierStrategyName ? editData.supplierStrategyName : '',
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
                    afterSelect={supplierStrategyChange}
                    form={form}
                    field={['supplierStrategyCode']}
                    name={'supplierStrategyName'}
                    {...SelectionStrategyConfig}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('supplierId', type === 'add' ? '' : editData.supplierId)}
          </Col>
          <Col span={0}>
            {hideFormItem('supplierCode', type === 'add' ? '' : editData.supplierCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商'}>
              {
                getFieldDecorator('supplierName', {
                  initialValue: editData.supplierName ? editData.supplierName : '',
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
                      url: `${recommendUrl}/common/findNormalSuppliers`,
                    }}
                    {...NormalSupplierConfig}
                  />,
                )
              }
              {
                getFieldValue('supplierStrategyName') !== '正常供应商' &&
                <a style={{ marginLeft: '2%' }} onClick={openSupplierModal}>选择</a>
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={0}>
            {hideFormItem('agentId', type === 'add' ? '' : editData.agentId)}
          </Col>
          <Col span={0}>
            {hideFormItem('agentCode', type === 'add' ? '' : editData.agentCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'代理商'}>
              {
                getFieldDecorator('agentName', {
                  initialValue: editData.agentName ? editData.agentName : '',
                })(
                  <ComboList
                    disabled={getFieldValue('supplierStrategyName') !== '正常供应商'}
                    allowClear={true}
                    style={getFieldValue('supplierStrategyName') !== '正常供应商' ? { width: '88%' } : { width: '100%' }}
                    form={form}
                    name={'agentName'}
                    field={['agentCode', 'agentId']}
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
                      url: `${recommendUrl}/common/findNormalSuppliers`,
                    }}
                    {...NormalSupplierConfig}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('materialGroupId', type === 'add' ? '' : editData.materialGroupId)}
          </Col>
          <Col span={0}>
            {hideFormItem('materialGroupCode', type === 'add' ? '' : editData.materialGroupCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'物料分类'}>
              {
                getFieldDecorator('materialGroupName', {
                  initialValue: editData.materialGroupName ? editData.materialGroupName : '',
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
            {hideFormItem('countryId', type === 'add' ? '' : editData.countryId)}
          </Col>
          <Col span={0}>
            {hideFormItem('provinceId', type === 'add' ? '' : editData.provinceId)}
          </Col>
          <Col span={0}>
            {hideFormItem('cityId', type === 'add' ? '' : editData.cityId)}
          </Col>
          <Col span={0}>
            {hideFormItem('countyId', type === 'add' ? '' : editData.countyId)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'生产厂地址'}>
              {
                getFieldDecorator('countryName', {
                  initialValue: editData.countryName ? editData.countryName : '',
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
                  initialValue: editData.provinceName ? editData.provinceName : '',
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
                  initialValue: editData.cityName ? editData.cityName : '',
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
                  initialValue: editData.countyName ? editData.countyName : '',
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
                  initialValue: editData.address ? editData.address : '',
                  rules: [
                    {
                      required: true,
                      message: '详细地址不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '40%' }} placeholder={'请输入详细地址'} />,
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
                  initialValue: editData.contactUserName ? editData.contactUserName : '',
                  rules: [
                    {
                      required: true,
                      message: '供应商联系人不能为空',
                    },
                  ],
                })(
                  <Input />,
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商联系方式'}>
              {
                getFieldDecorator('contactUserTel', {
                  initialValue: editData.contactUserTel ? editData.contactUserTel : '',
                  rules: [
                    {
                      required: true,
                      message: '供应商联系方式不能为空',
                    },
                  ],
                })(
                  <Input />,
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
                  initialValue: editData.contactUserTel ? editData.contactUserTel : '',
                  rules: [{ validator: length_200_n, message: '请勿超过200个汉字' }],
                })(
                  <Input.TextArea rows={5} style={{ width: '100%' }} />,
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
      <AddSupplier
        visible={data.visible}
        onOk={supplierOk}
        onCancel={() => setData(v => ({ ...v, visible: false }))}
      />
    </ExtModal>
  );

};

export default Form.create()(AddBeAudited);
