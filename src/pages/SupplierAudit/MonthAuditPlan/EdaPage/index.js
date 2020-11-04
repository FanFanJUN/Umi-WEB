import React, { useEffect, useRef, useState } from 'react';
import { Affix, Button, Form, message, Spin, Modal } from 'antd';
import { WorkFlow } from "suid";
import classnames from 'classnames';
import BaseInfo from "./BaseInfo";
import styles from '../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserId, getUserName } from '@/utils';
import LineInfo from './LineInfo';
import ChangeInfo from "../component/ChangeInfo"
import { insertMonthBo, findOneOverride, upDateMonthBo } from "../service";
const { StartFlow } = WorkFlow;

const Index = (props) => {
    const { form } = props;
    const tableRef = useRef(null);
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
        const { id, pageState } = query;
        switch (pageState) {
            case 'add':
                getUser();
                setData((value) => ({ ...value, type: pageState, isView: false, title: '月度审核计划管理-新增' }));
                break;
            case 'edit':
                getUser();
                getDetail();
                setData((value) => ({ ...value, type: pageState, id, isView: false, title: '月度审核计划管理-编辑' }));
                break;
            case 'detail':
                getDetail();
                setData((value) => ({ ...value, type: pageState, isView: true, title: `月度审核计划明细: ${id}` }));
                break;
            case 'change':
                getDetail();
                setData((value) => ({ ...value, type: pageState, isView: true, title: `变更月度审核计划: ${id}` }));
                break;
            default:
                setData((value) => ({ ...value, type: pageState, isView: false, title: '月度审核计划管理-新增' }));
                break;
        }
    }, []);

    const getDetail = async () => {
        setLoading(true);
        const res = await findOneOverride({
            reviewPlanMonthCode: query.id
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

    const handleSave = async (type) => {
        form.validateFieldsAndScroll(async (err, values) => {
            if (err) return;
            let saveData = { ...values };
            let lineData = tableRef.current.getTableList();
            let deleteArr = tableRef.current.getDeleteArr();
            saveData.lineBoList = lineData;
            saveData.deleteList = deleteArr;
            if (!saveData.attachRelatedIds) {
                saveData.attachRelatedIds = [];
            }
            if (lineData.length === 0) {
                message.info('请至少添加一条行信息');
                return;
            }
            setLoading(true);
            let res = {};
            if (query.pageState === "add") {
                res = await insertMonthBo(saveData);
            } else {
                saveData = { ...editData, ...saveData };
                res = await upDateMonthBo(saveData);
                res.data = saveData.id;
            }
            if (res.success) {
                if (type === "save") {
                    setLoading(false);
                    message.success("保存成功");
                    setTimeout(() => {
                        // handleBack();
                    }, 3000)
                } else {
                    // 处理提交审核
                    console.log("这里返回的数据", res.data)
                    return res.data;
                }
            } else {
                setLoading(false);
                message.error(res.message);
                return false;
            }
        });
    }
    // 提交审核验证
    const handleBeforeStartFlow = async () => {
        const id = await handleSave("publish");
        console.log("获取到的id是多少", id)
        return new Promise(function (resolve, reject) {
            if (id) {
                resolve({
                    success: data,
                    message: msg,
                    data: {
                        businessKey: id
                    }
                })
                return
            }
            resolve({
                success: data,
                message: '数据校验不通过，请检查评价指标是否填写完整'
            })
        })
    }
    // 提交审核完成更新列表
    function handleComplete() {
        setLoading(false);
    }
    return <>
        <Spin spinning={loading}>
            <Affix>
                <div className={classnames(styles.fbc, styles.affixHeader)}>
                    <span>{data.title}</span>
                    {
                        (data.type !== 'detail' || data.type === 'change') && <div style={{ display: "flex", alignItems: 'center' }}>
                            <Button className={styles.btn} onClick={handleBack}>返回</Button>
                            {data.type !== 'change' && <Button className={styles.btn} onClick={() => handleSave('save')}>暂存</Button>}
                            <StartFlow
                                className={styles.btn}
                                type='primary'
                                beforeStart={handleBeforeStartFlow}
                                // startComplete={handleBack}
                                callBack={handleComplete}
                                businessKey={query?.id}
                                disabled={loading}
                                businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewPlanMonth'
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
                userInfo={data.userInfo}
                type={data.type}
                isView={data.isView}
                originData={editData}
            />
            {
                data.type === "change" && <ChangeInfo originData={{}}/>
            }
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