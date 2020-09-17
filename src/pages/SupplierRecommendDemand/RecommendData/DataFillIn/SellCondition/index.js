/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:34:49
 * @LastEditTime: 2020-09-17 14:18:33
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
import { router } from 'dva';
import { filterEmptyFileds } from '../CommonUtil/utils';

const SellCondition = ({ form }) => {
    const [data, setData] = useState({});
    const [supplierSalesProceeds, setsupplierSalesProceeds] = useState([]); // 销售收入及利润
    const [changhongSaleInfos, setchanghongSaleInfos] = useState([]);
    const [mainCustomers, setmainCustomers] = useState([]);
    const [supplierOrderInfos, setsupplierOrderInfos] = useState([]);
    const [threeYearPlans, setthreeYearPlans] = useState([]);

    const [loading, setLoading] = useState(false);

    const { query: { id, type = 'add' } } = router.useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const res = await findSalesSituationById({ supplierRecommendDemandId: id || '676800B6-F19D-11EA-9F88-0242C0A8442E' });
            if (res.success) {
                res.data && setData(res.data);
                setsupplierSalesProceeds(data.supplierSalesProceeds || []);
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
                changhongSaleInfos: changhongSaleInfos || [],
                mainCustomers: mainCustomers || [],
                supplierOrderInfos: supplierOrderInfos || [],
                threeYearPlans: threeYearPlans || []
            };
            saveSupplierSalesSituation(filterEmptyFileds(saveParams)).then((res) => {
                if (res && res.success) {
                    message.success('保存销售情况成功');
                } else {
                    message.error(res.message);
                }
            });
        });
    }

    function setTableData(newData, type) {
        switch (type) {
            case 'changhongSaleInfos':
                setchanghongSaleInfos(newData);
                break;
            case 'mainCustomers':
                setmainCustomers(newData);
                break;
            case 'supplierOrderInfos':
                setsupplierOrderInfos(newData);
                break;
            case 'threeYearPlans':
                setthreeYearPlans(newData);
                break;
            default:
                break;
        }
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
                                <SalesProfit type={type} data={supplierSalesProceeds} setTableData={setTableData} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>客户</div>
                            <div className={styles.content}>
                                <Customer type={type} data={data} form={form} setTableData={setTableData} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>市场地位及竞争状况</div>
                            <div className={styles.content}>
                                <MarketCompetitive type={type} data={data} form={form} setTableData={setTableData} />
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(SellCondition);