/**
 * @Description: 物料分类树
 * @Author: WANGXIAO
 * @Date: 2020/3/12
 */
import React, { Component } from 'react';
import { Tree, Card, Input, Button, Dropdown, Menu, Icon, Row, Col } from 'antd';
import connect from 'react-redux/es/connect/connect';
import {hide, show} from "../../../utils/SharedReducer";
import {isEmpty} from '../../../utils'
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class MatCatTree extends Component {


  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      searchValue: '',
      autoExpandParent: true,
      expandedKeys: [],
      findResultData: [],
      dataSource: [],
      defaultCheckedKeys: this.props.defaultCheckedKeys,
    };
  }

  componentWillMount() {
    this.getDataSource();
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }
  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps.defaultCheckedKeys)
  //   this.setState({defaultCheckedKeys: nextProps.defaultCheckedKeys});
  // }

  getDataSource() {
    this.props.show();
    this.props.service().then(res => {
      const { defaultCheckedKeys } = this.props;
      //console.log(defaultCheckedKeys)
      let treeloop = res.data;
      if (this.props.isView) {
        let dataSourceed = JSON.parse(JSON.stringify(treeloop));
        console.log(defaultCheckedKeys)
        let findResultData = this.findCheckedData(defaultCheckedKeys, dataSourceed);
          this.keyList = [];
          this.getExpandedKeys(findResultData);
          let expandedKeys = this.keyList;
          this.setState({
            checkedKeys: defaultCheckedKeys,
            dataSource: findResultData,
            treeData: findResultData,
            expandedKeys,
          });
          this.props.hide();
       
      } else {
        this.setState({
          checkedKeys: defaultCheckedKeys,
          treeData: treeloop,
          dataSource: treeloop,
        });
        this.props.hide();
      }
    });
  };

  //查找树节点
  handleSearch = (value) => {
    const { treeData } = this.state;
    let dataSource = JSON.parse(JSON.stringify(this.state.treeData));
    let findResultData = this.findNode(value, dataSource);
    this.keyList = [];
    this.getExpandedKeys(findResultData);
    let expandedKeys = this.keyList;
    if (value === '') {//没有搜索关键字
      this.setState({
        findResultData: findResultData,
        dataSource: treeData,
        searchValue: value,
        autoExpandParent: false,
        expandedKeys: [],
      });
    } else {
      this.setState({
        findResultData: findResultData,
        dataSource: findResultData,
        searchValue: value,
        autoExpandParent: true,
        expandedKeys: expandedKeys,
      });
    }
  };

  getExpandedKeys = (data) => {
    for (let item of data) {
      this.keyList.push(item.id);
      if (item.children && item.children.length > 0) {
        this.getExpandedKeys(item.children);
      }
    }
  };

  //树控件展开时
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    });
  };

  //点击勾选
  // onCheck = (checkedKey) => {
  //   let newKeys = [];
  //   let { checkedKeys} = this.state;
  //   let dataSource = JSON.parse(JSON.stringify(this.state.dataSource));
  //   if (this.state.dataSource === this.state.treeData) {
  //     this.setState({ checkedKeys: checkedKey });
  //     newKeys = checkedKey
  //   } else {
  //     this.deleteCheckedKeys = [];
  //     checkedKeys.forEach((item, index) => {
  //       let exist = checkedKey.includes(item);
  //       if (!exist) {
  //         this.getKeys(dataSource, item);
  //       }
  //     });
  //     if (this.deleteCheckedKeys.length > 0) {
  //       checkedKeys = checkedKeys.filter(item => {
  //         return !this.deleteCheckedKeys.includes(item);
  //       });
  //     }
  //     newKeys = checkedKeys.concat(checkedKey);
  //     this.setState({ checkedKeys: newKeys });
  //   }
  //   if (this.props.onChange) {
  //     this.props.onChange(newKeys);
  //   }
  // };
    onCheck = (checkedKey) => {
        let newKeys = [];
        let { checkedKeys} = this.state;
        let dataSource = JSON.parse(JSON.stringify(this.state.dataSource));
        if (this.state.dataSource === this.state.treeData) {
            this.setState({ checkedKeys: checkedKey });
            newKeys = checkedKey
        } else {
            this.deleteCheckedKeys = [];
            checkedKeys.forEach((item, index) => {
                let exist = checkedKey.includes(item);
                if (!exist) {
                    this.getKeys(dataSource, item);
                }
            });
            if (this.deleteCheckedKeys.length > 0) {
                checkedKeys = checkedKeys.filter(item => {
                    return !this.deleteCheckedKeys.includes(item);
                });
            }
            checkedKeys.push(...checkedKey)
            checkedKeys = Array.from(new Set(checkedKeys))
            newKeys = checkedKeys;
            this.setState({ checkedKeys: newKeys });
        }
        if (this.props.onChange) {
            this.props.onChange(newKeys);
        }
    };



    getKeys = (dataSource, itemKey) => {
    dataSource.map(item => {
      if (item.id === itemKey) {
        this.deleteCheckedKeys.push(item.id);
      } else if (item.children && item.children.length > 0) {
        this.getKeys(item.children, itemKey);
      }
    })
  };

  renderTreeNodes = (data) => {
    const { isView } = this.props;
    if(data.length>0){
      return data.map((item) => {
        const i = item.name.indexOf(this.state.searchValue);
        const beforeStr = item.name.substr(0, i);
        const afterStr = item.name.substr(i + this.state.searchValue.length);
        const name = i > -1 ? (
          <span>
                    {beforeStr}
            <span>{this.state.searchValue}</span>
            {afterStr}
                </span>
        ) : <span>{item.name}</span>;
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode
              disabled={isView || item.nodeLevel < 2 || item.selected}
              disableCheckbox={isView || item.nodeLevel < 2 || item.selected}
              title={name} key={item.id}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode
          disabled={isView || item.selected}
          disableCheckbox={isView || item.selected}
          title={name}
          key={item.id} isLeaf/>;
      });
    }else {
      return
    }

  };

  //查找关键字节点
  findNode = (value, tree) => {
    return tree.map(treeNode => {
      //如果有子节点
      if (treeNode.children && treeNode.children.length > 0) {
        //如果标题匹配
        if (treeNode.name.indexOf(value) > -1 || treeNode.code.indexOf(value) > -1) {
          return treeNode;
        } else {//如果标题不匹配，则查看子节点是否有匹配标题
          treeNode.children = this.findNode(value, treeNode.children);
          if (treeNode.children.length > 0) {
            return treeNode;
          }
        }
      } else {//没子节点
        if (treeNode.name.indexOf(value) > -1 || treeNode.code.indexOf(value) > -1) {
          return treeNode;
        }
      }
      return null;
    }).filter((treeNode, i, self) => treeNode);
  };
  //查找关键字节点
  findCheckedData = (checkedKeys, tree) => {
    //console.log(checkedKeys)
    return tree.map(treeNode => {
      //如果有子节点
      if (treeNode.children && treeNode.children.length > 0) {
        //如果标题匹配
        if (checkedKeys.indexOf(treeNode.id) > -1) {
          return treeNode;
        } else {//如果标题不匹配，则查看子节点是否有匹配标题
          treeNode.children = this.findCheckedData(checkedKeys, treeNode.children);
          if (treeNode.children.length > 0) {
            return treeNode;
          }
        }
      } else {//没子节点
        if (checkedKeys.indexOf(treeNode.id) > -1) {
          return treeNode;
        }
      }
      return null;
    }).filter((treeNode, i, self) => treeNode);
  };

  //获取已选中数据
  getChecked = () => {
    const { checkedKeys } = this.state;
    let dataSource = JSON.parse(JSON.stringify(this.state.treeData));
    let findResultData = this.findCheckedData(checkedKeys, dataSource);
    this.keyList = [];
    this.getExpandedKeys(findResultData);
    let expandedKeys = this.keyList;
    this.setState({ dataSource: findResultData, expandedKeys });
  };

  //显示全部数据
  getAll = () => {
    const { treeData } = this.state;
    this.setState({ dataSource: treeData });
  };
  //全部展开
  expandAll = () => {
    const { dataSource } = this.state;
    this.keyList = [];
    this.getExpandedKeys(dataSource);
    let expandedKeys = this.keyList;
    this.setState({
      expandedKeys,
    });
  };

  //全部收起
  retractAll = () => {
    this.setState({ expandedKeys: [] });
  };

  buttons = () => {
    return (<Menu>
      <Menu.Item hidden={this.props.isView} key="0" onClick={this.getChecked}>
        仅显示已选中
      </Menu.Item>
      <Menu.Item hidden={this.props.isView} key="1" onClick={this.getAll}>
        显示全部
      </Menu.Item>
      <Menu.Item key="2" onClick={this.expandAll}>
        全部展开
      </Menu.Item>
      <Menu.Item key="3" onClick={this.retractAll}>
        全部收起
      </Menu.Item>
    </Menu>);
  };

  leftTitle = () => {
    return (
      <Search
        key="search"
        style={{ width: '260px' }}
        placeholder="输入名称查询"
        onSearch={e => this.handleSearch(e)}
        enterButton
      />
    );
  };

  rightTitle = () => {
    return (
      <Dropdown overlay={this.buttons()}>
        <Button>
          更多操作 <Icon type="down"/>
        </Button>
      </Dropdown>
    );
  };

  render() {
    const { dataSource, checkedKeys } = this.state;
    const { defaultCheckedKeys, isView } = this.props;
    return (
      <div>
        <Card title={this.leftTitle()} extra={this.rightTitle()} bodyStyle={{ height: 285, overflow: 'auto' }}>
          < DirectoryTree
            // defaultCheckedKeys={defaultCheckedKeys}
            checkedKeys={checkedKeys}
            autoExpandParent={this.state.autoExpandParent}
            expandedKeys={this.state.expandedKeys}
            onExpand={this.onExpand}
            onCheck={this.onCheck}
            // onSelect={this.onSelect}
            checkable
          >
            {this.renderTreeNodes(this.state.dataSource)}
          </DirectoryTree>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    show: () => {
      dispatch(show());
    },
    hide: () => {
      dispatch(hide());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MatCatTree);
