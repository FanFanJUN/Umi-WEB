import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { duplicateRemoval } from '../../mainData/commomService';
const ShuttleBox = (props) => {

  const [data, setData] = useState({
    leftCheckedKeys: [],
    leftData: [],
    rightTreeData: [],
    rightCheck: [],
    leftSelectData: [],
    rightCheckedKeys: []
  });

  const { leftTreeData } = props;

  useEffect(() => {
    if (leftTreeData) {
      setData(v => ({...v,rightCheckedKeys: [], leftCheckedKeys: []}))
      let newData = JSON.parse(JSON.stringify(leftTreeData));
      constructArr(newData);
      setData(v => ({ ...v, leftData: [newData] }));
    }
  }, [leftTreeData]);

  useEffect(() => {
    props.onChange(data.rightTreeData)
  }, [data.rightTreeData])

  useEffect(() => {
    if (props.rightTreeData) {
      setData(v => ({...v, rightTreeData: props.rightTreeData}))
    }
  }, [])

  const constructArr = (data) => {
    if (data.children.length !== 0) {
      data.key = data.id;
      data.title = data.name;
      data?.children.forEach(item => {
        constructArr(item);
      });
    } else {
      data.key = data.id;
      data.title = data.name;
    }
  };
  const leftCheck = (keys, values) => {
    let arr = values.checkedNodes.map(item => item.props)
    let newLeftTreeData = JSON.parse(JSON.stringify(props.leftTreeData))
    newLeftTreeData.children = []
    newLeftTreeData.key = newLeftTreeData.id
    newLeftTreeData.title = newLeftTreeData.name
    arr.map(item => {
      if (item.id !== newLeftTreeData.id) {
        let newItem = JSON.parse(JSON.stringify(item))
        newItem.key = newItem.id
        newItem.title = newItem.name
        newLeftTreeData.children.push(newItem)
      }
    })
    setData(v => ({...v, leftSelectData: [newLeftTreeData], leftCheckedKeys: keys}))
  };

  const rightCheck = (keys, values) => {
    let arr = values.checkedNodes.map(item => item.props)
    setData(v => ({...v, rightCheck: arr, rightCheckedKeys: keys}))
  };

  const deleteRightTreeData = (data, key) => {
    data.forEach((item, index) => {
      if (item.id === key) {
        data.splice(index, 1)
      } else {
        if (item.children.length !== 0) {
          deleteRightTreeData(item.children, key)
        }
      }
    })
  }

  const deleteClick = () => {
    let newRightTreeData = JSON.parse(JSON.stringify(data.rightTreeData))
    data.rightCheck.forEach(item => {
      deleteRightTreeData(newRightTreeData, item.id)
    })
    setData(v => ({...v, rightTreeData: newRightTreeData, leftCheckedKeys: [], rightCheckedKeys: []}))
  }

  const addClick = () => {
    data.leftSelectData.map(item => {

    })
    let arr = [...data.leftSelectData, ...data.rightTreeData]
    arr = duplicateRemoval(arr, 'id');
    setData(v => ({...v, rightTreeData: arr}))
  }

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '40%', height: '95%', border: '1px solid #f2f2f2', padding: '10px' }}>
        <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>待选择</span>
        <Tree
          defaultExpandAll={true}
          checkable
          checkedKeys={data.leftCheckedKeys}
          onCheck={leftCheck}
          treeData={data.leftData}
        />
      </div>
      <div style={{
        width: '10%',
        height: '95%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {
          props.type !== 'show' && <span style={{ fontSize: '50px', cursor: 'pointer' }} onClick={addClick}>{'>'}</span>
        }
        {
          props.type !== 'show' && <span style={{ fontSize: '50px', cursor: 'pointer' }} onClick={deleteClick}>{'<'}</span>
        }
      </div>
      <div style={{ width: '40%', height: '95%', border: '1px solid #f2f2f2', padding: '10px' }}>
        <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>已选择</span>
        <Tree
          defaultExpandAll={true}
          checkable
          checkedKeys={data.rightCheckedKeys}
          onCheck={rightCheck}
          treeData={data.rightTreeData}
        />
      </div>
    </div>
  );

};

export default ShuttleBox;
