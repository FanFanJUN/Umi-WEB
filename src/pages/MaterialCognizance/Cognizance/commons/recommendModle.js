import React, { forwardRef, useImperativeHandle, useEffect, useRef ,useState} from 'react';
import { Modal, Form, Button, message, Input,Row,Col } from 'antd';
import { Fieldclassification ,countryListConfig} from '@/utils/commonProps'
import { ExtTable } from 'suid';
import { openNewTab, getFrameElement } from '@/utils';
import { smBaseUrl ,baseUrl} from '@/utils/commonUrl';
import Header from '@/components/Header';
import styles from '../index.less';
import {findCanChooseSupplier} from '@/services/SupplierModifyService'
const { Item,create } = Form;
const formLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}
const getMatermodRef = forwardRef(({
    form,
    materielCategoryCode,
    isEdit,
    iseditMater,
    implement,
    materselect = () => null,
    companyCode
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
        //getSupplierlist()
    }, []);
    const dataSource = {
        store: {
            url: `${baseUrl}/materialSrm/findBySecondaryClassificationAndCompany`,
            params: {
                quickSearchValue: searchValue,
                ///quickSearchProperties: ['materialCode','materialDesc'],
                sortOrders: [
                    {
                        property: '',
                        direction: 'DESC'
                    }
                ],
                secondaryClassificationCode:materielCategoryCode,
                companyCodeList:companyCode
            },
            type: 'POST'
        }
    }
    function getSupplierlist() {
        console.log(materielCategoryCode)
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
    return (
        <Modal
            width={1000}
            className={"choose-supplier"}
            centered
            destroyOnClose={true}
            maskClosable={false}
            title={"供应商推荐准入信息"}
            visible={visible}
            onCancel={() => handleModalVisible(false)}
            onOk={handleOk}
        >
            <div>
                <Row>
                    <Col span={10}>
                        <Item {...formLayout} label='公司名称' >
                            {
                                getFieldDecorator('supplierVo.name', {
                                    initialValue: '',
                                })(
                                    <Input />
                                        
                                )}
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='采购组织名称' {...formLayout}>
                            {
                                getFieldDecorator("smSupplierName", {
                                    initialValue: '',
                                })(
                                    <Input disabled />
                                )
                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Item label='供应商名称' {...formLayout}>
                            {
                                getFieldDecorator("createdDate", {
                                    initialValue: '',
                                })(
                                    <Input disabled />
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='原厂名称' {...formLayout}>
                            {
                                getFieldDecorator("createdDate", {
                                    initialValue: '',
                                })(
                                    <Input disabled />
                                )
                            }
                        </Item>
                    </Col>
                </Row>
            </div>
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
