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
  Select,
  Modal
} from 'antd';
import { router } from 'dva';
import { utils } from 'suid';
import styles from './index.less';
import { querySelfAssessment, saveSelfAssessment, exportProject, importProject } from '../../../../services/recommend';
import { downloadBlobFile } from '../../../../utils';

const { useLocation } = router;
const { Item } = Form
const { Option } = Select;
const { getUUID } = utils;

function SelfAssessment({
  form,
  updateGlobalStatus = () => null,
  type = 'create'
}) {
  const [dataSource, setDataSource] = useState([]);
  const [tableUUID, setTableUUID] = useState('initial-uuid-table')
  const [loading, toggleLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { query } = useLocation();
  const {
    validateFieldsAndScroll,
    getFieldDecorator,
    resetFields,
    getFieldValue
  } = form;
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
      width: 120
    },
    {
      title: '不适用',
      dataIndex: 'notApplicable',
      width: 120,
      render(text, record) {
        if (type === 'detail') {
          return Object.is(null, text) ? '' : !!text ? '是' : '否'
        }
        if (!!record.ruleId) {
          return <Item style={{ marginBottom: 0 }}>
            {
              getFieldDecorator(`notApplicable_${record.ruleId}`, {
                rules: [
                  {
                    required: true,
                    message: '请选择是否适用'
                  }
                ],
                initialValue: text,
              })(
                <Select style={{ width: 80 }}>
                  <Option value={true} label='是'>是</Option>
                  <Option value={false} label='否'>否</Option>
                </Select>
              )
            }
          </Item>
        }
      }
    },
    {
      title: '得分',
      dataIndex: 'score',
      render(text, record) {
        if (type === 'detail') {
          return text
        }
        if (!!record.ruleId) {
          const nab = getFieldValue(`notApplicable_${record.ruleId}`)
          return <Item style={{ marginBottom: 0 }}>
            {
              getFieldDecorator(`${record.ruleId}`, {
                rules: [
                  {
                    required: !nab,
                    message: '请打分'
                  }
                ],
                initialValue: record.score,
              })(
                <InputNumber
                  max={record.highestScore}
                  min={0}
                  disabled={nab}
                />
              )
            }
          </Item>
        }
        return text
      }
    },
    {
      title: '百分比',
      dataIndex: 'percent',
      show: type === 'detail',
      width: 150,
    }
  ].map(item => ({ show: true, ...item }))
    .filter(item => item?.show)
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
    const ntReg = /^notApplicable_/;
    const ids = Object.keys(values);
    const sKeys = ids.filter(item => ntReg.test(item));
    const sV = sKeys.map(item => values[item]);
    const scoresKeys = ids.filter(item => !ntReg.test(item));
    const scores = scoresKeys.map((item, index) => ({
      ruleId: item,
      score: values[item],
      notApplicable: sV[index],
      editStatus: true
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
  function findNode(value, tree) {
    if (!value) return
    return tree.map(treeNode => {
      //如果有子节点
      if (treeNode.children.length > 0) {
        //如果标题匹配
        if (treeNode.name.indexOf(value) > -1 || treeNode.code.indexOf(value) > -1) {
          return treeNode
        } else {//如果标题不匹配，则查看子节点是否有匹配标题
          treeNode.children = findNode(value, treeNode.children);
          if (treeNode.children.length > 0) {
            return treeNode
          }
        }
      } else {//没子节点
        if (treeNode.name.indexOf(value) > -1 || treeNode.code.indexOf(value) > -1) {
          return treeNode
        }
      }
      return null;
    }).filter((treeNode) => treeNode)
  }
  async function handleImport(file) {
    await resetFields()
    const formData = new FormData();
    formData.append('file', file);
    formData.append('supplierRecommendDemandId', query.id)
    toggleLoading(true)
    const { data, success, message: msg } = await importProject(formData)
    toggleLoading(false)
    // const errors = data.filter(item => !!item.msg);
    if (success) {
      const uuid = getUUID();
      await setTableUUID(uuid)
      await setDataSource(data)
      message.success('导入成功')
      return false
    }
    Modal.error({
      title: '导入错误',
      content: msg
    })
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
    <div key={tableUUID}>
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