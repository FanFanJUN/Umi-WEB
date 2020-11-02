import { useRef, useState, useEffect } from 'react';
import styles from './index.less';
import { Button, Affix, Tabs } from 'antd';
import { ExtTable, utils } from 'suid';
import { closeCurrent, sendResize } from '../../../utils';
import { useLocation } from 'dva/router';
import CommonForm from '../CommonForm';
import { AutoSizeLayout } from '../../../components'
import { findScoreById } from '../../../services/appraise';
const { TabPane } = Tabs;
function Detail() {
  const { query } = useLocation();
  const [tableKey, setTableKey] = useState('initialTableKey-allocation');
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const formRef = useRef(null);
  const columns = [
    {
      title: '类别',
      dataIndex: 'systemName',
      width: 200
    },
    {
      title: '指标名称',
      dataIndex: 'ruleName',
      width: 250
    },
    {
      title: '指标定义',
      dataIndex: 'definition',
      width: 250
    },
    {
      title: '公司代码',
      dataIndex: 'corporationCode'
    },
    {
      title: '公司名称',
      dataIndex: 'corporationName',
      width: 250
    },
    {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode'
    },
    {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName',
      width: 250
    },
    {
      title: '评审人',
      dataIndex: 'scorerName',
      render(text, record) {
        if (!text) return ''
        return `${record.scorerCode}   ${text}`
      }
    }
  ]
  function renderTabBar(props, DefaultTabBar) {
    return (
      <Affix offsetTop={62}>
        <DefaultTabBar {...props} style={{ background: '#fff' }} />
      </Affix>
    )
  }
  async function initialDataSource() {
    toggleLoading(true)
    const { success, data, message: msg } = await findScoreById({
      evaluationProjectId: query?.id
    })
    toggleLoading(false)
    if (success) {
      await setDataSource(data);
      const uuid = utils.getUUID();
      await setTableKey(uuid)
      sendResize()
      return
    }
  }
  useEffect(() => {
    initialDataSource()
  }, [])
  return (
    <div>
      <Affix>
        <div className={styles.affixHeader}>
          <div className={styles.fbc}>
            <span className={styles.title}>评价项目详情</span>
            <div className={styles.fec}>
              <Button className={styles.btn} onClick={closeCurrent}>返回</Button>
            </div>
          </div>
        </div>
      </Affix>
      <Tabs
        renderTabBar={renderTabBar}
        animated={false}
      >
        <TabPane tab='基本信息' key='base-info'>
          <CommonForm wrappedComponentRef={formRef} type='detail' />
        </TabPane>
        <TabPane tab='人工评价评审人' key='maual-evaluate' forceRender>
          <AutoSizeLayout>
            {
              h =>
                <ExtTable
                  key={tableKey}
                  showSearch={false}
                  rowKey={(item) => item?.key}
                  defaultExpandAllRows={true}
                  dataSource={dataSource}
                  height={h}
                  pagination={false}
                  columns={columns}
                  loading={loading}
                />
            }
          </AutoSizeLayout>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Detail