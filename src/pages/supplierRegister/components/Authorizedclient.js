import React, { forwardRef, useImperativeHandle, useEffect, useRef,useState } from 'react';
import { Form, Icon, Input, Col, message, Radio, Button } from 'antd';
import { utils, ExtTable, ComboList } from 'suid';
import { AddButtonWrapper } from './style'
import AutoSizeLayout from '../SupplierAutoLayout';
import { checkCardNo, onlyNumber, onMailCheck, toUpperCase, getLineCode, getMaxLineNum } from '@/utils/index'
import { listPositionConfig } from '@/utils/commonProps'
import { dataTransfer2 } from '../CommonUtils'
import { isEmpty } from '../../../utils/index';
import { indexOf } from 'lodash';
const { create } = Form;
const FormItem = Form.Item;
let keys = 0;
let lineCode = 1;
let aggregate = [];
let aggregatename = [];
const poinsitiondata = [
    {
      name: '总锦鲤',
      value: "001",
    },
    {
      name: '副总经理',
      value: "002",
    },
    {
        name: '监理',
        value: "003",
      },
      {
        name: '财务',
        value: "004"
      }
  ];
const AuthorizeRef = forwardRef(({
    form,
    initialValue = {},
    editformData = {},
    isView,
    isOverseas = null
}, ref) => {
    useImperativeHandle(ref, () => ({
        getAuthorfrom,
        authorTemporary,
        setHeaderFields,
        form
    }));
    const tabformRef = useRef(null)
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configure, setConfigure] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [authoriz, setauthoriz] = useState([]);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        let initData = [{ key: keys, lineCode: getLineCode(lineCode) }];
        let editData = editformData;
        if (editData && editData.contactVos && editData.contactVos.length > 0) {
            initData = editData.contactVos.map((item, index) => ({ key: index, ...item }));
            let maxLineNum = getMaxLineNum(editData.contactVos);
            //lineCode = maxLineNum + 1;
            keys = initData.length - 1;
        }else {
            editData = editData.contactVos
        }
        getBankcodelist(editData)
    }, [editformData])
    let columns = [];
    if (!isView) {
        columns.push(
            {
                title: '操作',
                align: 'center',
                dataIndex: 'operation',
                width: 100,
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
            title: '行号',
            dataIndex: 'lineCode',
            align: 'center',
            width: 80
        },
        {
            title: <span><label className="ant-form-item-required" title=""></label>职务</span>,
            dataIndex: 'position',
            width: 200,
            render: (text, record, index) => {
                if (isView) {
                    return record.positionName;
                }
                return <span>
                    <FormItem style={{ marginBottom: 0 }}>
                        {
                            getFieldDecorator(`position[${index}]`),
                            getFieldDecorator(`positionName[${index}]`, {
                                initialValue: record ? record.positionName : '',
                                rules: [{ required: true, message: '请选择职位!', whitespace: true }],
                            })( 
                                <ComboList 
                                    form={form}
                                    {...listPositionConfig}
                                    showSearch={false}
                                    //afterSelect={afterSelect}
                                    name={`positionName[${index}]`}
                                    field={[`position[${index}]`]}
                                    afterSelect={(item)=>{
                                        afterSelect(item,`${index + 1}`)
                                    }}
                                />
                                // <ComboList 
                                //     form={form}
                                //     style={{ width:'100%' }}
                                //     dataSource={poinsitiondata}
                                //     reader={{
                                //         name: 'name',
                                //         field: ['value'],
                                        
                                //     }}
                                //     showSearch={false}
                                //     afterSelect={(item)=>{
                                //         afterSelect(item,`${index}` + 1 )
                                //     }}
                                //     name={`positionName[${index}]`}
                                //     field={[`position[${index}]`]}
                                // />
                            )
                        }
                    </FormItem>
                </span>;
            },
        },
        {
            title: <span><label className="ant-form-item-required" title=""></label>联系人</span>,
            dataIndex: 'name',
            width: 150,
            render: (text, record, index) => {
                if (isView) {
                    return text;
                }
                return <span>
                    <FormItem style={{ marginBottom: 0 }}>
                        {
                            getFieldDecorator(`name[${index}]`, {
                                initialValue: record.name,
                                rules: [{ required: true, message: '请输入联系人!', whitespace: true }],
                            })(
                                <Input
                                    maxLength={30}
                                    placeholder={'请输入联系人'}
                                    name={record.key}
                                    onBlur={setName}
                                />,
                            )}
                    </FormItem>
                </span>;
            },
        },
        {
            title: <span><label className="ant-form-item-required" title=""></label>身份证号</span>,
            dataIndex: 'idNo',
            width: 200,
            render: (text, record, index) => {
                if (isView) {
                    return text;
                }
                return <span><FormItem style={{ marginBottom: 0 }}> {
                    getFieldDecorator(`idNo[${index}]`, {
                        initialValue: record && record.idNo,
                        rules: [{ required: true, message: '请输入身份证号!', whitespace: true }],
                    })(
                        <Input
                            maxLength={20}
                            placeholder={'请输入身份证号'}
                        />,
                    )}
                </FormItem>
                </span>;
            },
        },
        {
            title: <span><label className="ant-form-item-required" title=""></label>手机</span>,
            dataIndex: 'mobile',
            width: 200,
            render: (text, record, index) => {
                if (isView) {
                    return text;
                }
                return isOverseas ? <span><FormItem style={{ marginBottom: 0 }}> {
                    getFieldDecorator(`mobile[${index}]`, {
                        initialValue: record && record.mobile,
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: '请输入手机号!',
                        }],
                    })(
                        <Input
                            maxLength={20}
                            placeholder={'请输入手机号'}
                            onChange={onlyNumber}
                        />,
                    )}
                </FormItem>
                </span> : <span><FormItem style={{ marginBottom: 0 }}> {
                    getFieldDecorator(`mobile[${index}]`, {
                        initialValue: record && record.mobile,
                        rules: [{
                            required: true,
                            pattern: '^\\d{11}$',
                            message: '请输入11位手机号!', whitespace: true,
                        }],
                    })(
                        <Input
                            maxLength={11}
                            placeholder={'请输入手机号'}
                            onChange={onlyNumber}
                        />,
                    )}
                </FormItem>
                    </span>;
            },
        },
        {
            title: <span><label className="ant-form-item-required" title=""></label>邮箱</span>,
            dataIndex: 'email',
            width: 200,
            render: (text, record, index) => {
                if (isView) {
                    return text;
                }
                return <span><FormItem style={{ marginBottom: 0 }}>
                    {
                        getFieldDecorator(`email[${index}]`, {
                            initialValue: record && record.email,
                            rules: [{ validator: onMailCheck, message: '请输入正确格式的邮件地址!' },
                            { required: true, whitespace: true, message: '请输入邮箱!' }],
                        })(
                            <Input
                                onChange={toUpperCase}
                                maxLength={30}
                                placeholder={'请输入邮箱'}
                            />,
                        )}
                </FormItem>
                </span>;
            },
        },
        {
            title: <span><span style={{ color: 'red', marginRight: '5px', fontSize: '16px' }}></span>电话</span>,
            dataIndex: 'telephone',
            width: 200,
            render: (text, record, index) => {
                if (isView) {
                    return text;
                }
                return <span><FormItem style={{ marginBottom: 0 }}>
                    {
                        getFieldDecorator(`telephone[${index}]`, {
                            initialValue: record.telephone,
                            rules: [{ whitespace: true, message: '请输入电话!' },
                                // {validator: checkTelephone}
                            ],
                        })(
                            <Input
                                placeholder={'请输入电话'}
                                onChange={onlyNumber}
                            />,
                        )}
                </FormItem>
                </span>;
            },
        },
    ].map(item => ({ ...item, align: 'center' }))

    // 职务选择
    function afterSelect(val,key) {
        setEdit(true)
        dataSource.forEach((item,index) => {
            if (item.key === Number(key)) {
                console.log(23123)
                const copyData = dataSource.slice(0)
                copyData[index].position = val.value;
                setDataSource(copyData)
            }
        })
    }
    function getBankcodelist(val) {
        let contactVos;
        if (val) {
            if (val.contactVos !== undefined) {
                contactVos = val.contactVos;
                contactVos.forEach(item => item.key = keys++);
                //设置行号，取（最大值+1）为当前行号
                if (contactVos.length > 0) {
                    if (!isEmpty(contactVos)) {
                        contactVos.forEach(item => {
                            item.lineCode = getLineCode(lineCode++)
                        })
                    }
                    let maxLineCode = getMaxLineNum(contactVos);
                    lineCode = maxLineCode++;
                    setDataSource(contactVos)
                }else {
                    let determine = lineCode
                    lineCode = lineCode + 1
                    const newData = [...dataSource, { key: ++keys, lineCode: getLineCode(determine) }];
                    setDataSource(newData)
                }
                
            }else {
                let determine = lineCode
                //lineCode = lineCode
                const newData = [...dataSource, { key: ++keys, lineCode: getLineCode(determine) }];
                setDataSource(newData)
            }
        }
    }
    // 新增
    async function handleAdd() {
        let determine;
        if (dataSource.length === 0) {
            lineCode = lineCode
        } else {
            determine = lineCode + 1
            lineCode = lineCode + 1
        }
        const newData = [...dataSource, { key: ++keys, lineCode: getLineCode(determine) }];
        //setauthoriz([{ keyId: ++keys, lineCode: getLineCode(determine) }])
        //lineCode++;
        // let setlecode = [];
        // setlecode.push({ keyId: ++keys, lineCode: getLineCode(determine) })
        // console.log(setlecode)
        // setauthoriz(setlecode)
        setDataSource(newData)

    };
    //删除
    function handleDelete(key) {
        const newData = dataSource.filter((item) => item.key !== key);
        lineCode = lineCode - 1;
        keys = keys - 1;
        for (let i = 0; i < newData.length; i++) {
            newData[i].lineCode = getLineCode(i + 1);
        }
        setDataSource(newData)
    };
    // function deleteNmae(e) {
    //     console.log(e.target)
    //     let changeKeyName = `name[${e.target.name}]`;
    //     form.setFieldsValue({[changeKeyName]: ''});
    // }
    //联系人验证
    function setName(e) {
        dataSource.forEach((item,index) => {
            if (index === parseInt(e.target.name)) {
                item.name = e.target.value
            }
        })
        console.log(dataSource)
        aggregatename = form.getFieldValue('name');

        let quencyname = counts(aggregatename,e.target.value);
        if (quencyname === 2) {
            message.error('与现有的联系人名称重复，请重新填入！');
            let changeKeyName = `name[${e.target.name}]`;
            form.setFieldsValue({[changeKeyName]: ''});
        }
    }
    function counts (arr, value) {
        return arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0)
    }
    // 暂存
    function authorTemporary() {
        let result = {};
        form.validateFieldsAndScroll((err, values) => {
            values.position.forEach((item,index) => {
                if (item === undefined) {
                    values.position[index] = dataSource[index].position
                }
            })
            if (values) {
                result = dataTransfer2(dataSource, values)
                
            }
        })
        return result;
    }
    // 获取表单值
    function getAuthorfrom() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            values.position.forEach((item,index) => {
                if (item === undefined) {
                    values.position[index] = dataSource[index].position
                }
            })
            if (!err) {
                result = dataTransfer2(dataSource, values)
            }
        })
        return result;
    }
    // 设置所有表格参数
    const setHeaderFields = (fields) => {
        //const { attachmentId = null, ...fs } = fields;
        // setAttachment(attachmentId)
        // setFieldsValue(fs)
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
                        pagination={{
                            hideOnSinglePage: true,
                            disabled: false,
                            pageSize: 100,
                        }}
                        ref={tabformRef}
                        height={height}
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
    )
}
)
const CommonForm = create()(AuthorizeRef)

export default CommonForm