import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { duplicateRemoval } from '../../mainData/commomService';

const ShuttleBoxNew = (props) => {

  const [data, setData] = useState({
    leftCheckedKeys: [],
    leftData: [],
    rightCheckedKeys: [],
    rightTreeData: [],
  });

  let leftData = [];

  const { type, rightTreeData, leftTreeData } = props;

  useEffect(() => {
    destruction(data.rightTreeData);
    leftData = duplicateRemoval(leftData, 'key');
    props.onChange(leftData);
  }, [data.rightTreeData]);

  useEffect(() => {
    leftData = [];
    setData(v => ({ ...v, rightCheckedKeys: [], leftCheckedKeys: [] }));
    let arr = recursion(props.rightTreeData);
    setData(v => ({ ...v, rightTreeData: arr }));
  }, [props.rightTreeData]);

  useEffect(() => {
    console.log(leftTreeData, 'leftTreeData');
    setData(v => ({ ...v, rightCheckedKeys: [], leftCheckedKeys: [] }));
    if (leftTreeData) {
      if (leftTreeData.children) {
        console.log('触发');
        constructArr(leftTreeData);
        setData(v => ({ ...v, leftData: [leftTreeData] }));
      } else {
        setData(v => ({ ...v, leftData: leftTreeData }));
      }
    } else {
      setData(v => ({ ...v, leftData: [] }));
    }
  }, [leftTreeData]);

  const constructArr = (data) => {
    if (data.children.length !== 0) {
      data.systemId = data.systemId ? data.systemId : data.id;
      data.systemCode = data.code ? data.code : data.systemCode;
      data.systemName = data.name ? data.name : data.systemName;
      data.key = data.id ? data.id : data.systemId;
      data.title = data.name ? data.name : data.systemName;
      data?.children.forEach(item => {
        constructArr(item);
      });
    } else {
      data.systemId = data.systemId ? data.systemId : data.id;
      data.systemCode = data.code ? data.code : data.systemCode;
      data.systemName = data.name ? data.name : data.systemName;
      data.key = data.id ? data.id : data.systemId;
      data.title = data.name ? data.name : data.systemName;
    }
  };

  // 添加方法
  const addClick = () => {
    let arr = JSON.parse(JSON.stringify(data.leftSelectData));
    arr = recursion(arr);
    setData(v => ({
      ...v,
      rightTreeData: arr,
      leftSelectData: [],
      leftCheckedKeys: [],
      rightCheckedKeys: [],
      rightCheck: [],
    }));
  };

  // 删除方法
  const deleteClick = () => {
    let arr = JSON.parse(JSON.stringify(data.rightCheck));
    arr = duplicateRemoval(arr, 'systemId');
    arr = recursion(arr);
    setData(v => ({
      ...v,
      rightTreeData: arr,
      leftSelectData: [],
      leftCheckedKeys: [],
      rightCheckedKeys: [],
      rightCheck: [],
    }));
  };

  //找到子节点
  const findSon = (data, arr) => {
    arr.forEach((item) => {
      item.systemId = item.systemId ? item.systemId : item.id;
      item.systemCode = item.systemCode ? item.systemCode : item.code;
      item.systemName = item.systemName ? item.systemName : item.name;
      item.key = item.systemId;
      item.title = item.systemName;
      if (item.parentId === data.systemId) {
        if (!data.children) {
          data.children = [];
        }
        data.children.push(item);
      }
    });
  };

  // 递归
  const recursion = (arr) => {
    let newArr = JSON.parse(JSON.stringify(arr));
    newArr.forEach(item => {
      item.systemId = item.systemId ? item.systemId : item.id;
      item.systemCode = item.systemCode ? item.systemCode : item.code;
      item.systemName = item.systemName ? item.systemName : item.name;
      item.key = item.systemId;
      item.title = item.systemName;
      if (item.children && item.children.length !== 0) {
        item.children = [];
      }
      findSon(item, newArr);
    });
    let data = [];
    newArr.forEach(item => {
      if (!item.parentId) {
        data.push(item);
      }
    });
    return data;
  };


  const destruction = (arr) => {
    arr.map(item => {
      if (item.children && item.children.length !== 0) {
        leftData.push(item);
        destruction(item.children);
      } else {
        leftData.push(...arr);
      }
    });
  };

  // 左边节点选中
  const leftCheck = (keys, values) => {
    let selectData = values.checkedNodes.map(item => item.props);
    destruction(data.leftData);
    if (values.halfCheckedKeys.length !== 0) {
      leftData.forEach((item) => {
        values.halfCheckedKeys.map(value => {
          if (value === item.key) {
            selectData.push(item);
          }
        });
      });
    }
    selectData = duplicateRemoval(selectData, 'systemId');
    setData(v => ({ ...v, leftSelectData: selectData, leftCheckedKeys: keys }));
  };

  // 右边节点选中
  const rightCheck = (keys) => {
    destruction(data.rightTreeData);
    let newLeftData = JSON.parse(JSON.stringify(leftData));
    newLeftData.map((item, index) => {
      keys.map(value => {
        if (item.systemId === value) {
          newLeftData.splice(index, 1);
        }
      });
    });
    setData(v => ({ ...v, rightCheck: newLeftData, rightCheckedKeys: keys }));
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '40%', height: '95%', border: '1px solid #f2f2f2', padding: '10px', overflow: 'auto' }}>
        <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>待选择</span>
        <Tree
          style={{ zIndex: '10' }}
          defaultExpandAll={true}
          defaultExpandParent={true}
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
          type !== 'show' && <span style={{ fontSize: '50px', cursor: 'pointer' }} onClick={addClick}>{'>'}</span>
        }
        {
          type !== 'show' &&
          <span style={{ fontSize: '50px', cursor: 'pointer' }} onClick={deleteClick}>{'<'}</span>
        }
      </div>
      <div style={{ width: '40%', height: '95%', border: '1px solid #f2f2f2', padding: '10px', overflow: 'auto' }}>
        <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>已选择</span>
        <Tree
          defaultExpandAll={true}
          defaultExpandParent={true}
          checkable
          checkedKeys={data.rightCheckedKeys}
          onCheck={rightCheck}
          treeData={data.rightTreeData}
        />
      </div>
    </div>
  );

};

export default ShuttleBoxNew;
