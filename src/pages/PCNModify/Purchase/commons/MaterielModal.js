import React, { forwardRef, useImperativeHandle, useEffect, useRef ,useState} from 'react';
import { Modal, Form, Button, message, Input, } from 'antd';
import { Fieldclassification ,countryListConfig} from '@/utils/commonProps'
import { ExtTable } from 'suid';
import { openNewTab, getFrameElement } from '@/utils';
import { smBaseUrl ,baseUrl} from '@/utils/commonUrl';
import Header from '@/components/Header';
import styles from '../index.less';
import {findCanChooseSupplier} from '@/services/SupplierModifyService'
const { create } = Form;
let dataSource;
const getMatermodRef = forwardRef(({
    form,
    materielCategoryCode,
    isEdit,
    iseditMater,
    implement,
    materselect = () => null,
    companyCode,
    plement
}, ref,) => {
    useImperativeHandle(ref, () => ({ 
        handleModalVisible,
        form 
    }));
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [loading, triggerLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [visible, setvisible] = useState(false);
    const [current, setcurrent] = useState([]);
    //const [dataSource, setdataSource] = useState([])
    useEffect(() => {

    }, []);
    
    dataSource = {
        store: {
            url: `${baseUrl}/api/materialSrmService/findBySecondaryClassificationListAndCompany`,
            params: {
                quickSearchValue: searchValue,
                ///quickSearchProperties: ['materialCode','materialDesc'],
                sortOrders: [
                    {
                        property: '',
                        direction: 'DESC'
                    }
                ],
                secondaryClassificationCodes:materielCategoryCode,
                companyCodeList: companyCode
            },
            type: 'POST'
        }
    }
    function handleModalVisible (flag) {
        setvisible(!!flag)
    };
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    function handleOk() {
        if (selectedRowKeys.length === 0) {
            message.error('请选择一行数据！');
        } else {
            //隐藏供应商选择框
            if (isEdit) {
               iseditMater[0].smPcnAnalysisMaterielVoList = selectedRows;
                // oddmater.map((item) =>  {
                //     selectmater.materialGroupCode = item.materialGroupCode,
                //     selectmater.materialGroupDesc = item.materialGroupDesc,
                //     selectmater.materialCode = item.materialCode,
                //     selectmater.materialStandardDesc = item.materialStandardDesc,
                //     // selectmater.push({
                //     //     materialGroupCode: item.materialGroupCode,
                //     //     materialGroupDesc: item.materialGroupDesc,
                //     //     materialCode: item.materialCode,
                //     //     materialStandardDesc: item.materialStandardDesc
                //     // })

                // })
                //selectedRows.push(iseditMater)
                // let isEditchoice = iseditMater[0].smPcnAnalysisMaterielVoList
                // console.log(iseditMater)
                materselect(iseditMater)
            } else if (implement) {
                materselect(selectedRows)
            }else {
                iseditMater[0].smPcnAnalysisMaterielVoList = selectedRows
                materselect(iseditMater)
            }
            handleModalVisible(false);
            cleanSelectedRecord();
        }
    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRows([]);
        setRowKeys([])
        tableRef.current.manualSelectedRows([])
    }
    // 输入框值
    function SerachValue(v) {
        setSearchValue(v.target.value)
    }
    // 查询
    function handleQuickSerach() {
        let search = "";
        setSearchValue(search);
        setSearchValue(searchValue)
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
            title: "物料分类代码",
            width: 150,
            dataIndex: "codePath"
          },
          {
            title: "物料分类",
            width: 260,
            dataIndex: "namePath"
          },
          {
            title: "物料代码",
            width: 160,
            dataIndex: "materialCode"
          },
          {
            title: "物料描述",
            width: 280,
            dataIndex: "materialDesc"
          },
    ].map(_ => ({ ..._, align: 'center' }));
    // 右侧搜索
    const searchBtnCfg = (
        <>
            <Input
                style={{width:260}}
                placeholder='请输入物料代码或物料描述'
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
            title={"选择物料"}
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
                rowKey={(item) => item.id}
                checkbox={{
                    multiSelect: true
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

export default create()(getMatermodRef);
