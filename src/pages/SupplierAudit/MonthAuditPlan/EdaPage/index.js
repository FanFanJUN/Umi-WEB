import React, { useEffect, useRef, useState } from 'react';
import { Affix, Button, Form, message, Spin, Modal } from 'antd';
import { StartFlow } from 'seid';
import classnames from 'classnames';
import BaseInfo from "./BaseInfo";
import styles from '../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserId, getUserName } from '@/utils';
import LineInfo from './LineInfo';
import { insertMonthBo, findOneOverride } from "../service";

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
                setData((value) => ({ ...value, type: pageState, isView: true, title: `月度审核计划管理-明细` }));
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
            saveData.lineBoList = lineData;
            if (!saveData.attachRelatedIds) {
                saveData.attachRelatedIds = [];
            }
            if (lineData.length === 0) {
                message.info('请至少添加一条行信息');
                return;
            }
            setLoading(true);
            const res = await insertMonthBo(saveData);
            if (res.success) {
                if (type === "save") {
                    setLoading(false);
                    message.success("保存成功");
                    setTimeout(() => {
                        // handleBack();
                    }, 3000)
                } else {
                    // 处理提交审核
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
    const handleBeforeStartFlow = () => {
        return new Promise(function (resolve, reject) {
            (async function () {
                const id = await handleSave("publish");
                if (id) {
                    resolve({
                        success: true,
                        message: '保存单据成功',
                        data: { businessKey: id },
                    });
                }
            })()
        })
    }
    // 提交审核完成更新列表
    function handleComplete() {

    }
    return <>
        <Spin spinning={loading}>
            <Affix>
                <div className={classnames(styles.fbc, styles.affixHeader)}>
                    <span>{data.title}</span>
                    {
                        data.type !== 'detail' && <div>
                            <Button className={styles.btn} onClick={handleBack}>返回</Button>
                            <Button className={styles.btn} onClick={() => handleSave('save')}>暂存</Button>
                            {/* <Button className={styles.btn} type='primary' onClick={() => handleSave('publish')} >提交</Button> */}
                            <StartFlow
                                style={{ marginRight: '5px' }}
                                beforeStart={handleBeforeStartFlow}
                                butTitle="提交"
                                callBack={handleComplete}
                                businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewRequirement'
                            ></StartFlow>
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