/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-10 10:57:33
 * @LastEditTime: 2020-09-18 15:12:49
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/CommonUtil/EditTable.js
 * @Description:  函数式可编辑行 Table组件
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, Fragment } from 'react';
import { Input, InputNumber, Popconfirm, Form, Divider, Button, DatePicker, Select, message, Alert, Row, Col } from 'antd';
import { ExtTable, ComboList, ComboGrid } from 'suid';
import PropTypes, { any } from 'prop-types';
import AutoSizeLayout from '../../../../supplierRegister/SupplierAutoLayout';
import { guid, isEmptyArray, checkNull, hideFormItem } from './utils';
import UploadFile from './UploadFile';
import { currencyTableProps } from '../../../../../utils/commonProps';
import moment from 'moment';

const EditableContext = React.createContext();
const { Option } = Select;

const EditableCell = (params) => {
    const {
        params: {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            form,
            required,
            inputDisabled,
            inputDefaultValue,
        }
    } = params;
    const { getFieldDecorator } = form;
    const HideFormItem = hideFormItem(getFieldDecorator);

    function afterSelect(val) {
        form.setFieldsValue({ currencyCode: val.code });
    }

    // 编辑样式
    const getInput = () => {
        switch (inputType) {
            case 'InputNumber':
                return <InputNumber disabled={inputDisabled} min={0} />
            case 'DatePicker':
                return <DatePicker />
            case 'Select':
                return <Select
                    style={{ width: 150 }}
                    placeholder="请选择"
                >
                    <Option value={true}>是</Option>
                    <Option value={false}>否</Option>
                </Select>
            case 'UploadFile':
                return <UploadFile />
            case 'TextArea':
                return <Input.TextArea disabled={inputDisabled} />
            case 'hideForm':
                return <Input type={"hidden"} />
            case 'selectwithService':
                return <ComboGrid {...currencyTableProps} form={form} afterSelect={afterSelect} />
            case 'percentInput':
                return <InputNumber min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')} />
            default:
                return <Input disabled={inputDisabled} />;
        }
    };

    // 有编辑状态  不处于编辑中 col 显示值
    const getRecordData = () => {
        const a = record[dataIndex];
        if (inputType === 'Select') {
            if (a === true) {
                return '是';
            }
            if (a === false) {
                return '否';
            }
            return a;
        } else if (inputType === 'DatePicker') {
            return a && moment(a).format('YYYY-MM-DD');
        } else {
            return record[dataIndex];
        }
    }

    // 有编辑状态  处于编辑中col 默认值
    const getInit = () => {
        if (inputDefaultValue) {
            return inputDefaultValue;
        } else {
            if (inputType === 'DatePicker') {
                return moment(record[dataIndex]);
            }
            return record[dataIndex];
        }
    }

    const renderCell = () => {
        console.log(editing);
        return (
            editing ? (
                <Form.Item style={{ margin: 0 }}>
                    <span style={{ color: 'red', display: required ? '' : 'none', float: inputType === 'UploadFile' ? 'left' : null }}>*</span>
                    {getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required,
                                message: `请输入${title}!`,
                            },
                        ],
                        // initialValue有false
                        initialValue: getInit(),
                    })(getInput())}
                    {dataIndex === 'currencyName' ? HideFormItem('currencyCode', record.currencyCode) : null}
                </Form.Item>
            ) : (
                    <div style={{ textAlign: 'center' }}>{getRecordData()}</div>
                )
        );
    };

    return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
}

const EditableTable = (props) => {

    const { form, dataSource, columns, rowKey, isEditTable = false, isToolBar = false, setNewData,
        recommendDemandId = '676800B6-F19D-11EA-9F88-0242C0A8442E', tableType } = props;

    console.log(dataSource);
    const [editingKey, setEditingKey] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const tableRef = useRef(null);

    function isEditing(record) {
        return record[rowKey] === editingKey;
    };

    function cancel() {
        setEditingKey('');
    };

    function edit(key) {
        setEditingKey(key);
    }

    function deleteRow(key, type) {
        const newArray = dataSource.filter(item => {
            return item[rowKey] !== key;
        });
        setNewData(newArray, tableType);
        setButtonDisabled(false);
        setEditingKey('');
    }

    const finalCol = (record) => {
        const editable = isEditing(record);
        return editable ? (
            <span>
                <EditableContext.Consumer>
                    {form => (
                        <a
                            onClick={() => save(form, record[rowKey])}
                            style={{ marginRight: 8 }}
                        >
                            保存
                        </a>
                    )}
                </EditableContext.Consumer>
                {buttonDisabled ?
                    <a style={{ color: 'red' }} key='deteteKey' onClick={() => deleteRow(record[rowKey], 'editDelete')}>删除</a>
                    :
                    <Popconfirm title="确定取消？" onConfirm={() => cancel(record[rowKey])}>
                        <a key='cancel'>取消</a>
                    </Popconfirm>}
            </span>
        ) : (
                <Fragment>
                    <a disabled={editingKey !== ''} onClick={() => edit(record[rowKey])} key='edit'>
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <Popconfirm title="确定删除？" onConfirm={() => deleteRow(record[rowKey], 'delete')}>
                        <a disabled={editingKey !== ''} key='delete' style={editingKey !== '' ? { color: 'rgba(0, 0, 0, 0.25)' } : { color: 'red' }}>
                            删除
                        </a>
                    </Popconfirm>
                </Fragment>
            );
    }

    const secCol = isEditTable ? [{
        title: '操作',
        dataIndex: 'operation',
        editable: false,
        render: (text, record) => {

            return finalCol(record);
        },
    }, ...columns,].map(item => ({ ...item, align: 'center' })) : columns;

    const mergeColumns = secCol.map(col => {
        const editable = col.editable === undefined ? true : col.editable; // 默认可编辑
        if (!editable) {
            return col;
        }
        return {
            ...col,
            render: (text, record) => {
                return <EditableCell params={{
                    record,
                    inputType: col.inputType, // 默认Input
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    form,
                    required: !(col.required === false), // 默认必输
                    inputDisabled: col.inputDisabled,
                    inputDefaultValue: col.inputDefaultValue,
                }} />
            }
        };
    });

    function save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            console.log(row);
            const newData = [...dataSource];
            const index = newData.findIndex(item => key === item[rowKey]);
            console.log(index);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setEditingKey('');
                setButtonDisabled(false);
                props.setNewData(newData, tableType);
            } else {
                newData.push(row);
                setEditingKey('');
                setButtonDisabled(false);
                props.setNewData(newData, tableType);
            }
        });
    }

    function handleAdd() {
        // 注意 一定要实现深拷贝 不然父组件状态不会更新
        // const newArray = JSON.parse(JSON.stringify(dataSource));
        const newArray = dataSource.map(item => {
            return item;
        });
        // newArray.push({ id: guid() });
        const id = guid();
        const newData = isEmptyArray(newArray) ?
            [{ id, guid: guid(), recommendDemandId }] : [{ id, guid: guid(), recommendDemandId }, ...newArray];
        setNewData(newData, tableType); // 新增数据 + 所属哪个Table
        setEditingKey(id); // 新增处于编辑行
        setButtonDisabled(true); // 未保存无法操作
    }

    return (
        <EditableContext.Provider value={props.form}>
            <AutoSizeLayout>
                {(h) => <ExtTable
                    bordered
                    // height={h}
                    dataSource={dataSource || []}
                    columns={mergeColumns}
                    //   pagination={{
                    //     onChange: this.cancel,
                    //   }}
                    ref={tableRef}
                    showSearch={false}
                    rowKey={rowKey}
                    remotePaging={true}
                    pagination={{
                        // pageSizeOptions: ['5','10', '15'],
                        defaultPageSize: 5,
                        showQuickJumper: true
                    }}
                    toolBar={isToolBar ? {
                        left: (
                            <Button type="primary" onClick={handleAdd} disabled={buttonDisabled}>
                                新增
                            </Button>
                        ),
                    } : null}
                />}
            </AutoSizeLayout>
        </EditableContext.Provider>
    );
}

const EditableFormTable = Form.create()(EditableTable);

// const { form, dataSource, columns, rowKey, isEditTable=false, isToolBar=false } = props;
EditableTable.protoType = {
    //数据源
    dataSource: PropTypes.array,
    //列
    columns: PropTypes.array,
    //列表唯一key
    rowKey: PropTypes.string,
    //Tables是否需要operation  编辑行  删除选项
    isEditTable: PropTypes.bool,
    //是否显示工具栏（新增||删除 ReactNode）
    isToolBar: PropTypes.bool,
    // 页面处于编辑||详细
    type: PropTypes.any,
    // 页面所属 TABLE 标志
    tableType: PropTypes.string,
}

export default EditableFormTable;