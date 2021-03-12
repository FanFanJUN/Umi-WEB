// 批量导入弹框
import { useEffect, useState, useRef } from 'react';
import { Form, Col, Row, Upload, Button, message, Modal } from 'antd';
import { ExtModal } from 'suid'
import styles from '../index.less'
import SplitPartsTable from './SplitPartsTable';
import MaterialTable from './MaterialTable';
import TestRecordsTable from './TestRecordsTable';
import { BASE_URL } from '../../../../../utils/constants';
import moment from 'moment';
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const { create, Item: FormItem } = Form;

export default function ({ visible, setVisible, environmentalProtectionCode, handleInsert }) {
  const splitRef = useRef(null)
  const [selectedSplitData, setSelectedSpilt] = useState({})
  const [splitDataList, setSplitDataList] = useState([]);
  const [importTag, setImportTag] = useState(true);

  function handleOk () {
    if (!importTag) {
      handleInsert(splitDataList);
      handleCancle();
    }
  }

  const fileUpload = ({ file }) => {
    if (file.status === 'done') {
      if (file.response && file.response.data) {
        let tag = true;
        let result = file.response.data.map((item, index) => {
          tag = tag && item.importStatus
          item.voList = item.materialConstituentBoList;
          item.testLogVoList = item.epDataFillTestLogBoList;
          item.rowKey = index;
          // 设置时间
          let effectiveEndDate = splitRef.current.getEndDate(item.testReportInfos)
          return { ...item, ...effectiveEndDate };
        })
        setImportTag(!tag);
        setSplitDataList(result);
      } else if (file.response && file.response.msg) {
        message.error(file.response.msg)
      } else {
        message.error('未找到数据')
      }
    }
  }
  const beforeUpload = (file) => {
    const xsl = file.name.toLocaleLowerCase().includes('xls') || file.name.includes('xlsx');
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
    return {
      'Authorization': auth ? (auth.accessToken ? auth.accessToken : '') : ''
    }
  }
  const handleCancle = () => {
    setSelectedSpilt({});
    setSplitDataList([]);
    setVisible(false);
  }
  return <ExtModal
    centered
    destroyOnClose
    width="90%"
    height="800px"
    onCancel={() => { handleCancle() }}
    footer={[
      <Button type="primary" onClick={() => { handleOk() }} disabled={importTag}>导入</Button>
    ]}
    visible={visible}
    title="MCD表数据综合导入"
  >
    <Row style={{ marginBottom: 6 }}>
      <Upload
        action={`${window.location.origin + BASE_URL}/srm-sam-service/epController/newImportData`}
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
      <a key='template' href={`${DEVELOPER_ENV === 'true' ? '' : '/react-srm-sm-web'}/templates/MCD表批导模板V4.0.xlsx`}>下载模版</a>
    </Row>
    <Row>
      <Col span={12} className={styles.rl}>
        <SplitPartsTable
          wrappedComponentRef={splitRef}
          dataList={splitDataList}
          setSelectedSpilt={setSelectedSpilt}
          setSplitDataList={setSplitDataList}
          isView={true}
          isImport={true}
        />
      </Col>
      <Col span={12} className={styles.ll}>
        <Row>
          <MaterialTable
            dataList={splitDataList}
            selectedSplitData={selectedSplitData}
            isView={true}
            isImport={true}
          />
        </Row>
        <Row>
          <TestRecordsTable
            dataList={splitDataList}
            selectedSplitData={selectedSplitData}
            isView={true}
            isImport={true}
          />
        </Row>
      </Col>
    </Row>
  </ExtModal>
}