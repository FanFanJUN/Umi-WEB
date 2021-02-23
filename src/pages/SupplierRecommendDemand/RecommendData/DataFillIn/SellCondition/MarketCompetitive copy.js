/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 16:16:44
 * @LastEditTime: 2020-09-18 16:07:41
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/MarketCompetitive.js
 * @Description: 市场地位及竞争状况
 * @Connect: 1981824361@qq.com
 */
import React from 'react';
import { useState } from 'react';
import { Divider, Form, Row, Col, Input, Radio } from 'antd';
import EditableFormTable from '../CommonUtil/EditTable';
import { useEffect } from 'react';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const MarketCompetitive = React.forwardRef(({ form, data, type, setTableData }, ref) => {
  const DISABLED = type === 'detail';
  const [supplierMajorCompetitors, setsupplierMajorCompetitors] = useState([]);
  const [marketPositions, setmarketPositions] = useState([])
  const { getFieldDecorator } = form;

  const columnsForMarket = [
    {
      title: '产品',
      dataIndex: 'productName',
      ellipsis: true,
      editable: false
    },
    {
      title: '年产值（万元）',
      dataIndex: 'yearAnnualValue',
      ellipsis: true,
      inputType: 'InputNumber'
    },
    {
      title: '币种',
      dataIndex: 'currencyName',
      ellipsis: true,
      inputType: 'selectwithService'
    },
    {
      title: '市场占有率（%）',
      dataIndex: 'marketShare',
      ellipsis: true,
      inputType: 'percentInput'
    },
  ].map(item => ({ ...item, align: 'center' }));
  const columnsForRank = [
    {
      title: '产品',
      dataIndex: 'productName',
      ellipsis: true,
      editable: false
    },
    {
      title: '竞争对手',
      dataIndex: 'competitor',
      ellipsis: true,
    },
    {
      title: '年销售额（万元）',
      dataIndex: 'annualTurnover',
      ellipsis: true,
      inputType: 'InputNumber'
    },
    {
      title: '币种',
      dataIndex: 'currencyName',
      ellipsis: true,
      inputType: 'selectwithService'
    },
    {
      title: '年销量（万）',
      dataIndex: 'annualSales',
      ellipsis: true,
      inputType: 'InputNumber'
    },
    {
      title: '市场占有率（%）',
      dataIndex: 'marketShare',
      ellipsis: true,
      inputType: 'percentInput'
    },
  ].map(item => ({ ...item, align: 'center' }));

  function setNewData(newData, type) {
    switch (type) {
      case 'supplierMajorCompetitors':
        setsupplierMajorCompetitors(newData);
        break;
      case 'marketPositions':
        setmarketPositions(newData)
        break;
    }
    setTableData(newData, type);
  }
  useEffect(() => {
    const { supplierMajorCompetitors = [], marketPositions = [] } = data;
    setsupplierMajorCompetitors(supplierMajorCompetitors?.map(item => ({ ...item, guid: !!item.id ? item.id : item.guid })))
    setmarketPositions(marketPositions?.map(item => ({ ...item, guid: !!item.id ? item.id : item.guid })))
  }, [data])
  return (
    <div>
      <Row>
        <Col span={24}>
          <FormItem label="行业知名度" {...formLayout}>
            {getFieldDecorator('industryVisibilityEnum', {
              initialValue: type === 'add' ? 'JOINT_VENTURES_INTERNATIONA_FAMOUS' : data.industryVisibilityEnum,
            })(<Radio.Group disabled={DISABLED}>
              <Radio value={'INTERNATIONAL_FAMOUS'}>行业内的国际知名企业</Radio>
              <Radio value={'JOINT_VENTURES_INTERNATIONA_FAMOUS'}>行业内国际知名企业在中国的合资企业</Radio>
              <Radio value={'DOMESTIC_FAMOUS'}>行业内的国内知名企业</Radio>
              <Radio value={'ALL_NOT'}>都不是</Radio>
            </Radio.Group>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="企业的主要竞争优势" {...formLayout}>
            {getFieldDecorator('competitiveEdge', {
              initialValue: type === 'add' ? '' : data.competitiveEdge,
              rules: [
                {
                  required: true,
                  message: '企业的主要竞争优势不能为空',
                },
              ],
            })(<Input.TextArea placeholder="请输入主要竞争优势" style={{ width: '100%' }} disabled={DISABLED} />)}
          </FormItem>
        </Col>
      </Row>
      <Divider orientation='left' orientation='left'>市场地位</Divider>
      <EditableFormTable
        columns={columnsForMarket}
        rowKey='guid'
        bordered
        isEditTable={type === 'add'}
        allowRemove={false}
        dataSource={marketPositions}
        setNewData={setNewData}
        tableType='marketPositions'
      />
      <Divider orientation='left' orientation='left'>主要竞争对手排名</Divider>
      <EditableFormTable
        columns={columnsForRank}
        copyLine={true}
        bordered
        rowKey='guid'
        isEditTable={type === 'add'}
        isToolBar={type === 'add'}
        dataSource={supplierMajorCompetitors}
        setNewData={setNewData}
        tableType='supplierMajorCompetitors'
      />
    </div>
  )
})

export default MarketCompetitive;