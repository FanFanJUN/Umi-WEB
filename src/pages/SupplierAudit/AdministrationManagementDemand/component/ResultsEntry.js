import React, { useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import { Button, Input, InputNumber } from 'antd';
import { ApplicableStateProps } from '../../../QualitySynergy/commonProps';
import Upload from '../../../QualitySynergy/compoent/Upload';
import ProblemManagement from './ProblemManagement';

const ResultsEntry = (props) => {

  const columns = [
    { title: '指标名称', dataIndex: 'reviewRequirementCode', width: 150 },
    { title: '指标定义', dataIndex: 'reviewRequirementName', ellipsis: true, width: 150 },
    { title: '评分标准', dataIndex: 'applyCorporationName', ellipsis: true, width: 180 },
    { title: '标准分', dataIndex: 'applyDepartmentName', ellipsis: true, width: 100 },
    { title: '不适用', dataIndex: 'orgName', width: 80, render: v => <ComboList value={'是'} {...ApplicableStateProps}/> },
    { title: '评审得分', dataIndex: 'applyName', width: 100, render: v => <InputNumber min={0}/> },
    { title: '情况记录', dataIndex: 'applyDate', width: 200, render: v => <Input/> },
    { title: '附件', dataIndex: '1', width: 200, render: v => <Upload entityId={null}/> },
    {
      title: '问题',
      dataIndex: '2',
      width: 200,
      render: v => <div><Button onClick={e => showProblemManagement(e)}>问题管理</Button> {0}</div>,
    },
  ].map(item => ({ ...item, align: 'center' }));

  const tableRef = useRef(null);

  const [data, setData] = useState({
    dataSource: [{
      lineNum: 1,
      orgName: 'true',
    }],
    visible: true,
    selectedRowKeys: [],
    selectedRowRows: [],
  });

  const showProblemManagement = (e) => {
    e.stopPropagation();
    setData(v => ({ ...v, visible: true }));
  };


  const { visible } = props;

  const onCancel = () => {
    props.onCancel()
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
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
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
        onCancel={() => setData(v => ({...v, visible: false}))}
        visible={data.visible}
      />
    </ExtModal>
  );

};

export default ResultsEntry;
