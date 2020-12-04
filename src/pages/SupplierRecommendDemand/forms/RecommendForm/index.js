import { forwardRef, useImperativeHandle, useState, createRef } from 'react';
import { Form, Row, Col, Input, Button, Radio, Checkbox, Tree, Modal } from 'antd';
import { ComboList, ComboTree, ExtTable } from 'suid';
import { Header, ComboAttachment, UserSelect } from '../../../../components'
import RecommendCompany from '../RecommendCompany'
import moment from 'moment';
import { commonProps, getUserName } from '../../../../utils';
import styles from './index.less';
const {
  corporationProps,
  orgnazationProps,
  supplierProps_no_filter,
  materialClassProps,
  fimlyMaterialClassifyProps,
  // evaluateSystemProps,
  originFactoryProps,
  evaluateSystemFormCodeProps
} = commonProps;
const { Group: RadioGroup } = Radio;
const { Group: CheckboxGroup } = Checkbox;
const { TextArea } = Input;
const recommendCheckbox = [
  {
    label: '质量优势',
    value: 'qualityAdvantage'
  },
  {
    label: '价格优势',
    value: 'priceAdvantage'
  },
  {
    label: '新品开发需要',
    value: 'newProductDemand'
  },
  {
    label: '现有资源不足（独家供货）',
    value: 'insufficientExclusiveSupply'
  },
  {
    label: '现有资源不足（产能不足）',
    value: 'insufficientCapacity'
  }
]

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
    width: 150
  }
];

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
const { Item: FormItem } = Form;
const FormContext = forwardRef(({
  form,
  type = 'add',
  systemUseType = 'SupplierRegister'
}, ref) => {
  useImperativeHandle(ref, () => ({
    form,
    setFieldsValue,
    setRecommendCompany,
    resetFields,
    setAllFormatValues,
    getAllFormatValues
  }))
  const [isAgent, changeAgentState] = useState(false);
  const [recommendCompany, setRecommendCompany] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [systemView, setSystemView] = useState(null);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const checkbox = type === 'detail' ? false : { multiSelect: true };
  const evaluateSystemProps = {
    ...evaluateSystemFormCodeProps,
    store: {
      ...evaluateSystemFormCodeProps.store,
      params: {
        systemUseType: systemUseType
      }
    }
  }
  const left = type === 'detail' ? null : (
    <>
      <Button
        style={{ margin: '0 6px' }}
        onClick={() => {
          recRef.current.show()
        }}
        disabled={type === 'detail'}
      >新增</Button>
      <Button
        onClick={handleRemoveSelectedRows}
        disabled={type === 'detail' || empty}
      >删除</Button>
    </>
  )
  // const [selectedRows, setRows] = useState([]);
  const recRef = createRef(null);
  const {
    setFieldsValue,
    resetFields,
    getFieldDecorator,
    getFieldValue,
    validateFieldsAndScroll
  } = form;
  const empty = selectedRowKeys.length === 0;
  const originSupplierId = getFieldValue('supplierId')
  function handleSelectRecommendCompany(select) {
    setRecommendCompany(select)
  }
  function handleSelectRecommendCompanyAndContinue(select) {
    setRecommendCompany(select)
  }
  async function getAllFormatValues() {
    const v = await validateFieldsAndScroll().then(_ => _)
    const { files } = v;
    const hasFile = Array.isArray(files);
    return { ...v, supplierRecommendDemandLines: recommendCompany, attachmentIds: hasFile ? files.map(item => item.id) : null }
  }
  function setAllFormatValues({
    fields = {},
    treeData = {}
  }) {

    const { attachmentId, supplierCategory, ...other } = fields;
    const name = supplierCategory?.name;
    const reg = /代理商/g;
    const result = reg.test(name);
    changeAgentState(result)
    setFieldsValue(other)
    setSystemView(treeData)
    setAttachment(attachmentId)
  }
  function formatViewData(iview) {
    if (iview.children) {
      return {
        ...iview,
        title: iview.name,
        key: iview.id,
        children: iview.children.map(item => formatViewData(item))
      }
    }
    return {
      ...iview,
      title: iview.name,
      key: iview.id
    }
  }
  function getSystemTreeView() {
    if (!!systemView) {
      const treeData = formatViewData(systemView)
      return (<Tree selectable={false} treeData={[treeData]}></Tree>)
    }
  }
  function handleSelectedRows(ks) {
    setRowKeys(ks)
  }
  function handleRemoveSelectedRows() {
    Modal.confirm({
      title: '删除拟推荐公司',
      content: '确定要删除所选的拟推荐公司？',
      okText: '确定删除',
      onOk: () => {
        const newData = recommendCompany.filter(item => {
          return !selectedRowKeys.includes(`${item.identifyTypeCode}-${item.purchaseOrgCode}`)
        })
        setRecommendCompany(newData)
      },
      cancelText: '取消'
    })
  }
  return (
    <div className={styles.wrapper}>
      <Form style={{ width: '80vw' }}>
        <div className={styles.title}>基本信息</div>
        <Row>
          <Col span={12}>
            <FormItem label='申请公司' {...formLayout}>
              {
                getFieldDecorator('corporationCode'),
                getFieldDecorator('corporationName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择申请公司'
                    }
                  ]
                })(
                  <ComboList
                    form={form}
                    name='corporationName'
                    {...corporationProps}
                    placeholder='选择申请公司'
                    field={['corporationCode']}
                    disabled={type === 'detail'}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='创建人' {...formLayout}>
              {
                getFieldDecorator('creatorName', {
                  initialValue: getUserName()
                })(
                  <Input disabled />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='创建部门' {...formLayout}>
              {
                getFieldDecorator('orgCode'),
                getFieldDecorator('orgName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择创建部门'
                    }
                  ]
                })(
                  <ComboTree
                    form={form}
                    name='orgName'
                    {...orgnazationProps}
                    field={['orgCode']}
                    disabled={type === 'detail'}
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
        <Row>
          <div className={styles.title}>推荐信息</div>
          <Col span={12}>
            <FormItem label='供应商名称' {...formLayout}>
              {
                getFieldDecorator('supplierId'),
                getFieldDecorator('supplierName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择供应商'
                    }
                  ]
                })(
                  <ComboList
                    form={form}
                    name='supplierName'
                    {...supplierProps_no_filter}
                    field={['supplierId', 'supplierCode']}
                    afterSelect={(item) => {
                      const name = item?.supplierCategory?.name;
                      const reg = /代理商/g;
                      const result = reg.test(name);
                      changeAgentState(result)
                      // if(reg)
                    }}
                    disabled={type === 'detail'}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='供应商代码' {...formLayout}>
              {
                getFieldDecorator('supplierCode')(
                  <Input disabled placeholder='供应商代码' />
                )
              }
            </FormItem>
          </Col>
        </Row>
        {/* 仅代理商显示原厂选项 */}
        {
          isAgent ?
            <Row>
              <Col span={12}>
                <FormItem label='原厂名称' {...formLayout}>
                  {
                    getFieldDecorator('originFactoryName', {
                      rules: [
                        {
                          required: true,
                          message: '请选择原厂'
                        }
                      ]
                    })(
                      <ComboList
                        form={form}
                        name='originFactoryName'
                        {...originFactoryProps}
                        store={{
                          ...originFactoryProps.store,
                          params: {
                            supplierId: originSupplierId
                          }
                        }}
                        field={['originFactoryCode']}
                        disabled={type === 'detail'}
                      />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='原厂代码' {...formLayout}>
                  {
                    getFieldDecorator('originFactoryCode')(
                      <Input disabled placeholder='选择原厂' />
                    )
                  }
                </FormItem>
              </Col>
            </Row> : null
        }
        <Row>
          <Col span={12}>
            <FormItem label='物料分类' {...formLayout}>
              {
                getFieldDecorator('materialCategoryName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择物料分类'
                    }
                  ]
                })(
                  <ComboTree
                    form={form}
                    name='materialCategoryName'
                    {...materialClassProps}
                    field={['materialCategoryCode']}
                    disabled={type === 'detail'}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='物料分类代码' {...formLayout}>
              {
                getFieldDecorator('materialCategoryCode', {
                  rules: [
                    {
                      required: true,
                      message: '请选择物料分类代码'
                    }
                  ]
                })(
                  <Input disabled placeholder='选择物料分类代码' />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='认定物料类别' {...formLayout}>
              {
                getFieldDecorator('identifyMaterialLevelValue'),
                getFieldDecorator('identifyMaterialLevelName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择认定物料类别'
                    }
                  ]
                })(
                  <ComboList
                    form={form}
                    name='identifyMaterialLevelName'
                    {...fimlyMaterialClassifyProps}
                    field={['identifyMaterialLevelValue']}
                    disabled={type === 'detail'}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='采购小组组长' {...formLayout}>
              {
                getFieldDecorator('purchaseTeamLeaderCode'),
                getFieldDecorator('purchaseTeamLeaderId'),
                getFieldDecorator('purchaseTeamLeaderName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择采购小组组长'
                    }
                  ]
                })(
                  <UserSelect
                    disabled={type === 'detail'}
                    placeholder='选择采购小组组长'
                    form={form}
                    mode="tags"
                    name='purchaseTeamLeaderName'
                    multiple={false}
                    reader={{
                      name: 'userName',
                      field: ['code', 'id']
                    }}
                    field={['purchaseTeamLeaderCode', 'purchaseTeamLeaderId']}
                  />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem label='拟推荐公司(多个)' {...formLayoutAlone} required>
            </FormItem>
            <Header
              left={left}
            ></Header>
            <ExtTable
              showSearch={false}
              dataSource={recommendCompany}
              columns={recommendColumns}
              rowKey={item => `${item.identifyTypeCode}-${item.purchaseOrgCode}`}
              checkbox={checkbox}
              selectedRowKeys={selectedRowKeys}
              onSelectRow={handleSelectedRows}
            ></ExtTable>
          </Col>
        </Row>
        <div className={styles.title}>供应商自评</div>
        <Row>
          <Col span={24}>
            <FormItem label='评价体系' {...formLayoutAlone}>
              {
                getFieldDecorator('selfMainDataEvlSystemId'),
                getFieldDecorator('selfMainDataEvlSystemName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择评价体系'
                    }
                  ]
                })(
                  <ComboList
                    form={form}
                    name='selfMainDataEvlSystemName'
                    field={['selfMainDataEvlSystemId']}
                    {...evaluateSystemProps}
                    style={{ width: 350 }}
                    afterSelect={item => {
                      setSystemView(item)
                    }}
                    disabled={type === 'detail'}
                  />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formLayoutAlone} label=' ' colon={false}>
              {
                getSystemTreeView()
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <div className={styles.title}>推荐理由</div>
          <Col span={24}>
            <FormItem label='推荐理由' {...formLayoutAlone}>
              {
                getFieldDecorator('recommendReasons', {
                  rules: [
                    {
                      required: true,
                      message: '请选择推荐理由'
                    }
                  ]
                })(
                  <CheckboxGroup options={recommendCheckbox}
                    disabled={type === 'detail'} />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem label='合作意愿' {...formLayoutAlone}>
              {
                getFieldDecorator('willingnessToCooperate', {
                  rules: [
                    {
                      required: true,
                      message: '请选择合作意愿'
                    }
                  ]
                })(
                  <RadioGroup
                    disabled={type === 'detail'}>
                    <Radio value='COMMONLY'>一般</Radio>
                    <Radio value='STRONGER'>较强烈</Radio>
                    <Radio value='STRONG'>强烈</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='简要说明' {...formLayout}>
              {
                getFieldDecorator('briefDescription', {
                  rules: [
                    {
                      required: true,
                      message: '请填写简要说明'
                    }
                  ]
                })(
                  <TextArea
                    disabled={type === 'detail'} rows={6} maxLength={500} />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='附件资料' {...formLayoutAlone}>
              {
                getFieldDecorator('files')(
                  <ComboAttachment uploadButton={{
                    disabled: type === 'detail'
                  }} allowDelete={type !== 'detail'}
                    showViewType={type !== 'detail'} customBatchDownloadFileName={true} attachment={attachment} />
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
      <RecommendCompany
        ref={recRef}
        initialDataSource={recommendCompany}
        onContinue={handleSelectRecommendCompanyAndContinue}
        onOk={handleSelectRecommendCompany}
      />
    </div>
  )
})

const FormInit = Form.create()(FormContext)

export default FormInit;