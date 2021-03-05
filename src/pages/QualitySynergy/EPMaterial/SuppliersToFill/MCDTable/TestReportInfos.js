import React from 'react';
import { Table, Icon, Form, Input, Row, Modal, DatePicker, Select } from 'antd';
import { ExtModal, utils, ExtTable } from 'suid';
import moment from 'moment';

const { getUUID } = utils;
const { Option } = Select;

const Format = "YYYY-MM-DD"

class TestReportInfos extends React.Component {

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
  }

  getDataSource () {
    const { data } = this.props;
    let dataSource = [];
    if (data) {
      dataSource = data.map(item => {
        return {
          uuid: getUUID(),
          ...item
        }
      })

      this.setState((state, props) => ({
        dataSource: dataSource
      }), () => this.props.onChange(this.state.dataSource));
    }
  }

  // 删除
  handleDelete = (record) => {
    const dataSource = [...this.state.dataSource];
    Modal.confirm({
      title: '删除',
      content: `请确认是否删除限用物质别名${record.aliasName}`,
      onOk: () => {
        let index = dataSource.findIndex(item => item.uuid === record.uuid);
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
    return [
      {
        title: <Icon type="plus" onClick={() => this.setVisible(true)} />,
        width: 50,
        dataIndex: 'delete',
        render: (text, record) => <Icon type="delete" onClick={() => this.handleDelete(record)} />,
      },
      {
        title: '测试机构',
        width: 100,
        dataIndex: 'testOrganization',
        ellipsis: true,
      },
      { title: '测试结论', dataIndex: 'reportResult', ellipsis: true, align: 'center', render: (text) => (text === true || text === 'true') ? '通过' : '不通过' },
      {
        title: '报告编码',
        width: 100,
        dataIndex: 'reportNumber',
        ellipsis: true,
      },
      {
        title: '报告日期',
        dataIndex: 'reportDate',
        ellipsis: true,
      }
    ].map(item => ({ ...item, align: 'center' }))
  }


  handleSubmit = e => {
    const { form, onChange } = this.props;
    let dataSource = [...this.state.dataSource];
    form.validateFields((err, values) => {
      if (!err) {
        dataSource.push({
          ...values,
          uuid: getUUID(),
          reportDate: moment(values.reportDate).format(Format)
        })
        this.setState({
          dataSource
        }, () => {
          onChange(dataSource)
        })
        form.resetFields();
        this.setVisible(false);
      }
    });
  };

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { dataSource, visible, formLayout } = this.state;
    const { type } = this.props;
    return (

      (<React.Fragment>

        <ExtTable
          storageId={getUUID()}
          columns={this.columns()}
          bordered
          showSearch={false}
          rowKey={(item) => item.uuid}
          checkbox={false}
          size='small'
          dataSource={dataSource}
        />

        {visible && <ExtModal
          centered
          destroyOnClose
          visible={visible}
          maskClosable={false}
          onCancel={() => { resetFields(); this.setVisible(false); }}
          onOk={() => { this.handleSubmit() }}
          title={`${type === 'add' ? '新增' : '编辑'}测试报告信息`}
        >
          <Form>
            <Row>
              <Form.Item label='测试机构' {...formLayout}>
                {
                  getFieldDecorator('testOrganization', {
                    rules: [{ required: true, message: '请填写测试机构名称' }]
                  })(<Input />)
                }
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label='测试结论' {...formLayout}>
                {
                  getFieldDecorator('reportResult', {
                    // initialValue: type === 'edit' ? selectedRows[0].reportResult : true,
                    rules: [{ required: true, message: '请选择测试结论' }]
                  })(<Select style={{ width: '100%' }}>
                    <Option value={true}>通过</Option>
                    <Option value={false}>不通过</Option>
                  </Select>)
                }
              </Form.Item>
            </Row>

            <Row>
              <Form.Item label='报告编号' {...formLayout}>
                {getFieldDecorator('reportNumber', {
                  rules: [
                    { required: true, message: '请输入报告编号', whitespace: true },
                  ],
                })(
                  <Input placeholder="请输入" />,
                )}
              </Form.Item>
            </Row>

            <Row>
              <Form.Item label='报告日期' {...formLayout}>
                {getFieldDecorator('reportDate', {
                  rules: [
                    { required: true, message: '选择入报告日期' },
                  ],
                })(
                  (
                    <DatePicker
                      format={Format}
                      style={{ width: '100%' }}
                    />
                  )
                )}
              </Form.Item>
            </Row>
          </Form>
        </ExtModal>}
      </React.Fragment>)
    );
  }
}

export default Form.create()(TestReportInfos);

