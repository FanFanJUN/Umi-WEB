import {
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';
import styles from './index.less';
import { Header, AutoSizeLayout, AdvancedForm } from '../../components'
import { ExtTable } from 'suid';
import { Button, Input, Checkbox } from 'antd';
import { commonProps, commonUrl } from '../../utils';
const { Search } = Input;
const { recommendUrl } = commonUrl;
const { corporationProps, materialClassProps, statusProps } = commonProps

export default () => {
  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [onlyMe, setOnlyMe] = useState(true);
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/supplierRecommendDemandService/findByPage`,
      params: {
        ...searchValue,
        sortOrders: [
          {
            property: 'docNumber',
            direction: 'DESC'
          }
        ]
      },
      type: 'POST'
    }
  }
  const left = (
    <>
      <Button className={styles.btn} type='primary'>新增</Button>
      <Button className={styles.btn}>编辑</Button>
      <Button className={styles.btn}>删除</Button>
      <Button className={styles.btn}>提交供应商填报</Button>
      <Button className={styles.btn}>填报信息确认</Button>
      <Button className={styles.btn}>提交审核</Button>
      <Button className={styles.btn}>审核历史</Button>
      <Button className={styles.btn}>审核终止</Button>
      <Checkbox className={styles.btn} onChange={handleOnlyMeChange} checked={onlyMe}>仅我的</Checkbox>
    </>
  )
  const right = (
    <>
      <Search
        placeholder=''
        allowClear
      />
    </>
  )
  const columns = [
    {
      title: '单据状态',
      dataIndex: 'supplierRecommendDemandStatusRemark',
    },
    {
      title: '审核状态',
      dataIndex: 'flowStatus',
      render(text) {
        switch (text) {
          case 'INIT':
            return '未提交审批'
          case 'INPROCESS':
            return '审批中'
          case 'COMPLETED':
            return '审批完成'
          default:
            return ''
        }
      }
    },
    {
      title: '需求单号',
      dataIndex: 'docNumber'
    },
    {
      title: '供应商代码',
      dataIndex: 'supplierCode'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName'
    },
    {
      title: '原厂代码',
      dataIndex: 'originFactoryName'
    },
    {
      title: '原厂名称',
      dataIndex: 'originFactoryCode'
    },
    {
      title: '物料分类',
      dataIndex: 'materialCategoryName'
    },
    {
      title: '申请公司',
      dataIndex: 'corporationName'
    },
    {
      title: '创建部门',
      dataIndex: 'orgName'
    },
    {
      title: '创建人员',
      dataIndex: 'creatorName'
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate'
    }
  ].map(item => ({ ...item, align: 'center' }));
  const formItems = [
    {
      title: '需求单号',
      key: 'Q_LK_docNumber',
      props: {
        placeholder: '请输入采购单号'
      }
    },
    {
      title: '申请公司',
      key: 'Q_EQ_purchaseCompanyCode',
      type: 'list',
      props: {
        ...corporationProps,
        placeholder: '请选择申请公司'
      }
    },
    {
      title: '供应商名称',
      key: 'Q_LK_supplierName',
      props: {
        placeholder: '请输入供应商名称'
      }
    },
    {
      title: '原厂名称',
      key: 'Q_LK_originName',
      props: {
        placeholder: '请输入原厂名称'
      }
    },
    {
      title: '物料分类',
      key: 'Q_EQ_materialClassificationCode',
      type: 'tree',
      props: materialClassProps
    },
    {
      title: '物料认定类别',
      key: 'Q_EQ_materialConfirmCode',
      props: {
        placeholder: '选择物料认定类别'
      }
    },
    {
      title: '创建人',
      key: 'Q_LK_creatorName',
      props: {
        placeholder: '请输入创建人'
      }
    },
    {
      title: '单据状态',
      key: 'Q_EQ_status',
      type: 'list',
      props: {
        ...statusProps,
        placeholder: '选择单据状态'
      }
    }
  ];
  function handleAdvnacedSearch(v) {
    const keys = Object.keys(v);
    const filters = keys.map((item) => {
      const [_, operator, fieldName, isName] = item.split('_');
      return {
        fieldName,
        operator,
        value: !!isName ? undefined : v[item]
      }
    }).filter(item => !!item.value)
    setSearchValue({
      filters: filters
    })
    uploadTable()
    headerRef.current.hide()
  }
  // 记录列表选中项
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows)
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
  }
  // 快速搜索
  function handleQuickSerach(v) {
    setSearchValue({
      quickSearchValue: v
    })
    uploadTable()
  }
  // 切换仅查看我
  function handleOnlyMeChange(e) {
    setOnlyMe(e.target.checked)
    uploadTable()
  }
  // 更新列表
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  return (
    <div>
      <Header
        left={left}
        right={right}
        content={
          <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch} />
        }
        advanced
        ref={headerRef}
      />
      <AutoSizeLayout>
        {
          (h) => (
            <ExtTable
              columns={columns}
              bordered
              size='small'
              height={h}
              ref={tableRef}
              showSearch={false}
              rowKey={item => item.id}
              checkbox={{ multiSelect: false }}
              allowCancelSelect
              ellipsis={false}
              remotePaging
              selectedRowKeys={selectedRowKeys}
              onSelectRow={handleSelectedRows}
              {...tableProps}
            />
          )
        }

      </AutoSizeLayout>
    </div>
  )
}
