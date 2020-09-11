

import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Form, Row, Input, Col, message, Radio } from 'antd';
import { utils, ExtTable } from 'suid';
import { router } from 'dva';
import UploadFile from '../../../components/Upload/index'
import styles from '../index.less';
import {
    findSupplierModifyHistroyList
  } from '@/services/SupplierModifyService'

const { create } = Form;
const FormItem = Form.Item;
const { storage } = utils


const formItemLayoutdetail = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
};
const HistoryfoRef = forwardRef(({
    form,
    editData,
    lineDataSource
}, ref) => {
    useImperativeHandle(ref, () => ({
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
    const [dataSource, setDataSource] = useState([]);
    const [loading, triggerLoading] = useState(false);
    useEffect(() => {
        initSupplierModifyHistroyList()
    }, []);
    // 变更列表明细
    const { query } = router.useLocation();
    async function initSupplierModifyHistroyList() {
        const { data, success, message: msg } = await findSupplierModifyHistroyList({ requestId: query.id });
        if (success) {
            setDataSource(data)
        }else {
        message.error(msg)
        }
    }
    const lineColumns = [
        { title: '操作内容', dataIndex: 'operation', align: 'center' },
        { title: '对象', dataIndex: 'target', align: 'center', },
        { title: '更改字段', dataIndex: 'changeField', width: 300, align: 'center' },
        { title: '更改前', dataIndex: 'changeBefore', width: 300, align: 'center' },
        { title: '更改后', dataIndex: 'changeLater',width: 300, },
    ].map(_ => ({ ..._, align: 'center' }))
    return (
        <div>
            <div className={styles.bgw}>
                <div className={styles.title}>变更信息</div>
                <div >
                    <Row>
                        <Col span={2} />
                        <Col span={16}>
                            <FormItem
                                {...formItemLayoutdetail}
                                label={"变更原因"}
                            >
                                <span>{editData.modifyReason || ""}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={2} />
                        <Col span={16}>
                            <FormItem
                                {...formItemLayoutdetail}
                                label={"附件"}
                            >
                                {getFieldDecorator('fileIdList', {})(
                                    <UploadFile type={'show'}
                                        entityId={editData.id} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className={styles.bgw}>

                <div className={styles.title}>变更明细</div>
                <div>
                    <ExtTable
                        columns={lineColumns}
                        showSearch={false}
                        rowKey={(item) => item.id}
                        checkbox={false}
                        allowCancelSelect={true}
                        size='small'
                        remotePaging={true}
                        ellipsis={false}
                        dataSource={dataSource}
                        //{...dataSource}
                    />
                </div>
            </div>
        </div>
    )
})
const CommonForm = create()(HistoryfoRef)

export default CommonForm