interface ResultItem {
  value: string[];
  added?: boolean;
  removed?: boolean;
}

const diffArray = (oldArr: string[], newArr: string[]) => {
  const result: ResultItem[] = [];

  let equity: string[] = [];

  let newIdx = 0;

  let old_start: number = -1;
  let old_end: number = -1;

  for (let i = 0; i < oldArr.length; i++) {
    let new_start: number = -1;
    let new_end: number = -1;
    for (let j = newIdx; j < newArr.length; j++) {
      if (oldArr[i] === newArr[j]) {
        if (old_start !== -1 && old_end !== -1) {
          // 捕捉到删除区间
          const removed = oldArr.slice(old_start, old_end + 1);
          result.push({
            removed: true,
            value: removed
          });
          old_start = -1;
          old_end = -1;
        }
        if (new_start !== -1 && new_end !== -1) {
          // 捕捉到新增区间
          const added = newArr.slice(new_start, new_end + 1);
          result.push({
            added: true,
            value: added
          });
          new_start = -1;
          new_end = -1;
        }
        equity.push(newArr[j]);
        newIdx = j + 1;
        break;
      } else if (oldArr[i] !== newArr[j]) {
        if (equity.length > 0) {
          // 提交之前的相等区间
          result.push({
            value: equity
          });
          // 重置
          equity = [];
        }

        if (new_start !== -1) {
          new_end = j;
        } else {
          new_start = j;
          new_end = j;
        }
      }
    }

    if (new_start !== -1 && new_end === newArr.length - 1) {
      // 此项不存在，确认删除区间
      if (old_start !== -1) {
        old_end = i;
      } else {
        old_start = i;
        old_end = i;
      }
      for (let k = i; k < oldArr.length; k ++) {
        if (oldArr[k] === newArr[new_start]) {
          // 找移除区间
          old_end = k - 1;
          break;
        }
      }

      if (old_end > old_start) {
        // 确定移除区间，可跳过循环
        i = old_end;
      }
    }
  }

  if (equity.length > 0) {
    // 收集剩余相等区间
    result.push({
      value: equity
    });
  }

  return result;
};
