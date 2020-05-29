import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef
} from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Tooltip
} from 'antd';
import {
  materialClassProps,
  corporationProps,
  materialClassTypeProps,
  costTargetProps,
  frequencyProps,
  priceCombineProps,
  planSupplyResourceAmountProps
} from '@/utils/commonProps';
import { ComboSelect, ComboDatePicker, ComboAttachment } from '@/components';
import { ComboTree, ComboGrid, ComboList } from 'suid';
import { leftPad } from '@/utils';
import { baseUrl } from '../../../utils/commonUrl';
const { create, Item } = Form;
const { TextArea } = Input;
const formLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const formLayoutAlone = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}
const CommonForm = forwardRef(({
  visible,
  form,
  lineNumber = 0,
  onCancel = () => null,
  onOk = () => null,
  initialValues = {},
  type = 'add',
  mode = 'add',
  levelCode= '',
  loading,
}, ref) => {
  useImperativeHandle(ref, () => ({ form }))
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue
  } = form;
  useEffect(() => {
    if (type === 'editor' && visible) {
      const {
        msg,
        id,
        tenantCode,
        headerId,
        lastEditedDate,
        lastEditorName,
        lastEditorId,
        creatorName,
        lastEditorAccount,
        createdDate,
        creatorAccount,
        creatorId,
        lineNo,
        planSupplyResourceTypeAmount,
        adjustScopeList,
        pricingDateList: dateList,
        invalid,
        reference,
        attachment,
        localId,
        changeable,
        ...other
      } = initialValues;
      const adjustScopeListName = adjustScopeList.map(item => item.name);
      const adjustScopeListCode = adjustScopeList.map(item => item.code);
      const pricingDateList = dateList.map(item => item.date)
      const fields = {
        ...other,
        adjustScopeListName,
        adjustScopeListCode,
        pricingDateList
      }
      setFieldsValue(fields)
    }
  }, [visible])
  const fre = getFieldValue('pricingFrequency') || 'unknow';
  const files = getFieldValue('files') || []
  const cost = getFieldValue('costTargetName');
  const costText = getFieldValue('costTargetRemark');
  // const isCostInit = !cost
  const allowUpload = files.length !== 1;
  const comboDatePickerDisabled = (fre === 'unknow') || (fre === 'Order') || (fre === 'Demand');
  const title = `行号：${leftPad(lineNumber, 4, '0')}`;
  const { attachment } = initialValues;
  const materialClassPropsAddParams = {
    ...materialClassProps,
    store: {
      url: `${baseUrl}/SecondaryClassificationMaterialGroup/listTreeByMaterialLevel`,
      params: {
        materialLevel: levelCode
      }
    }
  }
  const datePickerRef = useRef(null)
  function handleSubmit() {
    validateFieldsAndScroll((err, val) => {
      if (!err) {
        onOk(val)
      }
    })
  }
  return (
    <Modal
      bodyStyle={{
        height: '60vh',
        overflowY: 'scroll'
      }}
      confirmLoading={loading}
      visible={visible}
      title={title}
      onCancel={onCancel}
      destroyOnClose
      width='80vw'
      maskClosable={false}
      onOk={handleSubmit}
    >
      <Row>
        <Col span={12}>
          <Item label='物料二次分类' {...formLayout}>
            {
              getFieldDecorator('materialClassificationCode'),
              getFieldDecorator('materialClassificationName', {
                rules: [
                  {
                    required: true,
                    message: '请选择物料二次分类'
                  }
                ]
              })(<ComboTree form={form} {...materialClassPropsAddParams} name='materialClassificationName' field={['materialClassificationCode']} disabled={mode === 'change' && type === 'editor'} />)
            }
          </Item>
        </Col>
        <Col span={12}>
          <Item label='预计需求数量' {...formLayout}>
            {
              getFieldDecorator('expectedDemandScaleAmount', {
                rules: [
                  {
                    required: true,
                    message: '请填写预计需求数量'
                  }
                ]
              })(<Input type='number' placeholder='请输入预计需求数量' />)
            }
          </Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Item {...formLayout} label='预计需求规模'>
            {
              getFieldDecorator('expectedDemandScalePrice', {
                rules: [
                  {
                    required: true,
                    message: '请填写预计需求规模（万元）'
                  }
                ]
              })(<Input placeholder='请输入预计需求规模(万元)' type='number' addonAfter='万元' />)
            }
          </Item>
        </Col>
        <Col span={12}>
          <Item {...formLayout} label='适应范围'>
            {
              getFieldDecorator('adjustScopeListCode'),
              getFieldDecorator('adjustScopeListName', {
                rules: [
                  {
                    type: 'array',
                    required: true,
                    message: '请选择适应范围'
                  }
                ]
              })(<ComboSelect {...corporationProps} placeholder='选择适应范围' name='adjustScopeListName' field={['adjustScopeListCode']} form={form} />)
            }
          </Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Item label='采购方式' {...formLayout}>
            {
              getFieldDecorator('purchaseTypeCode'),
              getFieldDecorator('purchaseTypeName', {
                rules: [
                  {
                    required: true,
                    message: '请选择采购方式'
                  }
                ]
              })(<ComboGrid {...materialClassTypeProps} name='purchaseTypeName' field={['purchaseTypeCode']} form={form} />)
            }
          </Item>
        </Col>
        <Col span={12}>
          <Item label='规划供应资源数量' {...formLayout}>
            {
              getFieldDecorator('planSupplyResourceTypeCode'),
              getFieldDecorator('planSupplyResourceTypeName', {
                rules: [
                  {
                    required: true,
                    message: '请选择规划供应资源数量'
                  }
                ]
              })(
                <ComboList form={form} {...planSupplyResourceAmountProps} name='planSupplyResourceTypeName' field={['planSupplyResourceTypeCode']} />
              )
            }
          </Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Item label='价格组成' {...formLayout}>
            {
              getFieldDecorator('priceCombineCode'),
              getFieldDecorator('priceCombineName', {
                rules: [
                  {
                    required: true,
                    message: '请选择价格组成'
                  }
                ]
              })(
                <ComboList {...priceCombineProps} form={form} name='priceCombineName' field={['priceCombineCode']} />
              )
            }
          </Item>
        </Col>
        <Col span={12}>
          <Item label='定价频次' {...formLayout}>
            {
              getFieldDecorator('pricingFrequency'),
              getFieldDecorator('pricingFrequencyName', {
                rules: [
                  {
                    required: true,
                    message: '请选择定价频次'
                  }
                ],
              })(
                <ComboList {...frequencyProps} form={form} name='pricingFrequencyName' afterSelect={() => datePickerRef.current.cleanValues()} field={['pricingFrequency']} />
              )
            }
          </Item>
        </Col>
      </Row>
      <Row>
        <Item label='定价时间' {...formLayoutAlone}>
          {
            getFieldDecorator('pricingDateList', {
              rules: [
                {
                  type: 'array',
                  message: '请选择定价时间',
                  required: !comboDatePickerDisabled
                },
                {
                  validator: (_, value = [], cb) => {
                    const fre = getFieldValue('pricingFrequency') || 'unknow';
                    if (fre === 'Annually' && value.length !== 1) {
                      cb('请选择年度 1 个定价时间')
                      return
                    }
                    if (fre === 'SemiAnnually' && value.length !== 2) {
                      cb('请选择半年 2 个定价时间')
                      return
                    }
                    if (fre === 'Quarterly' && value.length !== 4) {
                      cb('请选择季度 4 个定价时间')
                      return
                    }
                    if (fre === 'Monthly' && value.length !== 12) {
                      cb('请选择月度 12 个定价时间')
                      return
                    }
                    if (fre === 'TenDays' && value.length !== 12) {
                      cb('请选择按旬 12 个定价时间')
                      return
                    }
                    cb()
                  }
                }
              ],
              validateFirst: true
            })(
              <ComboDatePicker
                disabled={comboDatePickerDisabled}
                placeholder={comboDatePickerDisabled ? '暂无可选时间' : '选择定价时间'}
                frequency={fre}
                ref={datePickerRef}
                type={type}
              />
            )
          }
        </Item>
      </Row>
      <Row>
        <Item label='市场运行情况' {...formLayoutAlone}>
          {
            getFieldDecorator('runningOperation', {
              rules: [
                {
                  required: true,
                  message: '请填写市场运行情况'
                }
              ]
            })(<TextArea maxLength={800} placeholder='填写市场运行情况' />)
          }
        </Item>
      </Row>
      <Row>
        <Item label='资源保障情况' {...formLayoutAlone}>
          {
            getFieldDecorator('resourceOperation', {
              rules: [
                {
                  required: true,
                  message: '请填写资源保障情况'
                }
              ]
            })(<TextArea maxLength={800} placeholder='填写资源保证情况' />)
          }
        </Item>
      </Row>
      <Row>
        <Col span={10}>
          <Item label='成本目标' labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
            {
              getFieldDecorator('costTarget'),
              getFieldDecorator('costTargetName', {
                rules: [
                  {
                    required: true,
                    message: '选择成本目标'
                  }
                ]
              })(
                <ComboList {...costTargetProps} name='costTargetName' field={['costTarget']} form={form} />
              )
            }
          </Item>
        </Col>
        <Col span={14}>
          <Tooltip title={costText} placement='topLeft'>
            <Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
              {
                getFieldDecorator('costTargetRemark')(<Input disabled={!cost} />)
              }
            </Item>
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Item label='成本控制方式' {...formLayoutAlone}>
          {
            getFieldDecorator('costControlWay', {
              rules: [
                {
                  required: true,
                  message: '请填写成本控制方式'
                }
              ]
            })(
              <TextArea maxLength={800} placeholder='填写成本控制方式' />
            )
          }
        </Item>
      </Row>
      <Row>
        <Item label='库存控制方式' {...formLayoutAlone}>
          {
            getFieldDecorator('storageControlWay', {
              rules: [
                {
                  required: true,
                  message: '请填写库存控制方式'
                }
              ]
            })(
              <TextArea maxLength={800} placeholder='库存控制方式' />
            )
          }
        </Item>
      </Row>
      <Row>
        <Item label='供应商选择原则' {...formLayoutAlone}>
          {
            getFieldDecorator('supplierSelectRule', {
              rules: [
                {
                  required: true,
                  message: '请填写供应商选择原则'
                }
              ]
            })(
              <TextArea maxLength={800} placeholder='供应商选择原则' />
            )
          }
        </Item>
      </Row>
      <Row>
        <Item label='供应商合作方式' {...formLayoutAlone}>
          {
            getFieldDecorator('supplierCooperationWay', {
              rules: [
                {
                  required: true,
                  message: '请填写供应商合作方式'
                }
              ]
            })(
              <TextArea maxLength={800} placeholder='供应商合作方式' />
            )
          }
        </Item>
      </Row>
      <Row>
        <Item label='附件' {...formLayoutAlone}>
          {
            getFieldDecorator('files')(
              <ComboAttachment
                allowPreview={false}
                maxUploadNum={1}
                allowUpload={allowUpload}
                attachment={attachment}
                multiple={false}
                customBatchDownloadFileName={true}
              />
            )
          }
        </Item>
      </Row>
      <Row>
        <Item label='备注' {...formLayoutAlone}>
          {
            getFieldDecorator('remark')(<TextArea maxLength={800} placeholder='备注...' />)
          }
        </Item>
      </Row>
    </Modal>
  )
})

export default create()(CommonForm)