import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Row, Col, Input, DatePicker,message  } from 'antd';
import Header from '@/components/Header';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import MaterielModal from './MaterielModal'
import styles from '../index.less';
import moment from 'moment';
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const FormItem = Form.Item;
const { TextArea } = Input;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16
    },
};
const { authAction, storage } = utils;
const getExecutioninfor = forwardRef(({
  form,
  isView,
  editData = [],
  headerInfo
}, ref) => {
  useImperativeHandle(ref, () => ({
    form,
    getImplementInfo
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
  const getMatermodRef = useRef(null)
  const tabformRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [implement, setImplement] = useState([]);
  const [materiel, setMateriel] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [companyCode, setCompanyCode] = useState('');
  const [materielid, setMaterielID] = useState('');
  const [attachId, setAttachId] = useState('')
  const empty = selectRowKeys.length === 0;

  useEffect(() => {
    handleimplement(editData)
  }, [editData])
  // 
  function handleimplement(val) {
    if (val) {
      setDataSource(val.smPcnExecutInfoVo)
      setImplement(val)
      if (val.smPcnExecutInfoVo) {
        if (val.smPcnExecutInfoVo.smPcnExecutInfoDataVos) {
          let newdata = [];
          val.smPcnExecutInfoVo.smPcnExecutInfoDataVos.map((item,index) => {
            newdata.push({
              key: index,
              ...item
            })
          })
          
          setMateriel(newdata)
        }
       
      }
      if (val.smPcnAnalysisVos) {
        let newdata = []; let matid = [];
        val.smPcnAnalysisVos.map((item,index) => {
          newdata.push(item.companyCode)
          matid.push(item.materielCategoryCode)
        })
        setCompanyCode(newdata)
        setMaterielID(matid)
      }
    }
  }
  // 采购小组头部
  const headerleft = (
    <>
      {
        <AuthButton type="primary" className={styles.btn} onClick={() => showExecution()}>新增</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={empty} onClick={handDelete}>删除</AuthButton>
      }
    </>
  );
  const columns = [
    {
        title: '物料代码',
        dataIndex: 'materielTypeCode',
        align: 'center',
        width: 180
    },
    {
        title: '物料描述',
        dataIndex: 'materielTypeName',
        align: 'center',
        width: 280,
    },

    {
      title: '批次',
      dataIndex: 'batch',
      align: 'center',
      width: 240,
      render: (text, record, index) => {
          if (isView) {
              return record.batch;
          }
          return <span>
              <FormItem style={{ marginBottom: 0 }}>
                  {
                      getFieldDecorator(`batch[${index}]`, {
                          initialValue: record ? record.batch : '',
                      })( 
                          <Input 
                            placeholder='请输入批次'
                            onBlur={onInput(record, index)}
                          /> 
                      )
                  }
              </FormItem>
          </span>;
      }
    }
  ].map(_ => ({ ..._, align: 'center' }))
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
  }
  // 物料新增
  function showExecution() {
    getMatermodRef.current.handleModalVisible(true);
  }
  // 物料删除
  function handDelete() {
    const filterData = materiel.filter(item => item.key !== selectedRows[0].key);
    setMateriel(filterData)
  }
  function handleMateriel(val) {
    let newdata = [];
    val.map( (item,index)=> {
      newdata.push({
        key: index,
        materielTypeCode: item.materialCode,
        materielTypeName: item.materialDesc,
      })
    })
    setMateriel(newdata)
  }
  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }
  function onInput(data, index) {
    return (e) => {
      const tablereflist = tabformRef.current.data;
      const selectData = tablereflist.slice(0)
      selectData[index] = data;
      selectData[index].batch = e.target.value;
    }
  }
  // 获取表单参数
  function getImplementInfo() {
    let result = false;
    const tabledata = tabformRef.current.data;
    form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            delete values.batch
            values.executDate = moment(values.resultEnclosure).format('YYYY-MM-DD HH:mm:ss')
            implement.smPcnExecutInfoVo = {...implement.smPcnExecutInfoVo, ...values}
            implement.smPcnExecutInfoVo.smPcnExecutInfoDataVos = tabledata
            result = implement
            
        }else {
          message.error('请将执行信息填写完全！')
        }
    })
    return result;
  }
  return (
    <>
        <Row style={{paddingTop:50}}>
            <Col span={16}>
                <FormItem {...formLayout} label="PCN变更执行日期">
                    {
                      isView ? <span>{dataSource ? dataSource.executDate : ''}</span> :
                      getFieldDecorator('executDate', {
                        initialValue: dataSource ? dataSource.executDate : '',
                        rules: [
                            {
                                required: true,
                                message: '请选择PCN变更执行日期',
                            },
                        ],
                      })(
                          <DatePicker 
                            format="YYYY-MM-DD"
                            disabledDate={disabledDate}
                            disabled={isView}
                            style={{ width: '100%' }}
                          />
                      )
                    }
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span={16}>
                <FormItem {...formLayout} label="备注">
                    {
                      isView ? <span>{dataSource ? dataSource.remark : ''}</span> :
                      getFieldDecorator('remark', {
                        initialValue: dataSource ? dataSource.remark : '',
                      })(
                          <TextArea  disabled={isView}/>
                      )
                    }
                </FormItem>
            </Col>
        </Row>
        <Header  style={{ display: headerInfo === true ? 'none' : 'block',color: 'red' }}
            left={ headerInfo ? '' : headerleft}
            advanced={false}
            extra={false}
        />
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
            dataSource={materiel}
        />
        }
      </AutoSizeLayout>
      <MaterielModal
        companyCode={companyCode} 
        materselect={handleMateriel}
        implement={true}
        materielCategoryCode={materielid}
        wrappedComponentRef={getMatermodRef} 
        plement={true}
      />
    </>
  )
}
)
const CommonForm = create()(getExecutioninfor)

export default CommonForm