/*
 * @Author: Li Cai
 * @LastEditors: Please set LastEditors
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:54
 * @LastEditTime: 2020-11-27 10:03:43
 * @Description: 行信息
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/LineInfo.js
 */
import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form, Button } from 'antd';
import { ExtTable } from 'suid';
import AddModal from './AddModal';
import BatchEditModal from './BatchEditModal';
import { isEmptyArray } from '../../../../utils/utilTool';

let LineInfo = (props, ref) => {

  const { setlineData, originData, type, isView } = props;
  const tableRef = useRef(null);

  const [data, setData] = useState({
    type: 'add',
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: ''
  });

  const [dataSource, setDataSource] = useState([]);
  const [batchEditVisible, setBatchEditVisible] = useState(false);

  useEffect(() => {
    if (originData && !isEmptyArray(originData.planYearLineVos)) {
      setDataSource(originData.planYearLineVos)
    }
  }, [originData])

  const columns = [
    {
      title: '需求公司', dataIndex: 'applyCorporation', width: 140, ellipsis: true, render: (text, record) => {
        return `${record.applyCorporationCode}_${record.applyCorporationName}`;
      }
    },
    {
      title: '采购组织', dataIndex: 'purchaseTeam', ellipsis: true, width: 140, render: (text, record) => {
        return `${record.purchaseTeamCode}_${record.purchaseTeamName}`;
      }
    },
    {
      title: '供应商', dataIndex: 'supplier', ellipsis: true, width: 140, render: (text, record) => {
        return `${record.supplierCode}_${record.supplierName}`;
      }
    },
    {
      title: '代理商', dataIndex: 'agent', ellipsis: true, width: 140, render: (text, record) => {
        return record.agentCode && `${record.agentCode}_${record.agentName}`;
      }
    },
    {
      title: '物料分类', dataIndex: 'materialGroup', ellipsis: true, width: 140, render: (text, record) => {
        return `${record.materialGroupCode}_${record.materialGroupName}`;
      }
    },
    { title: '物料级别', dataIndex: 'materialGradeName', ellipsis: true, width: 140 },
    {
      title: '生产厂地址', dataIndex: 'address', ellipsis: true, width: 200, render: (v, data) => {
        return data.countryName && `${data.countryName + data.provinceName + data.cityName + data.countyName + data.address}`;
      }
    },
    { title: '供应商联系人', dataIndex: 'contactUserName', ellipsis: true, width: 140 },
    { title: '供应商联系电话', dataIndex: 'contactUserTel', ellipsis: true, width: 140 },
    { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 140 },
    { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 140 },
    { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 140 },
    { title: '预计审核月度', dataIndex: 'reviewMonth', ellipsis: true, width: 140, render: text => text + " 月" },
    { title: '专业组', dataIndex: 'specialtyTeamName', ellipsis: true, width: 140 },
    { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
  ].map(item => ({ ...item, align: 'center' }))

  const handleBtn = (type) => {
    switch (type) {
      case 'add':
        return setData(v => ({ ...v, visible: true, title: '从合格供应商名录新增', type: 'add' }));
      case 'delete':
        filterSelectRow();
        break;
      case 'edit':
        setBatchEditVisible(true);
        break;
      default:
        break;
    }
  }

  function filterSelectRow() {
    const selectData = data.selectedRowKeys;
    const filterData = dataSource.filter((item) => {
      return !selectData.includes(item.reviewPlanYearLinenum);
    });
    setDataSource(filterData);
    clearSelect();
  }

  function clearSelect() {
    setData(v => ({ v, selectedRowKeys: [], selectRows: [] }));
  }

  const handleSelectedRows = (value, rows) => {
    setData((v) => ({ ...v, selectedRowKeys: value, selectRows: rows, type: 'add' }))
  }

  function setVisible() {
    setData(() => ({ visible: false, selectRows: [], selectedRowKeys: [] }));
  }

  function handleOk(tableData) {
    console.log(tableData);
    tableData.forEach(item => {
      // 需求公司
      item.applyCorporationCode = item.corporation.code;
      item.applyCorporationId = item.corporation.id;
      item.applyCorporationName = item.corporation.name;
      // 采购组织=>占用采购组字段 数据库设计错误
      item.purchaseTeamCode = item.purchaseOrg.code;
      item.purchaseTeamName = item.purchaseOrg.name;
      item.purchaseTeamId = item.purchaseOrg.id;
      // 供应商
      item.supplierCode = item.supplier.code;
      item.supplierName = item.supplier.name;
      item.supplierId = item.supplier.id;

      //代理商
      item.agentCode = item.originSupplierCode;
      item.agentName = item.originSupplierName;

      // 物料分类
      item.materialGroupCode = item.materielCategory.code;
      item.materialGroupId = item.materielCategory.id;
      item.materialGroupName = item.materielCategory.name;

      // 物料级别
      item.materialGradeCode = item.materialGrade;
      item.materialGradeName = item.materialGrade;
      // 专业组
      item.specialtyTeamName = item.purchaseProfessionalGroup;
    })
    const newTableList = JSON.parse(JSON.stringify(dataSource));
    newTableList.push(tableData[0]);
    // 行号
    newTableList.forEach((item, index) => {
      item.reviewPlanYearLinenum = ((Array(4).join(0) + (index + 1)).slice(-4) + '0');
    })
    setDataSource(newTableList);
    setlineData(newTableList);
    setData((v) => ({ ...v, visible: false }));
  }

  function setBatchVisible() {
    setBatchEditVisible(false);
  }

  function getBatchFormValue(formValue) {
    const batchEditList = dataSource.filter((item) => {
      return data.selectedRowKeys.includes(item.reviewPlanYearLinenum);
    });
    const leftTableData = dataSource.filter((item) => {
      return !(data.selectedRowKeys.includes(item.reviewPlanYearLinenum));
    });
    const newBatchData = batchEditList.map((item) => {
      return { ...item, ...formValue };
    });
    setDataSource([...newBatchData, ...leftTableData]);;
    setlineData([...newBatchData, ...leftTableData]);
    setBatchVisible();
    tableRef.current.manualSelectedRows();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          {
            !isView && <div>
              <Button onClick={() => handleBtn('add')} type='primary'>从合格供应商名录新增</Button>
              <Button disabled={data.selectRows.length === 0} onClick={() => { handleBtn('edit') }} style={{ marginLeft: '5px' }}>批量编辑</Button>
              <Button disabled={data.selectedRowKeys.length === 0} onClick={() => { handleBtn('delete') }} style={{ marginLeft: '5px' }}>删除</Button>
            </div>
          }
          <ExtTable
            style={{ marginTop: '10px' }}
            rowKey='reviewPlanYearLinenum'
            allowCancelSelect={true}
            showSearch={false}
            remotePaging
            checkbox={isView ? null : { multiSelect: true }}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={data.selectedRowKeys}
            columns={columns}
            ref={tableRef}
            dataSource={dataSource}
          />
        </div>
      </div>
      {data.visible &&
        <AddModal
          visible={data.visible}
          title={data.title}
          type={data.type}
          handleCancel={setVisible}
          handleOk={handleOk}
          lineData={dataSource}
        />}
      {
        batchEditVisible &&
        <BatchEditModal
          visible={batchEditVisible}
          onCancel={setBatchVisible}
          onOk={getBatchFormValue}
          originData={data.selectRows[0]}
        />
      }
    </div>
  );
}

export default Form.create()(LineInfo);
