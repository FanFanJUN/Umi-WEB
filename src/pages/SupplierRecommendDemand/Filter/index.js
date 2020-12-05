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
} from 'antd';
import { router } from 'dva';
import styles from './index.less';
import { queryFilterOpinion } from '../../../services/recommend';
import Editor from './Editor';

const { useLocation } = router;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development';
const SelfAssessment = forwardRef(({
  type = 'create'
}, ref) => {
  useImperativeHandle(ref, () => ({
    getAllParams: handleSave
  }))
  const editorRef = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [compareDataSource, setCompareDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const { query } = useLocation();
  const columns = [
    {
      title: '供应商名称',
      dataIndex: 'supplierName'
    },
    {
      title: '原厂',
      dataIndex: 'originFactoryName'
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
        return text.map((item, key) => <div key={`${key}-opinions`}>{item}</div>)
      }
    }
  ]
  const compareColumns = [
    {
      title: '',
      dataIndex: 'id',
      render(_, record) {
        return <Button type='link' onClick={() => handleEditor(record)}>编辑</Button>
      },
      width: 100
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      width: 100
    },
    {
      title: '原厂',
      dataIndex: 'originFactoryName',
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
        return text ? '是' : '否'
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
        return text ? '是' : '否'
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
        return text ? '是' : '否'
      },
      align: 'center',
      width: 150
    },
    {
      title: '信任公司',
      dataIndex: 'trustCorporationName',
      width: 100
    },
    {
      title: '信任采购组织',
      dataIndex: 'trustPurchaseOrgName',
      width: 150
    },
    {
      title: '是否拟淘汰',
      dataIndex: 'weedOut',
      render(text) {
        return text ? '是' : '否'
      },
      align: 'center',
      width: 100
    }
  ]
  const [_, ...detailColumns] = compareColumns
  function handleEditor(record) {
    const trustInfos = compareDataSource
      .filter(item => item.id !== record.id)
      .filter(item => !item.objectRecognition)
      .filter(item => !item.trustCorporationName && !item.trustPurchaseOrgName);
    editorRef.current.show(record, trustInfos)
  }
  function editorConfirm(values) {
    const { id: lineId } = values;
    const newCompareDataSource = compareDataSource.map(item => {
      if (item.id === lineId) {
        return {
          ...item,
          ...values
        }
      }
      return item
    })
    setCompareDataSource(newCompareDataSource)
  }
  const right = DEVELOPER_ENV ? (
    <>
      <Button onClick={handleSave}>保存</Button>
    </>
  ) : null
  function handleSave() {
    const vaildateState = compareDataSource.every(item => !!item.supplierAnalysis);
    if (!vaildateState) {
      message.error('请在编辑界面完善供应商分析')
      return false
    }
    return compareDataSource
  }
  useEffect(() => {
    async function initialDataSource() {
      toggleLoading(true)
      const { data, success, message: msg } = await queryFilterOpinion({
        supplierRecommendDemandId: query.id
      })
      toggleLoading(false)
      if (success) {
        const { compareSuppliers, compareResults } = data;
        setDataSource(compareSuppliers)
        setCompareDataSource(compareResults)
        return
      }
    }
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
      <div className={styles.commonTitle}>意见</div>
      <Table
        loading={loading}
        dataSource={compareDataSource}
        pagination={false}
        columns={type === 'detail' ? detailColumns : compareColumns}
        bordered
        size='small'
        rowKey={'id'}
        scroll={{
          x: 1200
        }}
      />
      {
        type === 'detail' ? null :
          <Editor wrappedComponentRef={editorRef} setTableDataSource={editorConfirm} />
      }
    </div>
  )
})

export default SelfAssessment;
