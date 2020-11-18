/**
 * @Description: 协同人员表单
 * @Author: M!keW
 * @Date: 2020-11-17
 */

import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form } from 'antd';
import { ExtTable } from 'suid';

const CollaboratorForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const columns = [
    { title: '部门', dataIndex: 'departmentName', width: 160 },
    { title: '员工编号', dataIndex: 'employeeNo', width: 100 },
    { title: '姓名', dataIndex: 'memberName', width: 120 },
    { title: '联系电话', dataIndex: 'memberTel', width: 100 },
  ];
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>协同人员</div>
        <div className={styles.content}>
          <ExtTable
            rowKey={(v) => v.id}
            allowCancelSelect={true}
            showSearch={false}
            checkbox={false}
            size='small'
            height={'300px'}
            columns={columns}
            dataSource={editData}
          />
        </div>
      </div>
    </div>
  );
});
export default Form.create()(CollaboratorForm);
