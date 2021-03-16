import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal } from 'antd';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../../utils/commonUrl';
import { ExtTable, utils } from 'suid';
import {
  DeleteBUCompanyOrganizationRelation,
  judgeButtonDisabled,
} from '../../../QualitySynergy/commonProps';
import EventModal from '../../common/EventModal';
import {
  AuditOrganizationManagementAdd, AuditOrganizationManagementAddAuditOrganization,
  AuditOrganizationManagementByAuditOrganization, AuditOrganizationManagementDeleteAuditOrganization,
  AuditOrganizationManagementFrozen,
} from '../commomService';
import AddModal from './addModal';

const { authAction } = utils;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

const Index = () => {

  const addModalRef = useRef(null);
  const tableRef = useRef(null);

  const [data, setData] = useState({
    visible: false,
    title: '审核组织方式管理新增',
    type: 'add',
  });

  const [rightData, setRightData] = useState({
    dataSource: [],
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
  });

  const [selectRows, setSelectRows] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const organizationColumns = [
    { title: '审核组织方式名称', dataIndex: 'reviewOrganizedWayName', width: 250 },
    { title: '审核组织方式代码', dataIndex: 'reviewOrganizedWayCode', width: 250, ellipsis: true },
    { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (value) => value ? '是' : '否' },
  ];

  const columns = [
    { title: '代码', dataIndex: 'code', width: 200 },
    { title: '名称', dataIndex: 'name', ellipsis: true },
    { title: '排序号', dataIndex: 'rank', ellipsis: true },
    { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (value) => value ? '是' : '否' },
    { title: '是否为子表', dataIndex: 'whetherSon', ellipsis: true, render: (value) => value ? '是' : '否' },
  ].map(item => ({ ...item, align: 'center' }));

  const buttonClick = async (type) => {
    switch (type) {
      case 'add':
        setData((value) => ({ ...value, visible: true, title: '审核组织方式管理新增', type: 'add' }));
        break;
      case 'edit':
        setData((value) => ({ ...value, visible: true, title: '审核组织方式管理编辑', type: 'edit' }));
        break;
      case 'delete':
        await deleteData();
        break;
      case 'frost':
        await editData();
        break;
    }
  };

  const editData = async () => {
    const data = await AuditOrganizationManagementFrozen({
      ids: selectedRowKeys.toString(),
      operation: !selectRows[0]?.frozen,
    });
    if (data.success) {
      tableRef.current.manualSelectedRows();
      tableRef.current.remoteDataRefresh();
    }
  };

  const deleteData = async () => {
    Modal.confirm({
      title: '删除',
      content: '是否删除选中过的数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      async onOk() {
        const data = await DeleteBUCompanyOrganizationRelation({
          ids: selectedRowKeys.toString(),
        });
        if (data.success) {
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        }
      },
    });
  };

  const onSelectRow = async (value, rows) => {
    console.log(value, rows);
    if (rows[0] && !rows[0].whetherSon) {
      await getOrganizationData(value);
    } else {
      if (rightData.dataSource.length !== 0) {
        setRightData(v => ({...v, dataSource: []}))
      }
      message.warning('该行没有子表');
    }
    setSelectRows(rows);
    setSelectedRowKeys(value);
  };

  const onRightSelectRow = (keys, rows) => {
    setRightData(v => ({ ...v, selectRows: rows, selectedRowKeys: keys }));
  };

  const getOrganizationData = async (id) => {
    const res = await AuditOrganizationManagementByAuditOrganization(id);
    if (res.success) {
      setRightData(v => ({...v, dataSource: res.data ? res.data : []}))
    } else {
      message.error(res.message)
    }
  };

  const deleteRightData = () => {
    Modal.confirm({
      title: '删除',
      content: '是否删除审核组织方式',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        AuditOrganizationManagementDeleteAuditOrganization(rightData.selectedRowKeys).then(async res => {
          if(res.success) {
            message.success('删除成功')
            await getOrganizationData(selectedRowKeys);
          } else {
            message.error(res.message)
          }
        }).catch(err => {
          message.error(err)
        })
      }
    })
  }

  const organizationLeft = <div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
    {
      authAction(<Button
        type='primary'
        onClick={() => setRightData(v => ({ ...v, visible: true }))}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={!(selectRows[0] && !selectRows[0].whetherSon)}
        key='SUPPLIER_AUDIT_ORGANIZATION_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={deleteRightData}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={rightData.selectedRowKeys.length === 0}
        key='SUPPLIER_AUDIT_ORGANIZATION_EDIT'
      >删除</Button>)
    }
  </div>;

  const headerLeft = <div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
    {
      authAction(<Button
        type='primary'
        onClick={() => buttonClick('add')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_ORGANIZATION_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
        key='SUPPLIER_AUDIT_ORGANIZATION_EDIT'
      >编辑</Button>)
    }
    {/*{*/}
    {/*  authAction(<Button*/}
    {/*    onClick={() => buttonClick('delete')}*/}
    {/*    className={styles.btn}*/}
    {/*    ignore={DEVELOPER_ENV}*/}
    {/*    disabled={selectRows.length === 0}*/}
    {/*    key='SUPPLIER_AUDIT_ORGANIZATION_DELETE'*/}
    {/*  >删除</Button>)*/}
    {/*}*/}
    {
      authAction(<Button
        onClick={() => buttonClick('frost')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_ORGANIZATION_FORST'
        disabled={selectRows.length === 0 || judgeButtonDisabled(selectRows)}
      >{selectRows[0]?.frozen ? '解冻' : '冻结'}</Button>)
    }
  </div>;

  const handleOk = async (value) => {
    if (data.type === 'add') {
      AuditOrganizationManagementAdd(value).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, visible: false }));
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    } else {
      const id = selectRows[selectRows.length - 1].id;
      const params = { ...value, id };
      AuditOrganizationManagementAdd(params).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, visible: false }));
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    }
    console.log(value, 'save');
  };

  const rightModalCancel = () => {
    setRightData(v => ({ ...v, visible: false }));
  };

  const rightModalOk = () => {
    addModalRef.current.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.parentId = selectedRowKeys[0];
        saveReviewOrganizedWay(values);
      }
    });
  };

  const saveReviewOrganizedWay = (values) => {
    AuditOrganizationManagementAddAuditOrganization([values]).then(async res => {
      if (res.success) {
        setRightData(v => ({ ...v, visible: false }));
        await getOrganizationData([values.parentId])
      } else {
        message.error(res.message);
      }
    }).catch(err => {
      message.error(err);
    });
  };

  return (
    <Fragment>
      <div style={{ float: 'left', width: '50%', borderRight: '1px solid #aaaaaa' }}>
        <ExtTable
          rowKey={(v) => v.id}
          columns={columns}
          height={window.innerHeight}
          store={{
            url: `${baseUrl}/reviewOrganizedWay/findBySearchPage`,
            type: 'POST',
          }}
          allowCancelSelect={true}
          remotePaging={true}
          checkbox={{
            multiSelect: false,
          }}
          ref={tableRef}
          onSelectRow={onSelectRow}
          selectedRowKeys={selectedRowKeys}
          toolBar={{
            left: headerLeft,
          }}
        />
      </div>
      <div style={{ float: 'right', width: '50%' }}>
        <ExtTable
          rowKey={(v) => v.id}
          columns={organizationColumns}
          dataSource={rightData.dataSource}
          height={window.innerHeight}
          allowCancelSelect={true}
          remotePaging={true}
          checkbox={{
            multiSelect: true,
          }}
          onSelectRow={onRightSelectRow}
          selectedRowKeys={rightData.selectedRowKeys}
          toolBar={{
            left: organizationLeft,
          }}
        />
      </div>
      <AddModal
        visible={rightData.visible}
        onOk={rightModalOk}
        ref={addModalRef}
        onCancel={rightModalCancel}
      />
      <EventModal
        onCancel={() => setData((value) => ({ ...value, visible: false }))}
        onOk={handleOk}
        data={selectRows[selectRows.length - 1]}
        fieldsConfig={[
          {
            name: '名称',
            code: 'name',
            unlimited: 100,
          },
          {
            name: '代码',
            code: 'code',
          },
          {
            name: '序列号',
            code: 'rank',
            min: 0,
            type: 'inputNumber',
          },
        ]}
        propData={{
          visible: data.visible,
          type: data.type,
          title: '审核组织方式管理新增',
        }}
      />
    </Fragment>
  );

};

export default Form.create()(Index);
