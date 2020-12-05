import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Affix, Button, Form, message, Spin, Modal } from 'antd';
import { WorkFlow } from "suid";
import classnames from 'classnames';
import moment from "moment";
import BaseInfo from "./BaseInfo";
import styles from '../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserId, getUserName } from '@/utils';
import LineInfo from './LineInfo';
import ChangeInfo from "../component/ChangeInfo";
import { insertMonthBo, findOneOverride, upDateMonthBo, insertChangeMonthBo } from "../service";
const { StartFlow } = WorkFlow;

const Index = (props) => {
    const { form, onRef } = props;
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

    useImperativeHandle(onRef, () => ({
        editDataInflow,
    }));

    async function editDataInflow() {
        const allData = getAllData();
        if (!allData) return false;
        const res = await upDateMonthBo({ ...allData, isInflow: true});
        return res;
    }

    useEffect(() => {
        if (query.pageState !== "add") {
            getDetail();
        }
    }, [])

    useEffect(() => {
        const { id, pageState } = query;
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
        } else {
            let reviewPlanMonthLinenum = "";
            let tag = lineData.some(item => {
                if(!item.reviewWayId || !item.reviewOrganizedWayId)reviewPlanMonthLinenum = item.reviewPlanMonthLinenum
                return (!item.reviewWayId || !item.reviewOrganizedWayId)
            })
            if(tag) {
                message.error("行" + reviewPlanMonthLinenum + "：审核方式或审核组织形式不能为空，请进行编辑完善");
                return false;
            }
        }
        // 变更时
        if (query.pageState === "change") {
            const changeInfo = changeRef.current.getData();
            if (!changeInfo) {
                return false;
            } else {
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
            let baseInfo = {};
            form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    baseInfo = false;
                } else {
                    values.applyMonth = moment(values.applyMonth).format('YYYY-MM-DD').slice(0,7) + "-01";
                    console.log("表单数据", values)
                    baseInfo = { ...values }
                }
            });
            if (!baseInfo) return false;
            Object.assign(saveData, baseInfo);
            saveData.lineBoList = lineData;
            saveData.deleteList = deleteArr;
            if (!saveData.attachRelatedIds) {
                saveData.attachRelatedIds = [];
            }
            return saveData;
        }
    }
    // 新增保存，编辑保存，变更保存
    const handleSave = async (type) => {
        let saveData = await getAllData();
        // console.log("整合的数据", saveData)
        if (!saveData) return false;
        setLoading(true);
        let res = {};
        console.log(query.pageState);
        const requestPromise = {
            'add':  insertMonthBo,
            'edit':  upDateMonthBo,
            'change':  insertChangeMonthBo,
        };
        // 请求错误时 success值同样为 true  catch 重新赋值
        try {
             res = await requestPromise[query.pageState](saveData);
            if(res && res.data && query.pageState === 'edit') {
                res.data = saveData.id;
            }
        } catch (error) {
            res = error;
          setLoading(false);
        }
        if (res.success) {
            if (type === "save") {
                setLoading(false);
                message.success("保存成功");
                setTimeout(() => {
                    handleBack();
                }, 3000)
            } else {
                // 处理提交审核---返回数据id
                return query.pageState === "change" ? res.message : res.data;
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
                    message: '提交失败'
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
    return <>
        <Spin spinning={loading}>
            <Affix>
                <div className={classnames(styles.fbc, styles.affixHeader)}>
                    <span style={{fontSize: '18px', fontWeight: 'bolder'}}>{data.title}</span>
                    {
                        props.isInFlow!==1 && (data.type === 'add' || data.type === 'change' || data.type === 'edit') && <div style={{ display: "flex", alignItems: 'center' }}>
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
