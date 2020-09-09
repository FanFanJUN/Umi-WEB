/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:34:49
 * @LastEditTime: 2020-09-09 16:30:33
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/sellCondition/index.js
 * @Description: 销售情况 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef } from 'react';
import { Form, Button, Spin, PageHeader } from 'antd';
import styles from '../../DataFillIn/index.less';
import SalesProfit from './SalesProfit';
import Customer from './Customer';
import MarketCompetitive from './MarketCompetitive';

const SellCondition = (props) => {
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
                    title="销售情况"
                    extra={[
                        <Button key="save" type="primary" style={{marginRight: '12px'}}>
                            保存
                        </Button>,
                    ]}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>销售收入及利润</div>
                            <div className={styles.content}>
                             <SalesProfit/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>客户</div>
                            <div className={styles.content}>
                            <Customer/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>市场地位及竞争状况</div>
                            <div className={styles.content}>
                            <MarketCompetitive/>
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(SellCondition);