/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:10
 * @LastEditTime: 2020-09-22 10:30:13
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/QualityAbility/index.js
 * @Description: 质量能力
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, Row, Col, Divider, Radio, Input, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../CommonUtil/EditTable';
import UploadFile from '../../../../../components/Upload';
import { router } from 'dva';
import { requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const QualityAbility = ({ form, updateGlobalStatus }) => {

  const [data, setData] = useState({});
  const [keyControlProcesses, setkeyControlProcesses] = useState([]);
  const [keyTestingEquipments, setkeyTestingEquipments] = useState([]);
  const [cannotTestItems, setcannotTestItems] = useState([]);
  const [finishedProductTestingItems, setfinishedProductTestingItems] = useState([]);
  const [finishedProductQualities, setfinishedProductQualities] = useState([]);
  const [materialQualities, setmaterialQualities] = useState([]);
  const [loading, setLoading] = useState(false);

  const { query: { id, type = 'add' } } = router.useLocation();

  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

  useEffect(() => {
    const fetchData = async () => {
      await setLoading(true);
      const { data, success, message: msg } = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'qualityAbilityTab' });
      await setLoading(false);
      if (success) {
        const {
          keyControlProcesses = [],
          keyTestingEquipments = [],
          finishedProductQualities = [],
          cannotTestItems = [],
          materialQualities = [],
          finishedProductTestingItems = [],
          ...other
        } = data;
        await setData(data);
        await setFieldsValue(other)
        await setkeyControlProcesses(keyControlProcesses.map(item => ({ ...item, guid: item.id })));
        await setkeyTestingEquipments(keyTestingEquipments.map(item => ({ ...item, guid: item.id })));
        await setcannotTestItems(cannotTestItems.map(item => ({ ...item, guid: item.id })));
        await setfinishedProductQualities(finishedProductQualities.map(item => ({ ...item, guid: item.id })));
        await setmaterialQualities(materialQualities.map(item => ({ ...item, guid: item.id })));
        await setfinishedProductTestingItems(finishedProductTestingItems.map(item => ({ ...item, guid: item.id })));
        return
      }
      message.error(msg);
    };
    // if (type !== 'add') {
    fetchData();
    // }
  }, []);

  // 重点控制工序
  const columnsForKeyControl = [
    {
      title: "工序名称",
      dataIndex: "name",
      ellipsis: true,
      editable: true,
    },
    {
      title: "重点控制工序现场是否有标志和控制",
      dataIndex: "exsitFlagControl",
      ellipsis: true,
      editable: true,
      inputType: 'Select',
      width: 250
    },
  ];
  // 关键检测、实验设备
  const columnsForProKeyPro = [
    {
      title: "工厂名称",
      dataIndex: "factoryName",
      ellipsis: true,
      editable: true,
    },
    {
      title: "设备名称",
      dataIndex: "equipmentName",
      ellipsis: true,
      editable: true,
    },
    {
      title: "规格型号",
      dataIndex: "specificationModel",
      ellipsis: true,
      editable: true,
    },
    {
      title: "生产厂家",
      dataIndex: "manufacturer",
      ellipsis: true,
      editable: true,
    },
    {
      title: "产地",
      dataIndex: "originPlace",
      ellipsis: true,
      editable: true,
      inputType: 'Input',
    },
    {
      title: "购买时间",
      dataIndex: "buyDate",
      ellipsis: true,
      editable: true,
      inputType: 'DatePicker',
    },
    {
      title: "数量",
      dataIndex: "number",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "检测项目",
      dataIndex: "testItem",
      ellipsis: true,
      editable: true,
      inputType: 'Input',
    },
    {
      title: "精度",
      dataIndex: "accuracy",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "备注",
      dataIndex: "remark",
      ellipsis: true,
      editable: true,
      inputType: 'TextArea',
    }
  ];

  // 
  const columnsForProject = [
    {
      title: "无能力检测项目",
      dataIndex: "cannotTestItem",
      ellipsis: true,
      editable: true,
    },
    {
      title: "委托实验部门（检测机构）",
      dataIndex: "testOrganization",
      ellipsis: true,
      editable: true,
    },
    {
      title: "检测周期",
      dataIndex: "testCycle",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "周期单位",
      dataIndex: "cycleUnit",
      ellipsis: true,
      editable: true,
    },
  ];

  // 成品检验项目
  const columnsForFinishPro = [
    {
      title: "产品",
      dataIndex: "productName",
      ellipsis: true,
      editable: false,
    },
    {
      title: "检验项目",
      dataIndex: "testingItem",
      ellipsis: true,
      editable: true,
    },
    {
      title: "自检/外检",
      dataIndex: "selfExternalInspection",
      ellipsis: true,
      editable: true,
      inputType: 'Select',
      selectOptions: [
        { name: '自检', value: true },
        { name: '外检', value: false },
      ]
    },
    {
      title: "检验类型",
      dataIndex: "testingTypeEnum",
      ellipsis: true,
      editable: true,
      inputType: 'Select',
      selectOptions: [
        { name: '周期检验', value: 'PERIODIC_TEST' },
        { name: '逐批检验', value: 'BATCH_INSPECTION' },
      ]
    },
    {
      title: "检验周期",
      dataIndex: "testingCycle",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "周期单位",
      dataIndex: "cycleUnitEnum",
      ellipsis: true,
      editable: true,
      inputType: 'Select',
      selectOptions: [
        { name: '日', value: 'DAY' },
        { name: '月', value: 'MONTH' },
        { name: '年', value: 'YEAR' },
      ]
    },
  ];

  // 原材料质量状况
  const columnsForQuality = [
    {
      title: "产品",
      dataIndex: "productName",
      ellipsis: true,
      editable: false,
    },
    {
      title: "原材料名称及规格型号/牌号",
      dataIndex: "originModelBrand",
      ellipsis: true,
      editable: true,
    },
    {
      title: "物料入厂验收合格率",
      dataIndex: "materialQualifiedRate",
      ellipsis: true,
      editable: true,
      inputType: 'percentInput',
    },
    {
      title: "物料使用不良率",
      dataIndex: "materialUseBadRate",
      ellipsis: true,
      editable: true,
      inputType: 'percentInput',
    },
  ];

  // 成品质量状况
  const columnsForFinishQua = [
    {
      title: "产品",
      dataIndex: "productName",
      ellipsis: true,
      editable: false,
    },
    {
      title: "产品直通率",
      dataIndex: "productStraightInRate",
      ellipsis: true,
      editable: true,
      inputType: 'percentInput',
    },
    {
      title: "成品检验合格率",
      dataIndex: "testQualifiedRate",
      ellipsis: true,
      editable: true,
      inputType: 'percentInput',
    },
    {
      title: "成品出厂合格率",
      dataIndex: "leaveFactoryQualifiedRate",
      ellipsis: true,
      editable: true,
      inputType: 'percentInput',
    },
  ];

  async function handleSave() {
    if (getFieldValue('haveEnvironmentalTestingEquipment')) {
      // if (isEmptyArray(tableTata)) {
      //     message.info('列表至少填写一条设备信息！');
      //     return;
      // }
    }
    const value = await form.validateFieldsAndScroll();
    const saveParams = {
      ...value,
      tabKey: 'qualityAbilityTab',
      rohsFileId: value.rohsFileId ? (value.rohsFileId)[0] : null,
      recommendDemandId: id,
      id: data.id,
      keyControlProcesses,
      keyTestingEquipments,
      finishedProductQualities,
      cannotTestItems,
      materialQualities,
      finishedProductTestingItems,
      // environmentalTestingEquipments: tableTata || [],
    };
    const params = filterEmptyFileds(saveParams)
    setLoading(true)
    const { success, message: msg } = await requestPostApi(params);
    setLoading(false)
    if (success) {
      message.success(msg);
      updateGlobalStatus();
      return
    }
    message.error(msg)
  }

  function setNewData(newData, type) {
    switch (type) {
      case 'keyControlProcesses':
        setkeyControlProcesses(newData);
        break;
      case 'keyTestingEquipments':
        setkeyTestingEquipments(newData);
        break;
      case 'cannotTestItems':
        setcannotTestItems(newData);
        break;
      case 'materialQualities':
        setmaterialQualities(newData);
        break;
      case 'finishedProductTestingItems':
        setfinishedProductTestingItems(newData);
        break;
      case 'finishedProductQualities':
        setfinishedProductQualities(newData);
      default:
        break;
    }
  }

  return (
    <div>
      <Spin spinning={loading}>
        <PageHeader
          ghost={false}
          style={{
            padding: '0px'
          }}
          title="质量控制"
          extra={type === 'add' ? [
            <Button
              key="save"
              type="primary"
              style={{
                marginRight: '12px'
              }}
              disabled={loading}
              onClick={handleSave}
            >保存</Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>企业质量保证能力</div>
              <div className={styles.content}>
                <Divider orientation='left'>检测范围</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="材料入厂检验" {...formLayout}>
                      {getFieldDecorator('materialIncomeInspection', {
                        initialValue: type === 'add' ? '' : data.materialIncomeInspection,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="生产过程检验" {...formLayout}>
                      {getFieldDecorator('productionProcessInspection', {
                        initialValue: type === 'add' ? '' : data.productionProcessInspection,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="出厂检验" {...formLayout}>
                      {getFieldDecorator('routineTest', {
                        initialValue: type === 'add' ? '' : data.routineTest,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>重点控制工序</Divider>
                <EditableFormTable
                  dataSource={keyControlProcesses}
                  columns={columnsForKeyControl}
                  rowKey='guid'
                  setNewData={setNewData}
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  tableType='keyControlProcesses'
                />
                <Row>
                  <Col span={12}>
                    <FormItem label="关键工序是否实行了SPC控制" {...formLayout}>
                      {getFieldDecorator('spcControl', {
                        initialValue: type === 'add' ? '' : data.spcControl,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="是否有可靠性实验室" {...formLayout}>
                      {getFieldDecorator('accessibilityLab', {
                        initialValue: type === 'add' ? '' : data.accessibilityLab,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="是否制定试验计划并实施" {...formLayout}>
                      {getFieldDecorator('testPlan', {
                        initialValue: type === 'add' ? '' : data.testPlan,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="是否培训" {...formLayout}>
                      {getFieldDecorator('inspectorTrain', {
                        initialValue: type === 'add' ? '' : data.inspectorTrain,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="资质认定" {...formLayout}>
                      {getFieldDecorator('inspectorCertification', {
                        initialValue: type === 'add' ? '' : data.inspectorCertification,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="产品追溯" {...formLayout}>
                      {getFieldDecorator('productTracking', {
                        initialValue: type === 'add' ? '' : data.productTracking,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="FMEA管理（过程）" {...formLayout}>
                      {getFieldDecorator('productCertification', {
                        initialValue: type === 'add' ? '' : data.productCertification,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>具备</Radio>
                        <Radio value={false}>不具备</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>关键检测、实验设备（仪器、仪表、可靠性实验设备等）</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="设备清单" {...formLayout}>
                      {getFieldDecorator('equipmentListFileIds', {
                        initialValue: type === 'add' ? '' : data.equipmentListFileIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(
                        <UploadFile
                          showColor={type !== 'add' ? true : false}
                          type={type !== 'add'}
                          disabled={type === 'detail'}
                          entityId={data.equipmentListFileId}
                        />)}
                    </FormItem>
                  </Col>
                </Row>
                <EditableFormTable
                  dataSource={keyTestingEquipments}
                  columns={columnsForProKeyPro}
                  rowKey='guid'
                  setNewData={setNewData}
                  tableType='keyTestingEquipments'
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                />
                <Row>
                  <Col span={12}>
                    <FormItem label="企业有无目前无法检测的检测项目" {...formLayout}>
                      {getFieldDecorator('haveCannotTestItem', {
                        initialValue: type === 'add' ? '' : data.haveCannotTestItem,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <EditableFormTable
                  dataSource={cannotTestItems}
                  columns={columnsForProject}
                  rowKey='guid'
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  setNewData={setNewData}
                  tableType='cannotTestItems'
                />
                <Divider orientation='left'>不检测项目</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="例举" {...formLayout}>
                      {getFieldDecorator('noTestItem', {
                        initialValue: type === 'add' ? '' : data.noTestItem,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>次年加强检测的手段、措施</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="从硬件上计划进哪些检测设备（仪表仪器" {...formLayout}>
                      {getFieldDecorator('planBuyEquipment', {
                        initialValue: type === 'add' ? '' : data.planBuyEquipment,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="从软件上有何措施" {...formLayout}>
                      {getFieldDecorator('softwareStep', {
                        initialValue: type === 'add' ? '' : data.softwareStep,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>产品质量控制流程简介及成品出货检验规范</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="产品质量控制流程简介" {...formLayout}>
                      {getFieldDecorator('qualityControlBrief', {
                        initialValue: type === 'add' ? '' : data.qualityControlBrief,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="附件" {...formLayout}>
                      {getFieldDecorator('qualityControlBriefFileIds', {
                        initialValue: type === 'add' ? '' : data.qualityControlBriefFileIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        entityId={data.qualityControlBriefFileId}
                        disabled={type === 'detail'}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="成品检验规范" {...formLayout}>
                      {getFieldDecorator('finishedProductTestNorm', {
                        initialValue: type === 'add' ? '' : data.finishedProductTestNorm,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="成品检验规范附件" {...formLayout}>
                      {getFieldDecorator('finishedProductTestNormFileIds', {
                        initialValue: type === 'add' ? '' : data.finishedProductTestNormFileIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        disabled={type === 'detail'}
                        entityId={data.finishedProductTestNormFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>成品检验项目</Divider>
                <EditableFormTable
                  dataSource={finishedProductTestingItems}
                  columns={columnsForFinishPro}
                  rowKey='guid'
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  copyLine={true}
                  setNewData={setNewData}
                  tableType='finishedProductTestingItems'
                />
                <Divider orientation='left'>原材料质量状况</Divider>
                <EditableFormTable
                  dataSource={materialQualities}
                  columns={columnsForQuality}
                  rowKey='guid'
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  setNewData={setNewData}
                  tableType='materialQualities'
                  copyLine={true}
                />
                <Divider orientation='left'>成品质量状况</Divider>
                <EditableFormTable
                  dataSource={finishedProductQualities}
                  columns={columnsForFinishQua}
                  rowKey='guid'
                  isEditTable={type === 'add'}
                  allowRemove={false}
                  setNewData={setNewData}
                  tableType='finishedProductQualities'
                />
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default Form.create()(QualityAbility);