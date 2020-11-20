import React, { Fragment, useEffect, useState } from 'react';
import { ExtModal } from 'suid';
import { message, Spin, Tabs } from 'antd';
import { ViewScoreByReviewerApi } from '../../commonApi';
import ProblemTable from './ProblemTable';
import { getRandom } from '../../../../QualitySynergy/commonProps';
import { getDocIdForArray } from '../../../../../utils/utilTool';

const { TabPane } = Tabs;

const ViewScoreByReviewerView = (props) => {

  const { visible, reviewImplementPlanCode } = props;

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    data: [],
    activeKey: '1',
  });

  const clearSelected = () => {

  };

  useEffect(() => {
    if (props.visible) {
      getData();
    }
  }, [props.visible]);

  const onCancel = () => {
    props.onCancel();
  };

  const getData = () => {
    setLoading(true);
    ViewScoreByReviewerApi({
      reviewImplementPlanCode,
    }).then(res => {
      if (res.success) {
        if (!data) {
          message.success('未查找到数据!');
        }
        setState(v => ({ ...v, data: res.data }));
        setLoading(false);
      } else {
        message.error(res.messages);
      }
    }).catch(err => message.error(err.messages));
  };

  const onOk = () => {

  };

  const onTabClick = (value) => {
    setState(v => ({ ...v, activeKey: value }));
  };

  const { data } = state;

  const onChange = (value) => {
    console.log(value);
  };


  return (
    <ExtModal
      width={'160vh'}
      maskClosable={false}
      visible={visible}
      title={'按评审人查看评分'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Spin spinning={loading}>
        {
          (data && data.length !== 0) &&
          <Tabs style={{ height: '500px' }} defaultActiveKey={'1'} activeKey={state.activeKey} onTabClick={onTabClick}>
            {
              data.map((item, index) => {
                  console.log(data.id);
                  if (item.lineList && item.lineList.length !== 0) {
                    item.lineList = item.lineList.map(item => ({
                      ...item,
                      lineNum: getRandom(10),
                      attachRelatedIds: getDocIdForArray(item.fileList),
                    }));
                    return <TabPane tab={item.memberName} key={(index + 1).toString()}>
                      <ProblemTable
                        params={{
                          reviewImplementManagementId: item.id
                        }}
                        onChange={onChange}
                        type={'show'}
                        dataSource={item.lineList}
                      />
                    </TabPane>;
                  }
                },
              )
            }
          </Tabs>
        }
      </Spin>
    </ExtModal>
  );
};

export default ViewScoreByReviewerView;
