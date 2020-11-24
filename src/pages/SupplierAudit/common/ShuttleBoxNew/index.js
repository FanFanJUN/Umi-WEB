import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';

const ShuttleBoxNew = (props) => {

  const [data, setData] = useState({
    leftCheckedKeys: [],
    leftData: [],
    rightCheckedKeys: [],
    rightTreeData: [],
  });

  let leftData = JSON.parse(JSON.stringify(data.leftData));

  const { type, rightTreeData, leftTreeData } = props;

  useEffect(() => {
    destruction(data.rightTreeData);
    props.onChange(leftData);
  }, [data.rightTreeData]);

  useEffect(() => {
    console.log(props.rightTreeData, 'rightTreeData');
    if (props.rightTreeData && props.rightTreeData.length !== 0) {
      let arr = JSON.parse(JSON.stringify(props.rightTreeData));
      arr = recursion(arr);
      setData(v => ({ ...v, rightTreeData: arr }));
    }
  }, [props.rightTreeData]);

  useEffect(() => {
    setData(v => ({ ...v, rightCheckedKeys: [], leftCheckedKeys: [] }));
    if (leftTreeData) {
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

  const constructArr = (data) => {
    if (data.children.length !== 0) {
      data.systemId = data.id ? data.id : data.systemId;
      data.systemCode = data.code ? data.code : data.systemCode;
      data.systemName = data.name ? data.name : data.systemName;
      data.key = data.id ? data.id : data.systemId;
      data.title = data.name ? data.name : data.systemName;
      data?.children.forEach(item => {
        constructArr(item);
      });
    } else {
      data.systemId = data.id ? data.id : data.systemId;
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
      if (item.parentId === data.id) {
        data.systemId = data.id ? data.id : data.systemId;
        data.systemCode = data.code ? data.code : data.systemCode;
        data.systemName = data.name ? data.name : data.systemName;
        data.key = data.id ? data.id : data.systemId;
        data.title = data.name ? data.name : data.systemName;
        data.children.push(item);
      }
    });
  };

  // 递归
  const recursion = (arr) => {
    let newArr = JSON.parse(JSON.stringify(arr));
    newArr.forEach(item => {
      item.systemId = item.id ? item.id : item.systemId;
      item.systemCode = item.code ? item.code : item.systemCode;
      item.systemName = item.name ? item.name : item.systemName;
      item.key = item.id ? item.id : item.systemId;
      item.title = item.name ? item.name : item.systemName;
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
      if (Array.isArray(item.children) && item.children.length !== 0) {
        leftData = [...leftData, ...item.children];
        destruction(item.children);
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
    setData(v => ({ ...v, leftSelectData: selectData, leftCheckedKeys: keys }));
  };

  // 右边节点选中
  const rightCheck = (keys, values) => {
    let selectData = values.checkedNodes.map(item => item.props);
    destruction(data.rightTreeData);
    let newLeftData = JSON.parse(JSON.stringify(leftData));
    newLeftData.map((item, index) => {
      selectData.map(value => {
        if (item.systemId === value.systemId) {
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
