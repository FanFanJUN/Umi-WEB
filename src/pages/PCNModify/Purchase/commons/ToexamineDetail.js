import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, ComboList, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement ,isEmpty} from '@/utils';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UploadFile from '../../../../components/Upload/index'
import {SupplierResulteList} from '../../commonProps'
import { dataTransfer2 } from '../../../supplierRegister/CommonUtils'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { create } = Form;
const FormItem = Form.Item;
const { authAction, storage } = utils;
const getToexamine = forwardRef(({
  form,
  isView,
  editData = [],
}, ref) => {
  useImperativeHandle(ref, () => ({
    form,
    getExamineform
  }));
  const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll } = form;
  const tabformRef = useRef(null)
  const [toexamine, setToexamine] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);

  const [attachId, setAttachId] = useState('')

  useEffect(() => {
    setToexamine(editData)
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
              return !isEmpty(record) && !isEmpty(record.smSupplierAuditResultStatus) ? record.smSupplierAuditResultStatus === 0 ? '通过' : '不通过' : '';
          }
          return <span>
            {
              record.smSupplierAuditStatus === 1 ? <FormItem style={{ marginBottom: 0 }}>
                {
                    getFieldDecorator(`smSupplierAuditResultStatus[${index}]`,{initialValue: record ? record.smSupplierAuditResultStatus : ''}),
                    getFieldDecorator(`smSupplierAuditResultStatusName[${index}]`, {
                        initialValue: record ? record.smSupplierAuditResultStatus : '',
                        rules: [{ required: true, message: '请选择审核结果!', whitespace: true }],
                    })( 
                        <ComboList 
                          form={form}
                          {...SupplierResulteList}
                          showSearch={false}
                          //afterSelect={afterSelect}
                          name={`smSupplierAuditResultStatusName[${index}]`}
                          field={[`smSupplierAuditResultStatus[${index}]`]}
                        />
                    )
                }
            </FormItem> : null
            }
              
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
          {
            record.smSupplierAuditStatus === 1 ?  <FormItem style={{ marginBottom: 0 }}>
              {
                getFieldDecorator(`smSupplierAuditConfirmerEnclosure[${index}]`, {
                    initialValue: record ? record.smSupplierAuditConfirmerEnclosure : '',
                    rules: [{ required: true, message: '请上传附件!'}],
                })( 
                  <UploadFile
                      title={"附件上传"}
                      entityId={record ? record.smSupplierAuditConfirmerEnclosure : null}
                      type={isView ? "show" : ""}
                  />
                )
              }
            </FormItem> : null
          }
         
        </span>
      }
    }
  ].map(_ => ({ ..._, align: 'center' }))

  // 获取表单
  function getExamineform() {
    let result = false;
    const examine = tabformRef.current.data;
    if (examine.length === 0) {
      return false;
    }else {
      form.validateFieldsAndScroll((err, values) => {
        let handledata = dataTransfer2(examine, values)
        for (let item of handledata) {
          for (let items of examine) {
            if (item.id === items.id) {
              items.smSupplierAuditConfirmerAttachments = item.smSupplierAuditConfirmerEnclosure
              items.smSupplierAuditResultStatus = item.smSupplierAuditResultStatus
            }
            
          }
        }
        if (!err) {
          toexamine.smPcnAnalysisVos = examine
          result = toexamine
        }else {
          message.error('审核结果不能为空！')
          return false;
        }
      })
    }
    return result;
  }
  

  return (
    <>
      <AutoSizeLayout>
      {
        (height) => <ExtTable
            columns={columns}
            showSearch={false}
            ref={tabformRef}
            rowKey={(item) => item.id}
            checkbox={false}
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