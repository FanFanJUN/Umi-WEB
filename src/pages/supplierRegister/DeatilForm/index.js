/**
 * 实现功能： 高级查询表单组件
 * 使用说明见 README.md
 * auth: hezhi
 * version: 0.0.1
 * date: 2020-04-01
 */

import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Button, Row, Col, Form, Input, DatePicker, message } from 'antd';
import UploadFile from '../../../components/Upload/index'
import {getEntityId} from "../CommonUtils";
import styles from './index.less';
import { conformsTo, values } from 'lodash';

const { create } = Form;
const { RangePicker } = DatePicker
const FormItem = Form.Item;
// const Combos = {
//   grid: ComboGrid,
//   list: ComboList,
//   tree: ComboTree,
//   searchTable: ComboGrid,
//   multiple: ComboMultiple,
//   select: MixinSelect,
//   selectTree: ComboTree,
//   rangePicker: RangePicker,
//   upload: ComboAttachment,
//   address: CascadeAddressSelect,
//   regFund: MoneyInput,
//   offaddress: CascadeAddressSelect
// }

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const CommonconfigRef = forwardRef(({
  formItems = [],
  form,
  initialValues = {},
  isView,
  editData = [],
  wholeData = [],
  selectfication = () => null,
  companyData = {},
  approve,
  change
}, ref) => {
  useImperativeHandle(ref, () => ({
    setHeaderFields,
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [companycode, setcompanycode] = useState([ ]);
  
  //console.log(initialValues)
  useEffect(() => {
    // const {
    //     id,
    //     ...other
    // } = initialValues;
    // const fields = {
    //     ...other
    // }
    // console.log(fields)
    // setFieldsValue(fields);

  }, [])
  // 设置表单参数
  function setHeaderFields(fields) {
    // const { attachmentId = null, ...fs } = fields;
    // setFieldsValue(fs)
  }
  let entityIdObj = getEntityId(editData);
  return (
    <Row type="flex">
      {
        formItems.map((item, index) => {
          //const Item = Combos[item.type] || Input;
          if (!!item.type && item.verifi === '0' || !!item.type && item.verifi === '1' || !!item.type && item.verifi === '2') {
            if (item.key !== 'registerProvinceCode' || item.key !== 'registerProvinceId') {
              return (
                <>
                {/* <Col span={8}> */}

                  {item.key === 'supplierCategoryName' ?
                    <Col
                      key={`${item.key}-${index}`}
                      span={8}
                      style={{ display: item.verifi === '3' ? 'none' : 'block' }}
                    >
                      <FormItem style={{ width: '100%', marginBottom: 10 }}
                        label={'供应商分类'} {...formItemLayout} >
                        <span>{editData && editData.supplierVo && editData.supplierVo.supplierCategory ? editData.supplierVo.supplierCategory.code + ' ' + editData.supplierVo.supplierCategory.name : ''}</span>
                      </FormItem>
                    </Col> : null}
                  {item.key === 'name' ? <Col
                    span={8}
                    style={{ display: item.verifi === '3' ? 'none' : 'block' }}
                  >
                    <FormItem style={{ width: '100%', marginBottom: 10 }}
                      label={'供应商名称'} {...formItemLayout} >
                      <span>{editData && editData.supplierVo && editData.supplierVo.name ? editData && editData.supplierVo && editData.supplierVo.name : ''}</span>
                    </FormItem>
                  </Col> : null}
                  {item.key === 'abbreviation' ? <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'简称'}
                      style={{ width: '100%', marginBottom: 10 }}
                    >
                      <span>{editData && editData.extendVo ? editData.extendVo.searchCondition : ''}</span>
                    </FormItem>
                  </Col> : null}
                  {item.key === 'creditCode' ? <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'统一社会信用代码'}
                      style={{ width: '100%', marginBottom: 10 }}
                    >
                      <span>{editData && editData.supplierVo && editData.supplierVo.creditCode ? editData && editData.supplierVo && editData.supplierVo.creditCode : ''}</span>
                    </FormItem>
                  </Col> : null}
                  {
                    item.key === 'legalPerson' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'法人姓名'}
                        style={{ width: '100%', marginBottom: 10 }}
                      >
                        <span>{editData && editData.extendVo ? editData.extendVo.legalPerson : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'enterprisePropertyName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'企业性质'}
                        style={{ width: '100%', marginBottom: 10 }}
                      >
                        <span>{editData && editData.supplierVo && editData.supplierVo.enterpriseProperty ? editData.supplierVo.enterpriseProperty.name : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'taxpayersCategoryName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'纳税人类别'}
                      >
                        <span>{editData && editData.supplierVo && editData.supplierVo.taxpayersCategory ? editData.supplierVo.taxpayersCategory.name : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'belongGroupName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'所属集团'}
                      >
                        <span>{editData && editData.supplierVo ? editData.supplierVo.belongGroupName : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'belongIndustryName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'业务标的物'}
                      >
                        <span>{editData && editData.supplierVo ? editData.supplierVo.belongIndustryName : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'regFund' ? <Col
                    span={8}
                    >
                      <FormItem style={{ width: '100%', marginBottom: 10 }}
                        label={'注册资金'} {...formItemLayout} >
                        <span>{editData && editData.extendVo && editData.extendVo.regFund && editData.extendVo.currency ? editData.extendVo.regFund + '' + '万' + editData.extendVo.currency.name : ''}</span>
                      </FormItem>
                    </Col> : null
                  }

                  {
                    item.key === 'postcode' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'邮编'}
                      >
                        <span>{editData && editData.supplierVo ? editData.supplierVo.postcode : ''}</span>
                      </FormItem>
                    </Col> : null
                  }

                  {
                    item.key === 'fax' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'传真'}
                      >
                        <span>{editData && editData.supplierVo ? editData.supplierVo.fax : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'telephone' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'联系电话'}
                      >
                        <span>{editData && editData.supplierVo ? editData.supplierVo.telephone : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'qualificationTypeNetWork' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'入网须知附件'}
                      >
                        {
                          getFieldDecorator('attachments[\'入网须知\']', {
                            initialValue: [],
                            rules: [{
                              required: false,
                              message: '请上传入网须知附件',
                            }],
                          })(
                            <UploadFile
                              maxSize={10}
                              title={'附件上传'}
                              type={isView ? 'show' : ''}
                              accessType={['pdf', 'jpg', 'png']}
                              warning={'仅支持pdf,jpg,png格式，文件大小不超过10M'}
                              entityId={entityIdObj ? entityIdObj['入网须知'] : null} />
                          )
                        } {!isView && <a href='/srm-se-web/供应商入网须知.docx'>模板下载</a>}
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'customsAeoCode' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'海关AEO编码'}
                      >
                        <span>{editData && editData.supplierVo ? editData.supplierVo.customsAeoCode : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'customsEnterprisesEreditStatusValue' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'海关企业信用状况'}
                      >
                        <span>{editData && editData.supplierVo ? editData.supplierVo.customsEnterprisesEreditStatusName : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'enterpriseWebsite' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'企业网址'}
                      >
                        <span>{editData && editData.extendVo ? editData.extendVo.enterpriseWebsite : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'bukrName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'泛虹公司'}
                      >
                        <span>{editData && editData.supplierVo ? editData.supplierVo.bukrName : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                     item.key === 'bukrName' ? <Col span={8}
                     style={{
                       display:'none'
                     }}>
                     <FormItem
                       {...formItemLayout}
                       label={'泛虹公司'}
                     >
                       <span>{editData && editData.supplierVo && editData.supplierVo.supplierCategory ? editData.supplierVo.supplierCategory.companyCoded : ''}</span>
                     </FormItem>
                   </Col> : null
                  }
                  {
                    item.key === 'workName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'泛虹工厂'}
                      >
                        <span>{editData && editData.supplierVo ? editData.supplierVo.workName : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'countryName' ? <Col span={8}>
                      <FormItem
                        label={"国家"}
                        {...formItemLayout}
                      >
                        <span>{editData && editData.extendVo ? editData.extendVo.countryName : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'englishName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={"供应商英文名称"}
                      >
                        <span>{editData && editData.extendVo ? editData.extendVo.englishName : ""}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'street' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={"地址"}
                      >
                        <span>{editData && editData.extendVo ? editData.extendVo.registerStreet : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {/* {
                    item.key === 'englishAddress' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={"英文地址"}
                      >
                        <span>{editData ? editData.extendVo.englishAddress : ""}</span>
                      </FormItem>
                    </Col> : null
                  } */}
                  {
                    item.key === 'englishAddress' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={"英文地址"}
                      >
                        <span>{editData && editData.extendVo ? editData.extendVo.englishAddress : ""}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'dbCode' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'邓白氏码'}
                      >
                        <span>{editData && editData.supplierVo && editData.supplierVo.dbCode ? editData && editData.supplierVo && editData.supplierVo.dbCode : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'qualificationTypeReg' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'注册登记证书'}
                      >
                        {
                          getFieldDecorator('attachments[\'注册登记证书\']', {
                            initialValue: [],
                            rules: [{
                              required: false,
                              message: '请上传注册登记证书',
                            }],
                          })(
                            <UploadFile
                              maxSize={10}
                              title={'附件上传'}
                              type={isView ? 'show' : ''}
                              accessType={['pdf', 'jpg', 'png']}
                              warning={'仅支持pdf,jpg,png格式，文件大小不超过10M'}
                              entityId={entityIdObj ? entityIdObj['注册登记证书'] : null} />
                          )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'qualificationTypeGrant' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'授权委托书'}
                      >
                        {
                          getFieldDecorator('attachments[\'授权委托书\']', {
                            initialValue: [],
                            rules: [{
                              required: false,
                              message: '请上传授权委托书',
                            }],
                          })(
                            <UploadFile
                              maxSize={10}
                              title={'附件上传'}
                              type={isView ? 'show' : ''}
                              accessType={['pdf', 'jpg', 'png']}
                              warning={'仅支持pdf,jpg,png格式，文件大小不超过10M'}
                              entityId={entityIdObj ? entityIdObj['授权委托书'] : null} />
                          )
                        } {!isView && <a href='/srm-se-web/供应商法定代表人授权委托书.docx'>模板下载</a>}
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'companyName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'拟合作长虹公司'}
                      >
                        <span>{companyData && companyData ? companyData.companyName : ''}</span>
                      </FormItem>
                    </Col> : null
                  }
                  {
                  item.key === 'registerProvinceCode' ? <Col span={8}>
                    <FormItem
                      labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
                      label={'注册地址'}
                    >
                      <span>{editData && editData.extendVo && editData.extendVo.registerRegionName ? editData.extendVo.registerProvinceName + editData.extendVo.registerRegionName + editData.extendVo.registerDistrictName + editData.extendVo.registerStreet : ''}</span>
                    </FormItem>
                  </Col> : null
                  }
                  {
                  item.key === 'registerProvinceId' ? <Col span={8}>
                    <FormItem
                      labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
                      label={'办公地址'}
                    >
                      <span>{editData && editData.extendVo && editData.extendVo.officeProvinceName ? editData.extendVo.officeProvinceName + editData.extendVo.officeRegionName + editData.extendVo.officeDistrictName + editData.extendVo.officeStreet : ''}</span>
                    </FormItem>
                  </Col> : null
                }
                {/* </Col> */}
                
                </>
              )
            }
          }
        })
      }
    </Row>
  )
})

const CommonForm = create()(CommonconfigRef)

export default CommonForm