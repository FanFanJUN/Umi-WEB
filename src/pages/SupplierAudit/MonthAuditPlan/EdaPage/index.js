import React, { useEffect, useRef, useState } from 'react';
import { Affix, Button, Form, message, Spin } from 'antd';
import classnames from 'classnames';
import BaseInfo from "../../AnnualAuditPlan/EdaPage/BaseInfo"
import styles from '../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserId, getUserName } from '@/utils';
import LineInfo from './LineInfo';
import { insertMonthBo } from "../service";

const Index = (props) => {
    const { form } = props;
    const [lineData, setlineData] = useState([]);
    const tableRef = useRef(null);
    const [data, setData] = useState({
        id: '',
        editDate: {},
        spinLoading: false,
        isView: false,
        loading: false,
        type: 'add',
        title: '',
        userInfo: {},
    });
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
                setData((value) => ({ ...value, type: pageState, id, isView: false, title: '月度审核计划管理-编辑' }));
                break;
            case 'detail':
                setData((value) => ({ ...value, type: pageState, isView: true, title: `月度审核计划管理-明细` }));
                break;
            default:
                setData((value) => ({ ...value, type: pageState, isView: false, title: '月度审核计划管理-新增' }));
                break;
        }
    }, []);

    const getUser = () => {
        const userId = getUserId();
        const userName = getUserName();
        const userMobile = getMobile();
        setData((v) => ({ ...v, userInfo: { userName, userId, userMobile } }));
    };

    const handleBack = () => {
        setData(v => ({ ...v, loading: false }))
        // openNewTab(`qualitySynergy/DataSharingList`, '技术资料分享需求列表', true);
        closeCurrent();
    };

    const handleSave = (type) => {
        form.validateFieldsAndScroll(async (err, values) => {
            if (err) return;
            let saveData = {...values};
            let lineData = tableRef.current.getTableList();
            saveData.reviewPlanMonthName = saveData.reviewPlanYearName;
            delete saveData.reviewPlanYearName;
            saveData.lineBoList = lineData;
            console.log('lineData', saveData)
            if(lineData.length === 0) {
                message.info('请至少添加一条行信息');
                return;
            }
            const res = await insertMonthBo(saveData)
            if(res.success) {
                message.success("保存成功");
            }
        });
    }
    return <>
        <Spin spinning={data.spinLoading}>
            <Affix>
                <div className={classnames(styles.fbc, styles.affixHeader)}>
                    <span>{data.title}</span>
                    {
                        data.type !== 'detail' && <div>
                            <Button className={styles.btn} onClick={handleBack}>返回</Button>
                            <Button className={styles.btn} onClick={() => handleSave('save')}>暂存</Button>
                            <Button className={styles.btn} type='primary' onClick={() => handleSave('publish')} >提交</Button>
                        </div>
                    }
                </div>
            </Affix>
            <BaseInfo
                form={form}
                userInfo={data.userInfo}
                type={data.type}
                isView={data.isView}
                originData={data.editDate}
            />
            <LineInfo
                type={data.type}
                isView={data.isView}
                wrappedComponentRef={tableRef}
            />
        </Spin>
    </>
}
export default Form.create()(Index);