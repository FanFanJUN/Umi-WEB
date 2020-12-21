import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  Table,
  message,
  Form,
  Tag
} from 'antd';
import { Header, UserModal } from '../../../components';
import { router } from 'dva';
import { ComboTree, ComboList } from 'suid';
import {
  queryTeamConfirm,
  saveTeamConfrim,
  deleteTeamConfrim,
  queryTeamConfirmHistoryList
} from '../../../services/recommend';
import { commonProps } from '../../../utils'
import Modal from 'antd/es/modal';
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
}, ref) {
  useImperativeHandle(ref, () => ({
    checkSystemOp
  }))
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
  function checkSystemOp() {
    const rls = getRuleData(dataSource);
    return rls.every(item => item.jurorScores?.length > 0)
  }
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
            return text.map(item => (
              <Tag
                closable
                onClose={(event) => handleDeleteJurorScores(event, item)}
              >{item.scorerName}</Tag>
            ))
          }
          return ''
        },
        width: 240
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
            <ComboList
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
  function handleDeleteJurorScores(event, item) {
    event.preventDefault()
    Modal.confirm({
      title: '删除评审人',
      content: '是否确认删除该评选人？',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await deleteTeamConfrim({
          ruleJurorId: item?.id
        })
        if (success) {
          message.success(msg)
          uploadTableDataSource()
          return
        }
        message.error(msg)
      }
    })
  }
  async function uploadTableDataSource() {
    toggleLoading(true)
    const { success, message: msg, data } = await queryTeamConfirmHistoryList({
      supplierRecommendDemandId: query.id
    })
    toggleLoading(false)
    if (success) {
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
    if (!isValid) {
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
  function getRuleData(d, rules = []) {
    const isValid = Array.isArray(d)
    if (!isValid) {
      return []
    }
    let rs = rules;
    d.forEach(item => {
      if (!!item?.ruleName) {
        rules.push(item)
      }
      if (!!item.children) {
        return getRuleData(item.children, rs)
      }
    })
    return rs
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

const ForwardRef = forwardRef(TeamConfirm)

export default Form.create()(ForwardRef);