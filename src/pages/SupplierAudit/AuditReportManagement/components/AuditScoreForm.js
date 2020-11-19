/**
 * @Description: 评审得分
 * @Author: M!keW
 * @Date: 2020-11-17
 */

import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form } from 'antd';
import { ExtTable } from 'suid';

const AuditScoreForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const columns = [
    { title: '类别', dataIndex: 'title', width: 200, required: true},
    { title: '指标名称', dataIndex: 'newAmount', ellipsis: true, width: 100 },
    { title: '指标定义', dataIndex: 'cumulative', ellipsis: true, width: 400 },
    { title: '评分标准', dataIndex: 'cure', ellipsis: true, width: 400 },
    { title: '标准分', dataIndex: 'died', width: 100,},
    { title: '自评得分', dataIndex: 'orgName', width: 100,},
    { title: '不适用', dataIndex: 'orgName', width: 100,},
    { title: '审核得分', dataIndex: 'orgName', width: 100,render:(text)=><a onClick={()=>console.log('这是超链接')}>{text}</a> },
    { title: '百分比', dataIndex: 'orgName', width: 100,},
    { title: '评定等级', dataIndex: 'orgName', width: 100,},
    { title: '风险等级', dataIndex: 'orgName', width: 100,},
  ].map(item => ({ ...item, align: 'center' }));
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>评审得分</div>
        <div className={styles.content}>
          <ExtTable
            bordered={true}
            rowKey={(v) => v.id}
            showSearch={false}
            height={'500px'}
            defaultExpandAllRows={true}
            lineNumber={false}
            columns={columns}
            dataSource={editData}
          />
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditScoreForm);
