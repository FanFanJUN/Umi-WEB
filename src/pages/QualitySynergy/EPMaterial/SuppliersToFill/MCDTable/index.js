import { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment } from 'react';
import { Form, Col, Row, Input, Button } from 'antd';
import styles from '../index.less'
import SplitPartsTable from './SplitPartsTable';
import MaterialTable from './MaterialTable';
import TestRecordsTable from './TestRecordsTable';
import ImportModal from './importModal';
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const MCDForm = forwardRef(({ form, originData, isView }, ref) => {
    useImperativeHandle(ref, () => ({
        getSplitDataList
    }))
    const splitRef = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const [visible, setVisible] = useState(false)
    const [selectedSplitData, setSelectedSpilt] = useState({})
    const [splitDataList, setSplitDataList] = useState(originData.epDataFillSplitPartsVoList ? originData.epDataFillSplitPartsVoList : []);
    useEffect(() => {
        let dataList = originData.epDataFillSplitPartsVoList ? originData.epDataFillSplitPartsVoList.map((item, index) => ({ ...item, rowKey: index, splitPartsLineNumber: index})) : []
        setSplitDataList(dataList);
    }, [originData]);
    // 参数为某一条拆分部件数据,根据rowKey替换
    function handleSplitDataList(dataObj) {
        let newList = splitDataList.map(item => {
            return item.rowKey === dataObj.rowKey ? { ...item, ...dataObj } : item;
        })
        setSplitDataList(newList);
        splitRef.current.setRowKeys([dataObj.rowKey]);
        // console.log('splitRef', splitRef)
    }
    function getSplitDataList() {
        let backData = {}
        validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                console.log(values)
                let saveList = splitDataList.map(item => {
                    let newObj = {
                        ...item,
                        uploadAttachmentIds: item.documentInfoList ? item.documentInfoList.map(v => v.id ? v.id : v) : [],
                        testReportAttachmentId: item.documentInfoList ? item.documentInfoList.map(v => v.id ? v.id : v).join() : '',
                        epDataFillTestLogBoList: item.testLogVoList,
                        materialConstituentBoList: item.voList
                    }
                    delete newObj.testLogVoList
                    delete newObj.voList
                    return newObj;
                })
                backData = {
                    ...values,
                    tag: true,
                    epDataFillSplitPartsVoList: saveList
                }
            } else {
                backData = { tag: false }
            }
        })
        return backData;
    }
    return <Fragment>
        <Form className={styles.bl}>
            <Row>
                <Col span={6}>
                    <FormItem label='物料名称' {...formLayout}>
                        {
                            getFieldDecorator('mcdMaterialName', {
                                initialValue: originData.mcdMaterialName,
                                rules: [{ required: true, message: '请输入物料名称' }]
                            })(<Input disabled={isView} />)
                        }
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label='型号' {...formLayout}>
                        {
                            getFieldDecorator('mcdModel', {
                                initialValue: originData.mcdModel,
                                rules: [{ required: true, message: '请输入型号' }]
                            })(<Input disabled={isView} />)
                        }
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem label='长虹编码' {...formLayout}>
                        {
                            getFieldDecorator('mcdChCode', {
                                initialValue: originData.materialCode,
                                rules: [{ required: true }]
                            })(<Input disabled />)
                        }
                    </FormItem>
                </Col>
                <Col span={6} className={styles.fcs}>
                    {!isView && <Button onClick={() => { setVisible(true) }}>批量导入</Button>}
                </Col>
            </Row>
        </Form>
        <Row>
            <Col span={12} className={styles.rl}>
                <SplitPartsTable wrappedComponentRef={splitRef} dataList={splitDataList} setSelectedSpilt={setSelectedSpilt} setSplitDataList={setSplitDataList} isView={isView} />
            </Col>
            <Col span={12} className={styles.ll}>
                <Row>
                    <MaterialTable dataList={splitDataList}
                        selectedSplitData={selectedSplitData}
                        handleSplitDataList={handleSplitDataList}
                        environmentalProtectionCode={originData.environmentalProtectionCode}
                        isView={isView}
                    />
                </Row>
                <Row>
                    <TestRecordsTable
                        dataList={splitDataList}
                        selectedSplitData={selectedSplitData}
                        handleSplitDataList={handleSplitDataList}
                        environmentalProtectionCode={originData.environmentalProtectionCode}
                        isView={isView}
                    />
                </Row>
            </Col>
        </Row>
        <ImportModal visible={visible} setVisible={setVisible} />
    </Fragment>
})
export default create()(MCDForm)