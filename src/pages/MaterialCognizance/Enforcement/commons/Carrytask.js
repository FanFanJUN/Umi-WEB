
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, } from 'antd';
import { utils } from 'suid';
import TaskInfo from '../commons/TaskInfo'
import Brasstacks from '../commons/Brasstacks'
import Taskhistory from '../commons/Taskhistory'
import CognizanceStage from '../commons/CognizanceStage'
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
  const BaseinfoRef = useRef(null);
  const ModifyinfoRef = useRef(null);
  const TaskhistoryRef = useRef(null);
  const CognizanceRef = useRef(null)
  useEffect(() => {

  }, []);
  function carryform() {
    let brasstacks, cognizancelist, modifyinfluen = false;
    const { modifyinfo } = ModifyinfoRef.current;
    const { cognizanceInfo } = CognizanceRef.current;
    brasstacks = modifyinfo();
    cognizancelist = cognizanceInfo()
    brasstacks ? brasstacks.codeLists = cognizancelist : ''
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
          <div className={styles.pcntitle}>认定阶段</div>
          <div >
            <CognizanceStage
              editformData={editData}
              wrappedComponentRef={CognizanceRef}
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