/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:07
 * @LastEditTime: 2020-09-21 10:35:59
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/QuotationAndGPCA/index.js
 * @Description: 报价单及成分分析表 Tab
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
  message
} from 'antd';
import styles from '../../DataFillIn/index.less';
import EditorTable from '../../../../../components/EditorTable';
import { router } from 'dva';
import { requestPostApi, requestGetApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds, currencyOpt } from '../CommonUtil/utils';

const QuotationAndGPCA = ({ updateGlobalStatus }) => {
  const [data, setData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supplyCostStructure, setSupplyCostStructure] = useState(true);

  const { query: { id, type = 'add' } } = router.useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, message: msg, success } = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'quotationAndGPCATab' });
      setLoading(false);
      if (success) {
        const { costAnalyses = [], supplyCostStructure = true } = data;
        await setData(data);
        await setSupplyCostStructure(supplyCostStructure)
        await setDataSource(costAnalyses.map(item => ({ ...item, guid: item.id })))
        return
      }
      message.error(msg)
    };
    fetchData();
  }, []);
  const fields = [
    {
      label: "产品名称",
      name: "productName",
      options: {
        rules: [
          {
            required: true,
            message: '产品不能为空'
          }
        ]
      },
      props: {
        disabled: true
      }
    },
    {
      label: "型号/规格",
      name: "model",
      options: {
        rules: [
          {
            required: true,
            message: '型号/规格不能为空'
          }
        ]
      },
      props: {
        placeholder: '请输入型号/规格'
      },
    },
    {
      label: "原材料成本(元)",
      name: "rawMaterialCost",
      options: {
        rules: [
          {
            required: true,
            message: '原材料成本不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入原材料成本',
      },
      fieldType: 'inputNumber',
    },
    {
      label: "包装材料成本(元)",
      name: "packageMaterialCost",
      options: {
        rules: [
          {
            required: true,
            message: '包装材料成本不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入包装材料成本',
      },
      fieldType: 'inputNumber',
    },
    {
      label: "设备使用成本(元)",
      name: "requirementCost",
      options: {
        rules: [
          {
            required: true,
            message: '设备使用成本不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入设备使用成本',
      },
      fieldType: 'inputNumber',
    },
    {
      label: "厂房使用成本(元)",
      name: "plantUtilizationCost",
      options: {
        rules: [
          {
            required: true,
            message: '厂房使用成本不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入厂房使用成本',
      },
      fieldType: 'inputNumber',
    },
    {
      label: "工厂人工费用(元)",
      name: "laborCost",
      options: {
        rules: [
          {
            required: true,
            message: '工厂人工费用不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入工厂人工费用',
      },
      fieldType: 'inputNumber',
    },
    {
      label: "管理费用(元)",
      name: "manageCost",
      options: {
        rules: [
          {
            required: true,
            message: '管理费用不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入管理费用',
      },
      fieldType: 'inputNumber',
    },
    {
      label: "运费(元)",
      name: "transportCost",
      options: {
        rules: [
          {
            required: true,
            message: '运费不能为空'
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请输入运费',
      },
      fieldType: 'inputNumber',
    },
    {
      ...currencyOpt
    }
  ]
  const columns = [
    {
      title: "产品名称",
      dataIndex: "productName"
    },
    {
      title: "型号/规格",
      dataIndex: "model"
    },
    {
      title: "原材料成本",
      dataIndex: "rawMaterialCost"
    },
    {
      title: "包装材料成本",
      dataIndex: "packageMaterialCost"
    },
    {
      title: "设备用成本",
      dataIndex: "requirementCost"
    },
    {
      title: "厂房使用成本",
      dataIndex: "plantUtilizationCost"
    },
    {
      title: "工厂人工费用",
      dataIndex: "laborCost"
    },
    {
      title: "管理费用",
      dataIndex: "manageCost"
    },
    {
      title: "运费",
      dataIndex: "transportCost"
    },
    {
      title: "币种",
      dataIndex: "currencyName"
    },
  ];

  function onChange({ target: { value } }) {
    setSupplyCostStructure(value);
  }

  async function handleSave() {
    const saveParams = {
      recommendDemandId: id,
      tabKey: 'quotationAndGPCATab',
      supplyCostStructure,
      costAnalyses: dataSource,
      id: data.id
    };
    const formatParams = filterEmptyFileds(saveParams)
    setLoading(true)
    const { success, message: msg } = await requestPostApi(formatParams)
    setLoading(false)
    if (success) {
      message.success('保存数据成功');
      updateGlobalStatus();
      return
    }
    message.error(msg);
  }
  async function handleHoldData() {
    const saveParams = {
      recommendDemandId: id,
      tabKey: 'quotationAndGPCATab',
      supplyCostStructure,
      costAnalyses: dataSource,
      id: data.id
    };
    const formatParams = filterEmptyFileds(saveParams)
    setLoading(true)
    const { success, message: msg } = await requestPostApi(formatParams, { tempSave: true })
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
          title="报价单及成分分析表"
          extra={type === 'add' ? [
            <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={handleSave}>保存</Button>,
            <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={handleHoldData}>暂存</Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>报价单及成分分析表</div>
              <div className={styles.content}>
                <Row style={{ marginBottom: '10px' }}>
                  <span style={{ marginRight: '18px' }}>能够且愿意向长虹提供完整的成本结构:</span>
                  <Radio.Group onChange={(value) => onChange(value)} value={supplyCostStructure} disabled={type === 'detail'}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Row>
                {
                  supplyCostStructure ?
                    <EditorTable
                      dataSource={dataSource}
                      columns={columns}
                      fields={fields}
                      setDataSource={setDataSource}
                      copyLine={true}
                    /> : null
                }
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default Form.create()(QuotationAndGPCA);