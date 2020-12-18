import React, { useEffect, useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import styles from './index.less';
import { Button, Col, Form, Input, InputNumber, message, Row, Upload } from 'antd';
import BU from '../../../QualitySynergy/mainData/BU';
import ProblemAdd from './ProblemAdd';
import { getRandom } from '../../../QualitySynergy/commonProps';
import { OrderSeverityArr } from '../commonApi';
import { recommendUrl } from '../../../../utils/commonUrl';
import { BASE_URL } from '../../../../utils/constants';

const FormItem = Form.Item;

const formLongLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const ProblemManagement = (props) => {

  const columns = [
    { title: '部门/过程', dataIndex: 'department', width: 150 },
    { title: '问题描述', dataIndex: 'problemDescribe', ellipsis: true, width: 300 },
    { title: '严重程度', dataIndex: 'severity', width: 180, render: v => OrderSeverityArr[v] },
    { title: '要求整改完成日期', dataIndex: 'demandCompletionTime', ellipsis: true, width: 200 },
  ].map(item => ({ ...item, align: 'center' }));

  const tableRef = useRef(null);

  const [fileList, setFileList] = useState([]);

  const [updateLoading, setUpdateLoading] = useState(false);

  const { editData } = props;

  const { getFieldDecorator } = props.form;

  const [data, setData] = useState({
    dataSource: [],
    type: 'add',
    title: '新增',
    visible: false,
    deleteArr: [],
    selectedRowKeys: [],
    selectedRowRows: [],
  });

  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    let newData = JSON.parse(JSON.stringify(props.editData));
    newData.problemList = data.dataSource;
    props.onOk(newData);
  };

  useEffect(() => {
    if (editData.problemList) {
      let arr = JSON.parse(JSON.stringify(editData.problemList));
      arr = arr.map(item => ({ ...item, lineNum: getRandom(10) }));
      setData(v => ({ ...v, dataSource: arr }));
    }
  }, [props.visible]);

  const clearSelected = () => {
    setData(v => ({ ...v, dataSource: [] }));
  };

  const handleSelectedRows = (keys, rows) => {
    setData(v => ({ ...v, selectedRowRows: rows, selectedRowKeys: keys }));
  };

  const showProblemAdd = (type) => {
    switch (type) {
      case 'add':
        setData(v => ({ ...v, visible: true, title: '新增', type }));
        break;
      case 'edit':
        if (!data.selectedRowRows[0].severityName) {
          data.selectedRowRows[0].severityName = OrderSeverityArr[data.selectedRowRows[0].severity];
        }
        setData(v => ({ ...v, visible: true, title: '编辑', type, editData: data.selectedRowRows[0] }));
        break;
      case 'delete':
        deleteFun();
        break;
    }
  };

  const handleOk = (value) => {
    let arr = JSON.parse(JSON.stringify(data.dataSource));
    if (data.type === 'add') {
      value.ruleCode = editData.ruleCode;
      value.ruleName = editData.ruleName;
      arr.push(value);
    } else {
      arr.map((item, index) => {
        if (item.lineNum === data.selectedRowKeys[0]) {
          arr[index] = value;
        }
      });
    }
    setData(v => ({ ...v, dataSource: arr, visible: false }));
    refreshTable();
  };

  // 刷新table
  const refreshTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  const deleteFun = () => {
    let arr = data.dataSource.slice();
    arr.map((item, index) => {
      data.selectedRowKeys.map(value => {
        if (item.lineNum === value) {
          arr.splice(index, 1);
        }
      });
    });
    setData(v => ({ ...v, dataSource: arr }));
  };

  // 文件上传之前(判断选中文件格式并封装fileList)
  const beforeUpload = (file) => {
    let sindex = file.name.lastIndexOf('.');
    let ext = file.name.substring(sindex + 1, file.name.length);
    if (sindex < 0) {
      message.error('请上传excel文件');
    } else {
      if (ext !== 'xls' && ext !== 'xlsx') {
        message.error('请上传excel文件');
      } else {
        setFileList([...fileList, file]);
        console.log('fileList', file);
      }
    }
  };

  // 选择文件上传后返回的状态
  const handleChange = (res) => {
    const { status, response } = res.file;
    if (status === 'uploading') {
      setUpdateLoading(true);
    }
    if (status === 'done') {
      if (response.status === 'SUCCESS') {
        let newData = JSON.parse(JSON.stringify(response.data));
        newData = newData.map(item => ({
          ...item,
          ruleCode: editData.ruleCode,
          ruleName: editData.ruleName,
          severityName: OrderSeverityArr[item.severity],
          lineNum: getRandom(10),
        }));
        setData(v => ({ ...v, dataSource: newData }));
        setUpdateLoading(false);
        refreshTable()
      } else if (response.status === 'FAILURE') {
        message.error(response.message);
        setUpdateLoading(false);
      }
    } else if (status === 'error') {
      setUpdateLoading(false);
      message.error('上传失败!');
    }
  };

  return (
    <ExtModal
      width={'150vh'}
      maskClosable={false}
      destroyOnClose={true}
      visible={visible}
      title={'问题管理'}
      onCancel={onCancel}
      onOk={onOk}
      afterClose={clearSelected}
    >
      <div className={styles.wrapper}>
        <div className={styles.bgw}>
          <div className={styles.title}>指标信息</div>
          <div className={styles.content}>
            <Row>
              <Col span={12}>
                <FormItem {...formLongLayout} label={'指标名称'}>
                  {
                    getFieldDecorator('ruleName', {
                      initialValue: editData.ruleName,
                    })(
                      <Input disabled={true} placeholder="请输入指标名称" style={{ width: '100' }} />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formLongLayout} label={'指标定义'}>
                  {
                    getFieldDecorator('definition', {
                      initialValue: editData.definition,
                    })(
                      <Input disabled={true} placeholder="请输入指标定义" style={{ width: '100' }} />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formLayout} label={'评分标准'}>
                  {
                    getFieldDecorator('scoringStandard', {
                      initialValue: editData.scoringStandard,
                    })(
                      <Input.TextArea disabled={true} rows={4} placeholder="请输入评分标准" style={{ width: '100%' }} />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.title}>问题</div>
          <div className={styles.content}>
            {
              props.type !== 'show' && <div>
                <Button style={{ marginRight: '5px' }} onClick={() => showProblemAdd('add')}>新增</Button>
                <Button style={{ marginRight: '5px' }} disabled={data.selectedRowKeys.length !== 1}
                        onClick={() => showProblemAdd('edit')}>编辑</Button>
                <Button style={{ marginRight: '5px' }} disabled={data.selectedRowKeys.length === 0}
                        onClick={() => showProblemAdd('delete')}>删除</Button>
                <Upload
                  name="file"
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  fileList={fileList}
                  action={window.location.origin + BASE_URL + `${recommendUrl}/srController/importProblem `}
                  onChange={handleChange}
                >
                  <Button style={{ marginLeft: 5 }} key="chooseFile" loading={updateLoading}>
                    批量导入
                  </Button>
                </Upload>
                <Button
                  style={{ marginLeft: '5px' }}
                  onClick={() => window.open(`${window.location.origin}${BASE_URL}/${recommendUrl}/srController/downloadProblemTemplate`)}>下载模板</Button>
              </div>
            }
            <ExtTable
              style={{ marginTop: '10px' }}
              height={'25vh'}
              rowKey={(v) => v.lineNum}
              allowCancelSelect={true}
              showSearch={false}
              remotePaging
              checkbox={{ multiSelect: true }}
              size='small'
              onSelectRow={handleSelectedRows}
              selectedRowKeys={data.selectedRowKeys}
              columns={columns}
              ref={tableRef}
              dataSource={data.dataSource}
            />
          </div>
        </div>
      </div>
      <ProblemAdd
        type={data.type}
        title={data.title}
        visible={data.visible}
        editData={data.editData}
        onCancel={() => setData(v => ({ ...v, visible: false }))}
        onOk={handleOk}
      />
    </ExtModal>
  );

};

export default Form.create()(ProblemManagement);
