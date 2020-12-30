/**
 * 实现功能：供应商推荐需求-评审
 * @author hezhi
 * @date 2020-09-23
 */
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';
import {
  Table,
  Form,
} from 'antd';
import { router } from 'dva';
import { queryTeamConfirmHistoryList } from '../../../services/recommend';

const { useLocation } = router;
const SelfAssessment = forwardRef(({
  form
}, ref) => {
  const {
    validateFieldsAndScroll,
  } = form;
  useImperativeHandle(ref, () => ({
    validateFieldsAndScroll,
    getAllParams: handleSave
  }))
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const { query } = useLocation();
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
      dataIndex: 'definition'
    },
    {
      title: '评分标准',
      dataIndex: 'scoringStandard'
    },
    {
      title: '最高分',
      dataIndex: 'highestScore',
      width: 150
    },
    {
      title: '不适用',
      dataIndex: 'notApplicable',
      render(text, record) {
        return Array.isArray(record?.jurorScores) ? record?.jurorScores.map(item => <div>{`${item.scorerName}：${item.notApplicable ? '是' : '否'}`}</div>) : ''
      },
      width: 150
    },
    {
      title: '得分',
      dataIndex: 'score',
      width: 150
    },
    {
      title: '详情评分',
      dataIndex: 'jurorScores',
      render(text) {
        return (
          Array.isArray(text) ? text.map(item => Object.is(null, item.score) ? null : <div>{`${item.scorerName}：${item.score}`}</div>) : ''
        )
      },
      width: 150
    },
    {
      title: '百分比',
      dataIndex: 'percent',
      width: 150
    }
  ]
  useEffect(() => {
    async function initialDataSource() {
      toggleLoading(true)
      const { data, success, message: msg } = await queryTeamConfirmHistoryList({
        supplierRecommendDemandId: query.id
      })
      toggleLoading(false)
      if (success) {
        const { evlSystemRules } = data;
        setDataSource(evlSystemRules)
        return
      }
    }
    initialDataSource()
  }, [])
  return (
    <div>
      <Table
        loading={loading}
        dataSource={dataSource}
        pagination={false}
        columns={columns}
        bordered
        rowKey={item => item.key}
      />
    </div>
  )
})

export default Form.create()(SelfAssessment);
