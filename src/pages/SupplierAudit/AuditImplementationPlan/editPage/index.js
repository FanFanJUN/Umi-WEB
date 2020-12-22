/*
 * @Author:黄永翠
 * @Date: 2020-11-09 09:38:38
 * @LastEditTime : 2020-12-21 18:04:45
 * @LastEditors  : LiCai
 * @Description:审核实施计划-明细
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/AuditImplementationPlan/editPage/index.js
 */
import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Affix, Button, Form, message, Spin, Modal } from 'antd';
import { WorkFlow } from "suid";
import { router } from 'dva';
import classnames from 'classnames';
import moment from 'moment';
import { pick } from "lodash"
import { closeCurrent } from '@/utils';
import styles from '../../../Supplier/Editor/index.less';
import BaseInfo from "./BaseInfo";
import AuditInfo from "./AuditInfo";
import AuditScope from "./AuditScope";
import AuditorInfo from "./AuditorInfo";
import PersonTable from "./PersonTable";
import AuditPlan from "./AuditPlan";
import ChangeInfo from "./ChangeInfo";
import {
    mergeContent,
    addReviewImplementPlan,
    updateReviewImplementPlan,
    findDetailsByReviewImplementPlanId,
    changeReviewImplementPlanInsert
} from "../service";

const { StartFlow } = WorkFlow;
const pickpropertys = [
    'reviewPlanMonthCode',
    'reviewWayId', 'reviewWayCode', 'reviewWayName',
    'supplierId', 'supplierCode', 'supplierName',
    'agentName', 'agentCode', 'agentId',
    'countryId', 'countryCode', 'countryName', 'provinceId', 'provinceCode', 'provinceName',
    'cityId', 'cityCode', 'cityName', 'countyId', 'countyCode', 'countyName', 'address',
    'contactUserName', 'contactUserTel', 'leaderId', 'leaderName', 'leaderEmployeeNo'
]
const Index = (props) => {
    const { form, onRef } = props;
    const tableRef = useRef(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        type: "detail",
        isView: true,
        title: "审核实施计划"
    });

    const { query } = router.useLocation();

    useImperativeHandle(onRef, () => ({
        editDataInflow,
    }));

    async function editDataInflow() {
        const allData = getAllData();
        if (!allData) return false;
        const res = await updateReviewImplementPlan({ ...allData, inFlow: true});
        return res;
    }

    useEffect(() => {
        if (query.pageState !== "add") {
            getDetail();
        } else {
            getOriginData();
        }
    }, [])

    useEffect(() => {
        let { id, pageState } = query;
        if (!pageState) {
            // 来自工作流
            pageState = props.pageState;
        }
        switch (pageState) {
            case 'add':
                setData({ type: pageState, isView: false, title: '新增审核实施计划' });
                break;
            case 'edit':
                setData({ type: pageState, id, isView: false, title: `编辑审核实施计划: ${editData.reviewImplementPlanCode}` });
                break;
            case 'detail':
                setData({ type: pageState, isView: true, title: `审核实施计划明细: ${editData.reviewImplementPlanCode}` });
                break;
            case 'change':
                setData({ type: pageState, isView: false, title: `变更审核实施计划: ${editData.reviewImplementPlanCode}` });
                break;
            case 'isInflow':
                setData({ type: pageState, isView: true, title: `审核实施计划明细: ${editData.reviewImplementPlanCode}` });
                break;
            default:
                setData({ type: pageState, isView: false, title: '审核实施计划管理-新增' });
                break;
        }
    }, [editData]);
    // 编辑和明细时构造treeData
    const buildTreeData = (sonList) => {
        if(!sonList || sonList.length === 0) return [];
        let arr = JSON.parse(JSON.stringify(sonList));
        arr.map(item => {
            item.id = item.systemId;
            item.key = item.systemId;
            item.title = item.systemName;
            item.name = item.systemName;
            item.code = item.systemCode;
            if (!item.children) {
                item.children = [];
            }
        });
        return arr;
    };

    // 新增时获取初始数据
    async function getOriginData() {
        let res = {};
        const ids = query.ids && query.ids.split(",");
        if (query.pageState === "add") {
            res = await mergeContent({ lineId: ids })
            if (res.success) {
                let resData = { ...res.data };
                resData.treeData = buildTreeData(resData.sonList);
                resData.reviewTeamGroupBoList = Object.values(resData.reviewTeamGroupBoMap);
                console.log("整合的数据", resData);
                setEditData(resData);
            } else {
                message.error(res.message);
            }
        }
    }

    // 获取明细
    async function getDetail() {
        setLoading(true);
        let res = await findDetailsByReviewImplementPlanId({ id: query.id });
        if (res.success) {
            let resData = { ...res.data };
            resData.treeData = buildTreeData(resData.sonList);
            console.log("获取到的数据res", resData)
            setEditData(resData);
        } else {
            message.error(res.message);
        }
        setLoading(false);
    }

    const getAllData = () => {
        let saveData = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                saveData = { ...editData, ...values };
                if (query.pageState === "add") {
                    let sessionLins = JSON.parse(sessionStorage.getItem('selectedMonthLIne'));
                    let pickObj = pick(sessionLins[0], pickpropertys);
                    saveData = { ...saveData, ...pickObj };
                    saveData.reviewImplementPlanLineBos = sessionLins.map(item => ({
                        ...item,
                        reviewImplementPlanLinenum: item.reviewPlanMonthLinenum,
                        reviewPlanMonthLineId: item.id
                    }));
                }
                saveData.reviewDateStart = moment(saveData.reviewDateStart).format('YYYY-MM-DD') + " 00:00:00";
                saveData.reviewDateEnd = moment(saveData.reviewDateEnd).format('YYYY-MM-DD') + " 23:59:59";
                let lineData = tableRef.current.getTableList();
                saveData.reviewTeamGroupBoList = lineData;
                saveData.sonList = saveData.sonList.map(item => {
                    item.reviewEvlRuleBoList = item.ruleList ? item.ruleList : item.reviewEvlRuleBoList;
                    // delete item.ruleList;
                    return item;
                });
                if (query.pageState === "change") {
                    if (!saveData.changeFileIdList) {
                        saveData.changeFileIdList = [];
                    }
                    saveData.attachRelatedList = saveData.attachRelatedId;
                    saveData.reviewPlanFileList = saveData.reviewPlanFileId;
                }
                // delete saveData.reviewTeamGroupBoMap
                // delete saveData.treeData;
                delete saveData.selected;
                console.log('保存的数据saveData', saveData);
            }
        });
        return saveData
    }

    const handleSave = async (handleType) => {
        let saveData = getAllData();
        if (!saveData) return ({ id: false, message: "数据不完整" });
        let res = {};
        setLoading(true);
        if (query.pageState === "add") {
            res = await addReviewImplementPlan(saveData);
        } else if (query.pageState === "edit") {
            res = await updateReviewImplementPlan(saveData);
        } else if(query.pageState === "change" || handleType === 'delete') {
            // 变更添加
            res = await changeReviewImplementPlanInsert({...saveData, whetherDeleted: handleType === 'delete'});
        }
        setLoading(false);
        if (res.success) {
            if (handleType === "publish") {
                return { id: res.data, message: "保存成功" };
            } else {
                closeCurrent();
                message.success("操作成功")
            }
        } else {
            if (handleType === "publish") {
                return { id: false, message: res.message };
            } else {
                message.error(res.message);
            }
        }

    }
    // 提交审核验证
    const handleBeforeStartFlow = async () => {
        const res = await handleSave("publish");
        console.log("获取到的res是多少", res)
        return new Promise(function (resolve, reject) {
            if (res.id) {
                resolve({
                    success: data,
                    message: '保存成功',
                    data: {
                        businessKey: res.id
                    }
                })
                return
            } else {
                setTimeout(()=>{
                    let closeBtns = document.getElementsByClassName("close-icon");
                    for(let i = 0; i< closeBtns.length; i++) {
                        closeBtns[i].click();
                    }
                }, 1000);
                reject({
                    success: data,
                    message: res.message
                })
            }
        })
    }
    // 提交审核完成更新列表
    function handleComplete() {
        setLoading(false);
        setTimeout(() => {
            closeCurrent();
        }, 3000)
    }

    return <Spin spinning={loading}>
        <Affix>
            <div className={classnames(styles.fbc, styles.affixHeader)}>
                <span style={{fontSize: '18px', fontWeight: 'bolder'}}>{data.title}</span>
                {
                    props.isInFlow!==1 && (data.type !== 'detail' || data.type === 'change' || data.type === 'edit') && <div style={{ display: "flex", alignItems: 'center' }}>
                        <Button className={styles.btn} onClick={() => { closeCurrent() }}>返回</Button>
                        {data.type !== 'change' && <Button className={styles.btn} onClick={() => handleSave('save')} loading={loading}>暂存</Button>}
                        {data.type === 'change' && <Button className={styles.btn} onClick={() => handleSave('delete')} loading={loading}>作废</Button>}
                        <StartFlow
                            className={styles.btn}
                            type='primary'
                            beforeStart={handleBeforeStartFlow}
                            startComplete={handleComplete}
                            onCancel={() => { setLoading(false); closeCurrent();}}
                            businessKey={query?.id}
                            disabled={loading}
                            businessModelCode={data.type === 'change' ? 'com.ecmp.srm.sam.entity.sr.ReviewImplementPlanChange' : 'com.ecmp.srm.sam.entity.sr.ReviewImplementPlan'}
                        >
                            {
                                loading => <Button loading={loading} type='primary'>提交</Button>
                            }
                        </StartFlow>
                    </div>
                }
            </div>
        </Affix>
        {
            data.type === "change" && <ChangeInfo
                form={form}
                originData={{}}
                isView={false}
            />
        }
        <BaseInfo
            form={form}
            type={data.type}
            isView={data.isView}
            originData={editData}
        />
        {/* 拟审核信息 */}
        <AuditInfo
            type={data.type}
            isView={data.isView}
            originData={editData}
        />
        {/* 审核范围 */}
        <AuditScope treeData={editData.treeData} />
        {/* 审核人员 */}
        <AuditorInfo
            type={data.type}
            treeData={editData.treeData}
            wrappedComponentRef={tableRef}
            reviewTeamGroupBoList={editData.reviewTeamGroupBoList ? editData.reviewTeamGroupBoList : []}
            orgLeaderName={editData.leaderName}
            deleteArr={[]}
            originData={data.editData}
        />
        {/* 协同人员 */}
        <PersonTable originData={editData.coordinationMemberBoList} />
        {/* 审核计划 */}
        <AuditPlan
            type={data.type}
            isView={data.isView}
            form={form}
            originData={editData}
        />
    </Spin>
}

export default Form.create()(Index);
