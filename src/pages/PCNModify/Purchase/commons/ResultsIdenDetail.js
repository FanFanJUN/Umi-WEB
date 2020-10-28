import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable,utils, ComboList  } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UploadFile from '../../../../components/Upload/index'
import {SupplierResulteList} from '../../commonProps'
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const FormItem = Form.Item;
const { authAction, storage } = utils;
const getResultsIden = forwardRef(({
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
      title: '是否实物认定',
      dataIndex: 'smInKindStatus',
      align: 'center',
      width: 160,
      render: function (text, record, row) {
        if (text === 0) {
            return <div>否</div>;
        } else if (text === 1) {
            return <div className="doingColor">是</div>;
        } 
      },
    },
    {
      title: '信任公司',
      dataIndex: 'smTrustCompanyCode',
      align: 'center',
      width: 180,
    },
    {
      title: '信任采购组织',
      dataIndex: 'smTrustPurchasCode',
      align: 'center',
      width: 180
    },
    {
      title: '实物认定结果',
      dataIndex: 'smInKindResultStatus',
      align: 'center',
      width: 220,
      render: (text, record, index) => {
          if (isView) {
              return record.smInKindResultStatus;
          }
          return <span>
              <FormItem style={{ marginBottom: 0 }}>
                  {
                      getFieldDecorator(`smInKindResultStatus[${index}]`, {
                          initialValue: record ? record.smInKindResultStatus : '',
                          rules: [{ required: true, message: '请选择实物认定结果!', whitespace: true }],
                      })( 
                          <ComboList 
                              form={form}
                              {...SupplierResulteList}
                              showSearch={false}
                              //afterSelect={afterSelect}
                              name={`smInKindResultStatus[${index}]`}
                          />
                      )
                  }
              </FormItem>
          </span>;
      }
    },
    {
        title: '附件资料',
        dataIndex: 'kindManEnclosure',
        align: 'center',
        width: 220,
        //render: (value, record) => <UploadFile type="show" entityId={value}/>
        render: (text, record, index) => {
          if (isView) {
            return <UploadFile type="show" entityId={text}/>
          }
          return <span>
            <FormItem style={{ marginBottom: 0 }}>
              {
                getFieldDecorator(`kindManEnclosure[${index}]`, {
                    initialValue: record ? record.kindManEnclosure : '',
                    rules: [{ required: true, message: '请选择实物认定结果!', whitespace: true }],
                })( 
                  <UploadFile
                      title={"附件上传"}
                      entityId={editData ? editData.kindManAttachments : null}
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
const CommonForm = create()(getResultsIden)

export default CommonForm