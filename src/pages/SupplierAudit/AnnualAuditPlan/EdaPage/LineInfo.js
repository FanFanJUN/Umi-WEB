/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:54
 * @LastEditTime: 2020-10-21 17:17:33
 * @Description: 行信息
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/LineInfo.js
 */
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Modal, Row, Input, DatePicker, Button } from 'antd';
import { ExtTable } from 'suid';
import AddModal from './AddModal';

let LineInfo = (props, ref) => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    type: 'add',
    dataSource: [],
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: '新增拟审核信息'
  })

  const columns = [
    { title: '需求公司', dataIndex: 'fileVersion', width: 140, ellipsis: true, },
    { title: '采购组织', dataIndex: 'drawFlag', ellipsis: true, width: 140 },
    { title: '供应商', dataIndex: 'sampleRequirementNum', ellipsis: true, width: 140 },
    { title: '代理商', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
    { title: '物料分类', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
    { title: '物料级别', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
    { title: '生产厂地址', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
    { title: '供应商联系人', dataIndex: 'sampleReceiverName', ellipsis: true, width: 140 },
    { title: '供应商联系电话', dataIndex: 'sampleReceiverTel', ellipsis: true, width: 140 },
    { title: '审核类型', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
    { title: '审核原因', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
    { title: '审核方式', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
    { title: '预计审核月度', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
    { title: '专业组', dataIndex: 'measureUnit', ellipsis: true, width: 140 },
    { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
  ].map(item => ({ ...item, align: 'center' }))

  const { isView } = props;

  const handleBtn = (type) => {
    switch (type) {
      case 'add':
        return setData(v => ({ ...v, visible: true, title: '新增拟审核信息', type: 'add' }));
      default:
        break;
    }
  }

  const handleSelectedRows = (value, rows) => {
    setData((v) => ({ ...v, selectedRowKeys: value, selectRows: rows, type: 'add' }))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          {
            !isView && <div>
              <Button onClick={() => handleBtn('add')} type='primary'>从合格供应商名录新增</Button>
              <Button disabled={data.selectRows.length !== 1} onClick={() => { handleBtn('edit') }} style={{ marginLeft: '5px' }}>批量编辑</Button>
              <Button disabled={data.selectedRowKeys.length < 1} onClick={() => { handleBtn('delete') }} style={{ marginLeft: '5px' }}>删除</Button>
            </div>
          }
          <ExtTable
            style={{ marginTop: '10px' }}
            rowKey={(v) => v.lineNumber}
            allowCancelSelect={true}
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={data.selectedRowKeys}
            columns={columns}
            ref={tableRef}
            dataSource={data.dataSource}
          />
        </div>
      </div>
      {data.visible &&
        <AddModal
          visible={data.visible}
          title={data.title}
          type={data.type}
        />}
    </div>
  );
}

export default Form.create()(LineInfo);
