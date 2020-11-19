/*
 * @Author:黄永翠
 * @Date: 2020-11-09 09:38:38
 * @LastEditTime: 2020-11-19 10:27:40
 * @LastEditors: Please set LastEditors
 * @Description:审核实施计划-明细
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\index.js
 */
import React, { useEffect, useRef, useState } from 'react';
import { Affix, Button, Form, message, Spin, Modal } from 'antd';
import { WorkFlow } from "suid";
import { router } from 'dva';
import classnames from 'classnames';
import moment from 'moment';
import { pick } from "lodash"
import { closeCurrent, getMobile, getUserId, getUserName } from '@/utils';
import styles from '../../../Supplier/Editor/index.less';
import { getRandom } from '../../../QualitySynergy/commonProps';
import BaseInfo from "./BaseInfo";
import AuditInfo from "./AuditInfo";
import AuditScope from "./AuditScope";
import AuditorInfo from "./AuditorInfo";
import PersonTable from "./PersonTable";
import AuditPlan from "./AuditPlan";
import { mergeContent, addReviewImplementPlan, findDetailsByReviewImplementPlanId } from "../service";

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
    const { form } = props;
    const tableRef = useRef(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        isView: false,
        type: 'detail',
        title: '',
    });

    const { query } = router.useLocation();

    useEffect(() => {
        if (query.pageState !== "add") {
            getDetail();
        } else {
            getOriginData();
        }
    }, [])

    useEffect(() => {
        const { id, pageState } = query;
        if (!pageState) {
            // 来自工作流
            pageState = props.pageState;
        }
        switch (pageState) {
            case 'add':
                setData({ type: pageState, isView: false, title: '审核实施计划管理-新增' });
                break;
            case 'edit':
                setData({ type: pageState, id, isView: false, title: '审核实施计划管理-编辑' });
                break;
            case 'detail':
                setData({ type: pageState, isView: true, title: `审核实施计划明细: ${editData.reviewImplementPlanCode}` });
                break;
            case 'change':
                setData({ type: pageState, isView: true, title: `变更审核实施计划: ${editData.reviewImplementPlanCode}` });
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

    // 新增时获取初始数据
    async function getOriginData() {
        let res = {};
        const ids = query.ids && query.ids.split(",");
        if (query.pageState === "add") {
            res = await mergeContent({ lineId: ids })
            if (res.success) {
                let resData = {...res.data};
                resData.treeData = buildTreeData(resData.fatherList, resData.sonList);
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
        let res = await findDetailsByReviewImplementPlanId({id: query.id});
        if(res.success) {
            let resData = {...res.data};
            resData.treeData = buildTreeData(resData.fatherList, resData.sonList);
            console.log("获取到的数据res", resData)
            setEditData(resData);
        } else {
            message.error(res.message);
        }
        setLoading(false);
    }

    const handleSave = (type) => {
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let sessionLins = JSON.parse(sessionStorage.getItem('selectedMonthLIne'));
                let pickObj = pick(sessionLins[0], pickpropertys);
                let saveData = {...values, ...editData, ...pickObj};
                saveData.reviewImplementPlanLineBos = sessionLins.map(item => ({
                    ...item, 
                    reviewImplementPlanLinenum: item.reviewPlanMonthLinenum,
                    reviewPlanMonthLineId: item.id
                }));
                saveData.reviewDateStart = moment(saveData.reviewDateStart).format('YYYY-MM-DD hh:mm:ss');
                saveData.reviewDateEnd = moment(saveData.reviewDateEnd).format('YYYY-MM-DD hh:mm:ss');
                let lineData = tableRef.current.getTableList();
                saveData.reviewTeamGroupBoMap = lineData;
                saveData.sonList = saveData.sonList.map(item =>{
                    item.reviewEvlRuleBoList = item.ruleList;
                    delete item.ruleList;
                    return item;
                });
                if(!saveData.attachRelatedId){
                    saveData.attachRelatedId = [];
                }
                delete saveData.treeData;
                delete saveData.selected;
                console.log('保存的数据saveData', saveData);
                addReviewImplementPlan(saveData).then(res => {
                    console.log("保存接口调用返回", res)
                    if(res.success) {
                        message.success("保存成功")
                    } else {
                        message.error(res.message);
                    }
                })
                
            } else {
                message.warning("请检查数据是否填写完整！")
            }
        });
    }
    // 提交审核验证
    const handleBeforeStartFlow = async () => {
        // const id = await handleSave("publish");
        console.log("获取到的id是多少", id)
        return new Promise(function (resolve, reject) {
            if (id) {
                resolve({
                    success: data,
                    message: '保存成功',
                    data: {
                        businessKey: id
                    }
                })
                return
            } else {
                reject({
                    success: data,
                    message: '提交失败，请检查数据是否填写完整'
                })
            }
        })
    }
    // 提交审核完成更新列表
    function handleComplete() {
        setLoading(false);
        message.success("提交成功");
        setTimeout(() => {
            handleBack()
        }, 3000)
    }

    return <Spin spinning={loading}>
        <Affix>
            <div className={classnames(styles.fbc, styles.affixHeader)}>
                <span>{data.title}</span>
                {
                    (data.type !== 'detail' || data.type === 'change' || data.type === 'edit') && <div style={{ display: "flex", alignItems: 'center' }}>
                        <Button className={styles.btn} onClick={() => { closeCurrent() }}>返回</Button>
                        {data.type !== 'change' && <Button className={styles.btn} onClick={() => handleSave('save')}>暂存</Button>}
                        <StartFlow
                            className={styles.btn}
                            type='primary'
                            beforeStart={handleBeforeStartFlow}
                            startComplete={handleComplete}
                            onCancel={() => { setLoading(false); }}
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