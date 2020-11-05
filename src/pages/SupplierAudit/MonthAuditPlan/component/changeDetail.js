import React, { useState, useEffect } from "react";
import { Spin, Tabs, Form } from "antd";
import { router } from 'dva';
import ChangeInfo from "./ChangeInfo";
import ChangeLineInfo from "./ChangeLineInfo";
import BaseInfo from "../EdaPage/BaseInfo";
import LineInfo from "../EdaPage/LineInfo";
import { findOneOverride } from "../service";
const { TabPane } = Tabs;

export default Form.create()((props) => {
    const { form } = props;
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState(false);
    const { query } = router.useLocation();
    useEffect(()=>{
        getOrderDetail();
    }, []);

    async function getOrderDetail() {
        setLoading(true);
        let res = await findOneOverride({
            id: query.orderId
        });
        setLoading(false);
        if (res) {
            setEditData(res.data)
        } else {
            message.error(res.message);
        }
    }

    function callback(key) {
        console.log(key);
    }

    return <Spin spinning={loading}>
        <Tabs defaultActiveKey="2" onChange={callback}>
            <TabPane tab="变更信息" key="1">
                <ChangeInfo
                    originData={{}}
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