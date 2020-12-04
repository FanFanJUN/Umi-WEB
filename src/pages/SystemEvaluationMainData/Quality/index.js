/**
 * 实现功能： 供应商评价项目系统评价主数据-质量
 * @author hezhi
 * @date 2020-12-04
 */
import { useState } from 'react';
import styles from '../index.less';
import {
  Form,
  Spin,
  Affix,
  Button,
  Row,
  Col,
  DatePicker,
  Select
} from 'antd';
import { ComboList } from 'suid';
import { evlLevelEmu, evaluateSystemFormCodeProps, businessMainProps } from '../../../utils/commonProps';
const { create, Item: FormItem } = Form;
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 10,
  }
};
function Quality({
  form
}) {
  const [loading, toggleLoading] = useState(false);
  const { getFieldDecorator } = form;
  return (
    <Spin spinning={loading}>
      <Affix>
        <div className={styles.verticalPadding}>
          <Button className={styles.btn} type='primary'>导出待评价数据</Button>
          <Button className={styles.btn}>导入评价数据</Button>
        </div>
      </Affix>
      <Form {...formLayout}>
        <Row gutter={[12, 0]}>
          <Col span={12}>
            <FormItem label='评价数据开始时间'>
              {
                getFieldDecorator('startDate')(
                  <DatePicker className={styles.formItem} />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='评价数据结束时间'>
              {
                getFieldDecorator('endDate')(
                  <DatePicker className={styles.formItem} />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='评价数据层次'>
              {
                getFieldDecorator('evlLevelEnum')(
                  <Select>
                    {
                      evlLevelEmu.map(item => (
                        <Option key={item.value}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='业务单元'>
              {
                getFieldDecorator('buCode'),
                getFieldDecorator('buName')(
                  <ComboList
                    {...businessMainProps}
                    form={form}
                    name='buName'
                    field={['buCode']}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='评价体系'>
              {
                getFieldDecorator('evlSystemId'),
                getFieldDecorator('buName')(
                  <ComboList
                    form={form}
                    name='mainDataEvlSystemName'
                    field={['mainDataEvlSystemId']}
                    {...evaluateSystemFormCodeProps}
                    store={{
                      ...evaluateSystemFormCodeProps.store,
                      url: `${evaluateSystemFormCodeProps.store.url}?systemUseType=SupplierEvaluation`,
                      params: {
                        systemUseType: "SupplierEvaluation"
                      }
                    }}
                  />
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Spin>
  )
}

export default create()(Quality)

