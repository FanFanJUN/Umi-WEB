import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, AuthButton } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UploadFile from '../../../../components/Upload/index'


const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { create } = Form;
const { authAction, storage } = utils;
let keys = 1;
const TaskhistoryRef = forwardRef(({
  form,
  editformData = [],
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const tabformRef = useRef(null)
  const ModifyfromRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    hanldModify(editformData.samIdentifyPlanImplementationDetailsVos)
  }, [editformData])

  const columns = [
    {
      title: '是否通过',
      dataIndex: 'passStatus',
      align: 'center',
      width: 140,
      render: function (text, record, row) {
        if (text === 0) {
          return <div>不通过</div>;
        } else if (text === 1) {
          return <div className="successColor">通过</div>;
        } else {
          return ''
        }
      },
    },
    {
      title: '是否整改',
      dataIndex: 'rectificationStatus',
      align: 'center',
      width: 140,
      render: function (text, record, row) {
        if (text === 0) {
          return <div>否</div>;
        } else if (text === 1) {
          return <div className="successColor">是</div>;
        } else {
          return ''
        }
      },
    },
    {
      title: '本次任务完成日期',
      dataIndex: 'completionDate',
      align: 'center',
      width: 220,
    },
    {
      title: '经办人',
      align: 'center',
      dataIndex: 'agentMan',
      width: 160,
    },
    {
      title: '执行责任人',
      align: 'center',
      dataIndex: 'executionMan',
      width: 160,
    },
    {
      title: '过程说明',
      align: 'center',
      dataIndex: 'processDescription',
      width: 220,
    },
    {
      title: '附件',
      dataIndex: 'enclosureId',
      align: 'center',
      width: 90,
      render: (value, record) => <UploadFile type="show" entityId={value} />
    }
  ].map(_ => ({ ..._, align: 'center' }))
  const empty = selectRowKeys.length === 0;
  //变更类型
  //const contype = isEmpty(modifytype);
  // 编辑处理数据
  function hanldModify(val) {
    if (val) {
      keys++;
      let newsdata = [];
      val.map((item, index) => {
        newsdata.push({
          ...item,
          key: keys++
        })
        setDataSource(newsdata);
      })
    }
  }
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);

  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([]);
    setRows([]);
  }

  return (
    <>
      <AutoSizeLayout>
        {
          (height) => <ExtTable
            columns={columns}
            showSearch={false}
            ref={tabformRef}
            rowKey={(item) => item.key}
            checkbox={{
              multiSelect: false
            }}
            pagination={{
              hideOnSinglePage: true,
              disabled: false,
              pageSize: 100,
            }}
            allowCancelSelect={true}
            size='small'
            height={height}
            remotePaging={true}
            ellipsis={false}
            saveData={false}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectRowKeys}
            dataSource={dataSource}
          //{...dataSource}
          />
        }
      </AutoSizeLayout>
    </>
  )
}
)
const CommonForm = create()(TaskhistoryRef)

export default CommonForm