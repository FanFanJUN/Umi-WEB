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
import { Form, Button, Spin, PageHeader, Row, Col, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../CommonUtil/EditTable';
import UploadFile from '../../../../../components/Upload';
import { router } from 'dva';
import { requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';
import { standardUnitProps } from '../../../../../utils/commonProps';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const ManufactureAbility = ({ form, updateGlobalStatus }) => {
  const [data, setData] = useState({});
  const [productionCapacities, setproductionCapacities] = useState([]);
  const [keyProductEquipments, setkeyProductEquipments] = useState([]);
  const [keyTechnologyEquipments, setkeyTechnologyEquipments] = useState([]);
  const [productManufacturingIntroductions, setproductManufacturingIntroductions] = useState([]);
  const [currentProductionSituations, setcurrentProductionSituations] = useState([]);
  const [loading, setLoading] = useState(false);

  const { query: { id, type = 'add' } } = router.useLocation();

  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { success, msg, data } = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'manufactureAbilityTab' });
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
        setproductionCapacities(productionCapacities.map(item => ({ ...item, guid: item.id })));
        setkeyProductEquipments(keyProductEquipments.map(item => ({ ...item, guid: item.id })));
        setkeyTechnologyEquipments(keyTechnologyEquipments.map(item => ({ ...item, guid: item.id })));
        setcurrentProductionSituations(currentProductionSituations.map(item => ({ ...item, guid: item.id })));
        setproductManufacturingIntroductions(productManufacturingIntroductions.map(item => ({ ...item, guid: item.id })));
      } else {
        message.error(msg);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 生产能力
  const columnsForProCapacity = [
    {
      title: "名称",
      dataIndex: "name",
      ellipsis: true,
      editable: true,
    },
    {
      title: "规格型号",
      dataIndex: "modelBrand",
      ellipsis: true,
      editable: true,
    },
    {
      title: "计量单位",
      dataIndex: "unitName",
      ellipsis: true,
      editable: true,
      inputType: 'comboList',
      props: {
        ...standardUnitProps,
        name: 'unitName',
        field: ['unitCode']
      }
    },
    {
      title: "月最大产量",
      dataIndex: "monthMaxYield",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "现在月产量",
      dataIndex: "nowMonthYield",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "上年度销售总额",
      dataIndex: "preYearSaleroom",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    }
  ];

  // 现有生产情况
  const columnsForProSitu = [
    {
      title: "产品",
      dataIndex: "productName",
      ellipsis: true,
      editable: false
    },
    {
      title: "月生产能力",
      dataIndex: "monthProductCapacity",
      ellipsis: true,
      inputType: 'InputNumber',
    },
    {
      title: "计量单位",
      dataIndex: "unitName",
      ellipsis: true,
      editable: true,
      inputType: 'comboList',
      props: {
        ...standardUnitProps,
        name: 'unitName',
        field: ['unitCode']
      }
    },
    {
      title: "占总产量％",
      dataIndex: "rateWithTotal",
      ellipsis: true,
      inputType: 'Input',
    },
    {
      title: "产品交付周期(天）",
      dataIndex: "productDeliveryCycle",
      ellipsis: true,
      inputType: 'InputNumber',
      width: 150
    },
    // {
    //     title: "产品直通率",
    //     dataIndex: "offSeasonMonth",
    //     ellipsis: true,
    //     inputType: 'Input',
    // },
    {
      title: "旺季月份",
      dataIndex: "offSeasonMonth",
      ellipsis: true,
      inputType: 'Input',
    },
  ];

  // 关键生产设备
  const columnsForEqu = [
    {
      title: "工厂名称",
      dataIndex: "factoryName",
      ellipsis: true,
      editable: true,
    },
    {
      title: "生产设备、在线检测设备名称",
      dataIndex: "equipmentName",
      ellipsis: true,
      editable: true,
    },
    {
      title: "规格型号",
      dataIndex: "model",
      ellipsis: true,
      editable: true,
    },
    {
      title: "生产厂家",
      dataIndex: "productFactory",
      ellipsis: true,
      editable: true,
      inputType: 'Input',
    },
    {
      title: "产地",
      dataIndex: "productArea",
      ellipsis: true,
      editable: true,
      inputType: 'Input',
    },
    {
      title: "购买时间",
      dataIndex: "buyTime",
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
      title: "用于何工序及生产哪类配件",
      dataIndex: "useTo",
      ellipsis: true,
      editable: true,
    },
    {
      title: "单班产量",
      dataIndex: "singleClassProduction",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "目前状态",
      dataIndex: "currentStatus",
      ellipsis: true,
      editable: true,
    },
  ];

  // 产品制造工艺流程简介
  const columnsForOther = [
    {
      title: "产品",
      dataIndex: "productName",
      ellipsis: true,
      editable: false
    },
    {
      title: "流程及材料说明",
      dataIndex: "attachmentIds",
      ellipsis: true,
      inputType: 'UploadFile',
      editable: true
    },
  ];

  // 关键工艺及关键工艺设备情况
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

  function handleSave() {
    if (getFieldValue('haveEnvironmentalTestingEquipment')) {
      // if (isEmptyArray(tableTata)) {
      //     message.info('列表至少填写一条设备信息！');
      //     return;
      // }
    }
    form.validateFieldsAndScroll((error, value) => {
      (value);
      if (error) return;
      const saveParams = {
        ...value,
        tabKey: 'manufactureAbilityTab',
        productionCapacities: productionCapacities,
        currentProductionSituations: currentProductionSituations,
        productManufacturingIntroductions: productManufacturingIntroductions,
        keyProductEquipments: keyProductEquipments,
        keyTechnologyEquipments: keyTechnologyEquipments,
        recommendDemandId: id,
        id: data.id
      };
      requestPostApi(filterEmptyFileds(saveParams)).then((res) => {
        if (res && res.success) {
          message.success('保存数据成功');
          updateGlobalStatus();
        } else {
          message.error(res.message);
        }
      })
    })
  }

  function setNewData(newData, type) {
    switch (type) {
      case 'productionCapacities':
        setproductionCapacities(newData);
        break;
      case 'keyProductEquipments':
        setkeyProductEquipments(newData);
        break;
      case 'keyTechnologyEquipments':
        setkeyTechnologyEquipments(newData);
        break;
      case 'currentProductionSituations':
        setcurrentProductionSituations(newData)
        break;
      case 'productManufacturingIntroductions':
        setproductManufacturingIntroductions(newData)
        break;
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
          title="制造能力"
          extra={type === 'add' ? [
            <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={() => handleSave()}>保存</Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>生产能力</div>
              <div className={styles.content}>
                <EditableFormTable
                  dataSource={productionCapacities}
                  columns={columnsForProCapacity}
                  rowKey='guid'
                  setNewData={setNewData}
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  tableType='productionCapacities'
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>现有生产情况</div>
              <div className={styles.content}>
                <EditableFormTable
                  dataSource={currentProductionSituations}
                  columns={columnsForProSitu}
                  rowKey='guid'
                  allowRemove={false}
                  isEditTable={type === 'add'}
                  setNewData={setNewData}
                  tableType='currentProductionSituations'
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
                      {getFieldDecorator('keyProductEquipmentFileIds', {
                        initialValue: '',
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<UploadFile showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        disabled={type==='detail'}
                        entityId={data.keyProductEquipmentFileId} />)}
                    </FormItem>
                  </Col>
                </Row>
                <EditableFormTable
                  dataSource={keyProductEquipments}
                  columns={columnsForEqu}
                  rowKey='guid'
                  setNewData={setNewData}
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  tableType='keyProductEquipments'
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>产品制造工艺流程简介</div>
              <div className={styles.content}>
                <EditableFormTable
                  dataSource={productManufacturingIntroductions}
                  columns={columnsForOther}
                  rowKey='guid'
                  setNewData={setNewData}
                  isEditTable={type === 'add'}
                  allowRemove={false}
                  tableType='productManufacturingIntroductions'
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>关键工艺及关键工艺设备情况</div>
              <div className={styles.content}>
                <EditableFormTable
                  dataSource={keyTechnologyEquipments}
                  columns={columnsForKeyProcess}
                  rowKey='guid'
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  copyLine={true}
                  setNewData={setNewData}
                  tableType='keyTechnologyEquipments'
                />
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default Form.create()(ManufactureAbility);