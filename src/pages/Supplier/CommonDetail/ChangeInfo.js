import { Form, Row, Col } from 'antd';
import { ExtTable } from 'suid';
import { ComboAttachment } from '../../../components';
import styles from './index.less';
const { Item: FormItem } = Form;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const ChangeInfo = ({ lineDataSource, headerFields }) => {
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
      title: '变更字段',
      dataIndex: 'target'
    }, {
      title: '变更前内容',
      dataIndex: 'changeBefore'
    }, {
      title: '变更后内容',
      dataIndex: 'changeLater'
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
            <FormItem label='申请资料' {...formLayout}>
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


export default ChangeInfo;