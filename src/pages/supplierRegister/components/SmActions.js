const SUPPLIERCATCODE = 'SUPPLIERCATCODE';
const SUPPLIERCATNAME = 'SUPPLIERCATNAME';
const SUPPLIERNAME = 'SUPPLIERNAME';


const defaultState = {
  supplierCatCode: null,
  supplierCatName: null,
  supplierName: null,
};

export default function (state, action) {
  if (!state) {
    state = defaultState
  }
  switch (action.type) {
    case SUPPLIERCATCODE:
      return {
        ...state,
        supplierCatCode: action.supplierCatCode
      };
    case SUPPLIERCATNAME:
      return {
        ...state,
        supplierCatName: action.supplierCatName
      };
    case SUPPLIERNAME:
      return {
        ...state,
        supplierName: action.supplierName
      };
    default:
      return state
  }
}

export const getSupplierCatCode = (supplierCatCode) => {
  return {type: 'SUPPLIERCATCODE', supplierCatCode}
};
export const getSupplierCatName = (supplierCatName) => {
  return {type: 'SUPPLIERCATNAME', supplierCatName}
};
export const getSupplierName = (supplierName) => {
  return {type: 'SUPPLIERNAME', supplierName}
};


