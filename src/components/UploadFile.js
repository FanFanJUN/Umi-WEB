import React from 'react';
import { Upload, Icon, Button, List, Avatar, Skeleton, Modal, message } from 'antd';
//import {baseUrl, host} from "../../../configs/DefaultConfig";
import { baseUrl, host } from '../utils/commonUrl';
//import httpUtils from "../../../commons/utils/FeatchUtils";
import PropTypes from 'prop-types';
import './upload.css'
import * as fileIcon from "./Upload/fileIcon";

class UploadFile extends React.Component {

  entityId = null;

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      fileList: [],
      completeUploadFile: [],
    };
    this.entityId = props.entityId
  }


  componentDidMount() {
    this.updateFile(this.props.entityId)
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.entityId && nextProps.entityId !== this.props.entityId)
      || nextProps.refresh) {
      this.entityId = nextProps.entityId
      this.updateFile(nextProps.entityId)
    }
  }

  //获得文件 icon
  getIcon(fileName, id) {
    if (fileName.toLocaleLowerCase().includes('doc')) {
      return fileIcon.word;
    }
    if (fileName.toLocaleLowerCase().includes('xls')) {
      return fileIcon.excel;
    }
    if (fileName.toLocaleLowerCase().includes('pdf')) {
      return fileIcon.pdf;
    }
    if (fileName.toLocaleLowerCase().includes('zip') || fileName.toLocaleLowerCase().includes('rar') || fileName.toLocaleLowerCase().includes('7z')) {
      return fileIcon.zip;
    }
    //图片格式显示系统的预览
    if (fileName.toLocaleLowerCase().includes('png') || fileName.toLocaleLowerCase().includes('jpg') || fileName.toLocaleLowerCase().includes('gif')
      || fileName.toLocaleLowerCase().includes('jpeg')) {
      return host + baseUrl + '/supplierRegister/preview?docId=' + id;
    }
    return fileIcon.defaultIcon
  }

  //从后台获取附件信息
  updateFile = (value) => {
    /* console.log("en",this.entityId)
     if (this.entityId) {


         httpUtils.get(baseUrl + '/getDocumentById?docId=' + this.entityId)
             .then(res => {
                 if (res.success && res.data && res.data.length > 0) {*/
    /*    res.data.map(item => {*/
    let fileList = [];
    let completeUploadFile = [];
    if (value && value.length > 0) {
      value.map(item => {
        fileList.push({
          uid: item.id,      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
          name: item.fileName,   // 文件名
          status: 'done', // 状态有：uploading done error removed
          response: [item.id], // 服务端响应内容
          url: host + baseUrl + '/supplierRegister/download?docId=' + item.id, // 下载链接额外的 HTML 属性
          thumbUrl: window._previewUrl + item.id,
          uploadedTime: item.uploadedTime,
          uploadUserName: item.uploadUserName
        });
        completeUploadFile.push(item.id);
      })
      this.setState({ fileList, completeUploadFile })
      if (this.props.onChange) {
        this.props.onChange(completeUploadFile.length === 0 ? null : completeUploadFile)
      }
    }
    else {
      this.setState({ completeUploadFile: [], fileList: [] })
    }
  }

  handleChange = ({ file, fileList }) => {
    if (!file.error) {
      let completeUploadFile = this.state.completeUploadFile;
      let index = -1;
      if (file.status === 'done') {
        completeUploadFile.push(file.response[0]);
        if (this.props.onChange) {
          this.props.onChange(completeUploadFile.length === 0 ? null : completeUploadFile)
        }
        if (this.props.fileOnChange) {
          this.props.fileOnChange(completeUploadFile)
        }
      }
      if (file.status === 'removed' && file.response && (index = completeUploadFile.indexOf(file.response[0])) !== -1) {
        completeUploadFile.splice(index, 1);
        if (this.props.onChange) {
          this.props.onChange(completeUploadFile.length === 0 ? null : completeUploadFile)
        }
        if (this.props.fileOnChange) {
          this.props.fileOnChange(completeUploadFile)
        }
      }
      fileList.map(item => {
        if (item.status === 'done') {
          item.url = host + baseUrl + '/supplierRegister/download?docId=' + item.response[0]
          item.thumbUrl = window._previewUrl + item.response[0]
        }
      })
      this.setState({ fileList, completeUploadFile });
    } else {
      this.handleRemove(file)
      message.warn("最大可以传 50M 文件")
    }
  }

  //删除文件
  handleRemove = file => {
    const { fileList, completeUploadFile } = this.state;
    let index = -1;
    const list = fileList.filter(item => file.uid !== item.uid);
    this.setState({
      fileList: list,
    });
    if ((index = completeUploadFile.indexOf(file.response[0])) !== -1) {
      completeUploadFile.splice(index, 1);
      if (this.props.onChange) {
        this.props.onChange(completeUploadFile.length === 0 ? null : completeUploadFile)
      }
      if (this.props.fileOnChange) {
        this.props.fileOnChange(completeUploadFile)
      }
    }
  };

  handleModalVisible = (show) => {
    this.setState({ modalVisible: show })
  }
  onCancel = () => {
    if (this.props.callBack) {
      /*this.updateFile();*/
      this.setState({ modalVisible: false })
    } else {
      this.setState({ modalVisible: false })
    }
  }
  handleOk = (show) => {
    if (this.props.callBack) {
      this.props.callBack(this.state.completeUploadFile)
    }
    this.setState({ modalVisible: show })
  }
  //获取请求头
  getHeaders = () => {
    let auth;
    try {
      auth = JSON.parse(localStorage.getItem('Authorization'));
    } catch (e) {
    }
    return {
      'Authorization': auth ? (auth.accessToken ? auth.accessToken : '') : ''
    }
  }

  hasFooter = () => {
    if (!this.props.enableFooter) {
      return null;
    }
  }

  getAction = (item) => {
    if (item.status === 'uploading') {
      return null;
    }
    let actions = [];
    if (this.props.showPreview !== false
      && (item.name.toLocaleLowerCase().includes("doc") || item.name.toLocaleLowerCase().includes("pdf")
        || item.name.toLocaleLowerCase().includes("docx") || item.name.toLocaleLowerCase().includes("jpg")
        || item.name.toLocaleLowerCase().includes("png"))) {
      actions.push(<a target="_blank" href={item.thumbUrl}>预览</a>)
    }
    if (this.props.download !== false) {
      actions.push(<a target="_blank" href={item.url}>下载</a>)
    }
    if (this.props.type !== 'show' && !this.props.disabled) {
      actions.push(<a target="_blank" onClick={() => this.handleRemove(item)}>删除</a>)
    };
    return actions;
  }

  uploadCard = fileList => {
    return fileList.length > 0 ? <List
      itemLayout="horizontal"
      dataSource={fileList}
      renderItem={item => (
        <List.Item actions={this.getAction(item)}>
          <Skeleton avatar title={false} loading={item.status === 'uploading'} active>
            {item.status === 'done' ? <List.Item.Meta
              avatar={<Avatar src={this.getIcon(item.name, item.response[0])} />}
              title={item.name}
              description={item.uploadedTime ? `上传时间：${item.uploadedTime}` : null}
            /> : null}
          </Skeleton>
        </List.Item>
      )
      }
    /> : null
  }



  render() {

    return (
      <div className={'upload-style'} style={this.props.style}>
        {this.props.type !== 'show' ?
          <Button disabled={this.props.disabled} onClick={() => this.handleModalVisible(true)}>
            {this.props.showIcon === false ? null : <Icon type="upload" />}
            {this.props.title ? this.props.title : '附件'}
          </Button> : null}
        <Icon type="paper-clip" onClick={() => this.handleModalVisible(true)} />
        <span>{this.state.completeUploadFile.length}</span>
        <Modal
          title={this.props.type !== 'show' ? '附件上传' : '附件列表'}
          visible={this.state.modalVisible}
          onPreview={this.onPreview}
          onOk={() => this.handleOk(false)}
          onCancel={this.onCancel}
          footer={this.hasFooter()}
          maskClosable={false}
        >
          <ul className="ace-thumbnails clearfix">
            {this.uploadCard(this.state.fileList)}
          </ul>
        </Modal>
      </div>
    )
  }
}

UploadFile.protoType = {
  //单据 id,根据这个 id 获取附件明细
  entityId: PropTypes.string,
  //上传成功和删除成功时回调，返回 docId 数组
  onChange: PropTypes.func,
  //同 onChange,formItem包裹时用，应该可以直接用 onChange代替
  fileOnChange: PropTypes.func,
  //当需要确认按钮时点击确认时回调
  callBack: PropTypes.func,
  //是否展示预览按钮，默认展示
  showPreview: PropTypes.bool,
  //是否展示下载按钮，默认展示
  download: PropTypes.bool,
  //展示模式，当模式为 show 时，不显示上传按钮和删除按钮
  type: PropTypes.string,
  //是否启用确认按钮
  enableFooter: PropTypes.bool,
  //接收文件类型，如：['pdf','doc']
  accessType: PropTypes.array,
  //最大上传文件大小，以 MB 为单位
  maxSize: PropTypes.number,
  //组件样式
  style: PropTypes.object,
  //禁用，默认同 show 模式
  disabled: PropTypes.bool,
  //按钮标题
  title: PropTypes.string
}

export default UploadFile;
