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
import {
  Form,
  Button,
  Spin,
  PageHeader,
  Row,
  Col,
  Divider,
  Radio,
  Input,
  message,
  Modal
} from 'antd';
import styles from '../index.less';
import EditorTable from '../../../../../components/EditorTable';
import UploadFile from '../../../../../components/Upload';
import { router } from 'dva';
import { requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';
import moment from 'moment';
import { keyTestingEquipmentCheckData, keyTestingEquipmentExport } from '../../../../../services/recommend';
import { utils } from 'suid';
import { downloadBlobFile } from '../../../../../utils';

const { Item: FormItem, create } = Form;
const formLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const { getUUID } = utils;

const QualityAbility = ({ form, updateGlobalStatus }) => {
  const [data, setData] = useState({});
  const [keyControlProcesses, setkeyControlProcesses] = useState([]);
  const [processesEpiboly, setProcessesEpiboly] = useState([]);
  const [keyTestingEquipments, setkeyTestingEquipments] = useState([]);
  const [cannotTestItems, setcannotTestItems] = useState([]);
  const [finishedProductTestingItems, setfinishedProductTestingItems] = useState([]);
  const [finishedProductQualities, setfinishedProductQualities] = useState([]);
  const [materialQualities, setmaterialQualities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validateLoading, setValidateLoading] = useState(false);

  const { query: { id, type = 'add' } } = router.useLocation();

  const {
    getFieldDecorator,
    getFieldValue,
    setFieldsValue,
    getFieldsValue,
    validateFieldsAndScroll
  } = form;
  const { haveCannotTestItem, haveProcessOutsourcing } = getFieldsValue()
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
          processOutsourcingList = [],
          ...other
        } = data;
        await setData(data);
        await setFieldsValue(other)
        await setkeyControlProcesses(keyControlProcesses);
        await setkeyTestingEquipments(keyTestingEquipments);
        await setcannotTestItems(cannotTestItems);
        await setfinishedProductQualities(finishedProductQualities);
        await setmaterialQualities(materialQualities);
        await setfinishedProductTestingItems(finishedProductTestingItems);
        await setProcessesEpiboly(processOutsourcingList)
        return
      }
      message.error(msg);
    };
    // if (type !== 'add') {
    fetchData();
    // }
  }, []);
  const keyControlFields = [
    {
      label: "工序名称",
      name: "name",
      options: {
        rules: [
          {
            required: true,
            message: '工序名称不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入工序名称'
      }
    },
    {
      label: "重点控制工序现场是否有标志和控制",
      name: "exsitFlagControl",
      fieldType: 'select',
      options: {
        rules: [
          {
            required: true,
            message: '请选择是否有标志和控制',
            type: 'boolean'
          }
        ]
      },
      props: {
        placeholder: '请选择是否有标志和控制'
      }
    }
  ]
  // 重点控制工序
  const columnsForKeyControl = [
    {
      title: "工序名称",
      dataIndex: "name",
      ellipsis: true,
      width: 150
    },
    {
      title: "重点控制工序现场是否有标志和控制",
      dataIndex: "exsitFlagControl",
      render(text) {
        return Object.is(null, text) ? '' : text ? '是' : '否'
      },
      width: 250
    },
  ];
  const proKeyFields = [
    {
      label: "工厂名称",
      name: "factoryName",
      options: {
        rules: [
          {
            required: true,
            message: '工厂名称不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入工厂名称'
      }
    },
    {
      label: "设备名称",
      name: "equipmentName",
      options: {
        rules: [
          {
            required: true,
            message: '设备名称不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入设备名称'
      }
    },
    {
      label: "规格型号",
      name: "specificationModel",
      options: {
        rules: [
          {
            required: true,
            message: '规格型号不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入规格型号'
      }
    },
    {
      label: "生产厂家",
      name: "manufacturer",
      options: {
        rules: [
          {
            required: true,
            message: '生产厂家不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入生产厂家'
      }
    },
    {
      label: "产地",
      name: "originPlace",
      options: {
        rules: [
          {
            required: true,
            message: '产地不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入产地'
      }
    },
    {
      label: "购买时间",
      name: "buyDate",
      fieldType: 'datePicker',
      disabledDate: (current, mn) => current && current > mn(),
      options: {
        rules: [
          {
            required: true,
            message: '购买时间不能为空'
          }
        ]
      },
      props: {
        placeholder: '请选择购买时间'
      }
    },
    {
      label: "数量",
      name: "number",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '数量不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入数量',
        min: 0
      }
    },
    {
      label: "检测项目",
      name: "testItem",
      options: {
        rules: [
          {
            required: true,
            message: '检测项目不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入检测项目'
      }
    },
    {
      label: "精度",
      name: "accuracy",
      options: {
        rules: [
          {
            required: true,
            message: '精度不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入精度'
      }
    },
    {
      label: "备注",
      name: "remark",
      fieldType: 'textArea',
      props: {
        placeholder: '请输入备注'
      }
    }
  ]
  // 关键检测、实验设备
  const columnsForProKeyPro = [
    {
      title: "工厂名称",
      dataIndex: "factoryName",
    },
    {
      title: "设备名称",
      dataIndex: "equipmentName",
    },
    {
      title: "规格型号",
      dataIndex: "specificationModel",
    },
    {
      title: "生产厂家",
      dataIndex: "manufacturer",
    },
    {
      title: "产地",
      dataIndex: "originPlace",
    },
    {
      title: "购买时间",
      dataIndex: "buyDate",
      render(text) {
        return !!text && moment(text).format('YYYY-MM-DD')
      }
    },
    {
      title: "数量",
      dataIndex: "number",
    },
    {
      title: "检测项目",
      dataIndex: "testItem",
    },
    {
      title: "精度",
      dataIndex: "accuracy",
    },
    {
      title: "备注",
      dataIndex: "remark",
    }
  ];

  // 无法检测项目
  const projectFields = [
    {
      label: "无能力检测项目",
      name: "cannotTestItem",
      options: {
        rules: [
          {
            required: true,
            message: '无能力检测项目不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入无能力检测项目'
      }
    },
    {
      label: "委托实验部门（检测机构）",
      name: "testOrganization",
      options: {
        rules: [
          {
            required: true,
            message: '委托实验部门不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入委托实验部门'
      }
    },
    {
      label: "检测周期",
      name: "testCycle",
      options: {
        rules: [
          {
            required: true,
            message: '检验周期不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入检验周期',
        min: 0
      },
      fieldType: 'inputNumber',
    },
    {
      label: "周期单位",
      name: "cycleUnit",
      options: {
        rules: [
          {
            required: true,
            message: '周期单位不能为空'
          }
        ]
      },
      props: {
        placeholder: '请选择周期单位'
      },
      fieldType: 'select',
      selectOptions: [
        { name: '日', value: 'DAY' },
        { name: '月', value: 'MONTH' },
        { name: '年', value: 'YEAR' },
      ]
    }
  ]
  const columnsForProject = [
    {
      title: "无能力检测项目",
      dataIndex: "cannotTestItem",
      width: 180,
    },
    {
      title: "委托实验部门（检测机构）",
      dataIndex: "testOrganization",
      width: 180,
    },
    {
      title: "检测周期",
      dataIndex: "testCycle",
      width: 180,
    },
    {
      title: "周期单位",
      dataIndex: "cycleUnit",
      width: 180,
    },
  ];

  // 成品检验项目
  const finishProFields = [
    {
      label: "产品",
      name: "productName",
      options: {
        rules: [
          {
            required: true,
            message: '产品不能为空'
          }
        ]
      },
      props: {
        disabled: true
      },
    },
    {
      label: "检验项目",
      name: "testingItem",
      options: {
        rules: [
          {
            required: true,
            message: '检验项目不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入检验项目'
      },
    },
    {
      label: "自检/外检",
      name: "selfExternalInspection",
      options: {
        rules: [
          {
            required: true,
            message: '请选择自检/外检'
          }
        ]
      },
      props: {
        placeholder: '选择检验类型'
      },
      fieldType: 'select',
      selectOptions: [
        { name: '自检', value: true },
        { name: '外检', value: false },
      ]
    },
    {
      label: "检验类型",
      name: "testingTypeEnum",
      options: {
        rules: [
          {
            required: true,
            message: '检验类型不能为空'
          }
        ]
      },
      changeResetFields: [
        'testingCycle',
        'cycleUnitEnum'
      ],
      props: {
        placeholder: '请选择检验类型'
      },
      fieldType: 'select',
      selectOptions: [
        { name: '周期检验', value: 'PERIODIC_TEST' },
        { name: '逐批检验', value: 'BATCH_INSPECTION' },
      ]
    },
    {
      label: "检验周期",
      name: "testingCycle",
      disabledTarget: 'testingTypeEnum',
      options: {
        rules: [
          {
            required: (targetValue) => {
              return targetValue === 'PERIODIC_TEST'
            },
            message: '检验周期不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入检验周期',
        min: 0,
        disabled: (targetValue) => {
          return !targetValue || targetValue === 'BATCH_INSPECTION'
        },
      },
      fieldType: 'inputNumber',
    },
    {
      label: "周期单位",
      name: "cycleUnitEnum",
      disabledTarget: 'testingTypeEnum',
      options: {
        rules: [
          {
            required: (targetValue) => {
              return targetValue === 'PERIODIC_TEST'
            },
            message: '周期单位不能为空'
          }
        ]
      },
      props: {
        placeholder: '请选择周期单位',
        disabled: (targetValue) => {
          return !targetValue || targetValue === 'BATCH_INSPECTION'
        }
      },
      fieldType: 'select',
      selectOptions: [
        { name: '日', value: 'DAY' },
        { name: '月', value: 'MONTH' },
        { name: '年', value: 'YEAR' },
      ]
    }
  ]
  const epibolyColumns = [
    {
      title: '外包工序名称',
      dataIndex: 'processName'
    },
    {
      title: '外包方公司名称',
      dataIndex: 'outsourcingCompany'
    },
    {
      title: '管控方式',
      dataIndex: 'controlMode'
    }
  ];
  const epibolyFields = [
    {
      label: '外包工序名称',
      name: 'processName',
      options: {
        rules: [
          {
            required: true,
            message: '外包工序名称不能为空'
          }
        ]
      },
      placeholder: '请输入外包工序名称'
    },
    {
      label: '外包方公司名称',
      name: 'outsourcingCompany',
      options: {
        rules: [
          {
            required: true,
            message: '外包方公司名称不能为空'
          }
        ]
      },
      placeholder: '请输入外包方公司名称'
    },
    {
      label: '管控方式',
      name: 'controlMode',
      options: {
        rules: [
          {
            required: true,
            message: '管控方式不能为空'
          }
        ]
      },
      placeholder: '请输入管控方式'
    }
  ]
  const columnsForFinishPro = [
    {
      title: "产品",
      dataIndex: "productName"
    },
    {
      title: "检验项目",
      dataIndex: "testingItem"
    },
    {
      title: "自检/外检",
      dataIndex: "selfExternalInspection",
      render(text) {
        return Object.is(null, text) ? null : text ? '自检' : '外检'
      }
    },
    {
      title: "检验类型",
      dataIndex: "testingTypeEnum",
      render(text) {
        switch (text) {
          case 'PERIODIC_TEST':
            return '周期检验'
          case 'BATCH_INSPECTION':
            return '逐批检验'
          default:
            return ''
        }
      }
    },
    {
      title: "检验周期",
      dataIndex: "testingCycle"
    },
    {
      title: "周期单位",
      dataIndex: "cycleUnitEnum",
      render(text) {
        switch (text) {
          case 'DAY':
            return '日'
          case 'MONTH':
            return '月'
          case 'YEAR':
            return '年'
          default:
            return ''
        }
      }
    },
  ];

  // 原材料质量状况
  const qualityFields = [
    {
      label: "产品",
      name: "productName",
      props: {
        disabled: true
      },
      options: {
        rules: [
          {
            required: true,
            message: '产品不能为空'
          }
        ]
      }
    },
    {
      label: "原材料名称及规格型号/牌号",
      name: "originModelBrand",
      options: {
        rules: [
          {
            required: true,
            message: '原材料名称及规格型号/牌号不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入原材料名称及规格型号/牌号'
      }
    },
    {
      label: "物料入厂验收合格率(%)",
      name: "materialQualifiedRate",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '物料入厂验收合格率不能为空'
          }
        ]
      },
      props: {
        min: 0,
        max: 100,
        placeholder: '请输入物料入厂验收合格率(%)'
      }
    },
    {
      label: "物料使用不良率(%)",
      name: "materialUseBadRate",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '物料使用不良率不能为空'
          }
        ]
      },
      props: {
        min: 0,
        max: 100,
        placeholder: '请输入物料使用不良率'
      }
    }
  ]
  const columnsForQuality = [
    {
      title: "产品",
      dataIndex: "productName",
    },
    {
      title: "原材料名称及规格型号/牌号",
      dataIndex: "originModelBrand",
      width: 200
    },
    {
      title: "物料入厂验收合格率",
      dataIndex: "materialQualifiedRate",
      width: 200
    },
    {
      title: "物料使用不良率",
      dataIndex: "materialUseBadRate",
      width: 150
    },
  ];

  // 成品质量状况
  const finishQuaFields = [
    {
      label: "产品",
      name: "productName",
      options: {
        rules: [
          {
            required: true,
            message: '产品不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入产品'
      }
    },
    {
      label: "产品直通率(%)",
      name: "productStraightInRate",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '产品直通率不能为空'
          }
        ]
      },
      props: {
        min: 0,
        max: 100,
        placeholder: '请输入产品直通率'
      }
    },
    {
      label: "成品检验合格率(%)",
      name: "testQualifiedRate",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '成品检验合格率不能为空'
          }
        ]
      },
      props: {
        min: 0,
        max: 100,
        placeholder: '请输入成品检验合格率'
      }
    },
    {
      label: "成品出厂合格率(%)",
      fieldType: 'inputNumber',
      name: "leaveFactoryQualifiedRate",
      options: {
        rules: [
          {
            required: true,
            message: '成品出厂合格率不能为空'
          }
        ]
      },
      props: {
        min: 0,
        max: 100,
        placeholder: '请输入成品出厂合格率'
      }
    }
  ]
  const columnsForFinishQua = [
    {
      title: "产品",
      dataIndex: "productName"
    },
    {
      title: "产品直通率",
      dataIndex: "productStraightInRate"
    },
    {
      title: "成品检验合格率",
      dataIndex: "testQualifiedRate"
    },
    {
      title: "成品出厂合格率",
      dataIndex: "leaveFactoryQualifiedRate"
    }
  ];

  async function handleSave() {
    if (getFieldValue('haveEnvironmentalTestingEquipment')) {
      // if (isEmptyArray(tableTata)) {
      //     message.info('列表至少填写一条设备信息！');
      //     return;
      // }
    }
    if (keyControlProcesses.length === 0) {
      message.error('至少需要填写一条重点控制工序信息')
      return
    }
    const value = await validateFieldsAndScroll();
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
      processOutsourcingList: processesEpiboly
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
  async function handleHoldData() {
    const value = getFieldValue();
    const saveParams = {
      ...value,
      tabKey: 'qualityAbilityTab',
      rohsFileId: value?.rohsFileId ? (value.rohsFileId)[0] : null,
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
    const { success, message: msg } = await requestPostApi(params, { tempSave: true });
    setLoading(false)
    if (success) {
      message.success('质量能力暂存成功');
      updateGlobalStatus();
      return
    }
    message.error(msg)
  }
  function handleExportKeyTestingEquipments() {
    Modal.confirm({
      title: '导出关键检测、实验设备',
      content: '是否导出当前已填写的关键检测、实验设备',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const { data, success } = await keyTestingEquipmentExport(keyTestingEquipments)
        if (success) {
          downloadBlobFile(data, '关键检测、实验设备.xlsx')
          message.success('导出成功')
          return
        }
        message.error('导出失败')
      }
    })
  }
  async function handleExportKeyTestingEquipmentsValidate(ds) {
    setValidateLoading(true)
    const { data, success, message: msg } = await keyTestingEquipmentCheckData(ds);
    setValidateLoading(false)
    if (success) {
      return new Promise((resolve) => {
        resolve(data.map(item => ({ ...item, key: getUUID() })))
      })
    }
    message.error(msg)
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
            <Button
              key="hold"
              style={{
                marginRight: '12px'
              }}
              disabled={loading}
              onClick={handleHoldData}
            >暂存</Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>企业质量保证能力<span className={styles.hint}>（以下检验、质量控制需要查看程序文件及文档记录，资料不全会影响质保能力的确认）</span></div>
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
                            message: '不能为空',
                          },
                        ],
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
                            message: '不能为空',
                          },
                        ],
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
                            message: '不能为空',
                          },
                        ],
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>重点控制工序<span className={styles.hint}>(至少提供一项，如确实没有填无)</span></Divider>
                <EditorTable
                  dataSource={keyControlProcesses}
                  mode={type}
                  setDataSource={setkeyControlProcesses}
                  columns={columnsForKeyControl}
                  fields={keyControlFields}
                />
                <Divider orientation='left'>工序外包<span className={styles.hint}>(如存在工序外包，至少提供一项)</span></Divider>
                <Row>
                  <Col>
                    <FormItem label='是否存在外包工序' {...formLayout}>
                      {
                        getFieldDecorator('haveProcessOutsourcing', {
                          rules: [
                            {
                              required: true,
                              message: '请选择是否存在外包工序'
                            }
                          ]
                        })(
                          <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                          </Radio.Group>
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
                {
                  haveProcessOutsourcing ?
                    <EditorTable
                      dataSource={processesEpiboly}
                      setDataSource={setProcessesEpiboly}
                      mode={type}
                      columns={epibolyColumns}
                      fields={epibolyFields}
                    /> : null
                }
                <Row>
                  <Col span={12}>
                    <FormItem label="关键工序是否实行了SPC控制" {...formLayout}>
                      {getFieldDecorator('spcControl', {
                        initialValue: type === 'add' ? '' : data.spcControl,
                        rules: [
                          {
                            required: true,
                            message: '不能为空',
                          },
                        ],
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
                            message: '不能为空',
                          },
                        ],
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
                            message: '不能为空',
                          },
                        ],
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
                            message: '不能为空',
                          },
                        ],
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
                            message: '不能为空',
                          },
                        ],
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
                            message: '不能为空',
                          },
                        ],
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
                            message: '不能为空',
                          },
                        ],
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>具备</Radio>
                        <Radio value={false}>不具备</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>关键检测、实验设备<span className={styles.hint}>（仪器、仪表、可靠性实验设备等）（至少提供三种设备的信息）</span></Divider>
                <EditorTable
                  dataSource={keyTestingEquipments}
                  columns={columnsForProKeyPro}
                  fields={proKeyFields}
                  setDataSource={setkeyTestingEquipments}
                  mode={type}
                  allowExport
                  allowImport
                  exportFunc={handleExportKeyTestingEquipments}
                  validateFunc={handleExportKeyTestingEquipmentsValidate}
                  validateLoading={validateLoading}
                />
                <Row>
                  <Col span={12}>
                    <FormItem label="企业目前无法检测的检测项目" {...formLayout}>
                      {getFieldDecorator('haveCannotTestItem', {
                        initialValue: type === 'add' ? '' : data.haveCannotTestItem,
                        rules: [
                          {
                            required: true,
                            message: '不能为空',
                          },
                        ],
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>有</Radio>
                        <Radio value={false}>无</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <div>
                  <span className={styles.hint}>（如选有，至少提供一项）</span>
                </div>
                {
                  haveCannotTestItem ?
                    <EditorTable
                      dataSource={cannotTestItems}
                      columns={columnsForProject}
                      setDataSource={setcannotTestItems}
                      mode={type}
                      fields={projectFields}
                    />
                    :
                    null
                }
                <Divider orientation='left'>不检测项目</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="例举" {...formLayout}>
                      {getFieldDecorator('noTestItem', {
                        initialValue: type === 'add' ? '' : data.noTestItem
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>次年加强检测的手段、措施</Divider>
                <Row>
                  <Col span={18}>
                    <FormItem label="从硬件上计划进哪些检测设备（仪表仪器）" {...formLayout}>
                      {getFieldDecorator('planBuyEquipment', {
                        initialValue: type === 'add' ? '' : data.planBuyEquipment
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={18}>
                    <FormItem label="从软件上有何措施" {...formLayout}>
                      {getFieldDecorator('softwareStep', {
                        initialValue: type === 'add' ? '' : data.softwareStep
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>产品质量控制流程简介及成品出货检验规范</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="产品质量控制流程简介" {...formLayout}>
                      {getFieldDecorator('qualityControlBrief', {
                        initialValue: type === 'add' ? '' : data.qualityControlBrief
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="附件" {...formLayout}>
                      {getFieldDecorator('qualityControlBriefFileIds', {
                        initialValue: type === 'add' ? '' : data.qualityControlBriefFileIds,
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
                        initialValue: type === 'add' ? '' : data.finishedProductTestNorm
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="成品检验规范附件" {...formLayout}>
                      {getFieldDecorator('finishedProductTestNormFileIds', {
                        initialValue: type === 'add' ? '' : data.finishedProductTestNormFileIds
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        disabled={type === 'detail'}
                        entityId={data.finishedProductTestNormFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>成品检验项目<span className={styles.hint}>(至少提供两个检验项目的信息)</span></Divider>
                <EditorTable
                  dataSource={finishedProductTestingItems}
                  columns={columnsForFinishPro}
                  mode={type}
                  fields={finishProFields}
                  copyLine={true}
                  setDataSource={setfinishedProductTestingItems}
                />
                <Divider orientation='left'>原材料质量状况<span className={styles.hint}>（至少提供一种原材料的数据）</span></Divider>
                <EditorTable
                  dataSource={materialQualities}
                  columns={columnsForQuality}
                  fields={qualityFields}
                  copyLine={true}
                  setDataSource={setmaterialQualities}
                  mode={type}
                  allowRemove={true}
                />
                <Divider orientation='left'>成品质量状况<span className={styles.hint}>（至少填写一行数据）</span></Divider>
                <EditorTable
                  dataSource={finishedProductQualities}
                  columns={columnsForFinishQua}
                  fields={finishQuaFields}
                  setDataSource={setfinishedProductQualities}
                  mode={type}
                  copyLine={true}
                />
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default create()(QualityAbility);