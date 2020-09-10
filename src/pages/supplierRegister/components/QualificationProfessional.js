import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Icon, Input, Col, message, Radio, Button } from 'antd';
import { utils, ExtTable, ComboList } from 'suid';
import moment from 'moment';
import { AddButtonWrapper } from './style'
import { compareData, getLineCode,checkDateWithYearAdd } from '@/utils/index'
import RangeDatePicker from './RangeDatePicker'
// import {ComboAttachment } from '@/components';
import UploadFile from '../../../components/UploadFile';
import {dataTransfer} from '../CommonUtils'
const { create } = Form;
const FormItem = Form.Item;

const QualispecialRef = forwardRef(({
    form,
    initialValue = {},
    isView = false,
    isOverseas = null
}, ref) => {
    useImperativeHandle(ref, () => ({
        getspecialpurpose,
        purposeTemporary,
        setHeaderFields,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configure, setConfigure] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [keys, setKey] = useState(-1);
    const [lineCode, setLineCode] = useState(1);
    const { attachment = null } = initialValue;

    useEffect(() => {
        // let initData = [{ keyId: keys, lineCode: getLineCode(lineCode) }];
        // setLineCode(lineCode + 1);
        // setDataSource(initData)
    }, [])

    const tableProps = [
        {
            title: '操作',
            align: 'center',
            width: 100,
            render: (text, record, index) => {
              return <div>
                {
                  dataSource.length > 1 ? <Icon
                    type={'delete'}
                    title={'删除'}
                    onClick={() => handleDelete(record.keyId)}
                  /> : null
                }
              </div>;
            }
        },
        {
            title: '行号',
            dataIndex: 'lineCode',
            align: 'center',
            width: 80
          },
          {
            title: "资质文件类型",
            dataIndex: "qualificationType_p",
            width: 200,
            render: (text, record, index) => {
              if (isView) {
                return text;
              }
              if (isView) {
                return !compareData(record.endDate) ?
                  <span style={{color: "red"}}>{'专用资质'}</span>
                  : <span>{'专用资质'}</span>
              }
              return <FormItem style={{ marginBottom: 0 }}>
                {
                  getFieldDecorator(`qualificationType_p[${record.key}]`, {
                    initialValue: "专用资质",
                  })(
                    !compareData(record.endDate) ? <Input
                      style={{color: "red"}}
                      name={record.key} disabled={true}
                    /> : <Input name={record.key} disabled={true}
                    />
                  )
                }
              </FormItem>
            }
    
          },
          {
            title: "资质文件名称",
            dataIndex: "qualificationName_p",
            width: 200,
            render: (text, record, index) => {
              if (isView) {
                return text;
              }
              if (isView) {
                return !compareData(record.endDate) ?
                  <span style={{color: "red"}}>{record.qualificationName}</span>
                  : <span>{record.qualificationName}</span>
              }
              return <FormItem style={{ marginBottom: 0 }}>
                {
                  getFieldDecorator(`qualificationName_p[${record.key}]`, {
                    initialValue: record.qualificationName,
                    rules: [{required: true, message: '请输入资质文件名称!'}]
                  })(
                    !compareData(record.endDate) ? <Input
                        style={{color: "red"}}
                        placeholder={"请输入资质文件名称"} name={record.key}
                        onBlur={setQualificationName}/>
                      : <Input
                        placeholder={"请输入资质文件名称"} name={record.key}
                        onBlur={setQualificationName}/>)}
              </FormItem>
            }
          },
          {
            title: "证书编号",
            dataIndex: "certificateNo_p",
            width: 260,
            render: (text, record, index) => {
              if (isView) {
                return record.certificateNo;
              }
              return <FormItem style={{ marginBottom: 0 }}>
                {
                  getFieldDecorator(`certificateNo_p[${record.key}]`, {
                    initialValue: record.certificateNo,
                    rules: [{required: true, message: '请输入证书编号!'}]
                  })(
                    <Input placeholder={"请输入认证机构，若没有，则填写无"}/>
                  )}
              </FormItem>
            }
          },
          {
            title: "认证机构",
            dataIndex: "institution_p",
            width: 260,
            render: (text, record, index) => {
              if (isView) {
                return record.institution;
              }
              return <FormItem style={{ marginBottom: 0 }}>
                {
                  getFieldDecorator(`institution_p[${record.key}]`, {
                    initialValue: record.institution,
                    rules: [{required: true, message: '请输入认证机构!'}]
                  })(
                    <Input placeholder={"请输入认证机构，若没有，则填写无"}/>
                  )}
              </FormItem>
            }
          },
          {
            title: "有效期",
            dataIndex: "date_p",
            width: 300,
            align: "center",
            render: (text, record, index) => {
              if (isView) {
                return <span>{record.startDate + '~' + record.endDate}</span>;
              }
              return <FormItem style={{ marginBottom: 0 }}>
                {
                  getFieldDecorator(`date_p[${record.key}]`, {
                    initialValue: record.startDate ? {
                      startDate: moment(record.startDate),
                      endDate: moment(record.endDate)
                    } : "",
                    rules: [{required: true, type: "object", message: "请设置有效期"},
                      {validator: checkDateWithYearAdd}]
                  })(
                    <RangeDatePicker type="currentTime"/>
                  )}
              </FormItem>
            }
          },
          {
            title: "附件",
            dataIndex: "attachments_p",
            align: "center",
            width: 300,
            render: (text, record, index) => {
              return <FormItem style={{textAlign: "left",marginBottom: 0}}>
                {
                  getFieldDecorator(`attachments_p[${record.key}]`, {
                    initialValue: "",
                    rules: [{required: true, message: '请选择附件!'}]
                  })(
                    <UploadFile
                      title={"附件上传"}
                      maxSize={10}
                      type={isView ? "show" : ""}
                      entityId={record.id || null}
                      accessType={['pdf', 'jpg', 'png']}
                      warning={'仅支持pdf,jpg,png格式，文件大小不超过10M'}
                    />
                    // <ComboAttachment />
                  )}
              </FormItem>
            }
          },
    ].map(item => ({ ...item, align: 'center' }))
    // 新增
    function handleAdd() {
        const newData = [...dataSource, {key: setKey(keys + 1), lineCode: getLineCode(lineCode)}];
        setLineCode(lineCode + 1)
        setDataSource(newData)
    };
    //删除
    function handleDelete(key) {
        //const { dataSource } = this.state;
        const newData = dataSource.filter((item) => item.keyId !== key);
        setLineCode(lineCode - 1);
        for (let i = 0; i < newData.length; i++) {
            newData[i].lineCode = getLineCode(i + 1);
        }
        setDataSource(newData)
    };
    //校验名称
    function setQualificationName(e) {
        for (let i = 0; i <= this.keys; i++) {
            let key = `qualificationName_p[${i}]`;
            if (form.getFieldValue(key) === e.target.value && i !== parseInt(e.target.name)) {
              message.error("与现有的资质文件名称重复，请重新填入！");
              let changeKeyName = `qualificationName_p[${e.target.name}]`;
              form.setFieldsValue({[changeKeyName]: ""});
              return;
            }
          }
    }
    function purposeTemporary() {
      let result = {};
      form.validateFieldsAndScroll((err, values) => {
        if (values) {
          result = dataTransfer(dataSource, values, -1);
        }
      });
      console.log(result)
      return result;
    }
    // 获取表单值
    function getspecialpurpose() {
      let result = false;
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          result = dataTransfer(dataSource, values, -1);
        }
      });
      return result;
    }
    // 设置所有表格参数
	const setHeaderFields = (fields) => {
		//const { attachmentId = null, ...fs } = fields;
		// setAttachment(attachmentId)
		// setFieldsValue(fs)
	  }
    return (
        <div>
            <div>
                <div>
                    <ExtTable
                        allowCancelSelect
                        columns={tableProps}
                        dataSource={dataSource}
                        showSearch={false}
                        pagination={{
                            hideOnSinglePage: true,
                            disabled: false,
                            pageSize: 100,
                        }}
                        checkbox={false}
                        rowKey={(item) => `row-${item.id}`}
                    />
                    <AddButtonWrapper>
                        <Button hidden={isView} icon={'plus'} type="dashed" style={{ width: '50%',marginBottom:'10px' }}
                            onClick={handleAdd}>新增</Button>
                    </AddButtonWrapper>
                </div>
            </div>
        </div>
    )
}
)
const CommonForm = create()(QualispecialRef)

export default CommonForm