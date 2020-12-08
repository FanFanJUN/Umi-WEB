/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:04:51
 * @LastEditTime: 2020-12-08 17:34:13
 * @Description: 新增  编辑  详情 page
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/index.js
 */
import React, { Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Affix, Button, Form, message, Spin } from 'antd';
import classnames from 'classnames';
import { WorkFlow } from "suid";
import styles from '../../../Supplier/Editor/index.less';
import { closeCurrent } from '@/utils';
import { getUserInfoFromSession } from '@/utils/utilTool';
import BaseInfo from './BaseInfo';
import { router } from 'dva';
import LineInfo from './LineInfo';
import { findDetailedById, findReviewTypesByCode, reviewPlanYearAp } from '../service';
import { isEmptyArray } from '../../../../utils/utilTool';

const { StartFlow } = WorkFlow;
const userInfo = getUserInfoFromSession();

const Index = (props) => {

    const { form, onRef, isInFlow, pageState: propsPageState } = props;

    const { query } = router.useLocation();
    const tableRef = useRef(null);

    const [data, setData] = useState({
        id: '',
        editDate: {},
        isView: false,
        loading: false,
        type: 'add',
        title: '',
    });

    const [spinLoading, setSpinLoading] = useState(false);
    const [originData, setOriginData] = useState({});
    const [reviewType, setReviewType] = useState({});
    const [deleteLine, setDeleteLine] = useState([]);

    useImperativeHandle(onRef, () => ({
        editDataInflow,
    }));

    async function editDataInflow() {
        const allData = gatAllData();
        if (!(allData.bool)) return false;
        const res = await reviewPlanYearAp({ ...allData, type: 'edit', inFlow: true });
        return res;
    }

    useEffect(() => {
        const { id, pageState: queryPageSate } = query;
        const pageState = queryPageSate || propsPageState; // 流程中pageState 与url pageState
        if (pageState === 'edit' || pageState === 'detail') {
            async function fetchData() {
                setSpinLoading(true);
                const res = await findDetailedById({ id: query.id });
                if (res.success) {
                    res.data && setOriginData(res.data);
                } else {
                    message.error(res.message);
                }
                setSpinLoading(false);
            }
            fetchData();
        }
        if (pageState === 'edit' || pageState === 'add') {
            async function fetchData() {
                const res = await findReviewTypesByCode({ quickSearchValue: '监督审核' });
                if (res.success) {
                    const obj = res.data.rows;
                    if (obj.length === 0) return;
                    setReviewType(obj[0]);
                } else {
                    message.error('获取默认审核类型失败');
                }
            }
            fetchData();
        }
        switch (pageState) {
            case 'add':
                setData((value) => ({ ...value, type: pageState, isView: false, title: '新增年度审核计划' }));
                break;
            case 'edit':
                setData((value) => ({ ...value, type: pageState, id, isView: false, title: '编辑年度审核计划' }));
                break;
            case 'detail':
                setData((value) => ({ ...value, type: pageState, isView: true, title: `年度审核计划明细` }));
                break;
            default:
                break;
        }
        console.log(pageState, 'pageState');
    }, []);

    const handleBack = () => {
        setData(v => ({ ...v, loading: false }))
        // openNewTab(`qualitySynergy/DataSharingList`, '技术资料分享需求列表', true);
        closeCurrent();
    };

    const gatAllData = () => {
        let allData = { bool: true };
        const lineData = tableRef.current.getTableList();
        console.log("获取到的表格数据", lineData)
        const finnalLineData = lineData;
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                allData = { bool: false };
                return;
            };
            if (finnalLineData.length === 0) {
                allData = { bool: false };
                message.info('请至少添加一条行信息');
                return;
            }
            finnalLineData.forEach((item) => {
                if (!item.whetherDelete) {
                    item.whetherDelete = false;
                }
            })

            // 校验行数据
            for (const item of finnalLineData) {
                if (!item.reviewTypeCode || !item.reviewReasonCode) {
                    message.info('行上必填项为空, 请完善');
                    allData = { bool: false };
                    break;
                }
            }

            if (!(allData.bool)) return;
            allData = { ...originData, ...values, flowStatus: 'INIT', reviewPlanYearLineBos: lineData, bool: true };
        });
        return allData;
    }

    async function tohandleSave(buttonType) {
        const allData = gatAllData();
        if (!(allData.bool)) return;
        setSpinLoading(true);
        let res = {};
        try {
            res = await reviewPlanYearAp({ ...allData, type: data.type });
        } catch (error) {
            res = error;
        }
        if (buttonType === 'submit') {
            if (res.success) {
                // 编辑页
                if (data.type === 'edit') {
                    return data.id;
                }
                return res.data;
            } else {
                message.error(res.message);
            }
            setSpinLoading(false);
        } else {
            console.log("res", res)
            if (res.success) {
                message.success("暂存成功");
                setSpinLoading(false);
                setTimeout(() => {
                    closeCurrent();
                }, 1)
            } else {
                setSpinLoading(false);
                message.error(res.message);
            }
        }
    }

    // 提交审核验证
    const handleBeforeStartFlow = async () => {
        const id = await tohandleSave("submit");
        if (!id) return false;
        return new Promise(function (resolve, reject) {
            if (id) {
                resolve({
                    success: data,
                    message: '提交成功',
                    data: {
                        businessKey: id
                    }
                })
                return
            } else {
                reject({
                    success: data,
                    message: '提交失败'
                })
            }
        })
    }

    // 提交审核完成更新列表
    function handleComplete() {
        setSpinLoading(false);
        message.success("提交成功");
        setTimeout(() => {
            closeCurrent();
        }, 3000)
    }

    const showButton = () => {
        const buttons =
            (<Fragment>
                <Button className={styles.btn} onClick={handleBack}>返回</Button>,
                <Button className={styles.btn} onClick={() => tohandleSave('onlySave')}>暂存</Button>
                <StartFlow
                    className={styles.btn}
                    type='primary'
                    beforeStart={handleBeforeStartFlow}
                    startComplete={handleComplete}
                    onCancel={() => { setSpinLoading(false); }}
                    businessKey={query?.id}
                    disabled={spinLoading}
                    businessModelCode={'com.ecmp.srm.sam.entity.sr.ReviewPlanYear'}
                >
                    {
                        spinLoading => <Button loading={spinLoading} type='primary'>提交</Button>
                    }
                </StartFlow>
            </Fragment>);
        if (isInFlow) {
            return null;
        } else {
            if (data.type !== 'detail') {
                return buttons;
            }
            return null;
        }
    }

    return (
        <div>
            <Spin spinning={spinLoading}>
                <Affix>
                    <div className={classnames(styles.fbc, styles.affixHeader)}>
                        <span style={{ fontSize: '18px', fontWeight: 'bolder' }}>{data.title}</span>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {showButton()}
                        </div>
                    </div>
                </Affix>
                <BaseInfo
                    form={form}
                    userInfo={userInfo}
                    originData={originData}
                    type={data.type}
                    isView={data.isView}
                />
                <LineInfo
                    type={data.type}
                    isView={data.isView}
                    originData={originData}
                    reviewType={reviewType}
                    deleteLine={deleteLine}
                    callbackSetDeleteLine={(data) => { setDeleteLine(data); }}
                    wrappedComponentRef={tableRef}
                />
            </Spin>
        </div>
    )

}

export default Form.create()(Index);
