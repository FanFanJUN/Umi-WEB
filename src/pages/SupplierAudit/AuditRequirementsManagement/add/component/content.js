import React, { useRef, useState } from 'react';
import { ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import { Col, Form, Input, Row, message } from 'antd';
import { EvaluationSystemConfig } from '../../../mainData/commomService';
import ShuttleBox from '../../../common/ShuttleBox';
const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const Content = (props) => {
  const tableRef = useRef(null);

  const [data, setData] = useState({
    leftTreeData: undefined,
    treeData: []
  })

  const {visible, form, type} = props

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (data.treeData.length !== 0) {
          console.log(values, data.treeData)
        } else {
          message.error('请至少选择一个体系!')
        }
      }
    });
  }

  const onCancel = () => {
    props.onCancel()
  }

  const clearSelected = () => {

  }

  const systemSelect = (value) => {
    setData(v => ({...v, leftTreeData: value}))
  }

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {
        getFieldDecorator(name, {
          initialValue: initialValue,
        })(
          <Input type={'hidden'}/>,
        )
      }
    </FormItem>
  );

  const getTreeData = (value) => {
    setData(v => ({...v, treeData: value}))
  }

  return (
    <ExtModal
      width={'90vh'}
      maskClosable={false}
      visible={visible}
      title={'审核内容管理'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={0}>
            {hideFormItem('systemId', '')}
          </Col>
          <Col span={0}>
            {hideFormItem('systemCode', '')}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核体系'}>
              {
                getFieldDecorator('systemName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '审核体系不能为空',
                    },
                  ],
                })(
                  <ComboTree
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'systemName'}
                    afterSelect={systemSelect}
                    field={['systemCode', 'systemId']}
                    {...EvaluationSystemConfig}
                  />,
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div style={{height: '300px', width: '100%'}}>
        <ShuttleBox
          onChange={getTreeData}
          leftTreeData={data.leftTreeData}
        />
      </div>
    </ExtModal>
  )

}

export default Form.create()(Content);
