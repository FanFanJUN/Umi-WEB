// 批量导入弹框
import { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment } from 'react';
import { Form, Col, Row, Upload, Button } from 'antd';
import { ExtModal } from 'suid'
import styles from '../index.less'
import SplitPartsTable from './SplitPartsTable';
import MaterialTable from './MaterialTable';
import TestRecordsTable from './TestRecordsTable';
const { create, Item: FormItem } = Form;

export default function ({ visible, setVisible }) {
    const splitRef = useRef(null)
    const [selectedSplitData, setSelectedSpilt] = useState({})
    const [splitDataList, setSplitDataList] = useState([]);
    function handleOk() {
        console.log('确定')
    }
    const fileUpload = ({file}) => {
        if(file.status !=='uploading'){
            this.setState({loading:false});
        }
        if (file.status === 'done') {
            if (file.response && file.response.data) {
                let msg = []
                let result = file.response.data.map((item, index) => {
                    if (item.msg === null || item.msg === undefined || Object.keys(item.msg).length !== 0) {
                        msg.push(<span key={'import_error_' + index} style={{display: 'block'}}>
                        {'第' + (index + 1) + '行:' + JSON.stringify(item.msg) + ''}</span>)
                    }else{
                        item.index=index;
                        return item;
                    }
                })
                if (msg.length !== 0) {
                    Modal.error({
                        centered: true,
                        content: <div style={{maxHeight: 360, overflow: 'auto'}}>{msg}</div>,
                        title: '错误信息'
                    })
                }
                this.setState({importData: result.filter(item=>item!==undefined)})
            } else if (file.response && file.response.msg) {
                message.error(file.response.msg)
            } else {
                message.error('未找到数据')
            }
        }
    }
    const beforeUpload = (file) => {
        const xsl = file.name.toLocaleLowerCase().includes('xls')||file.name.includes('xlsx');
        if (!xsl) {
            message.error('必须上传模版文件');
        }
        this.setState({loading:true});
        return xsl
    }
    const getHeaders = () => {
        let auth;
        try {
            auth = JSON.parse(localStorage.getItem('Authorization'));
        } catch (e) {
            console.log(e);
        }
        return {
            'Authorization': auth ? (auth.accessToken ? auth.accessToken : '') : ''
        }
    }
    return <ExtModal
        centered
        destroyOnClose
        width="90%"
        height="800px"
        onCancel={() => { setVisible(false) }}
        onOk={() => { handleOk() }}
        visible={visible}
        title="MCD表数据综合导入"
    >
        <Row style={{marginBottom:6}}>
            <Upload
                action={'uploadUrl'}
                onChange={fileUpload}
                headers={getHeaders()}
                beforeUpload={beforeUpload}
                showUploadList={false}
            >
                <Button style={{ marginRight: 15, marginLeft: 15, marginBottom: 6 }}>上传</Button>
            </Upload>
            <a key='downloadTemplate'  href={'this.props.dowloadUrl'}>下载模版</a>
        </Row>
        <Row>
            <Col span={12} className={styles.rl}>
                <SplitPartsTable wrappedComponentRef={splitRef} dataList={splitDataList} setSelectedSpilt={setSelectedSpilt} setSplitDataList={setSplitDataList} isView={true} />
            </Col>
            <Col span={12} className={styles.ll}>
                <Row>
                    <MaterialTable dataList={splitDataList} selectedSplitData={selectedSplitData} isView={true} />
                </Row>
                <Row>
                    <TestRecordsTable
                        dataList={splitDataList}
                        selectedSplitData={selectedSplitData}
                        isView={true}
                    />
                </Row>
            </Col>
        </Row>
    </ExtModal>
}