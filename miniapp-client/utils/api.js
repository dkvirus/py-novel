var apiPrefix = 'https://novel.dkvirus.top/api'

module.exports = {
  NOVEL: `${apiPrefix}/novel/search/:inputValue`,    // 根据关键字查询
  CHAPTER: `${apiPrefix}/novel/chapter/:novelUrl`,   // 根据小说url查章节
  CONTENT: `${apiPrefix}/novel/content/:chapterUrl`, // 根据章节url查内容        
}