/*
 * @Author: your name
 * @Date: 2020-11-05 16:27:34
 * @LastEditTime: 2020-11-26 17:38:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\MonthAuditPlan\component\changeDetail.js
 */
import React, { useState, useEffect } from "react";
import { Spin, Tabs, Form, message } from "antd";
import { router } from 'dva';
import ChangeLineInfo from "./ChangeLineInfo";
import ChangeInfo from "../editPage/ChangeInfo";
import BaseInfo from "../editPage/BaseInfo";
import AuditInfo from "../editPage/AuditInfo";
import AuditScope from "../editPage/AuditScope";
import AuditorInfo from "../editPage/AuditorInfo";
import PersonTable from "../editPage/PersonTable";
import AuditPlan from "../editPage/AuditPlan";
import { findReasonByChangId, findDetailsByReviewImplementPlanId } from "../service";
import styles from "../../MonthAuditPlan/index.less";
const { TabPane } = Tabs;

export default Form.create()((props) => {
    const { form } = props;
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({});
    const [changeInfo, setChangeInfo] = useState({});
    const { query } = router.useLocation();
    useEffect(() => {
        getChangeInfo();
    }, []);

    async function getChangeInfo() {
        setLoading(true);
        // 获取变更信息
        let changeRes = await findReasonByChangId({
            id: query.id
        })
        if (changeRes.success) {
            setChangeInfo(changeRes.data);
            // 获取原单据信息
            let res = await getDetail(changeRes.data.reviewImplementPlanId)
            if (res.success) {
                setEditData(res.data)
            } else {
                message.error(res.message);
            }
        } else {
            message.error(changeRes.message);
        }
        setLoading(false);
    }

    // 获取单据数据
    async function getDetail(id) {
        let res = await findDetailsByReviewImplementPlanId({id});
        return res;
    }

    // 编辑和明细时构造treeData
    const buildTreeData = (fatherList, sonList) => {
        if (!fatherList || !sonList) return [];
        let arr = JSON.parse(JSON.stringify(fatherList));
        arr.map(item => {
            item.id = item.systemId;
            item.key = item.systemId;
            item.title = item.systemName;
            if (!item.children) {
                item.children = [];
            }
            sonList.forEach(value => {
                value.id = value.systemId;
                value.key = value.systemId;
                value.title = value.systemName;
                if (value.parentId === item.systemId) {
                    item.children.push(value);
                }
            });
        });
        return arr;
    };
    
    return <Spin spinning={loading}>
        <Tabs defaultActiveKey="1" className={styles.antd_tabs_me}>
            <TabPane tab="变更信息" key="1">
                <ChangeInfo
                    originData={changeInfo}
                    isView={true}
                    form={form}
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
                {/* 拟审核信息 */}
                <AuditInfo
                    type={"detail"}
                    isView={true}
                    originData={editData}
                />
                {/* 审核范围 */}
                <AuditScope treeData={editData.treeData} />
                {/* 审核人员 */}
                <AuditorInfo
                    type={"detail"}
                    treeData={editData.treeData}
                    reviewTeamGroupBoList={editData.reviewTeamGroupBoList ? editData.reviewTeamGroupBoList : []}
                    orgLeaderName={editData.leaderName}
                    deleteArr={[]}
                />
                {/* 协同人员 */}
                <PersonTable originData={editData.coordinationMemberBoList} />
                {/* 审核计划 */}
                <AuditPlan
                    type={"detail"}
                    isView={true}
                    form={form}
                    originData={editData}
                />
            </TabPane>
        </Tabs>

    </Spin>
})