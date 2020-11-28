/**
 * @Description: 本期总结
 * @Author: M!keW
 * @Date: 2020-11-27
 */

import React, { useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form, Input } from 'antd';
import AuditTable from './AuditTable';
import { ExtTable } from 'suid';
import TypeChart from './TypeChart';
import SupplierChart from './SupplierChart';

const FormItem = Form.Item;

const ThisPeriodForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const columns = [
    {
      title: '供应商信息', children: [
        { title: '名称', dataIndex: 'systemName', width: 200 },
        { title: '物资分类', dataIndex: 'ruleName', ellipsis: true, width: 200 },
      ],
    },
    { title: '需求/使用单位', dataIndex: 'definition', ellipsis: true, width: 180 },
    { title: '审核类型', dataIndex: 'scoringStandard', ellipsis: true, width: 120 },
    { title: '审核组织方式', dataIndex: 'highestScore', width: 140 },
    { title: '参考审核内容', dataIndex: 'notApplyScore', width: 200 },
    {
      title: '审核组成员', children: [
        { title: '组长', dataIndex: 'percentage', width: 140 },
        { title: '组员', dataIndex: 'performanceRating', width: 140 },
      ],
    },
    { title: '备注', dataIndex: 'remark', width: 140 },
  ].map(item => ({ ...item, align: 'center' }));

  const getFormValue=()=>{
    form.validateFieldsAndScroll((err, values) => {
     console.log(values)
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>本期总结</div>
        <div className={styles.content}>
          <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
            1、本期组织<span
            className={styles.showNumber}>{23}</span>个审核小组合计<span
            className={styles.showNumber}>{89}</span>人次开展供应商现场审核<span
            className={styles.showNumber}>{20}</span>家，延期执行<span
            className={styles.showNumber}>{3}</span>家，执行<span
            className={styles.showNumber}>{17}</span> 家，执行审核执行率<span
            className={styles.showNumber}>{'85%'}</span>；审核报告结案<span
            className={styles.showNumber}>{15}</span>家，报告结案率<span
            className={styles.showNumber}>{'75%'}</span> 。
          </div>
          <div>
            <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
              2、各审核组按照审核需求分别开展了供应商监督、准入和追加审核，并根据不同审核类型要求分别从质量、技术、商务、产品环保、CSR、网络信息安全、交付能力等单项或多项要素对供应商实施了审核。总结如下：
            </div>
            <div style={{
              paddingBottom: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}>2-1本期审核执行分类汇总表（审核类型、审核组织方式、结论等级、审核要素）
            </div>
            <TypeChart/>
            <div style={{ paddingBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>2-2本期审核供应商区域分布</div>
            <SupplierChart/>
            <div style={{ paddingBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>2-3本期供应商审核执行明细统计汇总表</div>
            <ExtTable
              bordered={true}
              rowKey={(v) => v.id}
              showSearch={false}
              height={'300px'}
              lineNumber={false}
              columns={columns}
              dataSource={[]}
            />
          </div>
          <AuditTable
            editData={[{ departmentName: '11', 'memberName': '11', employeeNo: '11', memberTel: '11', check: '11' }]}/>
          <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
            4、激励建议
            <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
              <FormItem>
                {isView ? <span
                  style={{
                    width: '100%',
                    border: 'none',
                  }}>{editData.remark}</span> : form.getFieldDecorator('remark', {
                  initialValue: type === 'add' ? '' : editData.remark,
                })(
                  <span>1）本期供应商审核协同组织并开展实施较好的单位有<span> <Input style={{ width: '400px' }}
                                                              className={styles.underLineInput}/></span>等，提出表扬。</span>,
                )}
              </FormItem>
            </div>
            <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
              <FormItem>
                {isView ? <span
                  style={{
                    width: '100%',
                    border: 'none',
                  }}>{editData.remark}</span> : form.getFieldDecorator('remark2', {
                  initialValue: type === 'add' ? '' : editData.remark2,
                })(
                  <span>2）对未能按期结案供应商审核报告的<span> <Input style={{ width: '400px' }}
                                                       className={styles.underLineInput}/></span>等审核小组，提出通报并要求限期结案，如在下期仍未结案，建议对应单位对其主要责任人实施负激励。</span>,
                )}
              </FormItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default Form.create()(ThisPeriodForm);
