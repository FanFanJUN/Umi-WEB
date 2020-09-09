/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 15:52:52
 * @LastEditTime: 2020-09-09 14:55:43
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/index.js
 * @Description: 基本情况 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef } from 'react';
import { Form, Button, Spin, PageHeader } from 'antd';
import styles from '../../DataFillIn/index.less';
import classnames from 'classnames';
import BaseInfo from './BaseInfo';
import AuthPrincipal from './AuthPrincipal';
import GenQualification from './GenQualification';
import MproCertification from './MproCertification';

const BaseCondition = (props) => {

    const [data, setData] = useState({
        loading: false,
        type: 'add',
        title: '基本情况',
        userInfo: {}
    });
    const baseInfoRef = useRef(null);

    return (
        <div>
            <Spin spinning={data.loading}>
                <PageHeader
                    ghost={false}
                    style={{
                        padding: '0px'
                    }}
                    title="基本概况"
                    extra={[
                        <Button key="save" type="primary" style={{marginRight: '12px'}}>
                            保存
                        </Button>,
                    ]}
                >
                    <BaseInfo
                        wrappedComponentRef={baseInfoRef}
                        userInfo={data.userInfo}
                        type={data.type}
                    />
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>授权委托人</div>
                            <div className={styles.content}>
                                <AuthPrincipal />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>通用资质</div>
                            <div className={styles.content}>
                                <GenQualification />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>管理体系及产品认证</div>
                            <div className={styles.content}>
                                <MproCertification />
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(BaseCondition);