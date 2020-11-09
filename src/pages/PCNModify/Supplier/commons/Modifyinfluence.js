import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, utils, ComboList, AuthButton } from 'suid';
import { Form, Button, message, Radio, Modal ,Input} from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import Header from '@/components/Header';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import styles from '../index.less';
import InfluenceMaterielModal from './InfluenceMaterielModal'
import MaterielModal from './MaterielModal'
import SeeMaterielModal from './SeeMaterielModal'
import {Safetyregulationslist,Strategicprocurementlist} from '../../commonProps'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { create } = Form;
const FormItem = Form.Item;
const { authAction, storage } = utils;
let keys = 0,matkey = 0;
let handlematers = [],strategy = [];
const ModifyinfluenceRef = forwardRef(({
    form,
    isView,
    editformData = [],
    headerInfo,
    isEdit,
    alone
}, ref) => {
    useImperativeHandle(ref, () => ({
        getmodifyanalyform,
        form
    }));
    const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll } = form;
    const tabformRef = useRef(null)
    const getModelRef = useRef(null)
    const getMatermodRef = useRef(null)
    const getSeeMaterRef = useRef(null)
    const [dataSource, setDataSource] = useState([]);
    const [selectRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [attachId, setAttachId] = useState('')
    const [materiel, setmateriel] = useState([])
    const [materielid, setmaterielid] = useState('')
    const [companyCode, setCompanyCode] = useState('')
    const [materieldetailsid, setmaterieldetailsid] = useState('')
    const [seemateriel, setSeemateriel] = useState('')
    useEffect(() => {
        hanldModify(editformData)
    }, [editformData])

    let columns = [];
    if (alone) {
        columns.push(
            {
                title: "确认结果",
                width: 100,
                dataIndex: 'pcnResult',
                render: function (text, record, row) {
                    if (text === 0) {
                        return <div>同意</div>;
                    } else if (text === 1){
                        return <div className="successColor">不同意</div>;
                    }else {
                        return <div></div>;
                    }
                },
            },
        );
    }
    const tableProps = [
        {
            title: '原厂代码',
            dataIndex: 'smOriginalFactoryCode',
            align: 'center',
            width: 80
        },
        {
            title: '原厂名称',
            dataIndex: 'smOriginalFactoryName',
            align: 'center',
            width: 220,
        },
        {
            title: '物料分类',
            dataIndex: 'materielCategoryId',
            align: 'center',
            width: 160,
        },
        {
            title: '公司代码',
            align: 'center',
            dataIndex: 'companyCode',
            width: 160,
        },
        {
            title: '公司名称',
            align: 'center',
            dataIndex: 'companyName',
            width: 220,
        },
        {
            title: '采购组织代码',
            dataIndex: 'purchaseOrgCode',
            align: 'center',
            width: 200,
        },
        {
            title: '采购组织名称',
            dataIndex: 'purchaseOrgName',
            align: 'center',
            width: 200,
        },
        {
            title: '是否安规件',
            dataIndex: 'smPcnPartName',
            align: 'center',
            width: 160,
            render: (text, record, index) => {
                if (isView) {
                    return record.smPcnPartName;
                }
                return <span>
                    <FormItem style={{ marginBottom: 0 }}>
                        {
                            getFieldDecorator(`smPcnPart[${index}]`,{initialValue: record ? record.smPcnPart : ''}),
                            getFieldDecorator(`smPcnPartName[${index}]`, {
                                initialValue: record ? record.smPcnPartName : '',
                                rules: [{ required: true, message: '请选择安规件!', whitespace: true }],
                            })( 
                                <ComboList 
                                    form={form}
                                    {...Safetyregulationslist}
                                    showSearch={false}
                                    afterSelect={afterSelect}
                                    name={`smPcnPartName[${index}]`}
                                    field={[`smPcnPart[${index}]`]}
                                />
                            )
                        }
                    </FormItem>
                </span>;
            }
        },
        {
            title: '战略采购',
            dataIndex: 'smPcnStrategicName',
            align: 'center',
            width: 220,
            render: (text, record, index) => {
                if (isView) {
                    return record.smPcnStrategicName;
                }
                return <span>
                    <FormItem style={{ marginBottom: 0 }}>
                        {
                            getFieldDecorator(`smPcnStrategicId[${index}]`,{initialValue: record ? record.smPcnStrategicId : ''}),
                            getFieldDecorator(`smPcnStrategicCode[${index}]`,{initialValue: record ? record.smPcnStrategicCode : ''}),
                            getFieldDecorator(`smPcnStrategicName[${index}]`, {
                                initialValue: record ? record.smPcnStrategicName : '',
                                rules: [{ required: true, message: '请选择战略采购!'}],
                            })( 
                                <ComboList 
                                    form={form}
                                    {...Strategicprocurementlist}
                                    showSearch={true}
                                    style={{ width: '100%' }}
                                    //afterSelect={afterSelect}
                                    name={`smPcnStrategicName[${index}]`}
                                    field={[`smPcnStrategicId[${index}]`,`smPcnStrategicCode[${index}]`]}
                                />
                            )
                        }
                    </FormItem>
                </span>;
            }
        },
        ...columns,
    ].map(_ => ({ ..._, align: 'center' }))
    const empty = selectRowKeys.length === 0;
    // 编辑处理数据
    function hanldModify(val) {
        if (isEdit) {
            let newsdata = [],MaterielVoList = [];
            val.map((item, index) => {
                let Name;keys ++ ;
                if (item.smPcnPart === 0) {
                    Name = '是'
                }else {
                    Name = '否'
                }
                newsdata.push({
                    ...item,
                    smPcnPartName: Name,
                    smPcnPart: item.smPcnPart,
                    key: keys
                })
                //console.log(newsdata)
                setDataSource(newsdata);
                // item.smPcnAnalysisMaterielVoList.map((item, index) => {
                //     MaterielVoList.push({
                //         ...item
                //     })
                //     handlematers.push(MaterielVoList)
                //     setmateriel(handlematers)
                // })
            })

        }
    }
    // 新增的
    function selectanalysis(val) {
        let newsdata = [];
        [...newsdata] = dataSource;
        if (newsdata.length > 0) {
            let result = false
            newsdata.map(item =>{
                val.map((items,index) => {
                    if (item.materielCategoryCode === items.materielCategoryCode && 
                        item.companyCode === items.corporation.code && 
                        item.purchaseOrgCode === items.purchaseOrgCode){
                        val.splice(index,1)
                        result = true
                    }    
                })
               
            })
            if (result) {
                message.error('当前数据已存在，请重新选择！')
                addTodata(val)
            }else {
                addTodata(val)
            }
        }else {
            addTodata(val)
        }
        
    }
    // 新增添加数据
    function addTodata(val) {
        let newsdata = [];
        [...newsdata] = dataSource;
        val.map(ins => {
            keys ++ ;
            newsdata.push({
                key: keys,
                smOriginalFactoryCode:ins.originSupplierCode,
                smOriginalFactoryName:ins.originSupplierName,
                materielCategoryId: ins.materielCategory && ins.materielCategory.name,
                companyCode: ins.corporation.code,
                companyName: ins.corporation.name,
                purchaseOrgCode: ins.purchaseOrgCode,
                purchaseOrgName: ins.purchaseOrg.name,
                materielCategoryCode: ins.materielCategoryCode,
                smPcnAnalysisMaterielVoList:[]
            })
        })
        setDataSource(newsdata);
        uploadTable()
    }
    // 获取选择的物料
    function materselect(val) {
        let newsdata = [];
        val.map((item) => {
            item.smPcnAnalysisMaterielVoList.map((items) => {
                newsdata.push({
                    key: matkey++,
                    id:items.id,
                    materielTypeCode: items.codePath || items.materielTypeCode,
                    materielName: items.namePath || items.materielName,
                    materielCode: items.materialCode || items.materielCode,
                    materielTypeName: items.materialDesc || items.materielTypeName
                })
            })
            item.smPcnAnalysisMaterielVoList = newsdata
        })
        handlematers.push(val)
        setmateriel(handlematers)
        uploadTable()
    }
    // 删除物料操作
    function determine(val) {
        console.log(val)
        handlematers.forEach((item,index) => {
            item.forEach((items) => {
                val.forEach((vals) => {
                    if (items.key === vals.key) {
                        handlematers[index] = val
                    }   
                }) 
            })
            
        })
        uploadTable()
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
        setSeemateriel(rows)
    }
    // 物料新增
    function showModal() {
        getModelRef.current.handleModalVisible(true);
    }
    // 选择物料
    function showMateriel() {
        let materid = [];
        let matercode = [];
        matercode.push(selectedRows[0].companyCode)
        materid.push(selectedRows[0].materielCategoryCode)
        setmaterielid(materid)
        setCompanyCode(matercode)
        getMatermodRef.current.handleModalVisible(true);
    }
    // 查看物料
    function showSeeMateriel() {
        getSeeMaterRef.current.handleModalVisible(true);
    }
    // 表单删除
    async function handleRemove() {
        const filterData = dataSource.filter(item => item.key !== selectedRows[0].key);
        handlematers.map((item,index) => {
            item.map((items) => {
                if (items.key === selectedRows[0].key) {
                    handlematers[index] = [];
                } 
            })
        })
        setDataSource(filterData)
        uploadTable()
    }

    // 获取表单值
    function getmodifyanalyform() {
        let result = false;
        const analysis = tabformRef.current.data;
        if (!analysis || analysis.length === 0) {
            return false;
        }else {
            form.validateFieldsAndScroll((err, values) => {
                console.log(values)
                values.smPcnPart.forEach((item,index) => {
                    analysis[index].smPcnPart = values.smPcnPart[index]
                })
                
                values.smPcnStrategicId.forEach((item,index) => {
                    analysis[index].smPcnStrategicId = values.smPcnStrategicId[index]
                    analysis[index].smPcnStrategicCode = values.smPcnStrategicCode[index]
                    analysis[index].smPcnStrategicName = values.smPcnStrategicName[index]
                })
                if (!err) {
                    console.log(analysis)
                    //result = analysis
                    // analysis.forEach((analy,index) => {
                    //     handlematers.forEach((item,index) => {
                    //         item.forEach((items) => {
                    //             if (analy.key === items.key) {
                    //                 analysis[index].smPcnAnalysisMaterielVoList = item
                    //             }
                    //         })
                            
                    //     })
                    // })
                    result = analysis
                }
                
            })
        }
        return result;
    }
    // 清除选中项
    function uploadTable() {
        tabformRef.current.manualSelectedRows([])
        tabformRef.current.remoteDataRefresh()
    }
    function afterSelect(val) {
        console.log(val)
    }
    const headerleft = (
        <>
            {
                <AuthButton type="primary" className={styles.btn} onClick={() => showModal()}>新增</AuthButton>
            }
            {
                <AuthButton className={styles.btn} disabled={empty} onClick={handleRemove}>删除</AuthButton>
            }
            {
                <AuthButton className={styles.btn} onClick={() => showMateriel()} disabled={empty} >选择物料</AuthButton>
            }
            {
                <AuthButton className={styles.btn} onClick={() => showSeeMateriel()} disabled={empty}>查看物料</AuthButton>
            }
        </>
    );
    // 明细
    const detailsleft = (
        <>
            {
                <AuthButton className={styles.btn} onClick={() => showSeeMateriel()} disabled={empty}>查看物料</AuthButton>
            }
        </>
    );
    return (
        <>
            <div>
                <Header style={{ display: headerInfo === true ? 'none' : 'block', color: 'red' }}
                    left={headerInfo ? detailsleft : headerleft}
                    advanced={false}
                    extra={false}
                />
                <AutoSizeLayout>
                    {
                        (height) => <ExtTable
                            columns={tableProps}
                            showSearch={false}
                            ref={tabformRef}
                            rowKey={(item) => item.key}
                            checkbox={{
                                multiSelect: false
                            }}
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
                        //{...dataSource}
                        />
                    }
                </AutoSizeLayout>
                <div>
                    {/****** 新增 */}
                    <InfluenceMaterielModal
                        modifyanalysis={selectanalysis}
                        wrappedComponentRef={getModelRef}
                    />
                    {/******* 选择物料*/}
                    <MaterielModal
                        materselect={materselect}
                        materielCategoryCode={materielid}
                        companyCode={companyCode}
                        iseditMater={selectedRows} 
                        isEdit={isEdit}
                        wrappedComponentRef={getMatermodRef} 
                    />
                    {/***** 查看物料 */}
                    <SeeMaterielModal
                        determine={determine}
                        materiel={seemateriel}
                        isView={isView} 
                        wrappedComponentRef={getSeeMaterRef} 
                    />
                    
                </div>
            </div>
        </>

    )
}
)
const CommonForm = create()(ModifyinfluenceRef)

export default CommonForm