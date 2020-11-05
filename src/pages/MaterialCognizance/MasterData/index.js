
import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal, Row, Col, Card, Empty } from 'antd';
//import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../utils/commonUrl';
import { ExtTable, utils } from 'suid';
import { AutoSizeLayout } from '../../../components';
import styles from '../index.less';
import ModalFrom from './ModalFrom'
const { authAction } = utils;

const DEVELOPER_ENV = process.env.NODE_ENV === 'development';

const Index = () => {
  const tableLeftRef = useRef(null);
  const tableRightRef = useRef();
  const commonFormRef = useRef(null)
  const [rightselectRows, setRightSelectRows] = useState([]);
  const [rightselectedRowKeys, setRightSelectedRowKeys] = useState([]);
  const [leftselectRows, setLeftSelectRows] = useState([]);
  const [leftselectedRowKeys, setLeftSelectedRowKeys] = useState([]);
  const columnsforLeft = [
    { title: '代码', dataIndex: 'name', width: 200 },
    { title: '认定阶段', dataIndex: 'rank', ellipsis: true },
  ];

  const columnsforRight = [
    { title: '代码', dataIndex: 'buCode', width: 120 },
    { title: '认定任务', dataIndex: 'orderNo',  width: 200  },
    { title: '排序号', dataIndex: 'orderNo',  width: 120  },
  ];

  async function handleAdd () {
    commonFormRef.current.handleModalVisible(true)
  }
  async function handleDelete () {

  }
  function leftonSelectRow(value, rows) {
    setLeftSelectRows(rows);
    setLeftSelectedRowKeys(value);
  }
  function rightonSelectRow (value, rows) {
    setRightSelectRows(rows);
    setRightSelectedRowKeys(value);
  }
  async function masterSave() {
    commonFormRef.current.handleModalVisible(false)
  }
  const HeaderLeftButtons = () => {
    return (<div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
      {
        authAction(<Button
          type='primary'
          onClick={() => handleAdd()}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          key='QUALITYSYNERGY_BUCOR_ADD'
        >分配认定任务</Button>)
      }
      {
        authAction(<Button
          onClick={() => handleDelete()}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          disabled={leftselectedRowKeys.length === 0 || leftselectedRowKeys.length > 1}
          key='QUALITYSYNERGY_BUCOR_EDIT'
        >移除认定任务</Button>)
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
                  columns={columnsforLeft}
                  store={{
                    url: `${baseUrl}/reviewArea/findBySearchPage`,
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
                        checkbox={true}
                        remotePaging={true}
                        store={{
                          url: `${baseUrl}/reviewCity/findBySearchPage`,
                          type: 'POST',
                          params: {
                            areaID: leftselectRows[leftselectRows.length - 1].id
                          }
                        }}
                        height={h}
                        showSearch={false}
                        searchPlaceHolder={false}
                        selectedRowKeys={rightselectedRowKeys}
                        onSelectRow={rightonSelectRow}
                        ref={tableRightRef}
                      />
                    }
                  </AutoSizeLayout>
                </div>

            }
          </Card>
        </Col>
      </Row>
    </Fragment>
  );

};

export default Form.create()(Index);
