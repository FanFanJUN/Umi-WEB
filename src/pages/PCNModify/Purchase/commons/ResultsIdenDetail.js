import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, utils, ComboList, AuthALink } from 'suid';
import { Form, Button, message, } from 'antd';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UploadFile from '../../../../components/Upload/index'
import { SupplierResulteList } from '../../commonProps'
import { dataTransfer2 } from '../../../supplierRegister/CommonUtils'
import { openNewTab, isEmpty } from '../../../../utils'
import Input from 'antd/es/input';
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { create } = Form;
const FormItem = Form.Item;
const { authAction, storage } = utils;
const getResultsIden = forwardRef(({
  form,
  isView,
  editData = [],
}, ref) => {
  useImperativeHandle(ref, () => ({
    form,
    getmaterialform
  }));
  const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll } = form;
  const authorizations = storage.sessionStorage.get("Authorization");
  const tabformRef = useRef(null)
  const [cognizance, setCognizance] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);

  const [attachId, setAttachId] = useState('')

  useEffect(() => {
    setCognizance(editData)
    setDataSource(editData.smPcnAnalysisVos)
  }, [editData])
  const columns = [
    {
      title: '原厂名称',
      dataIndex: 'smOriginalFactoryName',
      align: 'center',
      width: 160
    },
    {
      title: '原厂代码',
      dataIndex: 'smOriginalFactoryCode',
      align: 'center',
      width: 160
    },
    {
      title: '物料分类',
      dataIndex: 'materielCategoryName',
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
    // {
    //   title: '信任公司',
    //   dataIndex: 'smTrustCompanyCode',
    //   align: 'center',
    //   width: 180,
    // },
    // {
    //   title: '信任采购组织',
    //   dataIndex: 'smTrustPurchasCode',
    //   align: 'center',
    //   width: 180
    // },
    // {
    //   title: '实物认定确认人',
    //   dataIndex: 'smInKindManName',
    //   align: 'center',
    //   width: 180,
    // },
    {
      title: '是否信任',
      dataIndex: 'trustOrNot',
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
      title: '实物认定结果',
      dataIndex: 'smInKindResultStatus',
      align: 'center',
      width: 160,
      render: (text, record, index) => {
        if (isView) {
          return !isEmpty(record) && !isEmpty(record.smInKindResultStatus) ? record.smInKindResultStatus === 0 ? '通过' : '不通过' : '';
        }
        return <span>
          {
            record.smInKindStatus === 1 && record.smInKindManName === authorizations.userName ? <FormItem style={{ marginBottom: 0 }}>
              {
                getFieldDecorator(`smInKindResultStatus[${index}]`, { initialValue: record ? record.smInKindResultStatus : '' }),
                getFieldDecorator(`smInKindResultStatusName[${index}]`, {
                  initialValue: record ? record.smInKindResultStatusName : '',
                  rules: [{ required: true, message: '请选择实物认定结果!', whitespace: true }],
                })(
                  <ComboList
                    form={form}
                    {...SupplierResulteList}
                    showSearch={false}
                    //afterSelect={afterSelect}
                    name={`smInKindResultStatusName[${index}]`}
                    field={[`smInKindResultStatus[${index}]`]}
                  />
                )
              }
            </FormItem> : !isEmpty(record) && !isEmpty(record.smInKindResultStatus) ? record.smInKindResultStatus === 0 ? '通过' : '不通过' : ''
          }

        </span>;
      }
    },
    {
      title: '实物认定报告',
      dataIndex: 'smPcnStrategicId',
      align: 'center',
      width: 160,
      render: function (text, record, row) {
        if (isView) {
          return <AuthALink onClick={() => handleAdmit(record)}>{record.smKindNo}</AuthALink>
        }
        <AuthALink onClick={() => handleAdmit(Othersdata.smPcnStrategicId)}>{'实物认定报告'}</AuthALink>
      },
    },
  ].map(_ => ({ ..._, align: 'center' }))
  // 获取表单
  function getmaterialform() {
    let result = false;
    const material = tabformRef.current.data;
    if (material.length === 0) {
      return false;
    } else {
      form.validateFieldsAndScroll((err, values) => {
        let handledata = dataTransfer2(material, values)
        for (let item of handledata) {
          for (let items of material) {
            if (item.id === items.id && !isEmpty(item.smInKindResultStatus)) {
              items.kindManAttachments = item.kindManEnclosure
              items.smInKindResultStatus = item.smInKindResultStatus
            }

          }
        }
        if (!err) {
          cognizance.smPcnAnalysisVos = material
          result = cognizance
        } else {
          message.error('实物认定结果不能为空！')
          return false;
        }
      })
    }
    return result;
  }
  // 实物认定计划
  function handleAdmit(val) {
    let id = val.smKindId;
    openNewTab(`material/Cognizance/ManualDetail/index?id=${id}&alone=true`, '实物认定计划明细', false)
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
const CommonForm = create()(getResultsIden)

export default CommonForm