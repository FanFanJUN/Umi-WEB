import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './index.less';
import {
  ExtModal,
  ExtTable,
  ComboTree,
  utils
} from 'suid';
import {
  Form,
  Input,
  message,
  Checkbox,
  Row,
  Col,
  Button
} from 'antd';
import { Header } from '../../components';
import { useTableProps } from '../../utils/hooks';
import { commonUrl } from '../../utils';
import { materialClassProps } from '../../utils/commonProps';
const { recommendUrl } = commonUrl;

const { create, Item: FormItem } = Form;

const { storage } = utils;

const formLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  }
};
function LayoutComponent({
  form,
  title = '供应商推荐需求选择',
  onOk = () => null
}, ref) {
  useImperativeHandle(ref, () => ({
    show,
    hide
  }))
  const { getFieldDecorator, getFieldsValue } = form;
  const [tableOptions, sets] = useTableProps();
  const {
    selectedRowKeys,
    searchValue
  } = tableOptions;
  const {
    setRowKeys,
    handleSelectedRows,
    setSearchValue
  } = sets;
  const { userId } = storage.sessionStorage.get("Authorization") || {};
  const tableRef = useRef(null);
  const [onlyMe, setOnlyMe] = useState(false);
  const [visible, toggleVisible] = useState(false);
  const columns = [
    {
      title: '单据状态',
      dataIndex: 'supplierRecommendDemandStatusRemark',
    },
    {
      title: '审批状态',
      dataIndex: 'flowStatus',
      render(text) {
        switch (text) {
          case 'INIT':
            return '未提交审批'
          case 'INPROCESS':
            return '审批中'
          case 'COMPLETED':
            return '审批完成'
          default:
            return ''
        }
      }
    },
    {
      title: '需求单号',
      dataIndex: 'docNumber'
    },
    {
      title: '供应商代码',
      dataIndex: 'supplierCode'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName'
    },
    {
      title: '原厂代码',
      dataIndex: 'originName'
    },
    {
      title: '原厂名称',
      dataIndex: 'originCode'
    },
    {
      title: '物料分类',
      dataIndex: 'materialCategoryName'
    },
    {
      title: '申请公司',
      dataIndex: 'corporationName',
      width: 180
    },
    {
      title: '创建部门',
      dataIndex: 'orgName',
      width: 180
    },
    {
      title: '创建人员',
      dataIndex: 'creatorName'
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate'
    }
  ].map(item => ({ ...item, align: 'center' }));
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/supplierRecommendDemandService/findByPage4Access`,
      type: 'post',
      params: {
        ...searchValue,
        filters: searchValue.filters ?
          searchValue.filters.concat([{
            fieldName: 'purchaseTeamLeaderId',
            operator: 'EQ',
            value: onlyMe ? userId : undefined
          }]) : [{
            fieldName: 'purchaseTeamLeaderId',
            operator: 'EQ',
            value: onlyMe ? userId : undefined
          }],
        quickSearchProperties: ['supplierName', 'docNumber'],
        sortOrders: [
          {
            property: 'docNumber',
            direction: 'DESC'
          }
        ]
      }
    },
    remotePaging: true,
    checkbox: {
      multiSelect: false
    },
    showSearch: false,
    allowCancelSelect: true,
    bordered: true,
    rowkey: 'id',
    size: 'small',
    columns: columns
  }
  const show = () => toggleVisible(true)
  const hide = () => toggleVisible(false)
  const left = (
    <Form {...formLayout} style={{ width: '90vw' }}>
      <Row>
        <Col span={4}>
          <FormItem
            label='需求单号'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            {
              getFieldDecorator('Q_LK_docNumber')(
                <Input allowClear/>
              )
            }
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem
            label='供应商名称'
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
          >
            {
              getFieldDecorator('Q_LK_supplierName')(
                <Input allowClear/>
              )
            }
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            label='物料分类'
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {
              getFieldDecorator('Q_EQ_materialCategoryCode'),
              getFieldDecorator('Q_EQ_materialCategoryCode_name')(
                <ComboTree
                  {...materialClassProps}
                  form={form}
                  name='Q_EQ_materialCategoryCode_name'
                  field={['Q_EQ_materialCategoryCode']}
                />
              )
            }
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label='仅我的'>
            <Checkbox
              checked={onlyMe}
              onChange={handleOnlyMeChange}
            />
          </FormItem>
        </Col>
        <Col span={2}>
          <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
            <Button onClick={handleSearch} type='primary'>查询</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
  function handleOk() {
    if (selectedRowKeys.length === 0) {
      message.error('未选择数据')
      return
    }
    hide()
    onOk(selectedRowKeys)
  }
  function handleSearch() {
    const v = getFieldsValue();
    const keys = Object.keys(v);
    const filters = keys.map((item) => {
      const [_, operator, fieldName, isName] = item.split('_');
      return {
        fieldName,
        operator,
        value: !!isName ? undefined : v[item]
      }
    }).filter(item => !!item.value)
    setSearchValue({
      filters: filters
    })
    uploadTable()
  }
  // 更新列表
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 清除选中项
  function cleanSelectedRecord() {
    tableRef.current.manualSelectedRows([])
    setRowKeys([])
  }
  // 切换仅查看我
  function handleOnlyMeChange(e) {
    setOnlyMe(e.target.checked)
    uploadTable()
  }
  return (
    <ExtModal
      visible={visible}
      title={title}
      onCancel={hide}
      onOk={handleOk}
      centered
      bodyStyle={{
        height: '60vh'
      }}
      width='90vw'
      destroyOnClose
    >
      <ExtTable
        title={left}
        {...tableProps}
        onSelectRow={handleSelectedRows}
        selectedRowKeys={selectedRowKeys}
        ref={tableRef}
      />
    </ExtModal>
  )
}

const FormWrapper = forwardRef(LayoutComponent)

export default create()(FormWrapper)