import { useEffect, useState } from 'react';
import styles from './index.less';
import { useLocation } from 'dva/router';
import { Affix, Button, Form, Row, Col, Table, Spin, message } from 'antd';
import classnames from 'classnames';
import { utils } from 'suid';
import { queryScoreDetailsInfo } from '../../../services/evaluate';
import { closeCurrent, openNewTab } from '../../../utils';

const { Item: FormItem } = Form;
const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  }
};

function ScoreDetails() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const [formInfo, setFormInfo] = useState({});
  const [tabKey, setTabKey] = useState('initialTableKey-allocation')
  const { query } = useLocation();
  function checkEvaluateDetail(ruleScoreId, type) {
    const pathname = type === 'system' ? 'supplier/appraise/project/evaluate/result/score/details/system' : 'supplier/appraise/project/evaluate/result/score/details/manual'
    openNewTab(`${pathname}?ruleScoreId=${ruleScoreId}`, `${type === 'system' ? '系统' : '人工'}-分值详情`, false)
  }
  const columns = [
    {
      title: '类别',
      dataIndex: 'systemName'
    },
    {
      title: '指标名称',
      dataIndex: 'ruleName',
      width: 150
    },
    {
      title: '指标定义',
      dataIndex: 'definition',
      width: 250,
    },
    {
      title: '得分状态',
      dataIndex: 'scoreStatusRemark'
    },
    {
      title: '计算方式',
      dataIndex: 'autoCalculate',
      width: 150,
      render(text) {
        switch (text) {
          case null:
            return ''
          case true:
            return '系统打分'
          case false:
            return '人工打分'
          default:
            return ''
        }
      }
    },
    {
      title: '分值',
      dataIndex: 'score',
      render(text, record) {
        const type = record?.autoCalculate ? 'system' : 'manual';
        if (text === null) {
          return ''
        }
        if (!!record?.systemName) {
          return text
        }
        return <Button type='link' onClick={() => checkEvaluateDetail(record?.ruleScoreId, type)}>{text}</Button>
      }
    }
  ]
  async function initialInfos() {
    toggleLoading(true)
    const { success, data, message: msg } = await queryScoreDetailsInfo(query);
    toggleLoading(false)
    if (success) {
      const { evlSystemRules, ...infos } = data;
      await setDataSource(evlSystemRules)
      const uuid = utils.getUUID();
      await setFormInfo(infos)
      await setTabKey(uuid)
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    initialInfos()
  }, [])
  return (
    <Spin spinning={loading}>
      <Affix>
        <div className={classnames(styles.fbc, styles.affixHeader)}>
          <span className={styles.title}>
            综合得分详情
          </span>
          <Button onClick={closeCurrent}>返回</Button>
        </div>
      </Affix>
      <Form {...formLayout}>
        <Row>
          <Col span={12}>
            <FormItem label='供应商名称'>
              <span>{formInfo.supplierName}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='供应商代码'>
              <span>{formInfo.supplierCode}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='原厂名称'>
              <span>{formInfo.originName}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='原厂代码'>
              <span>{formInfo.originCode}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='物料分类名称'>
              <span>{formInfo.materialCategoryName}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='物料分类代码'>
              <span>{formInfo.materialCategoryCode}</span>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table
        key={tabKey}
        dataSource={dataSource}
        size="small"
        columns={columns}
        pagination={false}
        defaultExpandAllRows={true}
        bordered
      />
    </Spin>
  )
}
export default ScoreDetails