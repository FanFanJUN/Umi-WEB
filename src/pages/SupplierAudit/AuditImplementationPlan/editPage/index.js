/*
 * @Author:黄永翠
 * @Date: 2020-11-09 09:38:38
 * @LastEditTime: 2020-11-11 14:04:00
 * @LastEditors: Please set LastEditors
 * @Description:审核实施计划-明细
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\index.js
 */
import React, { useEffect, useRef, useState } from 'react';
import { Affix, Button, Form, message, Spin, Modal } from 'antd';
import { WorkFlow } from "suid";
import { router } from 'dva';
import classnames from 'classnames';
import { closeCurrent, getMobile, getUserId, getUserName } from '@/utils';
import styles from '../../../Supplier/Editor/index.less';
import BaseInfo from "./BaseInfo";
import AuditInfo from "./AuditInfo";
import AuditScope from "./AuditScope";
import AuditorInfo from "./AuditorInfo";
import PersonTable from "./PersonTable";
import AuditPlan from "./AuditPlan";

const { StartFlow } = WorkFlow;

const Index = (props) => {
    const { form } = props;
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        isView: false,
        type: 'add',
        title: '',
    });

    const { query } = router.useLocation();
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
                setData({ type: pageState, isView: true, title: `审核实施计划明细: ${editData.reviewPlanMonthCode}` });
                break;
            case 'change':
                setData({ type: pageState, isView: true, title: `变更审核实施计划: ${editData.reviewPlanMonthCode}` });
                break;
            case 'isInflow':
                setData({ type: pageState, isView: true, title: `审核实施计划明细: ${editData.reviewPlanMonthCode}` });
                break;
            default:
                setData({ type: pageState, isView: false, title: '审核实施计划管理-新增' });
                break;
        }
    }, [editData])
    const handleSave = (type) => {
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
               console.log('values', values)
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
                    (data.type !== 'detail' || data.type === 'change') && <div style={{ display: "flex", alignItems: 'center' }}>
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
                            businessModelCode={data.type === 'change' ? 'com.ecmp.srm.sam.entity.sr.ReviewPlanMonthChange' : 'com.ecmp.srm.sam.entity.sr.ReviewPlanMonth'}
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
        <AuditInfo />
        {/* 审核范围 */}
        <AuditScope />
        {/* 审核人员 */}
        <AuditorInfo />
        {/* 协同人员 */}
        <PersonTable />
        {/* 审核计划 */}
        <AuditPlan
            type={data.type}
            form={form}
        />
    </Spin>
}

export default Form.create()(Index);