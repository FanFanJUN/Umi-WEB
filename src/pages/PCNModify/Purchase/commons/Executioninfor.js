import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Row, Col, Input, DatePicker  } from 'antd';
import Header from '@/components/Header';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import MaterielModal from '../../Supplier/commons/MaterielModal'
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
  headerInfo,
  materielid
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
  const getMatermodRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [attachId, setAttachId] = useState('')
  const empty = selectRowKeys.length === 0;
  useEffect(() => {

  }, [editData])
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
              return record.smPcnPartName;
          }
          return <span>
              <FormItem style={{ marginBottom: 0 }}>
                  {
                      getFieldDecorator(`batch[${index}]`, {
                          initialValue: record ? record.smPcnPartName : '',
                      })( 
                          <Input /> 
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
    const filterData = dataSource.filter(item => item.key !== selectedRows[0].key);
    setDataSource(filterData)
  }
  function handleMateriel(val) {
    let newdata = [];
    val.map( (item,index)=> {
      newdata.push({
        key: index,
        materielTypeCode: item.materialCode,
        materielTypeName: item.materialDesc
      })
    })
    setDataSource(newdata)
  }
  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }
  return (
    <>
        <Row style={{paddingTop:50}}>
            <Col span={16}>
                <FormItem {...formLayout} label="PCN变更执行日期">
                    {getFieldDecorator('executDate', {
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
                    )}
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span={16}>
                <FormItem {...formLayout} label="备注">
                    {getFieldDecorator('remark', {
                    })(
                        <TextArea  disabled={isView}/>
                    )}
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
        />
        }
      </AutoSizeLayout>
      <MaterielModal 
        materselect={handleMateriel}
        implement={true}
        materielCategoryCode={materielid}
        wrappedComponentRef={getMatermodRef} 
      />
    </>
  )
}
)
const CommonForm = create()(getExecutioninfor)

export default CommonForm