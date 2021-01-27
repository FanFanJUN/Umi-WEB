/**
 * 实现功能：供应商推荐需求-评审
 * @author hezhi
 * @date 2020-09-23
 */
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Header } from '../../../components';
import {
  Button,
  Table,
  message,
  Upload,
  Modal
} from 'antd';
import { router } from 'dva';
import styles from './index.less';
import {
  queryFilterOpinion,
  filterOptionImport,
  filterOptionExport
} from '../../../services/recommend';
import Editor from './Editor';
import RecommendEditor from './RecommendEditor'
import { downloadBlobFile } from '../../../utils';

const { useLocation } = router;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development';
const SelfAssessment = forwardRef(({
  type = 'create'
}, ref) => {
  useImperativeHandle(ref, () => ({
    getAllParams: handleSave
  }))
  const editorRef = useRef(null);
  const recommendEditorRef = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [compareDataSource, setCompareDataSource] = useState([]);
  const [compareRecommendDataSource, setCompareRecommendDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const { query } = useLocation();
  const columns = [
    {
      title: '供应商名称',
      dataIndex: 'supplierName'
    },
    {
      title: '原厂',
      dataIndex: 'originName'
    },
    {
      title: '拟推荐',
      dataIndex: 'recommend',
      render(text) {
        return text ? '是' : '否'
      }
    },
    {
      title: '意见描述',
      dataIndex: 'compareSupplierOpinions',
      render(text) {
        return text.map((item, key) => <div key={`${key}-opinions`}>{`${item.scorerName}:${item.opinion ? item.opinion : ''}\n`}</div>)
      }
    },
    {
      title: '百分比',
      dataIndex: 'totalScore'
    }
  ]
  const recommendCompareColumns = [
    {
      title: '操作',
      dataIndex: 'id',
      render(_, record) {
        return <Button type='link' onClick={() => handleRecommendEditor(record)}>编辑</Button>
      },
      width: 100,
      fixed: 'left'
    },
    {
      title: '供应商代码',
      dataIndex: 'supplierCode',
      width: 100
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      width: 100
    },
    {
      title: '原厂代码',
      dataIndex: 'originCode',
      width: 100
    },
    {
      title: '原厂名称',
      dataIndex: 'originName',
      width: 100
    },
    {
      title: '业务单元代码',
      dataIndex: 'buCode',
      width: 100
    },
    {
      title: '业务单元名称',
      dataIndex: 'buName',
      width: 100
    },
    {
      title: '供应商分析',
      dataIndex: 'supplierAnalysis',
      width: 100
    },
    {
      title: '是否拟淘汰',
      dataIndex: 'weedOut',
      width: 100,
      render(text) {
        return Object.is(null, text) ? '' : text ? '是' : '否'
      }
    }
  ]
  const compareColumns = [
    {
      title: '操作',
      dataIndex: 'id',
      render(_, record) {
        return <Button type='link' onClick={() => handleEditor(record)}>编辑</Button>
      },
      width: 100,
      fixed: 'left'
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      width: 100
    },
    {
      title: '原厂',
      dataIndex: 'originName',
      width: 100
    },
    {
      title: '公司',
      dataIndex: 'corporationName',
      width: 100
    },
    {
      title: '采购组织',
      dataIndex: 'purchaseOrgName',
      width: 100
    },
    {
      title: '拟推荐',
      dataIndex: 'recommend',
      render(text) {
        return typeof text === 'boolean' ?
          !!text ? '是' : '否' : null
      },
      align: 'center',
      width: 100
    },
    {
      title: '供应商分析',
      dataIndex: 'supplierAnalysis',
      width: 150
    },
    {
      title: '是否准入推荐',
      dataIndex: 'recommendConfirm',
      render(text) {
        return typeof text === 'boolean' ?
          !!text ? '是' : '否' : null
      },
      align: 'center',
      width: 150
    },
    {
      title: '不推荐理由',
      dataIndex: 'noRecommendReason',
      width: 150
    },
    {
      title: '是否实物认定',
      dataIndex: 'objectRecognition',
      render(text) {
        return typeof text === 'boolean' ?
          !!text ? '是' : '否' : null
      },
      align: 'center',
      width: 150
    },
    {
      title: '是否信任',
      dataIndex: 'trust',
      render(text) {
        return typeof text === 'boolean' ?
          !!text ? '是' : '否' : null
      },
      align: 'center',
      width: 100
    },
    {
      title: '是否拟淘汰',
      dataIndex: 'weedOut',
      render(text) {
        return typeof text === 'boolean' ?
          !!text ? '是' : '否' : null
      },
      align: 'center',
      width: 100
    }
  ]
  const [_, ...detailColumns] = compareColumns;
  const [s, ...recommendDetailColumns] = recommendCompareColumns;
  function handleEditor(record) {
    // const trustInfos = compareDataSource
    //   .filter(item => item.id !== record.id)
    //   .filter(item => !item.objectRecognition)
    //   .filter(item => !item.trustCorporationName && !item.trustPurchaseOrgName);
    editorRef.current.show(record, compareDataSource)
  }
  function handleRecommendEditor(record) {
    recommendEditorRef.current.show(record, compareRecommendDataSource)
  }
  function editorConfirm(values) {
    const {
      id: lineId,
      recommendConfirm = null,
      noRecommendReason = null,
      objectRecognition = null,
      trust = null,
      weedOut = null
    } = values;
    const newCompareDataSource = compareDataSource.map(item => {
      if (item.id === lineId) {
        return {
          ...item,
          ...values,
          recommendConfirm,
          noRecommendReason,
          objectRecognition,
          trust,
          weedOut
        }
      }
      return item
    })
    setCompareDataSource(newCompareDataSource)
  }
  function recommendEditorConfirm(values) {
    const {
      id: lineId,
      recommendConfirm = null,
      noRecommendReason = null,
      objectRecognition = null,
      trust = null,
      weedOut = null
    } = values;
    const n = compareRecommendDataSource.map(item => {
      if (item.id === lineId) {
        return {
          ...item,
          ...values,
          recommendConfirm,
          noRecommendReason,
          objectRecognition,
          trust,
          weedOut
        }
      }
      return item
    })
    setCompareRecommendDataSource(n)
  }
  const right = DEVELOPER_ENV ? (
    <>
      <Button onClick={handleSave}>保存</Button>
    </>
  ) : null;
  async function handleImport(file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('supplierRecommendDemandId', query?.id)
    await toggleLoading(true)
    const { success, message: msg, data } = await filterOptionImport(formData);
    await toggleLoading(false)
    if (success) {
      await setCompareRecommendDataSource(data)
      // initialDataSource()
      message.success('导入成功')
      return false
    }
    message.error(msg)
    return false
  }
  function handleExport() {
    Modal.confirm({
      title: '导出筛选意见',
      content: '是否确认导出筛选意见',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const { success, data, messge: msg } = await filterOptionExport({
          supplierRecommendDemandId: query?.id
        })
        if (success) {
          downloadBlobFile(data, '合格供应商名录已有供应商.xlsx')
          message.success('导出成功')
          return
        }
        message.error(msg)
      }
    })
  }
  const recommendLeft = type === 'detail' ? null : (
    <>
      <Upload
        beforeUpload={handleImport}
        showUploadList={false}
      >
        <Button className={styles.btn}>导入</Button>
      </Upload>
      <Button
        className={styles.btn}
        onClick={handleExport}
      >导出</Button>
    </>
  )
  function handleSave() {
    const vaildateState = compareDataSource.every(item => typeof item.recommend === 'boolean' ? item.recommend ? typeof item.recommendConfirm === 'boolean' : typeof item.weedOut === 'boolean' : false);
    const validateRecommendState = compareRecommendDataSource.every(item => typeof item.weedOut === 'boolean' && !!item.supplierAnalysis)
    if (compareDataSource.length === 0) {
      message.error('打分暂未完成，请等待打分完成')
      return {
        success: false,
        message: '打分暂未完成，请等待打分完成'
      };
    }
    if (!vaildateState) {
      message.error('请在编辑界面完善意见信息')
      return {
        success: false,
        message: '请在编辑界面完善意见信息'
      }
    }
    if (!validateRecommendState) {
      message.error('合格供应商名录已有供应商存在未填写的“供应商分析”或“是否拟淘汰选项”')
      return {
        success: false,
        message: '合格供应商名录已有供应商存在未填写的“供应商分析”或“是否拟淘汰选项”'
      }
    }
    return {
      success: true,
      params: [...compareDataSource, ...compareRecommendDataSource]
    }
  }
  async function initialDataSource() {
    toggleLoading(true)
    const { data, success, message: msg } = await queryFilterOpinion({
      supplierRecommendDemandId: query.id
    })
    toggleLoading(false)
    if (success) {
      const {
        compareSuppliers,
        compareResults
      } = data;
      const rd = compareResults.filter(item => item.recommend);
      const nrd = compareResults.filter(item => !item.recommend);
      setDataSource(compareSuppliers)
      setCompareRecommendDataSource(nrd)
      setCompareDataSource(rd)
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    initialDataSource()
  }, [])
  return (
    <div>
      <div className={styles.commonTitle}>对比筛选的供应商</div>
      <Header right={right}></Header>
      <Table
        loading={loading}
        dataSource={dataSource}
        pagination={false}
        columns={columns}
        bordered
        size='small'
        rowKey={item => item.id}
      />
      <div className={styles.commonTitle}>筛选比对评价及结果</div>
      <h4>本次推荐供应商</h4>
      <Table
        loading={loading}
        dataSource={compareDataSource}
        pagination={false}
        columns={type === 'detail' ? detailColumns : compareColumns}
        bordered
        size='small'
        rowKey='id'
        scroll={{
          x: 1200
        }}
      />
      <h4 style={{ marginTop: 24 }}>合格供应商名录已有供应商</h4>
      <Header
        left={recommendLeft}
      />
      <Table
        loading={loading}
        dataSource={compareRecommendDataSource}
        pagination={false}
        columns={type === 'detail' ? recommendDetailColumns : recommendCompareColumns}
        bordered
        size='small'
        rowKey='id'
        scroll={{
          x: 1200
        }}
      />
      {
        type === 'detail' ? null :
          <Editor wrappedComponentRef={editorRef} setTableDataSource={editorConfirm} />
      }
      {
        type === 'detail' ? null :
          <RecommendEditor wrappedComponentRef={recommendEditorRef} setTableDataSource={recommendEditorConfirm} />
      }
    </div>
  )
})

export default SelfAssessment;