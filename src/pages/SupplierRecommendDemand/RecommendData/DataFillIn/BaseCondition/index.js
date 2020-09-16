/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 15:52:52
 * @LastEditTime: 2020-09-16 17:58:55
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/index.js
 * @Description: 基本情况 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import BaseInfo from './BaseInfo';
import AuthPrincipal from './AuthPrincipal';
import GenQualification from './GenQualification';
import MproCertification from './MproCertification';
import { router } from 'dva';
import { findrBaseInfoById, saveBaseInfo } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';

const BaseCondition = ({ form }) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    const { query: { id, type = 'add' } } = router.useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const res = await findrBaseInfoById({ supplierRecommendDemandId: '676800B6-F19D-11EA-9F88-0242C0A8442E' });
            if (res.success) {
                res.data && setData(res.data);
            } else {
                message.error(res.message);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    function handleSave() {
        form.validateFieldsAndScroll((error, value) => {
            console.log(value);
            if (error) return;
            const saveParams = {
                ...value,
                supplierCertificates: data.supplierCertificates,
                supplierContacts: data.supplierContacts,
                managementSystems: data.managementSystems,
                recommendDemandId: id || '676800B6-F19D-11EA-9F88-0242C0A8442E',
                actualCapacityFactor: (value.designCapability / value.actualCapacity).toFixed(2), // 现有产能利用率 设计产能/实际产能
            };
            saveBaseInfo(filterEmptyFileds(saveParams)).then((res) => {
                if (res && res.success) {
                    message.success('保存基本情况成功')
                } else {
                    message.error(res.message);
                }
            })
        })
    }
    return (
        <div>
            <Spin spinning={loading}>
                <PageHeader
                    ghost={false}
                    style={{
                        padding: '0px'
                    }}
                    title="基本概况"
                    extra={type === 'add' ? [
                        <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={() => handleSave()}>
                            保存
                        </Button>,
                    ] : null}
                >
                    <BaseInfo
                        // wrappedComponentRef={getFormRef}
                        form={form}
                        baseInfo={data}
                        type={type}
                    />
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>授权委托人</div>
                            <div className={styles.content}>
                                <AuthPrincipal tableData={data.supplierContacts} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>通用资质</div>
                            <div className={styles.content}>
                                <GenQualification tableData={data.supplierCertificates} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>管理体系及产品认证</div>
                            <div className={styles.content}>
                                <MproCertification data={data} type={type} />
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(BaseCondition);