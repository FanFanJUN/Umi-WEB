// 批量导入弹框
import { useEffect, useState, useRef } from 'react';
import { Form, Col, Row, Upload, Button, message, Modal } from 'antd';
import { ExtModal } from 'suid'
import styles from '../index.less'
import SplitPartsTable from './SplitPartsTable';
import MaterialTable from './MaterialTable';
import TestRecordsTable from './TestRecordsTable';
import { recommendUrl } from '../../../../../utils/commonUrl'
import { BASE_URL } from '../../../../../utils/constants';
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const { create, Item: FormItem } = Form;

export default function ({ visible, setVisible, environmentalProtectionCode}) {
    const splitRef = useRef(null)
    const [selectedSplitData, setSelectedSpilt] = useState({})
    const [splitDataList, setSplitDataList] = useState([]);
    function handleOk() {
        console.log('确定')
    }
    const fileUpload = ({file}) => {
        if (file.status === 'done') {
            if (file.response && file.response.data) {
                let msg = []
                let result = file.response.data.map((item, index) => {
                    if (!item.importStatus) {
                        msg.push(<span key={'import_error_' + index} style={{display: 'block'}}>
                        {'第' + (index + 1) + '行:' + JSON.stringify(item.failInfo) + ''}</span>)
                    }else{
                        item.rowKey=index;
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
                console.log('result', result)
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
        return xsl
    }
    const getHeaders = () => {
        let auth;
        try {
            auth = JSON.parse(sessionStorage.getItem('Authorization'));
        } catch (e) {
        }
        console.log('auth', auth)
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
                action={`${window.location.origin + BASE_URL}/srm-sam-service/epController/importData`}
                onChange={fileUpload}
                headers={getHeaders()}
                data={{
                    code: environmentalProtectionCode
                }}
                beforeUpload={beforeUpload}
                showUploadList={false}
            >
                <Button style={{ marginRight: 15, marginLeft: 15, marginBottom: 6 }}>上传</Button>
            </Upload>
            <a key='template' href={`${DEVELOPER_ENV === 'true' ? '' : '/react-srm-sm-web'}/templates/MCD表批导模板V2.0.xlsx`}>下载模版</a>
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