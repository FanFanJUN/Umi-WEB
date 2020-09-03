import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';

const TechnicalDataModal = (props) => {

  const {visible, type} = props

  const [data, setData] = useState({
    title: '新增技术资料'
  })

  useEffect(() => {
    switch (type){
      case 'add':
        setData((value) => ({...value, title: '新增技术资料'}))
    }
  })

  return(
    <Modal
      title={data.title}
      visible={visible}
    >
      info
    </Modal>
  )
}

export default TechnicalDataModal
