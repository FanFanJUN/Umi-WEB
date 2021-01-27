import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Icon, Input, Col, message, Radio, Button } from 'antd';
import { utils, ExtTable, ComboList } from 'suid';
import { AddButtonWrapper } from './style'
import AutoSizeLayout from '../SupplierAutoLayout';
import { checkCardNo, onlyNumber, onMailCheck, toUpperCase } from '@/utils/index'
import { purchaseCompanyProps, FieldconfigureList } from '@/utils/commonProps'
import { dataTransfer2 } from '../CommonUtils'
const { create } = Form;
const FormItem = Form.Item;
let keys = 0;
const MainClientRef = forwardRef(({
    form,
    editData = {},
    isView = false,
    maintype
}, ref) => {
    useImperativeHandle(ref, () => ({
        getMainclient,
        mainTemporary,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configure, setConfigure] = useState([]);
    const [dataSource, setDataSource] = useState([]);


    useEffect(() => {
        let initData = [{ key: keys }];
        if (editData && editData.extendVo && editData.extendVo.majorCustomersVos && editData.extendVo.majorCustomersVos.length > 0) {
            initData = editData.extendVo.majorCustomersVos.map((item, index) => ({ key: index, ...item }));
            keys = initData.length - 1;
        }
        setDataSource(initData)
    }, [editData])
    let columns = [];
    if (!isView) {
        columns.push(
            {
                title: '操作',
                align: 'center',
                width: 100,
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return <div>
                        {
                            dataSource.length > 1 ? <Icon
                                type={'delete'}
                                title={'删除'}
                                onClick={() => handleDelete(record.key)}
                            /> : null
                        }
                    </div>;
                }
            }
        );
    }
    const tableProps = [
        ...columns,
        {
            title: <span>
                {
                    maintype === '0' ? <label className="ant-form-item-required" title=""></label> : ''
                }
                客户名称</span>,
            dataIndex: 'majorCustomers',
            width: 500,
            render: (text, record, index) => {
                if (isView) {
                    return text;
                }
                return <span>
                    <FormItem>
                        {
                            getFieldDecorator(`majorCustomers[${record.key}]`, {
                                initialValue: record.majorCustomers,
                                rules: [{ required: maintype === '0', message: '请输入客户名称!', whitespace: true }],
                            })(
                                <Input
                                    maxLength={30}
                                    placeholder={'请输入客户名称'}
                                    name={record.key}
                                    onBlur={setName}
                                />,
                            )}
                    </FormItem>
                </span>;
            },
        }
    ].map(item => ({ ...item, align: 'center' }))
    // 新增
    function handleAdd() {
        const newData = [...dataSource, { key: ++keys }];
        setDataSource(newData)
    };
    //删除
    function handleDelete(key) {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData)
    };
    //客户名称验证
    function setName(e) {
        for (let i = 0; i <= keys; i++) {
            let key = `majorCustomers[${i}]`;
            if (form.getFieldValue(key) === e.target.value && i !== parseInt(e.target.name)) {
                message.error('与现有的客户名称重复，请重新填入！');
                let changeKeyName = `majorCustomers[${e.target.name}]`;
                form.setFieldsValue({ [changeKeyName]: '' });
                return;
            }
        }
    }
    // 暂存
    function mainTemporary() {
        let majorCustomersVos = {};
        form.validateFieldsAndScroll((err, values) => {
            if (values) {
                majorCustomersVos = { majorCustomersVos: dataTransfer2(dataSource, values) }
            }
        });
        return majorCustomersVos;
    }
    // 获取表单值
    function getMainclient() {
        let result = false;
        let majorCustomersVos = {};
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                majorCustomersVos = { majorCustomersVos: dataTransfer2(dataSource, values) }
                result = majorCustomersVos;
            }
        });
        return result;
    }
    return (
        <>
            <AutoSizeLayout>
                {
                    (height) => <ExtTable
                        allowCancelSelect
                        columns={tableProps}
                        dataSource={dataSource}
                        showSearch={false}
                        lineNumber={true}
                        pagination={{
                            hideOnSinglePage: true,
                            disabled: false,
                            pageSize: 100,
                        }}
                        height={400}
                        checkbox={false}
                        rowKey={(item) => `row-${item.key}`}
                    />
                }
            </AutoSizeLayout>
            <div>
                <AddButtonWrapper>
                    <Button hidden={isView} icon={'plus'} type="dashed" style={{ width: '50%', marginBottom: '10px' }}
                        onClick={handleAdd}>新增</Button>
                </AddButtonWrapper>
            </div>


        </>
        // <div>
        //     <div>
        //         <div>
        //             <ExtTable
        //                 allowCancelSelect
        //                 columns={tableProps}
        //                 dataSource={dataSource}
        //                 showSearch={false}
        //                 pagination={{
        //                     hideOnSinglePage: true,
        //                     disabled: false,
        //                     pageSize: 100,
        //                 }}
        //                 checkbox={false}
        //                 rowKey={(item) => `row-${item.id}`}
        //             />
        //             <AddButtonWrapper>
        //                 <Button hidden={isView} icon={'plus'} type="dashed" style={{ width: '50%' }}
        //                     onClick={handleAdd}>新增</Button>
        //             </AddButtonWrapper>
        //         </div>
        //     </div>
        // </div>
    )
}
)
const CommonForm = create()(MainClientRef)

export default CommonForm