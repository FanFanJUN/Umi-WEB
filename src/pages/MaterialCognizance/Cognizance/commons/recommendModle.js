import React, { forwardRef, useImperativeHandle, useEffect, useRef ,useState} from 'react';
import { Modal, Form, Button, message, Input,Row,Col ,Checkbox} from 'antd';
import { Fieldclassification ,countryListConfig} from '@/utils/commonProps'
import { ExtTable ,ComboList} from 'suid';
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
const getRecommendRef = forwardRef(({
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
    const [onlyMe, setOnlyMe] = useState(true);
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
        // if (selectedRowKeys.length === 0) {
        //     message.error('请选择一行数据！');
        // } else {
        //     //隐藏供应商选择框
        //     if (isEdit) {
        //        iseditMater[0].smPcnAnalysisMaterielVoList = selectedRows;
        //         materselect(iseditMater)
        //     } else if (implement) {
        //         materselect(selectedRows)
        //     }else {
        //         iseditMater[0].smPcnAnalysisMaterielVoList = selectedRows
        //         materselect(iseditMater)
        //     }
        //     handleModalVisible(false);
        //     cleanSelectedRecord();
        // }
        handleModalVisible(false);
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
       // 仅我的
    function handleOnlyMeChange(e) {
        setOnlyMe(e.target.checked)
        // e.target.checked === true ? setJurisdiction(1) : setJurisdiction(0)
        // uploadTable();
    }
    const columns = [
          {
            title: "审核状态",
            width: 150,
            dataIndex: "codePath"
          },
          {
            title: "公司领导审核状态",
            width: 260,
            dataIndex: "namePath"
          },
          {
            title: "准入单号",
            width: 160,
            dataIndex: "materialCode"
          },
          {
            title: "物料分类",
            width: 280,
            dataIndex: "materialDesc"
          },
          {
            title: "供应商代码",
            width: 150,
            dataIndex: "codePath"
          },
          {
            title: "供应商名称",
            width: 260,
            dataIndex: "namePath"
          },
          {
            title: "原厂代码",
            width: 160,
            dataIndex: "materialCode"
          },
          {
            title: "原厂名称",
            width: 280,
            dataIndex: "materialDesc"
          },
          {
            title: "公司代码",
            width: 150,
            dataIndex: "codePath"
          },
          {
            title: "公司名称",
            width: 260,
            dataIndex: "namePath"
          },
          {
            title: "采购组织代码",
            width: 160,
            dataIndex: "materialCode"
          },
          {
            title: "采购组织名称",
            width: 280,
            dataIndex: "materialDesc"
          },
          {
            title: "认定物料类别",
            width: 160,
            dataIndex: "materialCode"
          },
          {
            title: "认定类型",
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
                        <Item {...formLayout} label='推荐准入单' >
                            {
                                getFieldDecorator('supplierVo.name', {
                                    initialValue: '',
                                })(
                                    <Input />
                                        
                                )}
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='供应商名称' {...formLayout}>
                            {
                                getFieldDecorator("smSupplierName", {
                                    initialValue: '',
                                })(
                                    <Input />
                                )
                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Item label='物料分类' {...formLayout}>
                            {
                                getFieldDecorator("createdDate", {
                                    initialValue: '',
                                })(
                                    <ComboList
                                        style={{ width: 280 }}
                                        store={{
                                            autoLoad: false,
                                            url: `${baseUrl}/api/materialSrmService/findBySecondaryClassificationListAndCompany`,
                                            params: {
                                                secondaryClassificationCodes:[],
                                                companyCodeList: []
                                            },
                                            type: 'POST'
                                        }}
                                        rowKey="name"
                                            reader={{
                                            name: 'remark',
                                            description: 'name',
                                        }}
                                    />
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='仅我的' {...formLayout}>
                            {
                                getFieldDecorator("createdDate", {
                                    initialValue: '',
                                })(
                                    <Checkbox className={styles.btn} onChange={handleOnlyMeChange} checked={onlyMe} ></Checkbox>
                                    
                                )
                            }
                            <Button type="primary">查询</Button>
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

export default create()(getRecommendRef);
