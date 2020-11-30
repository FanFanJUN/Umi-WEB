import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef
} from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Table,
  Button,
  Modal
} from 'antd';
import styles from './index.less';
import { ComboList, ExtTable } from 'suid';
import SelectRecommendData from './SelectRecommendData';
import { commonProps, getUserName } from '../../utils';
import moment from 'moment';
import { useTableProps } from '../../utils/hooks';
const { orgnazationProps, corporationProps } = commonProps;

const { create, Item: FormItem } = Form;
const formLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 12
  }
};
function CommonForm({
  form
}, ref) {
  useImperativeHandle(ref, () => ({
    setFormValue
  }))
  const sRef = useRef(null);
  const [demandLine, setDemandLine] = useState([]);
  const [tableProps, sets] = useTableProps();
  const {
    selectedRows,
    selectedRowKeys,
    dataSource: recommendLine
  } = tableProps;
  const {
    setDataSource: setRecommendLine,
    handleSelectedRows
  } = sets;
  const empty = selectedRowKeys.length === 0;
  const { getFieldDecorator, setFieldsValue } = form;
  const recommendColumns = [
    {
      title: '公司代码',
      dataIndex: 'corporationCode'
    },
    {
      title: '公司名称',
      dataIndex: 'corporationName',
      width: 200
    },
    {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode'
    },
    {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName',
      width: 200
    },
    {
      title: '认定类型',
      dataIndex: 'identifyTypeName',
      width: 200
    },
    {
      title: '是否实物认定',
      dataIndex: 'objectRecognition',
      render(text) {
        const isBoolean = typeof text === 'boolean';
        if (isBoolean) {
          return !!text ? '是' : '否'
        }
        return '未选择'
      }
    },
    {
      title: '是否信任',
      dataIndex: 'trust',
      render(text = null) {
        const isBoolean = typeof text === 'boolean';
        if (isBoolean) {
          return !!text ? '是' : '否'
        }
        return '未选择'
      }
    }
  ];
  const demandColumns = [
    {
      title: '序号',
      dataIndex: 'lineNumber',
      width: 50,
      align: 'center'
    },
    {
      title: '需求单号',
      dataIndex: 'recommendDemandDocNumber',
      width: 200,
      align: 'center'
    }
  ]
  async function setFormValue(values) {
    const {
      orgCode,
      orgName,
      recommendAccessLines = [],
      accessRelateDemands = []
    } = values;
    await setFieldsValue({
      orgCode,
      orgName
    })
    const addLineNumberDemands = accessRelateDemands.map((item, index) => ({
      ...item,
      lineNumber: index + 1
    }))
    await setRecommendLine(recommendAccessLines);
    await setDemandLine(addLineNumberDemands);
  }
  function handleCreateRecommendInfo() {
    sRef?.current?.show()
  }
  function handleSelectRecommendData(items) {
    setRecommendLine(items)
  }
  function handleRemove() {
    if (selectedRowKeys.length === 0) return
    Modal.confirm({
      title: '删除数据',
      content: '是否删除所选数据',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        const resLine = recommendLine.filter(item => !selectedRowKeys.includes(item.guid))
        setRecommendLine(resLine)
      }
    })
  }
  return (
    <Form {...formLayout}>
      <div className={styles.commonTitle}>基本信息</div>
      <Row>
        <Col span={12}>
          <FormItem label='申请部门'>
            {
              getFieldDecorator('orgCode'),
              getFieldDecorator('orgName', {
                rules: [
                  {
                    required: true,
                    message: '申请部门不能为空'
                  }
                ]
              })(
                <ComboList
                  form={form}
                  name='orgName'
                  field={['orgCode']}
                  {...orgnazationProps}
                />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='创建人'>
            {
              getFieldDecorator('creatorName', {
                initialValue: getUserName()
              })(
                <Input disabled />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='申请公司'>
            {
              getFieldDecorator('corporationCode'),
              getFieldDecorator('corporationName', {
                rules: [
                  {
                    required: true,
                    message: '申请公司不能为空'
                  }
                ]
              })(
                <ComboList
                  form={form}
                  name='corporationName'
                  field={['corporationCode']}
                  {...corporationProps}
                />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='创建时间' {...formLayout}>
            {
              getFieldDecorator('dateTime', {
                initialValue: moment().format('YYYY-MM-DD')
              })(
                <Input disabled />
              )
            }
          </FormItem>
        </Col>
      </Row>
      <div className={styles.commonTitle}>推荐准入信息</div>
      <Row>
        <Col span={12}>
          <FormItem label='供应商名称'>
            {
              getFieldDecorator('supplierName')(
                <Input disabled />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='供应商代码'>
            {
              getFieldDecorator('supplierCode')(
                <Input disabled />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='原厂名称'>
            {
              getFieldDecorator('originName')(
                <Input disabled />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='原厂代码'>
            {
              getFieldDecorator('originCode')(
                <Input disabled />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='物料分类'>
            {
              getFieldDecorator('materialCategoryName')(
                <Input disabled />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='认定物料类别'>
            {
              getFieldDecorator('identifyMaterialLevelName')(
                <Input disabled />
              )
            }
          </FormItem>
        </Col>
      </Row>
      <div className={styles.tableWrapper}>
        <div className={styles.verticalPadding}>
          <Button className={styles.btn} onClick={handleCreateRecommendInfo} type='primary'>新增</Button>
          <Button className={styles.btn} onClick={handleRemove} disabled={empty}>删除</Button>
        </div>
        <ExtTable
          bordered
          dataSource={recommendLine}
          columns={recommendColumns}
          size='small'
          rowKey='guid'
          allowCancelSelect
          checkbox={{
            multiSelect: false
          }}
          onSelectRow={handleSelectedRows}
          selectedRowKeys={selectedRowKeys}
        />
        <SelectRecommendData
          wrappedComponentRef={sRef}
          initialDataSource={recommendLine}
          onOk={handleSelectRecommendData}
        />
      </div>
      <div className={styles.commonTitle}>推荐需求单</div>
      <div className={styles.tableWrapper}>
        <Table
          size='small'
          bordered
          dataSource={demandLine}
          columns={demandColumns}
          style={{
            width: 500
          }}
        />
      </div>
    </Form>
  )
}

const ForwardRef = forwardRef(CommonForm)

export default create()(ForwardRef)