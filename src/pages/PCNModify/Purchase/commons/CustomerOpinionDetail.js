import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, ComboList, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UploadFile from '../../../../components/Upload/index'
import {SupplierResulteList} from '../../commonProps'
import { dataTransfer2 } from '../../../supplierRegister/CommonUtils'
import {isEmpty} from '../../../../utils'
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const FormItem = Form.Item;
const { authAction, storage } = utils;
const getCustomerOpin = forwardRef(({
  form,
  isView,
  editData = [],
}, ref) => {
  useImperativeHandle(ref, () => ({
    form,
    getCustomerform
  }));
  const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll } = form;
  const tabformRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);

  const [attachId, setAttachId] = useState('')

  useEffect(() => {
    setCustomer(editData)
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
        title: '客户意见',
        dataIndex: 'smCustomerResultConfirm',
        align: 'center',
        width: 220,
        render: (text, record, index) => {
          if (isView) {
              return !isEmpty(record) && !isEmpty(record.smCustomerResultConfirm) ? record.smCustomerResultConfirm === 0 ? '通过' : '不通过' : '';
          }
          return <span>
              <FormItem style={{ marginBottom: 0 }}>
                  {
                      getFieldDecorator(`smCustomerResultConfirm[${index}]`,{initialValue: record ? record.smCustomerResultConfirm : ''}),
                      getFieldDecorator(`smCustomerResultConfirmName[${index}]`, {
                          initialValue: record ? record.smCustomerResultConfirmName : '',
                          rules: [{ required: true, message: '请选择客户结果!', whitespace: true }],
                      })( 
                        <ComboList 
                            form={form}
                            {...SupplierResulteList}
                            showSearch={false}
                            //afterSelect={afterSelect}
                            name={`smCustomerResultConfirmName[${index}]`}
                            field={[`smCustomerResultConfirm[${index}]`]}
                        />
                      )
                  }
              </FormItem>
          </span>;
      }
    },
    {
      title: '附件资料',
      dataIndex: 'customerEnclosure',
      align: 'center',
      width: 220,
      render: (text, record, index) => {
        if (isView) {
          return <UploadFile type="show" entityId={text}/>
        }
        return <span>
          <FormItem style={{ marginBottom: 0 }}>
            {
              getFieldDecorator(`customerEnclosure[${index}]`, {
                  initialValue: record ? record.customerEnclosure : '',
                  rules: [{ required: true, message: '请上传附件!'}],
              })( 
                <UploadFile
                    title={"附件上传"}
                    entityId={record ? record.customerEnclosure : null}
                    type={isView ? "show" : ""}
                />
              )
            }
          </FormItem>
        </span>
      }
    }
  ].map(_ => ({ ..._, align: 'center' }))

  // 获取表单
  function getCustomerform() {
    let result = false;
    const material = tabformRef.current.data;
    if (material.length === 0) {
      return false;
    }else {
      form.validateFieldsAndScroll((err, values) => {
        let handledata = dataTransfer2(material, values)
        handledata.forEach((item,index) => {
          material.forEach((items,ins)=> {
            items.customerAttachments = item.customerEnclosure
            items.smCustomerResultConfirm = item.smCustomerResultConfirm
          })
          
        })
        if (!err) {
          customer.smPcnAnalysisVos = material
          result = customer
        }else {
          message.error('客户意见不能为空！')
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
const CommonForm = create()(getCustomerOpin)

export default CommonForm