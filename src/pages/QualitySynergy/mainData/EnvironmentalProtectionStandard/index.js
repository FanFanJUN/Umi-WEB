import React, { Fragment, useState, useRef } from 'react';
import { Button, Input, Modal, message, Row, InputNumber, Form, Radio } from 'antd';
import { ExtTable, ExtModal, utils, ComboList } from 'suid';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import moment from 'moment';
import {
  addEnvironmentalProtectionData,
  addEnvironmentStandardLimitMaterialRelation,
  ESPDeleted,
  ESPFreeze,
} from '../../../../services/qualitySynergy';
const formLayout = {
  labelCol: { span: 9, },
  wrapperCol: { span: 14, },
};
const { create, Item: FormItem } = Form;
const { authAction } = utils;
const { confirm } = Modal;

// const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const DEVELOPER_ENV = true;

const EnvironmentalProtectionStandard = ({ form }) => {
  const tableRef = useRef(null);
  const [ESPdata, setESPData] = useState({
    visible: false,
    modalSource: '',
    isView: false
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const { getFieldDecorator, setFieldsValue, validateFields } = form;
  const columns = [
    { title: '环保标准代码', dataIndex: 'environmentalProtectionCode', width: 80 },
    { title: '环保标准名称', dataIndex: 'environmentalProtectionName', ellipsis: true, },
    { title: 'REACH环保符合性声明', dataIndex: 'reach', ellipsis: true, render: (text) => text ? '符合' : '不符合' },
    { title: '备注', dataIndex: 'note', ellipsis: true },
    { title: '排序号', dataIndex: 'orderNo', ellipsis: true, width: 80 },
    { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (text) => text ? '已冻结' : '未冻结' },
  ]

  // 环保标准按钮操作
  const EPSbuttonClick = (type) => {
    console.log('环保标准按钮操作')
    switch (type) {
      case 'add':
        setESPData((value) => ({
          ...value,
          visible: true,
          modalSource: '',
          isView: false
        }));
        break;
      case 'edit':
        setESPData((value) => ({
          ...value,
          visible: true,
          modalSource: selectedRow[selectedRow.length - 1],
          isView: type === 'detail'
        }));
        break;
      case 'freeze':
      case 'thaw':
        confirm({
          title: `请确认是否${type === 'thaw' ? '解冻' : '冻结'}选中环保标准数据`,
          onOk: async () => {
            const res = await ESPFreeze({
              frozen: type === 'freeze',
              ids: selectedRowKeys.join()
            })
            if (res.success) {
              message.success('冻结成功');
              setSelectedRowKeys([]);
              setSelectedRow([]);
              tableRef.current.remoteDataRefresh()
            } else {
              message.error(res.message)
            }
          },
        });
        break;
      case 'delete':
        confirm({
          title: '请确认是否删除选中环保标准数据',
          onOk: async () => {
            const res = await ESPDeleted({ ids: selectedRowKeys.join() });
            if (res.success) {
              message.success('删除成功');
              setSelectedRowKeys([]);
              setSelectedRow([]);
              tableRef.current.remoteDataRefresh()
            } else {
              message.error(res.message)
            }
          },
        });
        break;
    }
  }

  const headerLeft = <>
    {
      authAction(<Button
        type='primary'
        onClick={() => EPSbuttonClick('add')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_EPS_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => EPSbuttonClick('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_EPS_EDIT'
        disabled={setSelectedRowKeys.length !== 1}
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => EPSbuttonClick('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_EPS_DELETE'
        disabled={setSelectedRowKeys.length === 0}
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => EPSbuttonClick('freeze')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_EPS_FREEZE'
        disabled={setSelectedRowKeys.length === 0}
      >冻结</Button>)
    }
    {
      authAction(<Button
        onClick={() => EPSbuttonClick('thaw')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='QUALITYSYNERGY_EPS_THAW'
        disabled={setSelectedRowKeys.length === 0}
      >解冻</Button>)
    }
  </>
  // 环保标准新增/编辑
  function handleESPOk() {
    if (ESPdata.isView) {
      setESPData((value) => ({ ...value, visible: false }))
    } else {
      validateFields(async (errs, values) => {
        if (!errs) {
          values.exemptionExpireDate = moment(values.exemptionExpireDate).format('YYYY-MM-DD');
          if (ESPdata.modalSource) {
            values = { ...ESPdata.modalSource, ...values }
          }
          const res = await addEnvironmentalProtectionData(values)
          if (res.success) {
            message.success('操作成功');
            setESPData((value) => ({ ...value, visible: false }))
            setSelectedRowKeys([]);
            setSelectedRow([]);
            tableRef.current.remoteDataRefresh()
          } else {
            message.error(res.message)
          }
        }
      })
    }
  }
  return (
    <Fragment>
      <ExtTable
        columns={columns}
        ref={tableRef}
        store={{
          url: `${baseUrl}/environmentalProtectionData/findByPage`,
          type: 'GET',
          params: {
            quickSearchProperties: []
          }
        }}
        checkbox={true}
        remotePaging={true}
        selectedRowKeys={selectedRowKeys}
        onSelectRow={(selectedRowKeys, selectedRows) => {
          setSelectedRow(selectedRows);
          setSelectedRowKeys(selectedRowKeys);
        }}
        toolBar={{
          left: headerLeft
        }}
      />
      <ExtModal
        centered
        destroyOnClose
        visible={ESPdata.visible}
        okText="保存"
        onCancel={() => { setESPData((value) => ({ ...value, visible: false })) }}
        onOk={() => { handleESPOk() }}
        title={ESPdata.modalSource ? '编辑环保标准' : '新增环保标准'}
      >
        <Form>
          <Row>
            <FormItem label='环保标准代码' {...formLayout}>
              {
                getFieldDecorator('environmentalProtectionCode', {
                  initialValue: ESPdata.modalSource && ESPdata.modalSource.environmentalProtectionCode,
                  rules: [{ required: true, message: '请填写环保标准代码' }]
                })(<Input />)
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem label='环保标准名称' {...formLayout}>
              {
                getFieldDecorator('environmentalProtectionName', {
                  initialValue: ESPdata.modalSource && ESPdata.modalSource.environmentalProtectionName,
                  rules: [{ required: true, message: '请填写环保标准名称' }]
                })(<Input />)
              }
            </FormItem>
          </Row>

          <Row>
            <FormItem label='REACH环保符合性声明' {...formLayout}>
              {
                getFieldDecorator('reach', {
                  initialValue: ESPdata.modalSource ? ESPdata.modalSource.reach : true,
                  rules: [{ required: true, message: '请填写REACH环保符合性声明' }]
                })(<Radio.Group>
                  <Radio value={true}>符合</Radio>
                  <Radio value={false}>不符合</Radio>
                </Radio.Group>)
              }
            </FormItem>

          </Row>
          <Row>
            <FormItem label='备注' {...formLayout}>
              {
                getFieldDecorator('note', {
                  initialValue: ESPdata.modalSource && ESPdata.modalSource.note,
                  rules: [{ required: true, message: '请填写限量' }]
                })(<Input />)
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem label=' 排序号' {...formLayout}>
              {
                getFieldDecorator('orderNo', {
                  initialValue: ESPdata.modalSource && ESPdata.modalSource.orderNo,
                  rules: [{ required: true, message: '请填写限量' }]
                })(<InputNumber min={0} style={{ width: '100%' }} />)
              }
            </FormItem>
          </Row>
        </Form>
      </ExtModal>
    </Fragment>
  )

}

export default create()(EnvironmentalProtectionStandard)