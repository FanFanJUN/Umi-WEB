
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, Row, Input, Col, Button, Radio, message } from 'antd';
import { utils, ExtTable, AuthButton, DetailCard } from 'suid';
import classnames from 'classnames';
import { router } from 'dva';
import BaseInfo from '../../Cognizance/commons/BaseInfo';
import PlanInfo from '../../Cognizance/commons/PlanInfo';
import Distributioninfo from '../../Cognizance/commons/Distributioninfo'
import { ImplementDetailsVo } from '../../../../services/MaterialService'
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
    const ModifyinfluenceRef = useRef(null);
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
        <div>
            <DetailCard title="基本信息">
                <BaseInfo
                    editformData={editData}
                    wrappedComponentRef={BaseinfoRef}
                    isView={true}
                    isEdit={true}
                />
            </DetailCard>
            <DetailCard title="认定计划信息">
                <PlanInfo
                    editformData={editData}
                    wrappedComponentRef={ModifyinfoRef}
                    isView={true}
                    headerInfo={true}
                />
            </DetailCard>
            <DetailCard title="分配计划详情">
                <Distributioninfo
                    editformData={editData.detailsVos}
                    wrappedComponentRef={ModifyinfluenceRef}
                    isView={true}
                    isEdit={true}
                    headerInfo={true}
                />
            </DetailCard>
        </div>
    )
})
const CommonForm = create()(getpcnModifyRef)

export default CommonForm