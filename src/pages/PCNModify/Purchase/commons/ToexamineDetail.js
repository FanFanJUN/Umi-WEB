import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement ,isEmpty} from '@/utils';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UploadFile from '../../../../components/Upload/index'
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const { authAction, storage } = utils;
const getToexamine = forwardRef(({
  form,
  isView = false,
  editData = [],
  headerInfo
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);

  const [attachId, setAttachId] = useState('')

  useEffect(() => {

  }, [editData])
  const columns = [
    {
        title: '物料分类',
        dataIndex: 'lineCode',
        align: 'center',
        width: 160
      },
      {
        title: '公司代码',
        dataIndex: 'countryName',
        align: 'center',
        width: 180,
      },
      {
        title: '公司名称',
        dataIndex: 'lineCode',
        align: 'center',
        width: 160
      },
      {
        title: '采购组织代码',
        dataIndex: 'countryName',
        align: 'center',
        width: 180,
      },
      {
        title: '采购组织名称',
        dataIndex: 'lineCode',
        align: 'center',
        width: 160
      },
      {
        title: '是否安规件',
        dataIndex: 'countryName',
        align: 'center',
        width: 180,
      },
      {
        title: '审核结果',
        dataIndex: 'countryName',
        align: 'center',
        width: 180,
      },
    {
      title: '附件资料',
      dataIndex: 'openingPermitId',
      align: 'center',
      width: 90,
      render: (value, record) => <UploadFile type="show" entityId={value}/>
    }
  ].map(_ => ({ ..._, align: 'center' }))

  

  return (
    <>
      <AutoSizeLayout>
      {
        (height) => <ExtTable
            columns={columns}
            showSearch={false}
            rowKey={(item) => item.key}
            checkbox={{
                multiSelect: false
            }}
            allowCancelSelect={true}
            size='small'
            height={height}
            remotePaging={true}
            ellipsis={false}
            saveData={false}
            selectedRowKeys={selectRowKeys}
            dataSource={dataSource}
        />
        }
      </AutoSizeLayout>
    </>
  )
}
)
const CommonForm = create()(getToexamine)

export default CommonForm