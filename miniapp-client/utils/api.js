// var apiPrefix = 'https://novel.dkvirus.top/api'
var apiPrefix = 'http://localhost:5000/api'

module.exports = {
  NOVEL: `${apiPrefix}/novel/search/:inputValue`,    // 根据关键字查询
  CHAPTER: `${apiPrefix}/novel/chapter/:novelUrl`,   // 根据小说url查章节
  CONTENT: `${apiPrefix}/novel/content/:chapterUrl`, // 根据章节url查内容   
  CLASSIFY: `${apiPrefix}/novel/classify`,           // 查询小说分类
  novelByClassify: `${apiPrefix}/novel/classify/:path`,   // 根据小说分类查询小说
}