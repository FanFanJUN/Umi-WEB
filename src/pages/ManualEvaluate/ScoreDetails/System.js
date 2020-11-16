import { useEffect, useState } from 'react';
import styles from './index.less';
import { useLocation } from 'dva/router';
import { Affix, Button, Form, Row, Col, Table, Spin, message } from 'antd';
import classnames from 'classnames';
import { utils } from 'suid';
import { queryEvaluateScoreDetail } from '../../../services/evaluate';
import { closeCurrent } from '../../../utils';

const { Item: FormItem } = Form;
const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  }
};
const formLayoutAlone = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
}
function SystemDetail() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const [formInfo, setFormInfo] = useState({});
  const [tabKey, setTabKey] = useState('initialTableKey-allocation')
  const { query } = useLocation();
  const columns = [
    {
      title: '开始区间计算符',
      dataIndex: 'markStartCalSign'
    },
    {
      title: '开始区间',
      dataIndex: 'markStart'
    },
    {
      title: '结束区间计算符',
      dataIndex: 'markEndCalSign'
    },
    {
      title: '结束区间',
      dataIndex: 'markEnd'
    },
    {
      title: '分值',
      dataIndex: 'score'
    }
  ]
  async function initialInfos() {
    toggleLoading(true)
    const { success, data, message: msg } = await queryEvaluateScoreDetail(query);
    toggleLoading(false)
    if (success) {
      const {
        seEvaluationResult,
        samSupplierEvlSysRule,
        samSupplierAutoScoreStandards,
        score,
        value,
        // ...infos
      } = data;
      await setDataSource(samSupplierAutoScoreStandards)
      const uuid = utils.getUUID();
      const infos = {
        ...seEvaluationResult,
        ...samSupplierEvlSysRule,
        score,
        value
      }
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
          <Col span={12}>
            <FormItem label='指标名称'>
              <span>{formInfo.ruleName}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='计算方式'>
              <span>{formInfo.autoCalculate ? '系统打分' : '人工打分'}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='分值'>
              <span>{formInfo.score}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='指标值'>
              <span>{formInfo.value}</span>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label='指标定义' {...formLayoutAlone}>
              <span>{formInfo.definition}</span>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div className={styles.commonTitle}>评分标准</div>
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
export default SystemDetail