import React, { useEffect, useRef, useState } from 'react';
import { ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import { Col, Form, Input, Row, message, Tree } from 'antd';
import { EvaluationSystemConfig, GetEvaluationSystem } from '../../../mainData/commomService';
import ShuttleBox from '../../../common/ShuttleBox';
import ShuttleBoxNew from '../../../common/ShuttleBoxNew';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const Content = (props) => {

  const [data, setData] = useState({
    header: [{}],
    leftTreeData: [],
    treeData: [],
  });

  const { visible, form, type, treeData } = props;

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  useEffect(() => {
    if (props.treeData && props.visible) {
      setData(v => ({ ...v, treeData: props.treeData }));
    }
  }, [props.treeData]);

  useEffect(() => {
    if (visible) {
      if (props.treeData && props.treeData.length !== 0) {
        let treeData = {}
        props.treeData.map(item => {
          if (!item.parentId) {
            treeData = item
            setFieldsValue({
              systemId: item.systemId,
              systemCode: item.systemCode,
              systemName: item.systemName,
            });
          }
        });
        GetEvaluationSystem({
          systemUseType: 'SupplierApprove',
          corpCode: props.applyCorporationCode,
        }).then(res => {
          if (res.success) {
            if (res.data && res.data.length !== 0) {
              res.data.map(v => {
                if (v.id === treeData.systemId) {
                  setData(a => ({ ...a, leftTreeData: v }));
                }
              })
            }
            console.log(res.data)
          }
        })
      }
    }
  }, [props.visible]);

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (data.treeData.length !== 0) {
          props.onOk(data.treeData);
        } else {
          message.error('请至少选择一个体系!');
        }
      }
    });
  };

  const onCancel = () => {
    props.onCancel();
  };

  const clearSelected = () => {
    setData(v => ({ ...v, leftTreeData: undefined, treeData: [] }));
  };

  const systemSelect = (value) => {
    setData(v => ({ ...v, leftTreeData: value }));
  };

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {
        getFieldDecorator(name, {
          initialValue: initialValue,
        })(
          <Input type={'hidden'} />,
        )
      }
    </FormItem>
  );

  const getTreeData = (value, operation=0) => {
    setData(v => ({ ...v, treeData: value }));
    props.setOperation && props.setOperation(operation)
  };

  return (
    <ExtModal
      width={'90vh'}
      centered
      maskClosable={false}
      visible={visible}
      title={'审核内容管理'}
      onCancel={onCancel}
      {...props.type === 'detail' && { footer: null }}
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
            {
              type !== 'detail' && <FormItem {...formItemLayoutLong} label={'审核体系'}>
                {
                  getFieldDecorator('systemName', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '审核体系不能为空',
                      },
                    ],
                  })(
                    <ComboList
                      allowClear={true}
                      style={{ width: '100%' }}
                      form={form}
                      defaultExpandAll={false}
                      name={'systemName'}
                      afterSelect={systemSelect}
                      field={['systemCode', 'systemId']}
                      cascadeParams={{
                        systemUseType: 'SupplierApprove',
                        corpCode: props.applyCorporationCode,
                      }}
                      {...EvaluationSystemConfig}
                    />,
                  )
                }
              </FormItem>
            }
          </Col>
        </Row>
      </Form>
      <div style={{ height: '300px', width: '100%' }}>
        <ShuttleBoxNew
          rightTreeData={treeData}
          type={type === 'detail' && 'show'}
          onChange={getTreeData}
          leftTreeData={data.leftTreeData}
        />
        {/*<ShuttleBox*/}
        {/*  rightTreeData={treeData}*/}
        {/*  type={type === 'detail' && 'show'}*/}
        {/*  onChange={getTreeData}*/}
        {/*  leftTreeData={data.leftTreeData}*/}
        {/*/>*/}
      </div>
    </ExtModal>
  );

};

export default Form.create()(Content);
