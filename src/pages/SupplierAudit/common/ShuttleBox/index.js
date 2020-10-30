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
      if (newData.children) {
        constructArr(newData);
        setData(v => ({ ...v, leftData: [newData] }));
      } else {
        setData(v => ({ ...v, leftData: newData }));
      }
    } else {
      setData(v => ({ ...v, leftData: [] }));
    }
  }, [leftTreeData]);

  useEffect(() => {
    props.onChange(data.rightTreeData)
  }, [data.rightTreeData])

  useEffect(() => {
    if (props.rightTreeData) {
      setData(v => ({...v, rightTreeData: props.rightTreeData}))
    }
  }, [props.rightTreeData])

  const constructArr = (data) => {
    if (data.children.length !== 0) {
      data.systemId = data.id
      data.systemCode = data.code
      data.systemName = data.name
      data.key = data.id;
      data.title = data.name;
      data?.children.forEach(item => {
        constructArr(item);
      });
    } else {
      data.systemId = data.id
      data.systemCode = data.code
      data.systemName = data.name
      data.key = data.id;
      data.title = data.name;
    }
  };
  const leftCheck = (keys, values) => {
    let arr = values.checkedNodes.map(item => item.props)
    let newLeftTreeData = JSON.parse(JSON.stringify(props.leftTreeData))
    if (newLeftTreeData.id) {
      newLeftTreeData.children = []
      newLeftTreeData.systemId = newLeftTreeData.id
      newLeftTreeData.systemCode = newLeftTreeData.code
      newLeftTreeData.systemName = newLeftTreeData.name
      newLeftTreeData.key = newLeftTreeData.id
      newLeftTreeData.title = newLeftTreeData.name
      arr.map(item => {
        if (item.id !== newLeftTreeData.id) {
          let newItem = JSON.parse(JSON.stringify(item))
          newItem.systemId = newItem.id
          newItem.systemCode = newItem.code
          newItem.systemName = newItem.name
          newItem.key = newItem.id
          newItem.title = newItem.name
          newLeftTreeData.children.push(newItem)
        }
      })
      setData(v => ({...v, leftSelectData: [newLeftTreeData], leftCheckedKeys: keys}))
    } else {
      arr.map((item, index) => {
        newLeftTreeData.map(value => {
          if (item.id === value.id) {
            arr.splice(index, 1)
          }
        })
      })
      setData(v => ({...v, leftSelectData: arr, leftCheckedKeys: keys}))
    }
  };

  const rightCheck = (keys, values) => {
    let arr = values.checkedNodes.map(item => item.props)
    setData(v => ({...v, rightCheck: arr, rightCheckedKeys: keys}))
  };

  const deleteRightTreeData = (data, key) => {
    data.forEach((item, index) => {
      console.log(item.id, 'data', key)
      if (item.id === key) {
        data.splice(index, 1)
      } else {
        if (item.children && item.children.length !== 0) {
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

// ShuttleBox.defaultPor

export default ShuttleBox;
