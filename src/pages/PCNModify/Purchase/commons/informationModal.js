import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, Radio, message } from 'antd';
import { SupplierToexamine } from '../../commonProps'
import { ExtTable, ComboList, AuthButton } from 'suid';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
// import TrustinforModal from './TrustinforModal'
import UserSelect from '../../UserSelect/index'
import { isEmpty } from '../../../../utils';
const { create, Item } = Form;
const formLayout = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 12
    },
};
const getInformation = forwardRef(({
    form,
    type,
    editData,
    verificationData,
    determine = () => null,
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalVisible,
        form
    }));
    const getTrustinfor = useRef(null)
    const tabformRef = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    const [trust, settrust] = useState(false);
    const [infor, setinfor] = useState(false);
    const [screen, setscreen] = useState(false);
    const [cognizance, setCognizance] = useState(true);
    useEffect(() => {
        handleCogn(editData)
        handleverification(verificationData)
    }, [editData, verificationData]);
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

    function handleCogn(val) {
        val.map(item => {
            if (!isEmpty(item.smInKindStatus)) {
                setCognizance(true)
            }
        })
    }
    function handleverification(val) {
        let handledat = [];
        if (val && editData) {
            val.map((item, index) => {
                editData.map((items, indexs) => {
                    if (item.id === items.id) {
                        val.splice(index, 1)
                    }
                    handledat = val
                })
            })
            handledat.map((items) => {
                if (items.smInKindStatus === 1) {
                    console.log(1)
                    setscreen(true)
                }
            })
        }

    }
    function handleModalVisible(flag) {
        settrust(false)
        setinfor(false)
        setscreen(false)
        setvisible(!!flag)
    };
    function handleSubmit() {
        let newdata = [], cognizance;
        validateFieldsAndScroll((err, val) => {
            if (!err) {
                if (trust) {
                    cognizance = {
                        smInKindStatus: val.smInKindStatus,
                        smInKindManId: val.smInKindManName[0].id,
                        smInKindManCode: val.smInKindManName[0].code,
                        smInKindManName: val.smInKindManName[0].userName,
                        trustOrNot: val.smInKindManName[0].trustOrNot,
                    }
                    editData.map(item => {
                        newdata.push({ ...item, ...cognizance })
                    })
                    determine(newdata)
                    settrust(false)
                } else {
                    cognizance = {
                        smInKindStatus: trust ? 1 : 0,
                        smInKindManId: '',
                        smInKindManCode: '',
                        smInKindManName: '',
                        smTrustCompanyCode: '',
                        // smTrustPurchasCode: ''
                        trustOrNot: val.trustOrNot,
                    }
                    editData.map(item => {
                        newdata.push({ ...item, ...cognizance })
                    })
                    determine(newdata)
                    settrust(false)
                    //return false
                }

            } else {
                message.error('请将信任信息填写完整！')
                return false
            }
        });
    }
    function ChangRadio(e) {
        console.log(screen)
        if (e.target.value === 1) {
            settrust(true)
        } else if (screen && e.target.value === 0) {
            setinfor(true)
            settrust(false)
        } else {
            settrust(false)
        }

    }
    // 选择信任信息
    function hanldTrustfrom(val) {
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
                    <Col span={10}>
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
                    {
                        trust ? <Col span={10}>
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
                                    <UserSelect name="smInKindManName" style={{ width: "100%", zIndex: 10 }}
                                        disabled={type === 'detail'}
                                        wrapperStyle={{ width: 950 }}
                                        reader={{ name: 'userName', field: ['code'] }}
                                        form={form}
                                        multiple={false}
                                        field={['smInKindManId']}
                                        placeholder="请选择实物认定确认人"
                                    />
                                )}
                            </Item>
                        </Col> : null
                    }

                    {!trust && infor ? <Col span={10}>
                        <Item {...formLayout} label="是否信任">
                            {
                                getFieldDecorator('trustOrNot', {
                                    initialValue: editData && editData.trustOrNot,
                                }),
                                getFieldDecorator('trustOrNotName', {
                                    initialValue: editData && editData.trustOrNotName,
                                })(
                                    <ComboList
                                        form={form}
                                        {...SupplierToexamine}
                                        showSearch={false}
                                        name={'trustOrNotName'}
                                        field={['trustOrNot']}
                                        placeholder="是否信任"
                                    />
                                )
                            }
                        </Item>
                    </Col> : null
                    }
                </Row>
            </Modal>
        </>
    );
},
);

export default create()(getInformation);
