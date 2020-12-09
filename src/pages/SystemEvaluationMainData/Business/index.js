/**
 * 实现功能： 供应商评价项目系统评价主数据-商务
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
  Modal,
  message
} from 'antd';
import { ComboList, DataImport } from 'suid';
import classnames from 'classnames'
import { evlLevelEmu, evaluateSystemFormCodeProps, businessMainProps, businessUnitMainProps } from '../../../utils/commonProps';
import { downloadBlobFile, DEVELOPER_ENV } from '../../../utils';
import {
  batchExportQualityData as EXPORT_SERVICE,
  batchCheckQualityData as CHECK_SERVICE,
  batchSaveQualityData as SAVE_SERVICE
} from '../../../services/gradeSystem';
const MOUDLE_NAME = '质量';
const { create, Item: FormItem } = Form;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const formLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 10,
  }
};
const COLUMNS = [
  {
    title: '供应商代码',
    dataIndex: 'supplierCode'
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName'
  },
  {
    title: '原厂代码',
    dataIndex: 'originCode'
  },
  {
    title: '原厂名称',
    dataIndex: 'originName'
  },
  {
    title: '物料分类代码',
    dataIndex: 'materialCategoryCode'
  },
  {
    title: '物料分类名称',
    dataIndex: 'materialCategoryName'
  },
  {
    title: '业务单元代码',
    dataIndex: 'buCode'
  },
  {
    title: '业务单元名称',
    dataIndex: 'buName'
  },
  {
    title: '月度',
    dataIndex: 'month'
  },
  {
    title: '商务问题次数',
    dataIndex: 'questionTime'
  },
  {
    title: '商务问题不及时次数',
    dataIndex: 'timesOfDelay'
  },
  {
    title: '商务问题未解决次数',
    dataIndex: 'unsolvedBusinessProblems'
  },
  {
    title: '损失50万元以上次数',
    dataIndex: 'above'
  },
  {
    title: '损失50万元以下次数',
    dataIndex: 'below'
  }
]
function Quality({
  form
}) {
  const [loading, toggleLoading] = useState(false);
  const [spinning, toggleSpinning] = useState(false);
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
          startDate: values.startDate.format('YYYY-MM'),
          endDate: values.endDate.format('YYYY-MM')
        }
        toggleLoading(true)
        const { success, data } = await EXPORT_SERVICE(params)
        toggleLoading(false)
        if (success) {
          message.success("导出成功")
          downloadBlobFile(data, `待评价数据-${MOUDLE_NAME}.xlsx`)
          return
        }
        message.error(msg)
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
            getFieldDecorator('businessGroupName',{
              rules: [
                {
                  required: true,
                  message: '请选择业务板块'
                }
              ]
            })(
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
            getFieldDecorator('businessUnitName',{
              rules: [
                {
                  required: true,
                  message: '请选择业务单元'
                }
              ]
            })(
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
  async function validateFunc(params) {
    toggleLoading(true)
    const { success, data, message: msg } = await CHECK_SERVICE(params);
    toggleLoading(false)
    if (success) {
      const formatData = data.map((item, index) => ({
        ...item,
        key: `${index}-validate`
      }))
      return new Promise(resolve => resolve(formatData))
    }
    message.error(msg)
  }
  async function importFunc(params) {
    toggleSpinning(true)
    const { success, message: msg } = await SAVE_SERVICE(params);
    toggleSpinning(false)
    if (success) {
      message.success('批量导入成功')
      return
    }
    message.error(msg)
  }
  return (
    <Spin spinning={spinning}>
      <Affix>
        <div className={classnames(styles.verticalPadding, styles.fsc)}>
          <Button className={styles.btn} type='primary' onClick={exportData}>导出待评价数据</Button>
          <DataImport
            ignore={DEVELOPER_ENV}
            className={styles.btn}
            uploadBtnText='导入评价数据'
            validateAll={false}
            tableProps={{ columns: COLUMNS }}
            validateFunc={validateFunc}
            importFunc={importFunc}
            okButtonProps={{
              loading: loading
            }}
          />
          {/* <Button className={styles.btn}>导入评价数据</Button> */}
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
                  <MonthPicker className={styles.formItem} disabledDate={startDisabledDate} />
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
                  <MonthPicker className={styles.formItem} disabled={!startDate} disabledDate={endDisabledDate} />
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

