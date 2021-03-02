import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Col, Checkbox } from 'antd';
import { QueryMasterdata, TaskqueryMasterdata } from '../../../../services/MaterialService'
const { Item, create } = Form;
const formLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}
const HeadFormRef = forwardRef(({
    form,
    isView,
    editformData,
}, ref) => {
    useImperativeHandle(ref, () => ({
        form,
        cognizanceInfo
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [handlestage, setHandlestage] = useState([]);
    const [isshow, setIsshow] = useState(false);
    const [cognizance, setCognizance] = useState([]);
    useEffect(() => {
        handleCheck(editformData)
        handleStage()
    }, [editformData])
    // 表单
    function cognizanceInfo() {
        let stageData = {};
        if (cognizance.length === 0) {
            stageData = []
        } else {
            stageData = cognizance
        }
        return stageData
    }
    // 实物认定主数据
    async function handleStage() {
        let params = {}, newsdata = [];
        const { data, success, message: msg } = await QueryMasterdata(params);
        if (success) {
            let removal = data.rows.filter(item => item.identificationStage !== '认定方案' && item.identificationStage !== '认定结果');
            removal.map((item, index) => {
                newsdata.push({
                    key: index,
                    label: item.identificationStage,
                    value: item.stageCode,
                })
            })
            setHandlestage(newsdata)
        }
    }
    // 是否勾选
    function handleCheck(val) {
        if (val.identificationStageName === '认定方案' && val.identificationStageCode === '04') {
            setIsshow(false)
        } else {
            setIsshow(true)
        }
        console.log(val)
    }
    function onChange(val) {
        setCognizance(val)
    }
    return (
        <div >
            <Row>
                <Col span={9}>
                    <Item label='认定阶段' {...formLayout}>
                        {
                            getFieldDecorator('recommendReasons', {
                            })(
                                <Checkbox.Group options={handlestage} onChange={onChange}
                                    disabled={isshow}
                                />
                            )
                        }
                    </Item>
                </Col>
            </Row>
        </div>
    )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm