
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, Row, Input, Col, Button, Radio,Modal } from 'antd';
import { utils, ExtTable, AuthButton,DetailCard } from 'suid';
import classnames from 'classnames';
import styles from '../index.less';
import BaseInfo from '../../Supplier/commons/BaseInfo';
import Modifyinfo from  '../../Supplier/commons/Modifyinfo';
import Modifyinfluence from '../../Supplier/commons/Modifyinfluence'
import ModifyinfluenceForm from '../../Supplier/commons/ModifyinfluenceForm'
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
    editData
}, ref) => {
	useImperativeHandle(ref, () => ({
		getBaseInfo,
		form
	}));
	const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
    const BaseinfoRef = useRef(null);
    const ModifyinfoRef = useRef(null);
    const ModifyinfluenceRef = useRef(null);
    const modifyinfluenceFormRef = useRef(null);
    const [selectRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [stafvisible, setStafvisible] = useState(false);
    const [informationvisib, setInformationvisib] = useState(false);
    const [showAttach, triggerShowAttach] = useState(false);
    const empty = selectRowKeys.length === 0;
	useEffect(() => {
		
    }, []);

	// 获取表单参数
	function getBaseInfo() {

	}
	return (
		<div>
			{/* <div className={classnames([styles.header, styles.flexBetweenStart])}>
                <span className={styles.title}>PCN变更信息</span>
            </div> */}

          
            <DetailCard title="基本信息">
                <BaseInfo
                    editformData={editData}
                    wrappedComponentRef={BaseinfoRef}
                    isView={true}
                    isEdit={true}
                />
            </DetailCard>
            <DetailCard title="变更信息">
                <Modifyinfo
                    editformData={editData.smPcnDetailVos}
                    wrappedComponentRef={ModifyinfoRef}
                    isView={true}
                    headerInfo={true}
                />
            </DetailCard>
            <DetailCard title="变更影响分析">
                <Modifyinfluence
                    editformData={editData.smPcnAnalysisVos}
                    wrappedComponentRef={ModifyinfluenceRef}
                    isView={true}
                    isEdit={true}
                    headerInfo={true}
                />
                <ModifyinfluenceForm
                    editformData={editData}
                    isView={true}  
                    wrappedComponentRef={modifyinfluenceFormRef}
                />
            </DetailCard>
		</div>
	)
})
const CommonForm = create()(getpcnModifyRef)

export default CommonForm