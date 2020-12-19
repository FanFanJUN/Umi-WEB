import React, { useEffect, useRef, useState } from 'react';
import { ExtModal, ExtTable } from 'suid';
import { Checkbox, message, Button } from 'antd';
import { CheckGroupLeadersOpinion } from '../commonApi';
import { getRandom } from '../../../QualitySynergy/commonProps';

const CheckLeaderOpinion = (props) => {

  const demandColumns = [
    { title: '被退回人', dataIndex: 'memberName', width: 150 },
    { title: '指标', dataIndex: 'ruleName', ellipsis: true, width: 150 },
  ].map(item => ({ ...item, align: 'center' }));

  const columns = [
    { title: '意见', dataIndex: 'suggestion', ellipsis: true, width: 300 },
    { title: '提出人', dataIndex: 'leaderName', ellipsis: true, width: 150 },
    { title: '提出时间', dataIndex: 'proposeTime', width: 200 },
  ].map(item => ({ ...item, align: 'center' }));

  const tableRef = useRef(null);

  const { visible, type, reviewImplementPlanCode } = props;

  const [data, setData] = useState({
    loading: false,
    checked: true,
    dataSource: [],
    selectedRowKeys: [],
    selectedRowRows: [],
  });

  useEffect(() => {
    if (props.visible) {
      getTableData(props.id, data.checked);
    }
  }, [props.visible]);

  const getTableData = (reviewImplementManagementId, checked) => {
    setData(v => ({ ...v, loading: true }));
    CheckGroupLeadersOpinion({
      ownMe: checked,
      reviewImplementManagementId,
      reviewImplementPlanCode,
    }).then(res => {
      if (res.success) {
        if (res.data && res.data.length !== 0) {
          res.data = res.data.map(item => ({...item, lineNum: getRandom(10)}))
        }
        setData(v => ({ ...v, dataSource: res.data, loading: false }));
      } else {
        message.error(res.message);
      }
    }).catch(err => {
      message.error(err.message);
    });
  };

  const onCancel = () => {
    props.onCancel();
  };

  const clearSelected = () => {
    setData(v => ({ ...v, dataSource: [], checked: true }));
  };

  const handleSelectedRows = (keys, rows) => {
    setData(v => ({ ...v, selectedRowKeys: keys, selectedRowRows: rows }));
  };

  const onChange = async (e) => {
    await setData(v => ({ ...v, checked: e.target.checked }));
    getTableData(props.id, e.target.checked);
  };

  return (
    <ExtModal
      width={'150vh'}
      maskClosable={false}
      visible={visible}
      title={type === 'demand' ? '查看组长意见' : '查看退回信息'}
      onCancel={onCancel}
      footer={<Button type='primary' onClick={onCancel}>关闭</Button>}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      {
        type === 'demand' && <div>
          <Checkbox onChange={onChange} checked={data.checked}>仅我的</Checkbox>
        </div>
      }
      <ExtTable
        style={{ marginTop: '10px' }}
        rowKey={(v) => v.lineNum}
        loading={data.loading}
        allowCancelSelect={true}
        showSearch={false}
        remotePaging
        checkbox={{ multiSelect: false }}
        size='small'
        onSelectRow={handleSelectedRows}
        selectedRowKeys={data.selectedRowKeys}
        columns={type === 'demand' ? [...demandColumns, ...columns] : columns}
        ref={tableRef}
        dataSource={data.dataSource}
      />
    </ExtModal>
  );

};

export default CheckLeaderOpinion;
