import React, { Fragment, useImperativeHandle, useRef, useState } from 'react';
import styles from './BaseInfo.less';
import { Col, Form, Modal, Row, Input, Button } from 'antd';
import { ExtTable } from 'suid';
import { baseUrl, smBaseUrl } from '../../../../../utils/commonUrl';
import TechnicalDataModal from './component/TechnicalDataModal';
import moment from 'moment/moment';
import UploadFile from '../../../../../components/Upload';
import { AutoSizeLayout } from '../../../../../components';

const TechnicalData = React.forwardRef((props, ref) => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    dataSource: [
      {
        fileCategoryCode: "1233",
        fileCategoryId: "6FD7F54E-F1B5-11EA-97A4-0242C0A84412",
        fileCategoryName: "ZSDJHFIJ33",
        fileVersion: "v12",
        id: 1,
        sampleRequirementDate: "2020-09-13",
        technicalDataFileId: 'A0CD4CF4F26111EAB7D80242C0A8441D'
      }
    ],
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: '新增技术资料'
  })

  const columns = [
    { title: '文件类别', dataIndex: 'fileType', width: 350 },
    { title: '文件版本', dataIndex: 'fileVersion', width: 350, ellipsis: true, },
    { title: '技术资料附件', dataIndex: 'technicalDataFileId', width: 350, ellipsis: true,render: (v) => <div>查看</div> },
    { title: '样品需求日期', dataIndex: 'sampleRequirementDate', width: 350, ellipsis: true, },
  ].map(item => ({...item, align: 'center'}))

  const handleSelectedRows = (value, rows) => {
    console.log(value, rows);
    setData((v) => ({...v, selectedRowKeys: value, selectRows: rows}))
  }

  const handleBtn = (type) => {
    if (type === 'add') {
      setData((value) => ({...value, visible: true, title: '新增技术资料'}))
    }
  }

  useImperativeHandle(ref, () => ({
    dataSource: data.dataSource
  }))

  const TechnicalDataAdd = (value) => {
    value.id = data.dataSource.length + 1
    console.log(value.sampleRequirementDate)
    value.sampleRequirementDate = moment(value.sampleRequirementDate).format('YYYY-MM-DD')
    setData((v) => ({...v, dataSource: [...v.dataSource, value], visible: false}))
    console.log(value, '技术资料新增')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>技术资料</div>
        <div className={styles.content}>
          <div>
            <Button onClick={() => {handleBtn('add')}} type='primary'>新增</Button>
            <Button disabled={data.selectRows.length !== 1} onClick={() => {handleBtn('edit')}} style={{marginLeft: '5px'}}>编辑</Button>
            <Button disabled={data.selectedRowKeys.length < 1} style={{marginLeft: '5px'}}>删除</Button>
          </div>
          <AutoSizeLayout>
            {
              (h) => <ExtTable
                style={{marginTop: '10px'}}
                rowKey={(v) => v.id}
                height={h}
                bordered
                allowCancelSelect
                showSearch={false}
                remotePaging
                checkbox={{ multiSelect: false }}
                size='small'
                onSelectRow={handleSelectedRows}
                selectedRowKeys={data.selectedRowKeys}
                columns={columns}
                ref={tableRef}
                dataSource={data.dataSource}
              />
            }
          </AutoSizeLayout>
        </div>
        <TechnicalDataModal
          title={data.title}
          type={props.type}
          onOk={TechnicalDataAdd}
          onCancel={() => setData((value) => ({...value, visible: false}))}
          visible={data.visible}
        />
      </div>
    </div>
  );

})

export default Form.create()(TechnicalData);
