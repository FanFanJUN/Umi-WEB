import React from 'react';
import { Table, Icon, Form, Input, Row, Modal, InputNumber } from 'antd';
import { ExtModal, utils } from 'suid';

const { getUUID } = utils;

class AnotherName extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataSource: [],
      pagination: {
        pageSize: 2, // 每页条数
        page: 1, // 当前第几页
      },
      formLayout: {
        labelCol: { span: 8, },
        wrapperCol: { span: 14, },
      }
    }
  }

  componentDidMount () {
    this.getDataSource();
    this.props.form.validateFields();
  }

  getDataSource () {
    const { data } = this.props;
    let dataSource = [];
    if (data) {
      dataSource = data.split(',').map(item => {
        return {
          id: getUUID(),
          aliasName: item,
        }
      })
    }
    this.setState((state, props) => ({
      dataSource: dataSource
    }), () => this.props.onChange(this.state.dataSource));
  }

  // 删除
  handleDelete = (record) => {
    const dataSource = [...this.state.dataSource];
    Modal.confirm({
      title: '删除',
      content: `请确认是否删除限用物质别名${record.aliasName}`,
      onOk: () => {
        let index = dataSource.findIndex(item => item.id === record.id);
        dataSource.splice(index, 1)
        this.setState({
          dataSource
        }, () => this.props.onChange(this.state.dataSource))
      }
    })
  }
  setVisible = (flag) => {
    this.setState({
      visible: flag
    })
  }

  columns = () => {
    const { pageSize, page } = this.state.pagination;
    return [
      {
        title: <Icon type="plus" onClick={() => this.setVisible(true)} />,
        width: 50,
        dataIndex: 'delete',
        render: (text, record) => <Icon type="delete" onClick={() => this.handleDelete(record)} />,
      },
      {
        title: '行号',
        width: 100,
        align: 'center',
        dataIndex: 'limitMaterialLine',
        render: (text, record, index) => {
          return index + 1 + ((page - 1) * pageSize)
        }
      },
      {
        title: '限用物质别名',
        dataIndex: 'aliasName',
        ellipsis: true,
      }
    ]
  }

  handleOnChange = (pagination) => {
    const { pageSize, current } = pagination
    this.setState({
      pagination: {
        page: pageSize,
        pageSize: current
      }
    })
  }

  handleSubmit = e => {
    const { form, onChange } = this.props;
    let dataSource = [...this.state.dataSource];
    form.validateFields((err, values) => {
      if (!err) {
        let dataSourceLength = dataSource.length;
        if (values.limitMaterialLine > (dataSourceLength + 1)) {
          dataSource.push({ aliasName: values.aliasName, id: getUUID() })
        } else {
          dataSource.splice(values.limitMaterialLine - 1, 0, { aliasName: values.aliasName, id: getUUID() });
        }
        this.setState({
          dataSource
        }, () => {
          onChange(dataSource)
        })
        this.setVisible(false);
        form.resetFields();

      }
    });
  };

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { dataSource, pagination, visible, formLayout } = this.state;
    const { type } = this.props;
    return (

      (<React.Fragment>
        <Table
          columns={this.columns()}
          dataSource={dataSource}
          pagination={pagination}
          onChange={(pagination) => this.handleOnChange(pagination)}
        />
        {visible && <ExtModal
          centered
          destroyOnClose
          visible={visible}
          maskClosable={false}
          onCancel={() => { resetFields(); this.setVisible(false); }}
          onOk={() => { this.handleSubmit() }}
          title={`${type === 'add' ? '新增' : '编辑'}限用物质别名`}
        >
          <Form>
            <Row>
              <Form.Item label='行号' {...formLayout}>
                {getFieldDecorator('limitMaterialLine', {
                  rules: [
                    { required: true, message: '请输入行号' },
                    { pattern: /^[+]{0,1}(\d+)$/, message: '请输入整数' }
                  ],
                })(
                  <InputNumber style={{ width: '100%' }} min={1} max={9999} />,
                )}
              </Form.Item>
              <Form.Item label='限用物质别名' {...formLayout}>
                {getFieldDecorator('aliasName', {
                  rules: [
                    { required: true, message: '请输入限用物质别名', whitespace: true },
                    { max: 50, message: '超出最大输入长度', },
                    {
                      validator: (rule, value, cb) => {
                        if (dataSource.find(item => item.aliasName === value)) {
                          return cb('该限用物质别名已存在！')
                        }
                        cb()
                      }
                    }
                  ],
                })(
                  <Input placeholder="请输入" />,
                )}
              </Form.Item>
            </Row>
          </Form>
        </ExtModal>}
      </React.Fragment>)
    );
  }
}

export default Form.create()(AnotherName);

