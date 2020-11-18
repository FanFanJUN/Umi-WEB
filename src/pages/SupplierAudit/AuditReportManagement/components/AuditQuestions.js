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

const AuditQuestions = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const columns = [
    { title: '指标', dataIndex: 'title', width: 120, required: true },
    { title: '部门/过程', dataIndex: 'newAmount', ellipsis: true, width: 100 },
    { title: '问题描述', dataIndex: 'cumulative', ellipsis: true, width: 400 },
    { title: '严重程度', dataIndex: 'cure', ellipsis: true, width: 120 },
    { title: '需求整改完成日期', dataIndex: 'died', width: 140 },
    { title: '提出人', dataIndex: 'orgName', width: 100 },
    { title: '原因分析', dataIndex: 'orgName', width: 140 },
    {
      title: '纠正预防措施及见证附件', dataIndex: 'orgName', width: 180, render(text, record, index) {
        return <Upload entityId={text} type={'show'}/>;
      },
    },
    { title: '完成时间', dataIndex: 'orgName', width: 100 },
    { title: '验证类型', dataIndex: 'orgName', width: 100 },
    { title: '验证结果', dataIndex: 'orgName', width: 100 },
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
