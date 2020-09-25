import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { Form, Row, Icon, Input, Col, message, Button } from 'antd';
import { utils, ExtTable, ComboList } from 'suid';
import MatCatTree from './MatCatTree'
import { listAllGeneralTree } from '../../../services/supplierRegister'
const { create } = Form;
const FormItem = Form.Item;
//let materialId = [];
// let materialIddata = [];
const SupplyRangeRef = forwardRef(({
  form,
  initialValue = {},
  isView,
  editformData = {},
  editData = {}
}, ref) => {
  useImperativeHandle(ref, () => ({
    getSupplierRange,
    SupplierTemporary,
    setHeaderFields,
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [materialId, setMaterialId] = useState([]);
  useEffect(() => {
    getSupplyRange(editData);
    //let materialId = [];
    if (editData && editData.extendVo && editData.extendVo.materielCategories) {
      let materialIded = editData.extendVo.materielCategories.map(item => item ? item.id : '');
      materialName = editData.extendVo.materielCategories.map(item => item ? item.name : '').join('、');
      //materialId = materialIded
      var lists = materialIded.concat();
      console.log(lists)
      
      setTimeout(() => {
        setMaterialId(lists)
        console.log(materialId)
      }, 100);
     
    }
    let materialName = [];

  }, [editData])
  const formItemLayoutLong = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  function getSupplyRange(val) {
    let editData = val;
   
  }
  // 暂存
  function SupplierTemporary() {
    let result = {};
    form.validateFieldsAndScroll((err, values) => {
      result = values;
    });
    return result;
  }
  // 获取表单值
  function getSupplierRange() {
    let result = false;
    form.validateFieldsAndScroll((err, values) => {
      result = values;
    });
    return result;
  }
  // 设置所有表格参数
  const setHeaderFields = (fields) => {
    //const { attachmentId = null, ...fs } = fields;
    // setAttachment(attachmentId)
    // setFieldsValue(fs)
  }
  
  return (
    <div>
      <Form>
        <Row>
          <Col span={24}>
            <FormItem
              {...formItemLayoutLong}
              label={'供应范围描述'}
            >
              {
                isView ?
                  <span>{editData.extendVo ? editData.extendVo.supplyScopeRemark : ''}</span> :
                  getFieldDecorator('extendVo.supplyScopeRemark', {
                    initialValue: editData && editData.extendVo ? editData.extendVo.supplyScopeRemark : '',
                  })(
                    <Input placeholder={'请输入供应范围描述'} maxLength={1024}/>,
                  )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem
              {...formItemLayoutLong}
              label={'物料分类'}>
              {
                getFieldDecorator('extendVo.matCatIds', {
                  initialValue: materialId ? materialId : null,
                  // rules: isView ? [] : [{
                  //   required: true,
                  //   message: '请选择物料分类',
                  // }],
                })(
                  
                  <MatCatTree
                    service={listAllGeneralTree}
                    isView={isView}
                    defaultCheckedKeys={materialId}
                  />
                )
              }

            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
)
const CommonForm = create()(SupplyRangeRef)

export default CommonForm