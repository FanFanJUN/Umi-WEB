import React, { useImperativeHandle, forwardRef, useState, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar } from 'suid';
import { Form } from 'antd';
import Upload from '../../compoent/Upload';
import { recommendUrl } from '@/utils/commonUrl';
const { create, Item: FormItem } = Form;

const EnvironmentProDemandList = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const columns = [
        { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, align: 'center' },
        { title: '供应商名称', dataIndex: 'supplierName', ellipsis: true, align: 'center', width: 120 },
        {
            title: '供应商资质文件', dataIndex: 'documentInfo', ellipsis: true, align: 'center', render: (text) => {
                return <Upload entityId={text?text:[]} type="show" />
            }
        },
    ]
        return <Fragment>
            <ExtModal
                destroyOnClose
                onCancel={()=>{setVisible(false)}}
                visible={visible}
                centered
                width={640}
                maskClosable={false}
                footer={null}
                title="查看供应商资质"
            >
                <ScrollBar>
                    <ExtTable
                        loading={loading}
                        showSearch={true}
                        remotePaging={true}
                        size="small"
                        searchPlaceHolder="请输入供应商代码或名称查询"
                        columns={columns}
                        store={{
                            url: `${recommendUrl}/api/epSupplierAptitudeService/findByPage`,
                            type: 'POST',
                        }}
                    />
                </ScrollBar>
            </ExtModal>
        </Fragment>
})
export default create()(EnvironmentProDemandList)