/**
 * @Description: 评审问题及整改情况
 * @Author: M!keW
 * @Date: 2020-11-18
 */
import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form } from 'antd';
import { ExtTable } from 'suid';
import Upload from '../../../../components/Upload';
import { AuthenticationTypeArr, certifyTypeArr, whetherArr } from '../../AdministrationManagementDemand/commonApi';

const AuditQuestions = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const columns = [
    { title: '指标', dataIndex: 'ruleName', width: 180, required: true },
    { title: '部门/过程', dataIndex: 'department', ellipsis: true, width: 100 },
    { title: '问题描述', dataIndex: 'problemDescribe', ellipsis: true, width: 400 },
    { title: '严重程度', dataIndex: 'severityEnumRemark', ellipsis: true, width: 120 },
    { title: '需求整改完成日期', dataIndex: 'demandCompletionTime', width: 140 },
    { title: '提出人', dataIndex: 'proposerName', width: 100 },
    { title: '原因分析', dataIndex: 'reason', width: 140 },
    {
      title: '纠正预防措施及见证附件', dataIndex: 'preventiveMeasures', width: 300, render: (v, data) => <>
        {v} {data.measures}
        <Upload type='show' entityId={data.fileList} />
      </>,
    },
    { title: '完成时间', dataIndex: 'completionTime', width: 100 },
    { title: '验证类型', dataIndex: 'checkType', width: 100, render: v => AuthenticationTypeArr[v] },
    { title: '验证结果', dataIndex: 'checkResult', width: 100, render: v => certifyTypeArr[v] },
  ].map(item => ({ ...item, align: 'center' }));
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>评审问题及整改情况</div>
        <div className={styles.content}>
          <ExtTable
            bordered={true}
            rowKey={(v) => v.id}
            showSearch={false}
            height={'500px'}
            columns={columns}
            dataSource={editData}
          />
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditQuestions);
