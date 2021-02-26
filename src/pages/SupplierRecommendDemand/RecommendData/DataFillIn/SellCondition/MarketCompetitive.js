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
import { Divider, Form, Row, Col, Input, Radio } from 'antd';
import { router } from 'dva';
import EditorTable from '../../../../../components/EditorTable';
import styles from '../index.less';
import { currencyTableProps } from '../../../../../utils/commonProps';
const currencyOpt = {
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
}
const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const MarketCompetitive = ({
  form,
  setSupplierMajorCompetitors,
  supplierMajorCompetitors = [],
  marketPositions = [],
  setMarketPositions,
  type = 'create'
}) => {
  const { query: { unitName, unitCode } } = router.useLocation();
  const DISABLED = type === 'detail';
  const { getFieldDecorator } = form;
  const marketFields = [
    {
      name: 'productName',
      label: '产品',
      props: {
        disabled: true
      }
    },
    {
      name: 'yearAnnualValue',
      label: '年产值(万元)',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        placeholder: '请填写年产值'
      },
      options: {
        rules: [
          {
            required: true,
            message: '年产值不能为空'
          }
        ]
      }
    },
    {
      ...currencyOpt
    },
    {
      label: '市场占有率(%)',
      name: 'marketShare',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        max: 100,
        placeholder: '请填写市场占有率'
      }
    }
  ]
  const columnsForMarket = [
    {
      title: '产品',
      dataIndex: 'productName',

    },
    {
      title: '年产值（万元）',
      dataIndex: 'yearAnnualValue',
    },
    {
      title: '币种',
      dataIndex: 'currencyName'
    },
    {
      title: '市场占有率（%）',
      dataIndex: 'marketShare'
    },
  ].map(item => ({ ...item, align: 'center' }));
  const rankFields = [
    {
      label: '产品',
      name: 'productName',
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
      label: '竞争对手',
      name: 'competitor',
      options: {
        rules: [
          {
            required: true,
            message: '竞争对手名称不能为空'
          }
        ]
      },
      props: {
        placeholder: '请填写竞争对手'
      }
    },
    {
      label: '年销售额(万元)',
      name: 'annualTurnover',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        placeholder: '请填写年销售额'
      },
      options: {
        rules: [
          {
            required: true,
            message: '年产值不能为空'
          }
        ]
      }
    },
    {
      ...currencyOpt
    },
    {
      label: '年销量(万)',
      name: 'annualSales',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        placeholder: '请填写年销量'
      },
      options: {
        rules: [
          {
            required: true,
            message: '年销量不能为空'
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
      label: '市场占有率（%）',
      name: 'marketShare',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        max: 100,
        placeholder: '请填写市场占有率'
      },
      options: {
        rules: [
          {
            required: true,
            message: '市场占有率不能为空'
          }
        ]
      }
    }
  ]
  const columnsForRank = [
    {
      title: '产品',
      dataIndex: 'productName'
    },
    {
      title: '竞争对手',
      dataIndex: 'competitor'
    },
    {
      title: '年销售额（万元）',
      dataIndex: 'annualTurnover'
    },
    {
      title: '币种',
      dataIndex: 'currencyName'
    },
    {
      title: '年销量（万）',
      dataIndex: 'annualSales'
    },
    {
      title: '计量单位',
      dataIndex: 'unitName'
    },
    {
      title: '市场占有率（%）',
      dataIndex: 'marketShare'
    },
  ].map(item => ({ ...item, align: 'center' }));
  return (
    <div>
      <Row>
        <Col span={24}>
          <FormItem label="行业知名度" {...formLayout}>
            {getFieldDecorator('industryVisibilityEnum', {
              // initialValue: type === 'add' ? 'JOINT_VENTURES_INTERNATIONA_FAMOUS' : formData.industryVisibilityEnum,
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
              // initialValue: type === 'add' ? '' : formData.competitiveEdge,
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
      <Divider orientation='left' orientation='left'>市场地位<span className={styles.hint}>（请提供上一年度数据）</span></Divider>
      <EditorTable
        columns={columnsForMarket}
        rowKey='guid'
        allowRemove={false}
        allowCreate={false}
        dataSource={marketPositions}
        setDataSource={setMarketPositions}
        fields={marketFields}
        mode={type}
      />
      <Divider orientation='left' orientation='left'>主要竞争对手排名<span className={styles.hint}>(至少提供三个竞争对手的信息)</span></Divider>
      <EditorTable
        columns={columnsForRank}
        copyLine={true}
        rowKey='guid'
        dataSource={supplierMajorCompetitors}
        setDataSource={setSupplierMajorCompetitors}
        fields={rankFields}
        mode={type}
      />
    </div>
  )
}

export default MarketCompetitive;