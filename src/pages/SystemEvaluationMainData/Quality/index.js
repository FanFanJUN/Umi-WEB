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
  Select,
  Modal
} from 'antd';
import { ComboList } from 'suid';
import { evlLevelEmu, evaluateSystemFormCodeProps, businessMainProps, businessUnitMainProps } from '../../../utils/commonProps';
import { batchExportQualityData } from '../../../services/gradeSystem';
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
  const { getFieldDecorator, getFieldsValue, validateFields } = form;
  const { startDate, endDate, evlLevelEnum } = getFieldsValue();
  const endDisabledDate = (c) => c < startDate;
  const startDisabledDate = (s) => s > endDate;
  async function exportData() {
    const values = await validateFields();
    Modal.confirm({
      title: '导出数据',
      content: '是否导出当前所选条件下的所有数据？',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const params = {
          ...values,
          startDate: values.startDate.format('YYYY-MM-DD'),
          endDate: values.endDate.format('YYYY-MM-DD')
        }
        toggleLoading(true)
        const { success, data } = await batchExportQualityData(params)
        toggleLoading(false)
      }
    })
  }
  function getEvlLevelCorrelation(v) {
    if (v === 'CORP_AND_PURCHASE_ORG') {
      return null
    }
    if (v === 'BG') {
      return (
        <FormItem key='BG' label='业务板块' {...formLayout}>
          {
            getFieldDecorator('bgCode'),
            getFieldDecorator('businessGroupName')(
              <ComboList
                {...businessUnitMainProps}
                form={form}
                name='businessGroupName'
                field={['bgCode']}
              />
            )
          }
        </FormItem>
      )
    }
    if (v === 'BU') {
      return (
        <FormItem key='BU' label='业务单元' {...formLayout}>
          {
            getFieldDecorator('buCode'),
            getFieldDecorator('businessUnitName')(
              <ComboList
                {...businessMainProps}
                form={form}
                name='businessUnitName'
                field={['buCode']}
              />
            )
          }
        </FormItem>
      )
    }
    return null
  }
  return (
    <Spin spinning={loading}>
      <Affix>
        <div className={styles.verticalPadding}>
          <Button className={styles.btn} type='primary' onClick={exportData}>导出待评价数据</Button>
          <Button className={styles.btn}>导入评价数据</Button>
        </div>
      </Affix>
      <Form {...formLayout}>
        <div className={styles.commonTitle}>数据导出参数选择</div>
        <Row gutter={[12, 0]}>
          <Col span={12}>
            <FormItem label='评价数据开始时间'>
              {
                getFieldDecorator('startDate', {
                  rules: [
                    {
                      required: true,
                      message: '评价数据开始时间不能为空'
                    }
                  ]
                })(
                  <DatePicker className={styles.formItem} disabledDate={startDisabledDate} />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='评价数据结束时间'>
              {
                getFieldDecorator('endDate', {
                  rules: [
                    {
                      required: true,
                      message: '评价数据结束时间不能为空'
                    }
                  ]
                })(
                  <DatePicker className={styles.formItem} disabled={!startDate} disabledDate={endDisabledDate} />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='评价数据层次'>
              {
                getFieldDecorator('evlLevelEnum', {
                  rules: [
                    {
                      required: true,
                      message: '评价数据层次不能为空'
                    }
                  ]
                })(
                  <Select placeholder='选择数据层次'>
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
            {
              getEvlLevelCorrelation(evlLevelEnum)
            }
          </Col>
          <Col span={12}>
            <FormItem label='评价体系'>
              {
                getFieldDecorator('evlSystemId'),
                getFieldDecorator('mainDataEvlSystemName', {
                  rules: [
                    {
                      required: true,
                      message: '评价体系不能为空'
                    }
                  ]
                })(
                  <ComboList
                    form={form}
                    name='mainDataEvlSystemName'
                    field={['evlSystemId']}
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

