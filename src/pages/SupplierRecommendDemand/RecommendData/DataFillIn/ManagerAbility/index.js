/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:19
 * @LastEditTime: 2020-09-22 10:31:28
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/ManagerAbility/index.js
 * @Description: 供应链管理能力 Tab
 * @Connect: 1981824361@qq.com
 */
import { useState, useEffect } from 'react';
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
  InputNumber,
  message
} from 'antd';
import { utils } from 'suid';
import styles from '../../DataFillIn/index.less';
import UploadFile from '../../../../../components/Upload';
import EditableFormTable from '../CommonUtil/EditTable';
import { requestPostApi, requestGetApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';
import { router } from 'dva';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 14,
  },
  wrapperCol: {
    span: 10,
  },
};

const ManagerAbility = ({ form, updateGlobalStatus }) => {

  const [data, setData] = useState({});
  const [keyMaterialSuppliers, setkeyMaterialSuppliers] = useState([]);
  // 汽运
  const [logisticsBusTransports, setlogisticsBusTransports] = useState([
    {
      deliveryType: '自有车辆运输',
      guid: utils.getUUID()
    },
    {
      deliveryType: '外包整车发运',
      guid: utils.getUUID()
    },
    {
      deliveryType: '外包零星发运',
      guid: utils.getUUID()
    }
  ]);
  const [loading, setLoading] = useState(false);

  const { query: { id, type = 'add' } } = router.useLocation();

  const {
    getFieldDecorator,
    getFieldValue,
    getFieldsValue,
    setFieldsValue
  } = form;

  const {
    haveAirLiftDelivery,
    dangerousChemicalShipper
  } = getFieldsValue();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, message: msg, success } = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'managerAbilityTab' });
      setLoading(false);
      if (success) {
        const { keyMaterialSuppliers = [], logisticsBusTransports = [], ...other } = data;
        await setFieldsValue(other)
        await setData(data);
        logisticsBusTransports.length > 0 && await setlogisticsBusTransports(logisticsBusTransports.map(item => ({ ...item, guid: item.id })))
        await setkeyMaterialSuppliers(keyMaterialSuppliers.map(item => ({ ...item, guid: item.id })));
        return
      }
      message.error(msg);
    };
    fetchData();
  }, []);

  const columnsForCarTransport = [
    {
      title: "运输方式",
      dataIndex: "deliveryType",
      ellipsis: true,
      editable: true,
    },
    {
      title: "运输距离（公里）",
      dataIndex: "deliveryDistance",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
      width: 150,
    },
    {
      title: "运输时间（小时）",
      dataIndex: "deliveryTime",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
      width: 130,
    },
    {
      title: "发运频率（次/周）",
      dataIndex: "deliveryFrequency",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
      width: 140
    },
    {
      title: "正常情况交货期（天）",
      dataIndex: "normalDeliveryTime",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
      width: 160
    },
    {
      title: "紧急情况交货期（天）",
      dataIndex: "urgencyDeliveryTime",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
      width: 170
    },
  ];
  // 关键原材料及供应商名单
  const columnsForKeyMat = [
    {
      title: "产品",
      dataIndex: "productName",
      ellipsis: true,
      editable: false,
    },
    {
      title: "原材料名称及规格型号/牌号",
      dataIndex: "modelBrand",
      ellipsis: true,
      editable: true,
      width: 200
    },
    {
      title: "用途",
      dataIndex: "useTo",
      ellipsis: true,
      editable: true,
    },
    {
      title: "品牌及供应商名称（自制可写“自制”）",
      dataIndex: "supplierName",
      ellipsis: true,
      editable: true,
      width: 280
    },
    {
      title: "材料采购周期（天）",
      dataIndex: "procurementCycle",
      ellipsis: true,
      editable: true,
      width: 150,
      inputType: 'InputNumber',
    },
    {
      title: "年采购金额",
      dataIndex: "purchaseAmount",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "币种",
      dataIndex: "currencyName",
      ellipsis: true,
      editable: true,
      inputType: 'selectwithService',
      width: 120
    },
    {
      title: "备注",
      dataIndex: "remark",
      ellipsis: true,
      editable: true,
      inputType: 'TextArea',
      width: 150
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
        tabKey: 'managerAbilityTab',
        rohsFileId: value.rohsFileId ? (value.rohsFileId)[0] : null,
        recommendDemandId: id,
        id: data?.id,
        logisticsBusTransports: logisticsBusTransports,
        keyMaterialSuppliers: keyMaterialSuppliers,
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
      case 'logisticsBusTransports':
        setlogisticsBusTransports(newData)
        break;
      case 'keyMaterialSuppliers':
        setkeyMaterialSuppliers(newData);
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
          title="供应链管理能力"
          extra={type === 'add' ? [
            <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={handleSave}>保存</Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>成本控制</div>
              <div className={styles.content}>
                <Row>
                  <Col span={12}>
                    <FormItem label="每年制定成本降低目标并对执行情况进行评价" {...formLayout}>
                      {getFieldDecorator('reduceCostEvaluation', {
                        initialValue: type === 'add' ? '' : data.reduceCostEvaluation,
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
                  <Col span={12}>
                    <FormItem label="成本控制计划书" {...formLayout}>
                      {getFieldDecorator('costControlPlanFileIds', {
                        initialValue: type === 'add' ? '' : data.costControlPlanFileIds,
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
                        entityId={data.costControlPlanFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="具有专门的成本核算流程，核算表格" {...formLayout}>
                      {getFieldDecorator('costAccountingOrganization', {
                        initialValue: type === 'add' ? '' : data.costAccountingOrganization,
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
                  <Col span={12}>
                    <FormItem label="成本核算表单" {...formLayout}>
                      {getFieldDecorator('costAccountingListFileIds', {
                        initialValue: type === 'add' ? '' : data.costAccountingListFileIds,
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
                        entityId={data.costAccountingListFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>交货管控</div>
              <div className={styles.content}>
                <Divider orientation='left'>紧急交货</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="是否愿意承接紧急订单" {...formLayout}>
                      {getFieldDecorator('rushOrder', {
                        initialValue: type === 'add' ? true : data.rushOrder,
                        rules: [
                          {
                            required: true,
                            message: '请选择是否愿意承接紧急订单',
                          },
                        ],
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>库存能力</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="是否根据要求维持一定库存(含质量安全库存)" {...formLayout}>
                      {getFieldDecorator('inventory', {
                        initialValue: type === 'add' ? true : data.inventory,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
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
                  <Col span={8}>
                    <FormItem label="库房地点" {...formLayout}>
                      {getFieldDecorator('warehouseLocation', {
                        initialValue: type === 'add' ? '' : data.warehouseLocation,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<Input disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="面积（平方米）" {...formLayout}>
                      {getFieldDecorator('warehouseArea', {
                        initialValue: type === 'add' ? '' : data.warehouseArea,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<InputNumber min={0} disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="可存储量（个）" {...formLayout}>
                      {getFieldDecorator('storageNumber', {
                        initialValue: type === 'add' ? '' : data.storageNumber,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(<InputNumber min={0} disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>备货流程、系统</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="建有备货流程、系统" {...formLayout}>
                      {getFieldDecorator('stockUpProcess', {
                        initialValue: type === 'add' ? true : data.stockUpProcess,
                        rules: [
                          {
                            required: true,
                            message: '请选择'
                          }
                        ]
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="附件资料" {...formLayout}>
                      {getFieldDecorator('stockUpProcessFileIds', {
                        initialValue: type === 'add' ? '' : data.stockUpProcessFileIds,
                        rules: [
                          {
                            required: !!getFieldValue('stockUpProcess'),
                            message: '附件资料不能为空',
                          },
                        ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        disabled={type === 'detail'}
                        type={type !== 'add'}
                        entityId={data.stockUpProcessFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>交货流程、系统</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="建有交货流程、系统" {...formLayout}>
                      {getFieldDecorator('deliveryProcess', {
                        initialValue: type === 'add' ? true : data.deliveryProcess,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          },
                        ],
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="证明材料" {...formLayout}>
                      {getFieldDecorator('deliveryProcessFileIds', {
                        initialValue: type === 'add' ? '' : data.deliveryProcessFileIds,
                        rules: [
                          {
                            required: !!getFieldValue('deliveryProcess'),
                            message: '证明材料不能为空',
                          },
                        ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        disabled={type === 'detail'}
                        entityId={data.deliveryProcessFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>紧急交货的流程、系统</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="紧急交货的流程、系统" {...formLayout}>
                      {getFieldDecorator('urgentDeliveryProcess', {
                        initialValue: type === 'add' ? true : data.urgentDeliveryProcess,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          },
                        ],
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="证明材料" {...formLayout}>
                      {getFieldDecorator('urgentDeliveryProcessFileIds', {
                        initialValue: type === 'add' ? '' : data.urgentDeliveryProcessFileIds,
                        rules: [
                          {
                            required: getFieldValue('urgentDeliveryProcess'),
                            message: '自主技术开发能力不能为空',
                          },
                        ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        disabled={type === 'detail'}
                        type={type !== 'add'}
                        entityId={data.urgentDeliveryProcessFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>客户满意度、客户投诉处理流程、系统</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="客户满意度、客户投诉处理流程、系统" {...formLayout}>
                      {getFieldDecorator('customerProcess', {
                        initialValue: type === 'add' ? true : data.customerProcess,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          },
                        ],
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="证明材料" {...formLayout}>
                      {getFieldDecorator('customerProcessFileIds', {
                        initialValue: type === 'add' ? '' : data.customerProcessFileIds,
                        rules: [
                          {
                            required: getFieldValue('customerProcess'),
                            message: '自主技术开发能力不能为空',
                          },
                        ],
                      })(<UploadFile
                        disabled={type === 'detail'}
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        entityId={data.customerProcessFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>物料存储</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem label="生产过程中物料的暂存、仓储中物料、成品的存放区域是否与其供货能力相适应" {...formLayout}>
                      {getFieldDecorator('materialMatchSupplyAbility', {
                        initialValue: type === 'add' ? true : data.materialMatchSupplyAbility,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
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
                    <FormItem label="是否按照先进先出进行管理" {...formLayout}>
                      {getFieldDecorator('fifoManage', {
                        initialValue: type === 'add' ? true : data.fifoManage,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          },
                        ],
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>延误处理</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="保证在交货延误时能够尽早通知用户的良好预警措施" {...formLayout}>
                      {getFieldDecorator('delayDeliveryNoticeCustomer', {
                        initialValue: type === 'add' ? true : data.delayDeliveryNoticeCustomer,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          },
                        ],
                      })(<Radio.Group disabled={type === 'detail'}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="具体措施说明" {...formLayout}>
                      {getFieldDecorator('delayDeliveryNoticeCustomerFileIds', {
                        initialValue: type === 'add' ? '' : data.delayDeliveryNoticeCustomerFileIds,
                        rules: [
                          {
                            required: getFieldValue('delayDeliveryNoticeCustomer'),
                            message: '具体措施说明不能为空',
                          },
                        ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        disabled={type === 'detail'}
                        type={type !== 'add'}
                        entityId={data.delayDeliveryNoticeCustomerFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>物流</div>
              <div className={styles.content}>
                <Divider orientation='left'>汽运</Divider>
                <EditableFormTable
                  dataSource={logisticsBusTransports}
                  columns={columnsForCarTransport}
                  rowKey='guid'
                  isEditTable={type === 'add'}
                  allowRemove={false}
                  setNewData={setNewData}
                  tableType='logisticsBusTransports'
                />
                <Divider orientation='left'>空运</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="是否存在空运" {...formLayout}>
                      {getFieldDecorator('haveAirLiftDelivery', {
                        initialValue: type === 'add' ? '' : data.haveAirLiftDelivery,
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
                    <FormItem label="正常情况交货期(小时)" {...formLayout}>
                      {getFieldDecorator('airLiftDeliveryDate', {
                        initialValue: type === 'add' ? '' : data.airLiftDeliveryDate,
                        rules: [
                          {
                            required: haveAirLiftDelivery,
                            message: '正常情况交货期不能为空',
                          },
                        ],
                      })(<InputNumber min={0} disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="紧急情况交货期(小时)" {...formLayout}>
                      {getFieldDecorator('airLiftUrgentDeliveryDate', {
                        initialValue: type === 'add' ? '' : data.airLiftUrgentDeliveryDate,
                        rules: [
                          {
                            required: haveAirLiftDelivery,
                            message: '紧急情况交货期不能为空',
                          },
                        ],
                      })(<InputNumber min={0} disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>发运</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="在发运数量上是否能够灵活处理" {...formLayout}>
                      {getFieldDecorator('flexibleShipmentQuantity', {
                        initialValue: type === 'add' ? true : data.flexibleShipmentQuantity,
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
                <Divider orientation='left'>危化品处理</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="是否选择具有危险化学品合法运输资质的承运方" {...formLayout}>
                      {getFieldDecorator('dangerousChemicalShipper', {
                        initialValue: type === 'add' ? true : data.dangerousChemicalShipper,
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
                  <Col span={12}>
                    <FormItem label="证明材料" {...formLayout}>
                      {getFieldDecorator('dangerousChemicalShipperFileIds', {
                        initialValue: type === 'add' ? '' : data.dangerousChemicalShipperFileIds,
                        rules: [
                          {
                            required: dangerousChemicalShipper,
                            message: '请上传证明材料',
                          },
                        ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        disabled={type === 'detail'}
                        type={type !== 'add'}
                        entityId={data.dangerousChemicalShipperFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>供应商管控</div>
              <div className={styles.content}>
                <EditableFormTable
                  dataSource={keyMaterialSuppliers}
                  columns={columnsForKeyMat}
                  rowKey='guid'
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                  setNewData={setNewData}
                  copyLine={true}
                  tableType='keyMaterialSuppliers'
                />
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default Form.create()(ManagerAbility);