<template>
  <div id="app">
    <div>
      <input v-model="name" type="text" placeholder="请输入书名/作者名">
      <button @click="queryNovel">查询</button>
    </div>

    <div v-show="isShowNovel" class="mgTop60">
      <a @click="switchState('novel')">隐藏小说</a>
      <div class="novel-list">
        <div class="novel-item" 
          v-for="novel in novelList" :key="novel[0]"
          @click="queryChapter(novel[0])">
          <h1>{{novel[1]}}</h1>
          <h4>{{novel[2]}}</h4>
        </div>
      </div>
    </div>
    <div v-show="!isShowNovel && novelList.length > 0" class="mgTop20">
      <a @click="switchState('novel')">显示小说</a>
    </div>

    <div v-if="isShowChapter" class="mgTop60">
      <a @click="switchState('chapter')">隐藏目录</a>
      <div class="chapter-list">
        <div class="chapter-item" 
          v-for="chapter in chapterList" :key="chapter[0]"
          @click="queryContent(chapter[0])">
          {{chapter[1]}}
        </div>
      </div>
    </div>
    <div v-show="!isShowChapter && chapterList.length > 0">
      <a @click="switchState('chapter')">显示目录</a>
    </div>

    <div v-if="detail.length > 0" class="detail">
      <div v-html="detail[0]"></div>
      <div>
        <a v-if="~detail[1].indexOf('.html')" @click="queryContent(detail[1])">上一章</a>
        &nbsp;&nbsp;&nbsp;
        <a v-if="~detail[2].indexOf('.html')" @click="queryContent(detail[2])">下一章</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const apiPrefix = 'http://localhost:5000'

export default {
  name: 'app',
  data () {
    return {
      name: '',
      novelList: [],
      chapterList: [],
      detail: [],
      isShowNovel: false,
      isShowChapter: false,
    }
  },
  methods: {
    queryNovel () {
      const that = this
      const name = this.name
      if (!name) return alert('书名/作者名不能为空')
      axios.get(`${apiPrefix}/novel/search/${name}`)
        .then(function (res) {
          if (res.data.code === '0000') {
            that.novelList = res.data.data
            that.chapterList = []
            that.isShowChapter = false
            that.isShowNovel = true
          }
        })
    },
    queryChapter (url) {
      const that = this
      axios.get(`${apiPrefix}/novel/chapter/${url}`)
        .then(function (res) {
          if (res.data.code === '0000') {
            that.chapterList = res.data.data
            that.isShowChapter = true
          }
        })
    },
    queryContent (url) {
      const that = this
      axios.get(`${apiPrefix}/novel/content/${url}`)
        .then(function (res) {
          if (res.data.code === '0000') {
            that.isShowNovel = false
            that.isShowChapter = false
            that.detail = res.data.data
            // 将滚动条拉到顶部
            window.scrollTo(0, 0)
          }
        })
    },
    switchState (name) {
      if (name === 'novel') this.isShowNovel = !this.isShowNovel
      else this.isShowChapter = !this.isShowChapter
    },
  }
}
</script>

<style>
html, body{
  padding: 0;
  margin: 0;
  height: 100vh;
  position: relative;
  font-family: Georgia, serif;
  color: #111111;
  background: #f5f5d5;
}
a {
  text-decoration: underline;
  color: #42b983;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0 10%;
}
.novel {
  margin-top: 60px;
}
.novel-list {
  display: flex;
  flex-wrap: wrap;
}
.novel-item {
  border: 1px solid #ccc;
  width: 25%;
  box-sizing: border-box;
}
.chapter-list {
  display: flex;
  flex-wrap: wrap;
  padding: 30px 0;
  border: 1px solid #ccc;
}
.chapter-item {
  width: 20%;
  box-sizing: border-box;
  font-size: 16px;
  padding: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: scale(1);
  transition: transform 1s;
}
.chapter-item:hover {
  transform: scale(1.1);
  background: pink;
  border-radius: 5px;
  transition: transform 1s;
}
.detail {
  width: 80%;
  border: 1px solid #ccc;
  margin: 20px auto;
  padding: 30px;
}
.detail p {
  text-align: left;
}
.mgTop60 {
  margin-top: 60px;
}
.mgTop20 {
  margin-top: 20px;
}
</style>
