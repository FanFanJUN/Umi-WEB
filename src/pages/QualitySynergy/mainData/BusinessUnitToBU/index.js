import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import { ExtTable, utils } from 'suid';
import EventModal from './component/EventModal';
import {
  AddBusinessUnitToBUt, DeleteBusinessUnitToBUt, DeleteTheListOfRestrictedMaterials,
  EditTheListOfRestrictedMaterials, FrozenBusinessUnitToBUt,
} from '../../commonProps';
import { AutoSizeLayout } from '../../../../components';

const { authAction } = utils;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

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
    { title: '业务板块代码', dataIndex: 'bmCode', width: 350 },
    { title: '业务板块名称', dataIndex: 'bmUnit', ellipsis: true, width: 350 },
    { title: '业务单元代码', dataIndex: 'bmCode', ellipsis: true, width: 350 },
    { title: '业务单元名称', dataIndex: 'buName', ellipsis: true, width: 350 },
    { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (value) => value ? '是' : '否' },
  ].map(item => ({ ...item, align: 'center' }));

  const buttonClick = async (type) => {
    switch (type) {
      case 'add':
        setData((value) => ({ ...value, visible: true, title: '业务板块对业务单元主数据新增', type: 'add' }));
        break;
      case 'edit':
        setData((value) => ({ ...value, visible: true, title: '业务板块对业务单元主数据编辑', type: 'edit' }));
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

  const deleteData = async () => {
    Modal.confirm({
      title: '删除',
      content: '是否删除选中过的数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      async onOk() {
        const data = await DeleteBusinessUnitToBUt({
          ids: selectedRowKeys.toString(),
        });
        if (data.success) {
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        }
      },
    });
  };

  const editData = async (type) => {
    const frozen = type === 'frost'
    const data = await FrozenBusinessUnitToBUt({
      ids: selectedRowKeys.toString(),
      frozen: frozen
    });
    if (data.success) {
      tableRef.current.manualSelectedRows();
      tableRef.current.remoteDataRefresh();
    }
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
        key='QUALITYSYNERGY_UML_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
        key='QUALITYSYNERGY_UML_EDIT'
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectRows.length === 0}
        key='QUALITYSYNERGY_UML_DELETE'
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('frost')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_UML_FROST'
        disabled={selectRows.length === 0}
      >冻结</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('thaw')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_UML_THAW'
        disabled={selectRows.length === 0}
      >解冻</Button>)
    }
  </div>;

  const handleOk = (value) => {
    if (data.type === 'add') {
      AddBusinessUnitToBUt(value).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, visible: false }));
          tableRef.current.remoteDataRefresh();
        } else {
          message.error(res.msg);
        }
      });
    } else {
      const id = selectRows[selectRows.length - 1].id;
      const params = { ...value, id };
      EditTheListOfRestrictedMaterials(params).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, visible: false }));
          setSelectRows([]);
          setSelectedRowKeys([]);
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        } else {
          message.error(res.msg);
        }
      });
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
              url: `${baseUrl}/bmBuContact/findByPage`,
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
        title='业务板块对业务单元主数据新增'
      />
    </Fragment>
  );

};

export default Form.create()(Index);
