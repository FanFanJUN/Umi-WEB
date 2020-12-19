import React, { useState } from 'react';
import { ComboGrid, ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { isEmptyArray, hideFormItem, filterEmptyFileds } from '@/utils/utilTool';
// import { getSupplierSupplyList } from '../service';
import { smBaseUrl } from '@/utils/commonUrl';
import { purchaseOrgConfig, corporationProps, materialClassProps, getListByTypeId, supplierProps } from '@/utils/commonProps';
import { FormItemStye } from '../styleParam';

const FormItem = Form.Item;
const minxinSupplierProps = {
    ...supplierProps,
    reader: {
        name: 'name',
        field: ['code'],
        description: 'code'
    },
    placeholder: '选择供应商'
};

const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddModal = (props) => {

    const { visible, title, form, handleCancel, handleOk } = props

    const { getFieldDecorator } = form;

    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [selectRows, setselectRows] = useState([]);
    const [loading] = useState(false);
    const [cascadeParams, setCascadeParams] = useState({});
    const [page, setPage] = useState({});

    const columns = [
      {
        title: '需求公司',
        dataIndex: 'corporation',
        width: 140,
        ellipsis: true,
        render: (text) => {
          return text && `${text.code}_${text.name}`;
        },
      },
      {
        title: '采购组织',
        dataIndex: 'purchaseOrg',
        ellipsis: true,
        width: 140,
        render: (text) => {
          return text && `${text.code}_${text.name}`;
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplier',
        ellipsis: true,
        width: 140,
        render: (text) => {
          return text && `${text.code}_${text.name}`;
        },
      },
      { title: '代理商', dataIndex: 'originSupplierName', ellipsis: true, width: 80 },
      {
        title: '物料分类',
        dataIndex: 'materielCategory',
        ellipsis: true,
        width: 140,
        render: (text) => {
          return text && text.showName;
        },
      },
      { title: '物料级别', dataIndex: 'materialGrade', ellipsis: true, width: 80, align: 'center' },
      { title: '绩效等级', dataIndex: 'grade', ellipsis: true, width: 140 },
      { title: '采购金额', dataIndex: 'sampleReceiverName', ellipsis: true, width: 140 },
    ];

    const onCancel = () => {
        handleCancel();
    }

    const checkOne = () => {
      if (isEmptyArray(selectRows)) {
        message.info('至少选择一条行信息');
        return false;
      }
      return true;
    };

    const onOk = () => {
      if (!checkOne()) return;
      handleOk(selectRows, 'ok');
    };

    const onOkAndContinue = () => {
      if (!checkOne()) return;
      handleOk(selectRows, 'continue');
      clearSelected();
    };

    const clearSelected = () => {
        setselectedRowKeys([]);
        setselectRows([]);
    }

    const HideFormItem = hideFormItem(getFieldDecorator);

    function handleSelectedRows(key, rows) {
        setselectedRowKeys(key);
        setselectRows(rows);
    }

    function handleOnchange(page) {
        console.log(page);
        if (page) {
            setPage(page);
        }
    }

    function handleSearch() {
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            if (!err) {
                delete values.Q_EQ_purchaseOrgName;
                delete values.materialGradeAndName;
                delete values.Q_EQ_corporationName;
                setCascadeParams(values);
            }
        });
    }

    function resetForm() {
        form.resetFields();
    }

    function renderForm() {
        return (
          <Form>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutLong}
                  label={'需求公司'}
                  style={FormItemStye}
                >
                  {getFieldDecorator('Q_EQ_corporationName')(
                    <ComboGrid
                      allowClear
                      style={{ width: '100%' }}
                      form={form}
                      name="Q_EQ_corporationName"
                      field={['Q_EQ_corporationCode']}
                      {...corporationProps}
                    />,
                  )}
                </FormItem>
              </Col>
              {HideFormItem('Q_EQ_corporationCode')}
              {HideFormItem('Q_EQ_purchaseOrgCode')}
              <Col span={8}>
                <FormItem
                  {...formItemLayoutLong}
                  label={'采购组织'}
                  style={FormItemStye}
                >
                  {getFieldDecorator('Q_EQ_purchaseOrgName')(
                    <ComboGrid
                      form={form}
                      field={['Q_EQ_purchaseOrgCode']}
                      name={'Q_EQ_purchaseOrgName'}
                      {...purchaseOrgConfig}
                      allowClear
                      // afterSelect={selectpurchaseOrg}
                    />,
                  )}
                </FormItem>
              </Col>
              {HideFormItem('materielCategoryCode')}
              <Col span={8}>
                <FormItem
                  {...formItemLayoutLong}
                  label={'物料分类'}
                  style={FormItemStye}
                >
                  {getFieldDecorator('materialCategoryName')(
                    <ComboTree
                      allowClear
                      form={form}
                      name="materialCategoryName"
                      {...materialClassProps}
                      field={['materielCategoryCode']}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              {HideFormItem('Q_EQ_supplierCode')}
              <Col span={8}>
                <FormItem {...formItemLayoutLong} label={'原厂'} style={{ marginBottom: '10px' }}>
                  {getFieldDecorator('supplierCodeName')(
                    <ComboList
                      allowClear
                      style={{ width: '100%' }}
                      form={form}
                      name="supplierCodeName"
                      field={['Q_EQ_supplierCode']}
                      {...minxinSupplierProps}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutLong}
                  label={'物料级别'}
                  style={{ marginBottom: '10px' }}
                >
                  {
                    (getFieldDecorator('materialGrade'),
                    getFieldDecorator('materialGradeAndName')(
                      <ComboList
                        allowClear
                        style={{ width: '100%' }}
                        form={form}
                        pagination={false}
                        name="materialGradeAndName"
                        field={['materialGrade']}
                        {...getListByTypeId('F4D69B2D-7949-11EA-920B-0242C0A84416')}
                      />,
                    ))
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayoutLong}
                  label={'绩效等级'}
                  style={{ marginBottom: '10px' }}
                >
                  {getFieldDecorator('Q_EQ_grade')(<Input />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        );
    }

    return (
      <ExtModal
        width={'80%'}
        centered
        maskClosable={false}
        visible={visible}
        title={title}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose={true}
        afterClose={clearSelected}
        footer={[
          <Button key="back" onClick={onCancel}>
            返回
          </Button>,
          <Button key="submit" type="primary" onClick={onOk}>
            确定
          </Button>,
          <Button key="continue" type="primary" onClick={onOkAndContinue}>
            确定并继续
          </Button>,
        ]}
      >
        <div>{renderForm()}</div>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={handleSearch} style={{ marginRight: '10px' }}>
            查询
          </Button>
          <Button onClick={resetForm}>重置</Button>
        </div>
        <ExtTable
          height={300}
          rowKey="id"
          allowCancelSelect={true}
          showSearch={false}
          remotePaging
          checkbox={true}
          size="small"
          onSelectRow={handleSelectedRows}
          selectedRowKeys={selectedRowKeys}
          onChange={handleOnchange}
          store={{
            params: {
              valid: 1,
              page: page.current,
              rows: page.pageSize,
              Q_EQ_frozen__Boolean: 0,
              ...filterEmptyFileds(cascadeParams),
            },
            url: `${smBaseUrl}/supplierSupplyList/listPageVo`,
            type: 'get',
          }}
          cascadeParams={{
            valid: 1,
            Q_EQ_frozen__Boolean: 0,
            ...filterEmptyFileds(cascadeParams),
          }}
          columns={columns}
          loading={loading}
        />
      </ExtModal>
    );

}

export default Form.create()(AddModal);
