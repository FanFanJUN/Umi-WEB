import { useState, useEffect } from 'react';
import { Header } from '../../../../components';
import {
  Button,
  Table,
  PageHeader,
  message,
  InputNumber,
  Form
} from 'antd';
import { router } from 'dva';
import styles from './index.less';
import { querySelfAssessment, saveSelfAssessment } from '../../../../services/recommend';

const { useLocation } = router;
const { Item } = Form

function SelfAssessment({
  form,
  updateGlobalStatus
}) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { query } = useLocation();
  const { validateFieldsAndScroll, getFieldDecorator } = form;
  const columns = [
    {
      title: '类别',
      dataIndex: 'systemName'
    },
    {
      title: '指标名称',
      dataIndex: 'ruleName'
    },
    {
      title: '指标定义',
      dataIndex: ''
    },
    {
      title: '评分标准',
      dataIndex: 'scoringStandard'
    },
    {
      title: '最高分',
      dataIndex: 'highestScore'
    },
    {
      title: '得分',
      dataIndex: 'score',
      render(text, record) {
        if (!!record.ruleId) {
          return <Item style={{ marginBottom: 0 }}>
            {
              getFieldDecorator(`${record.ruleId}`, {
                rules: [
                  {
                    required: true,
                    message: '请打分'
                  }
                ],
                initialValue: record.score
              })(<InputNumber max={record.highestScore} />)
            }
          </Item>
        }
        return text
      }
    }
  ]
  const left = (
    <>
      <Button className={styles.btn}>导出打分项</Button>
      <Button className={styles.btn}>导入打分项</Button>
    </>
  );
  async function handleSave() {
    const values = await validateFieldsAndScroll();
    const ids = Object.keys(values);
    const scores = ids.map(item => ({
      ruleId: item,
      score: values[item]
    }))
    setConfirmLoading(true)
    const { success, message: msg } = await saveSelfAssessment(scores);
    setConfirmLoading(false)
    if (success) {
      message.success(msg)
      updateGlobalStatus()
      return
    }
    message.error(msg)
  }
  function getDataSourceKeys(d, ks = []) {
    let kes = ks;
    d.forEach(item => {
      kes.push(item.key)
      if (!!item.children) {
        return getDataSourceKeys(item.children, kes)
      }
    })
    return kes
  }
  const headerExtra = [
    <Button key='header-save' type='primary' onClick={handleSave} loading={confirmLoading}>保存</Button>
  ];
  useEffect(() => {
    async function initialDataSource() {
      toggleLoading(true)
      const { data, success, message: msg } = await querySelfAssessment({
        supplierRecommendDemandId: query.id
      })
      toggleLoading(false)
      if (success) {
        const ks = getDataSourceKeys(data)
        setDataSource(data)
        setExpandedRowKeys(ks)
        return
      }
      message.error(msg)
    }
    initialDataSource()
  }, [])
  return (
    <div>
      <PageHeader
        ghost={false}
        title='自我评价'
        extra={headerExtra}
      />
      <Header
        left={left}
      />
      <Table
        loading={loading}
        dataSource={dataSource}
        pagination={false}
        columns={columns}
        bordered
        expandedRowKeys={expandedRowKeys}
        rowKey={item => item.key}
      />
    </div>
  )
}
export default Form.create()(SelfAssessment);