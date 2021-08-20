import router from '@/router/router';
import store from '@/store'

export const closeTagByPath = (path) => {
  let {tag, key} = findTag(path);
  if (key != -1) {
    store.commit("DEL_TAG", tag);
    tag = store.state.tags.tagList[key === 0 ? key : key - 1]; //如果关闭本标签让前推一个
    openTag(tag);
  }
}

export const closeTagBack = (path) => {
  let {tag, key} = findTag(path);
  if (key != -1) {
    store.commit("DEL_TAG", tag);
    router.back()
  }
}

export const closeTagTo = (path, to) => {
  let {tag, key} = findTag(path);
  if (key != -1) {
    store.commit("DEL_TAG", tag);
    router.push(to)
  }
}

function openTag(item) {
  let tag;
  if (item.name) {
    tag = findTag(item.name).tag;
  } else {
    tag = item;
  }
  router.push({
    path: router.$avueRouter.getPath(
      {
        name: tag.label,
        src: tag.value,
      },
      tag.meta
    ),
    query: tag.query,
  });
}

function findTag(value) {
  let tagIndex = store.state.tags.tagList.findIndex((item => {
    return item.value === value
  }))


  return {tag: store.state.tags.tagList[tagIndex], key: tagIndex};
}

