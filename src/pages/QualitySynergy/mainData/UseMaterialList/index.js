import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import { DataImport, ExtTable, utils, AuthAction } from 'suid';
import EventModal from './component/EventModal';
import {
  AddTheListOfRestrictedMaterials, DeleteTheListOfRestrictedMaterials,
  EditTheListOfRestrictedMaterials, FrostTheListOfRestrictedMaterials,
  JudgeTheListOfRestrictedMaterials, SaveTheListOfRestrictedMaterials,
} from '../../commonProps';

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
    { title: '限用物质代码', dataIndex: 'limitMaterialCode', width: 200 },
    { title: '限用物质名称', dataIndex: 'limitMaterialName', ellipsis: true },
    { title: 'CAS.NO', dataIndex: 'casNo', ellipsis: true },
    { title: '基本单位代码', dataIndex: 'basicUnitCode', ellipsis: true },
    { title: '基本单位名称', dataIndex: 'basicUnitName', ellipsis: true },
    {
      title: '是否测试记录表中检查项',
      dataIndex: 'recordCheckList',
      ellipsis: true,
      width: 300,
      render: (value) => value ? '是' : '否',
    },
    { title: '排序号', dataIndex: 'orderNo', ellipsis: true },
    { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (value) => value ? '是' : '否' },
  ].map(item => ({ ...item, align: 'center' }));

  const buttonClick = async (type) => {
    switch (type) {
      case 'add':
        setData((value) => ({ ...value, visible: true, title: '限用物资清单新增', type: 'add' }));
        break;
      case 'edit':
        setData((value) => ({ ...value, visible: true, title: '限用物资清单编辑', type: 'edit' }));
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
        const data = await DeleteTheListOfRestrictedMaterials({
          id: selectedRowKeys.toString(),
        });
        if (data.success) {
          setSelectRows([]);
          setSelectedRowKeys([]);
          tableRef.current.remoteDataRefresh();
        }
      },
    });
  };

  const editData = async (type) => {
    const frozen = type === 'frost'
    const data = await FrostTheListOfRestrictedMaterials({
      ids: selectedRowKeys.toString(),
      flag: frozen
    });
    if (data.success) {
      setSelectRows([]);
      setSelectedRowKeys([]);
      tableRef.current.remoteDataRefresh();
    }
  };

  const onSelectRow = (value, rows) => {
    console.log(value, rows);
    setSelectRows(rows);
    setSelectedRowKeys(value);
  };

  const validateItem = (data) => {
    return new Promise((resolve, reject) => {
      JudgeTheListOfRestrictedMaterials(data).then(res => {
        const response = res.data.map(item => ({
          ...item,
          validate: item.importResult,
          status: item.importResult ? '数据完整' : '失败',
          statusCode: item.importResult ? 'success' : 'error',
          message: item.importResult ? '成功' : item.importResultInfo
        }));
        resolve(response);
      }).catch(err => {
        reject(err)
      })
    });
  };

  const importFunc = (value) => {
    SaveTheListOfRestrictedMaterials(value).then(res => {
      if (res.success) {
        tableRef.current.remoteDataRefresh();
      } else {
        message.error(res.msg)
      }
    });
  };

  const headerLeft = <div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
    {
      authAction(<Button
        type='primary'
        onClick={() => buttonClick('add')}
        className={styles.btn}
        // ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_UML_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('edit')}
        className={styles.btn}
        // ignore={DEVELOPER_ENV}
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
        key='QUALITYSYNERGY_UML_EDIT'
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('delete')}
        className={styles.btn}
        // ignore={DEVELOPER_ENV}
        disabled={selectRows.length === 0}
        key='QUALITYSYNERGY_UML_DELETE'
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('frost')}
        className={styles.btn}
        // ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_UML_FROST'
        disabled={selectRows.length === 0}
      >冻结</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('thaw')}
        className={styles.btn}
        // ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_UML_THAW'
        disabled={selectRows.length === 0}
      >解冻</Button>)
    }
    {
      <AuthAction key="QUALITYSYNERGY_UML_IMPORT" ignore>
        <DataImport
          tableProps={{ columns }}
          validateAll={true}
          validateFunc={validateItem}
          importFunc={importFunc}
          templateFileList={[
            {
              download: '/templates/主数据-限用物质清单-批导模板.xlsx',
              fileName: '主数据-限用物质清单-批导模板.xlsx',
              key: 'UseMaterialList',
            },
          ]}
        />
      </AuthAction>
    }
  </div>;

  const handleOk = (value) => {
    if (data.type === 'add') {
      AddTheListOfRestrictedMaterials(value).then(res => {
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
      <ExtTable
        rowKey={(v) => v.id}
        columns={columns}
        store={{
          url: `${baseUrl}/limitSubstanceListData/find_by_page_all`,
          type: 'POST',
        }}
        searchPlaceHolder='输入限用物资名称或CAS.NO关键字'
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
      <EventModal
        visible={data.visible}
        onOk={handleOk}
        type={data.type}
        data={selectRows[selectRows.length - 1]}
        onCancel={() => setData((value) => ({ ...value, visible: false }))}
        title='限用物资清单新增'
      />
    </Fragment>
  );

};

export default Form.create()(Index);
