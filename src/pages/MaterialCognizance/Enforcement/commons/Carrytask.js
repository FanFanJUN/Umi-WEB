
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, message } from 'antd';
import { utils, ExtTable, AuthButton, DetailCard } from 'suid';
import classnames from 'classnames';
import { router } from 'dva';
import TaskInfo from '../commons/TaskInfo'
import Brasstacks from '../commons/Brasstacks'
import Taskhistory from '../commons/Taskhistory'
import { ImplementDetailsVo } from '../../../../services/MaterialService'
import styles from '../index.less';
const { create } = Form;
const formLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21
  },
};
const { storage } = utils
const getpcnModifyRef = forwardRef(({
  form,
  editData
}, ref) => {
  useImperativeHandle(ref, () => ({
    form,
    carryform
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
  const BaseinfoRef = useRef(null);
  const ModifyinfoRef = useRef(null);
  const TaskhistoryRef = useRef(null);
  useEffect(() => {

  }, []);
  function carryform() {
    let brasstacks, modifyinfluen = false;
    const { modifyinfo } = ModifyinfoRef.current;
    brasstacks = modifyinfo();
    brasstacks ? modifyinfluen = brasstacks : modifyinfluen = false
    return modifyinfluen;

  }
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.bgw}>
          <div className={styles.pcntitle}>信息任务</div>
          <div >
            <TaskInfo
              editformData={editData}
              wrappedComponentRef={BaseinfoRef}
              isView={true}
            />
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.pcntitle}>任务实际执行</div>
          <div >
            <Brasstacks
              editformData={editData}
              wrappedComponentRef={ModifyinfoRef}
            />
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.pcntitle}>任务执行历史</div>
          <div >
            <Taskhistory
              editformData={editData}
              wrappedComponentRef={TaskhistoryRef}
              isEdit={true}
              isView={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
const CommonForm = create()(getpcnModifyRef)

export default CommonForm