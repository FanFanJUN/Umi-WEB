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
    { title: '指标名称', dataIndex: 'ruleName', width: 120 },
    { title: '指标定义', dataIndex: 'definition', ellipsis: true, width: 140 },
    { title: '评分标准', dataIndex: 'scoringStandard', ellipsis: true, width: 150 },
    { title: '标准分', dataIndex: 'highestScore', ellipsis: true, width: 70 },
    {
      title: '不适用',
      dataIndex: 'whetherApply',
      width: type ? 70 : 120,
      render: (v, data) => type ? ApplicableStateArr[v] : <ComboList
        onClick={e => e.stopPropagation()}
        afterSelect={value => {
          data.whetherApply = value.code;
          refreshTable();
        }}
        value={ApplicableStateArr[v]} {...ApplicableStateProps} />,
    },
    {
      title: '评审得分',
      dataIndex: 'reviewScore',
      width: 100,
      render: (v, data) => type ? v : <InputNumber
        disabled={data.whetherApply}
        onBlur={refreshTable}
        value={v} max={data.highestScore}
        precision={1}
        onChange={value => data.reviewScore = value}
        min={0} />,
    },
    {
      title: '情况记录',
      dataIndex: 'remark',
      width: 150,
      render: (v, data) => type ? v : <Input value={v} onChange={e => {
        data.remark = e.target.value;
        refreshTable();
      }} />,
    },
    {
      title: '附件',
      dataIndex: 'attachRelatedIds',
      width: type ? 50 : 160,
      render: (v, data) => <Upload
        entityId={type ? data.fileList : v} type={props.type}
        onChange={(value) => data.attachRelatedIds = value} />,
    },
    {
      title: '问题',
      dataIndex: 'problemList',
      width: 130,
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

  const handleBack = () => {
    setData(v => ({ ...v, sendBackVisible: true }));
  };

  return (
    <div>
      {
        props.type === 'show' && <Button onClick={handleBack}>退回</Button>
      }
      <ExtTable
        style={{ marginTop: '10px' }}
        rowKey={(v) => v.lineNum}
        allowCancelSelect={true}
        height={400}
        showSearch={false}
        loading={loading}
        remotePaging
        // checkbox={{ multiSelect: false }}
        size='small'
        // onSelectRow={handleSelectedRows}
        // selectedRowKeys={data.selectedRowKeys}
        columns={columns}
        ref={tableRef}
        dataSource={data.dataSource}
      />
      <SendBack
        refresTable={() => props.onCancel()}
        params={props.params}
        onCancel={() => setData(v => ({ ...v, sendBackVisible: false }))}
        visible={data.sendBackVisible}
      />
      <ProblemManagement
        type={props.type}
        onOk={handleOk}
        editData={data.editData}
        onCancel={() => setData(v => ({ ...v, visible: false }))}
        visible={data.visible}
      />
    </div>
  );
};

ProblemTable.defaultProps = {
  params: {},
  loading: false,
  show: '',
};

export default ProblemTable;
