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

function ManualDetail() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, toggleLoading] = useState(false);
  const [formInfo, setFormInfo] = useState({});
  const [tabKey, setTabKey] = useState('initialTableKey-allocation')
  const { query } = useLocation();
  const columns = [
    {
      title: '公司名称',
      dataIndex: 'corporationName'
    },
    {
      title: '公司代码',
      dataIndex: 'corporationCode'
    },
    {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName'
    },
    {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode',
    },
    {
      title: '评价人',
      dataIndex: 'scorerName'
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
      const { seEvaluationResult, seScoreItems, ...infos } = data;
      await setDataSource(seScoreItems)
      const uuid = utils.getUUID();
      await setFormInfo({
        ...seEvaluationResult,
        ...infos
      })
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
            人工-分值详情
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
            <FormItem label='指标代码'>
              <span>{formInfo.ruleCode}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='计算方式'>
              <span>人工打分</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='指标定义'>
              <span>{formInfo.definition}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='多人评分规则'>
              <span>{formInfo.multipleScoreRule}</span>
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
        rowKey={item => item?.id}
        bordered
      />
    </Spin>
  )
}
export default ManualDetail