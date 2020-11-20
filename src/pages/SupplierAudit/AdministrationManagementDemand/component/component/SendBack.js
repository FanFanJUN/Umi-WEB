import React, { useState } from 'react';
import { ExtModal } from 'suid';
import { Row, Input, message } from 'antd';
import { SendBackApi } from '../../../AuditRequirementsManagement/commonApi';

const SendBack = (props) => {

  const { visible } = props;

  const [data, setData] = useState('');

  const handleOk = () => {
    const params = Object.assign(props.params, {suggestion: data})
    SendBackApi(params).then(res => {
      if (res.success) {
        message.success(res.message)
        onCancel()
      }
    })
  };

  const onCancel = () => {
    props.onCancel();
  };

  const clearSelected = () => {
    setData('')
  };

  return (
    <ExtModal
      width={'90vh'}
      maskClosable={false}
      visible={visible}
      title={'退回'}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Row>
        <Input.TextArea row={6} value={data} onChange={e => setData(e.target.value)} />
      </Row>
    </ExtModal>
  );

};

export default SendBack;
