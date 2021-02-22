/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:36:50
 * @LastEditTime: 2020-09-22 15:17:08
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/Customer.js
 * @Description: 客户相关
 * @Connect: 1981824361@qq.com
 */
import React from 'react';
import { Divider, Form, InputNumber, Row, Col, Input } from 'antd';
import moment from 'moment';
import { router } from 'dva';
import EditorTable from '../../../../../components/EditorTable';
import UploadFile from '../../../../../components/Upload';
import styles from '../index.less'
import { stateInfoPorps, businessMainPropsNoAuth, currencyTableProps } from '../../../../../utils/commonProps';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  }
};

const formLayout2 = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const OverallSit = ({
  DISABLED,
  getFieldDecorator
}) => {
  return (
    <Row>
      <Col span={12}>
        <FormItem label="现在所有客户数量（个）" {...formLayout2}>
          {getFieldDecorator('customersNumber', {
            // initialValue: type === 'add' ? '' : data.customersNumber,
            rules: [
              {
                required: true,
                message: '客户数量不能为空'
              }
            ]
          })(<InputNumber placeholder="请输入现在所有客户数量" style={{ width: '100%' }} disabled={DISABLED} />)}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem label="其中最大客户所占销售额(%)" {...formLayout2}>
          {getFieldDecorator('maxCustomerRate', {
            // initialValue: type === 'add' ? '' : data.shareDemanNumber,
            rules: [
              {
                required: true,
                message: '销售额不能为空'
              }
            ]
          })(
            <InputNumber style={{ width: '100%' }} disabled={DISABLED} min={0} max={100} />,
          )}
        </FormItem>
      </Col>
    </Row>
  )
}

const CustermerInfo = ({
  type,
  data,
  DISABLED,
  getFieldDecorator
}) => {
  return (
    <Row>
      <Col span={12}>
        <FormItem label="情况介绍" {...formLayout}>
          {getFieldDecorator('situationDescription', {
            // initialValue: type === 'add' ? '' : data.situationDescription,
          })(<Input.TextArea placeholder="请输入情况介绍" style={{ width: '100%' }} disabled={DISABLED} />)}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem label="资料" {...formLayout}>
          {getFieldDecorator('situationAttachmentIds', {
          })(
            <UploadFile style={{ width: '100%' }}
              showColor={type !== 'add' ? true : false}
              type={DISABLED ? 'show' : null}
              entityId={data.situationAttachmentId} />,
          )}
        </FormItem>
      </Col>
    </Row>
  )
}

const Customer = ({
  form,
  type,
  data,
  changhongSaleInfos = [],
  mainCustomers = [],
  exportSituations = [],
  supplierOrderInfos = [],
  threeYearPlans = [],
  setChanghongSaleInfos,
  setMainCustomers,
  setExportSituations,
  setSupplierOrderInfos,
  setThreeYearPlans
}) => {
  const DISABLED = type === 'detail';
  const { getFieldDecorator } = form;
  const { query: { unitName, unitCode } } = router.useLocation();
  const groupFields = [
    {
      label: '供货BU名称',
      name: 'buName',
      fieldType: 'comboList',
      props: {
        ...businessMainPropsNoAuth,
        name: 'buName',
        field: ['buCode'],
        placeholder: '请选择供货BU名称'
      },
      options: {
        rules: [
          {
            required: true,
            message: '供货BU名称不能为空'
          }
        ]
      }
    },
    {
      label: '配件名称',
      name: 'paretsName',
      props: {
        placeholder: '请输入配件名称'
      },
      options: {
        rules: [
          {
            required: true,
            message: '配件名称不能为空'
          }
        ]
      }
    },
    {
      label: '单价（无税）',
      name: 'unitPrice',
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '单价不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入无税单价'
      }
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
      label: '年供货量',
      name: 'annualOutput',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        placeholder: '请输入年供货量'
      },
      options: {
        rules: [
          {
            required: true,
            message: '年供货量不能为空'
          }
        ]
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
      label: '占该BU该配件比例(%)',
      name: 'buRate',
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '占比不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入占比'
      }
    },
  ]
  const columnsForGroup = [
    {
      title: '供货BU名称',
      dataIndex: 'buName',
    },
    {
      title: '配件名称',
      dataIndex: 'paretsName'
    },
    {
      title: '单价（无税）',
      dataIndex: 'unitPrice'
    },
    {
      title: '币种',
      dataIndex: 'currencyName',
      width: 120
    },
    {
      title: '年供货量',
      dataIndex: 'annualOutput'
    },
    {
      title: '计量单位',
      dataIndex: 'unitName'
    },
    {
      title: '占该BU该配件比例(%)',
      dataIndex: 'buRate',
      width: 203
    },
  ].map(item => ({ ...item, align: 'center' }));
  const majorcustomersFields = [
    {
      label: '名称',
      name: 'name',
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
      label: '所在行业',
      name: 'industry',
      props: {
        placeholder: '请输入所在行业'
      },
      options: {
        rules: [
          {
            required: true,
            message: '所在行业不能为空'
          }
        ]
      }
    },
    {
      label: '客户所在行业占比(%)',
      name: 'industryCustomerRate',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        placeholder: '填写所在行业占比（%）'
      },
      options: {
        rules: [
          {
            required: true,
            message: '行业占比不能为空'
          }
        ]
      }
    },
    {
      label: '开始供货时间',
      name: 'startSupplyTime',
      fieldType: 'datePicker',
      disabledDate: (current, mn) => current && current > mn(),
      options: {
        rules: [
          {
            required: true,
            message: '开始供货时间不能为空'
          }
        ]
      },
      props: {
        placeholder: '请选择开始供货时间'
      }
    },
    {
      label: '供货数量',
      name: 'supplyNumber',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        placeholder: '请填写供货数量'
      },
      options: {
        rules: [
          {
            required: true,
            message: '供货数量不能为空'
          }
        ]
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
      label: '企业在该客户的销售额(万元)',
      name: 'salesName',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        placeholder: '请填写销售额（万元）'
      },
      options: {
        rules: [
          {
            required: true,
            message: '销售额不能为空'
          }
        ]
      }
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
            message: '请选择币种'
          }
        ]
      }
    },
    {
      label: '企业占该客户同类物资采购份额(%)',
      name: 'customerPurchaseRate',
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '份额占比不能为空'
          }
        ]
      },
      props: {
        min: 0,
        max: 100,
        placeholder: '请输入份额占比'
      }
    },
    {
      label: '客户采购额占企业总体销售比例(%)',
      name: 'customerSaleRate',
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '销售占比不能为空'
          }
        ]
      },
      props: {
        min: 0,
        max: 100,
        placeholder: '请输入销售占比'
      }
    },
    {
      label: '客户地理分布',
      name: 'geographical',
      props: {
        placeholder: '请填写客户地理分布'
      },
      options: {
        rules: [
          {
            required: true,
            message: '地理分布不能为空'
          }
        ]
      }
    }
  ]
  const columnsForMajorcustomers = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true
    },
    {
      title: '所在行业',
      dataIndex: 'industry',
      ellipsis: true,
    },
    {
      title: '客户所在行业占比',
      dataIndex: 'industryCustomerRate',
      ellipsis: true,
      width: 250,
      inputType: 'percentInput'
    },
    {
      title: '开始供货时间',
      dataIndex: 'startSupplyTime',
      ellipsis: true,
      render: (text) => {
        return text && moment(text).format('YYYY-MM-DD');
      },
      inputType: 'DatePicker',
      props: {
        disabledDate: (current) => current && current > moment()
      }
    },
    {
      title: '供货数量',
      dataIndex: 'supplyNumber',
      ellipsis: true,
      inputType: 'InputNumber'
    },
    {
      title: '计量单位',
      dataIndex: 'unitName'
    },
    {
      title: '企业在该客户的销售额（万元）',
      dataIndex: 'salesName',
      ellipsis: true,
      width: 250,
      inputType: 'InputNumber'
    },
    {
      title: '币种',
      dataIndex: 'currencyName',
      ellipsis: true,
      editable: true,
      inputType: 'selectwithService',
      width: 120
    },
    {
      title: '企业占该客户同类物资采购份额',
      dataIndex: 'customerPurchaseRate',
      ellipsis: true,
      width: 250,
      inputType: 'percentInput'
    },
    {
      title: '客户采购额占企业总体销售比例',
      dataIndex: 'customerSaleRate',
      ellipsis: true,
      inputType: 'percentInput',
      width: 250
    },
    {
      title: '客户地理分布',
      dataIndex: 'geographical',
      ellipsis: true,
    },
  ].map(item => ({ ...item, align: 'center' }));
  const expSituFields = [
    {
      label: '出口国家',
      name: 'exportCountryName',
      fieldType: 'comboList',
      props: {
        ...stateInfoPorps,
        name: 'exportCountryName',
        field: ['exportCountryId'],
        placeholder: '请选择出口国家'
      },
      options: {
        rules: [
          {
            required: true,
            message: '出口国家不能为空'
          }
        ]
      }
    },
    {
      label: '金额（万元）',
      name: 'money',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        placeholder: '请输入金额'
      },
      options: {
        rules: [
          {
            required: true,
            message: '金额不能为空'
          }
        ]
      }
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
    }
  ]
  const columnsForExpSitu = [
    {
      title: '出口国家',
      dataIndex: 'exportCountryName',
      width: 240
    },
    {
      title: '金额(万元)',
      dataIndex: 'money'
    },
    {
      title: '币种',
      dataIndex: 'currencyName'
    },
  ].map(item => ({ ...item, align: 'center' }));
  const orderFields = [
    {
      label: '客户',
      name: 'customer',
      props: {
        placeholder: '请输入客户名称'
      },
      options: {
        rules: [
          {
            required: true,
            message: '客户不能为空'
          }
        ]
      }
    },
    {
      label: '订单或合同号',
      name: 'orderContract',
      props: {
        placeholder: '请输入订单或合同号'
      },
      options: {
        rules: [
          {
            required: true,
            message: '订单或合同号不能为空'
          }
        ]
      }
    },
    {
      label: '关键件/重要件',
      name: 'importantPart',
      fieldType: 'select',
      options: {
        rules: [
          {
            required: true,
            message: '请选择是否关键/重要件'
          }
        ]
      },
      props: {
        placeholder: '选择是否关键/重要件'
      }
    },
    {
      label: '应用经验证明材料',
      name: 'applicationExperienceFileIds',
      fieldType: 'uploadFile',
      options: {
        rules: [
          {
            required: true,
            message: '证明材料不能为空',
            type: 'array'
          }
        ]
      }
    }
  ]
  const columnsForOrder = [
    {
      title: '客户',
      dataIndex: 'customer',
    },
    {
      title: '订单或合同号',
      dataIndex: 'orderContract',
    },
    {
      title: '关键件/重要件',
      dataIndex: 'importantPart',
      width: 172
    },
    {
      title: '应用经验证明材料',
      dataIndex: 'applicationExperienceFileIds',
      type: 'uploadFile'
    },
  ].map(item => ({ ...item, align: 'center' }));
  const devPlanFields = [
    {
      label: '项目（方案）',
      name: 'project',
      options: {
        rules: [
          {
            required: true,
            message: '项目(方案)不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入项目（方案）名'
      }
    },
    {
      label: '证据',
      name: 'proof',
      options: {
        rules: [
          {
            required: true,
            message: '证据不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入证据'
      }
    },
    {
      label: '项目描述',
      name: 'projectDescription',
      fieldType: 'textArea',
      options: {
        rules: [
          {
            required: true,
            message: '项目描述不能为空'
          }
        ]
      },
      props: {
        autoSize: {
          minRows: 4,
          maxRows: 6
        },
        placeholder: '请输入项目描述'
      }
    }
  ]
  const columnsForDevPlan = [
    {
      title: '项目（方案）',
      dataIndex: 'project',
    },
    {
      title: '证据',
      dataIndex: 'proof'
    },
    {
      title: '项目描述',
      dataIndex: 'projectDescription',
    },
  ].map(item => ({ ...item, align: 'center' }));
  return (
    <div>
      <Divider orientation='left'>总体情况</Divider>
      <OverallSit data={data} DISABLED={DISABLED} getFieldDecorator={getFieldDecorator} type={type} />
      <Divider orientation='left'>长虹集团</Divider>
      <EditorTable
        columns={columnsForGroup}
        rowKey='guid'
        size='small'
        fields={groupFields}
        mode={type}
        dataSource={changhongSaleInfos}
        setDataSource={setChanghongSaleInfos}
      />
      <Divider orientation='left'>其他主要客户情况<span className={styles.hint}>(至少填写前3名客户，如不足可填无，请提供近三年数据)</span></Divider>
      <EditorTable
        columns={columnsForMajorcustomers}
        bordered
        rowKey='guid'
        fields={majorcustomersFields}
        mode={type}
        dataSource={mainCustomers}
        setDataSource={setMainCustomers}
      />
      <Divider orientation='left'>出口情况<span className={styles.hint}>（请提供上一年度数据）</span></Divider>
      <EditorTable
        columns={columnsForExpSitu}
        bordered
        rowKey='guid'
        fields={expSituFields}
        mode={type}
        dataSource={exportSituations}
        setDataSource={setExportSituations}
      />
      <Divider orientation='left'>客户合作情况介绍和资料</Divider>
      <CustermerInfo type={type} data={data} DISABLED={DISABLED} getFieldDecorator={getFieldDecorator} />
      <Divider orientation='left'>主要客户近半年内的订单或合同及证明材料</Divider>
      <EditorTable
        columns={columnsForOrder}
        bordered
        rowKey='guid'
        fields={orderFields}
        mode={type}
        dataSource={supplierOrderInfos}
        setDataSource={setSupplierOrderInfos}
      />
      <Divider orientation='left'>未来三年发展规划</Divider>
      <EditorTable
        fields={devPlanFields}
        mode={type}
        columns={columnsForDevPlan}
        bordered
        rowKey='guid'
        dataSource={threeYearPlans}
        setDataSource={setThreeYearPlans}
      />
    </div>
  )
}

export default Customer;