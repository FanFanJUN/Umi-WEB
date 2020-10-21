import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, utils, ComboList, AuthButton } from 'suid';
import { Form, Button, message, Radio, Modal ,Input} from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import Header from '@/components/Header';
import ModifyForm from './ModifyForm';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import styles from '../index.less';
import InfluenceMaterielModal from './InfluenceMaterielModal'
import MaterielModal from './MaterielModal'
import SeeMaterielModal from './SeeMaterielModal'
import ModifyinfluenceForm from './ModifyinfluenceForm'
import {Safetyregulationslist,Strategicprocurementlist} from '../../commonProps'
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const FormItem = Form.Item;
const { authAction, storage } = utils;
let keys = 1;
const ModifyinfluenceRef = forwardRef(({
    form,
    isView,
    editData = [],
    headerInfo
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
    const modifyinfluenceFormRef = useRef(null)
    const [dataSource, setDataSource] = useState([]);
    const [selectRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [attachId, setAttachId] = useState('')
    const [visible, setVisible] = useState(false);
    useEffect(() => {

    }, [])

    const columns = [
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
            dataIndex: 'smPcnPart',
            align: 'center',
            width: 160,
            render: (text, record, index) => {
                if (isView) {
                    return record.positionName;
                }
                return <span>
                    <FormItem style={{ marginBottom: 0 }}>
                        {
                            getFieldDecorator(`position[${index}]`),
                            getFieldDecorator(`positionName[${index}]`, {
                                initialValue: record ? record.positionName : '',
                                rules: [{ required: true, message: '请选择安规件!', whitespace: true }],
                            })( 
                                <ComboList 
                                    form={form}
                                    {...Safetyregulationslist}
                                    showSearch={false}
                                    //afterSelect={afterSelect}
                                    name={`positionName[${index}]`}
                                    field={[`position[${index}]`]}
                                />
                            )
                        }
                    </FormItem>
                </span>;
            }
        },
        {
            title: '战略采购',
            dataIndex: 'smPcnStrategicId',
            align: 'center',
            width: 220,
            render: (text, record, index) => {
                if (isView) {
                    return record.positionName;
                }
                return <span>
                    <FormItem style={{ marginBottom: 0 }}>
                        {
                            getFieldDecorator(`position[${index}]`),
                            getFieldDecorator(`positionName[${index}]`, {
                                initialValue: record ? record.positionName : '',
                                rules: [{ required: true, message: '请选择战略采购!', whitespace: true }],
                            })( 
                                <ComboList 
                                    form={form}
                                    {...Strategicprocurementlist}
                                    showSearch={false}
                                    style={{ width: '100%' }}
                                    //afterSelect={afterSelect}
                                    name={`positionName[${index}]`}
                                    field={[`position[${index}]`]}
                                />
                            )
                        }
                    </FormItem>
                </span>;
            }
        }
    ].map(_ => ({ ..._, align: 'center' }))
    const empty = selectRowKeys.length === 0;
    // 新增的
    function selectanalysis(val) {
        let newsdata = [];
        val.map((item, index) => {
            newsdata.push({
                key: keys ++,
                materielCategoryId: item.materielCategory.name,
                companyCode: item.corporation.code,
                companyName: item.corporation.name,
                purchaseOrgCode: item.purchaseOrgCode,
                purchaseOrgName: item.purchaseOrg.name,
            })
            setDataSource(newsdata);
        })
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);;

    }
    // 物料新增
    function showModal() {
        getModelRef.current.handleModalVisible(true);
    }
    // 选择物料
    function showMateriel() {
        getMatermodRef.current.handleModalVisible(true);
    }
    // 查看物料
    function showSeeMateriel() {
        getSeeMaterRef.current.handleModalVisible(true);
    }
    // 删除
    async function handleRemove() {
        const filterData = dataSource.filter(item => item.key !== selectedRows[0].key);
        setDataSource(filterData)
    }

    // 获取表单值
    function getmodifyanalyform() {
        const analysis = tabformRef.current.data;
        const {validateFieldsAndScroll} = modifyinfluenceFormRef.current.form;
        if (!analysis || analysis.length === 0) {
            return false;
        }else {
            validateFieldsAndScroll(async (err, val) => {
                if (!err) {
                    analysis.push(val)
                }else {
                   message.error('影响选择不能为空！');
                   return false;
                }
            })
        }
       
        return analysis;
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
                <AuthButton className={styles.btn} onClick={() => showMateriel()} disabled={empty}>选择物料</AuthButton>
            }
            {
                <AuthButton className={styles.btn} onClick={() => showSeeMateriel()} disabled={empty} >查看物料</AuthButton>
            }
        </>
    );
    return (
        <>
            <div>
                <Header style={{ display: headerInfo === true ? 'none' : 'block', color: 'red' }}
                    left={headerInfo ? '' : headerleft}
                    advanced={false}
                    extra={false}
                />
                <AutoSizeLayout>
                    {
                        (height) => <ExtTable
                            columns={columns}
                            showSearch={false}
                            ref={tabformRef}
                            rowKey={(item) => item.key}
                            checkbox={{
                                multiSelect: false
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
                    <InfluenceMaterielModal
                        modifyanalysis={selectanalysis} 
                        wrappedComponentRef={getModelRef}
                    />
                    <MaterielModal 
                        wrappedComponentRef={getMatermodRef} />

                    <SeeMaterielModal 
                        wrappedComponentRef={getSeeMaterRef} />
                </div>
            </div>
            <div>
                <ModifyinfluenceForm  
                    wrappedComponentRef={modifyinfluenceFormRef}
                    isView={isView} 
                />
            </div>
        </>

    )
}
)
const CommonForm = create()(ModifyinfluenceRef)

export default CommonForm