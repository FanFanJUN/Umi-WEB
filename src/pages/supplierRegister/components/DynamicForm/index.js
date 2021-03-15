/**
 * 实现功能： 注册基础信息表单组件
 * 使用说明见 README.md
 * auth: yf
 * version: 0.0.1
 * date: 2020-09-01
 */

import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Button, Row, Col, Form, Input, DatePicker, message } from 'antd';
import { MixinSelect, ComboMultiple, ComboAttachment } from '@/components';
import CascadeAddressSelect from "../CascadeAddressSelect";
import PriceInput from "../PriceInput"
import {
  ComboGrid,
  ComboList,
  ComboTree,
  MoneyInput
} from 'suid'
import {
  orgnazationProps,
  purchaseCompanyPropsreg,
  customsEnterpriseAll,
  industryConfig,
  enterprisePropertyConfig,
  listAllTaxpayersCategory,
  corporationSupplierConfig,
  companyOrgConfigByCode,
  countryListConfig,
  chineseProvinceTableConfig,
  cityListConfig,
  areaListConfig,
  currencyListConfigWithoutAuth,
  oddcorporationSupplierConfig,
  oddcompanyOrgConfigByCode,
  Identification,
  Identificationtask,
  corporationProps,
  corporationPropsModify
} from '../../../../utils/commonProps'
import { checkSupplierName } from '../../../../services/supplierRegister'
import UploadFile from '../../../../components/Upload/index'
import { toUpperCase } from '@/utils/index'
import { getEntityId } from "../../CommonUtils";
import { baseUrl } from '../../../../utils/commonUrl';
import SearchTable from '../SearchTable'
import styles from './index.less';
import { conformsTo, values } from 'lodash';
let entityIdObj;
const { create } = Form;
const { RangePicker } = DatePicker
const FormItem = Form.Item;
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
  isView,
  editData = [],
  wholeData = [],
  selectfication = () => null,
  setName = () => null,
  approve,
  change
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [companycode, setcompanycode] = useState([]);
  const [supplierName, setsupplierName] = useState('');
  const [companyid, setCompanyid] = useState('');
  const [iscountry, setiscountry] = useState(false);
  useEffect(() => {
    setother(editData)
    entityIdObj = getEntityId(editData);
    countryEdit(editData)
  }, [editData])

  function setother(val) {
    setsupplierName(val.supplierName)
    if (val && val.supplierVo) {
      setCompanyid(val.supplierVo.bukrCode)
    }

  }
  //注册地址同步办公地址
  function registerChange(value) {
    form.setFieldsValue({ office: value });
  }
  //检查供应商名称
  async function handleCheckName() {
    const name = form.getFieldValue('supplierVo.name').trim();
    setsupplierName(name)
    setName(name);
    name.trim()
    if (name) {
      const { success, message: msg } = await checkSupplierName({ supplierName: name, supplierId: '' });
      if (success) {
        message.success('供应商名称可以使用');
      } else {
        message.error('供应商名称已存在，请重新输入');
        form.setFieldsValue({
          'supplierVo.name': ''
        })
        return false
      }
    }
  }
  //检查统一社会信用代码
  function handleCheckCreditCode() {
    const creditCode = form.getFieldValue('supplierVo.creditCode');
    if (creditCode.indexOf(' ') !== -1) {
      message.error('社会信用代码不允许存在空格，请重新输入');
      return false;
    }
  }
  //检查统一社会信用代码格式效验
  function creditCodeChange(event) {
    let value = event.target.value;
    event.target.value = value.toUpperCase();
    if (value && value.match("^[A-Z0-9]{18}$")) {

    }
  }
  //校验资金数量
  function checkPrice(rule, value, callback) {
    if (typeof value.number !== 'undefined' && !value.number) {
      callback('请输入有效资金数量');
      return false;
    }
    if (!value.currency) {
      callback('请选择币种');
      return false;
    }
    callback();
  };
  //校验省市
  function checkAddress(rule, value, callback) {
    if (!value.province) {
      callback('请选择省');
      return false;
    }
    if (!value.city) {
      callback('请选择城市');
      return false;
    }
    if (!value.area) {
      callback('请选择区县');
      return false;
    }
    if (!value.street) {
      callback('请填写详细地址');
      return false;
    }
    callback();
  };
  function onlyNumber(event) {
    let value = event.target.value;
    event.target.value = value.replace(/[^\d]/g, '');
  }

  // 供应商分类切换
  function handletypeSelect(item) {
    selectfication(item.id)
  }
  function changevalue(val) {
    setsupplierName(val.name)
    setCompanyid(val.code)
    form.setFieldsValue({
      'supplierVo.name': val.name,
    });
  }
  // 泛虹工厂
  function FactoryChange(value) {
    form.setFieldsValue({
      //'supplierVo.workName': record.name,
      'supplierVo.name': supplierName + '(' + value.code + '工厂' + ')'
    });
  }
  function countryEdit(val) {
    if (val.extendVo.countryName === '中国') {
      setiscountry(false)
    } else {
      setiscountry(true)
    }
  }
  // 国家限制
  function CountryChange(val) {
    if (val.name === '中国' && val.code === 'CN') {
      setiscountry(false)
    } else {
      setiscountry(true)
    }
  }
  return (
    <Row type="flex">
      {
        formItems.map((item, index) => {
          if (!!item.type && item.verifi === '0' || !!item.type && item.verifi === '1' || !!item.type && item.verifi === '2') {
            if (item.key !== 'registerProvinceCode' || item.key !== 'registerProvinceId') {
              return (
                <>
                  {item.key === 'supplierCategoryName' ?
                    <Col
                      key={`${item.key}-${index}`}
                      span={8}
                      style={{ display: item.verifi === '3' ? 'none' : 'block' }}
                    >
                      <FormItem style={{ width: '100%', marginBottom: 10 }}
                        label="供应商分类" {...formItemLayout} >
                        {
                          isView ?
                            <span>{editData && editData.supplierVo && editData.supplierVo.supplierCategory ? editData.supplierVo.supplierCategory.code + ' ' + editData.supplierVo.supplierCategory.name : ''}</span> :
                            getFieldDecorator('supplierVo.supplierCategoryId', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.supplierCategoryId : ''
                            }),
                          getFieldDecorator('supplierVo.supplierCategoryName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.supplierCategoryName : '',
                            rules: [{ required: item.verifi === '0', message: '请选择供应商分类', whitespace: true }],
                          })(
                            <ComboTree
                              disabled={item.verifi === '2'}
                              {...purchaseCompanyPropsreg}
                              form={form} showSearch={false}
                              name='supplierVo.supplierCategoryName'
                              field={['supplierVo.supplierCategoryId']}
                              afterSelect={(item) => handletypeSelect(item)}
                            />,
                          )
                        }
                      </FormItem>
                    </Col> : null}
                  {item.key === 'name' ? <Col
                    span={8}
                    style={{ display: item.verifi === '3' ? 'none' : 'block' }}
                  >
                    <FormItem style={{ width: '100%', marginBottom: 10 }}
                      label={'供应商名称'} {...formItemLayout} >
                      {isView ?
                        <span>{editData && editData.supplierVo && editData.supplierVo.name ? editData && editData.supplierVo && editData.supplierVo.name : ''}</span> :
                        getFieldDecorator('supplierVo.name', {
                          initialValue: editData && editData.supplierVo && editData.supplierVo.name
                            ? editData.supplierVo.name : '',
                          rules: [{ required: item.verifi === '0', message: "请输入供应商名称！", }]
                        })(
                          <Input
                            disabled={item.verifi === '2'}
                            onBlur={handleCheckName}
                            maxLength={40}
                            placeholder={'请输入供应商名称'} />
                        )}
                    </FormItem>
                  </Col> : null}
                  {item.key === 'abbreviation' ? <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'简称'}
                      style={{ width: '100%', marginBottom: 10 }}
                    >
                      {isView ? <span>{editData && editData.extendVo ? editData.extendVo.searchCondition : ''}</span> :
                        getFieldDecorator('extendVo.searchCondition', {
                          initialValue: editData && editData.extendVo ? editData.extendVo.searchCondition : '',
                          rules: [{ required: item.verifi === '0', message: "请输入简称！" },
                          { pattern: "^[\u4E00-\u9FA5]+$", message: "只能是汉字" }

                          ]
                        })(
                          <Input
                            disabled={item.verifi === '2'}
                            maxLength={10}
                            placeholder={'请输入简称'} />
                        )}
                    </FormItem>
                  </Col> : null}
                  {item.key === 'englishabbreviation' ? <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'英文简称'}
                      style={{ width: '100%', marginBottom: 10 }}
                    >
                      {isView ? <span>{editData && editData.extendVo ? editData.extendVo.searchCondition : ''}</span> :
                        getFieldDecorator('extendVo.searchCondition', {
                          initialValue: editData && editData.extendVo ? editData.extendVo.searchCondition : '',
                          rules: [{ required: item.verifi === '0', message: "请输入英文简称！" },
                          { pattern: "^[\u0391-\uFFE5A-Za-z]+$", message: "只能是汉字或英文" }

                          ]
                        })(
                          <Input
                            disabled={item.verifi === '2'}
                            maxLength={10}
                            placeholder={'请输入英文简称'} />
                        )}
                    </FormItem>
                  </Col> : null}
                  {item.key === 'creditCode' ? <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'统一社会信用代码'}
                      style={{ width: '100%', marginBottom: 10 }}
                    >
                      {isView ? <span>{editData && editData.supplierVo && editData.supplierVo.creditCode ? editData && editData.supplierVo && editData.supplierVo.creditCode : ''}</span> :
                        getFieldDecorator('supplierVo.creditCode', {
                          initialValue: editData && editData.supplierVo && editData.supplierVo.creditCode
                            ? editData.supplierVo.creditCode : '',
                          rules: [{ required: item.verifi === '0', message: "请输入统一社会信用代码！" },
                          { pattern: "^[A-Z0-9]{18}$", message: "只能是18位大写英文和数字" }]
                        })(
                          <Input
                            disabled={item.verifi === '2'}
                            onBlur={handleCheckCreditCode}
                            maxLength={18}
                            placeholder={'请输入统一社会信用代码'} />
                        )}
                    </FormItem>
                  </Col> : null}
                  {
                    item.key === 'legalPerson' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'法人姓名'}
                        style={{ width: '100%', marginBottom: 10 }}
                      >
                        {
                          isView ? <span>{editData && editData.extendVo ? editData.extendVo.legalPerson : ''}</span> :
                            getFieldDecorator('extendVo.legalPerson', {
                              initialValue: editData && editData.extendVo ? editData.extendVo.legalPerson : '',
                              rules: [{ required: item.verifi === '0', message: '请输入法人姓名', whitespace: true }],
                            })(
                              <Input
                                disabled={item.verifi === '2'}
                                maxLength={40}
                                placeholder={'请输入法人姓名'} />,
                            )
                        }
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
                        {
                          isView ?
                            <span>{editData && editData.supplierVo && editData.supplierVo.enterpriseProperty ? editData.supplierVo.enterpriseProperty.name : ''}</span> :
                            getFieldDecorator('supplierVo.enterprisePropertyId', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.enterprisePropertyId : '',
                            }),
                          getFieldDecorator('supplierVo.enterprisePropertyName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.enterprisePropertyName : '',
                            rules: [{ required: item.verifi === '0', message: '请选择企业性质', whitespace: true }],
                          })(
                            <ComboList
                              disabled={item.verifi === '2'}
                              {...enterprisePropertyConfig}
                              form={form} showSearch={false}
                              name='supplierVo.enterprisePropertyName'
                              field={['supplierVo.enterprisePropertyId']}
                            />,
                          )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'taxpayersCategoryName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'纳税人类别'}
                      >
                        {
                          isView ?
                            <span>{editData && editData.supplierVo && editData.supplierVo.taxpayersCategory ? editData.supplierVo.taxpayersCategory.name : ''}</span> :
                            getFieldDecorator('supplierVo.taxpayersCategoryId', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.taxpayersCategoryId : '',
                            }),
                          getFieldDecorator('supplierVo.taxpayersCategoryName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.taxpayersCategoryName : '',
                            rules: [{ required: item.verifi === '0', message: '请选择纳税人类别', whitespace: true }],
                          })(
                            <ComboList
                              disabled={item.verifi === '2'}
                              {...listAllTaxpayersCategory}
                              form={form} showSearch={false}
                              name='supplierVo.taxpayersCategoryName'
                              field={['supplierVo.taxpayersCategoryId']}
                            />,
                          )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'belongGroupName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'所属集团'}
                      >
                        {
                          isView ?
                            <span>{editData && editData.supplierVo ? editData.supplierVo.belongGroupName : ''}</span> :
                            getFieldDecorator('supplierVo.belongGroupName', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.belongGroupName : '',
                              rules: [{ required: item.verifi === '0', message: '请填写所属集团', whitespace: true }],
                            })(
                              <Input
                                disabled={item.verifi === '2'}
                                maxLength={30}
                                placeholder={'若无，则填写本单位名称'}
                              />,
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'belongIndustryName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'业务标的物'}
                      >
                        {
                          isView ?
                            <span>{editData && editData.supplierVo ? editData.supplierVo.belongIndustryName : ''}</span> :
                            getFieldDecorator('supplierVo.belongIndustry', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.belongIndustry : '',
                            }),
                          getFieldDecorator('supplierVo.belongIndustryName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.belongIndustryName : '',
                            rules: [{ required: item.verifi === '0', message: '请选择业务标的物', whitespace: true }],
                          })(
                            <ComboList
                              disabled={item.verifi === '2'}
                              {...industryConfig}
                              form={form} showSearch={false}
                              name='supplierVo.belongIndustryName'
                              field={['supplierVo.belongIndustry']}
                            />,
                          )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'regFund' ? <Col
                      span={8}
                    >
                      <FormItem style={{ width: '100%', marginBottom: 10 }}
                        label={'注册资金'} {...formItemLayout} >
                        {
                          isView ?
                            <span>{editData && editData.extendVo && editData.extendVo.regFund && editData.extendVo.currency ? editData.extendVo.regFund + '' + '万' + editData.extendVo.currency.name : ''}</span> :
                            getFieldDecorator('regFund', {
                              initialValue: {
                                number: editData && editData.extendVo ? editData.extendVo.regFund : '',
                                currency: editData && editData.extendVo ? editData.extendVo.currencyId : '',
                              },
                              rules: [{
                                required: item.verifi === '0',
                                type: 'object',
                                message: '注册资金不能为空',
                                whitespace: true
                              }, { validator: checkPrice },],
                            })(
                              <PriceInput
                                disabled={item.verifi}
                                max={10000000000}
                                initValue={true}
                                placeholder={'请输入注册资金'}
                                currencyConfig={currencyListConfigWithoutAuth}
                                unit="10000"
                              />,
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }

                  {
                    item.key === 'postcode' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'邮编'}
                      >
                        {
                          isView ? <span>{editData && editData.supplierVo ? editData.supplierVo.postcode : ''}</span> :
                            getFieldDecorator('supplierVo.postcode', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.postcode : '',
                              rules: [
                                { required: item.verifi === '0', whitespace: true, message: '请输入邮编' },
                                { pattern: '^[0-9]{6}$', message: '请输入正确格式的邮编' },
                              ],
                            })(
                              <Input
                                disabled={item.verifi === '2'}
                                maxLength={6}
                                placeholder={'请输入邮编'} />,
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }

                  {
                    item.key === 'fax' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'传真'}
                      >
                        {
                          isView ? <span>{editData && editData.supplierVo ? editData.supplierVo.fax : ''}</span> :
                            getFieldDecorator('supplierVo.fax', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.fax : '',
                              rules: [
                                { required: item.verifi === '0', whitespace: true, message: "请输入传真" },
                                //  {pattern: "^\\d{11}$", message: "请输入11位格式的传真"}
                              ],
                            })(
                              <Input
                                disabled={item.verifi === '2'}
                                maxLength={40}
                                placeholder={'请输入传真'} />,
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'telephone' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'联系电话'}
                      >
                        {
                          isView ? <span>{editData && editData.supplierVo ? editData.supplierVo.telephone : ''}</span> :
                            getFieldDecorator('supplierVo.telephone', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.telephone : '',
                              rules: [
                                { required: item.verifi === '0', whitespace: true, message: "请输入联系电话" },
                                // {pattern: "^[1-9](\\d){10}$", message: '请输入非0开头11位手机号！'}
                              ],
                            })(
                              <Input
                                disabled={item.verifi === '2'}
                                onChange={onlyNumber}
                                // maxLength={11}
                                placeholder={'请输入联系电话'} />,
                            )
                        }
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
                              required: item.verifi === '0',
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
                        {
                          isView ?
                            <span>{editData && editData.supplierVo ? editData.supplierVo.customsAeoCode : ''}</span> :
                            getFieldDecorator("supplierVo.customsAeoCode", {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.customsAeoCode : '',
                              rules: [{ required: item.verifi === '0' }, { pattern: "^[A-Z0-9]*$", message: "只能是大写英文和数字" }]
                            })(
                              <Input
                                disabled={item.verifi === '2'}
                                onChange={toUpperCase}
                                maxLength={30} />
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'customsEnterprisesEreditStatusValue' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'海关企业信用状况'}
                      >
                        {
                          isView ?
                            <span>{editData && editData.supplierVo ? editData.supplierVo.customsEnterprisesEreditStatusName : ''}</span> :
                            getFieldDecorator("supplierVo.customsEnterprisesEreditStatusValue", {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.customsEnterprisesEreditStatusValue : '',
                            }),
                          getFieldDecorator("supplierVo.customsEnterprisesEreditStatusName", {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.customsEnterprisesEreditStatusName : '',
                            rules: [{ required: item.verifi === '0', message: '请选择海关企业信用状况', whitespace: true }],
                          })(
                            <ComboList
                              disabled={item.verifi === '2'}
                              {...customsEnterpriseAll}
                              form={form} showSearch={false}
                              name='supplierVo.customsEnterprisesEreditStatusName'
                              field={["supplierVo.customsEnterprisesEreditStatusValue"]}
                            />,
                          )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'enterpriseWebsite' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'企业网址'}
                      >
                        {
                          isView ? <span>{editData && editData.extendVo ? editData.extendVo.enterpriseWebsite : ''}</span> :
                            getFieldDecorator("extendVo.enterpriseWebsite", {
                              initialValue: editData && editData.extendVo ? editData.extendVo.enterpriseWebsite : '',
                              rules: [
                                { required: item.verifi === '0' },
                                { pattern: "^([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$", message: "请填写正确网址" }]
                            })(
                              <Input
                                disabled={item.verifi === '2'}
                              />,
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'bukrName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'泛虹公司'}
                      >
                        {
                          isView ?
                            <span>{editData && editData.supplierVo ? editData.supplierVo.bukrName : ''}</span> :
                            getFieldDecorator('supplierVo.bukrCode', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.bukrCode : '',
                            }),
                          getFieldDecorator('supplierVo.bukrName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.bukrName : '',
                            rules: [{ required: item.verifi === '0', message: '请选择泛虹公司', whitespace: true }],
                          })(
                            <ComboList
                              disabled={item.verifi === '2'}
                              {...corporationPropsModify}
                              form={form}
                              name="supplierVo.bukrName"
                              field={["supplierVo.bukrCode"]}
                              afterSelect={changevalue}
                            />,
                          )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'workName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'泛虹工厂'}
                      >
                        {
                          isView ?
                            <span>{editData && editData.supplierVo ? editData.supplierVo.workName : ''}</span> :
                            getFieldDecorator('supplierVo.workCode', {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.workCode : '',
                            }),
                          getFieldDecorator('supplierVo.workName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.workName : '',
                            rules: [{ required: item.verifi === '0', message: '请选择泛虹工厂', whitespace: true }],
                          })(
                            <ComboList
                              showSearch={false}
                              style={{ width: '100%' }}
                              {...Identificationtask}
                              cascadeParams={{ corporationCode: companyid }}
                              name='supplierVo.workName'
                              store={{
                                url: `${baseUrl}/factory/findByCorporationCode?Q_EQ_frozen__bool=0&corporationCode=` + companyid,
                                type: 'POST',
                              }}
                              field={['supplierVo.workCode']}
                              form={form}
                              afterSelect={FactoryChange}
                              disabled={item.verifi === '2'}
                            />
                          )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'countryName' ? <Col span={8}>
                      <FormItem
                        label={"国家"}
                        {...formItemLayout}
                      >
                        {
                          isView ? <span>{editData && editData.extendVo ? editData.extendVo.countryName : ''}</span> :
                            getFieldDecorator("extendVo.countryId", {
                              initialValue: editData && editData.extendVo ? editData.extendVo.countryId : "",
                            }),
                          getFieldDecorator("extendVo.countryName", {
                            initialValue: editData && editData.extendVo ? editData.extendVo.countryName : "",
                            rules: [{
                              required: item.verifi === '0',
                              message: '请选择国家!',
                            }]
                          })(
                            <ComboList
                              disabled={item.verifi === '2'}
                              {...countryListConfig}
                              form={form}
                              name="extendVo.countryName"
                              field={["extendVo.countryId"]}
                              afterSelect={CountryChange}
                            />,
                          )}
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'englishName' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={"供应商英文名称"}
                      >
                        {
                          isView ? <span>{editData && editData.extendVo ? editData.extendVo.englishName : ""}</span> :
                            getFieldDecorator("extendVo.englishName", {
                              initialValue: editData && editData.extendVo ? editData.extendVo.englishName : "",
                              rules: [{
                                required: item.verifi === '0',
                                message: "请输入供应商英文名称",
                                whitespace: true
                              }]
                            })(
                              <Input
                                disabled={item.verifi === '2'}
                                maxLength={200}
                                placeholder={"请输入供应商英文名称"} />
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'street' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={"地址"}
                      >
                        {isView ? <span>{editData && editData.extendVo ? editData.extendVo.registerStreet : ''}</span> :
                          getFieldDecorator("extendVo.registerStreet", {
                            initialValue: editData && editData.extendVo ? editData.extendVo.registerStreet : '',
                            rules: [{ required: item.verifi === '0', message: "请输入地址", whitespace: !isView }]
                          })(
                            <Input
                              disabled={item.verifi === '2'}
                              maxLength={35}
                              placeholder={"请输入地址"} />
                          )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'englishAddress' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={"英文地址"}
                      >
                        {
                          isView ? <span>{editData ? editData.extendVo.englishAddress : ""}</span> :
                            getFieldDecorator("extendVo.englishAddress", {
                              //initialValue: editData ? editData.extendVo.englishAddress : "",
                              rules: [{ required: item.verifi === '0', message: "请输入英文地址", whitespace: true }]
                            })(
                              <Input
                                disabled={item.verifi === '2'}
                                maxLength={35}
                                placeholder={"请输入英文地址"} />
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'dbCode' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'邓白氏码'}
                      >
                        {
                          getFieldDecorator('supplierVo.dbCode', {
                            initialValue: editData && editData.supplierVo && editData.supplierVo.dbCode
                              ? editData.supplierVo.dbCode : '',
                            rules: [{ required: item.verifi === '0', message: "请输入邓白氏码", whitespace: true }]
                          })(
                            <Input
                              disabled={item.verifi === '2'}
                              maxLength={9}
                              onChange={creditCodeChange}
                              placeholder={'请输入邓白氏码'} />
                          )
                        }
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
                              required: item.verifi === '0',
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
                              required: item.verifi === '0',
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
                        {
                          isView ?
                            <span></span> :
                            getFieldDecorator("supplierVo.companyCode", {
                              initialValue: wholeData && wholeData ? wholeData.companyCode : "",
                            }),
                          getFieldDecorator("supplierVo.companyName", {
                            initialValue: wholeData && wholeData ? wholeData.companyName : '',
                            rules: [{ required: item.verifi === '0', message: "请选择公司", whitespace: true }]
                          })(
                            <ComboList
                              disabled={item.verifi === '2'}
                              {...corporationPropsModify}
                              form={form}
                              name="supplierVo.companyName"
                              field={["supplierVo.companyCode"]}
                            />,
                          )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'registerProvinceCode' ? <Col span={16}>
                      <FormItem
                        labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
                        label={'注册地址'}
                      >
                        {
                          isView ?
                            <span>{editData && editData.extendVo && editData.extendVo.registerRegionName ? editData.extendVo.registerProvinceName + editData.extendVo.registerRegionName + editData.extendVo.registerDistrictName + editData.extendVo.registerStreet : ''}</span> :
                            getFieldDecorator('register', {
                              initialValue: {
                                province: {
                                  key: editData && editData.extendVo ? editData.extendVo.registerProvinceId : '',
                                  label: editData && editData.extendVo ? editData.extendVo.registerProvinceName : '',
                                },
                                city: {
                                  key: editData && editData.extendVo ? editData.extendVo.registerRegionId : '',
                                  label: editData && editData.extendVo ? editData.extendVo.registerRegionName : '',
                                },
                                area: {
                                  key: editData && editData.extendVo ? editData.extendVo.registerDistrictId : '',
                                  label: editData && editData.extendVo ? editData.extendVo.registerDistrictName : '',
                                },
                                street: editData && editData.extendVo ? editData.extendVo.registerStreet : '',
                              },
                              rules: [{
                                required: item.verifi === '0',
                                type: 'object',
                                message: '注册地址不能空',
                                whitespace: true,
                              }, { validator: checkAddress },],
                            })(
                              <CascadeAddressSelect
                                disabled={item.verifi}
                                onChange={registerChange}
                                provinceConfig={chineseProvinceTableConfig}
                                cityConfig={cityListConfig}
                                areaConfig={areaListConfig}
                                isView={true}
                                iscountry={iscountry}
                              />,
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'registerProvinceId' ? <Col span={16}>
                      <FormItem
                        labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
                        label={'办公地址'}
                      >
                        {
                          isView ?
                            <span>{editData && editData.extendVo && editData.extendVo.officeProvinceName ? editData.extendVo.officeProvinceName + editData.extendVo.officeRegionName + editData.extendVo.officeDistrictName + editData.extendVo.officeStreet : ''}</span> :
                            getFieldDecorator('office', {
                              initialValue: {
                                province: {
                                  key: editData && editData.extendVo ? editData.extendVo.officeProvinceId : '',
                                  label: editData && editData.extendVo ? editData.extendVo.officeProvinceName : '',
                                },
                                city: {
                                  key: editData && editData.extendVo ? editData.extendVo.officeRegionId : '',
                                  label: editData && editData.extendVo ? editData.extendVo.officeRegionName : '',
                                },
                                area: {
                                  key: editData && editData.extendVo ? editData.extendVo.officeDistrictId : '',
                                  label: editData && editData.extendVo ? editData.extendVo.officeDistrictName : '',
                                },
                                street: editData && editData.extendVo ? editData.extendVo.officeStreet : '',
                              },
                              rules: [{
                                required: item.verifi === '0',
                                type: 'object',
                                message: '办公地址不能为空',
                                whitespace: true,
                              }, { validator: checkAddress },],
                            })(
                              <CascadeAddressSelect
                                disabled={item.verifi}
                                provinceConfig={chineseProvinceTableConfig}
                                cityConfig={cityListConfig}
                                areaConfig={areaListConfig}
                                isView={true}
                                iscountry={iscountry}
                              />,
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
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