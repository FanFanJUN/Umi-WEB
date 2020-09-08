import { useEffect, useState, forwardRef, useImperativeHandle, Fragment } from 'react'
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';

const { Item: FormItem } = Form;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

export default function() {
    return <Fragment>
        <Form>
            <Row>
                <Col span={12}>
                    <FormItem label='物料代码' {...formLayout}>
                        <Input disabled />
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label='物料描述' {...formLayout}>
                        <Input disabled />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem label=' 物料组代码' {...formLayout}>
                        <Input disabled />
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label='物料组描述' {...formLayout}>
                        <Input disabled />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem label='环保标准' {...formLayout}>
                        <Input disabled />
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label='战略采购' {...formLayout}>
                        <Input disabled />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem label='环保管理人员' {...formLayout}>
                        <Input disabled />
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </Fragment>
}