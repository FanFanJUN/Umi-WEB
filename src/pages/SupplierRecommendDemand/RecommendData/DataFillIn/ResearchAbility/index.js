/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:53:17
 * @LastEditTime: 2020-09-22 10:32:49
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/ResearchAbility/index.js
 * @Description: 研发能力 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Spin,
  PageHeader,
  Radio,
  Row,
  Col,
  Input,
  InputNumber,
  Divider,
  message
} from 'antd';
import styles from '../../DataFillIn/index.less';
import EditorTable from '../../../../../components/EditorTable';
import { router } from 'dva';
import moment from 'moment';
import { requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';
import { currencyTableProps } from '../../../../../utils/commonProps';

const { Item: FormItem, create } = Form;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const ResearchAbility = ({ form, updateGlobalStatus }) => {

  const [data, setData] = useState({});
  const [patentsAwards, setpatentsAwards] = useState([]);
  const [newProducts, setnewProducts] = useState([]);
  const [processingDesigns, setprocessingDesigns] = useState([]);
  const [productStandards, setproductStandards] = useState([]);
  const [loading, setLoading] = useState(false);

  const { query: { id, type = 'add' } } = router.useLocation();
  const {
    getFieldDecorator,
    setFieldsValue,
    getFieldsValue,
    validateFieldsAndScroll
  } = form;
  const {
    devMaxCycle = 0,
    devMinCycle = 0
  } = getFieldsValue()
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, success, message: msg } = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'researchAbilityTab' });
      if (success) {
        const { newProducts, patentsAwards, processingDesigns, productStandards, ...other } = data;
        await setData(data)
        await setFieldsValue(other)
        await setnewProducts(newProducts.map(item => ({ ...item, guid: item.id })));
        await setpatentsAwards(patentsAwards.map(item => ({ ...item, guid: item.id })))
        await setprocessingDesigns(processingDesigns.map(item => ({ ...item, guid: item.id })))
        await setproductStandards(productStandards.map(item => ({ ...item, guid: item.id })))
      } else {
        message.error(msg);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 专利/获奖情况
  const columns = [
    {
      title: "专利号/获奖证书",
      dataIndex: "patentsAwardsCertificate",
      ellipsis: true,
    },
    {
      title: "成果说明",
      dataIndex: "resultDescription",
      ellipsis: true,
    },
    {
      title: "时间",
      dataIndex: "date",
      render(text) {
        return text && moment(text).format('YYYY-MM-DD')
      },
      width: 160,
    },
    {
      title: "专利所有者",
      dataIndex: "possessor",
      ellipsis: true,
    },
    {
      title: "是否涉及提供给长虹的产品",
      dataIndex: "involveChanghong",
      render(text) {
        return Object.is(null, text) ? '' : text ? '是' : '否'
      },
      width: 168,
    }
  ];
  const fields = [
    {
      label: "专利号/获奖证书",
      name: "patentsAwardsCertificate",
      options: {
        rules: [
          {
            required: true,
            message: '专利号/获奖证书不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入专利号或获奖证书'
      }
    },
    {
      label: "成果说明",
      name: "resultDescription",
      options: {
        rules: [
          {
            required: true,
            message: '成果说明不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写成果说明'
      }
    },
    {
      label: "时间",
      name: "date",
      options: {
        rules: [
          {
            required: true,
            message: '时间不能为空'
          }
        ]
      },
      fieldType: 'datePicker',
      disabledDate: (current, mn) => current && current > mn(),
      props: {
        placeholder: '请选择获得时间'
      },
    },
    {
      label: "专利所有者",
      name: "possessor",
      options: {
        rules: [
          {
            required: true,
            message: '专利所有者不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写专利所有者'
      },
      ellipsis: true,
    },
    {
      label: "是否涉及提供给长虹的产品",
      name: "involveChanghong",
      options: {
        rules: [
          {
            required: true,
            message: '请选择是否涉及提供给长虹的产品'
          }
        ]
      },
      props: {
        placeholder: '选择是否涉及提供给长虹的产品'
      },
      fieldType: 'select',
    }
  ];
  const finishFields = [
    {
      label: "产品名称",
      name: "productName",
      props: {
        disabled: true
      }
    },
    {
      label: "产品特点",
      name: "productFeature",
      ellipsis: true,
      options: {
        rules: [
          {
            required: true,
            message: '产品特点不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写产品特点'
      }
    },
    {
      label: "新品销售金额(万元)",
      name: "salesPrice",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '新品销售金额不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请填写新品销售金额'
      }
    },
    {
      label: "总销售金额(万元)",
      name: "totalSalesMoney",
      disabledTarget: 'salesPrice',
      options: {
        rules: [
          {
            required: true,
            message: '总销售金额不能为空'
          },
          {
            validator: (_, val, cb, targetValue) => {
              if (val > targetValue) {
                cb('总销售金额不能高于新品销售金额')
                return
              }
              cb()
            }
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请填写总销售金额'
      },
      fieldType: 'inputNumber',
    },
    {
      name: 'currencyName',
      label: '币种',
      fieldType: 'comboList',
      props: {
        name: 'currencyName',
        field: ['currencyId'],
        placeholder: '请选择币种',
        ...currencyTableProps
      },
      options: {
        rules: [
          {
            required: true,
            message: '币种不能为空'
          }
        ]
      }
    },
    {
      label: "获奖情况",
      name: "awardSituation",
      options: {
        rules: [
          {
            required: true,
            message: '获奖情况不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写获奖情况'
      }
    },
    {
      label: "设计定型日期",
      name: "designFinalizeDate",
      fieldType: 'datePicker',
      disabledDate: (current, mn) => current && current > mn(),
      options: {
        rules: [
          {
            required: true,
            message: '设计定型日期不能为空'
          }
        ]
      }
    }
  ];
  // 已完成的新产品开发
  const columnsForFinish = [
    {
      title: "产品名称",
      dataIndex: "productName",
    },
    {
      title: "产品特点",
      dataIndex: "productFeature",
    },
    {
      title: "新品销售金额(万元)",
      dataIndex: "salesPrice",
    },
    {
      title: "总销售金额(万元)",
      dataIndex: "totalSalesMoney",
    },
    {
      title: "币种",
      dataIndex: "currencyName",
    },
    {
      title: "获奖情况",
      dataIndex: "awardSituation",
    },
    {
      title: "设计定型日期",
      dataIndex: "designFinalizeDate",
      render: function (text, context) {
        return text && moment(text).format('YYYY-MM-DD');
      }
    }
  ];

  // 正在进行和计划进行的设计开发
  const processFields = [
    {
      label: "项目名称",
      name: "projectName",
      options: {
        rules: [
          {
            required: true,
            message: '项目名称不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写项目名称'
      }
    },
    {
      label: "项目内容",
      name: "projectContent",
      options: {
        rules: [
          {
            required: true,
            message: '项目内容不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写项目内容'
      }
    },
    {
      label: "项目人员构成",
      name: "projectStaff",
      options: {
        rules: [
          {
            required: true,
            message: '项目人员构成不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写项目人员构成'
      }
    },
    {
      label: "时间安排",
      name: "datePlan",
      options: {
        rules: [
          {
            required: true,
            message: '时间安排不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写时间安排'
      }
    },
    {
      label: "项目成果",
      name: "projectResult",
      options: {
        rules: [
          {
            required: true,
            message: '项目成果不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写项目成果'
      }
    }
  ]
  const columnsForProcess = [
    {
      title: "项目名称",
      dataIndex: "projectName",
    },
    {
      title: "项目内容",
      dataIndex: "projectContent",
    },
    {
      title: "项目人员构成",
      dataIndex: "projectStaff",
    },
    {
      title: "时间安排",
      dataIndex: "datePlan",
    },
    {
      title: "项目成果",
      dataIndex: "projectResult",
    }
  ];

  const proStaFields = [
    {
      label: "使用标准名称/编号",
      name: "standardName",
      options: {
        rules: [
          {
            required: true,
            message: '使用标准名称/编号不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写使用标准名称/编号'
      }
    },
    {
      label: "国家/行业标准名称、编号",
      name: "countryIndustryStandard",
      options: {
        rules: [
          {
            required: true,
            message: '国家/行业标准名称、编号不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写国家/行业标准名称、编号'
      }
    },
    {
      label: "先进指标",
      name: "advancedIndicator",
      options: {
        rules: [
          {
            required: true,
            message: '先进指标不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写先进指标'
      }
    },
    {
      label: "低于国家/行业标准的指标",
      name: "lowerIndicator",
      options: {
        rules: [
          {
            required: true,
            message: '低于国家/行业标准的指标不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写低于国家/行业标准的指标'
      }
    }
  ]
  // 产品执行标准
  const columnsForProSta = [
    {
      title: "使用标准名称/编号",
      dataIndex: "standardName",
      ellipsis: true,
    },
    {
      title: "国家/行业标准名称、编号",
      dataIndex: "countryIndustryStandard",
      ellipsis: true,
    },
    {
      title: "先进指标",
      dataIndex: "advancedIndicator",
      ellipsis: true,
    },
    {
      title: "低于国家/行业标准的指标",
      dataIndex: "lowerIndicator",
      ellipsis: true,
    },
  ];

  async function handleSave() {
    const value = await validateFieldsAndScroll();
    const saveParams = {
      ...value,
      patentsAwards: patentsAwards,
      processingDesigns: processingDesigns,
      productStandards: productStandards,
      newProducts: newProducts,
      recommendDemandId: id,
      id: data.id
    };
    const params = filterEmptyFileds({ tabKey: 'researchAbilityTab', ...saveParams });
    setLoading(true)
    const { success, message: msg } = await requestPostApi(params);
    setLoading(false)
    if (success) {
      message.success('保存研发能力成功');
      updateGlobalStatus();
      return
    }
    message.error(msg);
  }
  async function handleHodeData() {
    const value = getFieldsValue();
    const saveParams = {
      ...value,
      patentsAwards: patentsAwards,
      processingDesigns: processingDesigns,
      productStandards: productStandards,
      newProducts: newProducts,
      recommendDemandId: id,
      id: data.id
    };
    const params = filterEmptyFileds({ tabKey: 'researchAbilityTab', ...saveParams });
    setLoading(true)
    const { success, message: msg } = await requestPostApi(params, { tempSave: true });
    setLoading(false)
    if (success) {
      message.success('研发能力暂存成功');
      updateGlobalStatus();
      return
    }
    message.error(msg);
  }

  async function handleSave() {
    const value = await validateFieldsAndScroll();
    const saveParams = {
      ...value,
      patentsAwards: patentsAwards,
      processingDesigns: processingDesigns,
      productStandards: productStandards,
      newProducts: newProducts,
      recommendDemandId: id,
      id: data.id
    };
    const params = filterEmptyFileds({ tabKey: 'researchAbilityTab', ...saveParams });
    setLoading(true)
    const { success, message: msg } = await requestPostApi(params);
    setLoading(false)
    if (success) {
      message.success('保存研发能力成功');
      updateGlobalStatus();
      return
    }
    message.error(msg);
  }
  return (
    <div>
      <Spin spinning={loading}>
        <PageHeader
          ghost={false}
          style={{
            padding: '0px'
          }}
          title="研发能力"
          extra={type === 'add' ? [
            <Button key="save" type="primary" style={{ marginRight: '12px' }} disabled={loading} onClick={handleSave}>保存</Button>,
            <Button key="hold" style={{ marginRight: '12px' }} disabled={loading} onClick={handleHodeData}>暂存</Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>自主技术开发能力情况</div>
              <div className={styles.content}>
                <Row>
                  <Col span={12}>
                    <FormItem label="自主技术开发能力" {...formLayout}>
                      {getFieldDecorator('selfRdCapabilityEnum', {
                        initialValue: type === 'add' ? 'FULLY' : data.selfRdCapabilityEnum,
                        rules: [
                          {
                            required: true,
                            message: '自主技术开发能力不能为空',
                          },
                        ],
                      })(
                        <Radio.Group disabled={type === 'detail'}>
                          <Radio value={'FULLY'}>完全具备</Radio>
                          <Radio value={'BASIC'}>基本具备</Radio>
                          <Radio value={'NOT'}>不具备</Radio>
                        </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="说明" {...formLayout}>
                      {getFieldDecorator('selfRdCapabilityRemark', {
                        initialValue: type === 'add' ? '' : data.selfRdCapabilityRemark,
                        rules: [
                          {
                            required: true,
                            message: '说明不能为空',
                          },
                        ],
                      })(
                        <Input.TextArea disabled={type === 'detail'} maxLength={500}></Input.TextArea>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>专利/获奖情况</div>
              <div className={styles.content}>
                <EditorTable
                  dataSource={patentsAwards}
                  columns={columns}
                  fields={fields}
                  mode={type}
                  rowKey='guid'
                  setDataSource={setpatentsAwards}
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>产品开发情况</div>
              <div className={styles.content}>
                <Row>
                  <Col span={24}>
                    <FormItem label="是否愿意为客户的技术开发提供技术支持" {...formLayout}>
                      {getFieldDecorator('canTechnicalSupport', {
                        initialValue: type === 'add' ? true : data.canTechnicalSupport,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(
                        <Radio.Group disabled={type === 'detail'}>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>已完成的新产品开发</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem label="前一年新产品的个数占总产品个数的比重" {...formLayout}>
                      {getFieldDecorator('numberRate', {
                        initialValue: type === 'add' ? '' : data.numberRate,
                        rules: [
                          {
                            required: true,
                            message: '比重不能为空'
                          }
                        ]
                      })(
                        <InputNumber
                          min={0}
                          max={100}
                          precision={2}
                          disabled={type === 'detail'}
                          formatter={value => `${value}%`}
                          parser={value => value && value.replace('%', '')}
                          style={{ width: '50%' }}
                        />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="前一年新产品的销售额占总销售额的比重" {...formLayout}>
                      {getFieldDecorator('saleMoneyRate', {
                        initialValue: type === 'add' ? '' : data.saleMoneyRate,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(
                        <InputNumber
                          min={0}
                          max={100}
                          precision={2}
                          disabled={type === 'detail'}
                          formatter={value => `${value}%`}
                          parser={value => value && value.replace('%', '')}
                          style={{ width: '50%' }}
                        />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <div style={{
                      textAlign: 'right'
                    }}>样品开发周期</div>
                  </Col>
                  <Col span={16}>
                    <FormItem label="最长(天)" {...formLayout} labelCol={{
                      span: 4
                    }} wrapperCol={{ span: 20 }}>
                      {getFieldDecorator('devMaxCycle', {
                        initialValue: type === 'add' ? '' : data.devMaxCycle,
                        rules: [
                          {
                            validator: (_, value, cb) => {
                              if (value < devMinCycle) {
                                cb('最长天数应大于等于最短天数')
                              }
                              cb()
                            }
                          },
                          {
                            required: true,
                            message: '不能为空',
                            type: 'number'
                          }
                        ]
                      })(
                        <InputNumber precision={2} min={1} max={999999999} disabled={type === 'detail'} style={{ width: '20%' }} />
                      )}
                    </FormItem>
                    <FormItem label='最短(天)' {...formLayout} labelCol={{
                      span: 4
                    }} wrapperCol={{ span: 20 }}>
                      {
                        getFieldDecorator('devMinCycle', {
                          initialValue: type === 'add' ? '' : data.devMinCycle,
                          rules: [
                            {
                              validator: (_, value, cb) => {
                                if (value > devMaxCycle) {
                                  cb('最短天数应小于等于最长天数')
                                }
                                cb()
                              }
                            },
                            {
                              required: true,
                              message: '不能为空',
                              type: 'number'
                            }
                          ]
                        })(
                          <InputNumber precision={2} min={1} max={999999999} disabled={type === 'detail'} style={{ width: '20%' }} />
                        )
                      }
                    </FormItem>
                    <FormItem label='平均(天)' {...formLayout} labelCol={{
                      span: 4
                    }} wrapperCol={{ span: 20 }}>
                      {
                        getFieldDecorator('devAverageCycle', {
                          initialValue: type === 'add' ? '' : data.devAverageCycle,
                          rules: [
                            {
                              validator: (_, value, cb) => {
                                if (value < devMinCycle || value > devMaxCycle) {
                                  cb('平均天数应大于等于最短天数、小于等于最长天数')
                                }
                                cb()
                              }
                            },
                            {
                              required: true,
                              message: '不能为空'
                            }
                          ]
                        })(
                          <InputNumber precision={2} min={1} max={999999999} disabled={type === 'detail'} style={{ width: '20%' }} />
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                <EditorTable
                  dataSource={newProducts}
                  columns={columnsForFinish}
                  fields={finishFields}
                  rowKey='guid'
                  setDataSource={setnewProducts}
                  mode={type}
                  copyLine
                  allowRemove={false}
                  allowCreate={false}
                />
                <Divider orientation='left'>正在进行和计划进行的设计开发<span className={styles.hint}>(至少填写一个项目的信息，如确实没有填无)</span></Divider>
                <EditorTable
                  dataSource={processingDesigns}
                  columns={columnsForProcess}
                  fields={processFields}
                  rowKey='guid'
                  mode={type}
                  setDataSource={setprocessingDesigns}
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>产品执行标准<span className={styles.hint}>(至少填写一个项目的信息，如确实没有填无)</span></div>
              <div className={styles.content}>
                <EditorTable
                  dataSource={productStandards}
                  columns={columnsForProSta}
                  fields={proStaFields}
                  rowKey='guid'
                  mode={type}
                  setDataSource={setproductStandards}
                />
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin >
    </div >
  )
};

export default create()(ResearchAbility);