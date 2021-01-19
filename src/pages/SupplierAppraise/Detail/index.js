import { useRef, useState, useEffect } from 'react';
import styles from './index.less';
import { Button, Affix, Tabs } from 'antd';
import { ExtTable, utils } from 'suid';
import { closeCurrent, sendResize, DELAY, formatYMDHmsToYMD } from '../../../utils';
import { useLocation } from 'dva/router';
import CommonForm from '../CommonForm';
import { AutoSizeLayout } from '../../../components'
import { findScoreById } from '../../../services/appraise';
import { recommendUrl } from '../../../utils/commonUrl';
const { TabPane } = Tabs;
function Detail() {
  const { query } = useLocation();
  const [tableKey, setTableKey] = useState('initialTableKey-allocation');
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const formRef = useRef(null);
  const columns = [
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
      title: '业务单元代码',
      dataIndex: 'buCode'
    },
    {
      title: '业务单元名称',
      dataIndex: 'buName'
    },
    {
      title: '物料分类',
      dataIndex: 'materialCategoryName'
    },
    {
      title: '采购专业组',
      dataIndex: 'purchaseProfessionalGroup'
    },
    {
      title: '评审人',
      dataIndex: 'scorerName',
      render(text, record) {
        if (!text) return ''
        return `${record.scorerCode}   ${text}`
      },
      width: 200
    }
  ];
  const detailProps = {
    store: {
      url: `${recommendUrl}/api/seSubEvaluationProjectService/findByPage`,
      type: 'POST',
      params: {
        filters: [
          {
            fieldName: 'seEvaluationProject.id',
            operator: 'EQ',
            value: query?.id
          }
        ]
      }
    },
    remotePaging: true,
    rowKey: (item) => item.id,
    columns: [
      {
        title: '评审状态',
        dataIndex: 'evaluationStatusRemark'
      },
      {
        title: '审核状态',
        dataIndex: 'flowStatus',
        render(text) {
          switch (text) {
            case 'INIT':
              return '未提交审核'
            case 'INPROCESS':
              return '审核中'
            case 'COMPLETED':
              return '审核完成'
            default:
              return ''
          }
        },
      },
      {
        title: '评审单号',
        dataIndex: 'docNumber',
        width: 200
      },
      {
        title: '评审项目名称',
        dataIndex: 'seEvaluationProject.projectName'
      },
      {
        title: '评审体系',
        dataIndex: 'seEvaluationProject.mainDataEvlSystemName'
      },
      {
        title: '要求完成时间',
        dataIndex: 'seEvaluationProject.askCompleteTime',
        render(text) {
          return formatYMDHmsToYMD(text)
        }
      },
      {
        title: '组织部门',
        dataIndex: 'seEvaluationProject.orgName'
      },
      {
        title: '评审期间类型',
        dataIndex: 'seEvaluationProject.evlPeriodTypeEnumRemark'
      },
      {
        title: '评审期间',
        dataIndex: 'rangeTime',
        render(text, record) {
          const st = formatYMDHmsToYMD(record.seEvaluationProject.evlPeriodStartTime);
          const et = formatYMDHmsToYMD(record.seEvaluationProject.evlPeriodEndTime);
          return `${st}~${et}`
        },
        width: 200
      },
      {
        title: '评审人',
        dataIndex: 'scorerName'
      },
    ]
  }
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
      await DELAY(1000)
      await sendResize()
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
        onChange={sendResize}
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
                  dataSource={dataSource}
                  height={h - 72}
                  columns={columns}
                  loading={loading}
                />
            }
          </AutoSizeLayout>
        </TabPane>
        <TabPane
          tab='人工评审详情'
          key='maual-evaluate-detail'
          forceRender
        >
          <AutoSizeLayout>
            {
              h =>
                <ExtTable
                  {...detailProps}
                  height={h - 72}
                  showSearch={false}
                />
            }
          </AutoSizeLayout>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Detail