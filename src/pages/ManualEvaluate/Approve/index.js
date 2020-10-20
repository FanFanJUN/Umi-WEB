/**
 * 实现功能： 供应商评价项目-人工评价
 * @author hezhi
 * @date 2020-10-15
 */
import { useRef, useState, useEffect } from 'react';
import styles from './index.less';
import { Tabs, Spin, message } from 'antd';
import { useLocation } from 'dva/router';
import { AutoSizeLayout } from '../../../components';
import { sendResize, checkToken } from '../../../utils';
import { ExtTable, WorkFlow } from 'suid';
import CommonForm from '../../SupplierAppraise/CommonForm';
import { useTableProps } from '../../../utils/hooks';
import { queryEvaluateApproveBaseDate, queryEvaluateData } from '../../../services/evaluate';
const { TabPane } = Tabs;
const { Approve } = WorkFlow;
function Evaluate() {
  const formRef = useRef(null);
  const { query } = useLocation();
  const [isReady, setIsReady] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [tableState, sets] = useTableProps()
  const {
    dataSource
  } = tableState;
  const {
    setDataSource
  } = sets;
  const columns = [
    {
      title: '供应商代码',
      dataIndex: 'supplierCode'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      width: 200
    },
    {
      title: '公司代码',
      dataIndex: 'corporationCode'
    },
    {
      title: '公司名称',
      dataIndex: 'corporationName',
      width: 200
    },
    {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode'
    },
    {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName',
      width: 200
    },
    {
      title: '物料分类代码',
      dataIndex: 'materialCategoryCode'
    },
    {
      title: '物料分类名称',
      dataIndex: 'materialCategoryName',
      width: 250
    },
    {
      title: '原厂代码',
      dataIndex: 'originCode'
    },
    {
      title: '原厂名称',
      dataIndex: 'originName'
    },
    {
      title: '指标名称',
      dataIndex: 'samSupplierEvlSysRule.ruleName',
      width: 250
    },
    {
      title: '指标定义',
      dataIndex: 'samSupplierEvlSysRule.definition',
      width: 250
    },
    {
      title: '评价标准',
      dataIndex: 'samSupplierEvlSysRule.scoringStandard',
      width: 250
    },
    {
      title: '标准分',
      dataIndex: 'samSupplierEvlSysRule.highestScore'
    },
    {
      title: '评分人',
      dataIndex: 'scorerName'
    },
    {
      title: '分值',
      dataIndex: 'score'
    }
  ];

  async function initialTableDatasource() {
    toggleLoading(true)
    const { success, data, message: msg } = await queryEvaluateApproveBaseDate({
      subEvaluationProjectId: query?.id
    })
    toggleLoading(false)
    if (success) {
      formRef.current.setAllValues(data)
    }else {
      message.error(msg)
    }
    const { success: suc, data: ds, message: mes } = await queryEvaluateData({
      subEvaluationProjectId: query?.id
    })
    if(suc) {
      setDataSource(ds)
      return
    }
    message.error(mes)
  }
  useEffect(() => {
    checkToken(query, setIsReady)
  }, [])
  useEffect(() => {
    if (isReady) {
      initialTableDatasource()
    }
  }, [isReady])
  return (
    <Approve>
      <Tabs
        animated={false}
        onChange={sendResize}
      >
        <TabPane tab='基本信息' key='base'>
          <Spin spinning={loading}>
            <CommonForm wrappedComponentRef={formRef} type='detail' initialize={false}/>
          </Spin>
        </TabPane>
        <TabPane tab='评价指标' key='target' forceRender={true}>
          <Spin spinning={loading}>
            <div className={styles.commonTitle}>评价指标</div>
            <AutoSizeLayout>
              {
                h => (
                  <ExtTable
                    size='small'
                    showSearch={false}
                    dataSource={dataSource}
                    columns={columns}
                    height={h}
                    rowKey={item => item.id}
                  />
                )
              }
            </AutoSizeLayout>
          </Spin>
        </TabPane>
      </Tabs>
    </Approve>
  )
}
export default Evaluate;