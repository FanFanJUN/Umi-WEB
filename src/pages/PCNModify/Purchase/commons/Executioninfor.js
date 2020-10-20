import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Row, Col, Input, Modal } from 'antd';
import Header from '@/components/Header';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import MaterielModal from '../../Supplier/commons/MaterielModal'
import styles from '../index.less';
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
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
  const getMatermodRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
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
        dataIndex: 'lineCode',
        align: 'center',
        width: 160
    },
    {
        title: '物料描述',
        dataIndex: 'countryName',
        align: 'center',
        width: 180,
    },
    {
        title: '批次',
        dataIndex: 'countryName',
        align: 'center',
        width: 180,
    }
  ].map(_ => ({ ..._, align: 'center' }))

  function showExecution() {
    getMatermodRef.current.handleModalVisible(true);
  }
  function handDelete() {

  }
  return (
    <>
        <Row>
            <Col span={10}>
                <FormItem {...formLayout} label="PCN变更执行日期">
                    {getFieldDecorator('smFieldCode', {
                        rules: [
                            {
                                required: true,
                                message: '请输入PCN变更执行日期',
                            },
                        ],
                    })(
                        <Input disabled={isView} />
                    )}
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span={10}>
                <FormItem {...formLayout} label="备注">
                    {getFieldDecorator('smFieldCode', {
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
      <MaterielModal 
        wrappedComponentRef={getMatermodRef}></MaterielModal>
    </>
  )
}
)
const CommonForm = create()(getExecutioninfor)

export default CommonForm