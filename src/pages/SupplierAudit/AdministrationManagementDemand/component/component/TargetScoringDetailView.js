import React, { useEffect, useRef, useState } from 'react';
import { ExtModal, ExtTable } from 'suid';
import styles from '../index.less';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { GetTargetScoringDetailApi, whetherArr } from '../../commonApi';
import Upload from '../../../../QualitySynergy/compoent/Upload';
import SendBack from './SendBack';
import ProblemManagement from '../ProblemManagement';

const formLongLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const FormItem = Form.Item;

const TargetScoringDetailView = (props) => {

  const columns = [
    { title: '评分人', dataIndex: 'memberName', width: 150 },
    { title: '不适用', dataIndex: 'whetherApply', width: 100, render: v => whetherArr[v] },
    { title: '评分', dataIndex: 'reviewScore', width: 180 },
    { title: '情况记录', dataIndex: 'remark', ellipsis: true, width: 300 },
    {
      title: '附件',
      dataIndex: 'fileList',
      width: 150,
      render: v => <Upload entityId={v} type={'show'}/>,
    },
    {
      title: '问题',
      dataIndex: 'problemList',
      ellipsis: true,
      width: 150,
      render: v => <div><Button onClick={() => lookProblemManage(v)}>问题管理</Button> {v.length}</div>,
    },
  ].map(item => ({ ...item, align: 'center' }));

  const tableRef = useRef(null);

  const [problemVisible, setProblemVisible] = useState(false);

  const [sendBackVisible, setSendBackVisible] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const [loading, setLoading] = useState(false);

  const [editData, setEditData] = useState({});

  const [data, setData] = useState({
    selectedRowKeys: [],
    selectedRowRows: [],
  });

  const [problemData, setProblemData] = useState({});

  const { visible, params, isView } = props;

  const { getFieldDecorator } = props.form;

  useEffect(() => {
    if (visible) {
      getTableData();
    }
  }, [visible]);

  const getTableData = () => {
    setLoading(true);
    GetTargetScoringDetailApi(params).then(res => {
      if (res.success) {
        if (res.data) {
          setEditData({
            ruleCode: res.data.ruleCode,
            ruleName: res.data.ruleName,
            definition: res.data.definition,
            highestScore: res.data.highestScore,
            score: res.data.score,
            scoringStandard: res.data.scoringStandard,
          });
          setDataSource(res.data.lineList);
        }
        setLoading(false);
      } else {
        message.error(res.message);
      }
      console.log(res);
    }).catch(err => message.error(err.message));
  };

  const handleOk = () => {
    if (isView) {
      handleCancel();
    }
  };

  const lookProblemManage = (data) => {
    setProblemVisible(true);
    setProblemData({
      problemList: data,
      ruleName: data[0].ruleName,
      definition: data[0].ruleName,
      scoringStandard: data[0].scoringStandard,
    });
  };

  const handleCancel = () => {
    props.onCancel();
  };

  const handleSelectedRows = (keys, rows) => {
    console.log(rows);
    setData(v => ({ ...v, selectedRowKeys: keys, selectedRowRows: rows }));
  };

  // 刷新table
  const refreshTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  const handleSendBack = () => {
    setSendBackVisible(true);
  };

  const clearSelected = () => {
    setDataSource([]);
    setEditData({});
  };

  return (
    <ExtModal
      width={'150vh'}
      maskClosable={false}
      destroyOnClose={true}
      title={'指标评审得分详情'}
      visible={visible}
      onOk={handleOk}
      afterClose={clearSelected}
      onCancel={handleCancel}
    >
      <div className={styles.wrapper}>
        <div className={styles.bgw}>
          <div className={styles.title}>指标信息</div>
          <div className={styles.content}>
            <Row>
              <Col span={12}>
                <FormItem {...formLongLayout} label={'指标名称'}>
                  {
                    getFieldDecorator('ruleName', {
                      initialValue: editData.ruleName,
                    })(
                      <Input disabled={true} placeholder="请输入指标名称" style={{ width: '100' }}/>,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formLongLayout} label={'指标定义'}>
                  {
                    getFieldDecorator('definition', {
                      initialValue: editData.definition,
                    })(
                      <Input disabled={true} placeholder="请输入指标定义" style={{ width: '100' }}/>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formLayout} label={'评分标准'}>
                  {
                    getFieldDecorator('scoringStandard', {
                      initialValue: editData.scoringStandard,
                    })(
                      <Input.TextArea disabled={true} rows={4} placeholder="请输入评分标准" style={{ width: '100%' }}/>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formLongLayout} label={'最高得分'}>
                  {
                    getFieldDecorator('highestScore', {
                      initialValue: editData.highestScore,
                    })(
                      <Input disabled={true} placeholder="请输入最高得分" style={{ width: '100' }}/>,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formLongLayout} label={'审核得分'}>
                  {
                    getFieldDecorator('score', {
                      initialValue: editData.score,
                    })(
                      <Input disabled={true} placeholder="请输入审核得分" style={{ width: '100' }}/>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.title}>评分详情</div>
          <div className={styles.content}>
            {!isView && <Button onClick={handleSendBack} disabled={data.selectedRowKeys.length === 0}>退回</Button>}
            <ExtTable
              style={{ marginTop: '10px' }}
              height={'25vh'}
              rowKey={'reviewImplementManagementId'}
              loading={loading}
              checkbox={{ multiSelect: false }}
              onSelectRow={handleSelectedRows}
              selectedRowKeys={data.selectedRowKeys}
              allowCancelSelect={true}
              showSearch={false}
              remotePaging
              size='small'
              columns={columns}
              ref={tableRef}
              dataSource={dataSource}
            />
          </div>
        </div>
      </div>
      <ProblemManagement
        type={'show'}
        onOk={() => setProblemVisible(false)}
        editData={problemData}
        onCancel={() => setProblemVisible(false)}
        visible={problemVisible}
      />
      <SendBack
        refresTable={handleCancel}
        params={{
          reviewImplementManagementId: data.selectedRowRows[0] ? data.selectedRowRows[0].reviewImplementManagementId : '',
          ruleName: editData.ruleName,
          ruleCode: editData.ruleCode,
        }}
        onCancel={() => setSendBackVisible(false)}
        visible={sendBackVisible}
      />
    </ExtModal>
  );

};

export default Form.create()(TargetScoringDetailView);
