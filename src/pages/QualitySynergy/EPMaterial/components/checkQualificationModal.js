import React, { Component, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar } from 'suid';
import { Upload } from '@/components';
import { recommendUrl } from '@/utils/commonUrl';

class EnvironmentProDemandList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: [{ id: 1 }],
            loading: false
        }
        this.columns = [
            { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, align: 'center' },
            { title: '供应商名称', dataIndex: 'supplierName', ellipsis: true, align: 'center', width: 120 },
            {
                title: '供应商资质文件', dataIndex: 'aptitudeFileId', ellipsis: true, align: 'center', render: (text) => {
                    return <Upload entityId={text} type="show" />
                }
            },
        ]
    }
    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }
    showModal = () => {
        this.setState({ visible: true })
    }
    hiddenModal = () => {
        this.setState({ visible: false })
    }
    render() {
        const { dataList, loading, visible } = this.state;
        return <Fragment>
            <ExtModal
                destroyOnClose
                onCancel={this.hiddenModal}
                visible={visible}
                centered
                width={640}
                footer={null}
                bodyStyle={{ height: 380, padding: 0 }}
                title="查看供应商资质"
            >
                <ScrollBar>
                    <ExtTable
                        loading={loading}
                        showSearch={true}
                        searchPlaceHolder="请输入供应商代码或名称查询"
                        columns={this.columns}
                        store={{
                            url: `${recommendUrl}/api/epSupplierAptitudeService/findByPage`,
                            type: 'POST',
                        }}
                    />
                </ScrollBar>
            </ExtModal>
        </Fragment>
    }
}
export default EnvironmentProDemandList