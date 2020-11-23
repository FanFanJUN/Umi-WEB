import React, { useEffect, useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import { Button, Input, InputNumber, message } from 'antd';
import {
  GetSelfEvaluationTimeApi,
  SaveResultsEntryApi,
  SubmitResultsEntryApi,
  TheSelfAssessmentApi,
  ViewVendorSelfRating,
} from '../../commonApi';
import { getDocIdForArray } from '../../../../../utils/utilTool';
import { ApplicableStateArr, ApplicableStateProps } from '../../../../QualitySynergy/commonProps';
import Upload from '../../../../QualitySynergy/compoent/Upload';
import SendBack from './SendBack';

const SelfEvaluation = props => {
  let apiParams = [];
  const tableRef = useRef(null);

  // type为demand时为查看供应商自评、不存在时为自评
  const { type, visible, isView } = props;

  const columns = [
    {
      title: '', dataIndex: 'id', width: 1, render: v => {
      },
    },
    { title: '类别', dataIndex: 'systemName', width: 200, required: true },
    { title: '指标名称', dataIndex: 'ruleName', ellipsis: true, width: 100 },
    { title: '指标定义', dataIndex: 'definition', ellipsis: true, width: 250 },
    { title: '评分标准', dataIndex: 'scoringStandard', ellipsis: true, width: 250 },
    { title: '标准分', dataIndex: 'highestScore', width: 100, render: (v, data) => data.score ? data.score : v },
    {
      title: '不适用',
      dataIndex: 'whetherApply',
      width: 100,
      render: (v, data) => isView ? ApplicableStateArr[v] : !data.children && <ComboList
        onClick={e => e.stopPropagation()}
        afterSelect={value => {
          data.whetherApply = value.code;
          refreshTable();
        }}
        value={ApplicableStateArr[v]} {...ApplicableStateProps} />,
    },
    {
      title: '自评得分',
      dataIndex: 'reviewScore',
      width: 100,
      render: (v, data) => isView ? data.selfScore ? data.selfScore : v :
        (!data.children ? <InputNumber
          onBlur={refreshTable}
          value={v} max={data.highestScore}
          onChange={value => data.reviewScore = value} min={0} /> : data.selfScore),
    },
    {
      title: '情况说明', dataIndex: 'remark', width: 200,
      render: (v, data) => isView ? v : !data.children &&
        <Input value={v} onChange={e => {
          data.remark = e.target.value;
          refreshTable();
        }} />,
    },
    {
      title: '附件', dataIndex: 'attachRelatedIds', width: 150,
      render: (v, data) => !data.children && <Upload
        entityId={v} type={isView ? 'show' : ''}
        onChange={(value) => data.attachRelatedIds = value}
      />,
    },
  ].map(item => ({ ...item, align: 'center' }));

  const [data, setData] = useState({
    time: '',
    dataSource: [],
    sendBackVisible: false
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.visible) {
      if(type) {
        getTime(props.reviewImplementPlanCode)
      }
      getTable(props.reviewImplementPlanCode);
    }
  }, [props.visible]);

  // 获取自评时间
  const getTime = (value) => {
    GetSelfEvaluationTimeApi({
      reviewImplementPlanCode: value
    }).then(res => {
      if (res.success) {
        const time = res.data ? res.data[0].completedDate : ''
        setData(v => ({...v, time}))
      }
      console.log(res, 'ssss')
    })
  }

  const buildTree = (arr) => {
    arr.map(item => {
      if (item.reviewResultList) {
        item.children = [];
        let reviewResultList = JSON.parse(JSON.stringify(item.reviewResultList));
        reviewResultList = reviewResultList.map(value => ({
          ...value,
          attachRelatedIds: getDocIdForArray(value.fileList),
        }));
        item.children.push(...reviewResultList);
      } else {
        buildTree(item.children ? item.children : []);
      }
    });
    return arr;
  };

  const getTable = (value) => {
    setLoading(true);
    const servers = type ? ViewVendorSelfRating : TheSelfAssessmentApi;
    servers({
      ...type ? { reviewImplementPlanCode: value } : { reviewImplementManagementId: value },
    }).then(res => {
      if (res.success) {
        let arr = res.data ? res.data : [];
        arr = buildTree(arr);
        console.log(arr);
        setData(v => ({ ...v, dataSource: arr }));
        setLoading(false);
      } else {
        message.error(res.messages);
      }
    }).catch(err => {
      message.error(err.messages);
    });
  };

  //构造参数
  const buildParams = (arr) => {
    arr.map(item => {
      if (item.children) {
        buildParams(item.children);
      } else {
        apiParams.push(item);
      }
    });
  };

  const onOk = () => {
    apiParams = [];
    let arr = JSON.parse(JSON.stringify(data.dataSource));
    buildParams(arr);
    SubmitResultsEntryApi(apiParams).then(res => {
      if (res.success) {
        props.onCancel();
      } else {
        message.error(res.messages);
      }
    }).catch(err => message.error(err.messages));
  };

  const clearSelected = () => {
    setData(v => ({ ...v, dataSource: [] }));
  };

  const onCancel = () => {
    props.onCancel();
  };

  // 刷新table
  const refreshTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 退回
  const sendBack = () => {
    setData(v => ({...v, sendBackVisible: true}))
  }

  return (
    <ExtModal
      width={'170vh'}
      maskClosable={false}
      visible={visible}
      title={type ? '查看供应商自评' : '自评'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      {
        type ?
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!isView && <Button onClick={sendBack}>退回</Button>}
            <span style={{ marginLeft: '50px' }}>自评时间:</span>
            <Input style={{ width: '350px', marginLeft: '5px' }}
                   disabled={true} value={data.time}/>
          </div>
          : <>
            <Button>批量导入</Button>
          </>
      }
      <ExtTable
        rowKey={'id'}
        loading={loading}
        ref={tableRef}
        bordered={true}
        style={{ marginTop: '10px' }}
        showSearch={false}
        columns={columns}
        dataSource={data.dataSource}
        defaultExpandAllRows={true}
        lineNumber={true}
      />
      <SendBack
        refresTable={refreshTable}
        params={{
          reviewImplementManagementId: data.dataSource[0] ? data.dataSource[0].id : ''
        }}
        onCancel={() => setData(v => ({...v, sendBackVisible: false}))}
        visible={data.sendBackVisible}
      />
    </ExtModal>
  );
};

export default SelfEvaluation;
