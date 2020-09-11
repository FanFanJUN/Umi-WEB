/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-10 10:57:33
 * @LastEditTime: 2020-09-11 16:36:35
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/common/EditTable.js
 * @Description:  函数式可编辑行 Table组件
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, Fragment } from 'react';
import { Input, InputNumber, Popconfirm, Form, Divider, Button } from 'antd';
import { ExtTable } from 'suid';
import PropTypes from 'prop-types';
import AutoSizeLayout from '../../../../supplierRegister/SupplierAutoLayout';


const EditableContext = React.createContext();

const EditableCell = (params) => {
    const {
        params: {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            form,
         }
    } = params;

    // 编辑样式
    const getInput = () => {
        switch (inputType) {
            case 'InputNumber':
                return <InputNumber />
            default:
                return <Input/>;
        }
    };

    const { getFieldDecorator } = form;
    const renderCell = () => {
        return (
            editing ? (
                <Form.Item style={{ margin: 0 }}>
                    {getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required: true,
                                message: `请输入${title}!`,
                            },
                        ],
                        initialValue: record[dataIndex],
                    })(getInput())}
                </Form.Item>
            ) : (
                    <div style={{ textAlign: 'center' }}>{record[dataIndex]}</div>
                )
        );
    };

    return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
}

const EditableTable = (props) => {

    const { form, dataSource, columns, rowKey, isEditTable=false, isToolBar=false } = props;

    const [editingKey, setEditingKey] = useState('');
    const { propsData, setPropsData} = useState(dataSource);
    console.log(propsData);
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

    function deleteRow(key) {
        console.log(key);
    }

    const finalCol =(record)=>{
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
                <Popconfirm title="确定取消？" onConfirm={() => cancel(record[rowKey])}>
                    <a>取消</a>
                </Popconfirm>
            </span>
        ) : (
                <Fragment>
                    <a disabled={editingKey !== ''} onClick={() => edit(record[rowKey])} key='edit'>
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <Popconfirm title="确定删除？" onConfirm={() => deleteRow(record[rowKey])}>
                        <a disabled={editingKey !== ''} key='delete' style={{ color: 'red' }}>
                            删除
                        </a>
                    </Popconfirm>
                </Fragment>
            );
    } 

    const secCol = isEditTable? [...columns, {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
            
            return finalCol(record);
        },
    }].map(item => ({ ...item, align: 'center' })) : columns;

    const mergeColumns = secCol.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            render: (text, record) => {
                return <EditableCell params={{
                    record,
                    inputType: col.inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                    form,
                }} />
            }
        };
    });

    function save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
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
                props.setNewData(newData);
            } else {
                newData.push(row);
                setEditingKey('');
                props.setNewData(newData);
            }
        });
    }

    function handleAdd() {

    }

    return (
        <EditableContext.Provider value={props.form}>
            <AutoSizeLayout>
                {(h) => <ExtTable
                    bordered
                    // height={h}
                    dataSource={propsData}
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
                    toolBar={isToolBar?{
                        left: (
                          <Button type="primary" onClick={() => handleAdd()}>
                            新增
                          </Button>
                        ),
                      }: null}
                />}
            </AutoSizeLayout>
        </EditableContext.Provider>
    );
}

const EditableFormTable = Form.create()(EditableTable);

// const { form, dataSource, columns, rowKey, isEditTable=false, isToolBar=false } = props;
EditableTable.protoType={
    //数据源
    dataSource:PropTypes.array,
    //列
    columns:PropTypes.array,
    //列表唯一key
    rowKey:PropTypes.any,
    //Tables是否需要operation  编辑行  删除选项
    isEditTable:PropTypes.bool,
    //是否显示工具栏（新增||删除 ReactNode）
    isToolBar:PropTypes.bool,
  }

export default EditableFormTable;