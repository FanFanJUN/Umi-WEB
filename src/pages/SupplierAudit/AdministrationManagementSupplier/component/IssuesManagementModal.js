import React, { useEffect, useRef, useState } from 'react';
import { ExtModal } from 'suid';
import IssuesManagement from '../../AdministrationManagementDemand/component/component/IssuesManagement'
import { SaveIssuesManagementSupplierApi } from '../../AdministrationManagementDemand/commonApi';
import { message, Modal } from 'antd';
import { getRandom } from '../../../QualitySynergy/commonProps';

const IssuesManagementModal = (props) => {

  const [data, setData] = useState([])

  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const clearSelected = () => {
  };

  const onChange = (value) => {
    setData(value)
  }

  const handleOk = () => {
    let num = 0
    let arr = []
    data.map(item => {
      if (item.attachRelatedIds && item.attachRelatedIds.length !== 0) {
        arr.push(item)
        num++
      }
    })
    if (num !== 0) {
      Modal.confirm({
        title: `共回答 ${num} 条问题,是否确认保存？`,
        okText: '是',
        cancelText: '否',
        onOk: () => {
          SaveIssuesManagementSupplierApi(arr).then(res => {
            if (res.success) {
              message.success('提交成功!')
              onCancel()
            } else {
              message.error(res.message);
            }
          }).catch(err => {
            message.error(err.message);
          });
        }
      })
    } else {
      message.info(`共回答 ${num} 条问题`)
      onCancel()
    }
  }

  return (
    <ExtModal
      width={'180vh'}
      maskClosable={false}
      visible={visible}
      title={'问题管理'}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <IssuesManagement
        onChange={onChange}
        reviewImplementPlanCode={props.reviewImplementPlanCode}
      />
    </ExtModal>
  );

};

export default IssuesManagementModal;
