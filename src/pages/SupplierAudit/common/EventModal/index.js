/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-12 15:35:48
 * @LastEditTime: 2020-10-12 16:27:10
 * @Description: 新增 编辑  可配置表单
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/common/EventModal/index.js
 */
import React from 'react';
import { Col, DatePicker, Form, Radio, Row, Select, InputNumber, Input } from 'antd';
import { ExtModal, ComboList } from 'suid';
import moment from 'moment';
import { baseUrl } from '../../../../utils/commonUrl';
import { OrganizationByCompanyCodeConfig } from '../../../QualitySynergy/commonProps';

const FormItem = Form.Item;

const EventModal = (props) => {

    const { propData: { visible, title, type }, data, fieldsConfig = [], form } = props;

    const editDataTemp = (type === 'edit' ? data : null);

    const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll } = form;

    const onCancel = () => {
        props.onCancel();
    };

    const onOk = () => {
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                props.onOk(values);
            }
        });
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
    function getItem(item, form) {
        /*  params-------------前端传到后端的参数名-------数组格式
              keys-------------需要获取相应form的form 字段名值----数组格式并且和1params相匹配一一对应 如果想设置为空传null
              setKeys------------需要通过onchange事件来存储和改变的form Item值--------数组格式
              valueKeys----------需要获取整条数据中的哪些值----------------------数组格式和setKeys一一对应 如果想设置为空传null
          */
        const temp = {};
        if (item.params && item.keys && item.params.length > 0 && item.keys.length === item.params.length) {
            item.params.forEach((subitem, index) => {
                Object.assign(temp, { [subitem]: item.keys[index] === null ? null : form.getFieldValue(item.keys[index]) });
            });
        }
        const onChangeItem = (record) => {
            if (item.setKeys && item.valueKeys && item.setKeys.length > 0 && item.setKeys.length === item.valueKeys.length) {
                item.setKeys.forEach((subItem, index) => {
                    form.setFieldsValue(
                        { [subItem]: item.valueKeys[index] === null ? null : record[item.valueKeys[index]] }
                    );
                });
            }
        };
        switch (item.type) {
            case 'selectWithData':
                return <Select placeholder={item.placeholder ? item.placeholder : '请选择'} style={{ width: '100%' }} allowClear {...item}>
                    {item.data.map((dataItem, index) =>
                        <Select.Option key={index} value={dataItem.value}>{dataItem.text}</Select.Option>)}
                </Select>;
            case 'datePicker':
                return <DatePicker placeholder={item.placeholder ? item.placeholder : '请选择'} style={{ width: '100%' }} />;
          case 'radio':
                const options = [...item.children];
                const newOpetions = options.map((value, index, array) => {
                    return <Radio key={value.value} value={value.value}>{value.text}</Radio>;
                });
            case 'inputNumber':
                return <InputNumber placeholder={item.placeholder ? item.placeholder : '请输入'} style={{ width: '100%' }} formatter={item.formatter} min={item.min} max={item.max} precision={item.precision} />;
            case 'textArea':
                return <Input.TextArea placeholder={item.placeholder ? item.placeholder : '请输入'} rows={4} maxLength={item.maxLength ? item.maxLength : 500} />;
            default:
                return <Input
                    placeholder={item.placeholder ? item.placeholder : '请输入'}
                    autoComplete="off"
                    maxLength={item.unlimited ? null : 128}
                    disabled={item.disabled ? item.disabled : false}
                />;
        }
    };

    function renderForm() {
        return (
            <Form>
                <Row>
                    {
                        fieldsConfig && fieldsConfig.map((item => {
                            return (
                               item.type !== 'comboList' ?  <Col key={`${item.code}_col`} span={24} style={{ display: item.hidden ? 'none' : 'block' }}>
                                 <FormItem key={item.code} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label={item.name}>
                                   {getFieldDecorator(item.code, {
                                     initialValue: editDataTemp ? (item.type === 'datePicker' ? editDataTemp[item.code] ? moment(editDataTemp[item.code]).format('YYYY-MM-DD') : null : editDataTemp[item.code]) : item.defaultValue,
                                     rules: item.rules ? item.rules : [
                                       {
                                         required: true,
                                         message: `请输入${item.name}`
                                       }
                                     ],
                                     normalize: item.normalize ? item.normalize : (value) => { return value; },
                                   })(getItem(item, form))}
                                 </FormItem>
                               </Col> : <>
                                 {
                                   item.field.map((response, index) => {
                                    return <Col span={0} key={index}>
                                       {hideFormItem(response, type === 'edit' ? data ? data[response] : '' : '')}
                                     </Col>
                                   })
                                 }
                                 <Col key={`${item.code}_col`} span={24} style={{ display: item.hidden ? 'none' : 'block' }}>
                                   <FormItem key={item.code} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label={item.name}>
                                     {
                                       getFieldDecorator(item.code, {
                                         initialValue: editDataTemp ? (item.type === 'datePicker' ? editDataTemp[item.code] ? moment(editDataTemp[item.code]).format('YYYY-MM-DD') : null : editDataTemp[item.code]) : item.defaultValue,
                                         rules: item.rules ? item.rules : [
                                           {
                                             required: true,
                                             message: `请输入${item.name}`
                                           },
                                         ],
                                       })(<ComboList form={form} field={item.field} name={item.code} {...item.config} />)
                                     }
                                   </FormItem>
                                 </Col>
                               </>
                            );
                        }))
                    }
                </Row>
            </Form>
        )
    }

    return (
        <ExtModal
            width={'80vh'}
            visible={visible}
            title={title}
            onCancel={onCancel}
            maskClosable={false}
            onOk={onOk}
        >
            {renderForm()}
        </ExtModal>
    )
}



export default Form.create()(EventModal);
