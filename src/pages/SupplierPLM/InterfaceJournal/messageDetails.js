import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, message } from 'antd';
import { buList } from '../commonProps'
import { ComboList } from 'suid';
import { SystemdataSave, MasterdataList } from '../../../services/plmService'
import { PLMType, qualifiedList } from '../commonProps'
import { isEmpty } from '../../../utils/index'
const { create, Item } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16
    },
};
const commonFormRef = forwardRef(({
    form,
    title,
    modifydata = {},
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalVisible,
    }));
    const [visible, setvisible] = useState(false);
    useEffect(() => {
    }, []);
    function handleModalVisible(flag) {
        setvisible(!!flag)
    };
    return (
        <>
            <Modal
                visible={visible}
                title={title}
                onCancel={() => handleModalVisible(false)}
                destroyOnClose={true}
                width="60vw"
                maskClosable={false}
                footer={false}
            >
                <p>{modifydata}</p>
            </Modal>
        </>
    );
},
);

export default create()(commonFormRef);
