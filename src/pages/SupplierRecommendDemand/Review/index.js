/**
 * 实现功能：供应商推荐需求-评审
 * @author hezhi
 * @date 2020-09-23
 */
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Header } from '../../../components';
import {
  Button,
  Table,
  message,
  InputNumber,
  Form,
  Upload,
  Modal,
  Input,
  Select
} from 'antd';
import { router } from 'dva';
import styles from './index.less';
import { importRevieMarkData, queryReviewMarkData, exportRevieMarkData } from '../../../services/recommend';
import { downloadBlobFile } from '../../../utils';

const { useLocation } = router;
const { Item } = Form
const { Option } = Select;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development')
const SelfAssessment = forwardRef(({
  form,
  updateGlobalStatus = () => null,
  type = 'create'
}, ref) => {
  const {
    validateFieldsAndScroll,
    getFieldDecorator,
    setFieldsValue,
    getFieldValue,
    resetFields
  } = form;
  useImperativeHandle(ref, () => ({
    validateFieldsAndScroll,
    getAllParams: handleSave
  }))
  const [dataSource, setDataSource] = useState([]);
  const [compareDataSource, setCompareDataSource] = useState([]);
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
      dataIndex: 'samSupplierEvlSysRule.highestScore',
      width: 150
    },
    {
      title: '不适用',
      dataIndex: 'notApplicable',
      width: 120,
      render(text, record) {
        if (type === 'detail') {
          return Object.is(null, text) ? '' : !!text ? '是' : '否'
        }
        if (!!record.id) {
          return <Item style={{ marginBottom: 0 }}>
            {
              getFieldDecorator(`notApplicable_${record.id}`, {
                rules: [
                  {
                    required: true,
                    message: '请选择是否适用'
                  }
                ],
                initialValue: text,
              })(
                <Select
                  style={{ width: 80 }}
                  onSelect={(v) => {
                    if(v) {
                      setFieldsValue({
                        [`score_${record.id}`] : null
                      })
                    }
                  }}
                >
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
        const nab = getFieldValue(`notApplicable_${record.id}`)
        return <Item style={{ marginBottom: 0 }}>
          {
            getFieldDecorator(`score_${record.id}`, {
              rules: [
                {
                  required: !nab,
                  message: '请打分'
                }
              ],
              initialValue: text,
            })(
              <InputNumber
                max={record.samSupplierEvlSysRule?.highestScore}
                min={0}
                disabled={nab}
              />
            )
          }
        </Item>
      }
    }
  ]
  const compareColumns = [
    {
      title: '物料分类',
      dataIndex: 'compareSupplier.materialCategoryName'
    },
    {
      title: '供应商',
      dataIndex: 'compareSupplier.supplierName'
    },
    {
      title: '原厂',
      dataIndex: 'compareSupplier.originName'
    },
    {
      title: '拟推荐',
      dataIndex: 'compareSupplier.recommend',
      render(text) {
        return text ? '是' : '否'
      }
    },
    {
      title: '意见描述',
      dataIndex: 'opinion',
      width: 250,
      render(text, record) {
        if (type === 'detail') {
          return text
        }
        return <Item style={{ marginBottom: 0 }}>
          {
            getFieldDecorator(`opinion_${record.id}`, {
              initialValue: text
            })(<Input />)
          }
        </Item>
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
        <Button className={styles.btn}>导入打分结果</Button>
      </Upload>
    </>
  );
  const right = DEVELOPER_ENV ? (
    <>
      <Button onClick={handleSave}>保存</Button>
    </>
  ) : null
  async function handleSave() {
    const values = await validateFieldsAndScroll();
    const ids = Object.keys(values);
    const nabs = ids.filter(item => /^notApplicable_/.test(item)).map(item => values[item]);
    const scores = ids.filter(item => /^score/.test(item)).map((item, index) => {
      const [_, id] = item.split('_')
      return ({
        id,
        score: values[item],
        notApplicable: nabs[index]
      })
    })
    const opinions = ids.filter(item => /^opinion/.test(item)).map(item => {
      const [_, id] = item.split('_')
      return ({
        id,
        opinion: values[item]
      })
    })
    const params = {
      compareSupplierOpinions: opinions,
      jurorScores: scores
    }
    // const { success, message: msg } = await saveReviewMarkData(params)
    return params
  }
  function handleExport() {
    Modal.confirm({
      title: '导出当前打分项',
      content: '是否导出当前所有打分项',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const { data, success, message: msg } = await exportRevieMarkData({
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
  function importBeforeSetFormValue(values = []) {
    if (!Array.isArray(values)) {
      return
    }
    const fields = values.reduce((prev, cur) => {
      return {
        ...prev,
        [`score_${cur.id}`]: cur.score
      }
    }, {})
    setFieldsValue(fields)
  }
  async function handleImport(file) {
    await resetFields()
    const formData = new FormData();
    formData.append('file', file);
    formData.append('supplierRecommendDemandId', query.id)
    const { data } = await importRevieMarkData(formData)
    const errors = data.filter(item => !!item.msg);
    if (errors.length !== 0) {
      Modal.error({
        title: '导入错误',
        content: errors.map(item => `${item.name}-${item.msg}`)
      })
      return false
    }
    importBeforeSetFormValue(data)
    message.success('导入成功')
    return false
  }
  useEffect(() => {
    async function initialDataSource() {
      toggleLoading(true)
      const { data, success, message: msg } = await queryReviewMarkData({
        supplierRecommendDemandId: query.id,
        editStatus: type === 'detail' ? null : true
      })
      toggleLoading(false)
      if (success) {
        const { compareSupplierOpinions, jurorScores } = data;
        setDataSource(jurorScores)
        setCompareDataSource(compareSupplierOpinions)
        return
      }
    }
    initialDataSource()
  }, [])
  return (
    <div>
      <div className={styles.commonTitle}>打分</div>
      {
        type === 'detail' ? null : <Header
          left={left}
          right={right}
        />
      }
      <Table
        loading={loading}
        dataSource={dataSource}
        pagination={false}
        columns={columns}
        bordered
        rowKey={item => item.id}
      />
      <div className={styles.commonTitle}>意见</div>
      <Table
        loading={loading}
        dataSource={compareDataSource}
        pagination={false}
        columns={compareColumns}
        bordered
        rowKey={item => item.id}
      />
    </div>
  )
})

export default Form.create()(SelfAssessment);
