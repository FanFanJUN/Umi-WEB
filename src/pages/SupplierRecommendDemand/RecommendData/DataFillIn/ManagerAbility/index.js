/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:19
 * @LastEditTime: 2020-09-22 10:31:28
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/ManagerAbility/index.js
 * @Description: 供应链管理能力 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, Row, Col, Divider, Radio, Input, InputNumber, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import UploadFile from '../CommonUtil/UploadFile';
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
  const [loading, setLoading] = useState(false);

  const { query: { id, type = 'add' } } = router.useLocation();

  const { getFieldDecorator, getFieldValue } = form;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'managerAbilityTab' });
      if (res.success) {
        res.data && setData(res.data);
        res.data && setkeyMaterialSuppliers(res.data.keyMaterialSuppliers);
      } else {
        message.error(res.message);
      }
      setLoading(false);
    };
    if (type !== 'add') {
      fetchData();
    }
  }, []);

  const columnsForCarTransport = [
    {
      "title": "运输方式",
      "dataIndex": "deliveryType",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "运输距离（公里）",
      "dataIndex": "deliveryDistance",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "运输时间（小时）",
      "dataIndex": "deliveryTime",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "发运频率（次/周）",
      "dataIndex": "deliveryFrequency",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "正常情况交货期（天）",
      "dataIndex": "normalDeliveryTime",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "紧急情况交货期（天）",
      "dataIndex": "urgencyDeliveryTime",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
  ];
  // 关键原材料及供应商名单
  const columnsForKeyMat = [
    {
      "title": "产品",
      "dataIndex": "productName",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "原材料名称及规格型号/牌号",
      "dataIndex": "modelBrand",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "用途",
      "dataIndex": "useTo",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "品牌及供应商名称（自制可写“自制”）",
      "dataIndex": "supplierName",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "材料采购周期（天）",
      "dataIndex": "procurementCycle",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "年采购金额",
      "dataIndex": "purchaseAmount",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "币种",
      "dataIndex": "currencyName",
      "ellipsis": true,
      "editable": true,
      "inputType": 'selectwithService',
    },
    {
      "title": "备注",
      "dataIndex": "remark",
      "ellipsis": true,
      "editable": true,
      "inputType": 'TextArea',
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
        recommendDemandId: id || '676800B6-F19D-11EA-9F88-0242C0A8442E',
        logisticsBusTransports: data.logisticsBusTransports || [],
        keyMaterialSuppliers: keyMaterialSuppliers || [],
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

  function setNewData(newData) {
    setkeyMaterialSuppliers(newData);
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
            <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={() => handleSave()}>
              保存
                        </Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>成本控制</div>
              <div className={styles.content}>
                <Row>
                  <Col span={12}>
                    <FormItem label="每年制定查成本降低目标并对执行情况进行评价" {...formLayout}>
                      {getFieldDecorator('reduceCostEvaluation', {
                        initialValue: type === 'add' ? '' : data.reduceCostEvaluation,
                      })(<Radio.Group>
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
                        entityId={data.costControlPlanFileIds}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="具有专门的成本核算流程，核算表格" {...formLayout}>
                      {getFieldDecorator('costAccountingOrganization', {
                        initialValue: type === 'add' ? '' : data.costAccountingOrganization,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
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
                        entityId={data.costAccountingListFileIds}
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
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
                      })(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="面积（平方米）" {...formLayout}>
                      {getFieldDecorator('warehouseArea', {
                        initialValue: type === 'add' ? '' : data.warehouseArea,
                      })(<InputNumber />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="可存储量（个）" {...formLayout}>
                      {getFieldDecorator('storageNumber', {
                        initialValue: type === 'add' ? '' : data.storageNumber,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<InputNumber />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>备货流程、系统</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="建有备货流程、系统" {...formLayout}>
                      {getFieldDecorator('stockUpProcess', {
                        initialValue: type === 'add' ? true : data.stockUpProcess,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="附件资料" {...formLayout}>
                      {getFieldDecorator('stockUpProcessFileIds', {
                        initialValue: type === 'add' ? '' : data.stockUpProcessFileIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        entityId={data.stockUpProcessFileIds}
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="证明材料" {...formLayout}>
                      {getFieldDecorator('deliveryProcessFileIds', {
                        initialValue: type === 'add' ? '' : data.deliveryProcessFileIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        entityId={data.deliveryProcessFileIds}
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="证明材料" {...formLayout}>
                      {getFieldDecorator('urgentDeliveryProcessFileIds', {
                        initialValue: type === 'add' ? '' : data.urgentDeliveryProcessFileIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        entityId={data.urgentDeliveryProcessFileIds}
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="证明材料" {...formLayout}>
                      {getFieldDecorator('customerProcessFileIds', {
                        initialValue: type === 'add' ? '' : data.customerProcessFileIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        entityId={data.rohsFileId}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>物料存储</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="生产过程中物料的暂存、仓储中物料、成品的存放区域是否与其供货能力相适应" {...formLayout}>
                      {getFieldDecorator('materialMatchSupplyAbility', {
                        initialValue: type === 'add' ? true : data.materialMatchSupplyAbility,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="具体措施说明" {...formLayout}>
                      {getFieldDecorator('delayDeliveryNoticeCustomerFileIds', {
                        initialValue: type === 'add' ? '' : data.delayDeliveryNoticeCustomerFileIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        entityId={data.rohsFileId}
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
                  dataSource={[]}
                  columns={columnsForCarTransport}
                  rowKey='name1'
                // isEditTable
                // setNewData={setNewData}
                />
                <Divider orientation='left'>空运</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="是否存在空运" {...formLayout}>
                      {getFieldDecorator('haveAirLiftDelivery', {
                        initialValue: type === 'add' ? '' : data.haveAirLiftDelivery,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<InputNumber />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="紧急情况交货期(小时)" {...formLayout}>
                      {getFieldDecorator('airLiftUrgentDeliveryDate', {
                        initialValue: type === 'add' ? '' : data.airLiftUrgentDeliveryDate,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<InputNumber />)}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>发运</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="在发运数量上是否能够灵活处理" {...formLayout}>
                      {getFieldDecorator('flexibleShipmentQuantity', {
                        initialValue: type === 'add' ? true : data.flexibleShipmentQuantity,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
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
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<Radio.Group>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="证明材料" {...formLayout}>
                      {getFieldDecorator('dangerousChemicalShipperFileIds', {
                        initialValue: type === 'add' ? '' : data.dangerousChemicalShipperFileIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(<UploadFile
                        showColor={type !== 'add' ? true : false}
                        type={type !== 'add'}
                        entityId={data.dangerousChemicalShipperFileIds}
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