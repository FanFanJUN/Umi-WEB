import React, { forwardRef, useImperativeHandle, useEffect, useRef ,useState} from 'react';
import { Modal, Form, Button, message, Input,Icon } from 'antd';
import { Fieldclassification ,countryListConfig} from '@/utils/commonProps'
import { ExtTable } from 'suid';
import { isEmpty } from '@/utils';
import { smBaseUrl } from '@/utils/commonUrl';
import Header from '@/components/Header';
import styles from '../index.less';
const { create } = Form;
let keys = 0;
const getSeeMaterRef = forwardRef(({
    form,
    materiel,
    determine = () => null,
    isView
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
    const [dataSource, setDataSource] = useState([]);
    const [visible, setvisible] = useState(false);
    const [current, setcurrent] = useState([]);
    useEffect(() => {
        handleSeeMater(materiel)
    }, [materiel]);

    function handleSeeMater (val) {
        let newdata = []
        if (val.length > 0) {
            val.map(item => {
                if (!isEmpty(item.smPcnAnalysisMaterielVoList)) {
                    item.smPcnAnalysisMaterielVoList.map(items => {
                        keys ++;
                        newdata.push({
                            key: keys,
                            ...items
                        }) 
                    })   
                }
            })
            setDataSource(newdata)
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
        let handledelete = tableRef.current.data;
        materiel[0].smPcnAnalysisMaterielVoList = handledelete
        determine(materiel)
        handleModalVisible(false)
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
    // 删除
    function handleDelete(key) {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData)
    }
    let columns = [];
    if (!isView) {
        columns.push(
            {
                title: "操作",
                width: 50,
                dataIndex: 'operation',
                    render: (text, record, index) => {
                        return <div>
                            {
                                dataSource.length > 0 ? <Icon
                                    type={'delete'}
                                    title={'删除'}
                                    onClick={() => handleDelete(record.key)}
                                /> : null
                            }
                        </div>;
                    }
            },
        );
      }
    const tableProps = [
        ...columns,
        {
            title: "物料分类代码",
            width: 150,
            dataIndex: "materielTypeCode"
        },
        {
            title: "物料分类",
            width: 260,
            dataIndex: "materielName"
        },
        {
            title: "物料代码",
            width: 160,
            dataIndex: "materielCode"
        },
        {
            title: "物料描述",
            width: 280,
            dataIndex: "materielTypeName"
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
            title={"查看物料"}
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
                columns={tableProps}
                showSearch={false}
                ref={tableRef}
                rowKey={(item) => item.key}
                pagination={{
                    hideOnSinglePage: true,
                    disabled: false,
                    pageSize: 100,
                }}
                allowCancelSelect={true}
                size='small'
                remotePaging={true}
                ellipsis={false}
                saveData={false}
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                dataSource={dataSource}
            />
      </Modal>
    );
},
);

export default create()(getSeeMaterRef);
