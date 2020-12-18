/**
 * @Description: 本期总结
 * @Author: M!keW
 * @Date: 2020-11-27
 */

import React, { useImperativeHandle, useRef } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form, Input } from 'antd';
import AuditTable from './AuditTable';
import { ExtTable } from 'suid';
import TypeChart from './TypeChart';
import SupplierChart from './SupplierChart';

const FormItem = Form.Item;

const ThisPeriodForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({
    getFormValue,
  }));
  const getTableRef = useRef([]);
  const columns = [
    {
      title: '序号', dataIndex: 'lineNumber', ellipsis: true, width: 80,
      render(text, record, index) {
        return index + 1;
      },
    },
    {
      title: '供应商信息', children: [
        { title: '名称', dataIndex: 'supplierName', width: 200 },
        { title: '物资分类', dataIndex: 'materialGroupName', ellipsis: true, width: 200 },
      ],
    },
    { title: '需求/使用单位', dataIndex: 'applyCorporationName', ellipsis: true, width: 180 },
    { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 120 },
    { title: '审核组织方式', dataIndex: 'reviewOrganizedWayName', width: 140 },
    { title: '参考审核内容', dataIndex: 'systemNames', width: 200 },
    { title: '审核报告编号', dataIndex: 'auditReportManagCode', width: 140 },
    {
      title: '审核执行', children: [
        { title: '综合得分', dataIndex: 'reviewScore', width: 120 },
        { title: '审核评级', dataIndex: 'performanceRating', width: 120 },
        { title: '报告结案', dataIndex: 'theCaseReport', width: 120 },
        { title: '应用建议', dataIndex: 'conclusion', width: 120 },
      ],
    },
    {
      title: '审核组成员', children: [
        { title: '组长', dataIndex: 'leaderName', width: 140 },
        { title: '组员', dataIndex: 'memberNames', width: 140 },
      ],
    },
    { title: '备注', dataIndex: 'remark', width: 140 },
  ].map(item => ({ ...item, align: 'center' }));

  const getFormValue = async () => {
    let transData = {};
    transData.abSupplierAuditDeficiencyImprovementVos = await getTableRef.current.getTableData();
    form.validateFieldsAndScroll((err, values) => {
      transData = { ...transData, ...values };
    });
    return transData;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>本期总结</div>
        <div className={styles.content}>
          <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
            1、本期组织<span
            className={styles.showNumber}>{editData.auditTeamNum}</span>个审核小组合计<span
            className={styles.showNumber}>{editData.orgAuditPersonNum}</span>人次开展供应商现场审核<span
            className={styles.showNumber}>{editData.supplierOrgAuditNum}</span>家，延期执行<span
            className={styles.showNumber}>{editData.supplierOrgAuditPostponeNum}</span>家，执行<span
            className={styles.showNumber}>{editData.supplierOrgAuditExecutNum}</span> 家，执行审核执行率<span
            className={styles.showNumber}>{editData.supplierOrgAuditImplementRate + '%'}</span>；审核报告结案<span
            className={styles.showNumber}>{editData.supplierOrgAuditCloseNum}</span>家，报告结案率<span
            className={styles.showNumber}>{editData.supplierOrgAuditReportCloseRate + '%'}</span> 。
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
            <TypeChart
              editData={editData}/>
            <div style={{ paddingBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>2-2本期审核供应商区域分布</div>
            <SupplierChart
              editData={editData}/>
            <div style={{ paddingBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>2-3本期供应商审核执行明细统计汇总表</div>
            <ExtTable
              bordered={true}
              rowKey={(v) => v.supplierId}
              showSearch={false}
              height={'300px'}
              lineNumber={false}
              columns={columns}
              dataSource={editData.abSupplierAuditExecutDetailVos || []}
            />
          </div>
          <AuditTable
            isView={isView}
            wrappedComponentRef={getTableRef}
            editData={editData.abSupplierAuditDeficiencyImprovementVos || []}/>
          <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
            4、激励建议
            <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
              <FormItem>
                {isView ? <span>1）本期供应商审核协同组织并开展实施较好的单位有<span
                  className={styles.showNumber}>{editData.wellImplementedUnits}</span>等，提出表扬。</span> : form.getFieldDecorator('wellImplementedUnits', {
                  initialValue: type === 'add' ? '' : editData.wellImplementedUnits,
                })(
                  <span>1）本期供应商审核协同组织并开展实施较好的单位有<span> <Input style={{ width: '400px' }}
                                                              className={styles.underLineInput}/></span>等，提出表扬。</span>,
                )}
              </FormItem>
            </div>
            <div style={{ paddingBottom: '10px', fontSize: '14px' }}>
              <FormItem>
                {isView ? <span>2）对未能按期结案供应商审核报告的<span
                  className={styles.showNumber}>{editData.extensionUnits}</span>等审核小组，提出通报并要求限期结案，如在下期仍未结案，建议对应单位对其主要责任人实施负激励。</span> : form.getFieldDecorator('extensionUnits', {
                  initialValue: type === 'add' ? '' : editData.extensionUnits,
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
