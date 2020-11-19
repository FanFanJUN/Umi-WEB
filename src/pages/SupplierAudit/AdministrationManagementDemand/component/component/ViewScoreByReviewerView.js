import React, { Fragment, useEffect, useState } from 'react';
import { ExtModal } from 'suid';
import { Tabs } from 'antd';
import { ViewScoreByReviewerApi } from '../../../AuditRequirementsManagement/commonApi';
import ProblemTable from './ProblemTable';
import { getRandom } from '../../../../QualitySynergy/commonProps';
import { getDocIdForArray } from '../../../../../utils/utilTool';

const { TabPane } = Tabs;

const ViewScoreByReviewerView = (props) => {

  const { visible, reviewImplementPlanCode } = props;

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
    ViewScoreByReviewerApi({
      reviewImplementPlanCode,
    }).then(res => {
      if (res.success) {
        setState(v => ({ ...v, data: res.data }));
      } else {

      }
    });
  };

  const onOk = () => {

  };

  const onTabClick = (value) => {
    setState(v => ({ ...v, activeKey: value }));
  };

  const { data } = state;

  const resultsEntryOk = () => {

  };

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
      <Tabs style={{ height: '500px' }} defaultActiveKey={'1'} activeKey={state.activeKey} onTabClick={onTabClick}>
        {
          data.map((item, index) => {
            item.lineList = item.lineList.map(item => ({...item, lineNum: getRandom(10), attachRelatedIds: getDocIdForArray(item.fileList)}))
            return <TabPane tab={item.memberName} key={(index + 1).toString()}>
              <ProblemTable
                onChange={onChange}
                type={'show'}
                dataSource={item.lineList}
              />
            </TabPane>
            },
          )
        }
      </Tabs>
    </ExtModal>
  );
};

export default ViewScoreByReviewerView;
