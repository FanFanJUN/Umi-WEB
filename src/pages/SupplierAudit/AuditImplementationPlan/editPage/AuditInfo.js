/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:37:22
 * @LastEditTime : 2020-12-21 16:31:35
 * @LastEditors  : LiCai
 * @Description: 审核实施计划-拟审核信息
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/AuditImplementationPlan/editPage/AuditInfo.js
 */
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Col, Form, Row, Input, Pagination } from 'antd';
import { ComboList, ExtTable, utils } from 'suid';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { AreaConfig, CountryIdConfig } from '../../AnnualAuditPlan/propsParams';
import { basicServiceUrl, gatewayUrl } from '../../../../utils/commonUrl';

const { storage } = utils;
const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const formItemLayoutLong = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const width = 160;

const AuditInfo = forwardRef((props, ref) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;
  const { isView, type, originData = {}, form } = props;
  const [tabList, setTableList] = useState([]);
  const [formData, setFormData] = useState({});

  let columns = [
    {
      title: '月度审核计划行号',
      dataIndex: 'reviewImplementPlanLinenum',
      width: 140,
      align: 'center',
      render: (text, item) => text ? text : item.reviewPlanMonthLinenum,
    },
    {
      title: '需求公司', dataIndex: 'applyCorporationName', width: 200, align: 'center', render: (text, item) => {
        return item.applyCorporationCode + ' ' + text;
      },
    },
    {
      title: '采购组织', dataIndex: 'purchaseTeamName', align: 'center', width: 180, render: (text, item) => {
        return item.purchaseTeamCode + ' ' + text;
      },
    },
    {
      title: '物料分类', dataIndex: 'materialGroupName', align: 'center', width: 160, render: (text, item) => {
        return item.materialGroupCode + ' ' + text;
      },
    },
    { title: '物料级别', dataIndex: 'materialGradeName', align: 'center', width: 80 },
    { title: '审核类型', dataIndex: 'reviewTypeName', align: 'center', width: 100 },
    { title: '审核原因', dataIndex: 'reviewReasonName', align: 'center', width: 140 },
    { title: '审核组织方式', dataIndex: 'reviewOrganizedWayName', align: 'center', width: 120 },
  ];
  if (type === 'detail') {
    columns = columns.concat([
      {
        title: '是否生成审核报告',
        dataIndex: 'whetherReported',
        align: 'center',
        width: 120,
        render: text => text ? '是' : '否',
      },
    ]);
  }

  useEffect(() => {
    if (type === 'add') {
      let selectedLine = JSON.parse(sessionStorage.getItem('selectedMonthLIne'));
      setTableList(selectedLine);
      setFormData(selectedLine[0]);
    } else {
      setTableList(originData.reviewImplementPlanLineBos ? originData.reviewImplementPlanLineBos : []);
      setFormData(originData);
    }
  }, [type, originData]);

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
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'月度审核计划号'} style={{ marginBottom: '0px' }}>
                {
                  isView ? <span>{formData.reviewPlanMonthCode}</span> :
                    <Input disabled={true} value={formData.reviewPlanMonthCode} />
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核方式'} style={{ marginBottom: '0px' }}>
                {
                  isView ? <span>{formData.reviewWayName}</span> :
                    <Input disabled={true} value={formData.reviewWayName} />
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'供应商'} style={{ marginBottom: '0px' }}>
                {
                  isView ? <span>{formData.supplierName}</span> :
                    <Input disabled={true} value={formData.supplierName} />
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'代理商'} style={{ marginBottom: '0px' }}>
                {
                  isView ? <span>{formData.agentName}</span> : <Input disabled={true} value={formData.agentName} />
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {
                isView ?
                  <FormItem  {...formItemLayoutLong} label={'生产厂地址'} style={{ marginBottom: '0px' }}>
                    <span>{formData.countryName + formData.provinceName + formData.cityName + formData.countyName + formData.address}</span>
                  </FormItem>
                  :
                  <Row>
                    <Col span={0}>
                      {hideFormItem('countryId', formData.countryId ? formData.countryId : '')}
                    </Col>
                    <Col span={0}>
                      {hideFormItem('provinceId', formData.provinceId ? formData.provinceId : '')}
                    </Col>
                    <Col span={0}>
                      {hideFormItem('cityId', formData.cityId ? formData.cityId : '')}
                    </Col>
                    <Col span={0}>
                      {hideFormItem('countyId', formData.countyId ? formData.countyId : '')}
                    </Col>
                    <Col span={8}>
                      <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label={'生产厂地址'}
                                style={{ marginBottom: '0px' }}>
                        {
                          getFieldDecorator('countryName', {
                            initialValue: formData.countryName ? formData.countryName : '',
                            rules: [
                              {
                                required: true,
                                message: '国家不能为空',
                              },
                            ],
                          })(
                            <ComboList
                              style={{ width: '100%' }}
                              width={width}
                              form={form}
                              name={'countryName'}
                              field={['countryId']}
                              afterSelect={() => {
                                setFieldsValue({
                                  provinceId: '',
                                  provinceName: '',
                                  cityId: '',
                                  cityName: '',
                                  countyId: '',
                                  countyName: '',
                                  address: '',
                                });
                              }}
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
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{ marginBottom: '0px' }}>
                        {
                          getFieldDecorator('provinceName', {
                            initialValue: formData.provinceName ? formData.provinceName : '',
                            rules: [
                              {
                                required: true,
                                message: '省不能为空',
                              },
                            ],
                          })(
                            <ComboList
                              style={{ width: '100%' }}
                              width={width}
                              form={form}
                              afterSelect={() => {
                                setFieldsValue({
                                  cityId: '',
                                  cityName: '',
                                  countyId: '',
                                  countyName: '',
                                  address: '',
                                });
                              }}
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
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{ marginBottom: '0px' }}>
                        {
                          getFieldDecorator('cityName', {
                            initialValue: formData.cityName ? formData.cityName : '',
                            rules: [
                              {
                                required: true,
                                message: '市不能为空',
                              },
                            ],
                          })(
                            <ComboList
                              style={{ width: '100%' }}
                              width={width}
                              form={form}
                              afterSelect={() => {
                                setFieldsValue({
                                  countyId: '',
                                  countyName: '',
                                  address: '',
                                });
                              }}
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
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{ marginBottom: '0px' }}>
                        {
                          getFieldDecorator('countyName', {
                            initialValue: formData.countyName ? formData.countyName : '',
                            rules: [
                              {
                                required: true,
                                message: '区/县不能为空',
                              },
                            ],
                          })(
                            <ComboList
                              style={{ width: '100%' }}
                              width={width}
                              form={form}
                              afterSelect={() => {
                                setFieldsValue({
                                  address: '',
                                });
                              }}
                              name={'countyName'}
                              field={['countyId']}
                              cascadeParams={{
                                countryId: getFieldValue('cityId'),
                              }}
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
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{ marginBottom: '0px' }}>
                        {
                          getFieldDecorator('address', {
                            initialValue: formData.address ? formData.address : '',
                            rules: [
                              {
                                required: true,
                                message: '详细地址不能为空',
                              },
                            ],
                          })(
                            <Input style={{ width: '100%' }} placeholder={'请输入详细地址'} />,
                          )
                        }
                      </FormItem>
                    </Col>
                  </Row>
                //   <div>
                //     <Input disabled={true} value={formData.countryName} style={{ width: "10%" }} />
                //     <Input disabled={true} value={formData.provinceName} style={{ width: "10%", margin: "0 3px" }} />
                //     <Input disabled={true} value={formData.cityName} style={{ width: "10%" }} />
                //     <Input disabled={true} value={formData.countyName} style={{ width: "10%", margin: "0 3px" }} />
                //     <Input disabled={true} value={formData.address} style={{ width: "50%" }} />
                // </div>
              }
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'供应商联系人'} style={{ marginBottom: '0px' }}>
                {
                  isView ? <span>{formData.contactUserName}</span> :
                    <Input disabled={true} value={formData.contactUserName} />
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'供应商联系方式'}>
                {
                  isView ? <span>{formData.contactUserTel}</span> :
                    <Input disabled={true} value={formData.contactUserTel} />
                }
              </FormItem>
            </Col>
          </Row>
          <div style={{ paddingLeft: '8vw' }}>
            <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '14px', fontWeight: 'bold' }}>行信息</p>
            <ExtTable
              rowKey='id'
              showSearch={false}
              remotePaging={false}
              checkbox={false}
              lineNumber={false}
              bordered={true}
              pagination={<Pagination defaultCurrent={1} total={tabList.length} />}
              onChange={(page, pageSize) => {
                console.log(page, pageSize);
              }}
              size='small'
              columns={columns}
              dataSource={tabList}
            />
          </div>
        </div>
      </div>
    </div>
  );
})

export default Form.create()(AuditInfo);
