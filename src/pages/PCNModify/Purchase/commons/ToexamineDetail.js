import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, ComboList, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement ,isEmpty} from '@/utils';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UploadFile from '../../../../components/Upload/index'
import {SupplierResulteList} from '../../commonProps'
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const FormItem = Form.Item;
const { authAction, storage } = utils;
const getToexamine = forwardRef(({
  form,
  isView,
  editData = [],
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll } = form;
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);

  const [attachId, setAttachId] = useState('')

  useEffect(() => {
    setDataSource(editData.smPcnAnalysisVos)
  }, [editData])
  const columns = [
    {
      title: '物料分类',
      dataIndex: 'materielCategoryId',
      align: 'center',
      width: 160
    },
    {
      title: '公司代码',
      dataIndex: 'companyCode',
      align: 'center',
      width: 180,
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      align: 'center',
      width: 220
    },
    {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode',
      align: 'center',
      width: 180,
    },
    {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName',
      align: 'center',
      width: 160
    },
    {
      title: '是否安规件',
      dataIndex: 'smPcnPart',
      align: 'center',
      width: 180,
      render: function (text, record, row) {
        if (text === 0) {
            return <div>否</div>;
        } else if (text === 1) {
            return <div className="doingColor">是</div>;
        } 
      },
    },
      {
        title: '审核结果',
        dataIndex: 'smSupplierAuditResultStatus',
        align: 'center',
        width: 220,
        render: (text, record, index) => {
          if (isView) {
              return record.smSupplierAuditResultStatus;
          }
          return <span>
              <FormItem style={{ marginBottom: 0 }}>
                  {
                      getFieldDecorator(`smSupplierAuditResultStatus[${index}]`, {
                          initialValue: record ? record.smSupplierAuditResultStatus : '',
                          rules: [{ required: true, message: '请选择实物认定结果!', whitespace: true }],
                      })( 
                          <ComboList 
                              form={form}
                              {...SupplierResulteList}
                              showSearch={false}
                              //afterSelect={afterSelect}
                              name={`smSupplierAuditResultStatus[${index}]`}
                          />
                      )
                  }
              </FormItem>
          </span>;
      }
      },
    {
      title: '附件资料',
      dataIndex: 'smSupplierAuditConfirmerEnclosure',
      align: 'center',
      width: 220,
      render: (text, record, index) => {
        if (isView) {
          return <UploadFile type="show" entityId={text}/>
        }
        return <span>
          <FormItem style={{ marginBottom: 0 }}>
            {
              getFieldDecorator(`smSupplierAuditConfirmerAttachments[${index}]`, {
                  initialValue: record ? record.smSupplierAuditConfirmerAttachments : '',
                  rules: [{ required: true, message: '请选择实物认定结果!', whitespace: true }],
              })( 
                <UploadFile
                    title={"附件上传"}
                    entityId={editData ? editData.smSupplierAuditConfirmerAttachments : null}
                    type={isView ? "show" : ""}
                />
              )
            }
          </FormItem>
        </span>
      }
    }
  ].map(_ => ({ ..._, align: 'center' }))

  

  return (
    <>
      <AutoSizeLayout>
      {
        (height) => <ExtTable
            columns={columns}
            showSearch={false}
            rowKey={(item) => item.id}
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