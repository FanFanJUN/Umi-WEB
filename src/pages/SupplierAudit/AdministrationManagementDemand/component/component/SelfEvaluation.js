import React, { useEffect, useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import { Button, Input, InputNumber, message, Upload as ImportUpload } from 'antd';
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
import { recommendUrl } from '../../../../../utils/commonUrl';
import { BASE_URL } from '../../../../../utils/constants';

const SelfEvaluation = props => {
  let apiParams = [];
  const tableRef = useRef(null);

  // type为demand时为查看供应商自评、不存在时为自评
  const { type, visible, isView } = props;

  const [fileList, setFileList] = useState([]);

  const [updateLoading, setUpdateLoading] = useState(false);

  const columns = [
    {
      title: '', dataIndex: 'id', width: 1, render: v => {
      },
    },
    { title: '类别', dataIndex: 'systemName', width: 100, required: true, render: (v, data) => data.children && v },
    { title: '指标名称', dataIndex: 'ruleName', ellipsis: true, width: 100 },
    { title: '指标定义', dataIndex: 'definition', ellipsis: true, width: 120 },
    { title: '评分标准', dataIndex: 'scoringStandard', ellipsis: true, width: 120 },
    { title: '标准分', dataIndex: 'highestScore', width: 100, render: (v, data) => data.score ? data.score : v },
    {
      title: '不适用',
      dataIndex: 'whetherApply',
      width: 100,
      render: (v, data) => type ? data.notApplyScore ? data.notApplyScore : ApplicableStateArr[v] : !data.children ?
        <ComboList
          onClick={e => e.stopPropagation()}
          afterSelect={value => {
            data.whetherApply = value.code;
            changeSelfScore();
            refreshTable();
          }}
          value={ApplicableStateArr[v]} {...ApplicableStateProps} /> : data.notApplyScore,
    },
    {
      title: '自评得分',
      dataIndex: 'reviewScore',
      width: 100,
      render: (v, data) => type ? data.selfScore ? data.selfScore : v :
        (!data.children ? <InputNumber
          onBlur={refreshTable}
          precision={1}
          value={v} max={data.highestScore}
          onChange={value => {
            data.reviewScore = value;
            changeSelfScore();
          }} min={0} /> : data.selfScore),
    },
    {
      title: '情况说明', dataIndex: 'remark', width: 150,
      render: (v, data) => type ? v : !data.children &&
        <Input value={v} onChange={e => {
          data.remark = e.target.value;
          refreshTable();
        }} />,
    },
    {
      title: '附件', dataIndex: 'attachRelatedIds', width: 150,
      render: (v, data) => !data.children && <Upload
        entityId={v} type={type ? 'show' : ''}
        onChange={(value) => {
          data.attachRelatedIds = value;
        }}
      />,
    },
  ].map(item => ({ ...item, align: 'center' }));

  const [data, setData] = useState({
    time: '',
    dataSource: [],
    sendBackVisible: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.visible) {
      if (type) {
        getTime(props.reviewImplementPlanCode);
      }
      getTable(props.reviewImplementPlanCode);
    }
  }, [props.visible]);

  // 获取自评时间
  const getTime = (value) => {
    GetSelfEvaluationTimeApi({
      reviewImplementPlanCode: value,
    }).then(res => {
      if (res.success) {
        const time = res.data ? res.data[0].completedDate : '';
        setData(v => ({ ...v, time }));
      }
      console.log(res, 'ssss');
    });
  };

  // 体系计算总和
  const systemCalculate = (arr, value) => {
    if (value.parentId) {
      arr.map(item => {
        if (item.systemId === value.parentId) {
          let num = 0;
          let notApplyScoreNum = 0;
          item.children.forEach(v => num = num + (v.reviewScore ? v.reviewScore : v.selfScore) || 0);
          item.children.forEach(v => notApplyScoreNum = notApplyScoreNum + (v.notApplyScore ? v.notApplyScore : 0));
          item.selfScore = num;
          item.notApplyScore = notApplyScoreNum;
        } else {
          if (item.children && item.children.length !== 0) {
            systemCalculate(item.children, value);
          }
        }
      });
    }
  };

  // 指标计算总和
  const calculate = (arr) => {
    if (Array.isArray(arr)) {
      arr.map(item => {
        if (item.children && item.children.length !== 0) {
          if (item.children[0].definition) {
            let num = 0;
            let notApplyScoreNum = 0;
            item.children.forEach(v => notApplyScoreNum = notApplyScoreNum + (v.whetherApply ? (v.highestScore ? v.highestScore : 0) : 0));
            item.children.forEach(v => num = num + v.reviewScore);
            item.selfScore = num;
            item.notApplyScore = notApplyScoreNum;
            systemCalculate(data.dataSource, item);
          } else {
            calculate(item.children);
          }
        }
      });
    }
  };

  // 修改指标的得分改变体系计算的总分
  const changeSelfScore = () => {
    calculate(data.dataSource);
    console.log(data.dataSource);
  };

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
        props.onCancel('ok');
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
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
    setData(v => ({ ...v, sendBackVisible: true }));
  };

  const exportData = () => {
    const url = `${window.location.origin}${BASE_URL}/${recommendUrl}/srController/downloadResultTemplate?reviewImplementManagementId=${props.reviewImplementPlanCode}`;
    window.open(url);
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
        newData = buildTree(newData);
        setData(v => ({ ...v, dataSource: newData }));
        console.log(newData, '导入的数据');
        message.success('导入成功');
        setUpdateLoading(false);
      } else if (response.status === 'FAILURE') {
        message.error(response.message);
        setUpdateLoading(false);
      }
    } else if (status === 'error') {
      setUpdateLoading(false);
      message.error('上传失败');
    }
  };

  return (
    <ExtModal
      width={'145vh'}
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
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {!isView && <Button onClick={sendBack} disabled={!data.time}>退回</Button>}
            <span style={{ marginLeft: '50px' }}>自评时间:</span>
            <Input style={{ width: '350px', marginLeft: '5px' }}
                   disabled={true} value={data.time} />
          </div>
          : <>
            <Button style={{ marginRight: '5px', marginBottom: '10px' }} key="downLoad" onClick={exportData}>批量导出</Button>
            <ImportUpload
              name="file"
              beforeUpload={beforeUpload}
              showUploadList={false}
              fileList={fileList}
              action={window.location.origin + BASE_URL + `${recommendUrl}/srController/importResultForSupplier`}
              data={{
                reviewImplementManagementId: props.reviewImplementPlanCode,
              }}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              <Button type='primary' style={{ marginLeft: 5 }} key="chooseFile" loading={updateLoading}>
                批量录入
              </Button>
            </ImportUpload>
          </>
      }
      <ExtTable
        rowKey={'id'}
        loading={loading}
        ref={tableRef}
        pagination={false}
        bordered={true}
        showSearch={false}
        columns={columns}
        dataSource={data.dataSource}
        defaultExpandAllRows={true}
        lineNumber={true}
      />
      <SendBack
        refresTable={onCancel}
        params={{
          reviewImplementManagementId: data.dataSource[0] ? data.dataSource[0].reviewImplementManagementId : '',
        }}
        onCancel={() => setData(v => ({ ...v, sendBackVisible: false }))}
        visible={data.sendBackVisible}
      />
    </ExtModal>
  );
};

export default SelfEvaluation;
