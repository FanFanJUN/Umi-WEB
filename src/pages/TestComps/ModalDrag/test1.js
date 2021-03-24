/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-24 16:59:57
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-24 17:02:33
 * @Description  : TODO
 * 
 * https://segmentfault.com/a/1190000021880340
 * https://www.npmjs.com/package/antd-draggable-modal
 * @FilePath     : /Umi-WEB/src/pages/TestComps/ModalDrag/test1.js
 */
import React, { Component } from 'react';
import { Button } from 'antd';
import AntdDraggableModal from 'antd-draggable-modal';
 
class Index extends Component {
  state = {
    visible: false,
    visible2: false,
  }
 
  handleVisible = visible => {
    this.setState({
      visible,
    });
  }
 
  handleOk = () => {
    this.handleVisible(false);
  }
 
  handleCancel = () => {
    this.handleVisible(false);
  }
 
  render() {
    return (
      <>
        <Button onClick={() => this.handleVisible(true)}>打开弹窗</Button>
 
        {this.state.visible && (
          <AntdDraggableModal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <Button onClick={() => this.setState({ visible2: true })}>打开弹窗2</Button>
          </AntdDraggableModal>
        )}
        
        {this.state.visible2 && (
          <AntdDraggableModal
            title="Basic Modal2"
            visible={this.state.visible2}
            onOk={() => this.setState({ visible2: false })}
            onCancel={() => this.setState({ visible2: false })}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </AntdDraggableModal>
        )}
      </>
    );
  }
}
 
export default Index;
 