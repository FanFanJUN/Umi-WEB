import React, { useEffect, useRef, useState } from 'react';
import { Affix, Button, Form, message, Spin, Modal } from 'antd';
import { WorkFlow } from "suid";
import classnames from 'classnames';
import BaseInfo from "./BaseInfo";
import styles from '../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserId, getUserName } from '@/utils';
import LineInfo from './LineInfo';
import ChangeInfo from "../component/ChangeInfo";
import ChangeLineInfo from "../component/ChangeLineInfo";
import { insertMonthBo, findOneOverride, upDateMonthBo, insertChangeMonthBo } from "../service";
const { StartFlow } = WorkFlow;

const Index = (props) => {
    const { form } = props;
    const tableRef = useRef(null);
    const changeRef = useRef(null);
    const [data, setData] = useState({
        id: '',
        spinLoading: false,
        isView: false,
        type: 'add',
        title: '',
        userInfo: {},
    });
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);

    const { query } = router.useLocation();
    useEffect(() => {
        if (query.pageState !== "add") {
            getDetail();
        }
    }, [])
    useEffect(() => {
        const { id, pageState } = query;
        if(!pageState){
            // 来自工作流
            pageState = props.pageState;
        }
        switch (pageState) {
            case 'add':
                getUser();
                setData((value) => ({ ...value, type: pageState, isView: false, title: '月度审核计划管理-新增' }));
                break;
            case 'edit':
                getUser();
                setData((value) => ({ ...value, type: pageState, id, isView: false, title: '月度审核计划管理-编辑' }));
                break;
            case 'detail':
                setData((value) => ({ ...value, type: pageState, isView: true, title: `月度审核计划明细: ${editData.reviewPlanMonthCode}` }));
                break;
            case 'change':
                setData((value) => ({ ...value, type: pageState, isView: true, title: `变更月度审核计划: ${editData.reviewPlanMonthCode}` }));
                break;
            case 'isInflow':
                setData((value) => ({ ...value, type: pageState, isView: true, title: `月度审核计划明细: ${editData.reviewPlanMonthCode}` }));
                break;
            default:
                setData((value) => ({ ...value, type: pageState, isView: false, title: '月度审核计划管理-新增' }));
                break;
        }
    }, [editData]);

    const getDetail = async () => {
        setLoading(true);
        let res = await findOneOverride({
            id: query.id
        });
        setLoading(false);
        if (res) {
            setEditData(res.data)
        } else {
            message.error(res.message);
        }
    }

    const getUser = () => {
        const userId = getUserId();
        const userName = getUserName();
        const userMobile = getMobile();
        setData((v) => ({ ...v, userInfo: { userName, userId, userMobile } }));
    };

    const handleBack = () => {
        closeCurrent();
    };
    // 处理数据
    const getAllData = () => {
        let saveData = { ...editData };
        let lineData = tableRef.current.getTableList();
        console.log("获取到的表格数据", lineData)
        let deleteArr = tableRef.current.getDeleteArr();
        if (lineData.length === 0) {
            message.info('请至少添加一条行信息');
            return false;
        }
        // 变更时
        if (query.pageState === "change") {
            const changeInfo = changeRef.current.getData();
            if (!changeInfo) {
                return false;
            } else {
                if (!changeInfo.changeFileId) {
                    changeInfo.changeFileId = [];
                }
                delete saveData.lineBoList;
                saveData.reviewPlanMonthLineChangeBos = lineData.concat(deleteArr).map((item, index) => {
                    item.reviewPlanMonthLineId = item.id;
                    delete item.id;
                    item.reviewPlanMonthChangeLinenum = ((Array(4).join(0) + (index + 1)).slice(-4) + '0');
                    return item;
                })
                Object.assign(saveData, changeInfo);
                return saveData;
            }
        } else {
            const baseInfo = {};
            form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    baseInfo = false;
                }
                baseInfo = { ...values }
            });
            if (!baseInfo) return false;
            saveData.lineBoList = lineData;
            saveData.deleteList = deleteArr;
            if (!saveData.attachRelatedIds) {
                saveData.attachRelatedIds = [];
            }
            Object.assign(saveData, baseInfo);
            return saveData;
        }
    }
    // 新增保存，编辑保存，变更保存
    const handleSave = async (type) => {
        let saveData = await getAllData();
        if (!saveData) return false;
        setLoading(true);
        let res = {};
        if (query.pageState === "add") {
            res = await insertMonthBo(saveData);
        } else if (query.pageState === "edit") {
            res = await upDateMonthBo(saveData);
            res.data = saveData.id;
        } else {
            // 变更暂存
            res = await insertChangeMonthBo(saveData);
        }
        if (res.success) {
            if (type === "save") {
                setLoading(false);
                message.success("保存成功");
                setTimeout(() => {
                    // handleBack();
                }, 3000)
            } else {
                // 处理提交审核---返回数据id
                return res.data;
            }
        } else {
            setLoading(false);
            message.error(res.message);
            return false;
        }
    }
    // 提交审核验证
    const handleBeforeStartFlow = async () => {
        const id = await handleSave("publish");
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
            // handleBack()
        }, 3000)
    }
    return <>
        <Spin spinning={loading}>
            <Affix>
                <div className={classnames(styles.fbc, styles.affixHeader)}>
                    <span>{data.title}</span>
                    {
                        (data.type !== 'detail' || data.type === 'change') && <div style={{ display: "flex", alignItems: 'center' }}>
                            <Button className={styles.btn} onClick={handleBack}>返回</Button>
                            <Button className={styles.btn} onClick={() => handleSave('save')}>暂存</Button>
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
            {
                data.type === "change" && <ChangeInfo
                    originData={{}}
                    isView={false}
                    wrappedComponentRef={changeRef}
                />
            }
            <BaseInfo
                form={form}
                userInfo={data.userInfo}
                type={data.type}
                isView={data.isView}
                originData={editData}
            />
            <LineInfo
                type={data.type}
                isView={data.isView}
                wrappedComponentRef={tableRef}
                originData={editData.lineBoList}
            />
        </Spin>
    </>
}
export default Form.create()(Index);
