/**
 * @description 左组织机构树，右表人员选择，可选全部人员，弹出弹窗选择
 * @author hezhi
 * @date 2020.9.18
 */
import React, { useState, forwardRef, useRef, useEffect } from "react";
import { Col, Row, Tree, Input, Skeleton, Checkbox, Button } from "antd";
import { request } from '@/utils'
import { baseUrl } from '@/utils/commonUrl'
import styles from './index.less';
import { ExtTable, ExtModal } from "suid";
import PropTypes from 'prop-types';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

//人员展示字段
const columns = [
  {
    title: '人员编号',
    dataIndex: 'code'
  },
  {
    title: '名字',
    dataIndex: 'user.userName',
  },
];

const UserSelect = forwardRef(({
  form = {},
  name = 'id',
  field = [],
  reader = {},
  onChange = () => null,
  onRowsChange = () => null,
  disabled = false,
  wrapperClass,
  width = 800,
  nodeKey,
  value = [],
  alias = '',
  afterSelect = () => null,
  onOk = () => null,
  children = '选择人员',
  title = '选择人员',
  ...props
}, ref) => {
  const { setFieldsValue } = form;
  const [treeData, setTreeData] = useState([]);
  const [findResultData, setFindResultData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, triggerLoading] = useState(false);
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const [include, setInclude] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [userData, setUserData] = useState([]);
  const [keyList, setKeyList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [initState, setInitState] = useState(false);
  const [visible, toggleVisible] = useState(false);
  const [treeSelectedKeys, setTreeSelectedKyes] = useState([]);
  const [tableSearchValue, setTableSearchValue] = useState({});
  const searchInput = useRef(null)
  const tableRef = useRef(null)
  const { name: readName = 'id', field: readField = ['id'] } = reader;
  const [rdk] = readField;
  const [pageInfo, setPageInfo] = useState({ page: 1, rows: 30 });
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (treeSelectedKeys.length === 0) return
    const [id] = treeSelectedKeys;
    triggerLoading(true)
    request({
      url: `/api-gateway/basic-service/employee/findByUserQueryParam`,
      method: 'post',
      data: {
        organizationId: id,
        includeSubNode: include,
        pageInfo: pageInfo,
        sortOrders: [{ property: "code", direction: "ASC" }],
        quickSearchProperties: ["code", "user.userName"],
        ...tableSearchValue
      }
    }).then(({ data }) => {
      const { rows, records } = data;
      setTotal(records)
      console.log(rows)
      setUserData(rows)
      // const ks = value.map(item => item[rdk])
      // setSelectedKeys(ks)
      triggerLoading(false)
    }).catch(_ => triggerLoading(false))
  }, [include, treeSelectedKeys, pageInfo, tableSearchValue])
  //网络请求树控件数据（协议分类）
  const getTreeData = () => {
    triggerLoading(true)
    request({
      url: `${baseUrl}/basic/listAllOrgnazation`,
      method: 'get'
    }).then(data => {
      if (data.success) {
        setInitState(true)
        setTreeData(data.data)
      }
      triggerLoading(false)
    })
  }
  //树节点选择触发
  const onTreeSelect = (treeSelecteds) => {
    setTreeSelectedKyes(treeSelecteds);
  }

  //查找树节点
  const handleSearch = (value) => {
    let copyTree = JSON.parse(JSON.stringify(treeData));
    let findResultData = findNode(value, copyTree);
    setKeyList([])
    getExpandedKeys(findResultData);
    if (value === "") {//没有搜索关键字
      setFindResultData(findResultData)
      setSearchValue(value)
      // setAutoExpandParent(false)
      setExpandedKeys([])
      return
    }
    setFindResultData(findResultData)
    setSearchValue(value)
    // setAutoExpandParent(true)
    setExpandedKeys(keyList)
  }

  const getExpandedKeys = (data) => {
    for (let item of data) {
      setKeyList([...keyList, item.id])
      if (item.children && item.children.length > 0) {
        getExpandedKeys(item.children)
      }
    }
  };

  //树控件展开时
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  };

  //查找关键字节点
  const findNode = (value, tree) => {
    return tree.map(treeNode => {
      //如果有子节点
      if (treeNode.children && treeNode.children.length > 0) {
        //如果标题匹配
        if (treeNode.name.indexOf(value) > -1 || treeNode.code.indexOf(value) > -1) {
          return treeNode
        } else {//如果标题不匹配，则查看子节点是否有匹配标题
          treeNode.children = findNode(value, treeNode.children);
          if (treeNode.children.length > 0) {
            return treeNode
          }
        }
      } else {//没子节点
        if (treeNode.name.indexOf(value) > -1 || treeNode.code.indexOf(value) > -1) {
          return treeNode
        }
      }
      return null;
    }).filter((treeNode) => treeNode)
  };

  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} isLeaf />;
    });
  };
  const handleIncludeChange = (e) => {
    setInclude(e.target.checked)
  }
  function handleSelectedRow(ks, rs) {
    // console.log(ks, rs)
    setSelectedRows(rs)
    // setSelectedKeys(ks)
    onChange(rs)
    onRowsChange(rs)
  }
  function handleCloseTab(item) {
    const ks = value.filter(i => i[rdk] !== item[rdk]).map(item => item[rdk]);
    const fds = value.filter(i => ks.findIndex(item => item === i[rdk]) !== -1)
    // setSelectedKeys(ks)
    onChange(fds)
  }
  function showModal() {
    toggleVisible(true)
    if (initState) return
    getTreeData()
  }
  function hideModal() {
    toggleVisible(false)
  }
  function handleOnOk() {
    toggleVisible(false)
    // console.log(selectedKeys, selectedRows)
    onOk(selectedRows)
    setSelectedRows([])
  }
  return (
    <div>
      <Button disabled={disabled} onClick={showModal}>{children}</Button>
      <ExtModal
        visible={visible}
        width={width}
        title={title}
        centered
        onCancel={hideModal}
        onOk={handleOnOk}
        maskClosable
        destroyOnClose
      >
        <div>
          <div className={styles.header}>
            <span>组织机构</span>
            <div>
              <Checkbox checked={include} onChange={handleIncludeChange}>包含子节点</Checkbox>
            </div>
          </div>
          <Row>
            <Col span={10} className={styles.col} style={{ marginTop: 12 }}>
              <Row>
                <Col span={10} className={styles.textRight} onMouseDown={e => e.preventDefault()}>
                  <Search
                    key="search"
                    placeholder="输入组织机构名称查询"
                    onSearch={e => handleSearch(e)}
                    style={{ width: '220px' }}
                    enterButton
                    ref={searchInput}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      searchInput.current.focus()
                    }}
                  />
                </Col>
              </Row>
              {treeData.length > 0 ? (
                <Tree
                  expandAction={"click"}
                  onSelect={onTreeSelect}
                  autoExpandParent={autoExpandParent}
                  defaultExpandParent
                  autoExpandParent
                  expandedKeys={expandedKeys}
                  onExpand={onExpand}
                  loading={loading}
                  draggable={false}>
                  {renderTreeNodes(searchValue === "" ? treeData : findResultData)}
                </Tree>
              ) : <Skeleton active />}
            </Col>
            <Col span={14} className={styles.col}>
              <ExtTable
                toolBar={{
                  layout: {
                    leftSpan: 0,
                    rightSpan: 24
                  },
                  right: <Search onSearch={v => {
                    setTableSearchValue({
                      quickSearchValue: v
                    })
                    setPageInfo({
                      page: 1,
                      rows: 30
                    })
                  }} disabled={treeSelectedKeys.length === 0} />
                }}
                showSearch={false}
                pagination={{
                  total: total,
                  pageSize: pageInfo.rows,
                  current: pageInfo.page
                }}
                onChange={(pagination) => {
                  const { current, pageSize } = pagination;
                  setPageInfo({ page: current, rows: pageSize })
                }}
                allowCancelSelect
                loading={loading}
                ref={tableRef}
                selectedRowKeys={selectedKeys}
                selectedRows={selectedRows}
                onSelectRow={handleSelectedRow}
                rowKey={(item) => item[rdk]}
                dataSource={userData}
                columns={columns}
                checkbox={{
                  multiSelect: true
                }}
              />
            </Col>
          </Row>
        </div>
      </ExtModal>
    </div>
  )
})
UserSelect.propTypes = {
  // 点击确定回调
  onOk: PropTypes.func,
  //人员选择后回调方法
  onRowsChange: PropTypes.func,
  onChange: PropTypes.func,
}

export default UserSelect;
