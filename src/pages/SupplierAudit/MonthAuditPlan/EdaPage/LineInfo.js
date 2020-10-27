/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:54
 * @LastEditTime: 2020-10-23 17:47:33
 * @Description: 行信息
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/LineInfo.js
 */
import React, { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
import { Form, Button } from 'antd';
import { ExtTable } from 'suid';
import AddModal from './AddModal';
import BatchEditModal from './BatchEditModal';

let LineInfo = (props, ref) => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    type: 'add',
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: ''
  });

  const [dataSource, setDataSource] = useState([{ id: 1 }]);
  const [addModalData, setModalData] = useState({});
  const [batchEditVisible, setBatchEditVisible] = useState(false);

  const columns = [
    {
      title: '操作', dataIndex: 'operaton', width: 140, ellipsis: true, render: (text, item) => {
        return <div>
          <a onClick={() => { console.log("跳转到内容") }} key="content">内容</a>
          <a onClick={() => { console.log("跳转到小组") }} style={{ margin: '0 3px' }} key="group">小组</a>
          <a onClick={() => { console.log("跳转到协同") }} key="xietong">协同</a>
        </div>
      }
    },
    { title: '需求公司', dataIndex: 'corporationCode', width: 140, ellipsis: true, },
    { title: '采购组织', dataIndex: 'purchaseOrgCode', ellipsis: true, width: 140 },
    { title: '供应商', dataIndex: 'supplierCode', ellipsis: true, width: 140 },
    { title: '代理商', dataIndex: 'measureUnit1', ellipsis: true, width: 140 },
    { title: '物料分类', dataIndex: 'measureUnit2', ellipsis: true, width: 140 },
    { title: '物料级别', dataIndex: 'measureUnit3', ellipsis: true, width: 140 },
    { title: '生产厂地址', dataIndex: 'measureUnit4', ellipsis: true, width: 140 },
    { title: '供应商联系人', dataIndex: 'sampleReceiverName', ellipsis: true, width: 140 },
    { title: '供应商联系电话', dataIndex: 'sampleReceiverTel', ellipsis: true, width: 140 },
    { title: '审核类型', dataIndex: 'measureUnit5', ellipsis: true, width: 140 },
    { title: '审核方式', dataIndex: 'measureUnit6', ellipsis: true, width: 140 },
    { title: '审核组织方式', dataIndex: 'measureUnit7', ellipsis: true, width: 140 },
    { title: '专业组', dataIndex: 'measureUnit8', ellipsis: true, width: 140 },
    { title: '审核小组组长', dataIndex: 'measureUnit9', ellipsis: true, width: 140 },
    { title: '备注', dataIndex: 'measureUnit0', ellipsis: true, width: 140 },
    { title: '来源类型', dataIndex: 'measureUnit12', ellipsis: true, width: 140 },
    { title: '来源单号', dataIndex: 'remark11', ellipsis: true, width: 140 },
    { title: '来源单行号', dataIndex: 'remark12', ellipsis: true, width: 140 },
  ].map(item => ({ ...item, align: 'center' }))

  const { isView } = props;

  const handleBtn = (type) => {
    switch (type) {
      case "annual":
      case "recommand":
      case "demand":
        setModalData({
          visible: true,
          type
        });
        break;
      case "edit":
        setBatchEditVisible(true);
        break;
      default:
        break;
    }

  }

  const handleSelectedRows = (value, rows) => {
    setData((v) => ({ ...v, selectedRowKeys: value, selectRows: rows, type: 'add' }))
  }

  function setBatchVisible() {
    setBatchEditVisible(false);
  }

  const handleAddOk = (value) => {
    console.log("新增数据", value)
  }
  const getBatchFormValue = (value) => {
    console.log("批量编辑确定")
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          {
            !isView && <div className={styles.listBtn}>
              <Button onClick={() => handleBtn('annual')} type='primary'>从年度计划新增</Button>
              <Button onClick={() => handleBtn('recommand')} type='primary'>从准入推荐新增</Button>
              <Button onClick={() => handleBtn('demand')} type='primary'>从审核需求新增</Button>
              <Button onClick={() => { handleBtn('edit') }} >批量编辑</Button>
              <Button onClick={() => { handleBtn('delete') }} >删除</Button>
              <Button onClick={() => { handleBtn('contenM') }} >审核内容管理</Button>
              <Button onClick={() => { handleBtn('groupM') }} >审核小组管理</Button>
              <Button onClick={() => { handleBtn('personM') }} >协同人员管理</Button>
            </div>
          }
          <ExtTable
            style={{ marginTop: '10px' }}
            rowKey='id'
            allowCancelSelect={true}
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={data.selectedRowKeys}
            columns={columns}
            ref={tableRef}
            dataSource={dataSource}
          />
        </div>
      </div>
      {/* 新增弹框 */}
      {addModalData.visible && <AddModal
        visible={addModalData.visible}
        type={addModalData.type}
        handleCancel={() => { setModalData({ visible: false }) }}
        handleOk={handleAddOk}
        lineData={dataSource}
      />}
      { batchEditVisible && <BatchEditModal
        visible={batchEditVisible}
        onCancel={()=>{setBatchEditVisible(false)}}
        onOk={getBatchFormValue}
      />
      }
    </div>
  );
}

export default Form.create()(LineInfo);
