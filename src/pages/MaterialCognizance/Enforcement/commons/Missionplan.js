
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, Row, Input, Col, Button, Radio, message } from 'antd';
import { utils, ExtTable, AuthButton, DetailCard } from 'suid';
import classnames from 'classnames';
import { router } from 'dva';
import BaseInfo from '../../Cognizance/commons/BaseInfo';
import PlanInfo from '../../Cognizance/commons/PlanInfo';
import DetailsFrom from '../../Cognizance/commons/DetailsFrom'
import { ImplementDetailsVo } from '../../../../services/MaterialService'
import styles from '../index.less';
const { create } = Form;
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 21
    },
};
const { storage } = utils
const getpcnModifyRef = forwardRef(({
    form,
}, ref) => {
    useImperativeHandle(ref, () => ({
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
    const BaseinfoRef = useRef(null);
    const ModifyinfoRef = useRef(null);
    const DistributionRef = useRef(null);
    const { query } = router.useLocation();
    const [editData, setEditData] = useState([]);
    useEffect(() => {
        plandetails()
    }, []);
    // 详情
    async function plandetails() {
        let id = query.id;
        const { data, success, message: msg } = await ImplementDetailsVo({ implementationId: id });
        if (success) {
            setEditData(data)
            return
        }
        message.error(msg)
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.pcntitle}>基本信息</div>
                <div >
                    <BaseInfo
                        editformData={editData}
                        wrappedComponentRef={BaseinfoRef}
                        isView={true}
                        isEdit={true}
                    />
                </div>
            </div>
            <div className={styles.bgw}>
                <div className={styles.pcntitle}>认定计划信息</div>
                <div >
                    <PlanInfo
                        editformData={editData}
                        wrappedComponentRef={ModifyinfoRef}
                        isView={true}
                        headerInfo={true}
                        isEdit={true}
                    />
                </div>
            </div>
            <div className={styles.bgw}>
                <div className={styles.pcntitle}>认定明细</div>
                <div >
                    <DetailsFrom
                        editformData={editData.detailsVos}
                        wrappedComponentRef={DistributionRef}
                        isEdit={true}
                        headerInfo={true}
                        isView={true}
                    />
                </div>
            </div>
        </div>
    )
})
const CommonForm = create()(getpcnModifyRef)

export default CommonForm