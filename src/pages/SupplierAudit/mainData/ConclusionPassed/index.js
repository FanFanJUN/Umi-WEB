/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-12 14:44:24
 * @LastEditTime: 2020-10-13 09:45:55
 * @Description: 结论及是否通过
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/mainData/ConclusionPassed/index.js
 */
import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal } from 'antd';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../../utils/commonUrl';
import { ExtTable, utils } from 'suid';
import {
  AddBUCompanyOrganizationRelation, DeleteBUCompanyOrganizationRelation, FrostBUCompanyOrganizationRelation, judgeButtonDisabled,
} from '../../../QualitySynergy/commonProps';
import { AutoSizeLayout } from '../../../../components';
import EventModal from '../../common/EventModal';

const { authAction } = utils;

const DEVELOPER_ENV = process.env.NODE_ENV === 'development';

const Index = () => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    visible: false,
    title: '结论新增',
    type: 'add',
  });

  const [selectRows, setSelectRows] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: '结论代码', dataIndex: 'buCode', width: 200 },
    { title: '结论名称', dataIndex: 'buName', ellipsis: true },
    {
      title: '是否通过', dataIndex: 'buName', ellipsis: true, render: function (text, context) {
        return text ? '是' : '否';
      }
    },
    { title: '排序号', dataIndex: 'orderNo', ellipsis: true },
    { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (value) => value ? '是' : '否' },
  ].map(item => ({ ...item, align: 'center' }));

  const fieldsConfig = [
    { name: '结论代码', code: 'buCode', width: 200 },
    { name: '结论名称', code: 'buName' },
    { name: '是否通过', code: 'orderNo', type: 'selectWithData', data: [{ text: '是', value: true }, { text: '否', value: false }] },
    { name: '评价指标名称', code: 'orderXx' },
  ];

  const buttonClick = async (type) => {
    switch (type) {
      case 'add':
        setData((value) => ({ ...value, visible: true, title: '结论新增', type: 'add' }));
        break;
      case 'edit':
        setData((value) => ({ ...value, visible: true, title: '结论编辑', type: 'edit' }));
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
    const data = await FrostBUCompanyOrganizationRelation({
      ids: selectedRowKeys.toString(),
      frozen: !selectRows[0]?.frozen,
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
        key='QUALITYSYNERGY_BUCOR_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
        key='QUALITYSYNERGY_BUCOR_EDIT'
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={selectRows.length === 0}
        key='QUALITYSYNERGY_BUCOR_DELETE'
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('frost')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_BUCOR_FORST'
        disabled={selectRows.length === 0 || judgeButtonDisabled(selectRows)}
      >{selectRows[0]?.frozen ? '解冻' : '冻结'}</Button>)
    }
  </div>;

  const handleCancel = () => {
    setData(() => ({ visible: false }));
  }

  const handleOk = async (value) => {
    if (data.type === 'add') {
      AddBUCompanyOrganizationRelation(value).then(res => {
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
      AddBUCompanyOrganizationRelation(params).then(res => {
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
              url: `${baseUrl}/buCompanyPurchasingOrganization/findByPage`,
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