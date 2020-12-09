/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:13
 * @LastEditTime: 2020-09-22 10:31:56
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/Other/index.js
 * @Description: 其他附加资料
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, Radio, Row, Col, Input, InputNumber, Divider, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../CommonUtil/EditTable';
import UploadFile from '../../../../../components/Upload';
import { router } from 'dva';
import { requestPostApi, requestGetApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';


const InputGroup = Input.Group;
const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const Other = ({ form, updateGlobalStatus }) => {

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [equityStructures, setequityStructures] = useState([]);

  const { query: { id, type = 'add' } } = router.useLocation();

  const { getFieldDecorator, setFieldsValue } = form;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { success, message: msg, data } = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'otherTab', });
      setLoading(false);
      if (success) {
        const { equityStructures = [] } = data;
        await setData(data);
        await setequityStructures(equityStructures.map(item => ({ ...item, guid: item.id })));
        return
      }
      message.error(msg)
    };
    fetchData();
  }, []);

  async function handleSave() {
    const value = await form.validateFieldsAndScroll()
    const params = filterEmptyFileds({
      ...value,
      tabKey: 'otherTab',
      recommendDemandId: id,
      equityStructures,
      id: data.id
    })
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

  function setNewData(newData) {
    setequityStructures(newData);
  }

  const columns = [
    {
      title: "投资方 ",
      dataIndex: "investor",
      ellipsis: true,
      editable: true,
    },
    {
      title: "出资额",
      dataIndex: "capitalContribution",
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
    },
    {
      title: "出资比例",
      dataIndex: "capitalKey",
      ellipsis: true,
      editable: true,
      inputType: 'percentInput',
    },
    {
      title: "出资方式",
      dataIndex: "capitalMethod",
      ellipsis: true,
      editable: true,
      inputType: 'Input',
    },
    {
      title: "备注",
      dataIndex: "remark",
      ellipsis: true,
      editable: true,
      inputType: 'TextArea',
    }
  ];
  return (
    <div>
      <Spin spinning={loading}>
        <PageHeader
          ghost={false}
          style={{
            padding: '0px'
          }}
          title="其他附加资料"
          extra={type === 'add' ? [
            <Button
              key="save"
              type="primary"
              style={{ marginRight: '12px' }}
              disabled={loading}
              onClick={handleSave}
            >保存</Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>企业照片</div>
              <div className={styles.content}>
                <Row>
                  <Col span={12}>
                    <FormItem label="公司大门" {...formLayout}>
                      {getFieldDecorator('corporationGatewayIds', {
                        initialValue: type === 'add' ? '' : data.corporationGatewayIds,
                        rules: [
                          {
                            required: true,
                            message: '不能为空',
                          },
                        ],
                      })(
                        <UploadFile
                          showColor={type !== 'add' ? true : false}
                          type={type === 'add' ? '' : 'show'}
                          disabled={type === 'detail'}
                          entityId={data.corporationGateway} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="生产车间全景" {...formLayout}>
                      {getFieldDecorator('corporationWorkShopIds', {
                        initialValue: type === 'add' ? '' : data.corporationWorkShopIds,
                        rules: [
                          {
                            required: true,
                            message: '不能为空',
                          },
                        ],
                      })(
                        <UploadFile
                          showColor={type !== 'add' ? true : false}
                          type={type === 'add' ? '' : 'show'}
                          disabled={type === 'detail'}
                          entityId={data.corporationWorkShop} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="原料仓库全景" {...formLayout}>
                      {getFieldDecorator('rawMaterialWarehouseIds', {
                        initialValue: type === 'add' ? '' : data.rawMaterialWarehouseIds,
                        rules: [
                          {
                            required: true,
                            message: '不能为空',
                          },
                        ],
                      })(
                        <UploadFile
                          showColor={type !== 'add' ? true : false}
                          disabled={type === 'detail'}
                          type={type === 'add' ? '' : 'show'}
                          entityId={data.rawMaterialWarehouse} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="成品仓库全景" {...formLayout}>
                      {getFieldDecorator('productWarehouseIds', {
                        initialValue: type === 'add' ? '' : data.productWarehouseIds,
                        rules: [
                          {
                            required: true,
                            message: '不能为空',
                          },
                        ],
                      })(
                        <UploadFile
                          showColor={type !== 'add' ? true : false}
                          disabled={type === 'detail'}
                          type={type === 'add' ? '' : 'show'}
                          entityId={data.productWarehouse} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="实验室全景" {...formLayout}>
                      {getFieldDecorator('labIds', {
                        initialValue: type === 'add' ? '' : data.labIds,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '自主技术开发能力不能为空',
                        //     },
                        // ],
                      })(
                        <UploadFile
                          showColor={type !== 'add' ? true : false}
                          disabled={type === 'detail'}
                          type={type === 'add' ? '' : 'show'}
                          entityId={data.lab} />)}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>组织机构</div>
              <div className={styles.content}>
                <Row>
                  <Col span={24}>
                    <FormItem label="组织机构" {...formLayout}>
                      {getFieldDecorator('organizationIds', {
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ]
                      })(
                        <UploadFile
                          showColor={type !== 'add' ? true : false}
                          disabled={type === 'detail'}
                          type={type === 'add' ? '' : 'show'}
                          entityId={data.organizationId} />)}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>股权构成及见证材料</div>
              <div className={styles.content}>
                <Row>
                  <Col span={24}>
                    <FormItem label="工商局加盖公章的验资报告" {...formLayout}>
                      {getFieldDecorator('capitalVerificationReportFileIds', {
                        initialValue: type === 'add' ? '' : data.capitalVerificationReportFileIds,
                        rules: [
                          {
                            required: true,
                            message: '工商局加盖公章的验资报告不能为空',
                          },
                        ],
                      })(
                        <UploadFile
                          disabled={type === 'detail'}
                          showColor={type !== 'add' ? true : false}
                          type={type === 'add' ? '' : 'show'}
                          entityId={data.capitalVerificationReportFileId} />)}
                    </FormItem>
                  </Col>
                </Row>
                <EditableFormTable
                  dataSource={equityStructures || []}
                  columns={columns}
                  rowKey='guid'
                  setNewData={setNewData}
                  isEditTable={type === 'add'}
                  isToolBar={type === 'add'}
                />
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default Form.create()(Other);