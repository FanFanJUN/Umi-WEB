import { useState, useEffect } from 'react';
import { Header } from '../../../../components';
import {
  Button,
  Table,
  PageHeader,
  message,
  InputNumber,
  Form,
  Upload,
  Modal
} from 'antd';
import { router } from 'dva';
import styles from './index.less';
import { querySelfAssessment, saveSelfAssessment, exportProject, importProject } from '../../../../services/recommend';
import { downloadBlobFile } from '../../../../utils';

const { useLocation } = router;
const { Item } = Form

function SelfAssessment({
  form,
  updateGlobalStatus = () => null,
  type = 'create'
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
      dataIndex: 'definition'
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
        if (type === 'detail') {
          return text
        }
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
                initialValue: record.score,
              })(<InputNumber max={record.highestScore} min={0}/>)
            }
          </Item>
        }
        return text
      }
    }
  ]
  const left = (
    <>
      <Button onClick={handleExport} className={styles.btn}>导出打分项</Button>
      <Upload
        beforeUpload={handleImport}
        showUploadList={false}
      >
        <Button className={styles.btn}>导入打分项</Button>
      </Upload>
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
  const headerExtra = type === 'detail' ? [] : [
    <Button key='header-save' type='primary' onClick={handleSave} loading={confirmLoading}>保存</Button>
  ];
  function handleExport() {
    Modal.confirm({
      title: '导出当前打分项',
      content: '是否导出当前所有打分项',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const { data, success, message: msg } = await exportProject({
          supplierRecommendDemandId: query.id
        })
        downloadBlobFile(data, '评分导入模板.xls')
        if (success) {
          message.success('导出成功')
          return
        }
        message.error(msg)
      }
    })
  }
  function findTreeNodeAndSetValue(v = [], t = []) {
    t.forEach(system => {
      if (!!system.ruleId) {
        const index = v.findIndex(vv => vv.code === system.ruleCode)
        if (index !== -1) {
          form.setFieldsValue({
            [system.ruleId]: v[index].score
          })
        }
      } else {
        if (!!system.children) {
          findTreeNodeAndSetValue(v, system.children);
        }
      }
    })
  }
  async function handleImport(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('supplierRecommendDemandId', query.id)
    const { data } = await importProject(formData)
    const errors = data.filter(item => !!item.msg);
    if (errors.length !== 0) {
      Modal.error({
        title: '导入错误',
        content: errors.map(item => `${item.name}-${item.msg}`)
      })
      return false
    }
    findTreeNodeAndSetValue(data, dataSource)
    message.success('导入成功')
    return false
  }
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
      {
        type === 'detail' ? null : <Header
          left={left}
        />
      }
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