import { useImperativeHandle, forwardRef, useState, useRef } from 'react';
import { Form, Row, Col, Input, Button, Modal, message } from 'antd';
import { ComboList, ExtTable, ExtModal, ComboTree } from 'suid';
import { commonProps, getUserName } from '../../../utils';
import { Header, ComboAttachment } from '../../../components';
import styles from './index.less';
import moment from 'moment';
const { supplierProps, orgnazationProps, currencyProps, paymentProps, dictProps } = commonProps;
const { create, Item: FormItem } = Form;
const { TextArea } = Input;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const initalModalProps = {
  visible: false,
  selectedKeys: [],
  selectedRows: []
}
const FormRef = forwardRef(({ form, type = 'create' }, ref) => {
  useImperativeHandle(ref, () => ({
    getAllParams,
    setHeaderFields,
    setLineDataSource
  }))
  const modalTableRef = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [modalProps, setModalProps] = useState(initalModalProps);
  const [attachment, setAttachment] = useState(null);
  const {
    getFieldDecorator,
    getFieldValue,
    setFieldsValue,
    validateFieldsAndScroll
  } = form;
  // 按钮禁用
  const empty = selectedRowKeys.length === 0;
  const supplierSelect = getFieldValue('supplierId');
  const modalTableProps = {
    store: {
      url: '/srm-sm-web/api/supplierFinanceView/findListBySupplierId',
      params: {
        supplierId: supplierSelect
      }
    },
    fixedHeader: true
  }
  const orgColumns = [
    {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode',
      width: 120,
    },
    {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName',
    },
    {
      title: '公司代码',
      dataIndex: 'corporationCode'
    },
    {
      title: '公司名称',
      dataIndex: 'corporationName'
    },
    {
      title: '付款条件',
      dataIndex: 'payCodition'
    },
    {
      title: '付款条件描述',
      dataIndex: 'payCoditionName'
    },
    {
      title: '方案组',
      dataIndex: 'schemeGroupName'
    },
    {
      title: '币种代码',
      dataIndex: 'currencyCode'
    },
    {
      title: '币种名称',
      dataIndex: 'currencyName'
    }
  ].map(item => ({ ...item, align: 'center' }));
  const columns = [
    {
      title: '公司代码',
      dataIndex: 'corporationCode'
    }, {
      title: '公司名称',
      dataIndex: 'corporationName'
    }, {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode'
    }, {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName'
    }, {
      title: '付款条件',
      dataIndex: 'payCodition',
      render(text, _, index) {
        return <ComboList {...paymentProps} value={text} afterSelect={(item) => handleEditorPaymentLineData(item, index)} />
      }
    }, {
      title: '付款条件描述',
      dataIndex: 'payCoditionName'
    }, {
      title: '方案组',
      dataIndex: 'schemeGroupName',
      render(text, _, index) {
        return <ComboList {...dictProps} value={text} afterSelect={(item) => handleEditorSchemeLineData(item, index)} />
      }
    }, {
      title: '币种代码',
      dataIndex: 'currencyCode',
      render(text, _, index) {
        return <ComboList {...currencyProps} value={text} afterSelect={(item) => handleEditorCurrencyLineData(item, index)} />
      }
    }, {
      title: '币种名称',
      dataIndex: 'currencyName'
    }
  ].map(item => ({ ...item, align: 'center' }));
  // 验证并处理返回行数据
  const getDatasource = () => new Promise((resolve, reject) => {
    const isEmpty = dataSource.length === 0;
    if (isEmpty) {
      message.error('要变更的会计视图不能为空');
      reject()
      return
    }
    if (type === 'create') {
      const formatDataSource = dataSource.map(item => ({
        ...item,
        supplierFinanceViewId: item.id
      }))
      resolve(formatDataSource)
      return
    }
    resolve(dataSource)
  })

  // 获取所有表单参数
  const getAllParams = async () => {
    const fields = await validateFieldsAndScroll();
    const { files } = fields;
    const dataSource = await getDatasource();
    return {
      headerFields: {
        ...fields,
        attachmentIds: !!files ? files.map(item => item?.id) : []
      },
      dataSource
    }
  }
  // 设置所有表格参数
  const setHeaderFields = (fields) => {
    const { attachmentId = null, ...fs } = fields;
    setAttachment(attachmentId)
    setFieldsValue(fs)
  }
  // 提供设置行数据接口
  const setLineDataSource = (ds) => {
    setDataSource(ds)
  }
  // 记录弹窗选中项
  const handleModalSelectedRows = (ks, rowItems) => {
    if(ks.length !== rowItems.length) {
      // const its = dataSource
      modalTableRef.current.manualSelectedRows(ks)
    }
    setModalProps({
      ...modalProps,
      selectedKeys: ks,
      selectedRows: rowItems
    })
  }
  // 弹窗选中后点击确定
  const handleModalClickConfirm = () => {
    setDataSource(modalProps.selectedRows)
    hideModal()
  }
  // 显示新增弹窗
  const showModal = () => {
    const ks = dataSource.map(item => `${item.corporationCode}-${item.purchaseOrgCode}`);
    setModalProps({
      ...modalProps,
      selectedKeys: ks,
      selectedRows: dataSource,
      visible: true
    })
  }
  // 隐藏新增弹窗
  const hideModal = () => {
    setModalProps({
      ...modalProps,
      visible: false
    })
  }
  // 处理行数据币种变更
  const handleEditorCurrencyLineData = (item, index) => {
    const newData = dataSource.map((d, k) => {
      if (k === index) {
        return {
          ...d,
          currencyCode: item.code,
          currencyName: item.name
        }
      }
      return d
    })
    setDataSource(newData)
  }
  // 处理行数据方案组变更
  const handleEditorSchemeLineData = (item, index) => {
    const newData = dataSource.map((d, k) => {
      if (k === index) {
        return {
          ...d,
          schemeGroupName: item.name,
          schemeGroupCode: item.value
        }
      }
      return d
    })
    setDataSource(newData)
  }
  // 处理行数据付款条件变更
  const handleEditorPaymentLineData = (item, index) => {
    const newData = dataSource.map((d, k) => {
      if (k === index) {
        return {
          ...d,
          payCodition: item.code,
          payCoditionName: item.name
        }
      }
      return d
    })
    setDataSource(newData)
  }
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
  }
  // 删除选中项
  function handleRemoveSelectedRow() {
    const [key] = selectedRowKeys;
    const nds = dataSource.filter(item => item.id !== key)
    setDataSource(nds)
    cleanSelectedRecord()
  }
  return (
    <div className={styles.wrapper}>
      <Form>
        <Row>
          <Col span={12}>
            <FormItem label='供应商代码' {...formLayout}>
              {
                getFieldDecorator('supplierId'),
                getFieldDecorator('supplierCode', {
                  rules: [
                    {
                      required: true,
                      message: '请选择供应商代码'
                    }
                  ]
                })(
                  <ComboList form={form} {...supplierProps} name='supplierCode' field={['supplierName', 'supplierId']} afterSelect={() => {
                    if (dataSource.length > 0) {
                      Modal.confirm({
                        title: '供应商变更',
                        content: '供应商变更将清空已新增采购会计视图，确定要变更供应商并清除已新增采购会计视图吗？',
                        okText: '变更并清空',
                        cancelText: '取消变更',
                        onOk: () => {
                          setModalProps(initalModalProps);
                          setDataSource([])
                        }
                      })
                    }
                  }} />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='供应商名称' {...formLayout}>
              {
                getFieldDecorator('supplierName')(<Input disabled />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='申请日期' {...formLayout}>
              {
                getFieldDecorator('dateTime', {
                  initialValue: moment().format('YYYY-MM-DD')
                })(<Input disabled />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='申请人' {...formLayout}>
              {
                getFieldDecorator('username', {
                  initialValue: getUserName()
                })(<Input disabled />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='申请部门' {...formLayout}>
              {
                getFieldDecorator('orgCode'),
                getFieldDecorator('orgName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择申请部门'
                    }
                  ]
                })(<ComboTree form={form} {...orgnazationProps} name='orgName' field={['orgCode']} />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='变更资料' {...formLayout}>
              {
                getFieldDecorator('files')(<ComboAttachment uploadButton={{
                  disabled: type === 'detail'
                }} allowDelete={type !== 'detail'}
                  showViewType={type !== 'detail'} customBatchDownloadFileName={true} attachment={attachment} />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='变更说明' {...formLayout}>
              {
                getFieldDecorator('reason', {
                  rules: [
                    {
                      required: true,
                      message: '请填写变更说明'
                    }
                  ]
                })(<TextArea rows={6} maxLength={500} />)
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div>
        <Header left={
          <>
            <Button className={styles.btn} onClick={showModal} type='primary' disabled={!supplierSelect}>新增</Button>
            <Button className={styles.btn} disabled={empty} onClick={handleRemoveSelectedRow}>删除</Button>
          </>
        } />
        <ExtTable
          columns={columns}
          dataSource={dataSource}
          showSearch={false}
          checkbox={{ multiSelect: false }}
          rowKey={item => `${item.corporationCode}-${item.purchaseOrgCode}`}
          size='small'
          allowCancelSelect
          selectedRowKeys={selectedRowKeys}
          onSelectRow={handleSelectedRows}
        />
      </div>
      <ExtModal
        // destroyOnClose
        title='选择采购组织'
        onCancel={hideModal}
        visible={modalProps.visible}
        width={'80vw'}
        centered
        onOk={handleModalClickConfirm}
      >
        <ExtTable
          size='small'
          bordered
          columns={orgColumns}
          ref={modalTableRef}
          {...modalTableProps}
          rowKey={item => `${item.corporationCode}-${item.purchaseOrgCode}`}
          selectedRowKeys={modalProps.selectedKeys}
          onSelectRow={handleModalSelectedRows}
          checkbox={{ multiSelect: true }}
        />
      </ExtModal>
    </div>
  )
})

const CommonForm = create()(FormRef)

export default CommonForm;