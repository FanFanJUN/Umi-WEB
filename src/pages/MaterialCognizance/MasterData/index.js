
import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal, Row, Col, Card, Empty, Checkbox } from 'antd';
import { samBaseUrl, recommendUrl } from '../../../utils/commonUrl';
import { ExtTable, utils } from 'suid';
import { AutoSizeLayout } from '../../../components';
import styles from './index.less';
import ModalFrom from './ModalFrom'
import RightModalFrom from './RightModalFrom'
import { deleteBatchByLeftId, deleteRightId } from '../../../services/MaterialService'
import { isEmpty } from '../../../utils'
const { authAction } = utils;
const confirm = Modal.confirm;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

const Index = () => {
  const tableLeftRef = useRef(null);
  const tableRightRef = useRef(null);
  const commonFormRef = useRef(null)
  const commonRightFormRef = useRef(null)
  const [rightselectRows, setRightSelectRows] = useState([]);
  const [rightselectedRowKeys, setRightSelectedRowKeys] = useState([]);
  const [leftselectRows, setLeftSelectRows] = useState([]);
  const [leftselectedRowKeys, setLeftSelectedRowKeys] = useState([]);
  const [tabtitle, setTabtitle] = useState(false);
  const [selectType, setSelectType] = useState(false);
  const [righttitle, setRightTabtitle] = useState(false);
  const [taaskType, setTaaskType] = useState(false);
  const [stageids, setStageids] = useState('');

  // 阶段表格
  const columnsforLeft = [
    { title: '代码', dataIndex: 'stageCode', width: 160 },
    { title: '认定阶段', dataIndex: 'identificationStage', width: 160 },
    { title: '排序号', dataIndex: 'changeSort', width: 100 },
  ].map(_ => ({ ..._, align: 'center' }));

  // 任务表格
  const columnsforRight = [
    { title: '代码', dataIndex: 'taskCode', width: 100 },
    { title: '认定任务', dataIndex: 'taskDesc', width: 180 },
    { title: '排序号', dataIndex: 'changeSort', width: 100 },
    {
      title: '默认必选', dataIndex: 'defaultRequired', width: 120,
      render: function (text, record, row) {
        if (text === 1) {
          return <Checkbox checked={true} disabled />;
        } else {
          return <Checkbox disabled />;
        }
      },
    },
  ].map(_ => ({ ..._, align: 'center' }));

  // 阶段新增
  async function handleLeftAdd() {
    setTabtitle('新增')
    setSelectType(false)
    cleanSelectedRecord()
    commonFormRef.current.handleModalVisible(true)
  }
  // 阶段编辑
  async function handlelLeftEdit() {
    setTabtitle('编辑')
    setSelectType(true)
    commonFormRef.current.handleModalVisible(true)
  }
  // 阶段删除
  async function handlelLeftDelete() {
    confirm({
      title: '是否确认删除',
      onOk: async () => {
        let params = leftselectRows[0].id;
        const { success, message: msg } = await deleteBatchByLeftId({ stageId: params });
        if (success) {
          message.success('删除成功！');
          uploadTable();
        } else {
          message.error(msg);
        }
      },
      onCancel() {
      },
    });
  }
  // 任务新增
  async function handleRightAdd() {
    setRightTabtitle('新增')
    setTaaskType(false)
    setRightSelectRows({ defaultRequired: 1 });
    tableRightRef.current.manualSelectedRows([])
    commonRightFormRef.current.handleModalVisible(true)
  }
  // 任务编辑
  async function handleRightEdit() {
    setRightTabtitle('编辑')
    setTaaskType(true)
    commonRightFormRef.current.handleModalVisible(true)
  }
  // 任务删除
  async function handleRightDelete() {
    confirm({
      title: '是否确认删除',
      onOk: async () => {
        let params = rightselectRows[0].id;
        const { success, message: msg } = await deleteRightId({ taskId: params });
        if (success) {
          message.success('删除成功！');
          RightCleanSelect();
          RightCleanSelect()
        } else {
          message.error(msg);
        }
      },
      onCancel() {
      },
    });
  }
  async function leftonSelectRow(value, rows) {
    setLeftSelectRows(rows);
    setLeftSelectedRowKeys(value);
    if (tableRightRef.current) {
      tableRightRef.current.remoteDataRefresh()
      tableRightRef.current.manualSelectedRows([])
    }
  }
  function rightonSelectRow(value, rows) {
    setRightSelectRows(rows);
    setRightSelectedRowKeys(value);
  }
  async function masterSave() {
    commonFormRef.current.handleModalVisible(false)
    uploadTable();
  }
  function uploadTable() {
    cleanSelectedRecord()
    tableLeftRef.current.remoteDataRefresh()
  }
  function cleanSelectedRecord() {
    // setLeftSelectRows([])
    // setLeftSelectedRowKeys([])
    tableLeftRef.current.manualSelectedRows([])
  }
  async function handleTask() {
    RightCleanSelect()
  }
  function RightCleanSelect() {
    setRightSelectRows([])
    setRightSelectedRowKeys([])
    tableRightRef.current.remoteDataRefresh()
    tableRightRef.current.manualSelectedRows([])
    commonRightFormRef.current.handleModalVisible(false)
  }

  const HeaderLeftButtons = () => {
    return (<div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
      {
        authAction(<Button
          type='primary'
          onClick={() => handleLeftAdd()}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          key='SRM-SM-PLANMASTERDATA-STAGE-ADD'
        >新增</Button>)
      }
      {
        authAction(<Button
          onClick={() => handlelLeftEdit()}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          disabled={leftselectedRowKeys.length === 0 || leftselectedRowKeys.length > 1}
          key='SRM-SM-PLANMASTERDATA-STAGE-EDIT'
        >编辑</Button>)
      }
      {
        authAction(<Button
          onClick={() => handlelLeftDelete()}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          disabled={leftselectedRowKeys.length === 0 || leftselectedRowKeys.length > 1}
          key='SRM-SM-PLANMASTERDATA-STAGE-DELETE'
        >删除</Button>)
      }
    </div>)
  };

  const HeaderTaskLeftButtons = () => {
    return (<div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
      {
        authAction(<Button
          type='primary'
          onClick={() => handleRightAdd()}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          key='SRM-SM-PLANMASTERDATA-TASK-ADD'
        >新增</Button>)
      }
      {
        authAction(<Button
          onClick={() => handleRightEdit()}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          disabled={rightselectedRowKeys.length === 0 || rightselectedRowKeys.length > 1}
          key='SRM-SM-PLANMASTERDATA-TASK-EDIT'
        >编辑</Button>)
      }
      {
        authAction(<Button
          onClick={() => handleRightDelete()}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          disabled={rightselectedRowKeys.length === 0 || rightselectedRowKeys.length > 1}
          key='SRM-SM-PLANMASTERDATA-TASK-DELETE'
        >删除</Button>)
      }
    </div>)
  };

  function renderEmpty() {
    return (
      <div style={{ paddingTop: '152px' }}><Empty description="请选择左侧有效数据进行下一步操作" className={styles.mt} /></div>
    );
  }

  return (
    <Fragment>
      <Row className={styles.around}>
        <Col span={11}>
          <Card title="认定阶段" bordered={false}>
            <AutoSizeLayout>
              {
                (h) => <ExtTable
                  rowKey={(v) => v.id}
                  height={h}
                  showSearch={false}
                  columns={columnsforLeft}
                  store={{
                    url: `${recommendUrl}/api/samPhysicalIdentificationStageService/findByPage`,
                    type: 'POST',
                  }}
                  allowCancelSelect={true}
                  remotePaging={true}
                  checkbox={{
                    multiSelect: false,
                  }}
                  ref={tableLeftRef}
                  onSelectRow={leftonSelectRow}
                  selectedRowKeys={leftselectedRowKeys}
                  toolBar={{
                    left: HeaderLeftButtons(),
                  }}
                />
              }
            </AutoSizeLayout>
            <ModalFrom
              title={tabtitle}
              modifydata={leftselectRows[0]}
              type={selectType}
              onOk={masterSave}
              wrappedComponentRef={commonFormRef}
            />
          </Card>
        </Col>
        <Col span={13} className={styles.right}>
          <div className={styles.triangle}></div>
          <Card title="认定任务"
            bordered={false}
            className={styles.maxHeight}
          >
            {
              leftselectedRowKeys.length !== 1 ? renderEmpty() :
                <div>
                  <AutoSizeLayout>
                    {
                      (h) => <ExtTable
                        columns={columnsforRight}
                        checkbox={{
                          multiSelect: false,
                        }}
                        remotePaging={true}
                        store={{
                          url: `${recommendUrl}/api/samPhysicalIdentificationTaskService/findByStageId?stageId=` + leftselectRows[0].id,
                          type: 'POST',
                        }}
                        height={h}
                        showSearch={false}
                        searchPlaceHolder={false}
                        selectedRowKeys={rightselectedRowKeys}
                        onSelectRow={rightonSelectRow}
                        ref={tableRightRef}
                        toolBar={{
                          left: HeaderTaskLeftButtons(),
                        }}
                      />
                    }
                  </AutoSizeLayout>
                  <RightModalFrom
                    title={righttitle}
                    leftId={leftselectRows[0].id}
                    modifydata={rightselectRows[0]}
                    type={taaskType}
                    onOk={handleTask}
                    wrappedComponentRef={commonRightFormRef}
                  />
                </div>

            }
          </Card>
        </Col>
      </Row>
    </Fragment>
  );

};

export default Form.create()(Index);
