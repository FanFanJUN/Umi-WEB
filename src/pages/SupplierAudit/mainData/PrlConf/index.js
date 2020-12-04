/*
 * @Author: Li Cai
 * @LastEditors: Please set LastEditors
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-12 14:44:24
 * @LastEditTime: 2020-12-04 11:19:22
 * @Description: 百分比、评定等级、风险等级配置
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/mainData/PrlConf/index.js
 */
import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal } from 'antd';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../../utils/commonUrl';
import { ExtTable, utils } from 'suid';
import {
  DeleteBUCompanyOrganizationRelation, judgeButtonDisabled,
} from '../../../QualitySynergy/commonProps';
import { AutoSizeLayout } from '../../../../components';
import EventModal from '../../common/EventModal';
import { requestGetFrozenApi, requestPostApi } from '../mainDataService';

const { authAction } = utils;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

const Index = () => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    visible: false,
    title: '百分比、评定等级、风险等级配置新增',
    type: 'add',
  });

  const [selectRows, setSelectRows] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: '评定等级', dataIndex: 'performanceRatingKey', width: 200 },
    { title: '风险等级', dataIndex: 'riskRatingKey', ellipsis: true},
    { title: '开始区间计算符', dataIndex: 'startSectionMark', ellipsis: true},
    { title: '开始区间', dataIndex: 'startSection', ellipsis: true },
    { title: '结束区间计算符', dataIndex: 'endSectionMark', ellipsis: true},
    { title: '结束区间', dataIndex: 'endSection', ellipsis: true },
    { title: '名称', dataIndex: 'name', ellipsis: true },
    { title: '排序号', dataIndex: 'rank', ellipsis: true },
    { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (value) => value ? '是' : '否' },
  ].map(item => ({ ...item, align: 'center' }));

  const fieldsConfig = [{
    name: '评定等级',
    code: 'performanceRatingKey',
    width: 200,
    type: 'selectWithData',
    data: [{ text: 'A', value: 'A' }, { text: 'B', value: 'B' }, { text: 'C', value: 'C' }, { text: 'D', value: 'D' }]
  },
  {
    name: '风险等级',
    code: 'riskRatingKey',
    type: 'selectWithData',
    data: [{ text: '低', value: '低' }, { text: '中低', value: '中低' }, { text: '中', value: '中' }, { text: '高', value: '高' }]
  },
  {
    name: '开始区间计算符',
    code: 'startSectionMark',
    type: 'selectWithData',
    data: [{ text: '<', value: '<' }, { text: '<=', value: '<=' }, { text: '=', value: '=' }, { text: '>', value: '>' }, { text: '>=', value: '>=' }]
  },
  {
    name: '开始区间',
    code: 'startSection',
    type: 'inputNumber'
  },
  {
    name: '结束区间计算符',
    code: 'endSectionMark',
    type: 'selectWithData',
    data: [{ text: '<', value: '<' }, { text: '<=', value: '<=' }, { text: '=', value: '=' }, { text: '>', value: '>' }, { text: '>=', value: '>=' }]
  },
  {
    name: '结束区间',
    code: 'endSection',
    type: 'inputNumber'
  },
  {
    name: '名称',
    code: 'name',
    type: 'input'
  },
  {
    name: '排序号',
    code: 'rank',
    type: 'inputNumber',
    min: 0
  }
  ];

  const buttonClick = async (type) => {
    switch (type) {
      case 'add':
        setData((value) => ({ ...value, visible: true, title: '百分比、评定等级、风险等级配置新增', type: 'add' }));
        break;
      case 'edit':
        setData((value) => ({ ...value, visible: true, title: '百分比、评定等级、风险等级配置编辑', type: 'edit' }));
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
    const data = await requestGetFrozenApi({
      ids: selectedRowKeys.toString(),
      operation: !selectRows[0].frozen,
      key: 'PrlConf'
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
        key='SUPPLIER_AUDIT_PRL_CONFIG_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
        key='SUPPLIER_AUDIT_PRL_CONFIG_EDIT'
      >编辑</Button>)
    }
    {
      /*  authAction(<Button
         onClick={() => buttonClick('delete')}
         className={styles.btn}
         ignore={DEVELOPER_ENV}
         disabled={selectRows.length === 0}
         key='SUPPLIER_AUDIT_PRL_CONFIG_DELETE'
       >删除</Button>) */
    }
    {
      authAction(<Button
        onClick={() => buttonClick('frost')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_PRL_CONFIG_FORST'
        disabled={selectRows.length === 0 || judgeButtonDisabled(selectRows)}
      >{selectRows[0]?.frozen ? '解冻' : '冻结'}</Button>)
    }
  </div>;

  const handleCancel = () => {
    setData(() => ({ visible: false }));
  }

  const handleOk = async (value) => {
    if (data.type === 'add') {
      requestPostApi({ ...value, key: 'PrlConf' }).then(res => {
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
      requestPostApi({ ...params, key: 'PrlConf' }).then(res => {
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


  return (
    <Fragment>
      <AutoSizeLayout>
        {
          (h) => <ExtTable
            rowKey={(v) => v.id}
            height={h}
            columns={columns}
            store={{
              url: `${baseUrl}/reviewPerformanceConfigure/findBySearchPage`,
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
      {data.visible &&
        <EventModal
          onCancel={handleCancel}
          onOk={handleOk}
          propData={data}
          fieldsConfig={fieldsConfig}
          data={selectRows && selectRows[0]}
        />}
    </Fragment>
  );

};

export default Form.create()(Index);
