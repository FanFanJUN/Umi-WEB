import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle, useCallback } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, AuthButton } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import styles from '../index.less';
import UploadFile from '../../../../components/Upload/index'
import { Urgingdetailed } from '../../../../services/MaterialService'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { create } = Form;
const { authAction, storage } = utils;
let keys = 1;
const ModifyinfoRef = forwardRef(({
    form,
    editformData = [],
    nodetype
}, ref) => {
    useImperativeHandle(ref, () => ({
        form
    }));
    const tabformRef = useRef(null)
    const [dataSource, setDataSource] = useState([]);
    const [selectRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [visible, setVisible] = useState(false);
    const [modaldata, setModaldata] = useState([]);
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserName = authorizations?.userName;
    useEffect(() => {
        hanldModify(editformData)
    }, [editformData])
    useEffect(() => {
        setModaldata(modaldata)
    }, [])

    // 明细处理数据
    async function hanldModify(val) {
        if (val) {
            let newsdata = [];
            val.map((item, index) => {
                if (item.samIdentifyPlanImplementationVo) {
                    newsdata.push({
                        ...item.samIdentifyPlanImplementationVo,
                        remark: item.remark,
                        planDay: item.writeDay,
                        key: keys++
                    })
                } else {
                    newsdata.push({
                        key: keys++,
                        taskStatus: '',
                        identificationStageName: item.stageName,
                        identificationTaskName: item.taskName,
                        executorName: item.responsiblePartyName,
                        departmentName: item.executiveDepartmentName,
                        planTime: item.publishTime,
                        planDay: item.writeDay,
                        planDescription: '',
                        remark: item.remark
                    })

                }
                setDataSource(newsdata);
            })
        }
    }
    // 是非超期、催办
    let overurging = [];
    if (nodetype) {
        overurging.push(
            {
                title: '是否超期',
                width: 140,
                align: 'center',
                dataIndex: 'earlyWarning',
                render: function (text, record, row) {
                    if (text === 0) {
                        return <div>未超期</div>;
                    } else if (text === 1) {
                        return <div className="successColor">已超期</div>;
                    }
                },
            },
            {
                title: '是否催办',
                width: 140,
                align: 'center',
                dataIndex: 'operationed',
                render: (text, record, index) => {
                    if (record.taskStatus === 0 && record.drafterName === currentUserName) {
                        return <a onClick={() => handleUrging(record)}>催办</a>
                    }

                }
            },
        );
    }
    const columns = [
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            width: 100,
            render: (text, record, index) => {
                if (!isEmpty(record.taskStatus)) {
                    return <a onClick={() => showRecommend(record)}>明细</a>
                }
            }
        },
        {
            title: '任务状态',
            dataIndex: 'taskStatus',
            align: 'center',
            width: 140,
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>执行中</div>;
                } else if (text === 1) {
                    return <div>已执行</div>;
                } else if (text === 2) {
                    return <div>已提交</div>;
                } else if (text === 3) {
                    return <div>已终止</div>;
                } else {
                    return <div>未执行</div>;
                }
            },
        },
        {
            title: '认定阶段',
            dataIndex: 'identificationStageName',
            align: 'center',
            width: 140
        },
        {
            title: '认定任务',
            dataIndex: 'identificationTaskName',
            align: 'center',
            width: 140,
        },
        {
            title: '执行责任人',
            align: 'center',
            dataIndex: 'executorName',
            width: 140,
        },
        {
            title: '执行部门',
            dataIndex: 'departmentName',
            align: 'center',
            width: 160
        },
        {
            title: '计划时间',
            align: 'center',
            dataIndex: 'planTime',
            width: 140,
        },
        {
            title: '计划完成天数',
            align: 'center',
            dataIndex: 'planDay',
            width: 140,
        },
        ...overurging,
        {
            title: '备注',
            dataIndex: 'remark',
            align: 'center',
            width: 180
        }
    ].map(_ => ({ ..._, align: 'center' }))
    // 弹窗明细表格
    const detailscolumns = [
        {
            title: '是否通过',
            dataIndex: 'passStatus',
            align: 'center',
            width: 140,
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>不通过</div>;
                } else if (text === 1) {
                    return <div className="successColor">通过</div>;
                }
            }
        },
        {
            title: '经办人',
            dataIndex: 'agentMan',
            align: 'center',
            width: 160,
        },
        {
            title: '完成时间',
            align: 'center',
            dataIndex: 'completionDate',
            width: 160,
        },
        {
            title: '过程说明',
            align: 'center',
            dataIndex: 'processDescription',
            width: 240,
        },
        {
            title: '附件',
            dataIndex: 'enclosureId',
            align: 'center',
            width: 90,
            render: (value, record) => <UploadFile type="show" entityId={value} />
        }
    ].map(_ => ({ ..._, align: 'center' }))

    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);

    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRowKeys([]);
        setRows([]);
    }
    // 清空列选择并刷新
    function uploadTable() {
        cleanSelectedRecord()
        tabformRef.current.manualSelectedRows();
    }
    // 取消编辑或新增
    function handleCancel() {
        setVisible(false)
        uploadTable()
    }
    // 关闭弹窗
    function hideModal() {
        setVisible(false)
    }
    // 查看明细
    function showRecommend(val) {
        setModaldata(val.samIdentifyPlanImplementationDetailsVos)
        setVisible(true)
    }
    // 催办
    async function handleUrging(val) {
        let params = val.id;
        const { success, message: msg } = await Urgingdetailed({ impId: params });
        if (success) {
            message.success('催办成功！');
        } else {
            message.error(msg);
        }
    }
    return (
        <>
            <AutoSizeLayout>
                {
                    (height) => <ExtTable
                        columns={columns}
                        showSearch={false}
                        ref={tabformRef}
                        rowKey={(item) => item.key}
                        checkbox={false}
                        pagination={{
                            hideOnSinglePage: true,
                            disabled: false,
                            pageSize: 100,
                        }}
                        allowCancelSelect={true}
                        size='small'
                        height={height}
                        remotePaging={true}
                        ellipsis={false}
                        saveData={false}
                        onSelectRow={handleSelectedRows}
                        selectedRowKeys={selectRowKeys}
                        dataSource={dataSource}
                    />
                }
            </AutoSizeLayout>
            <ExtModal
                destroyOnClose
                onCancel={handleCancel}
                visible={visible}
                centered
                width={880}
                footer={null}
                bodyStyle={{ height: 380, padding: 0 }}
                title="明细"
            >
                <ExtTable
                    rowKey={(item) => item.id}
                    showSearch={false}
                    dataSource={modaldata}
                    columns={visible ? detailscolumns : ''}
                />
            </ExtModal>
        </>
    )
})
const CommonForm = create()(ModifyinfoRef)

export default CommonForm