import React, { forwardRef, useImperativeHandle, useEffect, useRef ,useState} from 'react';
import { Modal, Form, Button, message, Input, } from 'antd';
import { Fieldclassification ,countryListConfig} from '@/utils/commonProps'
import { ExtTable } from 'suid';
import { openNewTab, getFrameElement } from '@/utils';
import { smBaseUrl } from '@/utils/commonUrl';
import Header from '@/components/Header';
import styles from '../index.less';
import {findCanChooseSupplier} from '@/services/SupplierModifyService'
const { create } = Form;
const getAgentregRef = forwardRef(({
    form,
}, ref,) => {
    useImperativeHandle(ref, () => ({ 
        handleModalVisible,
        form 
    }));
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [loading, triggerLoading] = useState(false);
    const [searchValue, setSearchValue] = useState({});
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [visible, setvisible] = useState(false);
    const [current, setcurrent] = useState([]);
    //const [dataSource, setData] = useState([]);
    useEffect(() => {
        //getSupplierlist()
    }, []);
    //let current = 1;
    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/supplierModifyService/findCanChooseSupplier`,
            params: {
                ...searchValue,
                quickSearchProperties: ['name'],
                sortOrders: [
                    {
                        property: 'name',
                        direction: 'DESC'
                    }
                ]
            },
            type: 'POST'
        }
    }
    // 供应商
    // async function getSupplierlist() {
    //     let params = {page:1,rows:30,'S_createdDate':'desc'};
    //     triggerLoading(true)
    //     const { data,success, message: msg } = await findCanChooseSupplier(params);
    //     if (success) {
    //         setData(data)
    //         triggerLoading(false)
    //         return
    //     }else {
    //         message.error(msg);
    //     }
    //     triggerLoading(false)
    // }
    function handleModalVisible (flag) {
        setvisible(!!flag)
    };
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    function handleOk() {
        //const empty = selectedRowKeys.length === 0;
        if (selectedRowKeys.length !== 1) {
            message.error('请选择一行数据！');
          } else {
            //隐藏供应商选择框
            handleModalVisible(false);
            // let categoryid = selectedRows[0].supplier.supplierCategoryId;
            let id = selectedRows[0].supplierId;
            openNewTab(`supplier/supplierModify/create/index?id=${id}`, '供应商变更新建变更单', false)
          }
    }
    // 输入框值
    function SerachValue(v) {
        setSearchValue(v.target.value)
    }
    // 查询
    function handleQuickSerach() {
        setSearchValue({
            quickSearchValue: searchValue
        })
        uploadTable();
    }
    function uploadTable() {
        cleanSelectedRecord()
        tableRef.current.remoteDataRefresh()
    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRowKeys([])
    }
    function pageChange(val) {
        setcurrent(val.current)
    }
    const columns = [
        {
            title: "供应商代码",
            width: 120,
            dataIndex: "supplierCode"
          },
          {
            title: "供应商名称",
            width: 260,
            dataIndex: "supplierName"
          },
          {
            title: "合作关系",
            width: 150,
            dataIndex: "cooperationLevelName"
          },
          {
            title: "管理级别",
            width: 150,
            dataIndex: "managementLevellName"
          }
    ].map(_ => ({ ..._, align: 'center' }));
    // 右侧搜索
    const searchBtnCfg = (
        <>
            <Input
                placeholder='请输入供应商代码或名称查询'
                className={styles.btn}
                onChange={SerachValue}
                allowClear
            />
            <Button type='primary' onClick={handleQuickSerach}>查询</Button>
        </>
    )
    return (
        <Modal
            width={1000}
            className={"choose-supplier"}
            centered
            destroyOnClose={true}
            maskClosable={false}
            title={"选择变更供应商"}
            visible={visible}
            onCancel={() => handleModalVisible(false)}
            onOk={handleOk}
        >

            <Header
                left={false}
                right={searchBtnCfg}
                advanced={false}
                extra={false}
                ref={headerRef}
            />
            <ExtTable
                columns={columns}
                showSearch={false}
                ref={tableRef}
                rowKey={(item) => item.supplierId}
                checkbox={{
                    multiSelect: false
                }}
                allowCancelSelect
                size='small'
                remotePaging={true}
                ellipsis={false}
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                onChange={pageChange}
                //dataSource={dataSource}
                {...dataSource}
            />
      </Modal>
    );
},
);

export default create()(getAgentregRef);
