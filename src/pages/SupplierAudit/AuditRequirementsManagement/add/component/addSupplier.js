import React, { useRef, useState } from 'react';
import { ComboTree, ExtModal, ExtTable } from 'suid';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { documentMaterialClassProps } from '../../../../../utils/commonProps';
import { recommendUrl, smBaseUrl } from '../../../../../utils/commonUrl';

const FormItem = Form.Item;

const columns = [
  { title: '物料分类', dataIndex: 'materielCategory', width: 150, render: v => v.name },
  {
    title: '供应商',
    dataIndex: 'supplier',
    width: 400,
    render: (v, record) => record.originSupplierName ? record.originSupplierName : v.name,
  },
  {
    title: '代理商',
    dataIndex: 'originSupplierName',
    width: 200,
    render: (v, record) => record.originSupplierName ? v.name : record.originSupplierName,
  },
].map(item => ({ ...item, align: 'center' }));

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const AddSupplier = (props) => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    selectedKeys: [],
    selectedValue: [],
  });

  const { visible, form } = props;

  const { getFieldDecorator, getFieldValue } = props.form;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    if (data.selectedValue && data.selectedValue.length !== 0) {
      props.onOk(data.selectedValue[0]);
    } else {
      message.error('请至少选择一个供应商!');
    }
  };

  const clearSelected = () => {
    props.form.resetFields();
  };

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {
        getFieldDecorator(name, {
          initialValue: initialValue,
        })(
          <Input type={'hidden'} />,
        )
      }
    </FormItem>
  );

  console.log(props, 'props')

  const onSelectRow = (keys, values) => {
    setData(v => ({ ...v, selectedKeys: keys, selectedValue: values }));
  };

  return (
    <ExtModal
      width={'100vh'}
      maskClosable={false}
      visible={visible}
      title={'从合格供应商名录选择'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayoutLong} label={'原厂'}>
              {
                getFieldDecorator('originSupplier', {
                  initialValue: '',
                })(
                  <Input />,
                )
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('materialGroupCode', '')}
          </Col>
          <Col span={0}>
            {hideFormItem('materialGroupId', '')}
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayoutLong} label={'物料分类'}>
              {
                getFieldDecorator('materialGroupName', {
                  initialValue: '',
                })(
                  <ComboTree
                    allowClear={true}
                    style={{ width: '60%' }}
                    form={form}
                    name={'materialGroupName'}
                    field={['materialGroupCode', 'materialGroupId']}
                    {...documentMaterialClassProps}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FormItem {...formItemLayoutLong}>
              <Button type='primary' onClick={() => tableRef.current.remoteDataRefresh()}>筛选</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <ExtTable
        rowKey={(v) => v.id}
        columns={columns}
        store={{
          params: {
            quickSearchProperties: ['originSupplierCode', 'originSupplierName'],
            quickSearchValue: getFieldValue('originSupplier'),
            filters: [
              {
                fieldName: 'materielCategoryCode',
                fieldType: 'string',
                operator: 'EQ',
                value: getFieldValue('materialGroupCode'),
              },
              {
                fieldName: 'corporationCode',
                fieldType: 'string',
                operator: 'EQ',
                value: props.corporationCode,
              },
              {
                fieldName: 'purchaseOrgCode',
                fieldType: 'string',
                operator: 'EQ',
                value: props.purchaseOrgCode,
              },
              {
                fieldName: 'frozen',
                fieldType: 'boolean',
                operator: 'EQ',
                value: 0,
              },
            ],
          },
          url: `${smBaseUrl}/api/supplierSupplyListTmpService/findByFilters`,
          type: 'POST',
        }}
        allowCancelSelect={true}
        remotePaging={true}
        checkbox={{
          multiSelect: false,
        }}
        ref={tableRef}
        showSearch={false}
        onSelectRow={onSelectRow}
        selectedRowKeys={data.selectedRowKeys}
      />
    </ExtModal>
  );

};

export default Form.create()(AddSupplier);
