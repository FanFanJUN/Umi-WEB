/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-24 13:46:39
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-24 16:35:21
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/src/pages/TestComps/ModalDrag/index.js
 */

import { Modal } from 'antd';
import React from 'react';
import ModalDrag from './ModalDrag';



class Demonstration extends React.Component {
    showErrorMsg = (response) => {
        // if (response == null) {
        //   return;
        // }

        const doc = () => {
            return(
                <ModalDrag>
<div style={{ marginTop: 16 }}>
                    错误码:
                    <span style={{ color: 'red' }}>{response.statusCode}</span>
                    <br />
                    错误信息:
                    <span style={{ color: 'red' }}>{response.message}</span>
                  </div>

                </ModalDrag>
            )
        }
        // const content = () => {
             Modal.error({
                title: '标题',
                content: doc(),
              });
        // <ModalDrag content ={content}/>
      }
      
	render(){
		const title = <ModalDrag title="标题" />
		return(
			
            <h1 onClick ={this.showErrorMsg}>点击</h1>
		)
	}
}

export default Demonstration