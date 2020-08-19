import { Form, Row, Col } from 'antd';
import { ExtTable } from 'suid';
import { ComboAttachment } from '../../../components';
import styles from './index.less';
import moment from 'moment';
const { Item: FormItem } = Form;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const DetailRef = ({ lineDataSource, headerFields }) => {
  const attachment = headerFields?.attachmentId;
  const columns = [
    {
      title: '公司代码',
      dataIndex: 'corporationCode'
    }, {
      title: '公司名称',
      dataIndex: 'corporationName'
    }, {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode'
    }, {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName'
    }, {
      title: '付款条件',
      dataIndex: 'payCodition',
    }, {
      title: '付款条件描述',
      dataIndex: 'payCoditionName'
    }, {
      title: '方案组',
      dataIndex: 'schemeGroupName',
    }, {
      title: '币种代码',
      dataIndex: 'currencyCode',
    }, {
      title: '币种名称',
      dataIndex: 'currencyName'
    }
  ].map(item => ({ ...item, align: 'center' }));
  return (
    <div className={styles.wrapper}>
      <Form>
        <Row>
          <Col span={12}>
            <FormItem label='供应商代码' {...formLayout}>
              <span>{headerFields?.supplierCode}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='供应商名称' {...formLayout}>
              <span>{headerFields?.supplierName}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='申请日期' {...formLayout}>
              {moment(headerFields?.datetime).format('YYYY-MM-DD')}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='申请人' {...formLayout}>
              <span>{headerFields?.creatorName}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='申请部门' {...formLayout}>
              <span>{headerFields?.orgName}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='变更资料' {...formLayout}>
              <ComboAttachment
                uploadButton={{
                  disabled: true
                }}
                allowDelete={false}
                showViewType={true} customBatchDownloadFileName={true} attachment={attachment}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='变更说明' {...formLayout}>
              <span>{headerFields?.reason}</span>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div>
        <ExtTable
          columns={columns}
          dataSource={lineDataSource}
          showSearch={false}
          checkbox={false}
          rowKey={(item) => item.id}
          size='small'
          allowCancelSelect
        />
      </div>
    </div>
  )
}

export { default as ChangeInfo } from './ChangeInfo'

export default DetailRef;