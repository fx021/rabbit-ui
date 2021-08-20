const vFilter = {
  filterOptions(value, optionList) {
    let str = optionList.find((res) => {
      return res.dictKey == value;
    });
    if (str) {
      return str.dictValue;
    } else {
      return value;
    }
  }
}

export default vFilter