import React, { forwardRef, useImperativeHandle, useEffect,useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input,Radio } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ExtTable, ComboList,AuthButton } from 'suid';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import TrustinforModal from './TrustinforModal'
import UserSelect from '../../UserSelect/index'
const { create, Item } = Form;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16
    },
};
const getInformation = forwardRef(({
    form,
    type,
    editData,
    determine = () => null,
},ref,) => {
        useImperativeHandle(ref, () => ({ 
            handleModalVisible,
            form 
        }));
        const getTrustinfor = useRef(null)
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
            setvisible(!!flag)
        };
        function handleSubmit() {
            let newdata = [],cognizance;
            if (trust) {
                validateFieldsAndScroll((err, val) => {
                    if (!err) {
                        cognizance = {
                            smInKindStatus: val.smInKindStatus,
                            smInKindManId: val.smInKindManName[0].id,
                            smInKindManCode: val.smInKindManName[0].code,
                            smInKindManName: val.smInKindManName[0].userName,
                            smTrustCompanyCode: val.smTrustCompanyCode,
                            smTrustPurchasCode: val.smTrustPurchasCode
                        }
                    }
                });
            }else {
                cognizance = {
                    smInKindStatus: trust ? 1 : 0,
                }
            }
            editData.map(item => {
                newdata.push({...item,...cognizance})
            })
            determine(newdata)
        }
        function showtrustModal() {
            getTrustinfor.current.handleModalVisible(true)
        }
        function ChangRadio(e) {
            if (e.target.value === 1) {
                settrust(true)
            }else {
                settrust(false)
            }
            
        }
        // 选择信任信息
        function hanldTrustfrom(val) {
            console.log(val)
            form.setFieldsValue({
                'smTrustCompanyCode': val.companyCode,
                'smTrustPurchasCode': val.purchaseOrgCode
            });
            getTrustinfor.current.handleModalVisible(false)
        }
        return (
            <>
                <Modal
                    visible={visible}
                    title={'编辑认定信息'}
                    onCancel={() => handleModalVisible(false)}
                    destroyOnClose={true}
                    width="80vw"
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
                            <Item {...formLayout} label="是否实物认定">
                                {getFieldDecorator('smInKindStatus', {
                                    initialValue: editData && editData.smInKindStatus,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选采购组织代码',
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
                    <Row style={{ display: trust === false ? 'none' : 'block'}}>
                        <Col span={12} push={2}>
                            <AuthButton type="primary" onClick={() => showtrustModal()}>选择信任信息</AuthButton>  
                        </Col>
                    </Row>
                    <Row style={{ display: trust === false ? 'none' : 'block'}}>
                        <Col span={10}>
                            <Item {...formLayout} label="信任公司">
                                {getFieldDecorator('smTrustCompanyCode', {
                                    initialValue: editData && editData.smTrustCompanyCode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选采购组织代码',
                                        },
                                    ],
                                })(
                                    <Input disabled />
                                )}
                            </Item>
                        </Col>
                        <Col span={10}>
                            <Item {...formLayout} label="信任采购组织">
                                {getFieldDecorator('smTrustPurchasCode', {
                                    initialValue: editData && editData.smTrustPurchasCode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选采购组织代码',
                                        },
                                    ],
                                })(
                                    <Input disabled />
                                )}
                            </Item>
                        </Col>
                    </Row>
                    <Row style={{ display: trust === false ? 'none' : 'block'}}>
                        <Col span={10}>
                            <Item {...formLayout} label="实物认定确认人">
                                {getFieldDecorator('smInKindManName', {
                                    initialValue: editData && editData.smInKindManName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择实物认定确认人',
                                        },
                                    ],
                                })(
                                    <UserSelect name="smInKindManName" style={{width:"100%",zIndex:10}}
                                        disabled={type === 'detail'}
                                        wrapperStyle={{width:950}}
                                        reader={{name:'userName',field:['code']}} 
                                        form={form}
                                        multiple={false}
                                        field={['smInKindManId']}
                                        placeholder="请选择实物认定确认人"
                                    />
                                )}
                            </Item>
                        </Col>
                    </Row>
                </Modal>
                <TrustinforModal
                    editData={editData}
                    hanldTrust={hanldTrustfrom}
                    wrappedComponentRef={getTrustinfor}
                />
            </>
        );
    },
);

export default create()(getInformation);
