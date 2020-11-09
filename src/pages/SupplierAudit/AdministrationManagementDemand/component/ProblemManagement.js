import React, { useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import styles from './index.less';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import BU from '../../../QualitySynergy/mainData/BU';
import ProblemAdd from './ProblemAdd';

const FormItem = Form.Item;

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

const ProblemManagement = (props) => {

  const columns = [
    { title: '部门/过程', dataIndex: 'reviewRequirementCode', width: 150 },
    { title: '问题描述', dataIndex: 'reviewRequirementName', ellipsis: true, width: 300 },
    { title: '严重程度', dataIndex: 'applyCorporationName', ellipsis: true, width: 180 },
    { title: '要求整改完成日期', dataIndex: 'applyDepartmentName', ellipsis: true, width: 200 },
  ].map(item => ({ ...item, align: 'center' }));

  const tableRef = useRef(null);

  const { type, form, userInfo, isView, editData } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const [data, setData] = useState({
    dataSource: [{
      lineNum: 1,
      orgName: 'true',
    }],
    type: 'add',
    title: '新增',
    visible: true,
    selectedRowKeys: [],
    selectedRowRows: [],
  });

  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {

  };

  const clearSelected = () => {

  };

  const handleSelectedRows = (keys, rows) => {
    setData(v => ({ ...v, selectedRowRows: rows, selectedRowKeys: keys }));
  };

  const showProblemAdd = (type) => {
    switch (type) {
      case 'add':
        setData(v => ({ ...v, visible: true, title: '新增', type }));
    }
  };

  return (
    <ExtModal
      width={'130vh'}
      maskClosable={false}
      visible={visible}
      title={'问题管理'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <div className={styles.wrapper}>
        <div className={styles.bgw}>
          <div className={styles.title}>指标信息</div>
          <div className={styles.content}>
            <Row>
              <Col span={12}>
                <FormItem {...formLongLayout} label={'指标名称'}>
                  {
                    getFieldDecorator('attachRelatedIds', {
                      initialValue: type === 'add' ? '' : editData.fileList,
                    })(
                      <Input disabled={true} placeholder="请输入指标名称" style={{ width: '100' }}/>,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formLongLayout} label={'指标定义'}>
                  {
                    getFieldDecorator('attachRelatedIds', {
                      initialValue: type === 'add' ? '' : editData.fileList,
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
                    getFieldDecorator('attachRelatedIds', {
                      initialValue: type === 'add' ? '' : editData.fileList,
                    })(
                      <Input.TextArea disabled={true} rows={4} placeholder="请输入评分标准" style={{ width: '100%' }}/>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.title}>问题</div>
          <div className={styles.content}>
            <div>
              <Button style={{ marginRight: '5px' }} onClick={() => showProblemAdd('add')}>新增</Button>
              <Button style={{ marginRight: '5px' }}>编辑</Button>
              <Button style={{ marginRight: '5px' }}>删除</Button>
              <Button>批导入</Button>
            </div>
            <ExtTable
              style={{ marginTop: '10px' }}
              height={'25vh'}
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
          </div>
        </div>
      </div>
      <ProblemAdd
        type={data.type}
        title={data.title}
        visible={data.visible}
        onCancel={() => setData(v => ({ ...v, visible: false }))}
      />
    </ExtModal>
  );

};

export default Form.create()(ProblemManagement);
