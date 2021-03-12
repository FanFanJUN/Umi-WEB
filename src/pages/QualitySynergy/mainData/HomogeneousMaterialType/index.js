import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../../utils/commonUrl';
import { ExtTable, utils } from 'suid';
import EventModal from './component/EventModal';
import {
  AddHomogeneousMaterialType, judgeButtonDisabled,
  UpdateHomogeneousMaterialType, DeleteTypeHomogeneousMaterialType, FrozenTypeHomogeneousMaterialType
} from '../../commonProps';
import { AutoSizeLayout } from '../../../../components';

const { authAction } = utils;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

const Index = () => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    visible: false,
    title: '新增',
    type: 'add',
  });

  const [selectRows, setSelectRows] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: '均质材料分类代码', dataIndex: 'homogeneousMaterialTypeCode', width: '20%', ellipsis: true },
    { title: '均质材料分类名称', dataIndex: 'homogeneousMaterialTypeName', width: '70%', ellipsis: true },
    { title: '冻结', dataIndex: 'frozen', width: '10%', render: (text) => text ? '是' : '否' },
  ].map(item => ({ ...item, align: 'center' }));

  const buttonClick = async (type) => {
    switch (type) {
      case 'add':
        setData((value) => ({ ...value, visible: true, title: '新增', type: 'add' }));
        break;
      case 'edit':
        setData((value) => ({ ...value, visible: true, title: '编辑', type: 'edit' }));
        break;
      case 'delete':
        await deleteData();
        break;
      case 'frost':
        await editData();
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
      async onOk () {
        const data = await DeleteTypeHomogeneousMaterialType({
          ids: selectedRowKeys.toString(),
        });
        if (data.success) {
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        }
      },
    });
  };

  const editData = async () => {
    const data = await FrozenTypeHomogeneousMaterialType({
      ids: selectedRowKeys.toString(),
      flag: !selectRows[0]?.frozen,
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
        disabled={!!selectedRowKeys.length}
        key='HOMOGENEOUSMATERIALTYPE_SRM_SM_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
        key='HOMOGENEOUSMATERIALTYPE_SRM_SM_EDIT'
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectRows.length === 0}
        key='HOMOGENEOUSMATERIALTYPE_SRM_SM_DELETE'
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('frost')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='HOMOGENEOUSMATERIALTYPE_SRM_SM_FROST'
        disabled={selectRows.length === 0 || judgeButtonDisabled(selectRows)}
      >{selectRows[0]?.frozen ? '解冻' : '冻结'}</Button>)
    }
  </div>;

  const handleOk = (value) => {
    if (data.type === 'add') {
      AddHomogeneousMaterialType({ ...value }).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, visible: false }));
          tableRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    } else {
      const id = selectRows[selectRows.length - 1].id;
      const params = { ...value, id };
      UpdateHomogeneousMaterialType(params).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, visible: false }));
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    }
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
              url: `${baseUrl}/homogeneousMaterialType/findAllByPage`,
              type: 'POST',
            }}
            searchPlaceHolder='输入均质材料分类代码或均质材料分类名称'
            allowCancelSelect={true}
            remotePaging={true}
            searchWidth={260}
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
      {data.visible &&
        <EventModal
          visible={data.visible}
          onOk={handleOk}
          type={data.type}
          data={selectRows[selectRows.length - 1]}
          onCancel={() => setData((value) => ({ ...value, visible: false }))}
          title={'均质材料分类主数据' + data.title}
        />
      }
    </Fragment>
  );

};

export default Form.create()(Index);
