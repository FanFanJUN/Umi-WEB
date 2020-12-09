import { useState, useEffect } from 'react';
import {
  Button,
  Table,
  message,
  Form,
  Modal
} from 'antd';
import { Header, UserModal } from '../../../components';
import { router } from 'dva';
import { ComboTree } from 'suid';
import { queryTeamConfirm, saveTeamConfrim, queryTeamConfirmHistoryList } from '../../../services/recommend';
import { commonProps } from '../../../utils'
const { evaluateSystemFormCodeProps } = commonProps;
const evaluateSystemProps = {
  ...evaluateSystemFormCodeProps,
  store: {
    ...evaluateSystemFormCodeProps.store,
    url: `${evaluateSystemFormCodeProps.store.url}?systemUseType=SupplierRegister`
  }
}
const { useLocation } = router;
const { Item } = Form
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  }
}

function TeamConfirm({
  form,
}) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  // 选中的评分项
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  // 选中的评审人
  const [systemOp, setSystemOp] = useState({});
  const { query } = useLocation();
  const empty = selectedRowKeys.length === 0;
  const tableProps = {
    columns: [
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
        title: '评审人',
        dataIndex: 'jurorScores',
        render(text) {
          if (Array.isArray(text)) {
            return text.map(item => item.scorerName).join('，')
          }
          return ''
        }
      }
    ],
    loading: loading,
    dataSource: dataSource,
    bordered: true,
    size: 'small',
    pagination: false,
    expandedRowKeys: expandedRowKeys,
    rowKey: item => item.key,
    onRow: record => {
      return {
        onClick: () => {
          setRows([record])
          setRowKeys([record.key])
        }
      }
    },
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys
    },
  }
  const left = (
    <Form>
      <Item label='评价体系' {...formLayout} required>
        {
          form.getFieldDecorator('systemName')(
            <ComboTree
              {...evaluateSystemProps}
              style={{
                width: 300
              }}
              form={form}
              afterSelect={handleTreeSelect}
              name='systemName'
            />
          )
        }
      </Item>
    </Form>
  );
  async function handleTreeSelect(item) {
    cleanSelectedKeys()
    setSystemOp(item)
    const { id: supplierEvlSystemId } = item;
    toggleLoading(true)
    const { success, message: msg, data } = await queryTeamConfirm({
      supplierEvlSystemId,
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
  async function uploadTableDataSource() {
    toggleLoading(true)
    const { success, message: msg, data } = await queryTeamConfirmHistoryList({
      supplierRecommendDemandId: query.id
    })
    toggleLoading(false)
    if (success) {
      console.log(data)
      const { evlSystemRules, supplierEvlSystem } = data
      const ks = getDataSourceKeys(evlSystemRules)
      form.setFieldsValue({ systemName: supplierEvlSystem?.name })
      setDataSource(evlSystemRules)
      setExpandedRowKeys(ks)
      return
    }
  }
  function cleanSelectedKeys() {
    setRowKeys([])
    setRows([])
  }
  function getDataSourceKeys(d, ks = []) {
    const isValid = Array.isArray(d)
    if(!isValid){
      return []
    }
    let kes = ks;
    d.forEach(item => {
      kes.push(item.key)
      if (!!item.children) {
        return getDataSourceKeys(item.children, kes)
      }
    })
    return kes
  }
  async function handleReviewPersonConfirm(items = []) {
    if (items.length === 0) {
      message.error('至少选择 1 个评审人')
      return
    }
    const [pms] = selectedRows;
    const params = {
      ...pms,
      userIds: items.map(item => item.id)
    }
    toggleLoading(true)
    const { success, message: msg } = await saveTeamConfrim(params)
    toggleLoading(false)
    if (success) {
      message.success(msg)
      uploadTableDataSource()
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    uploadTableDataSource()
  }, [])
  return (
    <div>
      <Header
        left={left}
      />
      <Table
        {...tableProps}
        title={() => <UserModal disabled={empty} onOk={handleReviewPersonConfirm}>分配评审人</UserModal>} />
    </div>
  )
}
export default Form.create()(TeamConfirm);