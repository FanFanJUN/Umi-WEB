/**
 * @Description: 下期安排
 * @Author: M!keW
 * @Date: 2020-11-27
 */

import React, { useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form } from 'antd';
import { ExtTable } from 'suid';

const NextPeriodForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));

  const columns = [
    {
      title: '序号', dataIndex: 'lineNumber', ellipsis: true, width: 80,
      render(text, record, index) {
        return index + 1;
      },
    },
    {
      title: '供应商信息', children: [
        { title: '名称', dataIndex: 'supplierName', width: 200 ,ellipsis: true,},
        { title: '物资分类', dataIndex: 'materialGroupName', ellipsis: true, width: 200 },
      ],
    },
    { title: '需求/使用单位', dataIndex: 'applyCorporationName', ellipsis: true, width: 180 },
    { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 120 },
    { title: '审核组织方式', dataIndex: 'reviewOrganizedWayName', width: 140 },
    { title: '参考审核内容', dataIndex: 'systemNames', width: 200 },
    {
      title: '审核组成员', children: [
        { title: '组长', dataIndex: 'leaderName', width: 140 },
        { title: '组员', dataIndex: 'memberNames', width: 140 },
      ],
    },
  ].map(item => ({ ...item, align: 'center' }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>下期安排</div>
        <div className={styles.content}>
          <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
            经与相关各单位沟通后，确定下期安排<span
            className={styles.showNumber}>{editData.auditTeam}</span>个审核小组对<span
            className={styles.showNumber}>{editData.supplierNum}</span>家供应商实施二方审核，详见下表。
          </div>
          <ExtTable
            bordered={true}
            rowKey={(v) => v.supplierId}
            showSearch={false}
            height={'500px'}
            lineNumber={false}
            columns={columns}
            dataSource={editData.abCompanyNextMonthlyAuditPlanVos || []}
          />
        </div>
      </div>
    </div>
  );
});
export default Form.create()(NextPeriodForm);
