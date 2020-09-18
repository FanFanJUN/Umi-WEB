/**
 * @description 企业社会责任调查表
 * @author hezhi
 * @date 2020.4.3
 */
import React, { useState, useEffect } from 'react';
import { Table, PageHeader, Button, Input, Radio, message } from 'antd';
import styles from '../index.less';
import { queryCSRorEPEData, saveCSRorEPEData } from '../../../../../services/recommend';
import { Upload } from '../../../../../components';
// import {  } from 'seid';
import { router } from 'dva';
const { useLocation } = router;
const { Group: RadioGroup } = Radio;

function CSRQuestionnaire({
  updateGlobalStatus = () => null
}) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const [confirmLoading, toggleConfirmLoading] = useState(false);
  const headerExtra = [
    <Button
      className={styles.btn}
      type='primary'
      key='save'
      onClick={handleSave}
      loading={confirmLoading}
    >保存</Button>
  ];
  const { query } = useLocation();
  const { id = null } = query;
  const columns = [
    {
      title: '序号',
      dataIndex: 'lineIndex',
      width: 80
    },
    {
      title: '调查项目',
      dataIndex: 'item'
    },
    {
      title: '实际情况',
      dataIndex: 'selectValue',
      render(text, record, index) {
        const { selectConfigList } = record;
        return (
          <RadioGroup value={text} onChange={(e) => handleLineChange(e, index, 'selectValue')}>
            {
              selectConfigList.map((item, k) => <Radio value={k} key={`${k}-value-key`}>{item}</Radio>)
            }
          </RadioGroup>
        )
      }
    },
    {
      title: '附件',
      dataIndex: 'attacmentId',
      render(text, record) {
        const { attachmentConfig } = record;
        if (attachmentConfig) {
          return <Upload fileOnChange={handleUploadFile} entityId={text}/>
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'remarkValue',
      render(text, record, index) {
        const { remarkConfig } = record;
        if (remarkConfig) {
          return <Input className={styles.input} value={text} onChange={(event) => handleLineChange(event, index, 'remarkValue')} />
        }
        return text
      }
    }
  ].map(item => ({ ...item, align: 'center' }));
  function handleLineChange(e, index, key) {
    const { target } = e;
    const { value } = target;
    const newDataSource = dataSource.map((item, n) => {
      if (n === index) {
        return ({
          ...item,
          [key]: value
        })
      }
      return item
    })
    setDataSource(newDataSource)
  }
  function handleUploadFile(ids, index) {
    const newDataSource = dataSource.map((item, n) => {
      if (n === index) {
        return ({
          ...item,
          attachmentIds: ids
        })
      }
      return item
    })
    setDataSource(newDataSource)
  }
  async function handleSave() {
    toggleConfirmLoading(true)
    const { success, message: msg } = await saveCSRorEPEData(dataSource);
    toggleConfirmLoading(false)
    if (success) {
      message.success(msg)
      updateGlobalStatus()
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    async function getFormData() {
      const { success, data } = await queryCSRorEPEData({
        supplierRecommendDemandId: id,
        csrConfigEnum: 'PRODUCTION_ENVIRONMENT'
      })
      if (success) {
        setDataSource(data.map((item, k) => ({ ...item, lineIndex: k + 1 })))
      }
    }
    getFormData()
  }, [])
  return (
    <div>
      <PageHeader title='企业社会责任' extra={headerExtra} />
      <div className={styles.divider}></div>
      <Table
        columns={columns}
        bordered
        size='small'
        dataSource={dataSource}
        rowKey={(item, index) => `${index}-dataSource-line`}
      ></Table>
    </div>
  )
}

export default CSRQuestionnaire;