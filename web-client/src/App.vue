<template>
  <div class="container">
    <Row type="flex" justify="center">
      <Col>
        <Input v-model="name" search enter-button 
          placeholder="请输入书名/作者名" @on-search="queryNovel" 
          style="width: 200px;"/>
      </Col>
    </Row>

    <div v-show="isShowNovel" class="mgTop20">
      <Row type="flex" justify="end">
        <Col>
          <a type="primary" @click="switchState('novel')">隐藏小说</a>
        </Col>
        <Col v-show="!isShowChapter && chapterList.length > 0" style="margin-left: 20px;">
          <a type="primary" @click="switchState('chapter')">显示目录</a>
        </Col>
      </Row>
      <Row>
        <Col :xs="12" :sm="8" :md="6"
          v-for="novel in novelList" :key="novel[0]"
          style="padding: 10px;">
          <div @click="queryChapter(novel[0])" class="novel-item">
            <h3>{{novel[1]}}</h3>
            <h6>{{novel[2]}}</h6>
          </div>
        </Col>
      </Row>
    </div>
    <div v-show="!isShowNovel && novelList.length > 0" class="mgTop20">
      <Row type="flex" justify="end">
        <Col>
          <a type="primary" @click="switchState('novel')">显示小说</a>
        </Col>
        <Col v-show="!isShowChapter && chapterList.length > 0" style="margin-left: 20px;">
          <a type="primary" @click="switchState('chapter')">显示目录</a>
        </Col>
      </Row>
    </div>

    <div v-if="isShowChapter" class="mgTop20">
      <Row type="flex" justify="end">
        <Col>
          <a type="primary" @click="switchState('chapter')">隐藏小说</a>
        </Col>
      </Row>
      <Row>
        <Col :xs="12" :sm="8" :md="6"
          v-for="chapter in chapterList" :key="chapter[0]"
          style="padding: 5px;">
          <div @click="queryContent(chapter[0])" class="novel-item">
            {{chapter[1]}}
          </div>
        </Col>
      </Row>
    </div>

    <hr>

    <div v-if="detail.length > 0" class="mgTop20 detail">
      <h3 style="text-align: center; margin-bottom: 20px;">{{detail[0]}}</h3>
      <div v-html="detail[1]"></div>
      <Row type="flex" justify="space-around" style="margin: 30px 0px;">
        <Col>
          <Button type="primary" v-if="~detail[2].indexOf('.html')" @click="queryContent(detail[2])">上一章</Button>
        </Col>
        <Col>
          <Button type="primary" v-if="~detail[3].indexOf('.html')" @click="queryContent(detail[3])">下一章</Button>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// const apiPrefix = 'http://localhost:5000'
const apiPrefix = 'https://novel.dkvirus.top/api'

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
  height: 100%;
  position: relative;
  font-family: Georgia, serif;
  color: #111111;
  background: #f5f5d5!important;
  line-height: 1.8;
}
.container {
  padding-top: 40px;
}

.novel-item {
  border: 2px solid #ccc; 
  border-radius: 5px;
  padding: 10px;
  transform: scale(1);
  transition: transform .5s;
}
.novel-item:hover {
  background: pink;
  color: #fff;
  transform: scale(1.05);
  transition: transform .5s;
}

.detail p {
  margin: 10px!important;
}
hr {
  border: 1px solid #ccc;
  margin-top: 10px;
}

.mgTop60 {
  margin-top: 60px;
}
.mgTop20 {
  margin-top: 20px;
}
.mgTop10 {
  margin-top: 10px;
}
</style>
