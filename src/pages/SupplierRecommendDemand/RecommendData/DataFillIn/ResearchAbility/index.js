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
import { Form, Button, Spin, PageHeader, Radio, Row, Col, Input, InputNumber, Divider, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../CommonUtil/EditTable';
import { router } from 'dva';
import moment from 'moment';
import { findRdCapabilityById, requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds, checkNull } from '../CommonUtil/utils';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const formLayoutCol = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
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

  const { getFieldDecorator } = form;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await requestGetApi({ supplierRecommendDemandId: id || '1', tabKey: 'researchAbilityTab' });
      if (res.success) {
        res.data && setData(res.data);
        res.data && setnewProducts(res.data.newProducts);
      } else {
        message.error(res.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 专利/获奖情况
  const columns = [
    {
      "title": "专利号/获奖证书",
      "dataIndex": "patentsAwardsCertificate",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "成果说明",
      "dataIndex": "resultDescription",
      "ellipsis": true,
      "editable": true,
      "inputType": 'Input',
    },
    {
      "title": "时间",
      "dataIndex": "date",
      "ellipsis": true,
      "editable": true,
      "inputType": 'DatePicker',
      width: 160,
    },
    {
      "title": "专利所有者",
      "dataIndex": "possessor",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "是否涉及提供给长虹的产品",
      "dataIndex": "involveChanghong",
      "ellipsis": true,
      "editable": true,
      "inputType": 'Select',
      "width": 168,
    }
  ];

  // 已完成的新产品开发
  const columnsForFinish = [
    {
      "title": "产品名称",
      "dataIndex": "productName",
      "ellipsis": true,
    },
    {
      "title": "产品特点",
      "dataIndex": "productFeature",
      "ellipsis": true,
    },
    {
      "title": "新品销售金额",
      "dataIndex": "salesPrice",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "总销售金额",
      "dataIndex": "totalSalesMoney",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "币种",
      "dataIndex": "currencyName",
      "ellipsis": true,
      "editable": true,
      "inputType": 'Select',
    },
    {
      "title": "获奖情况",
      "dataIndex": "awardSituation",
      "ellipsis": true,
      "editable": true,
      "inputType": 'Input',
    },
    {
      "title": "设计定型日期",
      "dataIndex": "designFinalizeDate",
      "ellipsis": true,
      "editable": true,
      "inputType": 'DatePicker',
      render: function (text, context) {
        return text && moment(text).format('YYYY-MM-DD');
      }
    }
  ];

  // 正在进行和计划进行的设计开发
  const columnsForProcess = [
    {
      "title": "项目名称",
      "dataIndex": "projectName",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "项目内容",
      "dataIndex": "projectContent",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "项目人员构成",
      "dataIndex": "projectStaff",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "时间安排",
      "dataIndex": "datePlan",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "项目成果",
      "dataIndex": "projectResult",
      "ellipsis": true,
      "editable": true,
    }
  ];
  // 
  const columnsForProSta = [
    {
      "title": "使用标准名称/编号",
      "dataIndex": "standardName",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "国家/行业标准名称、编号",
      "dataIndex": "countryIndustryStandard",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "先进指标",
      "dataIndex": "advancedIndicator",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "低于国家/行业标准的指标",
      "dataIndex": "lowerIndicator",
      "ellipsis": true,
      "editable": true,
    },
  ];

  function setNewData(newData, type) {
    switch (type) {
      case 'patentsAwards':
        setpatentsAwards(newData);
        break;
      case 'processingDesigns':
        setprocessingDesigns(newData);
        break;
      case 'productStandards':
        setproductStandards(newData);
        break;
      default:
        break;
    }
  }

  function handleSave() {
    form.validateFieldsAndScroll((error, value) => {
      (value);
      if (error) return;
      const saveParams = {
        ...value,
        patentsAwards: patentsAwards || [],
        processingDesigns: processingDesigns || [],
        productStandards: productStandards || [],
        newProducts: data.newProducts || [],
        recommendDemandId: id || '676800B6-F19D-11EA-9F88-0242C0A8442E',
      };
      requestPostApi(filterEmptyFileds({ tabKey: 'researchAbilityTab', ...saveParams })).then((res) => {
        if (res && res.success) {
          message.success('保存研发能力成功');
          updateGlobalStatus();
        } else {
          message.error(res.message);
        }
      });
    });
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
            <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={handleSave}>
              保存
                        </Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>自主技术开发能力情况</div>
              <div className={styles.content}>
                <Row>
                  <Col span={12}>
                    <FormItem label="自主技术开发能力" {...formLayout}>
                      {getFieldDecorator('selfRdCapability', {
                        initialValue: type === 'add' ? 'FULLY' : data.selfRdCapability,
                        rules: [
                          {
                            required: true,
                            message: '自主技术开发能力不能为空',
                          },
                        ],
                      })(
                        <Radio.Group>
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
                        <Input.TextArea></Input.TextArea>
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
                <EditableFormTable
                  dataSource={patentsAwards || []}
                  columns={columns}
                  rowKey='guid'
                  setNewData={setNewData}
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  tableType='patentsAwards'
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(
                        <Radio.Group>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="前一年新产品的个数占总产品个数的比重" {...formLayout}>
                      {getFieldDecorator('numberRate', {
                        initialValue: type === 'add' ? '' : data.numberRate,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(
                        <InputNumber
                          min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          parser={value => value && value.replace('%', '')}
                          // onChange={onChange}
                          style={{ width: '50%' }}
                        />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>已完成的新产品开发</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem label="前一年新产品的销售额占总销售额的比重" {...formLayout}>
                      {getFieldDecorator('saleMoneyRate', {
                        initialValue: type === 'add' ? '' : data.saleMoneyRate,
                      })(
                        <InputNumber
                          min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          parser={value => value && value.replace('%', '')}
                          style={{ width: '50%' }}
                        />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="样品开发周期" {...formLayout}>
                      {getFieldDecorator('devMaxCycle', {
                        initialValue: type === 'add' ? '' : data.devMaxCycle,
                      })(
                        <span>最长 <InputNumber style={{ width: '20%' }} />天 </span>
                      )}
                                            &nbsp;&nbsp;&nbsp;
                                            {getFieldDecorator('devAverageCycle', {
                        initialValue: type === 'add' ? '' : data.devAverageCycle,
                      })(
                        <span>最长 <InputNumber style={{ width: '20%' }} />天 </span>
                      )}
                                            &nbsp;&nbsp;&nbsp;
                                            {getFieldDecorator('devMinCycle', {
                        initialValue: type === 'add' ? '' : data.devMinCycle,
                      })(
                        <span>平均 <InputNumber style={{ width: '20%' }} />天 </span>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <EditableFormTable
                  dataSource={newProducts || []}
                  columns={columnsForFinish}
                  rowKey='guid'
                />
                <Divider orientation='left'>正在进行和计划进行的设计开发</Divider>
                <EditableFormTable
                  dataSource={processingDesigns || []}
                  columns={columnsForProcess}
                  rowKey='guid'
                  setNewData={setNewData}
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  tableType='processingDesigns'
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>产品执行标准</div>
              <div className={styles.content}>
                <EditableFormTable
                  dataSource={productStandards || []}
                  columns={columnsForProSta}
                  rowKey='guid'
                  setNewData={setNewData}
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  tableType='productStandards'
                />
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div >
  )
};

export default Form.create()(ResearchAbility);