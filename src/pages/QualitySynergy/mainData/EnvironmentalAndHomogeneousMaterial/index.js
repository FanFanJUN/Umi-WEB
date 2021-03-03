import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../../utils/commonUrl';
import { ExtTable, utils, DataImport } from 'suid';
import EventModal from './component/EventModal';
import {
  judgeButtonDisabled, AddEnvironmentalProtectionMaterialType, UpdateEnvironmentalProtectionMaterialType, FrozenEnvironmentalProtectionMaterialType, DeleteTypeEnvironmentalProtectionMaterialType, ImportExcelEnvironmentalProtectionMaterialTypeService, AddImportAllEnvironmentalProtectionMaterialTypeService
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

  const AuthActionCode = 'ENVIRONMENTALANDHOMOGENEOUSMATERIAL_SM_';

  const labelConfig = {
    environmentalProtectionCode: {
      name: '环保标准代码',
      code: 'environmentalProtectionCode',
    },
    environmentalProtectionName: {
      name: '环保标准名称',
      code: 'environmentalProtectionName',
    },
    homogeneousMaterialTypeCode: {
      name: '均质材料分类代码',
      code: 'homogeneousMaterialTypeCode',
    },
    homogeneousMaterialTypeName: {
      name: '均质材料分类名称',
      code: 'homogeneousMaterialTypeName',
    },
    limitMaterialCode: {
      name: '限用物质代码',
      code: 'limitMaterialCode',
    },
    limitMaterialName: {
      name: '限用物质名称',
      code: 'limitMaterialName'
    },
    orderNo: {
      name: '排序号',
      code: 'orderNo',
    },
    frozen: {
      name: '冻结',
      code: 'frozen',
    },
  }

  const { environmentalProtectionCode, environmentalProtectionName, homogeneousMaterialTypeCode, homogeneousMaterialTypeName, limitMaterialCode, limitMaterialName, orderNo, frozen } = labelConfig;

  const columns = [
    { title: environmentalProtectionCode.name, dataIndex: environmentalProtectionCode.code, width: 200, ellipsis: true },
    { title: environmentalProtectionName.name, dataIndex: environmentalProtectionName.code, width: 200, ellipsis: true },
    { title: homogeneousMaterialTypeCode.name, dataIndex: homogeneousMaterialTypeCode.code, width: 200, ellipsis: true },
    { title: homogeneousMaterialTypeName.name, dataIndex: homogeneousMaterialTypeName.code, width: 300, ellipsis: true },
    { title: limitMaterialCode.name, dataIndex: limitMaterialCode.code, width: 100, ellipsis: true },
    { title: limitMaterialName.name, dataIndex: limitMaterialName.code, width: 300, ellipsis: true },
    { title: orderNo.name, dataIndex: orderNo.code, width: 100, ellipsis: true },
    { title: frozen.name, dataIndex: frozen.code, width: 100, render: (text) => text ? '是' : '否' },
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

  // 更新列表数据
  function uploadTable () {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 清除选中项
  function cleanSelectedRecord () {
    setSelectRows([])
    setSelectedRowKeys([])
    tableRef.current.manualSelectedRows([])
  }

  const deleteData = async () => {
    Modal.confirm({
      title: '删除',
      content: '是否删除选中过的数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      async onOk () {
        const data = await DeleteTypeEnvironmentalProtectionMaterialType({
          ids: selectedRowKeys.toString(),
        });
        if (data.success) {
          uploadTable()
        }
      },
    });
  };

  // 验证要导入的数据
  async function validateFunc (item) {
    const { success, data, message: msg } = await ImportExcelEnvironmentalProtectionMaterialTypeService(item)
    if (success) {
      const formatData = data.map((item, index) => ({
        ...item,
        key: `${index}-validate`,
        validate: item.importInfo,
        status: item.importInfo ? "验证通过" : '验证未通过',
        statusCode: item.importInfo ? 'success' : 'failed',
        message: item.importResult,
      }))
      return new Promise(resolve => resolve(formatData))
    }
    message.error(msg)
  }

  // 确认导入
  async function importFunc (importData) {
    let params = importData.map(item => ({ ...item, frozen: false }))
    const { success, data, message: msg } = await AddImportAllEnvironmentalProtectionMaterialTypeService(params)
    if (success) {
      message.success('导入成功')
      uploadTable()
      return
    }
    message.error(msg)
  }

  const editData = async () => {
    const data = await FrozenEnvironmentalProtectionMaterialType({
      ids: selectedRowKeys.toString(),
      flag: !selectRows[0]?.frozen,
    });
    if (data.success) {
      uploadTable()
    }
  };

  const onSelectRow = (value, rows) => {
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
        key={`${AuthActionCode}ADD`}
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
        key={`${AuthActionCode}EDIT`}
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectRows.length === 0}
        key={`${AuthActionCode}DELETE`}
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('frost')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key={`${AuthActionCode}FROST`}
        disabled={selectRows.length === 0 || judgeButtonDisabled(selectRows)}
      >{selectRows[0]?.frozen ? '解冻' : '冻结'}</Button>)
    }
    {
      authAction(<DataImport
        ignore={DEVELOPER_ENV}
        key={`${AuthActionCode}IMPORT`}
        className={styles.btn}
        tableProps={{ columns: [{ title: '行号', dataIndex: 'lineNo', width: 80, align: 'center' }, ...columns].slice(0, -1) }}
        validateFunc={validateFunc}
        importFunc={importFunc}
        validateAll={true}
        templateFileList={[
          {
            download: `${DEVELOPER_ENV ? '' : '/react-srm-sm-web'}/templates/环保标准与均质材料分类限用物质测试项配置表-批导模板.xlsx`,
            fileName: '环保标准与均质材料分类限用物质测试项配置表-批导模板.xlsx',
            key: 'EnvironmentalAndHomogeneousMaterial',
          },
        ]}
      />)
    }
  </div>;

  const handleOk = (value) => {
    if (data.type === 'add') {
      AddEnvironmentalProtectionMaterialType({ ...value }).then(res => {
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
      UpdateEnvironmentalProtectionMaterialType(params).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, visible: false }));
          uploadTable()
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
              url: `${baseUrl}/environmentalProtectionMaterialType/findAllByPage`,
              type: 'POST',
            }}
            searchPlaceHolder='环保标准代码、均质材料名称或限用物质名称查询'
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
          labelConfig={labelConfig}
        />
      }
    </Fragment>
  );

};

export default Form.create()(Index);
