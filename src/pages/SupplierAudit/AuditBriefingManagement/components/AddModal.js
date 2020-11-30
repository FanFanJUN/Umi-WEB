/**
 * @Description: 新增Modal框
 * @Author: M!keW
 * @Date: 2020-11-23
 */
import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Col, Form, Row, InputNumber, message, DatePicker } from 'antd';
import { ComboList, ExtModal, YearPicker } from 'suid';
import { openNewTab } from '@/utils';
import { AllCompanyConfig } from '../../mainData/commomService';
import MonthPicker from './MonthPicker';
import moment from 'moment';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const AddModal = forwardRef(({ form }, ref) => {
  useImperativeHandle(ref, () => ({
    handleModalVisible,
  }));
  const tableRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const handleModalVisible = (flag) => {
    setVisible(!!flag);
  };

  //变化校验
  const yearChange = () => {
    setTimeout(() => {
      form.validateFields(['thisPeriod'], { force: true });
    }, 100);
  };
  const periodChange = () => {
    setTimeout(() => {
      form.validateFields(['nextPeriod'], { force: true });
    }, 100);
  };
  const onOk = () => {
    form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        openNewTab('supplierAudit/AuditBriefingManagementViewAdd?pageState=add&id=' + values, '审核简报-新增', false);
        setVisible(false);
      } else {
        message.error('请完成表单填写');
      }
    });
  };
  const { getFieldDecorator } = form;

  //校验是否在年内
  const checkInYear = (rule, value, callback) => {
    if (value && value.length > 0) {
      if (value[0].year() !== form.getFieldValue('year') || value[1].year() !== form.getFieldValue('year')) {
        callback('请选择该年度月份');
        return false;
      }
    }
    callback();
  };
  //校验月份
  const checkMonth = (rule, value, callback) => {
    if (value && value.length > 0) {
      if (value[0].year() !== form.getFieldValue('year') || value[1].year() !== form.getFieldValue('year')) {
        callback('请选择该年度月份');
        return false;
      }
      if (value[0].month() <= form.getFieldValue('thisPeriod')[1].month()) {
        callback('下期月份应该在本期截止之前');
        return false;
      }
    }
    callback();
  };

  return <ExtModal
    width={600}
    centered
    maskClosable={false}
    visible={visible}
    title="选择统计范围"
    onCancel={() => setVisible(false)}
    onOk={onOk}
    destroyOnClose
  >
    <Row>
      <Col span={22}>
        <FormItem  {...formLayout} label={'统计公司'}>
          {getFieldDecorator('applyCorporationName', {
            rules: [
              {
                required: true,
                message: '请选择统计公司',
              },
            ],
          })(
            <ComboList
              allowClear={true}
              style={{ width: '100%' }}
              form={form}
              name={'applyCorporationName'}
              field={['applyCorporationCode', 'applyCorporationId']}
              {...AllCompanyConfig}
            />,
          )
          }
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={22}>
        <FormItem {...formLayout} label="年份">
          {getFieldDecorator('year', {
            rules: [{ required: true, message: '年份不能为空!' }],
          })(
            <YearPicker
              onChange={yearChange}
              style={{ width: '100%' }}
              format='YYYY年'
            />)}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={22}>
        <FormItem {...formLayout} label="年度期间">
          {getFieldDecorator('yearPeriod', {
            rules: [{ required: true, message: '年度期间不能为空!' }],
          })(
            <MonthPicker/>,
          )}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={22}>
        <FormItem {...formLayout} label="本期">
          {getFieldDecorator('thisPeriod', {
            rules: [{ required: true, message: '本期不能为空!' }, { validator: checkInYear }],
          })(
            <MonthPicker
              onChange={periodChange}
              disabled={!form.getFieldValue('year')}/>,
          )}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={22}>
        <FormItem {...formLayout} label="下期">
          {getFieldDecorator('nextPeriod', {
            rules: [{ required: true, message: '下期不能为空!' }, { validator: checkMonth }],
          })(
            <MonthPicker
              // disabledDate={disabledDateStart}
              disabled={!form.getFieldValue('thisPeriod')}
            />)}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={22}>
        <FormItem {...formLayout} label="期数">
          {getFieldDecorator('number', {
            rules: [{ required: true, message: '期数不能为空!' }],
          })(
            <InputNumber style={{ width: '100%' }} min={0} step={1}/>)}
        </FormItem>
      </Col>
    </Row>
  </ExtModal>;

});

export default Form.create()(AddModal);
