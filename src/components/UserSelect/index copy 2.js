/**
 * @description 左组织机构树，右表人员选择，可选全部人员，原AllUserSelect组件改写
 * @author hezhi
 * @date 2020.4.3
 */
import React, { useState, forwardRef, useRef } from "react";
import { Col, Row, Tree, Input } from "antd";
import { request } from '@/utils'
import { baseUrl } from '@/utils/commonUrl'
import { ComboList, ComboTree } from "suid";
import PropTypes from 'prop-types';

const TreeNode = Tree.TreeNode;
const { Group, Search } = Input

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

const store = {
  url: `${baseUrl}/basic/listAllOrgnazation`,
  method: 'get'
}

const UserSelect = forwardRef(({
  form = {},
  name = 'id',
  field = [],
  reader = {},
  onChange = () => null,
  onRowsChange = () => null,
  wrapperClass,
  wrapperStyle,
  nodeKey,
  ...props
}, ref) => {
  const { setFieldsValue } = form;
  const [loading, triggerLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [node, setNode] = useState([])
  const { name: readName = 'id', field: readField = ['id'] } = reader;
  const [forbid, setForbid] = useState(true)
  const { id: nodeId = null } = node;
  const userStore = {
    url: `${baseUrl}/basic/listAllCanAssignEmployeesByOrganization`,
    method: 'get',
    params: {
      organizationId: nodeId
    }
  }
  //树节点选择触发
  const handlerTreeSelect = (item) => {
    setNode(item)
    setForbid(false)
  }
  const formatTreeLabelKeys = (treeData) => {
    return treeData.map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          title: item.name,
          value: item.id,
          children: formatTreeLabelKeys(item.children)
        }
      }
      return {
        ...item,
        title: item.name,
        key: item.id,
        value: item.id
      }
    })
  }
  const rowOnChange = (keys, rows) => {
    if (!!setFieldsValue) {
      setFieldsValue({
        [name]: keys
      });
      const fieldValues = readField.map(item => {
        return rows.map(i => i[item]);
      })
      field.forEach((item, k) => {
        setFieldsValue({
          [item]: fieldValues[k]
        })
      })
    }
    // setSelectedRows(rows)
    onChange(keys)
    // onRowsChange(rows)
  }
  return (
    <div>
      <Group>
        <Row gutter={8}>
          <Col span={12}>
            <ComboTree
              style={{ width: '100%' }}
              // dataSource={treeData}
              afterClear={() => setForbid(true)}
              store={store}
              showSearch
              afterSelect={handlerTreeSelect}
              changeOnSelect={true}
              reader={{ name: 'name' }}
            />
          </Col>
          <Col span={12}>
            <ComboList
              loading={loading}
              disabled={forbid}
              style={{
                width: '100%'
              }}
              dataSource={userData}
              reader={{
                name: 'userName',
                field: ['code'],
                description: 'code'
              }}
              store={userStore}
            />
          </Col>
        </Row>
      </Group>
    </div>

  )
})
UserSelect.propTypes = {
  //人员选择后回调方法
  onRowsChange: PropTypes.func,
  onChange: PropTypes.func,
}

export default UserSelect

