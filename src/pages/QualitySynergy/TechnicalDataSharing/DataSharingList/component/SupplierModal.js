import React, { Fragment, useEffect, useState } from 'react';
import { Form, Button, DatePicker, Modal, Col, message } from 'antd';
import styles from './SupplierModal.less';
import { ExtModal, ExtTable } from 'suid';
import { recommendUrl, smBaseUrl, supplierManagerBaseUrl } from '../../../../../utils/commonUrl';
import { FindSupplierByDemandNumber } from '../../../commonProps';
import AutoSizeLayout from '../../../../../components/AutoSizeLayout';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const SupplierModal = (props) => {
  const { visible, title, type } = props;

  const [supplierData, setSupplierData] = useState({
    selectedRowKeys: [],
    selectedRows: [],
  });

  const [data, setData] = useState({
    sourceData: [],
    show: false,
    type: 'supplier',
    ModalVisible: false,
  });

  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (type === 'allot') {
      setData((value) => ({ ...value, show: true }));
    } else {
      getDataSource();
      setData((value) => ({ ...value, show: false }));
    }
  }, [visible]);

  const supplierColumns = [
    { title: '供应商代码', dataIndex: 'code', width: 250 },
    { title: '供应商名称', dataIndex: 'name', ellipsis: true, width: 250 },
  ].map(item => ({ ...item, align: 'center' }));

  const columns = [
    { title: '来源', dataIndex: 'turnNumber', width: 70 },
    { title: '分享需求号', dataIndex: 'name1', ellipsis: true, width: 150 },
    { title: '物料代码', dataIndex: 'name2', ellipsis: true, width: 150 },
    { title: '物料描述', dataIndex: 'name3', ellipsis: true, width: 250 },
    { title: '物料组代码', dataIndex: 'name4', ellipsis: true, width: 150 },
  ].map(item => ({ ...item, align: 'center' }));

  const getDataSource = () => {
    FindSupplierByDemandNumber({
      shareDemanNumber: props.shareDemanNumber,
    }).then(res => {
      if (res.success) {
        setData(v => ({ ...v, sourceData: res.data?.rows }));
      } else {
        message.error(res.message);
      }
    });
  };

  const handleOk = () => {
    console.log('ok');
  };

  const handleCancel = () => {
    setData((value) => ({ ...value, show: false }));
    props.onCancel();
  };

  const handleSelectedRows = (value) => {
    console.log(value);
  };

  const selectedRowKeys = (value) => {
    console.log(value, 'select');
  };

  const handleTimeEdit = () => {
    setData((value) => ({ ...value, type: 'time', ModalVisible: true }));
  };

  const handleAddSupplier = () => {
    setData((value) => ({ ...value, type: 'supplier', ModalVisible: true }));
  };

  const timeModalCancel = () => {
    setData((value) => ({ ...value, ModalVisible: false }));
  };

  const TimeAdd = () => {
    return <Form>
      <Col span={24}>
        <FormItem
          {...formItemLayoutLong}
          label="编辑资料下载截止日期"
        >
          {
            getFieldDecorator('endTime', {
              initialValue: null,
              rules: [{ required: true, message: '资料下载截止日期不能为空' }],
            })(
              <DatePicker style={{ width1: '100%' }}/>,
            )
          }
        </FormItem>
      </Col>
    </Form>;
  };

  const onSupplierSelectRow = (value) => {
    console.log(value);
  };

  const SupplierAdd = () => {
    return <ExtTable
      height={'500px'}
      rowKey={(v) => v.id}
      columns={supplierColumns}
      store={{
        url: `${supplierManagerBaseUrl}/api/supplierService/findSupplierVoByPage`,
        type: 'POST',
      }}
      allowCancelSelect={true}
      remotePaging={true}
      checkbox={{
        multiSelect: true,
      }}
      onSelectRow={onSupplierSelectRow}
      selectedRowKeys={supplierData.selectedRowKeys}
    />

  };

  const { getFieldDecorator } = props.form;

  return (
    <ExtModal
      maskClosable={false}
      width={'150vh'}
      visible={visible}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {
        data.show && <div>
          <Button className={styles.btn} onClick={handleAddSupplier} type='primary'>新增</Button>
          <Button className={styles.btn} onClick={handleTimeEdit}>编辑资料下载日期</Button>
          <Button className={styles.btn}>删除</Button>
          <Button className={styles.btn}>保存</Button>
          <Button className={styles.btn}>保存并发布</Button>
          <Button>取消发布</Button>
        </div>
      }
      <ExtTable
        className={styles.tab}
        columns={columns}
        bordered
        allowCancelSelect
        dataSource={data.sourceData}
        showSearch={false}
        remotePaging
        checkbox={{ multiSelect: false }}
        rowKey={(item) => item.id}
        size='small'
        onSelectRow={handleSelectedRows}
        selectedRowKeys={selectedRowKeys}
      />
      <ExtModal
        width={'80vh'}
        height={'500px'}
        maskClosable={false}
        title={data.type === 'time' ? '编辑资料下载截止日期' : '新增供应商'}
        visible={data.ModalVisible}

        onCancel={timeModalCancel}
      >
        <div style={data.type === 'time' ? { height: '50px' } : {height: '500px'}}>
          {data.type === 'time' ? TimeAdd() : SupplierAdd()}
        </div>
      </ExtModal>
    </ExtModal>
  );

};

SupplierModal.defaultPorps = {
  type: 'view',
  shareDemanNumber: '',
  title: '',
  visible: false,
  onCancel: () => {
  },
};

export default Form.create()(SupplierModal);
