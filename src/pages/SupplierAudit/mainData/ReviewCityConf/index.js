/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-12 14:44:24
 * @LastEditTime: 2020-10-21 14:32:58
 * @Description: 审核地区城市配置
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/mainData/ReviewCityConf/index.js
 */
import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message, Modal, Row, Col, Card, Empty } from 'antd';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl } from '../../../../utils/commonUrl';
import { ExtTable, utils } from 'suid';
import {
  AddBUCompanyOrganizationRelation, DeleteBUCompanyOrganizationRelation, FrostBUCompanyOrganizationRelation, judgeButtonDisabled,
} from '../../../QualitySynergy/commonProps';
import { AutoSizeLayout } from '../../../../components';
import stylesRight from './index.less';
import EventModal from '../../common/EventModal';
import { requestDelApi, requestPostApi } from '../mainDataService';

const { authAction } = utils;

const DEVELOPER_ENV = process.env.NODE_ENV === 'development';

const Index = () => {

  const [data, setData] = useState({
    leftVisible: false,
    rightVisible: false,
    leftTitle: '审核区域新增',
    rigthTitle: '城市新增',
    letfType: 'add',
    rightType: 'add',
  });

  const tableLeftRef = useRef(null);

  const tableRightRef = useRef();

  const [rightselectRows, setRightSelectRows] = useState([]);

  const [rightselectedRowKeys, setRightSelectedRowKeys] = useState([]);

  const [leftselectRows, setLeftSelectRows] = useState([]);

  const [leftselectedRowKeys, setLeftSelectedRowKeys] = useState([]);

  const columnsforLeft = [
    { title: '区域', dataIndex: 'name', width: 200 },
    { title: '排序号', dataIndex: 'rank', ellipsis: true },
  ];

  const leftfieldsConfig = [
    {
      name: '区域名称',
      code: 'name',
    },
    {
      name: '区域代码',
      code: 'code',
    },
    {
      name: '排序号',
      code: 'rank',
      type: 'inputNumber'
    }
  ];

  const columnsforRight = [
    { title: '代码', dataIndex: 'buCode', width: 200 },
    { title: '名称', dataIndex: 'orderNo', ellipsis: true },
  ];

  const rightfieldsConfig = [
    {
      name: '代码',
      code: 'xx',
    },
    {
      name: '名称',
      code: 'xx',
    }
  ];

  const buttonLeftClick = async (type) => {
    switch (type) {
      case 'add':
        setData((value) => ({ ...value, leftTitle: '审核地区新增', leftVisible: true, letfType: 'add' }));
        break;
      case 'edit':
        setData((value) => ({ ...value, leftVisible: true, leftTitle: '审核地区编辑', letfType: 'edit' }));
        break;
      case 'delete':
        await deleteData();
        break;
      case 'frost':
        await editData();
        break;
    }
  };

  const editData = async () => {
    const data = await requestPostApi({
      ids: leftselectedRowKeys.toString(),
      frozen: !leftselectRows[0]?.frozen,
    });
    if (data.success) {
      tableLeftRef.current.manualSelectedRows();
      tableLeftRef.current.remoteDataRefresh();
    }
  };

  const deleteData = async () => {
    Modal.confirm({
      title: '删除',
      content: '是否删除选中过的数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      async onOk() {
        const data = await requestDelApi({
          ids: leftselectedRowKeys.toString(),
          key: 'LeftReviewCityConf'
        });
        if (data.success) {
          tableLeftRef.current.manualSelectedRows();
          tableLeftRef.current.remoteDataRefresh();
        }
      },
    });
  };

  const leftonSelectRow = (value, rows) => {
    setLeftSelectRows(rows);
    setLeftSelectedRowKeys(value);
  };

  const rightonSelectRow = (value, rows) => {
    setRightSelectRows(rows);
    setRightSelectedRowKeys(value);
  };

  const HeaderLeftButtons = () => {
    return (<div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
      {
        authAction(<Button
          type='primary'
          onClick={() => buttonLeftClick('add')}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          key='QUALITYSYNERGY_BUCOR_ADD'
        >新增</Button>)
      }
      {
        authAction(<Button
          onClick={() => buttonLeftClick('edit')}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          disabled={leftselectedRowKeys.length === 0 || leftselectedRowKeys.length > 1}
          key='QUALITYSYNERGY_BUCOR_EDIT'
        >编辑</Button>)
      }
      {
        authAction(<Button
          onClick={() => buttonLeftClick('delete')}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          disabled={leftselectedRowKeys.length === 0}
          key='QUALITYSYNERGY_BUCOR_DELETE'
        >删除</Button>)
      }
    </div>)
  };

  const handleCancel = (visible) => {
    setData(() => ({ [visible]: false }));
  }

  const handleLeftOk = async (value) => {
    if (data.letfType === 'add') {
      requestPostApi({ ...value, key: 'LeftReviewCityConf' }).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, leftVisible: false }));
          tableLeftRef.current.manualSelectedRows();
          tableLeftRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    } else {
      const id = leftselectRows[leftselectRows.length - 1].id;
      const params = { ...value, id, key: 'LeftReviewCityConf' };
      requestPostApi(params).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, leftVisible: false }));
          tableLeftRef.current.manualSelectedRows();
          tableLeftRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    }
    console.log(value, 'save');
  };

  const handleRightOk = async (value) => {
    if (data.rightType === 'add') {
      requestPostApi({ ...value, key: 'RightReviewCityConf' }).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, rightVisible: false }));
          tableRightRef.current.manualSelectedRows();
          tableRightRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    } else {
      const id = rightselectRows[rightselectRows.length - 1].id;
      const params = { ...value, id, key: 'RightReviewCityConf' };
      requestPostApi(params).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, rightVisible: false }));
          tableRightRef.current.manualSelectedRows();
          tableRightRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    }
    console.log(value, 'save');
  };

  function renderEmpty() {
    return (
      <div style={{ paddingTop: '152px' }}><Empty description="请选择左侧有效数据进行下一步操作" className={styles.mt} /></div>
    );
  }

  return (
    <Fragment>
      <Row className={stylesRight.around}>
        <Col span={11}>
          <Card title="审核地区" bordered={false}>
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
            {data.leftVisible &&
              <EventModal
                onCancel={() => handleCancel('leftVisible')}
                onOk={handleLeftOk}
                propData={{ ...data, visible: data.leftVisible, title: data.leftTitle, type: data.letfType }}
                fieldsConfig={leftfieldsConfig}
                data={leftselectRows && leftselectRows[0]}
              />}
          </Card>
        </Col>
        <Col span={13} className={stylesRight.right}>
          <div className={stylesRight.triangle}></div>
          <Card title="城市"
            bordered={false}
            className={stylesRight.maxHeight}
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
                        searchPlaceHolder="输入城市名称查询"
                        selectedRowKeys={rightselectedRowKeys}
                        onSelectRow={rightonSelectRow}
                        ref={tableRightRef}
                        toolBar={{
                          // left: HeaderButtons('rightVisible', 'rigthTitle', 'rightselectedRowKeys', 'rightselectRows')
                        }}
                      />
                    }
                  </AutoSizeLayout>
                </div>

            }
            {data.rightVisible &&
              <EventModal
                onCancel={() => handleCancel('rightVisible')}
                onOk={handleRightOk}
                propData={{ ...data, visible: data.rightVisible, title: data.rigthTitle, type: data.rightType }}
                fieldsConfig={rightfieldsConfig}
                data={rightselectRows && rightselectRows[0]}
              />}
          </Card>
        </Col>
      </Row>
    </Fragment>
  );

};

export default Form.create()(Index);
