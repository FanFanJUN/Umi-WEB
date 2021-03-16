import React, { forwardRef } from 'react';
import { Modal, Form, Col, Row, Input } from 'antd';
import moment from 'moment';
import { ComboList } from 'suid';
import { baseUrl, basicServiceUrl, gatewayUrl } from '../../../../utils/commonUrl';
import { AreaConfig, AuditOrganizationConfig } from '../../AnnualAuditPlan/propsParams';

const FormItem = Form.Item;

let AddModal = forwardRef((props) => {

  const { visible, onOk, onCancel, form } = props;

  const { getFieldDecorator } = props.form;

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

  return <Modal
    visible={visible}
    width={'50vw'}
    title={'新增审核组织方式'}
    onOk={onOk}
    onCancel={onCancel}
  >
    <Form>
      <Row>
        <Col span={0}>
          {hideFormItem('reviewOrganizedWayId', '')}
        </Col>
        <Col span={0}>
          {hideFormItem('reviewOrganizedWayCode', '')}
        </Col>
        <Col span={24}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label={'采购需求方式'}>
            {
              getFieldDecorator('reviewOrganizedWayName', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: `请选择`,
                  },
                ],
              })(<ComboList
                style={{ width: '100%' }}
                width={'160px'}
                form={form}
                name={'reviewOrganizedWayName'}
                field={['reviewOrganizedWayId', 'reviewOrganizedWayCode']}
                store={{
                  type: 'GET',
                  autoLoad: false,
                  url: `${baseUrl}/reviewOrganizedWay/findSonReviewOrganizedWays`,
                }}
                placeholder={'审核组织方式'}
                {...AuditOrganizationConfig}
              />)
            }
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Modal>;
});

export default Form.create()(AddModal);
