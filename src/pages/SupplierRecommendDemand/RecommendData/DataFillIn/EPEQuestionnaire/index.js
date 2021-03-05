/**
 * @description 企业生产环境情况
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
  Form
} from 'antd';
import styles from '../index.less';
import { queryCSRorEPEData, saveCSRorEPEData } from '../../../../../services/recommend';
import { Upload } from '../../../../../components';
import { router } from 'dva';
const { useLocation } = router;
const { Group: RadioGroup } = Radio;

const { create } = Form;

function CSRQuestionnaire({
  updateGlobalStatus = () => null,
  form
}) {
  const [dataSource, setDataSource] = useState([]);
  const [confirmLoading, toggleConfirmLoading] = useState(false);
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue } = form;
  const { query } = useLocation();
  const { id = null, type = 'create' } = query;
  const headerExtra = type === 'detail' ? null : [
    <Button
      className={styles.btn}
      type='primary'
      key='save'
      onClick={handleSave}
      loading={confirmLoading}
    >保存</Button>,
    <Button
      className={styles.btn}
      key='hold'
      onClick={handleHoldData}
      loading={confirmLoading}
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
          <Form.Item style={{ margin: 0, padding: 0 }}>
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
                  onChange={(e) =>
                    handleLineChange(e, index, 'selectName')}
                >
                  {
                    selectConfigList.map((item, k) => <Radio value={item} key={`${k}-value-key`}>{item}</Radio>)
                  }
                </RadioGroup>
              )
            }
          </Form.Item>
        )
      }
    },
    {
      title: '附件',
      dataIndex: 'attachmentId',
      render(text, record, index) {
        const { attachmentConfig, attachmentRequiredField } = record;
        const selectName = getFieldValue(`${index}-selectName`);
        if (attachmentConfig) {
          return (
            <Form.Item>
              {
                getFieldDecorator(`${index}-attachmentId`, {
                  rules: [
                    {
                      required: (attachmentRequiredField === selectName || attachmentRequiredField === '全部') && !Object.is(null, selectName),
                      message: '附件不能为空'
                    }
                  ]
                })(
                  <Upload fileOnChange={(ids) => handleUploadFile(ids, index)} entityId={text} type={type === 'detail' ? 'show' : ''} />
                )
              }
            </Form.Item>
          )
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'remarkValue',
      render(text, record, index) {
        const selectName = getFieldValue(`${index}-selectName`);
        const { remarkConfig, remarkRequiredField } = record;
        if (type === 'detail') {
          return text
        }
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
    const v = await validateFieldsAndScroll();
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
  async function handleHoldData() {
    toggleConfirmLoading(true)
    const { success, message: msg } = await saveCSRorEPEData(dataSource, true);
    toggleConfirmLoading(false)
    if (success) {
      message.success('数据暂存成功')
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
      <PageHeader title='企业生产环境' extra={headerExtra} />
      <div className={styles.divider}></div>
      <Form>
        <Table
          columns={columns}
          bordered
          size='small'
          dataSource={dataSource}
          rowKey={(item, index) => `${index}-dataSource-line`}
          pagination={{
            pageSize: 10000
          }}
        ></Table>
      </Form>
    </div>
  )
}

export default create()(CSRQuestionnaire);