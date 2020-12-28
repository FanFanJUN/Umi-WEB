/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:36:50
 * @LastEditTime: 2020-09-22 15:17:08
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/Customer.js
 * @Description: 客户相关
 * @Connect: 1981824361@qq.com
 */
import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Divider, Form, InputNumber, Row, Col, Input } from 'antd';
import moment from 'moment';
import EditableFormTable from '../CommonUtil/EditTable';
import UploadFile from '../../../../../components/Upload';
import { stateInfoPorps, businessMainPropsNoAuth } from '../../../../../utils/commonProps';

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
  data,
  DISABLED,
  getFieldDecorator,
  type
}) => {
  return (
    <Row>
      <Col span={12}>
        <FormItem label="现在所有客户数量（个）" {...formLayout2}>
          {getFieldDecorator('customersNumber', {
            initialValue: type === 'add' ? '' : data.customersNumber,
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
            initialValue: type === 'add' ? '' : data.shareDemanNumber,
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
            initialValue: type === 'add' ? '' : data.situationDescription,
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

const Customer = React.forwardRef(({
  form,
  type,
  data,
  setTableData
}, ref) => {
  const DISABLED = type === 'detail';
  const { getFieldDecorator } = form;
  const [changhongSaleInfos, setchanghongSaleInfos] = useState([]);
  const [mainCustomers, setmainCustomers] = useState([]);
  const [exportSituations, setexportSituations] = useState([]);
  const [supplierOrderInfos, setsupplierOrderInfos] = useState([]);
  const [threeYearPlans, setthreeYearPlans] = useState([]);
  useImperativeHandle(ref, ({
    setchanghongSaleInfos,
    setmainCustomers,
    setexportSituations,
    setsupplierOrderInfos,
    setthreeYearPlans
  }))
  const columnsForGroup = [
    {
      title: '供货BU名称',
      dataIndex: 'buName',
      ellipsis: true,
      inputType: 'comboList',
      props: {
        ...businessMainPropsNoAuth,
        name: 'buName',
        field: ['buCode']
      },
      width: 250
    },
    {
      title: '配件名称',
      dataIndex: 'paretsName',
      ellipsis: true,
    },
    {
      title: '单价（无税）',
      dataIndex: 'unitPrice',
      ellipsis: true,
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
      title: '年供货量',
      dataIndex: 'annualOutput',
      ellipsis: true,
      inputType: 'InputNumber'
    },
    {
      title: '占该BU该配件比例',
      dataIndex: 'buRate',
      ellipsis: true,
      inputType: 'percentInput',
      width: 203
    },
  ].map(item => ({ ...item, align: 'center' }));

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

  const columnsForExpSitu = [
    {
      title: '出口国家',
      dataIndex: 'exportCountryName',
      ellipsis: true,
      inputType: 'comboList',
      props: {
        ...stateInfoPorps,
        name: 'exportCountryName',
        field: ['exportCountryId'],
        style: {
          width: 200
        }
      },
      width: 240
    },
    {
      title: '金额',
      dataIndex: 'money',
      ellipsis: true,
      inputType: 'InputNumber'
    },
    {
      title: '币种',
      dataIndex: 'currencyName',
      ellipsis: true,
      inputType: 'selectwithService'
    },
  ].map(item => ({ ...item, align: 'center' }));
  const columnsForOrder = [
    {
      title: '客户',
      dataIndex: 'customer',
      ellipsis: true,
    },
    {
      title: '订单或合同号',
      dataIndex: 'orderContract',
      ellipsis: true,
    },
    {
      title: '关键件/重要件',
      dataIndex: 'importantPart',
      ellipsis: true,
      inputType: 'Select', width: 172
    },
    {
      title: '应用经验证明材料',
      dataIndex: 'applicationExperienceFileIds',
      ellipsis: true,
      inputType: 'UploadFile',
      editable: true,
      width: 181
    },
  ].map(item => ({ ...item, align: 'center' }));

  const columnsForDevPlan = [
    {
      title: '项目（方案）',
      dataIndex: 'project',
      ellipsis: true,
    },
    {
      title: '项目描述',
      dataIndex: 'projectDescription',
      ellipsis: true,
      inputType: 'TextArea',
      width: 300
    },
    {
      title: '证据',
      dataIndex: 'proof',
      ellipsis: true,
    },
  ].map(item => ({ ...item, align: 'center' }));

  function setNewData(newData, type) {
    switch (type) {
      case 'changhongSaleInfos':
        setchanghongSaleInfos(newData);
        break;
      case 'mainCustomers':
        setmainCustomers(newData);
        break;
      case 'supplierOrderInfos':
        setsupplierOrderInfos(newData);
        break;
      case 'threeYearPlans':
        setthreeYearPlans(newData);
        break;
      case 'exportSituations':
        setexportSituations(newData)
        break;
      default:
        break;
    }
    setTableData(newData, type);
  }
  useEffect(() => {
    const {
      changhongSaleInfos = [],
      mainCustomers = [],
      exportSituations = [],
      supplierOrderInfos = [],
      threeYearPlans = []
    } = data;
    setchanghongSaleInfos(changhongSaleInfos.map(item => ({ ...item, guid: item.id })))
    setmainCustomers(mainCustomers.map(item => ({ ...item, guid: item.id })))
    setexportSituations(exportSituations.map(item => ({ ...item, guid: item.id })))
    setsupplierOrderInfos(supplierOrderInfos.map(item => ({ ...item, guid: item.id })))
    setthreeYearPlans(threeYearPlans.map(item => ({ ...item, guid: item.id })))
  }, [data])
  return (
    <div>
      <Divider orientation='left'>总体情况</Divider>
      <OverallSit data={data} DISABLED={DISABLED} getFieldDecorator={getFieldDecorator} type={type} />
      <Divider orientation='left'>长虹集团</Divider>
      <EditableFormTable
        columns={columnsForGroup}
        rowKey='guid'
        size='small'
        isToolBar={type === 'add'}
        isEditTable={type === 'add'}
        dataSource={changhongSaleInfos || []}
        setNewData={setNewData}
        tableType='changhongSaleInfos'
      />
      <Divider orientation='left'>其他主要客户情况</Divider>
      <EditableFormTable
        columns={columnsForMajorcustomers}
        bordered
        rowKey='guid'
        isToolBar={type === 'add'}
        isEditTable={type === 'add'}
        dataSource={mainCustomers || []}
        setNewData={setNewData}
        tableType='mainCustomers'
      />
      <Divider orientation='left'>出口情况</Divider>
      <EditableFormTable
        columns={columnsForExpSitu}
        bordered
        rowKey='guid'
        isToolBar={type === 'add'}
        isEditTable={type === 'add'}
        dataSource={exportSituations}
        setNewData={setNewData}
        tableType='exportSituations'
      />
      <Divider orientation='left'>客户合作情况介绍和资料</Divider>
      <CustermerInfo type={type} data={data} DISABLED={DISABLED} getFieldDecorator={getFieldDecorator} />
      <Divider orientation='left'>主要客户近半年内的订单或合同及证明材料</Divider>
      <EditableFormTable
        columns={columnsForOrder}
        bordered
        checkbox={{ multiSelect: false }}
        rowKey='guid'
        isToolBar={type === 'add'}
        isEditTable={type === 'add'}
        dataSource={supplierOrderInfos || []}
        setNewData={setNewData}
        tableType='supplierOrderInfos'
      />
      <Divider orientation='left'>未来三年发展规划</Divider>
      <EditableFormTable
        columns={columnsForDevPlan}
        bordered
        rowKey='guid'
        isToolBar={type === 'add'}
        isEditTable={type === 'add'}
        dataSource={threeYearPlans || []}
        setNewData={setNewData}
        tableType='threeYearPlans'
      />
    </div>
  )
})

export default Customer;