/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:04:51
 * @LastEditTime: 2020-10-28 15:40:02
 * @Description: 新增  编辑  详情 page
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/index.js
 */
import React, { useEffect, useRef, useState } from 'react';
import { Affix, Button, Form, message, Spin } from 'antd';
import classnames from 'classnames';
import styles from '../../../Supplier/Editor/index.less';
import { closeCurrent, getMobile, getUserId, getUserName, getAccount } from '@/utils';
import BaseInfo from './BaseInfo';
import { router } from 'dva';
import LineInfo from './LineInfo';
import { reviewPlanYearAp } from '../service';

const Index = (props) => {

    const { form } = props;

    const { query } = router.useLocation();

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

    const [lineData, setlineData] = useState([]);

    useEffect(() => {
        const { id, pageState } = query;
        switch (pageState) {
            case 'add':
                getUser();
                setData((value) => ({ ...value, type: pageState, isView: false, title: '年度审核计划管理-新增' }));
                break;
            case 'edit':
                getUser();
                setData((value) => ({ ...value, type: pageState, id, isView: false, title: '年度审核计划管理-编辑' }));
                break;
            case 'detail':
                setData((value) => ({ ...value, type: pageState, isView: true, title: `年度审核计划管理-明细` }));
                break;
            default:
                break;
        }
        console.log(pageState, 'pageState');
    }, []);

    const getUser = () => {
        const userId = getUserId();
        const userName = getUserName();
        const userMobile = getMobile();
        const account = getAccount();
        setData((v) => ({ ...v, userInfo: { userName, userId, userMobile, account } }));
    };

    const handleBack = () => {
        setData(v => ({ ...v, loading: false }))
        // openNewTab(`qualitySynergy/DataSharingList`, '技术资料分享需求列表', true);
        closeCurrent();
    };

    const handleSave = (buttonType) => {
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            if (lineData.length === 0) {
                message.info('请至少添加一条行信息');
                return;
            }
            if (!err) {
                const allData = { ...values, reviewPlanYearLineBos: lineData };
                if (buttonType === 'onlySave') {
                    tohandleSave(allData);
                } else {
                    toSaveAndSubmit(allData);
                }
            }
        });
    }

    function tohandleSave(allData) {
        reviewPlanYearAp({ ...allData, type: data.type }).then((res) => {
            if (res.success) {

            }
        })
    }

    function toSaveAndSubmit() {

    }

    function setTablelineData(tableData) {
        setlineData(tableData);
    }

    return (
        <div>
            <Spin spinning={data.spinLoading}>
                <Affix>
                    <div className={classnames(styles.fbc, styles.affixHeader)}>
                        <span>{data.title}</span>
                        {
                            data.type !== 'detail' && <div>
                                <Button className={styles.btn} onClick={handleBack}>返回</Button>
                                <Button className={styles.btn} onClick={() => handleSave('onlySave')}>暂存</Button>
                                <Button className={styles.btn} type='primary' onClick={() => handleSave('saveAndsubmit')} >提交</Button>
                            </div>
                        }
                    </div>
                </Affix>
                <BaseInfo
                    form={form}
                    userInfo={data.userInfo}
                    data={data.baseinfo}
                    type={data.type}
                    isView={data.isView}
                />
                <LineInfo
                    type={data.type}
                    isView={data.isView}
                    setlineData={setTablelineData}
                />
            </Spin>
        </div>
    )

}

export default Form.create()(Index);
