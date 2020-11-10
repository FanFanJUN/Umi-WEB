/*
 * @Author: your name
 * @Date: 2020-11-05 16:27:34
 * @LastEditTime: 2020-11-10 10:16:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\MonthAuditPlan\component\changeDetail.js
 */
import React, { useState, useEffect } from "react";
import { Spin, Tabs, Form } from "antd";
import { router } from 'dva';
import ChangeInfo from "./ChangeInfo";
import ChangeLineInfo from "./ChangeLineInfo";
import BaseInfo from "../EdaPage/BaseInfo";
import LineInfo from "../EdaPage/LineInfo";
import { findOneOverride, findReasonByChangId } from "../service";
import styles from "../index.less";
const { TabPane } = Tabs;

export default Form.create()((props) => {
    const { form } = props;
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({});
    const [changeInfo, setChangeInfo] = useState({});
    const { query } = router.useLocation();
    useEffect(()=>{
        getOrderDetail();
    }, []);

    // 获取单据数据
    async function getOrderDetail() {
        setLoading(true);
        let res = await findOneOverride({
            id: query.orderId
        });
        let changeRes = await findReasonByChangId({
            id: query.id
        })
        setLoading(false);
        if (res) {
            setEditData(res.data)
        } else {
            message.error(res.message);
        }
        if (changeRes) {
            setChangeInfo(changeRes.data)
        } else {
            message.error(res.message);
        }
    }
    function callback(key) {
        console.log(key);
    }

    return <Spin spinning={loading}>
        <Tabs defaultActiveKey="1" onChange={callback} className={styles.antd_tabs_me}>
            <TabPane tab="变更信息" key="1">
                <ChangeInfo
                    originData={changeInfo}
                    isView={true}
                />
                <ChangeLineInfo id={query.id} />
            </TabPane>
            <TabPane tab="单据" key="2">
                <BaseInfo
                    form={form}
                    type={"detail"}
                    isView={true}
                    originData={editData}
                />
                <LineInfo
                    type={"detail"}
                    isView={true}
                    originData={editData.lineBoList}
                />
            </TabPane>
        </Tabs>

    </Spin>
})