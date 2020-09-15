import { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment } from 'react';
import { Form, Col, Row, Input, Button } from 'antd';
import styles from '../index.less'
import SplitPartsTable from './SplitPartsTable';
import MaterialTable from './MaterialTable';
import TestRecordsTable from './TestRecordsTable';
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const MCDForm = forwardRef(({ form, originData }, ref) => {
    useImperativeHandle(ref, () => {

    })
    const { getFieldDecorator } = form;
    return <Fragment>
        <Form className={styles.bl}>
            <Row>
                <Col span={6}>
                    <FormItem label='物料名称' {...formLayout}>
                        {
                            getFieldDecorator('data1',{
                                rules: [{ required: true, message: '请输入物料名称'}]
                            })(<Input />)
                        }
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label='型号' {...formLayout}>
                        {
                            getFieldDecorator('creatorName', {
                                rules: [{ required: true, message: '请输入型号'}]
                            })(<Input />)
                        }
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label='长虹编码' {...formLayout}>
                        {
                            getFieldDecorator('materialCode', {
                                initialValue: originData.materialCode,
                                rules: [{ required: true}]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Col>
                <Col span={6} className={styles.fcs}>
                    <Button>批量导入</Button>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col span={12} className={styles.rl}>
                <SplitPartsTable />
            </Col>
            <Col span={12} className={styles.ll}>
                <Row>
                    <MaterialTable />
                </Row>
                <Row>
                    <TestRecordsTable />
                </Row>
            </Col>
        </Row>
    </Fragment>
})
export default create()(MCDForm)