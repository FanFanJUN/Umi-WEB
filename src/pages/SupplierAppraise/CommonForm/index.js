/**
 * 实现功能：供应商评价新增编辑明细公用表单组件
 * @author hezhi
 * @date 2020-09-23
 */
import {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  useRef
} from 'react';
import styles from './index.less';
import { ComboList, ExtTable } from 'suid';
import { Row, Col, Form, Input, DatePicker, Radio, Tree, Select, Button, Modal, message } from 'antd';
import { useLocation } from 'dva/router';
import moment from 'moment';
import { commonProps, getUserAccount, commonUrl } from '../../../utils';
import { findListById, findByBuCodeOrBgCode, findAppraiseById } from '../../../services/appraise';
import { useTableProps } from '../../../utils/hooks';
import ComboModalList from '../../../components/ComboModalList';
const {
  corporationProps,
  orgnazationProps,
  evaluateSystemProps,
  evlPeriodEmu,
  evlLevelEmu,
  businessMainProps,
  businessUnitMainProps
} = commonProps;
const { baseUrl } = commonUrl;
const { RangePicker } = DatePicker;
const { Group: RadioGroup } = Radio;
const { create, Item: FormItem } = Form;
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  }
};
const formLayoutAlone = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}

const columns = [
  {
    title: '指标名称',
    dataIndex: 'supplierEvlRule.name',
    width: 200
  },
  {
    title: '指标定义',
    dataIndex: 'supplierEvlRule.definition',
    width: 250
  },
  {
    title: '评分标准',
    dataIndex: 'scoringStandard',
    width: 250
  }
];
const businessColumns = [
  {
    title: '公司代码',
    dataIndex: 'corporationCode'
  },
  {
    title: '公司名称',
    dataIndex: 'corporationName'
  },
  {
    title: '采购组织代码',
    dataIndex: 'purchaseOrgCode'
  },
  {
    title: '采购组织名称',
    dataIndex: 'purchaseOrgName'
  }
]

const CommonForm = forwardRef(({
  form,
  type = 'create'
}, ref) => {
  useImperativeHandle(ref, () => ({
    getAllValues,
    setAllValues
  }))
  const {
    getFieldValue,
    getFieldDecorator,
    setFieldsValue,
    validateFieldsAndScroll
  } = form;
  const [systemView, setSystemView] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [loading, toggleLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [treeSelected, setTreeSelected] = useState([]);
  const tableRef = useRef(null)
  const useAccount = getUserAccount();
  const evlValue = getFieldValue('evlLevel');
  const { query } = useLocation();
  const [tableCommonProps, tableCommonSets] = useTableProps();
  function formatSystemTree(arr) {
    const formatArray = arr.map(item => {
      const hasChildren = Array.isArray(item.children);
      if (hasChildren && item.children.length > 0) {
        return {
          ...item,
          key: item.id,
          title: item.name,
          disableCheckbox: type === 'detail',
          children: formatSystemTree(item.children)
        }
      }
      return {
        ...item,
        key: item.id,
        title: item.name,
        disableCheckbox: type === 'detail'
      }
    })
    return formatArray
  }
  async function getTableData(evlSystemId) {
    toggleLoading(true)
    const { data, success } = await findListById({ evlSystemId });
    toggleLoading(false)
    if (success) {
      setDataSource(data)
    }
  }
  async function businessSelected(item) {
    const paramsName = evlValue === 'BG' ? 'bgCode' : 'buCode';
    tableCommonSets.setDataSource([]);
    cleanSelectedRecord()
    const { data, success } = await findByBuCodeOrBgCode({
      [paramsName]: evlValue === 'BG' ? item.code : item.buCode
    })
    if (success) {
      tableCommonSets.setDataSource(data)
    }
  }
  // 获取已选树节点的对象
  function getTreeDataSourceRows(d, ks = [], rs = []) {
    const isValid = Array.isArray(d)
    if (!isValid) {
      return []
    }
    let res = rs;
    d.forEach(item => {
      if (ks.findIndex(k => k === item.id) !== -1) {
        res.push(item)
      }
      if (!!item.children) {
        return getTreeDataSourceRows(item.children, ks, res)
      }
    })
    return res
  }
  // 清除选中项
  function cleanSelectedRecord() {
    tableCommonSets.setRowKeys([])
    tableRef.current.manualSelectedRows([])
  }
  function getEvlLevelCorrelation(v) {
    if (v === 'CORP_AND_PURCHASE_ORG') {
      return null
    }
    if (v === 'BG') {
      return (
        <FormItem key='BG' label='业务板块' {...formLayout}>
          {
            getFieldDecorator('businessGroupCode'),
            getFieldDecorator('businessGroupName')(
              <ComboList
                {...businessUnitMainProps}
                form={form}
                afterSelect={businessSelected}
                disabled={type === 'detail'}
                name='businessGroupName'
                field={['businessGroupCode']}
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
            getFieldDecorator('businessUnitCode'),
            getFieldDecorator('businessUnitName')(
              <ComboList
                {...businessMainProps}
                form={form}
                name='businessUnitName'
                field={['businessUnitCode']}
                afterSelect={businessSelected}
                disabled={type === 'detail'}
              />
            )
          }
        </FormItem>
      )
    }
    return null
  }
  function addCheckId(item) {
    return { ...item, checkId: `${item.corporationCode}-${item.purchaseOrgCode}` }
  }
  // 处理新增
  function handleCreateOnOk(rows = []) {
    const { dataSource: ds } = tableCommonProps;
    const filterRows = rows.map(addCheckId).filter(item => {
      const isExist = ds.map(addCheckId).findIndex(d => d.checkId === item.checkId) !== -1;
      return !isExist;
    })
    tableCommonSets.setDataSource([
      ...filterRows,
      ...ds,
    ])
  }
  // 处理删除
  function handleRemove() {
    Modal.confirm({
      title: '删除',
      content: '确定要删除当前选中项？',
      onOk: () => {
        const { selectedRows: rs, dataSource: ds } = tableCommonProps;
        const filterRows = ds.map(addCheckId).filter(item => {
          const isExist = rs.map(addCheckId).findIndex(d => d.checkId === item.checkId) !== -1;
          return !isExist;
        })
        tableCommonSets.setDataSource(filterRows)
        cleanSelectedRecord()
      },
      okText: '删除',
      cancelText: '取消'
    })
  }
  // 评价层级选中后清除
  function handleEvlLevelSelect() {
    tableCommonSets.setDataSource([]);
    cleanSelectedRecord()
  }
  // 回填数据
  async function setAllValues(v) {
    const {
      projectName,
      corporationCode,
      corporationName,
      evlPeriodType,
      askCompleteTime, // 要求完成时间
      evlPeriodEndTime, // 评价期间
      evlPeriodStartTime,
      applicationPeriodEndTime,// 应用期间
      applicationPeriodStartTime,
      influenceSupplyList, // 是否影响合格供应商名录
      orgCode,
      orgName,
      creatorName,
      createDate,
      mainDataEvlSystemId,
      mainDataEvlSystemName,
      mainDataEvlSystem,
      evlLevel,
      // BG业务板块
      businessGroupCode,
      businessGroupName,
      // BU业务单元
      businessUnitName,
      businessUnitCode,
      seCorporationPurchaseOrgList,
      selectedEvlSystemIds
    } = v;
    const rangeTime = [moment(evlPeriodEndTime), moment(evlPeriodStartTime)]
    const applicationPeriodTime = [moment(applicationPeriodStartTime), moment(applicationPeriodEndTime)];
    await setFieldsValue({
      projectName,
      corporationCode,
      corporationName,
      evlPeriodType,
      askCompleteTime: moment(askCompleteTime), // 要求完成时间
      rangeTime,
      applicationPeriodTime,
      influenceSupplyList, // 是否影响合格供应商名录
      orgCode,
      orgName,
      creatorName,
      createDate,
      mainDataEvlSystemId,
      mainDataEvlSystemName,
      evlLevel
    })
    const sv = formatSystemTree([mainDataEvlSystem])
    await setSystemView(sv)
    await setCheckedKeys(selectedEvlSystemIds)
    await setExpandedKeys(selectedEvlSystemIds)
    await setFieldsValue({
      // BG业务板块
      businessGroupCode,
      businessGroupName,
      // BU业务单元
      businessUnitName,
      businessUnitCode
    })
    await tableCommonSets.setDataSource(seCorporationPurchaseOrgList)
  }
  // 处理参数
  async function getAllValues() {
    const vs = await validateFieldsAndScroll();
    if (checkedKeys.length === 0) {
      message.error('请至少选择一个评价体系节点')
      return
    }
    const { rangeTime, applicationPeriodTime, createdDate, ...fds } = vs;
    // 应用期间
    const at = applicationPeriodTime.map(item => moment(item).format('YYYY-MM-DD HH:mm:ss'));
    const [applicationPeriodStartTime, applicationPeriodEndTime] = at;
    // 评价期间
    const rt = rangeTime.map(item => moment(item).format('YYYY-MM-DD HH:mm:ss'));
    const ses = getTreeDataSourceRows(systemView, checkedKeys);
    const [evlPeriodStartTime, evlPeriodEndTime] = rt;
    const formatFields = {
      ...fds,
      applicationPeriodStartTime,
      applicationPeriodEndTime,
      evlPeriodStartTime,
      evlPeriodEndTime,
      seCorporationPurchaseOrgList: tableCommonProps.dataSource,
      selectedEvlSystems: ses
    }
    return formatFields
  }
  async function getInitialValue() {
    const { success, data, message: msg } = await findAppraiseById({
      evaluationProjectId: query?.id
    })
    // const { setAllValues } = formRef.current;
    if (success) {
      setAllValues(data)
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    if (type === 'detail' || type === 'editor') {
      getInitialValue()
    }
  }, [])
  useEffect(() => {
    if (treeSelected.length === 0) return
    const [id] = treeSelected;
    getTableData(id)
  }, [treeSelected])
  return (
    <div className={styles.wrapper}>
      <Form>
        <div className={styles.commonTitle}>
          基本信息
        </div>
        <Row gutter={[12, 0]}>
          <Col span={12}>
            <FormItem label='评价项目名称' {...formLayout}>
              {
                getFieldDecorator('projectName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写项目名称'
                    }
                  ]
                })(
                  <Input disabled={type === 'detail'} />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='公司' {...formLayout}>
              {
                getFieldDecorator('corporationCode'),
                getFieldDecorator('corporationName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择公司'
                    }
                  ]
                })(
                  <ComboList
                    {...corporationProps}
                    form={form}
                    field={['corporationCode']}
                    name='corporationName'
                    disabled={type === 'detail'}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='评价期间类型' {...formLayout}>
              {
                getFieldDecorator('evlPeriodType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择评价期间类型'
                    }
                  ]
                })(
                  <Select disabled={type === 'detail'}>
                    {
                      evlPeriodEmu.map(item => (
                        <Option key={`${item.value}`}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='评价期间' {...formLayout}>
              {
                getFieldDecorator('rangeTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择评价期间'
                    }
                  ]
                })(
                  <RangePicker disabled={type === 'detail'} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='要求完成时间' {...formLayout}>
              {
                getFieldDecorator('askCompleteTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择要求完成时间'
                    }
                  ]
                })(
                  <DatePicker disabled={type === 'detail'} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='应用期间' {...formLayout}>
              {
                getFieldDecorator('applicationPeriodTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择应用期间'
                    }
                  ]
                })(
                  <RangePicker disabled={type === 'detail'} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='是否影响合格供应商名录' {...formLayout}>
              {
                getFieldDecorator('influenceSupplyList', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否影响合格供应商名录',
                      type: 'boolean'
                    },

                  ]
                })(
                  <RadioGroup disabled={type === 'detail'}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='组织部门' {...formLayout}>
              {
                getFieldDecorator('orgCode'),
                getFieldDecorator('orgName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择组织部门'
                    }
                  ]
                })(
                  <ComboList
                    {...orgnazationProps}
                    form={form}
                    name='orgName'
                    field={['orgCode']}
                    disabled={type === 'detail'}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='发起人' {...formLayout}>
              {
                getFieldDecorator('creatorName', {
                  initialValue: useAccount
                })(
                  <Input disabled />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='发起时间' {...formLayout}>
              {
                getFieldDecorator('createdDate', {
                  initialValue: moment().format('YYYY-MM-DD')
                })(
                  <Input disabled />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <div className={styles.commonTitle}>评价体系</div>
        <Row span={24}>
          <Col>
            <FormItem label='评价体系' {...formLayoutAlone}>
              {
                getFieldDecorator('mainDataEvlSystemId'),
                getFieldDecorator('mainDataEvlSystemName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择评价体系'
                    }
                  ]
                })(
                  <ComboList
                    form={form}
                    name='mainDataEvlSystemName'
                    field={['mainDataEvlSystemId']}
                    {...evaluateSystemProps}
                    style={{ width: 350 }}
                    afterSelect={item => {
                      const fs = formatSystemTree([item]);
                      setSystemView(fs)
                    }}
                    disabled={type === 'detail'}
                  />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Tree
              treeData={systemView}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              checkable
              checkedKeys={checkedKeys}
              selectedKeys={treeSelected}
              onExpand={ks => {
                setAutoExpandParent(false)
                setExpandedKeys(ks)
              }}
              onCheck={ks => setCheckedKeys(ks)}
              onSelect={ks => setTreeSelected(ks)}
            ></Tree>
          </Col>
          <Col span={16}>
            <ExtTable
              loading={loading}
              showSearch={false}
              columns={columns}
              dataSource={dataSource}
              rowKey={item => item.id}
            />
          </Col>
        </Row>
        <div className={styles.commonTitle}>评价范围</div>
        <Row gutter={[12, 0]}>
          <Col span={12}>
            <FormItem label='评价层级' {...formLayout}>
              {
                getFieldDecorator('evlLevel', {
                  rules: [
                    {
                      required: true,
                      message: '请选择评价层级'
                    }
                  ]
                })(
                  <Select onSelect={handleEvlLevelSelect} disabled={type==='detail'}>
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
              getEvlLevelCorrelation(evlValue)
            }
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div style={{ padding: 12 }}>
              {
                evlValue === 'CORP_AND_PURCHASE_ORG' ? (
                  <>
                    <ComboModalList
                      className={styles.btn} type='primary'
                      title='新增'
                      disabled={type === 'detail'}
                      columns={businessColumns}
                      store={{
                        url: `${baseUrl}/api/corporationPurchaseOrgService/findByPage`,
                        type: 'POST',
                        params: {
                          quickSearchProperties: businessColumns.map(item => item.dataIndex)
                        }
                      }}
                      onOk={handleCreateOnOk}
                    >新增</ComboModalList>
                    <Button disabled={type === 'detail'} className={styles.btn} onClick={handleRemove}>删除</Button>
                  </>
                ) : null
              }
            </div>
            <ExtTable
              {...tableCommonProps}
              showSearch={false}
              onSelectRow={tableCommonSets.handleSelectedRows}
              columns={businessColumns}
              ellipsis={false}
              checkbox={{
                multiSelect: true
              }}
              ref={tableRef}
            />
          </Col>
        </Row>
      </Form>
    </div>
  )
})

export default create()(CommonForm);