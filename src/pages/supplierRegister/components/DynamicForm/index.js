/**
 * 实现功能： 高级查询表单组件
 * 使用说明见 README.md
 * auth: hezhi
 * version: 0.0.1
 * date: 2020-04-01
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
} from '../../../../utils/commonProps'
import { checkSupplierName } from '../../../../services/supplierRegister'
import UploadFile from '../../../../components/Upload/index'
import { toUpperCase } from '@/utils/index'
import { getEntityId } from "../../CommonUtils";
import SearchTable from '../SearchTable'
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
    const { attachmentId = null, ...fs } = fields;
    setFieldsValue(fs)
  }
  //注册地址同步办公地址
  function registerChange(value) {
    console.log(value)
    form.setFieldsValue({ office: value });
  }
  //检查供应商名称
  async function handleCheckName() {
    const name = form.getFieldValue('supplierVo.name');
    if (name.indexOf(' ') !== -1) {
      message.error('供应商名称不允许存在空格，请重新输入');
      //this.setChecks('checkSupplierNameResult', false);
      return false;
    }

    if (name) {
      const { success, message: msg } = await checkSupplierName({ supplierName: name, supplierId: '' });
      if (success) {
        message.success('供应商名称可以使用');
      } else {
        message.error('供应商名称已存在，请重新输入');
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
      // if (this.state.checks && !this.state.checks.checkCreditCodeResult) {
      //   setChecks('checkCreditCodeResult', true);
      // }
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
  //校验重复
  function setChecks(type, status) {
    // let checks = this.state.checks;
    // if (type === "checkSupplierNameResult") {
    //   checks.checkSupplierNameResult = status;
    // }
    // if (type === "checkCreditCodeResult") {
    //   checks.checkCreditCodeResult = status;
    // }
    // this.setState({
    //   checks: checks,
    // });
  };
  function onlyNumber(event) {
    let value = event.target.value;
    event.target.value = value.replace(/[^\d]/g, '');
  }
  let entityIdObj = getEntityId(editData);
  function handletypeSelect(item) {
    selectfication(item.id)
  }
  // 泛虹公司选择
  function RainbowChange(value, record) {
    if (record) {
      setcompanycode(record.code)
      form.setFieldsValue({
        'supplierVo.name': record.name,
        'supplierVo.bukrName': record.name
      });
    }
  }
  function FactoryChange() {
    
  }
  // 拟合作公司
  function cooperationChange(value, record) {
    console.log(record)
    if (record) {
      form.setFieldsValue({
        'supplierVo.companyName': record.name,
        'supplierVo.companyCode': record.code
      });
    }
  }
  return (
    <Row type="flex">
      {
        formItems.map((item, index) => {
          //const Item = Combos[item.type] || Input;
          if (!!item.type && item.verifi === '0' || !!item.type && item.verifi === '1') {
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
                        label={item.title} {...formItemLayout} >
                        {
                          isView ?
                            <span>{editData && editData.supplierVo && editData.supplierVo.supplierCategory ? editData.supplierVo.supplierCategory.code + ' ' + editData.supplierVo.supplierCategory.name : ''}</span> :
                            getFieldDecorator('supplierVo.supplierCategoryId'),
                          getFieldDecorator('supplierVo.supplierCategoryName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.supplierCategoryId : '',
                            rules: [{ required: item.verifi === '0', message: '请选择供应商分类', whitespace: true }],
                          })(
                            <ComboTree
                              disabled={approve === true || change === true}
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
                      label={item.title} {...formItemLayout} >
                      {isView ?
                        <span>{editData && editData.supplierVo && editData.supplierVo.name ? editData && editData.supplierVo && editData.supplierVo.name : ''}</span> :
                        getFieldDecorator('supplierVo.name', {
                          initialValue: editData && editData.supplierVo && editData.supplierVo.name
                            ? editData.supplierVo.name : '',
                          rules: [{ required: item.verifi === '0', message: "请输入供应商名称！", }]
                        })(
                          <Input
                            disabled={change === true}
                            onBlur={handleCheckName}
                            maxLength={40}
                            placeholder={'请输入供应商名称'} />
                        )}
                    </FormItem>
                  </Col> : null}
                  {item.key === 'abbreviation' ? <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={item.title}
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
                            maxLength={10}
                            placeholder={'请输入简称'} />
                        )}
                    </FormItem>
                  </Col> : null}
                  {item.key === 'creditCode' ? <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={item.title}
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
                          getFieldDecorator('supplierVo.enterprisePropertyId'),
                          getFieldDecorator('supplierVo.enterprisePropertyName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.enterprisePropertyId : '',
                            rules: [{ required: item.verifi === '0', message: '请选择企业性质', whitespace: true }],
                          })(
                            <ComboList
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
                            getFieldDecorator('supplierVo.taxpayersCategoryId'),
                          getFieldDecorator('supplierVo.taxpayersCategoryName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.taxpayersCategoryId : '',
                            rules: [{ required: item.verifi === '0', message: '请选择纳税人类别', whitespace: true }],
                          })(
                            <ComboList
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
                            getFieldDecorator('supplierVo.belongIndustry'),
                          getFieldDecorator('supplierVo.belongIndustryName', {
                            initialValue: editData && editData.supplierVo ? editData.supplierVo.belongIndustry : '',
                            rules: [{ required: item.verifi === '0', message: '请选择业务标的物', whitespace: true }],
                          })(
                            <ComboList
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
                            getFieldDecorator("supplierVo.customsEnterprisesEreditStatusValue"),
                            getFieldDecorator("supplierVo.customsEnterprisesEreditStatusName", {
                              initialValue: editData && editData.supplierVo ? editData.supplierVo.customsEnterprisesEreditStatusValue : '',
                              rules: [{ required: item.verifi === '0', message: '请选择海关企业信用状况', whitespace: true }],
                            })(
                              <ComboList
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
                              <Input />,
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
                              rules: [{ required: item.verifi === '0', message: '请选择泛虹公司', whitespace: true }],
                            })(
                              <SearchTable
                                onChange={RainbowChange}
                                config={oddcorporationSupplierConfig}
                                placeholder="请选择公司"
                              />
                              // <ComboGrid
                              //   form={form}
                              //   {...corporationSupplierConfig}
                              //   name='supplierVo.bukrCode'
                              // />
                            )
                        }
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
                       {
                         isView ?
                           <span>{editData && editData.supplierVo && editData.supplierVo.supplierCategory ? editData.supplierVo.supplierCategory.companyCoded : ''}</span> :
                           getFieldDecorator('supplierVo.bukrName', {
                             initialValue: editData && editData.supplierVo ? editData.supplierVo.bukrName : '',
                             rules: [{required: true, message: '请选择泛虹公司', whitespace: true}],
                           })(
                             <SearchTable
                                onChange={RainbowChange}
                               config={oddcorporationSupplierConfig}
                             />
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
                              rules: [{ required: item.verifi === '0', message: '请选择泛虹工厂', whitespace: true }],
                            })(
                              <SearchTable
                                onChange={FactoryChange}
                                config={oddcompanyOrgConfigByCode}
                                selectChange={this.deleteSelect}
                                params={{ corporationCode: companycode }}
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
                           getFieldDecorator("countryId"),
                            getFieldDecorator("countryName", {
                              // initialValue: editData ? {
                              //   label: editData.extendVo.countryName
                              //   , key: editData.extendVo.countryId
                              // } : "",
                              rules: [{
                                required: item.verifi === '0',
                                message: '请选择国家!',
                              }]
                            })(
                              <ComboList
                                {...countryListConfig}
                                form={form} showSearch={false}
                                name="countryName"
                                field={["countryId"]}
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
                                maxLength={35}
                                placeholder={"请输入英文地址"} />
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.type === 'dbCode' ? <Col span={8}>
                      <FormItem
                        {...formItemLayout}
                        label={'邓白氏码'}
                      >
                        {isView ?
                          <span>{editData && editData.supplierVo && editData.supplierVo.dbCode ? editData && editData.supplierVo && editData.supplierVo.dbCode : ''}</span> :
                          getFieldDecorator('supplierVo.dbCode', {
                            initialValue: editData && editData.supplierVo && editData.supplierVo.dbCode
                              ? editData.supplierVo.dbCode : '',
                            rules: [{ required: item.verifi === '0', message: "请输入邓白氏码", whitespace: true }]
                          })(
                            <Input
                              maxLength={9}
                              onChange={creditCodeChange}
                              placeholder={'请输入邓白氏码'} />
                          )}
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
                              entityId={entityIdObj ? entityIdObj['注册授权委托书'] : null} />
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
                              initialValue: wholeData && wholeData ? wholeData.companyCode : '',
                              rules: [{ required: item.verifi === '0', message: "请选择公司", whitespace: true }]
                            })(
                              <SearchTable
                                onChange={(value, record) => cooperationChange(value, record)}
                                config={oddcorporationSupplierConfig}
                                placeholder="请选择公司"
                              />
                            )
                        }
                      </FormItem>
                    </Col> : null
                  }
                  {
                    item.key === 'companyName' ? <Col span={8} style={{display:'none'}}>
                      <FormItem
                        {...formItemLayout}
                        label={'拟合作长虹公司'}
                      >
                        {
                          isView ?
                            <span></span> :
                            getFieldDecorator("supplierVo.companyName", {
                              initialValue: wholeData && wholeData ? wholeData.companyCode : '',
                              rules: [{ required: item.verifi === '0', message: "请选择公司", whitespace: true }]
                            })(
                              <SearchTable
                                onChange={cooperationChange}
                                config={oddcorporationSupplierConfig}
                                placeholder="请选择公司"
                              />
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
                              onChange={registerChange}
                              provinceConfig={chineseProvinceTableConfig}
                              cityConfig={cityListConfig}
                              areaConfig={areaListConfig}
                              isView={true}
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
                              provinceConfig={chineseProvinceTableConfig}
                              cityConfig={cityListConfig}
                              areaConfig={areaListConfig}
                              isView={true}
                            />,
                          )
                      }
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