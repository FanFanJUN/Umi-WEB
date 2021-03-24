/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-24 13:47:05
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-24 16:39:06
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/TestComps/ModalDrag/ModalDrag.js
 */

import React from 'react';
import DragM from 'dragm';

export default class ModalDrag extends React.Component {
  updateTransform = transformStr => {
    this.modalDom.style.transform = transformStr;
  };
  componentDidMount() {
    // this.modalDom = document.getElementsByClassName(
    //   "ant-modal-wrap"  // modal的class是ant-modal-wrap
    // )[0];

    // ant-modal-content

    this.modalDom = document.getElementsByClassName(
        "ant-modal-content"  // modal的class是ant-modal-wrap
      )[0];
  }

  render() {
    const { title, children } = this.props;
    return (
      <DragM updateTransform={this.updateTransform}>
        {children}
      </DragM>
    );
  }
}

