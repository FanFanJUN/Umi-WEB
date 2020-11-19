import React, { useEffect, useRef, useState } from 'react';
import { Button, message } from 'antd';
import { ExtTable } from 'suid';
import EventModal from '../../../common/EventModal';
import {
  AuthenticationTypeArr,
  AuthenticationTypeConfig,
  IssuesManagementApi,
  OrderSeverityArr,
  SendProblemApi, validationProblemApi, VerificationResultConfig, whetherArr,
} from '../../../AuditRequirementsManagement/commonApi';
import { getRandom } from '../../../../QualitySynergy/commonProps';
import AnswerQuestionModal from '../../../AdministrationManagementSupplier/component/AnswerQuestionModal';
import Upload from '../../../../QualitySynergy/compoent/Upload';
import { getDocIdForArray } from '../../../../../utils/utilTool';

const IssuesManagement = (props) => {

  const tableRef = useRef(null);

  const { type, id } = props;

  const columns = [
    { title: '指标', dataIndex: 'ruleName', width: 200, required: true },
    { title: '部门/过程', dataIndex: 'department', ellipsis: true, width: 100 },
    { title: '问题描述', dataIndex: 'problemDescribe', ellipsis: true, width: 200 },
    { title: '严重程度', dataIndex: 'severity', width: 180, render: v => OrderSeverityArr[v] },
    { title: '要求整改完成日期', dataIndex: 'demandCompletionTime', width: 200 },
    { title: '提出人', dataIndex: 'proposerName', width: 100 },
    { title: '原因分析', dataIndex: 'reason', width: 100 },
    {
      title: '纠正预防措施及见证附件', dataIndex: 'preventiveMeasures', width: 300, render: (v, data) => <>
        {v} {data.measures}
        <Upload type='show' entityId={data.attachRelatedIds} />
      </>,
    },
    { title: '完成时间', dataIndex: 'completionTime', width: 100 },
    { title: '验证类型', dataIndex: 'checkType', width: 100, render: v => AuthenticationTypeArr[v] },
    { title: '验证结果', dataIndex: 'checkResult', width: 50, render: v => whetherArr[v] },
  ].map(item => ({ ...item, align: 'center' }));

  useEffect(() => {
    getTableData(props.reviewImplementPlanCode);
  }, []);

  const getTableData = (reviewImplementPlanCode) => {
    setData(v => ({ ...v, loading: true }));
    IssuesManagementApi({
      reviewImplementPlanCode,
    }).then(res => {
      if (res.success) {
        let arr = res.data.slice();
        arr = arr.map(item => ({
          ...item,
          lineNum: getRandom(10),
          attachRelatedIds: getDocIdForArray(item.fileList),
        }));
        setData(v => ({ ...v, dataSource: arr, loading: false }));
      } else {
        message.error(res.message);
      }
    }).catch(err => {
      message.error(err.message);
    });
  };

  const [data, setData] = useState({
    validationData: {},
    type: 'edit',
    editData: {},
    title: '验证管理',
    // 验证管理
    visible: false,
    // 回答问题界面
    answerQuestionVisible: false,
    disabled: true,
    dataSource: [],
    selectRows: [],
    selectKeys: [],
  });

  const fieldsConfig = [
    {
      key: 1,
      name: '验证类型',
      type: 'comboList',
      code: 'checkTypeName',
      config: AuthenticationTypeConfig,
      field: ['checkType'],
    },
    {
      key: 1,
      name: '验证结果',
      type: 'comboList',
      code: 'checkResultName',
      config: VerificationResultConfig,
      field: ['checkResult'],
    },
  ];

  // 返回数组
  useEffect(() => {
    if (data.dataSource && data.dataSource.length !== 0) {
      props.onChange(data.dataSource);
    }
  }, [data.dataSource]);

  // 回答问题
  const answerQuestion = () => {
    setData(v => ({ ...v, answerQuestionVisible: true }));
  };

  const onSelectRow = (keys, rows) => {
    let newData = rows[0] ? rows[0] : {};
    if (newData.checkType) {
      newData.checkType = AuthenticationTypeArr[newData.checkType];
    }
    if (newData.checkResult) {
      newData.checkResult = whetherArr[newData.checkResult];
    }
    console.log(newData)
    setData(v => ({
      ...v,
      selectKeys: keys,
      selectRows: rows,
      editData: rows[0] ? rows[0] : {},
      validationData: newData,
      disabled: newData.attachRelatedIds ? newData.attachRelatedIds.length === 0 : true
    }));
  };

  const handleOk = value => {
    let newData = Object.assign(data.validationData, value);
    validationProblemApi([newData]).then(res => {
      if (res.success) {
        setData(v => ({ ...v, visible: false }));
        refreshTable();
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    }).catch(err => {
      message.error(err.message);
    });
  };

  const handleClick = () => {
    setData(v => ({ ...v, visible: true }));
  };

  const AnswerQuestionOk = (value) => {
    let newArr = data.dataSource.slice();
    newArr.map((item, index) => {
      if (item.lineNum === data.selectKeys[0]) {
        newArr[index] = value;
      }
    });
    setData(v => ({ ...v, dataSource: newArr, answerQuestionVisible: false }));
    refreshTable();
  };

  // 刷新table
  const refreshTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 发送问题
  const sendProblem = () => {
    SendProblemApi({
      reviewImplementManagementId: id,
    }).then(res => {
      if (res.success) {
        message.success('发送成功!');
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
  };

  return (
    <>
      {
        type === 'demand' ? <>
          <Button onClick={sendProblem}>发送问题</Button>
          <Button disabled={data.disabled} style={{ marginLeft: '5px' }} onClick={handleClick}>验证管理</Button>
        </> : <>
          <Button onClick={answerQuestion} disabled={data.selectKeys.length === 0}>回答问题</Button>
          <Button style={{ marginLeft: '5px' }} onClick={handleClick}>批量导入</Button>
        </>
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
        onSelectRow={onSelectRow}
        selectedRowKeys={data.selectKeys}
        columns={columns}
        ref={tableRef}
        dataSource={data.dataSource}
      />
      <EventModal
        onCancel={() => setData((value) => ({ ...value, visible: false }))}
        onOk={handleOk}
        data={data.validationData}
        fieldsConfig={fieldsConfig}
        propData={{
          visible: data.visible,
          type: data.type,
          title: data.title,
        }}
      />
      <AnswerQuestionModal
        onCancel={() => setData(v => ({ ...v, answerQuestionVisible: false, editData: {} }))}
        onOk={AnswerQuestionOk}
        editData={data.editData}
        visible={data.answerQuestionVisible}
      />
    </>
  );
};

export default IssuesManagement;
