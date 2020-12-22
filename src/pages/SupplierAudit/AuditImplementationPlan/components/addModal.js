// 从年度审核新增
import React, { useState, useRef } from "react";
import { Form, Row, Col, Button, Spin, message } from "antd";
import { ExtTable, ExtModal, ComboList } from 'suid';
import {
    reviewPlanMonthConfig,
} from '../../mainData/commomService';
import { recommendUrl } from '@/utils/commonUrl';
import { openNewTab, getUserAccount } from '@/utils';

const FormItem = Form.Item;
const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddModal = (props) => {
    const { visible, type, handleCancel, form } = props
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const tableRef = useRef(null);
    const [selectRows, setselectRows] = useState([]);
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [cascadeParams, setCascadeParams] = useState({});
    const [applyMonth, setApplayMonth] = useState('');

    const columns = [
        { title: '月度审核计划号和行号', dataIndex: 'reviewPlanMonthCode', width: 200, ellipsis: true, render: (text, item) => text + ' ' + item.reviewPlanMonthLinenum},
        { title: '审核月度', dataIndex: 'applyMonth', width: 100, ellipsis: true, render: () => applyMonth ? applyMonth.slice(0, 7) : 0 },
        {
            title: '需求公司', dataIndex: 'applyCorporationName', width: 220, ellipsis: true,
            render: (v, record) => `${record.applyCorporationCode ? record.applyCorporationCode : ''} ${v ? v : ''}`,
        },
        {
            title: '采购组织', dataIndex: 'purchaseTeamName', ellipsis: true, width: 200,
            render: (v, record) => `${record.purchaseTeamCode ? record.purchaseTeamCode : ''} ${v ? v : ''}`,
        },
        {
            title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 200,
            render: (v, record) => `${record.supplierCode ? record.supplierCode : ''} ${v ? v : ''}`,
        },
        {
            title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 140,
            render: (v, record) => `${record.agentCode ? record.agentCode : ''} ${v ? v : ''}`,
        },
        {
            title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 140,
            render: (v, record) => `${record.applyCorporationCode ? record.materialGroupCode : ''} ${v ? v : ''}`,
        },
        { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 140 },
        { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 140 },
    ].map(item => ({ ...item, align: 'center' }))

    const onOk = async () => {
        if (selectRows.length === 0) {
            message.warning("至少选中一行！");
            return;
        } else if (selectRows.length > 1) {
            // 多选时满足-选中行的供应商、代理商、审核方式、审核体系、审核小组组长相同
            const { supplierCode, agentName, reviewWayCode, leaderEmployeeNo, allReviewEvlSystemId } = selectRows[0];
            let tag = selectRows.every(item => {
                return (item.supplierCode == supplierCode &&
                    item.agentName == agentName &&
                    item.reviewWayCode == reviewWayCode &&
                    item.leaderEmployeeNo == leaderEmployeeNo &&
                    item.allReviewEvlSystemId == allReviewEvlSystemId)
            })
            if (!tag) {
                message.error("选中行的供应商、代理商、审核方式、审核体系、审核小组组长不相同!请重新选择");
                return;
            }
        }
        sessionStorage.setItem('selectedMonthLIne', JSON.stringify(selectRows));
        handleCancel();
        openNewTab(`supplierAudit/AuditImplementationPlan/editPage?pageState=add&ids=${selectedRowKeys.join()}`, '新增审核实施计划', false);
    }

    function handleSearch() {
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                tableRef.current.manualSelectedRows();
                tableRef.current.remoteDataRefresh();
            }
        });
    }
    return <ExtModal
        width={'90vw'}
        centered
        maskClosable={false}
        visible={visible}
        title="从月度计划选择新增"
        onCancel={handleCancel}
        onOk={onOk}
        destroyOnClose
    >
        <div>
            <Row>
                <Col span={10}>
                    <FormItem {...formItemLayoutLong} label={'月度审核计划'}>
                        {
                            getFieldDecorator('reviewPlanMonthCode'),
                            getFieldDecorator('reviewPlanMonthName', {
                                rules: [{ required: true, message: '请选择月度审核计划', },]
                            })(<ComboList
                                allowClear
                                style={{ width: '100%' }}
                                form={form}
                                name={'reviewPlanMonthName'}
                                field={['reviewPlanMonthCode']}
                                afterSelect={(item) => {
                                    setCascadeParams({
                                        reviewPlanMonthCode: item.reviewPlanMonthCode
                                    })
                                    setApplayMonth(item.applyMonth)
                                }}
                                {...reviewPlanMonthConfig}
                            />)
                        }
                    </FormItem>
                </Col>
                <Col span={4}>
                    <div style={{ textAlign: 'center', marginTop: '3px' }} onClick={handleSearch}><Button type="primary">查询</Button></div>
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
            height='50vh'
            onSelectRow={(key, rows) => {
                setselectedRowKeys(key);
                setselectRows(rows);
            }}
            ref={tableRef}
            selectedRowKeys={selectedRowKeys}
            store={{
                params: {
                    ...cascadeParams
                },
                url: `${recommendUrl}/api/reviewPlanMonthLineService/findMonthLineByLeaderEmployeeNoAndId`,
                type: 'POST',
            }}
            columns={columns}
        />
    </ExtModal>

}

export default Form.create()(AddModal);