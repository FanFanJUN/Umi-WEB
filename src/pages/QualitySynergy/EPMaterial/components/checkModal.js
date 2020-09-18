import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, message, ComboList } from 'suid';
import { Button, Input, Form, Modal, Radio } from 'antd'
import { recommendUrl } from '@/utils/commonUrl';
import { checkReview } from '../../../../services/qualitySynergy';
import { values } from 'lodash';
const { create, Item: FormItem } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const checkModal = forwardRef(({ form, selectedRow = {}, checkModalType }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [checkVisible, setCheckVisible] = useState(false);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const columns = [
        {
            title: '提交状态', dataIndex: 'submitStatus', width: 70, align: 'center', render: (text) => {
                switch (text) {
                    case "SUBMITTED": return '已提交';
                    case "NOTSUBMITTED": return '未提交';
                    default: return '';
                }
            }
        },
        {
            title: '符合性检查', dataIndex: 'compliance', ellipsis: true, align: 'center', render: (text) => {
                switch (text) {
                    case "FIT": return '符合';
                    case "NOTFIT": return '不符合';
                    case "NOTCOMPLETED": return '复核不符合';
                    default: return '';
                }
            }
        },
        {
            title: '复核状态', dataIndex: 'reviewResults', ellipsis: true, align: 'center', render: (text) => {
                switch (text) {
                    case "NOPASS": return '复核不通过';
                    case "PASS": return '复核通过';
                    default: return '';
                }
            }
        },
        { title: '复核意见', dataIndex: 'reviewResultComments', ellipsis: true, align: 'center', },
        {
            title: '环保资料是否有效', dataIndex: 'effective', ellipsis: true, width: 140, align: 'center', render: (text) => {
                switch (text) {
                    case "INVALID": return '无效';
                    case "VALID": return '有效';
                    default: return '';
                }
            }
        },
        { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, align: 'center', },
        { title: '供应商名称 ', dataIndex: 'supplierName', ellipsis: true, align: 'center', },
        { title: '填报编号', dataIndex: 'fillNumber', ellipsis: true, align: 'center', },
        { title: '有效开始日期', dataIndex: 'effectiveStartDate', ellipsis: true, align: 'center', },
        { title: '有效截止日期', dataIndex: 'effectiveEndDate', ellipsis: true, align: 'center', },
        { title: '分配批次', dataIndex: 'batch', ellipsis: true, align: 'center', },
    ];
    // 复核确定/生成
    function handleOk() {
        if (checkModalType !== 'check') {
            // 处理生成报表
        } else {
            validateFields((err, fieldsValue) => {
                if (!err) {
                    let dataList = selectedRows.map(item => {
                        return {
                            id: item.id,
                            ...fieldsValue
                        }
                    })
                    checkReview(dataList).then(res => {
                        setCheckVisible(false);
                        if (res.statusCode === 200) {
                            message.success('操作成功');
                            tableRef.current.manualSelectedRows();
                            tableRef.current.remoteDataRefresh();
                        } else {
                            message.error(res.message);
                        }
                    })
                }
            })
        }
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    function checkOneSelect() {
        if (selectedRows.length === 0) {
            message.warning('至少选中一条数据');
            return false;
        }
        return true;
    }
    return <Fragment>
        <ExtModal
            destroyOnClose
            cancelText="退出"
            onCancel={() => { tableRef.current.manualSelectedRows(); setVisible(false); }}
            onOk={() => { checkOneSelect() && setCheckVisible(true) }}
            okText={checkModalType === 'check' ? "复核" : "生成"}
            maskClosable={false}
            visible={visible}
            centered
            width={1100}
            title={checkModalType === 'check' ? "抽检复核" : "生成报表"}
        >
            <ExtTable
                columns={columns}
                bordered
                allowCancelSelect
                showSearch={true}
                remotePaging
                checkbox={{ multiSelect: checkModalType==='check' }}
                ref={tableRef}
                rowKey={(item) => item.id}
                size='small'
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                store={{
                    url: `${recommendUrl}/api/epDataFillService/findPageByCode`,
                    params: {
                        // materialCode: selectedRow.materialCode
                        materialCode: '810045822'
                    },
                    type: 'POST'
                }}
            />
        </ExtModal>
        {checkVisible && <ExtModal
            destroyOnClose
            cancelText="退出"
            onCancel={() => { setCheckVisible(false); }}
            onOk={() => { handleOk() }}
            maskClosable={false}
            okText="复核"
            visible={checkVisible}
            centered
            zIndex={1100}
            width={600}
            title="复核"
        >
            <Form>
                <FormItem label='复核结果' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                    {
                        getFieldDecorator('reviewResults', {
                            initialValue: 'PASS',
                        })(
                            <Radio.Group>
                                <Radio value="PASS">通过</Radio>
                                <Radio value="NOPASS">不通过</Radio>
                            </Radio.Group>
                        )
                    }
                </FormItem>
                <FormItem label='复核意见' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                    {
                        getFieldDecorator('reviewResultComments', {
                            rules: [{ required: getFieldValue('reviewResults') === "NOPASS", message: '请输入复核意见' }],
                        })(<TextArea />)
                    }
                </FormItem>
            </Form>
        </ExtModal>}
    </Fragment>
})

export default create()(checkModal)
