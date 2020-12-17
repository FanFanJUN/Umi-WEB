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
import { queryReviewMarkData } from '../../../services/recommend';

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
      title: '指标名称',
      dataIndex: 'samSupplierEvlSysRule.ruleName'
    },
    {
      title: '指标定义',
      dataIndex: 'samSupplierEvlSysRule.definition'
    },
    {
      title: '评分标准',
      dataIndex: 'samSupplierEvlSysRule.scoringStandard'
    },
    {
      title: '最高分',
      dataIndex: 'samSupplierEvlSysRule.highestScore'
    },
    {
      title: '得分',
      dataIndex: 'score'
    }
  ]
  useEffect(() => {
    async function initialDataSource() {
      toggleLoading(true)
      const { data, success, message: msg } = await queryReviewMarkData({
        supplierRecommendDemandId: query.id
      })
      toggleLoading(false)
      if (success) {
        const { jurorScores } = data;
        setDataSource(jurorScores)
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
        rowKey={item => item.id}
      />
    </div>
  )
})

export default Form.create()(SelfAssessment);
