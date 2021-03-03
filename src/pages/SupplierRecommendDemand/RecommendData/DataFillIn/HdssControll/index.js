/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:22
 * @LastEditTime: 2020-09-22 10:33:06
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/HdssControll/index.js
 * @Description: 产品有害物质管控 tab
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
  Divider,
  message
} from 'antd';
import styles from '../../DataFillIn/index.less';
import EditorTable from '../../../../../components/EditorTable';
import UploadFile from '../../../../../components/Upload';
import { router } from 'dva';
import { requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';
import { environmentProps } from '../../../../../utils/commonProps';
const { Item: FormItem, create } = Form;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const HdssControll = ({ form, updateGlobalStatus }) => {

  const [data, setData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { query: { id, type = 'add' } } = router.useLocation();

  const {
    getFieldDecorator,
    setFieldsValue,
    getFieldsValue,
    validateFieldsAndScroll
  } = form;
  const {
    haveEnvironmentalTestingEquipment,
    haveRohs,
    chemicalsControl
  } = getFieldsValue()
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { success, message: msg, data } = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'hdssControllTab' });
      setLoading(false);
      if (success) {
        const { environmentalTestingEquipments = [], ...other } = data;
        await setFieldsValue(other)
        await setData(data);
        await setTableData(environmentalTestingEquipments.map(item => ({ ...item, guid: item.id })));
        return
      }
      message.error(res.message);
    };
    fetchData();
  }, []);
  const fields = [
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
      label: "设备型号",
      name: "equipmentModel",
      options: {
        rules: [
          {
            required: true,
            message: '设备型号不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入设备型号'
      }
    },
    {
      label: "检测项目（元素）",
      name: "testingItem",
      fieldType: 'comboList',
      props: {
        name: 'testingItem',
        field: ['testingItemValue'],
        ...environmentProps
      },
      options: {
        rules: [
          {
            required: true,
            message: '检测项目不能为空'
          }
        ]
      }
    },
    {
      label: "备注",
      name: "remark",
      fieldType: 'textArea',
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
      }
    }
  ]
  const columns = [
    {
      title: "设备名称",
      dataIndex: "equipmentName",
    },
    {
      title: "设备型号",
      dataIndex: "equipmentModel",
    },
    {
      title: "检测项目（元素）",
      dataIndex: "testingItem",
      width: 150
    },
    {
      title: "备注",
      dataIndex: "remark",
      inputType: 'TextArea',
    },
  ];

  async function handleSave() {
    if (haveEnvironmentalTestingEquipment) {
      if (tableData.length === 0) {
        message.error('列表至少填写一条设备信息！');
        return
      }
      const vl = tableData.every(item => !Object.is(null, item));
      if (!vl) {
        message.error('设备信息未填写完整！');
        return;
      }
    }
    const value = await validateFieldsAndScroll();
    const saveParams = {
      ...value,
      tabKey: 'hdssControllTab',
      rohsFileId: value.rohsFileId ? (value.rohsFileId)[0] : null,
      recommendDemandId: id,
      environmentalTestingEquipments: tableData,
      id: data.id
    };
    const params = filterEmptyFileds(saveParams);
    setLoading(true)
    const { success, message: msg } = await requestPostApi(params)
    setLoading(false)
    if (success) {
      message.success(msg);
      updateGlobalStatus();
      return
    }
    message.error(msg);
  }
  async function handleHoldData() {
    const value = getFieldsValue();
    const saveParams = {
      ...value,
      tabKey: 'hdssControllTab',
      rohsFileId: value.rohsFileId ? (value.rohsFileId)[0] : null,
      recommendDemandId: id,
      environmentalTestingEquipments: tableData,
      id: data.id
    };
    const params = filterEmptyFileds(saveParams);
    setLoading(true)
    const { success, message: msg } = await requestPostApi(params, { tempSave: true })
    setLoading(false)
    if (success) {
      message.success('数据暂存成功');
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
          title="产品有害物质管控"
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
              <div className={styles.title}>环保检测设备<span className={styles.hint}>（如有则至少填一行，检测项目主数据中选）</span></div>
              <div className={styles.content}>
                <Row>
                  <Col span={24}>
                    <FormItem label="有无自有环保检测设备" {...formLayout}>
                      {getFieldDecorator('haveEnvironmentalTestingEquipment', {
                        initialValue: data.haveEnvironmentalTestingEquipment,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(
                        <Radio.Group value={'1'} disabled={type === 'detail'}>
                          <Radio value={true}>有</Radio>
                          <Radio value={false}>无</Radio>
                        </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                {
                  haveEnvironmentalTestingEquipment ?
                    <EditorTable
                      dataSource={tableData}
                      columns={columns}
                      fields={fields}
                      setDataSource={setTableData}
                      mode={type}
                    />
                    : null
                }
                <Divider orientation='left'>RoHS</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem label="RoHS管控标准" {...formLayout}>
                      {getFieldDecorator('haveRohs', {
                        initialValue: type === 'add' ? true : data.haveRohs,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(
                        <Radio.Group value={'1'} disabled={type === 'detail'}>
                          <Radio value={true}>有</Radio>
                          <Radio value={false}>无</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="标准类型" {...formLayout}>
                      {getFieldDecorator('standardTypeEnum', {
                        initialValue: type === 'add' ? 'ROHS_10' : data.standardTypeEnum,
                        rules: [
                          {
                            required: haveRohs,
                            message: '标准类型不能为空'
                          }
                        ]
                      })(
                        <Radio.Group disabled={type === 'detail'}>
                          <Radio value={'ROHS_10'}>RoHS1.0</Radio>
                          <Radio value={'ROHS_20'}>RoHS2.0</Radio>
                          <Radio value={'ROHS_10_HALOGEN_FREE'}>RoHS1.0+无卤</Radio>
                          <Radio value={'ROHS_20_HALOGEN_FREE'}>RoHS2.0+无卤</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="RoHS检测报告" {...formLayout}>
                      {getFieldDecorator('rohsFileIds', {
                        initialValue: type === 'add' ? '' : data.rohsFileId,
                        rules: [
                          {
                            required: haveRohs,
                            message: 'RoHS检测报告不能为空'
                          }
                        ]
                      })(
                        <UploadFile
                          showColor={type !== 'add' ? true : false}
                          disabled={type === 'detail'}
                          type={type !== 'add'}
                          entityId={data.rohsFileId}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Divider orientation='left'>REACH</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem label="化学品注册、评估、许可和限制" {...formLayout}>
                      {getFieldDecorator('chemicalsControl', {
                        initialValue: type === 'add' ? true : data.chemicalsControl,
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(
                        <Radio.Group disabled={type === 'detail'}>
                          <Radio value={true}>有</Radio>
                          <Radio value={false}>无</Radio>
                        </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="备注" {...formLayout}>
                      {getFieldDecorator('remark', {
                        initialValue: type === 'add' ? '' : data.remark,
                        rules: [
                          {
                            required: chemicalsControl,
                            message: '备注不能为空'
                          }
                        ]
                      })(<Input.TextArea disabled={type === 'detail'} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem label="附件材料" {...formLayout}>
                      {getFieldDecorator('attachmentIds', {
                        initialValue: type === 'add' ? '' : data.attachmentIds,
                        rules: [
                          {
                            required: chemicalsControl,
                            message: '请上传附件资料'
                          }
                        ]
                      })(
                        <UploadFile
                          showColor={type !== 'add' ? true : false}
                          type={type === 'add' ? '' : 'show'}
                          disabled={type === 'detail'}
                          entityId={data.attachmentId}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default create()(HdssControll);