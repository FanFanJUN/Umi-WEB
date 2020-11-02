import React, { forwardRef, useImperativeHandle, useEffect,useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input,Radio ,message} from 'antd';
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
    toexamine= () => null
},ref,) => {
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
                dataIndex: 'materielCategoryId',
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
        function handleModalVisible (flag) {
            settrust(false)
            setvisible(!!flag)
        };
        // 获取表单值
        function handleSubmit() {
            let newdata = [],cognizance;
            if (trust) {
                validateFieldsAndScroll((err, val) => {
                    if (!err) {
                        cognizance = {
                            smSupplierAuditStatus: val.smSupplierAuditStatus,
                            smSupplierAuditConfirmerID: val.smSupplierAuditConfirmerName[0].id,
                            smSupplierAuditConfirmerCode: val.smSupplierAuditConfirmerName[0].code,
                            smSupplierAuditConfirmerName: val.smSupplierAuditConfirmerName[0].userName,
                        }
                        editData.map(item => {
                            newdata.push({...item,...cognizance})
                        })
                        toexamine(newdata)
                        settrust(false)
                    }else {
                        message.error('请将审核信息填写完整！')
                        return false
                    }
                });
            }else {
                cognizance = {
                    smSupplierAuditStatus: trust ? 1 : 0,
                    smSupplierAuditConfirmerID: '',
                    smSupplierAuditConfirmerCode: '',
                    smSupplierAuditConfirmerName: '',
                }
                editData.map(item => {
                    newdata.push({...item,...cognizance})
                })
                toexamine(newdata)
                settrust(false)
            }
           
            
        }
        function ChangRadio(e) {
            if (e.target.value === 1 ) {
                settrust(true)
            }else {
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
                        <Col span={12} style={{ display: trust === false ? 'none' : 'block'}}>
                            <Item {...formLayout} label="供应商审核确认人">
                                {getFieldDecorator('smSupplierAuditConfirmerName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择供应商审核确认人',
                                        },
                                    ],
                                })(
                                    <UserSelect name="smSupplierAuditConfirmerName" style={{width:"100%",zIndex:10}}
                                        disabled={type === 'detail'}
                                        wrapperStyle={{width:800}}
                                        reader={{name:'userName',field:['code']}} 
                                        form={form}
                                        field={['smSupplierAuditConfirmerID']}
                                        placeholder="请选择供应商审核确认人"
                                    />
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
