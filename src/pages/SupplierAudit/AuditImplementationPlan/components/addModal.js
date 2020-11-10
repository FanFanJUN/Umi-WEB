// 从年度审核新增
import React, { useState, useRef } from "react";
import { Form, Row, Col, Button, Select, Spin, message } from "antd";
import { ExtTable, ExtModal, ComboList, ComboTree, } from 'suid';
import {
    reviewPlanYearConfig,
} from '../../mainData/commomService';
import { recommendUrl } from '@/utils/commonUrl';
import { openNewTab, getUserAccount } from '@/utils';
import { findRequirementLine, findYearLineLine } from "../service"

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddModal = (props) => {
    const { visible, type, handleCancel, form } = props
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const tableRef = useRef(null)
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [cascadeParams, setCascadeParams] = useState({});
    const [selectRows, setselectRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        { title: '月度审核计划号和行号', dataIndex: 'reviewPlanMonthCode', width: 140, ellipsis: true },
        { title: '审核月度', dataIndex: 'applyMonth', width: 140, ellipsis: true, render: text => text + "月" },
        { title: '需求公司', dataIndex: 'applyCorporationName', width: 140, ellipsis: true },
        { title: '采购组织', dataIndex: 'purchaseOrgName', ellipsis: true, width: 140 },
        { title: '供应商', dataIndex: 'supplierCode', ellipsis: true, width: 140 },
        { title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 140 },
        { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 140 },
        { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 140 },
        { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 140 },
    ].map(item => ({ ...item, align: 'center' }))

    const onOk = async () => {
        // if (selectRows.length === 0) {
        //     message.warning("至少选中一行！");
        //     return;
        // }
        openNewTab('supplierAudit/AuditImplementationPlan/editPage?pageState=add', '审核实施计划-新增', false);
    }

    function handleSearch() {
        form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            if (!err) {

            }
        });
    }
    return <ExtModal
        width={'80vw'}
        height={"60%"}
        maskClosable={false}
        visible={visible}
        title="从月度计划选择新增"
        onCancel={handleCancel}
        onOk={onOk}
        destroyOnClose
    >
        <Spin spinning={loading}>
            <div>
                <Row>
                    <Col span={10}>
                        <FormItem {...formItemLayoutLong} label={'月度审核计划'}>
                            <ComboList
                                allowClear
                                style={{ width: '100%' }}
                                form={form}
                                {...reviewPlanYearConfig}
                                afterSelect={(item) => {
                                    coconso.log(item)
                                }}
                            />
                        </FormItem>
                    </Col>
                    <Col span={10}></Col>
                    <Col span={4}>
                        <div style={{ textAlign: 'center' }} onClick={handleSearch}><Button type="primary">查询</Button></div>
                    </Col>
                </Row>
            </div>
            <ExtTable
                style={{ marginTop: '10px' }}
                rowKey='id'
                allowCancelSelect={true}
                showSearch={false}
                remotePaging
                checkbox={{ multiSelect: true }}
                size='small'
                onSelectRow={(key, rows) => {
                    setselectedRowKeys(key);
                    setselectRows(rows);
                }}
                cascadeParams={{
                    ...cascadeParams
                }}
                ref={tableRef}
                selectedRowKeys={selectedRowKeys}
                store={{
                    params: {
                        ...cascadeParams
                    },
                    url: `${recommendUrl}/api/reviewPlanYearService/findPageLineById`,
                    type: 'POST',
                }}
                columns={columns}
            />
        </Spin>
    </ExtModal>

}

export default Form.create()(AddModal);