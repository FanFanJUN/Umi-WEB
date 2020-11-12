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

  const [supplierMajorCompetitors, setsupplierMajorCompetitors] = useState(data.supplierMajorCompetitors);

  const { getFieldDecorator } = form;

  const columnsForMarket = [
    { title: '产品', dataIndex: 'product', ellipsis: true, },
    { title: '年产值', dataIndex: 'yearAnnualValue', ellipsis: true, },
    { title: '币种', dataIndex: 'currencyName', ellipsis: true, },
    { title: '市场占有率', dataIndex: 'marketShare', ellipsis: true, },
  ].map(item => ({ ...item, align: 'center' }));
  const columnsForRank = [
    { title: '产品', dataIndex: 'product', ellipsis: true, },
    { title: '竞争对手', dataIndex: 'competitor', ellipsis: true, },
    { title: '年销售额', dataIndex: 'annualTurnover', ellipsis: true, inputType: 'InputNumber' },
    { title: '币种', dataIndex: 'currencyName', ellipsis: true, inputType: 'selectwithService' },
    { title: '年销量', dataIndex: 'annualSales', ellipsis: true, inputType: 'InputNumber' },
    { title: '市场占有率', dataIndex: 'marketShare', ellipsis: true, inputType: 'percentInput' },
  ].map(item => ({ ...item, align: 'center' }));

  function setNewData(newData) {
    setsupplierMajorCompetitors(newData);
    setTableData(newData, 'supplierMajorCompetitors');
  }

  return (
    <div>
      <Row>
        <Col span={24}>
          <FormItem label="行业知名度" {...formLayout}>
            {getFieldDecorator('industryVisibility', {
              initialValue: type === 'add' ? 'JOINT_VENTURES_INTERNATIONA_FAMOUS' : data.industryVisibility,
            })(<Radio.Group>
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
            })(<Input.TextArea placeholder="请输入主要竞争优势" style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
      </Row>
      <Divider orientation='left' orientation='left'>市场地位</Divider>
      <EditableFormTable
        columns={columnsForMarket}
        rowKey='guid'
        dataSource={data.marketPositions}
      />
      <Divider orientation='left' orientation='left'>主要竞争对手排名</Divider>
      <EditableFormTable
        columns={columnsForRank}
        bordered
        rowKey='guid'
        isEditTable={type === 'add'}
        isToolBar={type === 'add'}
        dataSource={supplierMajorCompetitors || []}
        setNewData={setNewData}
      />
    </div>
  )
})

export default MarketCompetitive;