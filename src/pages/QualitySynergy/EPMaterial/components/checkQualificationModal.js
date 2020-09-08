import React, { Component, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar } from 'suid';

class EnvironmentProDemandList extends Component {
    constructor(props) {
        super(props)
        this.state={
            dataList: [{id: 1}],
            loading: false
        }
        this.columns = [
            { title: '行号', dataIndex: 'name', ellipsis: true, align: 'center' },
            { title: '供应商代码', dataIndex: 'name1', ellipsis: true, align: 'center' },
            { title: '供应商名称', dataIndex: 'name2', ellipsis: true, align: 'center', width: 120},
            { title: '供应商资质文件', dataIndex: 'name3', ellipsis: true, align: 'center'},
        ]
    }
    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }
    showModal = () => {
        this.setState({visible: true})
    }
    hiddenModal = () => {
        this.setState({visible: false})
    }
    render() {
        const { dataList, loading, visible } = this.state;
        // const { visible, hidden } = this.props;
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
                        dataSource={dataList}
                        columns={this.columns}
                    />
                </ScrollBar>
            </ExtModal>
        </Fragment>
    }
}
export default EnvironmentProDemandList