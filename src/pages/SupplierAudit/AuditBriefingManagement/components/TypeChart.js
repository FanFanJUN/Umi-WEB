/**
 * @Description: 图表
 * @Author: M!keW
 * @Date: 2020-11-27
 */

import React, { useImperativeHandle } from 'react';
import { ExtEcharts } from 'suid';
import { Form, Row, Col } from 'antd';

const TypeChart = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const props = {
    option: {
      title: {
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)',
      },
      series: [
        {
          type: 'pie',
          data:editData.abAuditTypeVos||[] ,
        },
      ],
    },
  };

  const props2 = {
    option: {
      title: {
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)',
      },
      series: [
        {
          type: 'pie',
          data:editData.abAuditOrgModeVos||[] ,
        },
      ],
    },
  };
  const props3 = {
    option: {
      title: {
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)',
      },
      series: [
        {
          type: 'pie',
          data: editData.abAuditConclusionGradeVos||[]
        },
      ],
    },
  };
  const props4 = {
    option: {
      title: {
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c}({d}%)',
      },
      series: [
        {
          type: 'pie',
          data: editData.abReviewElementVos||[]
        },
      ],
    },
  };
  return (
    <Row>
      <Col style={{height:'300px'}} span={6}>
        <ExtEcharts {...props} />
      </Col>
      <Col style={{height:'300px'}} span={6}>
        <ExtEcharts {...props2} />
      </Col>
      <Col style={{height:'300px'}} span={6}>
        <ExtEcharts {...props3} />
      </Col>
      <Col style={{height:'300px'}} span={6}>
        <ExtEcharts {...props4} />
      </Col>
    </Row>
  );
});
export default Form.create()(TypeChart);
