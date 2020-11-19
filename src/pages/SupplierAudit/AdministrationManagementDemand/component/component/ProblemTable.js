import React, { useEffect, useRef, useState } from 'react';
import { ExtModal, ExtTable, ComboList } from 'suid';
import { Input, InputNumber, Button } from 'antd';
import ProblemManagement from '../ProblemManagement';
import Upload from '../../../../QualitySynergy/compoent/Upload/index';
import { ApplicableStateArr, ApplicableStateProps } from '../../../../QualitySynergy/commonProps';
import SendBack from './SendBack';

const ProblemTable = (props) => {

  const { type, loading } = props;

  const columns = [
    { title: '指标名称', dataIndex: 'ruleName', width: 150 },
    { title: '指标定义', dataIndex: 'definition', ellipsis: true, width: 150 },
    { title: '评分标准', dataIndex: 'scoringStandard', ellipsis: true, width: 180 },
    { title: '标准分', dataIndex: 'highestScore', ellipsis: true, width: 100 },
    {
      title: '不适用',
      dataIndex: 'whetherApply',
      width: 80,
      render: (v, data) => type ? ApplicableStateArr[v] : <ComboList
        onClick={e => e.stopPropagation()}
        afterSelect={value => whetherApplyChange(value, data)}
        value={ApplicableStateArr[v]} {...ApplicableStateProps} />,
    },
    {
      title: '评审得分',
      dataIndex: 'reviewScore',
      width: 100,
      render: (v, data) => type ? v : <InputNumber value={v} max={data.highestScore}
                                                   onChange={value => reviewScoreChange(value, data)} min={0} />,
    },
    {
      title: '情况记录',
      dataIndex: 'remark',
      width: 200,
      render: (v, data) => type ? v : <Input value={v} onChange={value => remarkChange(value, data)} />,
    },
    {
      title: '附件',
      dataIndex: 'attachRelatedIds',
      width: 200,
      render: (v, data) => <Upload entityId={v} type={props.type}
                                   onChange={(value) => attachRelatedIdChange(value, data)} />,
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
    sendBackVisible: false,
    dataSource: [],
    editData: {},
    visible: false,
    selectedRowKeys: [],
    selectedRowRows: [],
  });

  useEffect(() => {
    props.onChange(data.dataSource);
  }, [data.dataSource]);

  useEffect(() => {
    console.log(props.dataSource);
    if (props.dataSource && props.dataSource.length !== 0) {
      setData(v => ({ ...v, dataSource: props.dataSource }));
    }
  }, [props.dataSource]);

  const handleSelectedRows = (keys, rows) => {
    console.log(rows);
    setData(v => ({ ...v, selectedRowKeys: keys, selectedRowRows: rows }));
  };

  const handleOk = (value) => {
    if (!props.type) {
      let newData = JSON.parse(JSON.stringify(data.dataSource));
      newData.map((item, index) => {
        console.log(item, value);
        if (item.lineNum === value.lineNum) {
          newData[index] = value;
        }
      });
      setData(v => ({ ...v, dataSource: newData, visible: false }));
      refreshTable();
    } else {
      setData(v => ({ ...v, visible: false }));
    }
  };

  // 刷新table
  const refreshTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

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

  const attachRelatedIdChange = (value, rows) => {
    changeRowsValue(value, 'attachRelatedIds', rows.lineNum);

  };

  const remarkChange = (e, rows) => {
    changeRowsValue(e.target.value, 'remark', rows.lineNum);

  };

  const reviewScoreChange = (value, rows) => {
    changeRowsValue(value, 'reviewScore', rows.lineNum);

  };

  const whetherApplyChange = (value, rows) => {
    changeRowsValue(value.code, 'whetherApply', rows.lineNum);
  };

  const handleBack = () => {
    setData(v => ({...v, sendBackVisible: true}))
  };

  return (
    <>
      {
        props.type === 'show' && <Button disabled={data.selectedRowKeys.length === 0} onClick={handleBack}>退回</Button>
      }
      <ExtTable
        style={{ marginTop: '10px' }}
        rowKey={(v) => v.lineNum}
        allowCancelSelect={true}
        showSearch={false}
        loading={loading}
        remotePaging
        checkbox={{ multiSelect: false }}
        size='small'
        onSelectRow={handleSelectedRows}
        selectedRowKeys={data.selectedRowKeys}
        columns={columns}
        ref={tableRef}
        dataSource={data.dataSource}
      />
      <SendBack
        params={{
          reviewImplementManagementId: data.selectedRowRows[0] ? data.selectedRowRows[0].id : ''
        }}
        onCancel={() => setData(v => ({...v, sendBackVisible: false}))}
        visible={data.sendBackVisible}
      />
      <ProblemManagement
        type={props.type}
        onOk={handleOk}
        editData={data.editData}
        onCancel={() => setData(v => ({ ...v, visible: false }))}
        visible={data.visible}
      />
    </>
  );
};

ProblemTable.defaultProps = {
  loading: false,
  show: '',
};

export default ProblemTable;
