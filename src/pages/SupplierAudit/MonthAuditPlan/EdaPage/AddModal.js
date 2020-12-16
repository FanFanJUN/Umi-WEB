// 从年度审核新增
import React, { useState, useRef } from "react";
import { Form, Row, Col, Button, DatePicker, Spin, message } from "antd";
import { ExtTable, ExtModal, ComboList, ComboTree, } from 'suid';
import moment from "moment";
import {
    reviewPlanYearConfig,
    AllCompanyConfig,
    AllFindByFiltersConfig,
    materialCodeProps,
    reviewRequirementConfig
} from '../../mainData/commomService';
import { recommendUrl } from '@/utils/commonUrl';
import { findRequirementLine, findYearLineLine, findAccessLineLine, findRecommendAccessByDataAuth } from "../service"

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddModal = (props) => {
    const { visible, type, handleCancel, handleOk, form } = props
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const tableRef = useRef(null)
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [cascadeParams, setCascadeParams] = useState({});
    const [selectRows, setselectRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTear, setSelectedYear] = useState("");

    const getColums = () => {
        switch (type) {
            case "annual":
                return [
                    {
                        title: '预计审核月度', dataIndex: 'reviewMonth', ellipsis: true, width: 140, render: (text) => {
                            return text ? text.slice(0, 7) : ""
                        }
                    },
                    {
                        title: '需求公司', dataIndex: 'applyCorporationName', width: 180, ellipsis: true, render: (text, item) => {
                            return !text ? '' : item.applyCorporationCode + ' ' + item.applyCorporationName
                        }
                    },
                    {
                        title: '采购组织', dataIndex: 'purchaseTeamName', ellipsis: true, width: 180, render: (text, item) => {
                            return !text ? '' : item.purchaseTeamCode + ' ' + item.purchaseTeamName
                        }
                    },
                    {
                        title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 180, render: (text, item) => {
                            return !text ? '' : item.supplierCode + ' ' + item.supplierName
                        }
                    },
                    {
                        title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 160, render: (text, item) => {
                            return !text ? '' : item.agentCode + ' ' + item.agentName
                        }
                    },
                    {
                        title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 180, render: (text, item) => {
                            return !text ? '' : item.materialGroupCode + ' ' + item.materialGroupName
                        }
                    },
                ];
            case "recommand":
                return [
                    { title: '准入推荐号', dataIndex: 'docNumber', ellipsis: true, width: 140 },
                    {
                        title: '需求公司', dataIndex: 'corporationName', width: 200, ellipsis: true, render: (text, item) => {
                            return !text ? '' : item.corporationCode + ' ' + item.corporationName
                        }
                    },
                    {
                        title: '采购组织', dataIndex: 'purchaseOrgName', ellipsis: true, width: 180, render: (text, item) => {
                            return !text ? '' : item.purchaseOrgCode + ' ' + item.purchaseOrgName
                        }
                    },
                    {
                        title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 180, render: (text, item) => {
                            return item.recommendAccess && (item.recommendAccess.supplierCode ? (item.recommendAccess.supplierCode + ' ' + item.recommendAccess.supplierName) : item.recommendAccess.supplierName);
                        }
                    },
                    {
                        title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 180, render: (text, item) => {
                            return item.recommendAccess && item.recommendAccess.originName && (item.recommendAccess.originCode + ' ' + item.recommendAccess.originName);
                        }
                    },
                    {
                        title: '物料分类', dataIndex: 'materialCategoryName', ellipsis: true, width: 180, render: (text, item) => {
                            return item.recommendAccess && item.recommendAccess.materialCategoryCode + ' ' + item.recommendAccess.materialCategoryName;
                        }
                    },
                ];
            case "demand":
                return [
                    {
                        title: '提出日期', dataIndex: 'applyDate', ellipsis: true, width: 120, render: (text, item) => {
                            return item.reviewRequirementVo && item.reviewRequirementVo.applyDate && item.reviewRequirementVo.applyDate.slice(0, 10)
                        }
                    },
                    { title: '审核需求号', dataIndex: 'reviewRequirementCode', ellipsis: true, width: 140 },
                    {
                        title: '需求公司', dataIndex: 'corporation', width: 180, ellipsis: true, render: (text, item) => {
                            return item.reviewRequirementVo && item.reviewRequirementVo.applyCorporationCode + ' ' + item.reviewRequirementVo.applyCorporationName
                        }
                    },
                    {
                        title: '采购组织', dataIndex: 'purchaseOrgName', ellipsis: true, width: 180, render: (text, item) => {
                            return item.reviewRequirementVo && item.reviewRequirementVo.purchaseOrgCode + ' ' + item.reviewRequirementVo.purchaseOrgName
                        }
                    },
                    {
                        title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 180, render: (text, item) => {
                            return !text ? '' : item.supplierCode + ' ' + item.supplierName
                        }
                    },
                    {
                        title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 140, render: (text, item) => {
                            return !text ? '' : item.agentCode + ' ' + item.agentName
                        }
                    },
                    {
                        title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 140, render: (text, item) => {
                            return !text ? '' : item.materialGroupCode + ' ' + item.materialGroupName
                        }
                    }
                ];
        }
    }

    const getStore = () => {
        if (type === "annual") {
            return {
                params: {
                    ...cascadeParams
                },
                url: `${recommendUrl}/api/reviewPlanYearService/findPageLineById`,
                type: 'POST',
            }
        } else if (type === "demand") {
            return {
                params: {
                    usedType: 2,
                    ...cascadeParams
                },
                url: `${recommendUrl}/api/reviewRequirementLineService/findForList`,
                type: 'POST',
            }
        } else {
            return {
                params: {
                    filters: [{
                        "fieldName": "recommendAccessId",
                        "value": getFieldValue('recommendAccessId'),
                        "operator": "EQ",
                        "fieldType": "string"
                    }],
                    ...cascadeParams
                },
                url: `${recommendUrl}/api/recommendAccessService/findRecommendAccessLineWithAuthByPage`,
                type: 'POST',
            }
        }
    }
    const onOk = async () => {
        if (selectRows.length === 0) {
            message.warning("至少选中一行！");
            return;
        }
        let res = {};
        setLoading(true);
        if (type === "demand") {
            res = await findRequirementLine({
                ids: selectedRowKeys.join()
            })
        } else if (type === "annual") {
            res = await findYearLineLine({
                ids: selectedRowKeys.join()
            })
        } else {
            res = await findAccessLineLine({
                ids: selectedRowKeys.join()
            })
        }
        setLoading(false);
        if (res.success) {
            handleOk(res.data);
        } else {
            message.error(res.message);
        }

    }

    function handleSearch() {
        form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            if (!err) {
                if (type === "demand") {
                    delete values.applyCorporationId;
                    delete values.applyCorporationName;
                    delete values.materialSecondClassifyName;
                    delete values.purchaseOrgId;
                    delete values.purchaseOrgName;
                } else if (type === "annual") {
                    delete values.reviewPlanYearName
                    delete values.reviewPlanYearCode
                    if (values.reviewMonth) {
                        values.reviewMonthStart = moment(values.reviewMonth).startOf('month').format('YYYY-MM-DD') + " 00:00:00";
                        values.reviewMonthEnd = moment(values.reviewMonth).endOf('month').format("YYYY-MM-DD") + " 23:59:59";
                        delete values.reviewMonth;
                    }
                } else {
                    delete values.businessCode;
                }
                setCascadeParams(values);
            }
        });
    }

    function renderForm() {
        if (type === "annual") {
            return <Form>
                <Row>
                    <Col span={10}>
                        <FormItem {...formItemLayoutLong} label={'年度审核计划'}>
                            {
                                getFieldDecorator('id'),
                                getFieldDecorator('reviewPlanYearCode'),
                                getFieldDecorator('reviewPlanYearName', {
                                    rules: [{ required: true, message: '请选择', },]
                                })(
                                    <ComboList
                                        allowClear
                                        style={{ width: '100%' }}
                                        form={form}
                                        name={'reviewPlanYearName'}
                                        field={['reviewPlanYearCode', 'id']}
                                        {...reviewPlanYearConfig}
                                        afterSelect={(item) => {
                                            if (item.applyYear) {
                                                setSelectedYear(item.applyYear)
                                            }
                                        }}
                                    />,
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem {...formItemLayoutLong} label={'预计审核月度'}>
                            {
                                getFieldDecorator('reviewMonth')(
                                    <MonthPicker placeholder="选择月度" style={{ width: "100%" }} />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <div style={{ textAlign: 'center' }} onClick={handleSearch}><Button type="primary">查询</Button></div>
                    </Col>
                </Row>
            </Form>
        } else if (type === "recommand") {
            return <Form>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayoutLong} label={'准入推荐号'}>
                            {
                                getFieldDecorator('recommendAccessId'),
                                getFieldDecorator('businessCode')(
                                    <ComboList
                                        allowClear
                                        style={{ width: '100%' }}
                                        form={form}
                                        name={'businessCode'}
                                        field={['recommendAccessId']}
                                        {...findRecommendAccessByDataAuth}
                                    />,
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={12} style={{ textAlign: 'center' }} onClick={handleSearch}><Button type="primary">查询</Button></Col>
                </Row>
            </Form>
        } else if (type === "demand") {
            return (
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'审核需求号'}>
                                {
                                    getFieldDecorator('reviewRequirementCode')(
                                        <ComboList
                                            allowClear
                                            style={{ width: '100%' }}
                                            form={form}
                                            name='reviewRequirementCode'
                                            {...reviewRequirementConfig}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'需求公司'}>
                                {
                                    getFieldDecorator('applyCorporationId'),
                                    getFieldDecorator('applyCorporationCode'),
                                    getFieldDecorator('applyCorporationName')(
                                        <ComboList
                                            allowClear={true}
                                            style={{ width: '100%' }}
                                            form={form}
                                            name={'applyCorporationName'}
                                            field={['applyCorporationCode', 'applyCorporationId']}
                                            {...AllCompanyConfig}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'物料分类'}>
                                {
                                    getFieldDecorator('materialSecondClassifyCode'),
                                    getFieldDecorator('materialSecondClassifyName')(
                                        <ComboTree
                                            allowClear
                                            form={form}
                                            name='materialSecondClassifyName'
                                            field={['materialSecondClassifyCode']}
                                            {...materialCodeProps}
                                        />,
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayoutLong} label={'采购组织'}>
                                {
                                    getFieldDecorator('purchaseOrgCode'),
                                    getFieldDecorator('purchaseOrgId'),
                                    getFieldDecorator('purchaseOrgName')(
                                        <ComboList
                                            allowClear={true}
                                            style={{ width: '100%' }}
                                            form={form}
                                            name={'purchaseOrgName'}
                                            field={['purchaseOrgCode', 'purchaseOrgId']}
                                            {...AllFindByFiltersConfig}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'center' }} onClick={handleSearch}><Button type="primary">查询</Button></div>
                </Form>
            );
        } else {
            return ""
        }

    }

    return <ExtModal
        width={'80vw'}
        maskClosable={false}
        visible={visible}
        title={type === "annual" ? "从年度计划新增" : type === "recommand" ? "从准入推荐新增" : "从审核需求新增"}
        onCancel={handleCancel}
        onOk={onOk}
        destroyOnClose
    >
        <Spin spinning={loading}>
            <div>{renderForm()}</div>
            <ExtTable
                style={{ marginTop: '10px' }}
                rowKey='id'
                allowCancelSelect={true}
                showSearch={false}
                remotePaging
                height={type === "demand" ? "40vh" : "50vh"}
                checkbox={{ multiSelect: true }}
                onSelectRow={(key, rows) => {
                    setselectedRowKeys(key);
                    setselectRows(rows);
                }}
                cascadeParams={{
                    ...cascadeParams
                }}
                ref={tableRef}
                selectedRowKeys={selectedRowKeys}
                store={getStore()}
                columns={getColums()}
            />
        </Spin>
    </ExtModal>

}

export default Form.create()(AddModal);
