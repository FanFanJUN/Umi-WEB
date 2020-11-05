import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Icon, Input, Col, message, Radio, Button } from 'antd';
import moment from 'moment';
import { utils, ExtTable, ComboList } from 'suid';
import { AddButtonWrapper } from './style'
import { compareData, getLineCode ,checkDateWithHalfYear,
    checkDateWithYearAdd3,checkDateWithYearAdd,getMaxLineNum} from '@/utils/index'
import {dataTransfer} from '../CommonUtils'
import RangeDatePicker from './RangeDatePicker'
// import {ComboAttachment } from '@/components';
import UploadFile from '../../../components/Upload/index'
import '../../../components/upload.css'
const { create } = Form;
const FormItem = Form.Item;
let lineCode = 1;
let keys = -1;
let initIndex;
const QualificationRef = forwardRef(({
    form,
    initialValue = {},
    isView = false,
    editData = {},
    isOverseas = null
}, ref) => {
    useImperativeHandle(ref, () => ({
        getqualificationsInfo,
        qualicaTemporary,
        setHeaderFields,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configure, setConfigure] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    //const [keys, setKey] = useState();
    //const [lineCode, setLineCode] = useState(0);
    //const [initIndex, setInitIndex] = useState();
    const { attachment = null } = initialValue;
    
    useEffect(() => {
        getqualifications(editData);
    }, [editData])
    //资质
    function getqualifications(val) {
        lineCode = 1;
        let editData = val;
        let initData = [
            {   key: 0, 
                lineCode:getLineCode(lineCode++), 
                'qualificationType': '营业执照',
                'qualificationName': '营业执照' 
            },
            {
                key: 1,
                lineCode: getLineCode(lineCode++),
                'qualificationType': '法人身份证明书',
                'qualificationName': '法人身份证明书',
            },
            {
                key: 2,
                lineCode: getLineCode(lineCode++),
                'qualificationType': '法定代表人授权委托书',
                'qualificationName': '法定代表人授权委托书',
            },
            {   key: 3, 
                lineCode: getLineCode(lineCode++), 
                'qualificationType': '公司印鉴信息', 
                'qualificationName': '公司印鉴信息' 
            },
            {
                key: 4,
                lineCode: getLineCode(lineCode++),
                'qualificationType': '审计报告或财务报表',
                'qualificationName': '审计报告',
            },
        ];
        // console.log(lineCode)
        // console.log(initData)
        setDataSource(initData)
        keys = initData.length - 1;
        initIndex = initData.length;
        let itemArr = [],modifydata= [];
        if (editData && editData.genCertVos && editData.genCertVos.length > 0) {
            editData.genCertVos.map((item,index) => {
                if (index === 0 && item.qualificationType === '入网须知') {
                    modifydata = editData.genCertVos.concat(editData.genCertVos.shift())
                }else {
                    modifydata = editData.genCertVos
                }
                
            });
            modifydata = modifydata.filter(item => item.qualificationType !== '入网须知');
            modifydata.sort(compare("key"));
            if (modifydata.length > 0) {
                modifydata.map((item,index) => {
                    itemArr.push({
                        key: index,
                        id: item.id,
                        lineCode: item.lineCode,
                        qualificationType: item.qualificationType,
                        refId: item.refId,
                        startDate: item.startDate,
                        endDate:item.endDate,
                        certificateNo: item.certificateNo,
                        institution: item.institution,
                        attachments:item.attachments
                    });
                })
                initData = itemArr;
                initData = initData.filter(item => item.qualificationType !== '入网须知');
                let maxLineNum = getMaxLineNum(initData);
                lineCode = maxLineNum + 1;
                keys = initData.length - 1;
                setDataSource(initData)
            }else {
                setDataSource(initData)
            }
            
        }
        
    }
    function compare (prop) {
        return function(a,b) {
            var value1 = a[prop];
            var value2 = b[prop];
            return value1 - value2;
        }
    }
    let columns = [];
    if (!isView) {
        columns.push(
            {
                title: '操作',
                width: 50,
                align: 'center',
                dataIndex:'operation',
                render: (text, record, index) => {
                    return <div>
                        {
                            record.key > initIndex - 1 ? <Icon
                                type={'delete'}
                                title={'删除'}
                                onClick={() => handleDelete(record.key)}
                            /> : null
                        }
                    </div>;
                },
            },
        );
    }
    const tableProps = [
        ...columns,
        {
            title: '行号',
            dataIndex: 'lineCode',
            align: 'center',
            width: 80,
        },
        {
            title: '资质文件类型',
            dataIndex: 'qualificationType',
            width: 200,
            render: (text, record, index) => {
                if (isView) {
                    return text;
                }
                return <FormItem style={{ marginBottom: 0 }}>
                    {
                        getFieldDecorator(`qualificationType[${record.key}]`, {
                            initialValue: record.qualificationType,
                            rules: [{
                                required: record.key > initIndex - 1,
                                message: '请输入资质文件类型!',
                            }],
                        })(
                            record.key > initIndex - 1 ?
                                (isView ? (!compareData(record.endDate) ?
                                    <span style={{ color: 'red' }}>{text}</span>
                                    : <span>{text}</span>) :
                                    <Input name={record.key} placeholder={'请输入资质文件类型'}/>) :
                                (
                                    !compareData(record.endDate) ?
                                    <span style={{ color: 'red' }}>{text}
                                        <Input style={{ display: 'none' }}/></span> :
                                        (record.key === 0 ? 
                                            
                                            <span>
                                                <label class="ant-form-item-required" title=""></label>
                                                {text}<Input style={{ display: 'none' }}/>
                                            </span> : 
                                            <span>
                                                {text}<Input style={{ display: 'none' }}/>
                                            </span>
                                        )
                                    
                                ),
                        )
                    }

                </FormItem>;
            },

        },
        {
            title: '证书编号',
            dataIndex: 'certificateNo',
            width: 280,
            render: (text, record, index) => {
                if (isView) {
                    return text;
                }
                return <FormItem style={{ marginBottom: 0 }}>
                    {
                        getFieldDecorator(`certificateNo[${record.key}]`, {
                            initialValue: record.certificateNo,
                            rules: [{
                                required: record.key === 0,
                                message: '请输入证书编号!',
                            }],
                        })(
                            <Input placeholder={'若没有，则填写无'}/>,
                        )}
                </FormItem>;
            },
        },
        {
            title: '认证机构',
            dataIndex: 'institution',
            width: 280,
            render: (text, record, index) => {
                if (isView) {
                    return text;
                }
                return <FormItem style={{ marginBottom: 0 }}>
                    {
                        getFieldDecorator(`institution[${record.key}]`, {
                            initialValue: record.institution,
                            rules: [{
                                required: record.key === 0,
                                message: '请输入认证机构!',
                            }],
                        })(
                            <Input placeholder={'若没有，则填写无'}/>,
                        )}
                </FormItem>;
            },
        },
        {
            title: '有效期',
            dataIndex: 'date',
            width: 300,
            align: 'center',
            render: (text, record, index) => {
                if (isView) {
                    return <span>{record.startDate ? record.startDate + '~' + record.endDate : ''}</span>;
                }
                let date = new Date();
                let startDate = moment(date.toString().substring(11, 15) + '-01-01');
                let endDate = moment((parseInt(date.toString().substring(11, 15)) + 1) + '-06-01');
                return <FormItem style={{ marginBottom: 0 }}>
                    {
                        getFieldDecorator(`date[${record.key}]`, {
                            initialValue:  record.startDate ? {
                                    startDate: moment(record.startDate),
                                    endDate: moment(record.endDate),
                                } : '',
                            rules: [{
                                required: record.key === 0,
                                message: '请设置有效期',
                            },
                                { validator: record.key === 4 ? checkDateWithHalfYear : record.key === 1 ? checkDateWithYearAdd3 : checkDateWithYearAdd }],
                        })(
                            <RangeDatePicker type={record.key === 4 ? 'endTime' : 'currentTime'}
                            />,
                        )}
                </FormItem>;
            },
        },
        {
            title: '附件',
            dataIndex: 'attachments',
            align: 'center',
            width: 330,
            render: (text, record, index) => {
                return <FormItem style={{ textAlign: 'left' }} style={{ marginBottom: 0 }}>
                    {
                        getFieldDecorator(`attachments[${record.key}]`, {
                            initialValue: '',
                            rules: [{
                                required: record.key === 0,
                                message: '请选择附件!',
                            }],
                        })(
                            <UploadFile
                                title={'附件上传'}
                                maxSize={10}
                                type={isView ? 'show' : ''}
                                entityId={record.id || null}
                                accessType={['pdf', 'jpg', 'png']}
                                warning={'仅支持pdf,jpg,png格式，文件大小不超过10M'}
                            />,
                        )}
                    {!isView && record.qualificationType === '法人身份证明书' &&
                    <a href='/srm-se-web/供应商法定代表人身份证明书.docx'>模板下载</a>}
                    {!isView && record.qualificationType === '法定代表人授权委托书' &&
                    <a href='/srm-se-web/供应商法定代表人授权委托书.docx'>模板下载</a>}
                    {!isView && record.qualificationType === '公司印鉴信息' &&
                    <a href='/srm-se-web/供应商预留印鉴模板.docx'>模板下载</a>}
                </FormItem>;

            },
        },
    ].map(item => ({ ...item, align: 'center' }))
    // 新增
    function handleAdd() {
        //console.log(keys)
        const newData = [...dataSource, { key: keys + 1, lineCode: getLineCode(lineCode) }];
        //setLineCode(lineCode + 1)
        lineCode++;
        keys ++ ;
        //console.log(newData)
        setDataSource(newData)
    };
    //删除
    function handleDelete(key) {
        //console.log(key)
        //const { dataSource } = this.state;
        const newData = dataSource.filter((item) => item.key !== key);
        //setLineCode(lineCode - 1);
        lineCode--;
        for (let i = 0; i < newData.length; i++) {
            newData[i].lineCode = getLineCode(i + 1);
        }
        setDataSource(newData)
    };
    // 暂存
    function qualicaTemporary() {
        let result = {};
        form.validateFieldsAndScroll((err, values) => {
            if (values) {
                result = dataTransfer(dataSource, values);
            }
        });
        return result;
    }
    // 获取表单值
    function getqualificationsInfo() {
        let result = false;
		form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                result = dataTransfer(dataSource, values);
            }
        });
        return result;
    }
    // 设置所有表格参数
	const setHeaderFields = (fields) => {
		//const { attachmentId = null, ...fs } = fields;
		// setAttachment(attachmentId)
		// setFieldsValue(fs)
	  }
    return (
        <div>
            <div>
                <div>
                    <ExtTable
                        allowCancelSelect
                        columns={tableProps}
                        dataSource={dataSource}
                        showSearch={false}
                        pagination={{
                            hideOnSinglePage: true,
                            disabled: false,
                            pageSize: 100,
                        }}
                        checkbox={false}
                        rowKey={(item) => `row-${item.key}`}
                    />
                    <AddButtonWrapper>
                        <Button hidden={isView} icon={'plus'} type="dashed" style={{ width: '50%',marginBottom:'10px' }}
                            onClick={handleAdd}>新增</Button>
                    </AddButtonWrapper>
                </div>
            </div>
        </div>
    )
}
)
const CommonForm = create()(QualificationRef)

export default CommonForm