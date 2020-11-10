import React, { useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import { Button, Input, InputNumber } from 'antd';
import { ApplicableStateArr, ApplicableStateProps } from '../../../QualitySynergy/commonProps';
import Upload from '../../../QualitySynergy/compoent/Upload';
import ProblemManagement from './ProblemManagement';

const ResultsEntry = (props) => {

  const columns = [
    { title: '指标名称', dataIndex: 'indexicalInformation', width: 150 },
    { title: '指标定义', dataIndex: 'indexDefinition', ellipsis: true, width: 150 },
    { title: '评分标准', dataIndex: 'standardEvaluation', ellipsis: true, width: 180 },
    { title: '标准分', dataIndex: 'standardScore', ellipsis: true, width: 100 },
    {
      title: '不适用',
      dataIndex: 'isApplicable',
      width: 80,
      render: (v, data) => <ComboList
        onClick={e => e.stopPropagation()}
        afterSelect={value => isApplicableChange(value, data)}
        value={ApplicableStateArr[v]} {...ApplicableStateProps}/>,
    },
    {
      title: '评审得分',
      dataIndex: 'reviewScores',
      width: 100,
      render: (v, data) => <InputNumber value={v} max={data.standardScore}
                                        onChange={value => reviewScoresChange(value, data)} min={0}/>,
    },
    {
      title: '情况记录',
      dataIndex: 'caseRecord',
      width: 200,
      render: (v, data) => <Input value={v} onChange={value => caseRecordChange(value, data)}/>,
    },
    {
      title: '附件',
      dataIndex: 'fileList',
      width: 200,
      render: (v, data) => <Upload entityId={v} onChange={(value) => fileListChange(value, data)}/>,
    },
    {
      title: '问题',
      dataIndex: 'problemList',
      width: 200,
      render: (v, data) => <div><Button onClick={e => showProblemManagement(e, data)}>问题管理</Button> {v.length}</div>,
    },
  ].map(item => ({ ...item, align: 'center' }));

  const tableRef = useRef(null);

  const [data, setData] = useState({
    dataSource: [{
      lineNum: 1,
      caseRecord: '123',
      reviewScores: '321',
      isApplicable: 'true',
      standardScore: 100,
      indexDefinition: '指标定义',
      standardEvaluation: '评分标准',
      indexicalInformation: '指标信息',
      fileList: null,
      problemList: [{
        lineNum: 123,
        departmentProcess: '1',
        problemDescription: '2',
        orderSeverity: 3,
        requestCompletionDateRectification: 4,
      }],
    }],
    editData: {},
    visible: false,
    selectedRowKeys: [],
    selectedRowRows: [],
  });

  const showProblemManagement = (e, data) => {
    e.stopPropagation();
    console.log(data);
    setData(v => ({ ...v, visible: true, editData: data }));
  };

  const changeRowsValue = (value, key, linNum) => {
    let newDataSource = JSON.parse(JSON.stringify(data.dataSource));
    newDataSource.map((item, index) => {
      if (item.lineNum === linNum) {
        newDataSource[index][key] = value;
      }
    });
    setData(v => ({ ...v, dataSource: newDataSource }));
  };

  const fileListChange = (value, rows) => {
    changeRowsValue(value, 'fileList', rows.lineNum);
  };

  const caseRecordChange = (e, rows) => {
    changeRowsValue(e.target.value, 'caseRecord', rows.lineNum);
  };

  const reviewScoresChange = (value, rows) => {
    changeRowsValue(value, 'reviewScores', rows.lineNum);
  };

  const isApplicableChange = (value, rows) => {
    changeRowsValue(value.code, 'isApplicable', rows.lineNum);
  };

  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {

  };

  const clearSelected = () => {

  };

  const handleSelectedRows = (keys, rows) => {
    setData(v => ({ ...v, selectedRowKeys: keys, selectedRowRows: rows }));
  };

  return (
    <ExtModal
      width={'180vh'}
      maskClosable={false}
      visible={visible}
      title={'结果录入'}
      onCancel={onCancel}
      destroyOnClose={true}
      afterClose={clearSelected}
      footer={<div>
        <Button onClick={onCancel}>取消</Button>
        <Button type={'primary'} onClick={onOk}>暂存</Button>
        <Button onClick={onOk}>提交</Button>
      </div>}
    >
      <div>
        <Button type='primary'>批量导入</Button>
      </div>
      <ExtTable
        style={{ marginTop: '10px' }}
        rowKey={(v) => v.lineNum}
        allowCancelSelect={true}
        showSearch={false}
        remotePaging
        checkbox={{ multiSelect: false }}
        size='small'
        onSelectRow={handleSelectedRows}
        selectedRowKeys={data.selectedRowKeys}
        columns={columns}
        ref={tableRef}
        dataSource={data.dataSource}
      />
      <ProblemManagement
        type={'add'}
        editData={data.editData}
        onCancel={() => setData(v => ({ ...v, visible: false }))}
        visible={data.visible}
      />
    </ExtModal>
  );

};

export default ResultsEntry;
