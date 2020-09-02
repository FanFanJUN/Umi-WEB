import { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment } from 'react';
import { Form, Col, Row, Input, Button } from 'antd';
import styles from '../index.less'
import SplitPartsTable from './SplitPartsTable'
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const MCDForm = forwardRef(({ form }, ref) => {
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
                                rules: [{ required: true}]
                            })(<Input />)
                        }
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label='型号' {...formLayout}>
                        {
                            getFieldDecorator('creatorName', {
                                rules: [{ required: true}]
                            })(<Input />)
                        }
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label='长虹编码' {...formLayout}>
                        {
                            getFieldDecorator('creatorName', {
                                initialValue: '',
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
            <Col span={12}>
                <SplitPartsTable />
            </Col>
            <Col span={12}></Col>
        </Row>
    </Fragment>
})
export default create()(MCDForm)