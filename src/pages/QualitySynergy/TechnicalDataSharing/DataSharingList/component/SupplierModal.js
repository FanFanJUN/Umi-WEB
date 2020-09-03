import React, { Fragment, useEffect, useState } from 'react';
import{Form, Button, DatePicker, Modal, Col } from 'antd';
import styles from './SupplierModal.less'
import { ExtTable } from 'suid';
import { smBaseUrl } from '../../../../../utils/commonUrl';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: {span: 10},
  wrapperCol: {span: 14},
};

const SupplierModal = (props) => {
  const { visible, title, type } = props;

  const [data, setData] = useState({
    show: false,
    timeVisible: false
  });

  const [endTime, setEndTime] = useState(null);

  const [searchValue, setSearchValue] = useState({});

  useEffect(() => {
    if (type === 'allot') {
      setData((value) => ({...value, show: true}))
    } else {
      setData((value) => ({...value, show: false}))
    }
  }, [visible]);

  const columns = [
    { title: '来源', dataIndex: 'turnNumber', width: 70 },
    { title: '分享需求号', dataIndex: 'name1', ellipsis: true, },
    { title: '物料代码', dataIndex: 'name2', ellipsis: true, },
    { title: '物料描述', dataIndex: 'name3', ellipsis: true, },
    { title: '物料组代码', dataIndex: 'name4', ellipsis: true, },
  ].map(item => ({...item, align: 'center'}))

  const handleOk = () => {
    console.log('ok');
  };

  const handleCancel = () => {
    setData((value) => ({...value, show: false}))
    props.onCancel();
  };

  const handleSelectedRows = (value) => {
    console.log(value)
  }

  const selectedRowKeys = (value) => {
    console.log(value, 'select')
  }


  const tableProps = {
    store: {
      url: `${smBaseUrl}/api/supplierFinanceViewModifyService/findByPage`,
      params: {
        ...searchValue,
        quickSearchProperties: ['supplierName', 'supplierCode'],
        sortOrders: [
          {
            property: 'docNumber',
            direction: 'DESC'
          }
        ]
      },
      type: 'POST'
    }
  }

  const handleTimeEdit= () => {
    setData((value) => ({...value, timeVisible: true}))
  }

  const timeModalCancel = () => {
    setData((value) => ({...value, timeVisible: false}))
  }

  const {getFieldDecorator} = props.form;

  return (
    <Modal
      maskClosable={false}
      width={'100vh'}
      visible={visible}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {
        data.show && <div>
          <Button className={styles.btn} type='primary'>新增</Button>
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
        showSearch={false}
        remotePaging
        checkbox={{ multiSelect: false }}
        rowKey={(item) => item.id}
        size='small'
        onSelectRow={handleSelectedRows}
        selectedRowKeys={selectedRowKeys}
        {...tableProps}
      />
      <Modal
        maskClosable={false}
        title='编辑资料下载截止日期'
        visible={data.timeVisible}
        onCancel={timeModalCancel}
      >
        <div style={{height: '50px'}}>
          <Form>
            <Col span={24}>
              <FormItem
                {...formItemLayoutLong}
                label="编辑资料下载截止日期"
              >
                {
                  getFieldDecorator("endTime", {
                    initialValue: null,
                    rules: [{required: true, message: '资料下载截止日期不能为空'}]
                  })(
                    <DatePicker style={{width1: '100%'}} />
                  )
                }
              </FormItem>
            </Col>
          </Form>
        </div>
      </Modal>
    </Modal>
  );

};

SupplierModal.defaultPorps = {
  type: 'view',
  title: '',
  visible: false,
  onCancel: () => {
  },
};

export default Form.create()(SupplierModal);
