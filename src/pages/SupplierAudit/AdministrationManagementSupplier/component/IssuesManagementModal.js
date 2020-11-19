import React, { useEffect, useRef, useState } from 'react';
import { ExtModal } from 'suid';
import IssuesManagement from '../../AdministrationManagementDemand/component/component/IssuesManagement'

const IssuesManagementModal = (props) => {

  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const clearSelected = () => {
  };

  return (
    <ExtModal
      width={'180vh'}
      maskClosable={false}
      visible={visible}
      title={'问题管理'}
      onCancel={onCancel}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <IssuesManagement
        reviewImplementPlanCode={props.reviewImplementPlanCode}
      />
    </ExtModal>
  );

};

export default IssuesManagementModal;
