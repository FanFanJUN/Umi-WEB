import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Form, Button, DatePicker, Modal, Col, message, Table } from 'antd';
import styles from './SupplierModal.less';
import { ExtModal, ExtTable } from 'suid';
import { supplierManagerBaseUrl, recommendUrl } from '../../../../../utils/commonUrl';
import { DistributionSupplierSave, FindSupplierByDemandNumber, generateLineNumber, judge, FindMaxDateByDemandNumber } from '../../../commonProps';
import moment from 'moment/moment';
import { request } from 'suid/es/utils';
import { CommonTable } from './CommonTable';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const SupplierModal = (props) => {
  const tableRef = useRef(null);
  const supplierTable = useRef(null);
  const { getFieldDecorator, getFieldValue } = props.form;
  const { visible, title, type } = props;

  const [supplierData, setSupplierData] = useState({
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
  });

  const [sourceData, setSourceData] = useState([]);

  const [data, setData] = useState({
    downloadAbortDate: '',
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
      setSourceData([]);
      setData((value) => ({ ...value, show: true }));
      getDataSource();
    } else {
      setData((value) => ({ ...value, show: false }));
    }
    if (visible) {
      FindMaxDateByDemandNumber({
        id: props.selectedRows[0]?.id
      }).then(res => {
        if (res.data) {
          setData(v => ({...v, downloadAbortDate: res.data}))
        }
      })
    }
  }, [visible]);

  const supplierColumns = [
    { title: '供应商代码', dataIndex: 'code', width: 250 },
    { title: '供应商名称', dataIndex: 'name', ellipsis: true, width: 250 },
  ].map(item => ({ ...item, align: 'center' }));

  const columns = [
    { title: '行号', dataIndex: 'lineNumber', width: 70 },
    { title: '是否发布', dataIndex: 'publish', width: 150, render: (v) => v ? '已发布' : '草稿' },
    { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, width: 200 },
    { title: '供应商名称', dataIndex: 'supplierName', ellipsis: true, width: 200 },
    { title: '分配日期', dataIndex: 'allotDate', ellipsis: true, width: 200 },
    { title: '分配人', dataIndex: 'allotPeopleName', ellipsis: true, width: 150 },
    { title: '资料下载截止日期', dataIndex: 'downloadAbortDate', ellipsis: true, width: 200 },
  ].map(item => ({ ...item, align: 'center' }));

  const getDataSource = () => {
    console.log(props.selectedRows[0].shareDemanNumber, 'props.selectedRows[0].shareDemanNumber');
    FindSupplierByDemandNumber({
      shareDemanNumber: props.selectedRows[0].shareDemanNumber,
    }).then(res => {
      if (res.success) {
        res.data = res.data.map((item, index) => ({ ...item, lineNumber: generateLineNumber(index + 1) }));
        setSourceData(res.data);
      } else {
        message.error(res.message);
      }
    });
  };

  const handleCancel = () => {
    tableRef.current.manualSelectedRows();
    setSupplierData({
      selectedRowKeys: [],
      selectedRows: [],
    });
    setSourceData([]);
    setData({
      deleteArr: [],
      selectedRowKeys: [],
      selectedRows: [],
      show: false,
      type: 'supplier',
      ModalVisible: false,
    });
    props.onCancel();
  };

  // 分配供应商的删除
  const handleDelete = () => {
    Modal.confirm({
      title: '删除',
      content: '请确认删除选中的数据!',
      cancelText: '取消',
      okText: '确定',
      type: 'error',
      onOk: () => {
        const { selectedRowKeys } = data;
        let deleteArr = [];
        if (sourceData) {
          let newSourceData = sourceData.slice();
          selectedRowKeys.map(item => {
            newSourceData.map((data, index) => {
              if (item === data.supplierId) {
                if (data.id) {
                  data.whetherDelete = true;
                  deleteArr.push(data);
                }
                newSourceData.splice(index, 1);
              }
            });
          });
          newSourceData = newSourceData.map((item, index) => ({
            ...item,
            lineNumber: generateLineNumber(index + 1),
          }));
          tableRef.current.manualSelectedRows();
          setSourceData(newSourceData);
          setData(v => ({ ...v, deleteArr }));
          console.log(deleteArr, 'deleteArr');
        } else {
          message.error('请选择要删除的数据!');
        }
      },
    });
  };

  const handleSelectedRows = (selectedKeys, rows) => {
    setData(v => ({ ...v, selectedRows: rows, selectedRowKeys: selectedKeys }));
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
    setSupplierData(v => ({ ...v, selectedRows: rows, selectedRowKeys: selectedKeys }));
  };

  const SupplierAdd = () => {
    return <CommonTable
      filterMultiple={true}
      ref={supplierTable}
      pagination={true}
      columns={supplierColumns}
      onSelectRow={onSupplierSelectRow}
      store={{
        url: `${recommendUrl}/api/epTechnicalShareDemandService/findNormalSupplierList`,
        type: 'POST',
        params: {
          id: props.selectedRows[0]?.id
        }
      }}
    />;
    // return <ExtTable
    //   height={'500px'}
    //   ref={supplierTable}
    //   rowKey={(v) => v.id}
    //   columns={supplierColumns}
    //   store={{
    //     url: `${supplierManagerBaseUrl}/api/supplierService/findSupplierVoByPage`,
    //     type: 'POST',
    //   }}
    //   allowCancelSelect={true}
    //   remotePaging={true}
    //   checkbox={{
    //     multiSelect: true,
    //   }}
    //   onSelectRow={onSupplierSelectRow}
    //   selectedRowKeys={supplierData.selectedRowKeys}
    // />;
  };

  // 添加截止日期
  const addEndTime = () => {
    const endTime = moment(getFieldValue('endTime')).format('YYYY-MM-DD');
    console.log(sourceData);
    let newSourceData = sourceData.slice();
    newSourceData.map((item, index) => {
      data.selectedRowKeys.map(data => {
        if (data === item.supplierId) {
          item.downloadAbortDate = endTime;
        }
      });
    });
    console.log(newSourceData, 'newSourceData');
    tableRef.current.manualSelectedRows();
    setSourceData(newSourceData);
    modalCancel();
  };

  // 改变供应商发布状态
  const changeReleaseStatus = (type) => {
    let newSourceData = sourceData.slice();
    newSourceData.map(item => {
      data.selectedRowKeys.map(data => {
        if (data === item.supplierId) {
          item.publish = type;
        }
      });
    });
    console.log(newSourceData);
    tableRef.current.manualSelectedRows();
    setSourceData(newSourceData);
  };

  // 保存供应商
  const saveSupplier = () => {
    Modal.confirm({
      title: '保存',
      okText: '确定',
      content: '请确认保存所有供应商!',
      cancelText: '取消',
      onOk: () => {
        const ids = props.selectedRows.map(item => item.id);
        let arr = [...sourceData, ...data.deleteArr];
        arr = arr.map(item => ({ ...item, technicalLineNumber: item.lineNumber }));
        DistributionSupplierSave({
          ids: ids,
          epTechnicalSupplierBos: arr,
        }).then(res => {
          if (res.success) {
            message.success(res.message);
            handleCancel();
            props.tableRefresh();
          } else {
            message.error(res.message);
          }
        });
      },
    });
  };

  const duplicateRemoval = (arr, key) => {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i][key] === arr[j][key]) {
          arr.splice(j, 1);
          //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
          j--;
        }
      }
    }
    return arr;  //去重后返回的数组
  };

  //新增供应商确定按钮 ok为确定 continue为确认并继续
  const supplierAddOk = (type) => {
    let arr = [];
    console.log(supplierData.selectedRows, 'supplierData.selectedRows');
    supplierData.selectedRows.map(item => {
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
        downloadAbortDate: data.downloadAbortDate,
      });
    });
    arr = [...sourceData, ...arr];
    console.log(arr, 'arrarrarr');
    // 根据supplierId去重
    arr = duplicateRemoval(arr, 'supplierId');
    arr = arr.map((item, index) => ({ ...item, lineNumber: generateLineNumber(index + 1) }));
    console.log(arr);
    if (type === 'ok') {
      supplierTable.current.manualSelectedRows();
      modalCancel();
    }
    tableRef.current.manualSelectedRows();
    if (JSON.stringify(arr) !== JSON.stringify(sourceData)) {
      setSourceData(arr);
    }
  };

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
          <Button className={styles.btn} onClick={handleTimeEdit}
                  disabled={data.selectedRowKeys?.length === 0 || !judge(data.selectedRows, 'publish', false)}>编辑资料下载日期</Button>
          <Button className={styles.btn} onClick={handleDelete}
                  disabled={data.selectedRowKeys?.length === 0 || !judge(data.selectedRows, 'publish', false)}>删除</Button>
          <Button className={styles.btn} disabled={data.selectedRowKeys?.length === 0 ||
          !judge(data.selectedRows, 'downloadAbortDate') || !judge(data.selectedRows, 'publish', false)
          } onClick={() => changeReleaseStatus(true)}>发布</Button>
          <Button className={styles.btn}
                  disabled={data.selectedRowKeys?.length === 0 || !judge(data.selectedRows, 'downloadAbortDate') || !judge(data.selectedRows, 'publish', true)}
                  onClick={() => changeReleaseStatus(false)}>取消发布</Button>
          <Button className={styles.btn} disabled={!judge(sourceData, 'downloadAbortDate')}
                  onClick={saveSupplier}>保存</Button>
        </div>
      }
      <ExtTable
        className={styles.tab}
        columns={columns}
        bordered
        allowCancelSelect
        ref={tableRef}
        dataSource={sourceData}
        showSearch={false}
        remotePaging
        checkbox={{ multiSelect: true }}
        rowKey={(item) => item.supplierId}
        size='small'
        onSelectRow={handleSelectedRows}
        selectedRowKeys={data.selectedRowKeys}
      />
      <ExtModal
        width={'110vh'}
        height={'500px'}
        maskClosable={false}
        title={data.type === 'time' ? '编辑资料下载截止日期' : '新增供应商'}
        visible={data.ModalVisible}
        footer={data.type === 'supplier' ? [
          <Button key='cancel' onClick={() => {
            modalCancel();
          }}>取消</Button>,
          <Button key='ok' type='primary' onClick={() => supplierAddOk('ok')}>确定</Button>,
          <Button key='okAndRun' type='primary' onClick={() => supplierAddOk('continue')}>确定并继续</Button>,
        ] : [
          <Button key='cancel' onClick={modalCancel}>取消</Button>,
          <Button key='ok' type='primary' onClick={addEndTime}>确定</Button>,
        ]}
        onCancel={modalCancel}
      >
        <div style={data.type === 'time' ? { height: '50px' } : { height: '500px' }}>
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
