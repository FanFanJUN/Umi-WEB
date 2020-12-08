/**
 * @Description: 新增Modal框
 * @Author: M!keW
 * @Date: 2020-11-16
 */
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Form, Spin, message } from 'antd';
import { ExtTable, ExtModal } from 'suid';
import { recommendUrl } from '@/utils/commonUrl';
import { openNewTab } from '@/utils';

const AddModal = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    handleModalVisible,
  }));
  const tableRef = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectRows, setSelectRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: '月度审核计划号和行号', dataIndex: 'reviewPlanMonthCode', width: 200, ellipsis: true,
      render: (text, record) => text + ' ' + record.reviewPlanMonthLinenum
    },
    { title: '审核月度', dataIndex: 'applyMonth', width: 140, ellipsis: true, render: text => text ? text + '月' : '' },
    { title: '需求公司', dataIndex: 'applyCorporationName', width: 200, ellipsis: true ,
      render: (text, record) => record.applyCorporationCode + ' ' + record.applyCorporationName},
    { title: '采购组织', dataIndex: 'purchaseOrgName', ellipsis: true, width: 140 },
    { title: '供应商', dataIndex: 'supplierCode', ellipsis: true, width: 140,
      render: (text, record) => record.supplierCode + ' ' + record.supplierName},
    { title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 140 },
    { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 140 },
    { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 140 },
    { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 140 },
  ].map(item => ({ ...item, align: 'center' }));

  const handleModalVisible = (flag) => {
    setVisible(!!flag);
  };
  const onOk = () => {
    if (selectRows.length === 0) {
      message.warning('至少选中一行！');
      return;
    }
    openNewTab('supplierAudit/AuditReportManagementAdd?pageState=add&id=' + selectRows[0].id, '审核报告管理-新增', false);
    tableRef.current.manualSelectedRows();
    setVisible(false);
  };

  return <ExtModal
    width={1000}
    centered
    maskClosable={false}
    visible={visible}
    title="选择月度审核计划"
    onCancel={() => setVisible(false)}
    onOk={onOk}
    destroyOnClose
  >
    <Spin spinning={loading}>
      <ExtTable
        rowKey='id'
        allowCancelSelect={true}
        showSearch={false}
        remotePaging
        checkbox
        size='small'
        onSelectRow={(key, rows) => {
          setSelectedRowKeys(key);
          setSelectRows(rows);
        }}
        ref={tableRef}
        selectedRowKeys={selectedRowKeys}
        store={{
          url: `${recommendUrl}/api/reviewPlanMonthLineService/findForReport`,
          type: 'POST',
        }}
        columns={columns}
      />
    </Spin>
  </ExtModal>;

});

export default Form.create()(AddModal);
