/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 15:52:52
 * @LastEditTime: 2020-09-14 18:09:58
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

const BaseCondition = ({ baseParam: { id, type } }) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    const getFormRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const res = await findrBaseInfoById({ supplierRecommendDemandId: id });
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
        const formRef = getFormRef.current.form;
        formRef.validateFieldsAndScroll((error, value) => {
            console.log(value);
            if (error) return;
            const saveParams = {
                ...value,
                supplierCertificates: data.supplierCertificates,
                supplierContacts: data.supplierContacts,
                managementSystems: data.managementSystems,
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
                        wrappedComponentRef={getFormRef}
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