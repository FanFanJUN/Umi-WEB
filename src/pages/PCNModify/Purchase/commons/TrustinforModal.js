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

const getTrustinfor = forwardRef(({
    form,
    hanldTrust = () => null,
    editData,
    alonedata
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
    useEffect(() => {
        //getSupplierlist()
        screenCompany(alonedata,editData)
    }, [alonedata,editData]);

    // 数据助理
    function screenCompany(alonedata,editData) {
        // console.log(alonedata)
        // console.log(editData)
        let Analysisdata = alonedata.smPcnAnalysisVos
        if (Analysisdata) {
            // Analysisdata.map((item,index) => {
            //     editData.map((items,indexs) => {
            //         if (item.id === items.id) {
            //             //allmateriel.push(item)
            //             Analysisdata.splice(item,1)
            //             console.log(Analysisdata)
            //         }
            //     })
            // })
            let allmateriel = []
            // for (var i = 0; i < Analysisdata.length; i ++) {
            //     for(var j = 0; i < editData.length; j ++) {
            //         if (Analysisdata[i].materielCategoryCode === editData[j].materielCategoryCode) {
            //             allmateriel.push(editData[j])
            //             break;
            //         }
            //     }
            // }
            
            // for(var i=0;i < Analysisdata.length;i++) { 
            //     for(var j=0;j < editData.length;j++) { 
            //         if(editData[j].materielCategoryCode === Analysisdata[i].materielCategoryCode){ 
            //             console.log(231)
            //             editData.splice(editData[j],1); 
            //             j=j-1; 
            //         }
            //     } 
            // }
            // console.log(editData)
            Analysisdata.forEach((item,index) => {
                editData.forEach((items,indexs) => {
                    if(item.materielCategoryCode === items.materielCategoryCode){ 
                        Analysisdata.splice(index,1); 
                    }
                })
            })
            //console.log(Analysisdata)
        }
        
    }
    // 显示
    function handleModalVisible (flag) {
        setvisible(!!flag)
    };
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    function handleOk() {
        const empty = selectedRowKeys.length === 0;
        if (selectedRowKeys.length !== 1) {
            message.error('请选择一行数据！');
        } else {
            hanldTrust(selectedRows[0])
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
            title: "公司代码",
            width: 120,
            dataIndex: "companyCode"
          },
          {
            title: "公司名称",
            width: 260,
            dataIndex: "companyName"
          },
          {
            title: "采购组织代码",
            width: 150,
            dataIndex: "purchaseOrgCode"
          },
          {
            title: "采购组织名称",
            width: 150,
            dataIndex: "purchaseOrgName"
          },
          {
            title: "是否实物认定",
            width: 120,
            dataIndex: "smInKindStatus",
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>否</div>;
                } else if (text === 1) {
                    return <div className="doingColor">是</div>;
                } 
              },
          }
    ].map(_ => ({ ..._, align: 'center' }));
    // 右侧搜索
    const searchBtnCfg = (
        <>
            <Input
                style={{width:260}}
                placeholder='请输入物料代码或名称查询'
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
            title={"选择信任信息"}
            visible={visible}
            onCancel={() => handleModalVisible(false)}
            onOk={handleOk}
        >

            <Header
                left={false}
                right={false}
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
                    multiSelect: false
                }}
                allowCancelSelect
                size='small'
                remotePaging={true}
                ellipsis={false}
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                onChange={pageChange}
                dataSource={editData}
                //{...dataSource}
            />
      </Modal>
    );
},
);

export default create()(getTrustinfor);
