import React, { useEffect, useState } from 'react';
import {Tree} from 'antd'

const rightTreeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: <span style={{ color: '#1890ff' }}>sss</span>, key: '0-0-1-0' }],
      },
    ],
  },
];

const ShuttleBox = (props) => {

  const [data, setData] = useState({
    leftData: []
  })

  const {leftTreeData} = props

  useEffect(() => {
    // constructArr(leftTreeData, [])
  }, leftTreeData)

  const constructArr = (data, arr) => {
    let newArr = JSON.parse(JSON.stringify(arr))
    data.map(item => {
      item.key = item.code
      item.title = item.name
      newArr.push(item)
      if (item.children.length !== 0) {
        constructArr(item.children, newArr)
      }
    })
  }

  const leftSelect = () => {

  }

  const leftCheck = () => {

  }

  const rightSelect = () => {

  }

  const rightCheck = () => {

  }

  return(
    <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: '40%', height: '95%', border: '1px solid #f2f2f2', padding: '10px'}}>
        <span style={{fontSize: '15px', fontWeight: 'bold', marginLeft: '15px'}}>待选择</span>
        <Tree
          checkable
          onSelect={leftSelect}
          onCheck={leftCheck}
          treeData={leftTreeData}
        />
      </div>
      <div style={{width: '10%', height: '95%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <span style={{fontSize: '50px', cursor: 'pointer'}}>{'>'}</span>
        <span style={{fontSize: '50px', cursor: 'pointer'}}>{'<'}</span>
      </div>
      <div style={{width: '40%', height: '95%', border: '1px solid #f2f2f2', padding: '10px'}}>
        <span style={{fontSize: '15px', fontWeight: 'bold', marginLeft: '15px'}}>已选择</span>
        <Tree
          checkable
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
          onSelect={rightSelect}
          onCheck={rightCheck}
          treeData={rightTreeData}
        />
      </div>
    </div>
  )

}

export default ShuttleBox
