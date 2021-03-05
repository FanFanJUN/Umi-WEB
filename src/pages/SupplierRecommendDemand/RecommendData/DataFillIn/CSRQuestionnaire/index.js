/**
 * @description 企业社会责任调查表
 * @author hezhi
 * @date 2020.4.3
 */
import React, { useState, useEffect } from 'react';
import {
  Table,
  PageHeader,
  Button,
  Input,
  Radio,
  message,
  Spin,
  Form
} from 'antd';
import styles from '../index.less';
import { queryCSRorEPEData, saveCSRorEPEData } from '../../../../../services/recommend';
import { router } from 'dva';
const { useLocation } = router;
const { Group: RadioGroup } = Radio;

const { create } = Form;

function CSRQuestionnaire({
  updateGlobalStatus = () => null,
  form
}) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const { query } = useLocation();
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue
  } = form;
  const { id = null, type = 'create' } = query;
  const headerExtra = type === 'detail' ? null : [
    <Button
      className={styles.btn}
      type='primary'
      key='save'
      onClick={handleSave}
      disabled={loading}
    >保存</Button>,
    <Button
      className={styles.btn}
      key='hold'
      onClick={handleHoldData}
      disabled={loading}
    >暂存</Button>
  ];
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
      dataIndex: 'selectName',
      render(text, record, index) {
        const { selectConfigList } = record;
        return (
          <Form.Item style={{
            margin: 0,
            padding: 0
          }}>
            {
              getFieldDecorator(`${index}-selectName`, {
                rules: [
                  {
                    required: true,
                    message: '请按实际情况选择'
                  }
                ],
                initialValue: text
              })(
                <RadioGroup
                  disabled={type === 'detail'}
                  onChange={(e) => handleLineChange(e, index, 'selectName')}
                >
                  {
                    selectConfigList.map(
                      (item, k) => <Radio value={item} key={`${k}-value-key`}>{item}</Radio>
                    )
                  }
                </RadioGroup>
              )
            }
          </Form.Item>
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remarkValue',
      render(text, record, index) {
        if (type === 'detail') {
          return text
        }
        const selectName = getFieldValue(`${index}-selectName`);
        const { remarkConfig, remarkRequiredField } = record;
        if (remarkConfig) {
          return (
            <Form.Item
              style={{ padding: 0, margin: 0 }}
            >
              {
                getFieldDecorator(`${index}-remarkValue`, {
                  initialValue: text,
                  rules: [
                    {
                      required: (remarkRequiredField === selectName || remarkRequiredField === '全部') && !Object.is(null, selectName),
                      message: '请添加备注'
                    }
                  ]
                })(
                  <Input maxLength={100} className={styles.input} onChange={(event) => handleLineChange(event, index, 'remarkValue')} />
                )
              }
            </Form.Item>
          )
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
  async function handleSave() {
    const v = await validateFieldsAndScroll();
    toggleLoading(true)
    const { success, message: msg } = await saveCSRorEPEData(dataSource);
    toggleLoading(false)
    if (success) {
      message.success(msg)
      updateGlobalStatus()
      return
    }
    message.error(msg)
  }
  async function handleHoldData() {
    // const v = await validateFieldsAndScroll();
    toggleLoading(true)
    const { success, message: msg } = await saveCSRorEPEData(dataSource, true);
    toggleLoading(false)
    if (success) {
      message.success('数据暂存成功')
      updateGlobalStatus()
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    async function getFormData() {
      toggleLoading(true)
      const { success, data } = await queryCSRorEPEData({
        supplierRecommendDemandId: id,
        csrConfigEnum: 'CSR'
      })
      toggleLoading(false)
      if (success) {
        setDataSource(data.map((item, k) => ({ ...item, lineIndex: k + 1 })))
      }
    }
    getFormData()
  }, [])
  return (
    <Spin spinning={loading}>
      <PageHeader title='企业社会责任' extra={headerExtra} />
      <div className={styles.divider}></div>
      <Table
        columns={columns}
        bordered
        size='small'
        dataSource={dataSource}
        rowKey={(item, index) => `${index}-dataSource-line`}
        pagination={{
          pageSize: 10000
        }}
      />
    </Spin>
  )
}

export default create()(CSRQuestionnaire);