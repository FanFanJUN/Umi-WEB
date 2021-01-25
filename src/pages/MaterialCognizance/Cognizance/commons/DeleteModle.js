import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input } from 'antd';
import { ComboList } from 'suid';
import { QueryMasterdata, TaskqueryMasterdata } from '../../../../services/MaterialService'
const { create, Item } = Form
const { TextArea } = Input;
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
    deletedata,
    onOk = () => null,
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalVisible,
        form
    }));
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    const [obtain, setObtain] = useState([]);
    const [stagedata, setStagedata] = useState({});
    useEffect(() => {
        handleData(deletedata)
    }, [deletedata]);

    async function handleData(data) {
        let params = data.filter(item => item.identificationStage !== '认定方案' && item.identificationStage !== '认定结果');
        setObtain(params)
    }

    function handleModalVisible(flag) {
        setvisible(!!flag)
    };

    function handleSubmit() {
        validateFieldsAndScroll((err, val) => {
            if (!err) {
                onOk(stagedata);
            }
        });
    }
    // 认定阶段
    function changevalue(val) {
        setStagedata(val)
    }
    return (
        <>
            <Modal
                visible={visible}
                title={'删除认定阶段'}
                onCancel={() => handleModalVisible(false)}
                destroyOnClose={true}
                width="40vw"
                maskClosable={false}
                onOk={handleSubmit}
            >

                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="认定阶段">
                            {
                                getFieldDecorator('identificationStage', {
                                    initialValue: '',
                                })(
                                    <ComboList
                                        style={{ width: '240px' }}
                                        dataSource={obtain}
                                        rowKey="code"
                                        afterSelect={changevalue}
                                        showSearch={false}
                                        allowClear={true}
                                        reader={{
                                            name: 'identificationStage',
                                        }}
                                    />
                                )
                            }
                        </Item>
                    </Col>
                </Row>

            </Modal>
        </>
    );
},
);

export default create()(getInformation);
