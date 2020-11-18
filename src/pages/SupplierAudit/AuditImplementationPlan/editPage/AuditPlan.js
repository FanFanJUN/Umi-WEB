/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:49:50
 * @LastEditTime: 2020-11-17 20:52:43
 * @LastEditors: Please set LastEditors
 * @Description: I审核实施计划-审核计划
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\AuditPlan.js
 */

import React, { useState, useEffect } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Row, DatePicker, Checkbox } from 'antd';
import Upload from '../../Upload';
import { getDocIdForArray } from '@/utils/utilTool';
import { reviewStandard } from "../../mainData/commomService";

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const formLongLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

const AuditPlan = (props) => {
    const { form, type, isView, originData={} } = props;
    // 数组存储的审核准则
    const [seleteList, setSelecteList] = useState([]);
    // 以code为key值存储的审核准则对象
    const [listObj, setListObj] = useState({})
    const { getFieldDecorator, setFieldsValue } = form;

    useEffect(()=>{
        reviewStandard().then(res => {
            let listObj = {};
            res.data.forEach(item => {
                listObj[item.code] = {
                    standardCode: item.code,
                    standardName: item.name,
                };
            })
            setListObj(listObj);
            setSelecteList(res.data);
            // 默认全部选中审核准则
            setFieldsValue({
                reviewPlanStandardBos: Object.values(listObj)
            })
        })
    }, [])

    const handleChange = (values) => {
        let checkList = values.map(item => {
            return listObj[item];
        })
        setFieldsValue({
            reviewPlanStandardBos: checkList
        })
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>审核计划</div>
                <div className={styles.content}>
                    <Row>
                        <Col span={12}>
                            <FormItem label="审核准则" {...formLayout}>
                                {
                                    getFieldDecorator("reviewPlanStandardBos"),
                                    getFieldDecorator("selected", {
                                        initialValue: seleteList.map(item => item.code),
                                        rules: [{ required: true, message: '至少选择一项',},]
                                    })(
                                        <Checkbox.Group style={{ width: '100%' }} style={{paddingTop: "20px"}} onChange={handleChange}>
                                            {
                                                seleteList.map(item => <Row style={{margin: "6px 0"}} key={item.code}>
                                                    <Checkbox value={item.code} key={item.code}>{item.name}</Checkbox>
                                                </Row>)
                                            }
                                        </Checkbox.Group>
                                    )
                                }

                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formLayout} label={'审核时间从'}>
                                {
                                    getFieldDecorator('reviewDateStart', {
                                        initialValue: null,
                                        rules: [{ required: true, message: '审核时间不能为空',},]
                                    })(
                                        <DatePicker placeholder="请选择" style={{width: "100%"}} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formLayout} label={'审核时间到'}>
                                {
                                    getFieldDecorator('reviewDateEnd', {
                                        initialValue: null,
                                        rules: [{ required: true, message: '审核时间不能为空',},]
                                    })(
                                        <DatePicker placeholder="请选择" style={{width: "100%"}}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formLongLayout} label={'详细计划附件'}>
                                {
                                    getFieldDecorator('reviewPlanFileId', {
                                        initialValue: type === 'add' ? '' : getDocIdForArray(originData.fileList),
                                        rules: [{ required: true, message: '详细计划附件不能为空',},]
                                    })(
                                        <Upload
                                            entityId={type === 'add' ? null : originData.fileList}
                                            type={isView ? 'show' : ''}
                                            showColor={isView ? true : false}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default AuditPlan;