
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, message ,Spin} from 'antd';
import { utils, ExtTable, AuthButton,DetailCard } from 'suid';
import classnames from 'classnames';
import styles from '../index.less';
import BaseInfo from '../../Supplier/commons/BaseInfo';
import Modifyinfo from  '../../Supplier/commons/Modifyinfo';
import Modifyinfluence from '../../Supplier/commons/Modifyinfluence'
import PCNchangeResult from '../../Supplier/commons/PCNchangeResult'
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
    editData,
    result,
    isView
}, ref) => {
	useImperativeHandle(ref, () => ({
		getBaseInfo,
		form
	}));
	const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
    const BaseinfoRef = useRef(null);
    const ModifyinfoRef = useRef(null);
    const ModifyinfluenceRef = useRef(null);
    const getchangeResult = useRef(null)
    const [selectRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [stafvisible, setStafvisible] = useState(false);
    const [informationvisib, setInformationvisib] = useState(false);
    const [showAttach, triggerShowAttach] = useState(false);
    const [loading, triggerLoading] = useState(false);
    const empty = selectRowKeys.length === 0;
	useEffect(() => {
		
    }, []);

	// 获取表单参数
	function getBaseInfo() {
        let result = false;
        const {getResultBaseInfo} = getchangeResult.current;
        let changedata = getResultBaseInfo()
        if (changedata) {
            result = changedata
            return result
        }else {
            message.error('PCN变更结果不能为空！')
        }
	}
	return (
		<Spin spinning={loading} tip='处理中...'>
            <DetailCard title="基本信息">
                <BaseInfo
                    editformData={editData}
                    wrappedComponentRef={BaseinfoRef}
                    isView={true}
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
            </DetailCard>
            {
                result ? <DetailCard title="PCN变更结果">
                    <PCNchangeResult
                        editformData={editData}
                        wrappedComponentRef={getchangeResult}
                        isView={isView}
                    />
                </DetailCard> : null
            }
            
            
		</Spin>
	)
})
const CommonForm = create()(getpcnModifyRef)

export default CommonForm