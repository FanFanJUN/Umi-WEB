import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, utils, DataImport } from 'suid';
import { Input, Button, message, Modal, Checkbox } from 'antd';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import { onLineTarget } from '../../../../config/proxy.config';
import MessageFrom from './messageDetails'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const host = process.env.NODE_ENV === 'production' ? '' : onLineTarget;
const { Search } = Input
const confirm = Modal.confirm;
const { authAction, storage } = utils;
const { FlowHistoryButton } = WorkFlow;
function SupplierConfigure() {
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const commonFormRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserId = authorizations?.userId;
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [tabtitle, setTabtitle] = useState(false);
    const [searchValue, setSearchValue] = useState({});
    const [message, setMessage] = useState({});
    const columns = [
        {
            title: '发送报文',
            width: 220,
            dataIndex: 'sendMsg',
            render: (text, record) => {
                return <Button onClick={() => messageClick(record.sendMsg, '发送报文')}>查看发送报文</Button>
            }
        },
        {
            title: '发送时间',
            width: 200,
            dataIndex: 'createdDate',
        },
        {
            title: '返回报文',
            width: 220,
            dataIndex: 'retData',
            render: (text, record) => {
                return <Button onClick={() => messageReturn(record.retData, '返回报文')}>查看返回报文</Button>
            }
        },
        {
            title: '供应商代码',
            width: 120,
            dataIndex: 'supplierCode',
        },
        {
            title: '供应商名称',
            width: 320,
            dataIndex: 'supplierName',
        }
    ].map(_ => ({ ..._, align: 'center' }))

    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/bafSupplierPlmLogsService/findByPage `,
            params: {
                ...searchValue,
                quickSearchProperties: ['supplierCode', 'supplierName'],
                sortOrders: [
                    {
                        property: 'createdDate',
                        direction: 'DESC'
                    }
                ],
            },
            type: 'POST'
        }
    }

    useEffect(() => {
        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
    }, []);

    function listenerParentClose(event) {
        const { data = {} } = event;
        if (data.tabAction === 'close') {
            tableRef.current.remoteDataRefresh()
        }
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRows([])
        setRowKeys([])
        tableRef.current.manualSelectedRows([])
    }

    function uploadTable() {
        cleanSelectedRecord()
        tableRef.current.remoteDataRefresh()
    }
    // 快速查询
    function handleQuickSerach(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value.trim() }));
        uploadTable();
    }
    // 保存
    async function masterSave() {
        commonFormRef.current.handleModalVisible(false)
        uploadTable();
    }
    function messageClick(val) {
        setMessage(val)
        setTabtitle('发送报文')
        commonFormRef.current.handleModalVisible(true)
    }
    function messageReturn(val) {
        setMessage(val)
        setTabtitle('返回报文')
        commonFormRef.current.handleModalVisible(true)
    }
    // 右侧搜索
    const HeaderRightButtons = (
        <div style={{ display: 'flex' }}>
            <Search
                placeholder='请输入供应商代码或名称查询'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '240px' }}
            />
        </div>
    )
    return (
        <>
            <Header
                left={false}
                right={HeaderRightButtons}
                ref={headerRef}
                content
            />
            <AutoSizeLayout>
                {
                    (height) => <ExtTable
                        columns={columns}
                        showSearch={false}
                        ref={tableRef}
                        rowKey={(item) => item.id}
                        checkbox={false}
                        allowCancelSelect
                        size='small'
                        height={height}
                        remotePaging={true}
                        ellipsis={false}
                        onSelectRow={handleSelectedRows}
                        selectedRowKeys={selectedRowKeys}
                        //dataSource={dataSource}
                        {...dataSource}
                    />
                }
            </AutoSizeLayout>
            <MessageFrom
                title={tabtitle}
                modifydata={message}
                onOk={masterSave}
                wrappedComponentRef={commonFormRef}
            />
        </>
    )
}

export default SupplierConfigure
