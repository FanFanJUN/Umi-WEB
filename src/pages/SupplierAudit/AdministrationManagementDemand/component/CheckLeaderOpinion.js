import React, { useRef, useState } from 'react';
import { ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import { ApplicableStateProps } from '../../../QualitySynergy/commonProps';
import { Checkbox } from 'antd';

const CheckLeaderOpinion = (props) => {

  const columns = [
    { title: '被退回人', dataIndex: 'reviewRequirementCode', width: 150 },
    { title: '指标', dataIndex: 'reviewRequirementName', ellipsis: true, width: 150 },
    { title: '意见', dataIndex: 'applyCorporationName', ellipsis: true, width: 400 },
    { title: '提出人', dataIndex: 'applyDepartmentName', ellipsis: true, width: 150 },
    { title: '提出时间', dataIndex: 'orgName', width: 200,},
  ].map(item => ({ ...item, align: 'center' }));

  const tableRef = useRef(null);

  const { type, editData, visible } = props;

  const [data, setData] = useState({
    checked: true,
    dataSource: [],
    selectedRowKeys: [],
    selectedRowRows: [],
  });

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

  const onChange = (e) => {
    setData(v => ({...v, checked: e.target.checked}))
  }

  return (
    <ExtModal
      width={'160vh'}
      maskClosable={false}
      visible={visible}
      title={'查看组长意见'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <div>
        <Checkbox onChange={onChange} checked={data.checked}>仅我的</Checkbox>
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
    </ExtModal>
  );

};

export default CheckLeaderOpinion;
