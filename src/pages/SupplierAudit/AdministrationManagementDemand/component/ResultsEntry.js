import React, { useEffect, useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import { Button, Input, InputNumber, message } from 'antd';
import { ApplicableStateArr, ApplicableStateProps, getRandom } from '../../../QualitySynergy/commonProps';
import Upload from '../../../QualitySynergy/compoent/Upload';
import ProblemManagement from './ProblemManagement';
import {
  ResultsEntryApi,
  SaveResultsEntryApi, SubmitResultsEntryApi,
} from '../../AuditRequirementsManagement/commonApi';
import { recommendUrl } from '../../../../utils/commonUrl';

const ResultsEntry = (props) => {

  const columns = [
    { title: '指标名称', dataIndex: 'ruleName', width: 150 },
    { title: '指标定义', dataIndex: 'definition', ellipsis: true, width: 150 },
    { title: '评分标准', dataIndex: 'scoringStandard', ellipsis: true, width: 180 },
    { title: '标准分', dataIndex: 'highestScore', ellipsis: true, width: 100 },
    {
      title: '不适用',
      dataIndex: 'whetherApply',
      width: 80,
      render: (v, data) => <ComboList
        onClick={e => e.stopPropagation()}
        afterSelect={value => whetherApplyChange(value, data)}
        value={ApplicableStateArr[v]} {...ApplicableStateProps} />,
    },
    {
      title: '评审得分',
      dataIndex: 'reviewScore',
      width: 100,
      render: (v, data) => <InputNumber value={v} max={data.highestScore}
                                        onChange={value => reviewScoreChange(value, data)} min={0} />,
    },
    {
      title: '情况记录',
      dataIndex: 'remark',
      width: 200,
      render: (v, data) => <Input value={v} onChange={value => remarkChange(value, data)} />,
    },
    {
      title: '附件',
      dataIndex: 'attachRelatedId',
      width: 200,
      render: (v, data) => <Upload entityId={v} onChange={(value) => attachRelatedIdChange(value, data)} />,
    },
    {
      title: '问题',
      dataIndex: 'problemList',
      width: 200,
      render: (v, data) => <div><Button onClick={e => showProblemManagement(e, data)}>问题管理</Button> {v.length}</div>,
    },
  ].map(item => ({ ...item, align: 'center' }));

  const tableRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    editData: {},
    visible: false,
    selectedRowKeys: [],
    selectedRowRows: [],
  });

  useEffect(() => {
    if (props.visible) {
      getTableData(props.id);
    }
  }, [props.visible]);

  const getTableData = (reviewImplementManagementId) => {
    setLoading(true);
    ResultsEntryApi({ reviewImplementManagementId }).then(res => {
      if (res.success) {
        let newData = JSON.parse(JSON.stringify(res.data));
        newData = newData.map(item => ({ ...item, lineNum: getRandom(10) }));
        console.log(newData);
        setData(v => ({ ...v, dataSource: newData }));
        setLoading(false);
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
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
    changeRowsValue(value, 'attachRelatedId', rows.lineNum);

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

  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = (type) => {
    const servers = type === 'save' ? SaveResultsEntryApi : SubmitResultsEntryApi
    servers(data.dataSource).then(res => {
      if (res.success) {
        message.success('保存成功')
        props.onOk()
      }else {
        message.error(res.message)
      }
    }).catch(err => {
      message.error(err.message)
    })
  };

  const clearSelected = () => {
    setData(v => ({ ...v, dataSource: [] }));
  };

  const handleSelectedRows = (keys, rows) => {
    console.log(rows);
    setData(v => ({ ...v, selectedRowKeys: keys, selectedRowRows: rows }));
  };

  const handleOk = (value) => {
    let newData = JSON.parse(JSON.stringify(data.dataSource));
    newData.map((item, index) => {
      console.log(item, value);
      if (item.lineNum === value.lineNum) {
        newData[index] = value;
      }
    });
    setData(v => ({ ...v, dataSource: newData, visible: false }));
    refreshTable();
  };

  // 刷新table
  const refreshTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 导出数据
  const exportData = () => {
    const url = `/service.api/${recommendUrl}/srController/downloadResultTemplate?reviewImplementManagementId=${props.id}`
    window.open(url)
  }

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
        <Button type={'primary'} onClick={() => onOk('save')}>暂存</Button>
        <Button onClick={() => onOk('submit')}>提交</Button>
      </div>}
    >
      <div>
        <Button type='primary'>批量导入</Button>
        <Button style={{marginLeft: '5px'}} key="downLoad" onClick={exportData}>批量导出</Button>
      </div>
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
      <ProblemManagement
        type={'add'}
        onOk={handleOk}
        editData={data.editData}
        onCancel={() => setData(v => ({ ...v, visible: false }))}
        visible={data.visible}
      />
    </ExtModal>
  );

};

export default ResultsEntry;
