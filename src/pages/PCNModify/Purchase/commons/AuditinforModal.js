import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, Radio, message } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ExtTable } from 'suid';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import UserSelect from '../../UserSelect/index'
const { create, Item } = Form;
const formLayout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14
    },
};

const getauditinfor = forwardRef(({
    form,
    editData,
    type,
    toexamine = () => null
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalVisible,
        form
    }));
    const tabformRef = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    const [trust, settrust] = useState(false);
    useEffect(() => {

    }, []);
    const columns = [
        {
            title: '物料分类',
            dataIndex: 'materielCategoryName',
            align: 'center',
            width: 160
        },
        {
            title: '公司代码',
            dataIndex: 'companyCode',
            align: 'center',
            width: 180,
        },
        {
            title: '公司名称',
            dataIndex: 'companyName',
            align: 'center',
            width: 220
        },
        {
            title: '采购组织代码',
            dataIndex: 'purchaseOrgCode',
            align: 'center',
            width: 180,
        },
        {
            title: '采购组织名称',
            dataIndex: 'purchaseOrgName',
            align: 'center',
            width: 160
        },
        {
            title: '是否安规件',
            dataIndex: 'smPcnPart',
            align: 'center',
            width: 180,
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>否</div>;
                } else if (text === 1) {
                    return <div className="doingColor">是</div>;
                }
            },
        },
    ]
    function handleModalVisible(flag) {
        settrust(false)
        setvisible(!!flag)
    };
    // 获取表单值
    function handleSubmit() {
        let newdata = [], cognizance;
        validateFieldsAndScroll((err, val) => {
            if (!err) {
                cognizance = {
                    smSupplierAuditStatus: val.smSupplierAuditStatus,
                }
                editData.map(item => {
                    newdata.push({ ...item, ...cognizance })
                })
                toexamine(newdata)
                settrust(false)
            } else {
                message.error('请将审核信息填写完整！')
                return false
            }
        });
    }
    function ChangRadio(e) {
        if (e.target.value === 1) {
            settrust(true)
        } else {
            settrust(false)
        }

    }
    return (
        <>
            <Modal
                visible={visible}
                title={'编辑审核信息'}
                onCancel={() => handleModalVisible(false)}
                destroyOnClose={true}
                width="60vw"
                maskClosable={false}
                onOk={handleSubmit}
            >
                <AutoSizeLayout>
                    {
                        (height) => <ExtTable
                            columns={columns}
                            showSearch={false}
                            ref={tabformRef}
                            rowKey={(item) => item.id}
                            checkbox={false}
                            pagination={{
                                hideOnSinglePage: true,
                                disabled: false,
                                pageSize: 100,
                            }}
                            allowCancelSelect={true}
                            size='small'
                            height={height}
                            remotePaging={true}
                            ellipsis={false}
                            saveData={false}
                            // onSelectRow={PurSelectedRows}
                            // selectedRowKeys={selectedStaffKeys}
                            dataSource={editData}
                        />
                    }
                </AutoSizeLayout>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="是否供应商审核">
                            {getFieldDecorator('smSupplierAuditStatus', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择是否供应商审核',
                                    },
                                ],
                            })(
                                <Radio.Group onChange={(value) => ChangRadio(value)}>
                                    <Radio value={0}>否</Radio>
                                    <Radio value={1}>是</Radio>
                                </Radio.Group>
                            )}
                        </Item>
                    </Col>
                </Row>
            </Modal>
        </>
    );
},
);

export default create()(getauditinfor);
