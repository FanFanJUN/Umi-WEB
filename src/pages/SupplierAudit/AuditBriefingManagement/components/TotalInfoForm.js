/**
 * @Description: 审核总览概述
 * @Author: M!keW
 * @Date: 2020-11-27
 */

import React, { useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form, Input } from 'antd';

const TotalInfoForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>审核概览总述</div>
        <div className={styles.content}>
          <div style={{ paddingBottom: '10px', fontSize: '14px' }}>1、本年度供应商监督审核需求计划<span
            className={styles.showNumber}>{210}</span>家；
            本期新增供应商准入审核<span
              className={styles.showNumber}>{10}</span>家和追加审核<span
              className={styles.showNumber}>{5}</span>家，
            累计新增供应商准入审核<span className={styles.showNumber}>{56}</span>家，
            追加审核<span className={styles.showNumber}>{34}</span>家。
          </div>
          <div style={{ paddingBottom: '10px', fontSize: '14px' }}>2、本年（截至本期）累计安排供应商审核<span
            className={styles.showNumber}>{253}</span>家。
            其中年度监督审核<span
              className={styles.showNumber}>{150}</span>家，准入审核<span
              className={styles.showNumber}>{50}</span>家和追加审核<span
              className={styles.showNumber}>{53}</span>家。
          </div>
          <div style={{ paddingBottom: '10px', fontSize: '14px' }}>3、本年（截至本期）累计执行供应商审核<span
            className={styles.showNumber}>{210}</span>家，
            供应商审核结案<span className={styles.showNumber}>{195}</span>家。
          </div>
        </div>
      </div>
    </div>
  );
});
export default Form.create()(TotalInfoForm);

