import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Form, Button, DatePicker, Modal, Col, message } from 'antd';
import styles from './SupplierModal.less';
import { ExtModal, ExtTable } from 'suid';
import { supplierManagerBaseUrl } from '../../../../../utils/commonUrl';
import { DistributionSupplierSave, FindSupplierByDemandNumber, generateLineNumber, judge } from '../../../commonProps';
import moment from 'moment/moment';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const SupplierModal = (props) => {
  const tableRef = useRef(null);
  const { getFieldDecorator, getFieldValue } = props.form;
  const { visible, title, type } = props;

  const [supplierData, setSupplierData] = useState({
    selectedRowKeys: [],
    selectedRows: [],
  });

  const [data, setData] = useState({
    deleteArr: [],
    selectedRowKeys: [],
    selectedRows: [],
    sourceData: [],
    show: false,
    type: 'supplier',
    ModalVisible: false,
  });

  useEffect(() => {
    if (type === 'allot') {
      if (props.selectedRows[0]?.allotSupplierState === '已分配') {
        getDataSource();
      }
      setData((value) => ({ ...value, show: true }));
    } else {
      setData((value) => ({ ...value, show: false }));
    }
  }, [visible]);

  const supplierColumns = [
    { title: '供应商代码', dataIndex: 'code', width: 250 },
    { title: '供应商名称', dataIndex: 'name', ellipsis: true, width: 250 },
  ].map(item => ({ ...item, align: 'center' }));

  const columns = [
    { title: '行号', dataIndex: 'lineNumber', width: 70 },
    { title: '是否发布', dataIndex: 'publish', width: 150, render: (v) => v ? '已发布' : '草稿'},
    { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, width: 200 },
    { title: '供应商名称', dataIndex: 'supplierName', ellipsis: true, width: 200 },
    { title: '分配日期', dataIndex: 'allotDate', ellipsis: true, width: 200 },
    { title: '分配人', dataIndex: 'allotPeopleName', ellipsis: true, width: 150 },
    { title: '资料下载截止日期', dataIndex: 'downloadAbortDate', ellipsis: true, width: 200 }
  ].map(item => ({ ...item, align: 'center' }));

  const getDataSource = () => {
    console.log(props.selectedRows[0].shareDemanNumber, 'props.selectedRows[0].shareDemanNumber')
    FindSupplierByDemandNumber({
      shareDemanNumber: props.selectedRows[0].shareDemanNumber,
    }).then(res => {
      if (res.success) {
        res.data = res.data.map((item, index) => ({...item, lineNumber: generateLineNumber(index + 1)}))
        setData(v => ({ ...v, sourceData: res.data }));
      } else {
        message.error(res.message);
      }
    });
  };

  const handleCancel = () => {
    tableRef.current.manualSelectedRows();
    setData({
      selectedRowKeys: [],
      selectedRows: [],
      sourceData: [],
      show: false,
      type: 'supplier',
      ModalVisible: false
    })
    setSupplierData({
      selectedRowKeys: [],
      selectedRows: [],
    })
    props.onCancel();
  };

  // 分配供应商的删除
  const handleDelete = () => {
    Modal.confirm({
      title: '删除',
      content:"请确认删除选中的数据!",
      cancelText: '取消',
      okText: '确定',
      type: 'error',
      onOk: () => {
        const {selectedRowKeys} = data
        let deleteArr = []
        if (data.sourceData) {
          let newSourceData = data.sourceData.slice()
          selectedRowKeys.map(item => {
            newSourceData.map((data, index) => {
              if (item === data.lineNumber) {
                if (data.id) {
                  data.whetherDelete = true
                  deleteArr.push(data)
                }
                newSourceData.splice(index, 1)
              }
            })
          })
          newSourceData = newSourceData.map((item, index) => ({
            ...item,
            lineNumber: generateLineNumber(index + 1)
          }))
          tableRef.current.manualSelectedRows();
          setData(v => ({...v, sourceData: newSourceData, deleteArr}))
        } else {
          message.error('请选择要删除的数据!')
        }
      }
    })
  }

  const handleSelectedRows = (selectedKeys, rows) => {
    setData(v => ({...v, selectedRows: rows, selectedRowKeys: selectedKeys}))
  };

  const handleTimeEdit = () => {
    setData((value) => ({ ...value, type: 'time', ModalVisible: true }));
  };

  const handleAddSupplier = () => {
    setData((value) => ({ ...value, type: 'supplier', ModalVisible: true }));
  };

  const modalCancel = () => {
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

  const onSupplierSelectRow = (selectedKeys, rows) => {
    setSupplierData(v => ({...v, selectedRows: rows, selectedRowKeys: selectedKeys}))
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

  // 添加截止日期
  const addEndTime = () => {
    const endTime = moment(getFieldValue('endTime')).format('YYYY-MM-DD')
    let newSourceData = data.sourceData.slice()
    newSourceData.map((item, index) => {
      data.selectedRowKeys.map(data => {
        if (data === item.lineNumber) {
          item.downloadAbortDate = endTime
        }
      })
    })
    console.log(newSourceData, 'newSourceData')
    setData(v => ({...v, sourceData: newSourceData}))
    console.log(data.sourceData, 'sourceData')
    modalCancel()
  }

  // 改变供应商发布状态
  const changeReleaseStatus = (type) => {
    let newSourceData = data.sourceData.slice()
    newSourceData.map(item => {
      data.selectedRowKeys.map(data => {
        if (data === item.lineNumber) {
          item.publish = type
        }
      })
    })
    setData(v => ({...v, sourceData: newSourceData}))
  }

  // 保存供应商
  const saveSupplier = () => {
    if (judge(data.selectedRows, 'downloadAbortDate') && data.sourceData.length > 0) {
      Modal.confirm({
        title: '保存',
        okText: '确定',
        content: '请确认保存所有供应商!',
        cancelText: '取消',
        onOk: () => {
          const ids = props.selectedRows.map(item => item.id)
          let arr = [...data.sourceData, ...data.deleteArr]
          arr = arr.map(item => ({...item, technicalLineNumber: item.lineNumber}))
          DistributionSupplierSave({
            ids: ids,
            epTechnicalSupplierBos: arr
          }).then(res => {
            if (res.success) {
              message.success(res.message)
              handleCancel()
            } else {
              message.error(res.message)
            }
          })
        }
      })
    }
  }

  //新增供应商确定按钮 ok为确定 continue为确认并继续
  const supplierAddOk = (type) => {
    let arr = []
    if (data.sourceData && data.sourceData.length > 0) {
      supplierData.selectedRows.map(item => {
        if (!data.sourceData.some(data => data.supplierId === item.id)) {
          arr.push({
            supplierCode: item.code,
            supplierId: item.id,
            supplierName: item.name,
            whetherDelete: false,
            publish: false,
            allotDate: moment(new Date()).format('YYYY-MM-DD'),
            allotPeopleName: props.selectedRows[0].strategicPurchaseName,
            allotPeopleCode: props.selectedRows[0].strategicPurchaseCode,
            allotPeopleId: props.selectedRows[0].strategicPurchaseId,
            downloadAbortDate: '',
          });
        }
      })
    } else {
      supplierData.selectedRows.map((item) => {
        arr.push({
          supplierCode: item.code,
          supplierId: item.id,
          supplierName: item.name,
          whetherDelete: false,
          publish: false,
          allotDate: moment(new Date()).format('YYYY-MM-DD'),
          allotPeopleName: props.selectedRows[0].strategicPurchaseName,
          allotPeopleCode: props.selectedRows[0].strategicPurchaseCode,
          allotPeopleId: props.selectedRows[0].strategicPurchaseId,
          downloadAbortDate: '',
        });
      });
    }
    arr = [...data.sourceData, ...arr]
    arr = arr.map((item, index) => ({...item, lineNumber: generateLineNumber(index + 1)}))
    tableRef.current.manualSelectedRows();
    if (type === 'ok') {
      modalCancel()
    }
    setData(v => ({...v, sourceData: arr}))
  }

  return (
    <ExtModal
      maskClosable={false}
      width={'150vh'}
      visible={visible}
      title={title}
      destroyOnClose={true}
      footer={null}
      onCancel={handleCancel}
    >
      {
        data.show && <div>
          <Button className={styles.btn} onClick={handleAddSupplier} type='primary'>新增</Button>
          <Button className={styles.btn} onClick={handleTimeEdit} disabled={data.selectedRowKeys?.length === 0}>编辑资料下载日期</Button>
          <Button className={styles.btn} onClick={handleDelete} disabled={data.selectedRowKeys?.length === 0}>删除</Button>
          <Button className={styles.btn} disabled={data.selectedRowKeys?.length === 0 ||
          !judge(data.selectedRows, 'downloadAbortDate')
          } onClick={() => changeReleaseStatus(true)}>发布</Button>
          <Button className={styles.btn} disabled={data.selectedRowKeys?.length === 0 || !judge(data.selectedRows, 'publish', true)} onClick={() => changeReleaseStatus(false)}>取消发布</Button>
          <Button disabled={!judge(data.sourceData, 'downloadAbortDate')} onClick={saveSupplier}>保存</Button>
        </div>
      }
      <ExtTable
        className={styles.tab}
        columns={columns}
        bordered
        allowCancelSelect
        ref={tableRef}
        dataSource={data.sourceData}
        showSearch={false}
        remotePaging
        checkbox={{ multiSelect: true }}
        rowKey={(item) => item.lineNumber}
        size='small'
        onSelectRow={handleSelectedRows}
        selectedRowKeys={data.selectedRowKeys}
      />
      <ExtModal
        width={'80vh'}
        height={'500px'}
        maskClosable={false}
        title={data.type === 'time' ? '编辑资料下载截止日期' : '新增供应商'}
        visible={data.ModalVisible}
        footer={data.type === 'supplier' ? [
          <Button key='cancel' onClick={modalCancel}>取消</Button>,
          <Button key='ok' type='primary' onClick={() => supplierAddOk('ok')}>确定</Button>,
          <Button key='okAndRun' type='primary' onClick={() => supplierAddOk('continue')}>确定并继续</Button>,
        ] : [
          <Button key='cancel' onClick={modalCancel}>取消</Button>,
          <Button key='ok' type='primary' onClick={addEndTime}>确定</Button>,
        ]}
        onCancel={modalCancel}
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
  selectedRows: [],
  shareDemanNumber: '',
  title: '',
  visible: false,
  onCancel: () => {
  },
};

export default Form.create()(SupplierModal);
