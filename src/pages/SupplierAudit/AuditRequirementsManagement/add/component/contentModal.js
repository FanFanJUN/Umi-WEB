import React, { useState } from 'react';
import { ComboList, ComboTree, ExtModal } from 'suid';
import { Col, Form, Input, message, Row } from 'antd';
import {
  BUConfigNoFrost,
} from '../../../../QualitySynergy/commonProps';
import {
  ApplyOrganizationProps,
  AuditTypeManagementConfig, GetUserTelByUserId,
  PersonnelTypeConfig,
  RoleConfig, UserByDepartmentConfig,
} from '../../../mainData/commomService';
import { baseUrl, basicServiceUrl, gatewayUrl } from '../../../../../utils/commonUrl';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const ContentModal = (props) => {

  const { visible, title, data, type, form } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const [disabled, setDisabled] = useState(true);

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (data.lineNum) {
          values.lineNum = data.lineNum
        }
        props.onOk(values);
      }
    });
  };

  const departChange = (value) => {
    setFieldsValue({
      memberName: '',
      memberTel: '',
      employeeNo: ''
    });
  }

  const clearSelected = () => {
    props.form.resetFields();
  };

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

  const personChange = (value) => {
    setDisabled(value.code !== 'INTERNAL_USERS');
    setFieldsValue({
      memberName: getFieldValue('memberName') && '',
      memberTel: getFieldValue('memberTel') && '',
      employeeNo: getFieldValue('employeeNo') && '',
      departmentCode: getFieldValue('departmentCode') && '',
      departmentId: getFieldValue('departmentId') && '',
      departmentName: getFieldValue('departmentName') && ''
    });
  };

  const userSelect = (value) => {
    setFieldsValue({
      memberName: value.userName,
      employeeNo: value.user.tenantCode
    });
    GetUserTelByUserId({
      userId: value.user.id,
    }).then(res => {
      if (res.success) {
        setFieldsValue({
          memberTel: res.data.mobile,
        });
      } else {
        message.error('获取手机号失败');
      }
    });
  };

  return (
    <ExtModal
      width={'80vh'}
      visible={visible}
      title={title}
      onCancel={onCancel}
      maskClosable={false}
      afterClose={clearSelected}
      onOk={onOk}
    >
      <Form>
        <Row>
          <Col span={0}>
            {hideFormItem('memberRole', type === 'add' ? '' : data.memberRole)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'角色'}>
              {
                getFieldDecorator('memberRoleName', {
                  initialValue: type === 'add' ? '' : data.memberRoleName,
                  rules: [
                    {
                      required: true,
                      message: '角色不能为空',
                    },
                  ],
                })(<ComboList
                  form={form}
                  name={'memberRoleName'}
                  field={['memberRole']}
                  {...RoleConfig}
                />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={0}>
            {hideFormItem('memberType', type === 'add' ? '' : data.memberType)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'人员类型'}>
              {
                getFieldDecorator('memberTypeName', {
                  initialValue: type === 'add' ? '' : data.memberTypeName,
                  rules: [
                    {
                      required: true,
                      message: '人员类型不能为空',
                    },
                  ],
                })(<ComboList
                  form={form}
                  name={'memberTypeName'}
                  field={['memberType']}
                  afterSelect={personChange}
                  {...PersonnelTypeConfig}
                />)
              }
            </FormItem>
          </Col>
        </Row>
        {/*<Col span={0}>*/}
        {/*  {hideFormItem('departmentName', type === 'add' ? '' : data.departmentName)}*/}
        {/*</Col>*/}
        <Col span={0}>
          {hideFormItem('departmentId', type === 'add' ? '' : data.departmentId)}
        </Col>
        <Col span={0}>
          {hideFormItem('departmentCode', type === 'add' ? '' : data.departmentCode)}
        </Col>
        <Row>
          {
            !disabled && <Col span={24}>
              <FormItem {...formItemLayoutLong} label={'部门'}>
                {
                  getFieldDecorator('departmentName', {
                    initialValue: type === 'add' ? '' : data.departmentName,
                  })(
                    <ComboTree
                      form={form}
                      name={'departmentName'}
                      field={['departmentCode', 'departmentId']}
                      afterSelect={departChange}
                      {...ApplyOrganizationProps}
                    />,
                  )
                }
              </FormItem>
            </Col>
          }
          {
            !disabled && <Col span={24}>
              <FormItem {...formItemLayoutLong} label={'员工编号'}>
                {
                  getFieldDecorator('employeeNo', {
                    initialValue: type === 'add' ? '' : data.employeeNo,
                  })(
                    <ComboList
                      form={form}
                      name={'employeeNo'}
                      cascadeParams={{
                        organizationId: getFieldValue('departmentId'),
                      }}
                      afterSelect={userSelect}
                      store={{
                        data: {
                          includeSubNode: true,
                          quickSearchProperties: ['code', 'user.userName'],
                          organizationId: getFieldValue('departmentId'),
                          sortOrders: [{ property: 'code', direction: 'ASC' }],
                        },
                        type: 'POST',
                        autoLoad: false,
                        url: `${gatewayUrl}${basicServiceUrl}/employee/findByUserQueryParam`,
                      }}
                      {...UserByDepartmentConfig}
                    />,
                  )
                }
              </FormItem>
            </Col>
          }
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'姓名'}>
              {
                getFieldDecorator('memberName', {
                  initialValue: type === 'add' ? '' : data.memberName,
                  rules: [
                    {
                      required: true,
                      message: '姓名不能为空',
                    },
                  ],
                })(<Input disabled={!disabled} placeholder='请输入姓名'/>)
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'联系电话'}>
              {
                getFieldDecorator('memberTel', {
                  initialValue: type === 'add' ? '' : data.memberTel,
                  rules: [
                    {
                      required: true,
                      message: '联系电话不能为空',
                    },
                  ],
                })(<Input placeholder='请输入联系电话'/>)
              }
            </FormItem>
          </Col>
          {
            disabled && <Col span={24}>
              <FormItem {...formItemLayoutLong} label={'外部单位'}>
                {
                  getFieldDecorator('outsideCompany', {
                    initialValue: type === 'add' ? '' : data.outsideCompany,
                  })(<Input placeholder='请输入外部单位'/>)
                }
              </FormItem>
            </Col>
          }
        </Row>
      </Form>
    </ExtModal>
  );

};
export default Form.create()(ContentModal);
