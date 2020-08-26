import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils,ToolBar  } from 'suid';
import { Input, Button, message, Checkbox } from 'antd';
import { openNewTab, getFrameElement } from '@/utils';
import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '@/components/AutoSizeLayout';
import styles from './index.less';
import { smBaseUrl} from '@/utils/commonUrl';
import {queryStrategyTableList} from "@/services/supplierConfig"
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { Search } = Input
const { authAction, storage } = utils;
function SupplierConfigure() {
  const headerRef = useRef(null)
  const tableRef = useRef(null)
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [onlyMe, setOnlyMe] = useState(true);
  const [selectedRows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [visible, triggerVisible] = useState(false);
  const [attachId, setAttachId] = useState('');
  const [showAttach, triggerShowAttach] = useState(false);
  //const [dataSource, setData] = useState([]);
  const [singleRow = {}] = selectedRows;

  const { account } = storage.sessionStorage.get("Authorization");
  const {
    state: rowState,
    approvalState: rowApprovalState,
    changeable: rowChangeable,
    flowId: businessId
  } = singleRow;

  const columns = [
    {
      title: '配置代码',
      dataIndex: 'configCode',
      width:180
    },
    {
      title: '供应商分类代码',
      dataIndex: 'supplierCategoryCode',
      width:180
    },
    {
      title: '供应商分类名称',
      dataIndex: 'supplierCategoryName',
      width:220
    },
    {
      title: '新增',
      dataIndex: 'configCreate',
      render(text, record, index) {
        return  <div>
          {
            record.configCreate === '1' ? <Checkbox
              key={index}
              checked={true}
            /> : <Checkbox
            defaultChecked={false}
            defaultValue={false}
            checked={false}
          />
            
          }
        </div>
      },
      width: 80,
    },
    {
      title: '变更',
      dataIndex: 'configChange',
      render(text, record, index) {
        return  <div>
          {
            record.configChange === '1' ? <Checkbox
            key={index}
              checked={true}
            /> : <Checkbox
            key={index}
            defaultChecked={false}
            defaultValue={false}
            checked={false}
          />
            
          }
        </div>
      },
      width: 80,
    },
    { 
      title: '明细', 
      dataIndex: 'configDetail',
      render(text, record, index) {
        return  <div>
          {
            record.configDetail === '1' ? <Checkbox
            key={index}
              checked={true}
            /> : <Checkbox
            key={index}
            defaultChecked={false}
            defaultValue={false}
            checked={false}
          />
            
          }
        </div>
      },
      width: 80 
    },
    { title: '处理人', dataIndex: 'creatorName' },
    { title: '处理时间', dataIndex: 'createdDate',width: 180 },
  ].map(_ => ({ ..._, align: 'center' }))
  /* 按钮禁用状态控制 */
  const FRAMEELEMENT = getFrameElement();
  const empty = selectedRowKeys.length === 0;
  //const dataSource = []
  const dataSource = {
    store: {
      url: `${smBaseUrl}/api/SmSupplierRegConfigService/findByProperty`,
      params: {
        ...searchValue,
        quickSearchProperties:['supplierCategoryCode','supplierCategoryName']
      },
      type: 'POST'
    }
  }
  // 右侧搜索
  const searchBtnCfg =(
    <>
      <Input
        placeholder='请输入供应商分类或名称查询'
        className={styles.btn}
        onChange={SerachValue}
        allowClear
      />
      <Button type='primary' onClick={handleQuickSerach}>查询</Button>
    </>
  )

  useEffect(() => {
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return () => window.parent.frames.removeEventListener('message', listenerParentClose, false)
  }, []);
  
  function listenerParentClose(event) {
    const { data = {} } = event;
    if (data.tabAction === 'close') {
      tableRef.current.remoteDataRefresh()
    }
  }

  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
  }
  
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 新增
  function handleCreate() {
    const { pathname } = window.location
    openNewTab(`supplier/configure/create?Opertype=1&frameElementSrc=${pathname}`, '新增供应商注册信息配置', false)
  }
  // 编辑
  function handleEditor() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMEELEMENT;
    const { pathname } = window.location
    openNewTab(`supplier/configure/edit?id=${key}&frameElementId=${id}&Opertype=2&frameElementSrc=${pathname}`, '编辑供应商注册信息配置', false)
  }
  // 明细
  function handleCheckDetail() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMEELEMENT;
    const { pathname } = window.location
    openNewTab(`supplier/configure/detail?id=${key}&frameElementId=${id}&&Opertype=2&frameElementSrc=${pathname}`, '供应商注册信息配置明细', false)
  }
  // 冻结
  function handleChange() {

  }
  // 输入框值
  function SerachValue(v) {
    setSearchValue(v.target.value)
  }
  // 查询
  function handleQuickSerach() {
    setSearchValue({
      quickSearchValue: searchValue
    })
    uploadTable();
  }

  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  return (
    <>
    <Header
        left={
          <>
            {
              authAction(
                <Button type='primary' ignore={DEVELOPER_ENV} key='' className={styles.btn} onClick={handleCreate}>新增</Button>
              )
            }
            {
              authAction(
                <Button ignore={DEVELOPER_ENV} key='' className={styles.btn} onClick={handleEditor} disabled={empty}>编辑</Button>
              )
            }
            {
              authAction(
                <Button ignore={DEVELOPER_ENV} key='' className={styles.btn} onClick={handleCheckDetail} disabled={empty}>明细</Button>
              )
            }
            {/* {
              authAction(
                <Button key=''
                  ignore={DEVELOPER_ENV} className={styles.btn} onClick={handleChange} disabled={empty}>冻结</Button>
              )
            } */}
            
          </>
        }
        right={searchBtnCfg}
        advanced={false}
        extra={false}
        ref={headerRef}
      />
      <AutoSizeLayout>
        {
          (height) => <ExtTable
            columns={columns}
            showSearch={false}
            ref={tableRef}
            rowKey={(item) => item.id}
            checkbox={{
              multiSelect: false
            }}
            allowCancelSelect
            size='small'
            height={height}
            remotePaging={true}
            ellipsis={false}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectedRowKeys}
            //dataSource={dataSource}
            {...dataSource}
          />
        }
      </AutoSizeLayout>
    </>
  )
}

export default SupplierConfigure
