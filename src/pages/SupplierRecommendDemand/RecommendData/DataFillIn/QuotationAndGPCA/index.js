/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:07
 * @LastEditTime: 2020-09-21 10:35:59
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/QuotationAndGPCA/index.js
 * @Description: 报价单及成分分析表 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, Radio, Row, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditTable from '../CommonUtil/EditTable';
import { router } from 'dva';
import { requestPostApi, requestGetApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';

const QuotationAndGPCA = ({ updateGlobalStatus }) => {

  const [data, setData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supplyCostStructure, setSupplyCostStructure] = useState(true);

  const { query: { id, type = 'add' } } = router.useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'quotationAndGPCATab' });
      if (res.success) {
        res.data && setData(res.data);
      } else {
        message.error(res.message);
      }
      setLoading(false);
    };
    if (type !== 'add') {
      fetchData();
    }
  }, []);

  const columns = [
    {
      "title": "产品名称",
      "dataIndex": "productName",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "型号/规格",
      "dataIndex": "model",
      "ellipsis": true,
      "editable": true,
    },
    {
      "title": "原材料成本",
      "dataIndex": "rawMaterialCost",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "包装材料成本",
      "dataIndex": "packageMaterialCost",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "设备用成本",
      "dataIndex": "requirementCost",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "厂房使用成本",
      "dataIndex": "plantUtilizationCost",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "工厂人工费用",
      "dataIndex": "laborCost",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "管理费用",
      "dataIndex": "manageCost",
      "ellipsis": true,
      "editable": true,
      "inputType": 'InputNumber',
    },
    {
      "title": "运费",
      "dataIndex": "transportCost",
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
  ];

  function onChange(value) {
    setSupplyCostStructure(value);
  }

  function handleSave() {
    const saveParams = {
      recommendDemandId: id,
      key: 'quotationAndGPCATab',
      supplyCostStructure
    };
    requestPostApi(filterEmptyFileds(saveParams)).then((res) => {
      if (res && res.success) {
        message.success('保存数据成功');
        updateGlobalStatus();
      } else {
        message.error(res.message);
      }
    });
  }

  function setNewData(newData) {
    setDataSource(newData);
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
            <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={handleSave}>
              保存
                        </Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>报价单及成分分析表</div>
              <div className={styles.content}>
                <Row style={{ marginBottom: '10px' }}>
                  <span style={{ marginRight: '18px' }}>能够且愿意向长虹提供完整的成本结构:</span>
                  <Radio.Group onChange={(value) => onChange(value)} value={type === 'add' ? supplyCostStructure : data.supplyCostStructure}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Row>
                <EditTable
                  dataSource={dataSource}
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

export default Form.create()(QuotationAndGPCA);