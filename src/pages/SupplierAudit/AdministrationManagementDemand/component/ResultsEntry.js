import React, { useEffect, useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import { Button, Input, InputNumber, message } from 'antd';
import { getRandom } from '../../../QualitySynergy/commonProps';
import { getDocIdForArray } from '@/utils/utilTool';
import {
  ResultsEntryApi,
  SaveResultsEntryApi, SubmitResultsEntryApi,
} from '../commonApi';
import { recommendUrl } from '../../../../utils/commonUrl';
import ProblemTable from './component/ProblemTable';

const ResultsEntry = (props) => {

  const [data, setData] = useState({
    dataSource: []
  })

  const [loading, setLoading] =useState(false)

  useEffect(() => {
    if (props.visible) {
      getTableData(props.id);
    }
  }, [props.visible]);

  const getTableData = (reviewImplementManagementId) => {
    setLoading(true)
    ResultsEntryApi({ reviewImplementManagementId }).then(res => {
      if (res.success) {
        let newData = JSON.parse(JSON.stringify(res.data));
        newData = newData.map(item => ({
          ...item,
          lineNum: getRandom(10),
          attachRelatedIds: getDocIdForArray(item.fileList),
        }));
        setData(v => ({ ...v, dataSource: newData }));
        setLoading(false)
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
  };


  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = (type) => {
    const servers = type === 'save' ? SaveResultsEntryApi : SubmitResultsEntryApi;
    servers(data.dataSource).then(res => {
      if (res.success) {
        message.success('保存成功');
        props.onOk();
      } else {
        message.error(res.message);
      }
    }).catch(err => {
      message.error(err.message);
    });
  };

  const clearSelected = () => {
    setData(v => ({ ...v, dataSource: [] }));
  };

  // 导出数据
  const exportData = () => {
    const url = `/service.api/${recommendUrl}/srController/downloadResultTemplate?reviewImplementManagementId=${props.id}`;
    window.open(url);
  };

  const onChange = (value) => {
    console.log('触发')
    setData(v => ({...v, dataSource: value}))
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
        <Button style={{ marginLeft: '5px' }} key="downLoad" onClick={exportData}>批量导出</Button>
      </div>
      <ProblemTable
        loading={loading}
        onChange={onChange}
        dataSource={data.dataSource}
      />
    </ExtModal>
  );

};
export default ResultsEntry;
