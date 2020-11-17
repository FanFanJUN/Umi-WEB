import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';

const ShuttleBoxNew = (props) => {


  const [data, setData] = useState({
    leftCheckedKeys: [],
    leftData: [],
    rightCheckedKeys: [],
    rightTreeData: [],
  });

  const { type, rightTreeData, leftTreeData } = props;

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
      data.systemId = data.id;
      data.systemCode = data.code;
      data.systemName = data.name;
      data.key = data.id;
      data.title = data.name;
      data?.children.forEach(item => {
        constructArr(item);
      });
    } else {
      data.systemId = data.id;
      data.systemCode = data.code;
      data.systemName = data.name;
      data.key = data.id;
      data.title = data.name;
    }
  };

  // 添加方法
  const addClick = () => {
    let arr = JSON.parse(JSON.stringify(data.leftSelectData));
    console.log(arr, 'arr');
    arr = recursion(arr);

    setData(v => ({ ...v, rightTreeData: arr }));
  };

  // 删除方法
  const deleteClick = () => {

  };

  //找到子节点
  const findSon = (data, arr) => {
    arr.forEach((item) => {
      if (item.parentId === data.id) {
        item.systemId = item.id;
        item.systemCode = item.code;
        item.systemName = item.name;
        item.key = item.id;
        item.title = item.name;
        data.children.push(item);
      }
    });
  };

  // 递归
  const recursion = (arr) => {
    console.log(arr);
    let newArr = JSON.parse(JSON.stringify(arr));
    newArr.forEach(item => {
      item.systemId = item.id;
      item.systemCode = item.code;
      item.systemName = item.name;
      item.key = item.id;
      item.title = item.name;
      if (item.children && item.children.length !== 0) {
        item.children = [];
      }
      findSon(item, newArr);
    });
    console.log(newArr, 'newArr');
    let data = [];
    newArr.forEach(item => {
      if (!item.parentId) {
        data.push(item);
      }
    });
    return data;
  };


  const destruction = async (arr, newArr) => {
    console.log(newArr, 'newArr');
    arr.forEach(item => {
      if (Array.isArray(item.children) && item.children.length !== 0) {
        newArr = [...newArr, ...item.children];
        destruction(item.children, newArr);
      }
    });
  };

  // 左边节点选中
  const leftCheck = (keys, values) => {
    let selectData = [];
    let newArr = JSON.parse(JSON.stringify(data.leftData));
    newArr = destruction(data.leftData, newArr);
    console.log(newArr, 'arr');
    // arr.forEach((item, index) => {
    //   values.halfCheckedKeys.map(value => {
    //     console.log(value, item)
    //     if (value === item.key) {
    //       selectData.push(item)
    //     }
    //   })
    // })
    console.log(selectData);
    setData(v => ({ ...v, leftSelectData: selectData, leftCheckedKeys: keys }));

    // if (newLeftTreeData.id) {
    //   newLeftTreeData.children = [];
    //   newLeftTreeData.systemId = newLeftTreeData.id;
    //   newLeftTreeData.systemCode = newLeftTreeData.code;
    //   newLeftTreeData.systemName = newLeftTreeData.name;
    //   newLeftTreeData.key = newLeftTreeData.id;
    //   newLeftTreeData.title = newLeftTreeData.name;
    //   arr.map(item => {
    //     if (item.id !== newLeftTreeData.id) {
    //       let newItem = JSON.parse(JSON.stringify(item));
    //       newItem.systemId = newItem.id;
    //       newItem.systemCode = newItem.code;
    //       newItem.systemName = newItem.name;
    //       newItem.key = newItem.id;
    //       newItem.title = newItem.name;
    //       newLeftTreeData.children.push(newItem);
    //     }
    //   });
    //   setData(v => ({ ...v, leftSelectData: [newLeftTreeData], leftCheckedKeys: keys }));
    // } else {
    //   arr.map((item, index) => {
    //     newLeftTreeData.map(value => {
    //       if (item.id === value.id) {
    //         arr.splice(index, 1);
    //       }
    //     });
    //   });
    //   setData(v => ({ ...v, leftSelectData: arr, leftCheckedKeys: keys }));
    // }
  };

  // 右边节点选中
  const rightCheck = (keys, values) => {
    console.log(keys, values);
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '40%', height: '95%', border: '1px solid #f2f2f2', padding: '10px', overflow: 'auto' }}>
        <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>待选择</span>
        <Tree
          style={{ zIndex: '10' }}
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
