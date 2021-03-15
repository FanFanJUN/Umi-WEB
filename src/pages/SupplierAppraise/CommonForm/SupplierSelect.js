import { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { ExtTable, ExtModal, ComboList, ComboTree } from 'suid';
import { Form, Row, Col, Button } from 'antd';
import { useTableProps } from '../../../utils/hooks';
import { smBaseUrl } from '../../../utils/commonUrl';
import { supplierPropsForName, materialClassProps, businessMainProps } from '../../../utils/commonProps';

const { Item: FormItem } = Form;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  }
};
const columns = [
  {
    title: '供应商代码',
    dataIndex: 'supplierCode'
  },
  {
    title: '供应商名称',
    dataIndex: 'supplier.name'
  },
  {
    title: '原厂代码',
    dataIndex: 'originSupplierCode'
  },
  {
    title: '原厂名称',
    dataIndex: 'originSupplierName'
  },
  {
    title: '物料分类代码',
    dataIndex: 'materielCategory.code'
  },
  {
    title: '物料分类名称',
    dataIndex: 'materielCategory.name'
  },
  {
    title: '业务单元代码',
    dataIndex: 'buCode'
  },
  {
    title: '业务单元名称',
    dataIndex: 'buName'
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
    title: '采购组织代码',
    dataIndex: 'purchaseOrg.code'
  },
  {
    title: '采购组织名称',
    dataIndex: 'purchaseOrg.name'
  }
]
const ForWard = forwardRef(((props, ref) => {
  useImperativeHandle(ref, () => ({
    showModal,
    hideModal
  }))
  const tableRef = useRef(null)
  const [visible, toggleVisible] = useState(false);
  const [tbs, setTbs] = useTableProps();
  const {
    selectedRows,
    selectedRowKeys,
    searchValue,
  } = tbs;
  const {
    handleSelectedRows,
    setSearchValue,
    setRowKeys
  } = setTbs;
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    tableRef.current.manualSelectedRows([])
  }
  const {
    onOk = () => null,
    startTime,
    endTime,
    form,
    buCode,
    bgCode,
    level = 'BG'
  } = props;
  const { getFieldDecorator, getFieldsValue, resetFields } = form;
  const { buCode: buc } = getFieldsValue()
  const tableProps = {
    store: {
      url: `${smBaseUrl}/api/supplierSupplyListExtService/findByValidDate`,
      params: {
        startDate: startTime,
        endDate: endTime,
        ...searchValue,
        bgCode,
        buCode: level === 'BG' ? buc : buCode
      },
      type: 'post'
    },
    showSearch: false,
  }
  async function handleOk() {
    hideModal()
    cleanSelectedRecord()
    onOk(selectedRowKeys, selectedRows)
  }
  function showModal() {
    toggleVisible(true)
  }
  async function hideModal() {
    toggleVisible(false)
    setSearchValue({})
    await resetFields()
  }
  async function handleSearch() {
    const { buCode, materialCategoryCode, supplierCode } = getFieldsValue();
    await setSearchValue({
      buCode,
      materialCategoryCode,
      supplierCode
    })
    await tableRef.current.remoteDataRefresh()
  }
  return (
    <ExtModal
      visible={visible}
      okText="确定"
      cancelText='取消'
      onOk={handleOk}
      onCancel={hideModal}
      width={'90vw'}
      title='新增合格供应商数据'
      destroyOnClose
    >
      <Form {...formLayout}>
        <Row>
          <Col span={7}>
            <FormItem label='供应商'>
              {
                getFieldDecorator(['supplierCode']),
                getFieldDecorator('supplierName')(
                  <ComboList
                    form={form}
                    {...supplierPropsForName}
                    name='supplierName'
                    field={['supplierCode']}
                    allowClear
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem label='物料分类'>
              {
                getFieldDecorator(['materialCategoryCode']),
                getFieldDecorator('materialCategoryName')(
                  <ComboTree
                    form={form}
                    {...materialClassProps}
                    name='materialCategoryName'
                    field={['materialCategoryCode']}
                    allowClear
                  />
                )
              }
            </FormItem>
          </Col>
          {
            !!bgCode ?
              <Col span={7}>
                <FormItem label='业务单元'>
                  {
                    getFieldDecorator(['buCode']),
                    getFieldDecorator('buName')(
                      <ComboList
                        form={form}
                        {...businessMainProps}
                        name='buName'
                        field={['buCode']}
                        allowClear
                      />
                    )
                  }
                </FormItem>
              </Col> : null
          }
          <Col span={3}>
            <FormItem>
              <Button type='primary' onClick={handleSearch}>查询</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <ExtTable
        onSelectRow={handleSelectedRows}
        ref={tableRef}
        columns={columns}
        checkbox={{
          multiSelect: true
        }}
        selectedRowKeys={selectedRowKeys}
        {...tableProps}
      />
    </ExtModal>
  )
}))

export default Form.create()(ForWard)