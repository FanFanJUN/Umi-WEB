/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:34:49
 * @LastEditTime: 2020-09-14 17:04:29
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/index.js
 * @Description: 销售情况 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import SalesProfit from './SalesProfit';
import Customer from './Customer';
import MarketCompetitive from './MarketCompetitive';
import { findSalesSituationById, saveSupplierSalesSituation } from '../../../../../services/dataFillInApi';

const SellCondition = ({ baseParam: { id, type }, form }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    const getFormRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const res = await findSalesSituationById({ supplierRecommendDemandId: id });
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
        console.log(getFormRef);
        const formRef = getFormRef.current.customerForm;
        formRef.validateFieldsAndScroll((error, value) => {
            console.log(value);
            if (error) return;
            const saveParams = {
                ...value,
                supplierCertificates: data.supplierCertificates,
                supplierContacts: data.supplierContacts,
                managementSystems: data.managementSystems,
            };
            saveSupplierSalesSituation({}).then((res) => {
                if (res && res.success) {
                    message.success('保存销售情况成功');
                } else {
                    message.error(res.message);
                }
            });
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
                    title="销售情况"
                    extra={type === 'add' ? [
                        <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={handleSave}>
                            保存
                        </Button>,
                    ] : null}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>销售收入及利润</div>
                            <div className={styles.content}>
                                <SalesProfit />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>客户</div>
                            <div className={styles.content}>
                                <Customer type={type} data={data} form={form} wrappedComponentRef={getFormRef} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>市场地位及竞争状况</div>
                            <div className={styles.content}>
                                <MarketCompetitive type={type} data={data} form={form} />
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(SellCondition);