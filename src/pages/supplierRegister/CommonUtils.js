//附件转换
import moment from "moment";

export const getEntityId = (editData) => {
  if (!editData || !editData.genCertVos || editData.genCertVos.length <= 0) {
    return false;
  }

  let obj = {};
  editData.genCertVos.forEach((item, index) => {
    obj[item.qualificationType] = item.id;
    obj[item.qualificationType + "attachments"] = item.attachments;
  });

  return obj;
};

//数据转换
export const dataTransfer = (dataSource, values, initIndex) => {
  const isCommon = initIndex >= 0;
  const data = dataSource.map((item, index) => {
    let obj = {};
    //赋予行号
    obj.lineCode = item.lineCode;
    Object.keys(values).forEach((key) => {
      const newKey = key.split('_')[0];
      if (isCommon) {
        if (index < initIndex) { //通用资质已有数据
          obj['qualificationType'] = item.qualificationType;
          obj['id'] = item.id;
          obj['refId'] = item.refId;
        }
      }
      if (newKey === 'date') {
        obj['startDate'] = values[key][item.key] && values[key][item.key].startDate;
        obj['endDate'] = values[key][item.key] && values[key][item.key].endDate;
      } else {
        obj[newKey] = values[key][item.key] || null;
      }
    });
    return obj;
  });
  if (isCommon) {
    return { genCertVos: data };
  } else {
    return { proCertVos: data };
  }
};

export const dataTransfer2 = (dataSource, values, isChange) => {
  return dataSource.map((item, index) => {
    let obj = {};
    //赋予行号
    obj.lineCode = item.lineCode;
    Object.keys(values).forEach((key) => {
      // values[key] = values[key].filter(item => !!item);
      if (key === 'date') {
        obj['startDate'] = values[key] && values[key].startDate;
        obj['endDate'] = values[key] && values[key].endDate;
      } else if (key === 'countryName' || key === 'provinceName' || key === 'regionName') {
        let newKey = key.replace('Name', 'Id');
        obj[key] = values[key][index].label;
        obj[newKey] = values[key][index].key;
      } else if (key === 'paymentCode') {
        let newKey = key.replace('Code', 'Name');
        obj[newKey] = values[key][index].label;
        obj[key] = values[key][index].key;
      } else if (key === 'bankCode') {
        obj.bankCodeName = values[key][index].label;
        obj.bankCode = values[key][index].key;
      }
      else if (key === 'electronicSignature') {
        obj[key] = values[key][index] || false;
      } else if (key === 'operatingVolume') {
        obj[key] = values[key][index] || 0;
      }
      else {
        obj[key] = values[key][index] || null;
      }
      obj.id = item.id || null;
      if (!isChange) {
        obj.code = item.code || null;
      }

    });
    return obj;
  });
};

//比较是否三十天内过期
export const compareData = (date) => {
  let pass = true;
  let endDate = new Date(date);
  let myDate = new Date();
  let time = 1000 * 3600 * 24 * 30;
  if (endDate.getTime() - myDate.getTime() < time) {
    pass = false;
  }
  return pass;
};

//时间自动加一年
export const checkDateWithYearAdd = (rule, value, callback) => {
  if (value) {
    if (!value.startDate) {
      callback('请选择开始日期');
      return false;
    } else if (value.startDate && !value.endDate) {
      let _startDate = new Date(value.startDate);
      let now = new Date();
      now.setFullYear(now.getFullYear() + 1);
      value.endDate = moment(now, 'YYYY-MM-DD')
    } else if (!value.endDate) {
      callback('请选择结束日期');
      return false;
    }
  }
  callback();
};

export const checkDateWithYearAdd2 = (rule, value, callback) => {
  if (value) {
    if (value.startDate && !value.endDate) {
      let _startDate = new Date(value.startDate);
      let now = new Date();
      now.setFullYear(now.getFullYear() + 1);
      value.endDate = moment(now, 'YYYY-MM-DD')
    }
  }
  callback();
};

export const checkDateWithHalfYear = (rule, value, callback) => {
  if (value) {
    if (!value.startDate) {
      callback('请选择开始日期');
      return false;
    } else if (value.startDate && !value.endDate) {
      let _startDate = new Date(value.startDate);
      let now = new Date();
      let endDate = moment((parseInt(now.toString().substring(11, 15)) + 1) + '-06-01');
      value.endDate = moment(endDate, 'YYYY-MM-DD')
    } else if (!value.endDate) {
      callback('请选择结束日期');
      return false;
    }
  }
  callback();
};

export const checkDateWithYearAdd3 = (rule, value, callback) => {
  if (value) {
    if (!value.startDate) {

    } else if (value.startDate && !value.endDate) {
      let _startDate = new Date(value.startDate);
      let now = new Date();
      now.setFullYear(now.getFullYear() + 1);
      value.endDate = moment(now, 'YYYY-MM-DD')
    } else if (!value.endDate) {
      callback('请选择结束日期');
      return false;
    }
  }
  callback();
}
