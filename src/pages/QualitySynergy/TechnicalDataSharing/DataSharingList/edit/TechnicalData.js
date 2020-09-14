import React, { Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './BaseInfo.less';
import { Form, Button } from 'antd';
import { ExtTable } from 'suid';
import TechnicalDataModal from './component/TechnicalDataModal';
import moment from 'moment/moment';
import Upload from '../../../compoent/Upload';

const TechnicalData = React.forwardRef((props, ref) => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    type: 'add',
    dataSource: [],
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: '新增技术资料'
  })

  const columns = [
    { title: '文件类别', dataIndex: 'fileCategoryName', width: 350 },
    { title: '文件版本', dataIndex: 'fileVersion', width: 350, ellipsis: true, },
    { title: '技术资料附件', dataIndex: 'technicalDataFileIdList', width: 350, ellipsis: true,render: (v) => <Upload type='show' entityId={v}>查看</Upload> },
    { title: '样品需求日期', dataIndex: 'sampleRequirementDate', width: 350, ellipsis: true, },
  ].map(item => ({...item, align: 'center'}))

  useEffect(() => {
    console.log(props.data)
    if (props.data) {
      setData(v => ({...v, dataSource: props.data}))
    }
  }, [props.data])

  const handleSelectedRows = (value, rows) => {
    setData((v) => ({...v, selectedRowKeys: value, selectRows: rows, type: 'add'}))
  }

  const handleBtn = (type) => {
    if (type === 'add') {
      setData((value) => ({...value, type: 'add', visible: true, title: '新增技术资料'}))
    } else if (type === 'edit') {
      setData((value) => ({...value, type: 'edit', visible: true, title: '编辑技术资料'}))
    } else {
      let deleteArr = []
      let newData = JSON.parse(JSON.stringify(data.dataSource))
      data.dataSource.map((item, index) => {
        data.selectedRowKeys.map(data => {
          if (item.id === data) {
            newData[index].whetherDelete = true
            deleteArr.push(newData[index])
            newData.splice(index, 1)
          }
        })
      })
      props.setDeleteArr(deleteArr)
      setData(v => ({...v, dataSource: newData}))
      tableRef.current.manualSelectedRows();
    }
  }

  useImperativeHandle(ref, () => ({
    dataSource: data.dataSource
  }))

  const TechnicalDataAddAndEdit = (value) => {
    let newData = JSON.parse(JSON.stringify(data.dataSource))
    value.whetherDelete = false
    value.sampleRequirementDate = moment(value.sampleRequirementDate).format('YYYY-MM-DD')
    if (data.type === 'add') {
      newData.push(value)
    } else {
      data.dataSource.map((item, index) => {
        console.log(value, '1')
        if(item.id === value.id) {
          newData[index] = value
          console.log(newData[index], '2')
        }
      })
    }
    setData((v) => ({...v, dataSource: newData, visible: false}))
    tableRef.current.manualSelectedRows();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>技术资料</div>
        <div className={styles.content}>
          <div>
            <Button onClick={() => {handleBtn('add')}} type='primary'>新增</Button>
            <Button disabled={data.selectRows.length !== 1} onClick={() => {handleBtn('edit')}} style={{marginLeft: '5px'}}>编辑</Button>
            <Button disabled={data.selectedRowKeys.length < 1} onClick={() => {handleBtn('delete')}} style={{marginLeft: '5px'}}>删除</Button>
          </div>
          <ExtTable
            style={{marginTop: '10px'}}
            rowKey={(v) => v.lineNumber}
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
        </div>
        <TechnicalDataModal
          title={data.title}
          type={data.type}
          fatherData={data.selectRows[0]}
          onOk={TechnicalDataAddAndEdit}
          onCancel={() => setData((value) => ({...value, visible: false}))}
          visible={data.visible}
        />
      </div>
    </div>
  );

})

export default Form.create()(TechnicalData);
