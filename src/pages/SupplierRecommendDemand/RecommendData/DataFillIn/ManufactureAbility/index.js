/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:16
 * @LastEditTime: 2020-09-22 10:31:46
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/ManufactureAbility/index.js
 * @Description: 制造能力 Tab
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
  message,
  Modal
} from 'antd';
import styles from '../../DataFillIn/index.less';
import EditorTable from '../../../../../components/EditorTable';
import UploadFile from '../../../../../components/Upload';
import { router } from 'dva';
import { requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';
import { keyProductEquipementsExport, keyProductEquipementsCheckData } from '../../../../../services/recommend';
import { downloadBlobFile } from '../../../../../utils';
import { utils } from 'suid';

const { getUUID } = utils;

const { Item: FormItem, create } = Form;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  }
};

const ManufactureAbility = ({ form, updateGlobalStatus }) => {
  const [data, setData] = useState({});
  const [productionCapacities, setproductionCapacities] = useState([]);
  const [keyProductEquipments, setkeyProductEquipments] = useState([]);
  const [keyTechnologyEquipments, setkeyTechnologyEquipments] = useState([]);
  const [productManufacturingIntroductions, setproductManufacturingIntroductions] = useState([]);
  const [currentProductionSituations, setcurrentProductionSituations] = useState([]);
  const [loading, setLoading] = useState(false);

  const { query: { id, type = 'add', unitName, unitCode } } = router.useLocation();
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFieldsAndScroll, getFieldsValue } = form;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { success, msg, data } = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'manufactureAbilityTab' });
      setLoading(false);
      if (success) {
        const {
          productionCapacities = [],
          keyProductEquipments = [],
          keyTechnologyEquipments = [],
          currentProductionSituations = [],
          productManufacturingIntroductions = [],
          ...other
        } = data;
        setData(data);
        setFieldsValue(other)
        setproductionCapacities(productionCapacities);
        setkeyProductEquipments(keyProductEquipments);
        setkeyTechnologyEquipments(keyTechnologyEquipments);
        setcurrentProductionSituations(currentProductionSituations.map(item => ({ ...item, guid: item.id, offSeasonMonth: item.offSeasonMonth?.split(',') })));
        setproductManufacturingIntroductions(productManufacturingIntroductions);
        return
      }
      message.error(msg);
    };
    fetchData();
  }, []);
  function handleKeyProductEquipementsExport() {
    Modal.confirm({
      title: '导出关键生产设备',
      content: '是否导出当前已填写的关键生产设备',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const { data, success } = await keyProductEquipementsExport(keyProductEquipments)
        if (success) {
          downloadBlobFile(data, '关键生产设备.xlsx')
          message.success('导出成功')
          return
        }
        message.error('导出失败')
      }
    })
  }
  async function handleKeyProductEquipementsValidate(ds) {
    const { data, success, message: msg } = await keyProductEquipementsCheckData(ds);
    if (success) {
      return new Promise((resolve) => {
        resolve(data.map(item => ({ ...item, key: getUUID() })))
      })
    }
    message.error(msg)
  }
  // 生产能力
  const proCapacity = [
    {
      label: "名称",
      name: "name",
      options: {
        rules: [
          {
            required: true,
            message: '名称不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入名称'
      }
    },
    {
      label: "规格型号",
      name: "modelBrand",
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
      label: '计量单位',
      name: 'unitName',
      options: {
        initialValue: unitName,
        rules: [
          {
            required: true,
            message: '计量单位不能为空'
          }
        ]
      },
      props: {
        disabled: true
      }
    },
    {
      label: '计量单位代码',
      name: 'unitCode',
      options: {
        initialValue: unitCode
      },
      fieldType: 'hide'
    },
    {
      label: "月最大产量（万）",
      name: "monthMaxYield",
      fieldType: 'inputNumber',
      disabledTarget: 'nowMonthYield',
      options: {
        rules: [
          {
            required: true,
            message: '月最大产量不能为空'
          },
          {
            validator: (_, val, cb, targetValue) => {
              if (targetValue > val) {
                cb('月最大产量不能小于现在月产量')
                return
              }
              cb()
            }
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入月最大产量',
      }
    },
    {
      label: "现在月产量（万）",
      name: "nowMonthYield",
      fieldType: 'inputNumber',
      disabledTarget: 'monthMaxYield',
      options: {
        rules: [
          {
            required: true,
            message: '现在月产量不能为空'
          },
          {
            validator: (_, val, cb, targetValue) => {
              if (val > targetValue) {
                cb('现在月产量不能大于月最大产量')
                return
              }
              cb()
            }
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入现在月产量',
      }
    },
    {
      label: "上年度销售总额（万元）",
      name: "preYearSaleroom",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '上年度销售总额不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入上年度销售总额',
      }
    }
  ]
  const columnsForProCapacity = [
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "规格型号",
      dataIndex: "modelBrand",
    },
    {
      title: "月最大产量（万）",
      dataIndex: "monthMaxYield",
      width: 200
    },
    {
      title: "现在月产量（万）",
      dataIndex: "nowMonthYield",
      width: 200
    },
    {
      title: "上年度销售总额（万元）",
      dataIndex: "preYearSaleroom",
      width: 200
    }
  ];

  // 现有生产情况
  const proSituFields = [
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
      label: "月生产能力（万）",
      name: "monthProductCapacity",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '月生产能力不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入月生产能力'
      }
    },
    {
      label: "占总产量(％)",
      name: "rateWithTotal",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '占总产量不能为空'
          }
        ]
      },
      props: {
        min: 0,
        max: 100,
        placeholder: '请输入占总产量（%）',
      }
    },
    {
      label: "产品交付周期(天）",
      name: "productDeliveryCycle",
      options: {
        rules: [
          {
            required: true,
            message: '产品交付周期不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入产品交付周期'
      },
      fieldType: 'inputNumber'
    },
    {
      label: "旺季月份",
      name: "offSeasonMonth",
      fieldType: 'select',
      selectOptions: Array.from({ length: 12 }).map((_, index) => ({ value: `${index + 1}`, name: `${index + 1}月` })),
      props: {
        mode: "multiple",
        style: {
          width: 200
        },
        defaultValue: [],
      }
    }
  ]
  const columnsForProSitu = [
    {
      title: "产品",
      dataIndex: "productName"
    },
    {
      title: "月生产能力（万）",
      dataIndex: "monthProductCapacity",
    },
    {
      title: "占总产量(％)",
      dataIndex: "rateWithTotal",
    },
    {
      title: "产品交付周期(天）",
      dataIndex: "productDeliveryCycle",
      width: 150
    },
    {
      title: "旺季月份",
      dataIndex: "offSeasonMonth",
      render(text) {
        return Array.isArray(text) ? text.join('，') : ''
      },
      width: 220
    },
  ];

  // 关键生产设备
  const equFields = [
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
      },
    },
    {
      label: "生产设备、在线检测设备名称",
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
      },
    },
    {
      label: "规格型号",
      name: "model",
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
      },
    },
    {
      label: "生产厂家",
      name: "productFactory",
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
      },
    },
    {
      label: "产地",
      name: "productArea",
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
      },
    },
    {
      label: "购买时间",
      name: "buyTime",
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
      },
      fieldType: 'datePicker',
      disabledDate: (current, mn) => current && current > mn()
    },
    {
      label: "数量",
      name: "number",
      options: {
        rules: [
          {
            required: true,
            message: '数量不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入数量'
      },
      fieldType: 'inputNumber',
    },
    {
      label: "用于何工序及生产哪类配件",
      options: {
        rules: [
          {
            required: true,
            message: '用于何工序及生产哪类配件不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入用于何工序及生产哪类配件'
      },
      name: "useTo",
    },
    {
      label: "单班产量",
      name: "singleClassProduction",
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '单班产量不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入单班产量'
      },
      fieldType: 'inputNumber',
    },
    {
      label: '计量单位',
      name: 'unitName',
      options: {
        initialValue: unitName,
        rules: [
          {
            required: true,
            message: '计量单位不能为空'
          }
        ]
      },
      props: {
        disabled: true
      }
    },
    {
      label: '计量单位代码',
      name: 'unitCode',
      options: {
        initialValue: unitCode
      },
      fieldType: 'hide'
    },
    {
      label: "目前状态",
      name: "currentStatus",
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
      },
    }
  ];
  const columnsForEqu = [
    {
      title: "工厂名称",
      dataIndex: "factoryName"
    },
    {
      title: "生产设备、在线检测设备名称",
      dataIndex: "equipmentName"
    },
    {
      title: "规格型号",
      dataIndex: "model"
    },
    {
      title: "生产厂家",
      dataIndex: "productFactory"
    },
    {
      title: "产地",
      dataIndex: "productArea"
    },
    {
      title: "购买时间",
      dataIndex: "buyTime",
      type: 'date'
    },
    {
      title: "数量",
      dataIndex: "number"
    },
    {
      title: "用于何工序及生产哪类配件",
      dataIndex: "useTo"
    },
    {
      title: "单班产量",
      dataIndex: "singleClassProduction"
    },
    {
      title: '计量单位',
      dataIndex: 'unitName',
      render() {
        return unitName
      }
    },
    {
      title: "目前状态",
      dataIndex: "currentStatus"
    },
  ];

  // 产品制造工艺流程简介
  const otherFields = [
    {
      label: "产品",
      name: "productName",
      options: {
        rules: [
          {
            required: true,
            message: '不能为空'
          }
        ]
      },
      props: {
        disabled: true
      }
    },
    {
      label: "流程及材料说明",
      name: "attachmentIds",
      fieldType: 'uploadFile',
      options: {
        rules: [
          {
            required: true,
            message: '流程及材料说明不能为空'
          }
        ]
      }
    }
  ]
  const columnsForOther = [
    {
      title: "产品",
      dataIndex: "productName"
    },
    {
      title: "流程及材料说明",
      dataIndex: "attachmentIds",
      type: 'uploadFile'
    },
  ];

  // 关键工艺及关键工艺设备情况
  const keyProcessFields = [
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
        disabled: true,
        placeholder: '请输入产品'
      }
    },
    {
      label: "关键工序/工艺名称",
      name: "keyTechnologyName",
      options: {
        rules: [
          {
            required: true,
            message: '关键工序/工艺名称不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入关键工序/工艺名称'
      }
    },
    {
      label: "工艺、技术要求",
      name: "technicalRequirement",
      options: {
        rules: [
          {
            required: true,
            message: '工艺、技术要求不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入工艺、技术要求'
      }
    },
    {
      label: "设备精度、工艺水平",
      name: "technologicalLevel",
      options: {
        rules: [
          {
            required: true,
            message: '设备精度、工艺水平不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入设备精度、工艺水平'
      }
    },
    {
      label: "备注",
      name: "remark",
      options: {
        rules: [
          {
            required: true,
            message: '备注不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入备注'
      },
      fieldType: 'textArea',
    }
  ]
  const columnsForKeyProcess = [
    {
      title: "产品",
      dataIndex: "productName",
      ellipsis: true,
      editable: false,
    },
    {
      title: "关键工序/工艺名称",
      dataIndex: "keyTechnologyName",
      ellipsis: true,
      editable: true,
      width: 200
    },
    {
      title: "工艺、技术要求",
      dataIndex: "technicalRequirement",
      ellipsis: true,
      editable: true,
    },
    {
      title: "设备精度、工艺水平",
      dataIndex: "technologicalLevel",
      ellipsis: true,
      editable: true,
      width: 150
    },
    {
      title: "备注",
      dataIndex: "remark",
      ellipsis: true,
      editable: true,
      inputType: 'TextArea',
    },
  ];

  async function handleSave() {
    if (getFieldValue('haveEnvironmentalTestingEquipment')) {
      // if (isEmptyArray(tableTata)) {
      //     message.info('列表至少填写一条设备信息！');
      //     return;
      // }
    }
    const value = await validateFieldsAndScroll();
    const saveParams = {
      ...value,
      tabKey: 'manufactureAbilityTab',
      productionCapacities: productionCapacities,
      currentProductionSituations: currentProductionSituations.map(item => ({
        ...item,
        offSeasonMonth: item.offSeasonMonth?.join(',')
      })),
      productManufacturingIntroductions: productManufacturingIntroductions,
      keyProductEquipments: keyProductEquipments,
      keyTechnologyEquipments: keyTechnologyEquipments,
      recommendDemandId: id,
      id: data.id
    };
    const formatParams = filterEmptyFileds(saveParams)
    const { success, message: msg } = await requestPostApi(formatParams)
    if (success) {
      message.success('保存数据成功');
      updateGlobalStatus();
      return
    }
    message.error(msg);
  }
  async function handleHoldData() {
    const value = getFieldsValue();
    const saveParams = {
      ...value,
      tabKey: 'manufactureAbilityTab',
      productionCapacities: productionCapacities,
      currentProductionSituations: currentProductionSituations.map(item => ({
        ...item,
        offSeasonMonth: item.offSeasonMonth?.join(',')
      })),
      productManufacturingIntroductions: productManufacturingIntroductions,
      keyProductEquipments: keyProductEquipments,
      keyTechnologyEquipments: keyTechnologyEquipments,
      recommendDemandId: id,
      id: data.id
    };
    const formatParams = filterEmptyFileds(saveParams)
    const { success, message: msg } = await requestPostApi(formatParams, { tempSave: true })
    if (success) {
      message.success('数据暂存成功');
      updateGlobalStatus();
      return
    }
    messge.error(msg)
  }

  return (
    <div>
      <Spin spinning={loading}>
        <PageHeader
          ghost={false}
          style={{
            padding: '0px'
          }}
          title="制造能力"
          extra={type === 'add' ? [
            <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={handleSave}>保存</Button>,
            <Button key="hold" style={{ marginRight: '12px' }} onClick={handleHoldData}>暂存</Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>生产能力</div>
              <div className={styles.content}>
                <EditorTable
                  dataSource={productionCapacities}
                  columns={columnsForProCapacity}
                  fields={proCapacity}
                  setDataSource={setproductionCapacities}
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>现有生产情况</div>
              <div className={styles.content}>
                <EditorTable
                  dataSource={currentProductionSituations}
                  columns={columnsForProSitu}
                  fields={proSituFields}
                  setDataSource={setcurrentProductionSituations}
                  copyLine={true}
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>关键生产设备</div>
              <div className={styles.content}>
                <Row>
                  <Col span={24}>
                    <FormItem label="设备清单" {...formLayout}>
                      {getFieldDecorator('keyProductEquipmentFileIds')(<UploadFile showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        disabled={type === 'detail'}
                        entityId={data.keyProductEquipmentFileId} />)}
                    </FormItem>
                  </Col>
                </Row>
                <EditorTable
                  dataSource={keyProductEquipments}
                  columns={columnsForEqu}
                  fields={equFields}
                  setDataSource={setkeyProductEquipments}
                  allowExport
                  allowImport
                  exportFunc={handleKeyProductEquipementsExport}
                  validateFunc={handleKeyProductEquipementsValidate}
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>产品制造工艺流程简介</div>
              <div className={styles.content}>
                <EditorTable
                  dataSource={productManufacturingIntroductions}
                  columns={columnsForOther}
                  fields={otherFields}
                  copyLine={true}
                  setDataSource={setproductManufacturingIntroductions}
                  allowCreate={false}
                  allowRemove={false}
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>
                关键工艺及关键工艺设备情况
                <span className={styles.hint}>（至少填写3行）</span>
              </div>
              <div className={styles.content}>
                <EditorTable
                  dataSource={keyTechnologyEquipments}
                  columns={columnsForKeyProcess}
                  fields={keyProcessFields}
                  setDataSource={setkeyTechnologyEquipments}
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

export default create()(ManufactureAbility);