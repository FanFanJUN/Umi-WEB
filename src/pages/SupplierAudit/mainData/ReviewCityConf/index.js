/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-12 14:44:24
 * @LastEditTime: 2020-10-13 10:54:00
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
import renderEmpty from 'antd/lib/config-provider/renderEmpty';
import EventModal from '../../common/EventModal';

const { authAction } = utils;

const DEVELOPER_ENV = process.env.NODE_ENV === 'development';

const Index = () => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    leftVisible: false,
    rightVisible: false,
    leftTitle: '审核区域新增',
    rigthTitle: '城市新增',
    type: 'add',
  });

  const [rightselectRows, setRightSelectRows] = useState([]);

  const [rightselectedRowKeys, setRightSelectedRowKeys] = useState([]);

  const [leftselectRows, setLeftSelectRows] = useState([]);

  const [leftselectedRowKeys, setLeftSelectedRowKeys] = useState([]);

  const columnsforLeft = [
    { title: '区域', dataIndex: 'buCode', width: 200 },
    { title: '排序号', dataIndex: 'orderNo', ellipsis: true },
  ];

  const leftfieldsConfig = [
    {
      name: '区域',
      code: 'xx',
    },
    {
      name: '排序号',
      code: 'xx',
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

  const buttonClick = async (type, visible, title, text) => {
    switch (type) {
      case 'add':
        setData((value) => ({ ...value, [visible]: true, [title]: text, type: 'add' }));
        break;
      case 'edit':
        setData((value) => ({ ...value, [visible]: true, [title]: text, type: 'edit' }));
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
    const data = await FrostBUCompanyOrganizationRelation({
      ids: selectedRowKeys.toString(),
      frozen: !selectRows[0]?.frozen,
    });
    if (data.success) {
      tableRef.current.manualSelectedRows();
      tableRef.current.remoteDataRefresh();
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
        const data = await DeleteBUCompanyOrganizationRelation({
          ids: selectedRowKeys.toString(),
        });
        if (data.success) {
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
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

  const HeaderButtons = (visible, title, selectKeys, selectRows) => {
    return (<div style={{ width: '100%', display: 'flex', height: '100%', alignItems: 'center' }}>
      {
        authAction(<Button
          type='primary'
          onClick={() => buttonClick('add', visible, title, visible === 'leftVisible' ? '审核地区新增' : '城市新增')}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          key='QUALITYSYNERGY_BUCOR_ADD'
        >新增</Button>)
      }
      {
        authAction(<Button
          onClick={() => buttonClick('edit', visible, title, visible === 'rightVisible' ? '审核地区编辑' : '城市编辑')}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          disabled={[selectKeys].length === 0 || [selectKeys].length > 1}
          key='QUALITYSYNERGY_BUCOR_EDIT'
        >编辑</Button>)
      }
      {
        authAction(<Button
          onClick={() => buttonClick('delete', visible, title)}
          className={styles.btn}
          ignore={DEVELOPER_ENV}
          disabled={[selectRows].length === 0}
          key='QUALITYSYNERGY_BUCOR_DELETE'
        >删除</Button>)
      }
    </div>)
  };

  const handleCancel = (visible) => {
    setData(() => ({ [visible]: false }));
  }

  const handleOk = async (value) => {
    if (data.type === 'add') {
      AddBUCompanyOrganizationRelation(value).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, visible: false }));
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    } else {
      const id = selectRows[selectRows.length - 1].id;
      const params = { ...value, id };
      AddBUCompanyOrganizationRelation(params).then(res => {
        if (res.success) {
          setData((value) => ({ ...value, visible: false }));
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
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
                    url: `${baseUrl}/buCompanyPurchasingOrganization/findByPage`,
                    type: 'POST',
                  }}
                  allowCancelSelect={true}
                  remotePaging={true}
                  checkbox={{
                    multiSelect: false,
                  }}
                  ref={tableRef}
                  onSelectRow={leftonSelectRow}
                  selectedRowKeys={leftselectedRowKeys}
                  toolBar={{
                    left: HeaderButtons('leftVisible', 'leftTitle', 'leftselectedRowKeys', 'leftselectRows'),
                  }}
                />
              }
            </AutoSizeLayout>
            {data.leftVisible &&
              <EventModal
                onCancel={() => handleCancel('leftVisible')}
                onOk={handleOk}
                propData={{ ...data, visible: data.leftVisible, title: data.leftTitle }}
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
                          url: `${baseUrl}/environmentStandardLimitMaterialRelation/findByPage`,
                          type: 'POST',
                          params: {
                            environmentalProtectionCode: leftselectRows[leftselectRows.length - 1].environmentalProtectionCode
                          }
                        }}
                        height={h}
                        searchPlaceHolder="输入城市名称查询"
                        selectedRowKeys={setRightSelectedRowKeys}
                        onSelectRow={rightonSelectRow}
                        toolBar={{
                          left: HeaderButtons('rightVisible', 'rigthTitle', 'rightselectedRowKeys', 'rightselectRows')
                        }}
                      />
                    }
                  </AutoSizeLayout>
                </div>

            }
            {data.rightVisible &&
              <EventModal
                onCancel={() => handleCancel('rightVisible')}
                onOk={handleOk}
                propData={{ ...data, visible: data.rightVisible, title: data.rigthTitle }}
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
