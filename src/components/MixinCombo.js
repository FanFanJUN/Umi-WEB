import React, { forwardRef, useState, useEffect } from 'react';
import { ComboGrid as Grid, ComboList as List, ComboTree as Tree, Attachment, utils } from 'suid';
import { Select } from 'antd'
const { Option } = Select;
const { request } = utils;
export const ComboGrid = forwardRef(({
  onChange = () => null,
  dataIndex = 'id',
  text = 'id',
  value,
  ...props
}, ref) => {
  const [v, setV] = useState('');
  useEffect(() => {
    if (!value) {
      setV(undefined)
    }
  }, [value])
  return <Grid {...props} ref={ref} value={v} afterSelect={(item) => {
    onChange(item[dataIndex])
    setV(item[text])
  }} />
})
export const ComboList = forwardRef(({
  onChange = () => null,
  dataIndex = 'id',
  text = 'id',
  value,
  ...props
}, ref) => {
  const [v, setV] = useState('');
  useEffect(() => {
    if (!value) {
      setV(undefined)
    }
  }, [value])
  return <List {...props} ref={ref} value={v} afterSelect={(item) => {
    onChange(item[dataIndex])
    setV(item[text])
  }} />
})
export const ComboTree = forwardRef(({
  onChange = () => null,
  dataIndex = 'id',
  text = 'id',
  value,
  ...props
}, ref) => {
  const [v, setV] = useState('');
  useEffect(() => {
    if (!value) {
      setV(undefined)
    }
  }, [value])
  return <Tree {...props} ref={ref} value={v} afterSelect={(item) => {
    onChange(item[dataIndex])
    setV(item[text])
  }} />
})

export const MixinSelect = forwardRef(({
  options = [],
  onChange = () => null,
  value,
  ...props
}, ref) => {
  const [v, setV] = useState('');
  useEffect(() => {
    if (!value) {
      setV(undefined)
      return
    }
    setV(value)
  }, [value])
  return <Select {...props} onChange={(val) => {
    onChange(val)
    setV(val)
  }} ref={ref} value={v}>
    {
      options.map((item, k) => <Option key={`${k}-${item.value}`} value={item.value}>{item.label}</Option>)
    }
  </Select>
})

// 附件管理MixinComponent
export const ComboAttachment = forwardRef(({
  onChange=() => null,
  value =[],
  attachment = null,
  ...props
}, ref) => {
  const [fileList, setFileList] = useState([]);
  useEffect(()=>{
    if(!!attachment) {
      request({
        url: '/edm-service/getEntityDocumentInfos',
        params: { entityId: attachment },
        method: 'POST'
      }).then((response)=> {
        const { data, success } = response;
        const files = data.map((item, k)=>({
          ...item,
          name: item.fileName,
          response: [data[k]],
          status: 'done'
        }))
        if(success) {
          setFileList(files)
          onChange(files)
        }
      })
    }
  },[attachment, onChange])
  return (
    <Attachment
      fileList={fileList}
      ref={ref}
      onDeleteFile={(file)=> {
        const [ info ] = file;
        const { id } = info;
        const filter = fileList.filter((item)=> {
          const [ one ] = item.response;
          const { id: key } = one;
          return key !== id
        })
        setFileList(filter)
        onChange(filter)
      }}
      onChange={(infos)=> {
        setFileList(infos)
        onChange(infos)
      }}
      {...props}
    />
  )
})