import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../../utils/commonUrl';
import { ExtTable, utils } from 'suid';
import EventModal from './component/EventModal';
import {
  AddAndEditBasicMaterials,
  AddAndEditLimitSuppliesScope,
  DeleteBasicMaterials,
  DeleteBUCompanyOrganizationRelation,
  FrostBasicMaterials,
} from '../../commonProps';
import { AutoSizeLayout } from '../../../../components';

const { authAction } = utils;

const DEVELOPER_ENV = process.env.NODE_ENV === 'development';

const Index = () => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    visible: false,
    title: '限用物资清单新增',
    type: 'add',
  });

  const [selectRows, setSelectRows] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: '基本单位代码', dataIndex: 'basicUnitCode', width: 200 },
    { title: '基本单位名称', dataIndex: 'basicUnitName', ellipsis: true, width: 300 },
    { title: '排序号', dataIndex: 'orderNo', ellipsis: true, width: 300 },
    { title: '冻结', dataIndex: 'frozen', ellipsis: true, width: 300, render: (value) => value ? '是' : '否' },
  ].map(item => ({ ...item, align: 'center' }));

  const buttonClick = async (type) => {
    console.log(selectedRowKeys);
    switch (type) {
      case 'add':
        setData((value) => ({ ...value, visible: true, title: '限用物资基本单位新增', type: 'add' }));
        break;
      case 'edit':
        setData((value) => ({ ...value, visible: true, title: '限用物资基本单位编辑', type: 'edit' }));
        break;
      case 'delete':
        await deleteData();
        break;
      case 'frost':
        await editData(type);
        break;
      case 'thaw':
        await editData(type);
        break;
    }
  };

  const editData = async (type) => {
    const operation = type === 'frost'
    const data = await FrostBasicMaterials({
      ids: selectedRowKeys.toString(),
      operation: operation,
    });
    if (data.success) {
      setSelectRows([]);
      setSelectedRowKeys([]);
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
        const data = await DeleteBasicMaterials({
          ids: selectedRowKeys.toString(),
        });
        if (data.success) {
          setSelectRows([]);
          setSelectedRowKeys([]);
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        }
      },
    });
  };

  const onSelectRow = (value, rows) => {
    console.log(value, rows);
    setSelectRows(rows);
    setSelectedRowKeys(value);
  };

  const headerLeft = <div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
    {
      authAction(<Button
        type='primary'
        onClick={() => buttonClick('add')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_LSB_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
        key='QUALITYSYNERGY_LSB_EDIT'
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectRows.length === 0}
        key='QUALITYSYNERGY_LSB_DELETE'
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('frost')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_LSB_FROST'
        disabled={selectRows.length === 0}
      >冻结</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('thaw')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_LSB_THWA'
        disabled={selectRows.length === 0}
      >解冻</Button>)
    }
  </div>;

  const handleOk = async (value) => {
    let params = {};
    if (data.type === 'add') {
      params = value;
    } else {
      const id = selectRows[selectRows.length - 1].id;
      params = { ...value, id };
    }
    const response = await AddAndEditBasicMaterials(params);
    if (response.success) {
      setData((value) => ({ ...value, visible: false }));
      setSelectRows([]);
      setSelectedRowKeys([]);
      tableRef.current.manualSelectedRows();
      tableRef.current.remoteDataRefresh();
    } else {
      message.error(response.message);
    }
    console.log(value, 'save');
  };

  return (
    <Fragment>
      <AutoSizeLayout>
        {
          (h) => <ExtTable
            rowKey={(v) => v.id}
            columns={columns}
            height={h}
            store={{
              url: `${baseUrl}/limitMaterialUnitData/findBySearchPage`,
              type: 'POST',
            }}
            allowCancelSelect={true}
            remotePaging={true}
            checkbox={{
              multiSelect: true,
            }}
            ref={tableRef}
            onSelectRow={onSelectRow}
            selectedRowKeys={selectedRowKeys}
            toolBar={{
              left: headerLeft,
            }}
          />
        }
      </AutoSizeLayout>
      <EventModal
        visible={data.visible}
        onOk={handleOk}
        type={data.type}
        data={selectRows[selectRows.length - 1]}
        onCancel={() => setData((value) => ({ ...value, visible: false }))}
        title='限用物资基本单位新增'
      />
    </Fragment>
  );

};

export default Form.create()(Index);
