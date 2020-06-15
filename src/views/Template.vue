<template>
  <div class="template">
    <div class="preview" :style="[bgStyle]">
      <div class="prevInner">
        <div class="banner">
          <img class="singleImg" v-if="!headImgMultiple" :src="headImg[0] || defaultHeadImg" alt="">
          <q-swiper v-else :data="headImg"/>
        </div>
        <div class="titleBlock">
          <h2>{{title}}</h2>
          <div v-show="dateState !== 'none'">
            <p v-if="dateState === 'before'">活动还未开始</p>
            <p v-else-if="dateState === 'current'">活动正在进行</p>
            <p v-else>活动已经结束</p>
          </div>
        </div>

        <div class="introduce" v-html="introduce"></div>
      </div>

    </div>

    <div class="setting">
      <p>设置背景图： <input type="file" @change="bgImgChange"></p>
      <p>
        设置头图是否为多个：
        <label><input type="radio" v-model="headImgMultiple" :value="true">是</label>
        <label><input type="radio" v-model="headImgMultiple" :value="false">否</label>
        <span>{{headImgMultiple}}</span>
      </p>
      <p>上传头图: <input type="file" @change="headImgChange"></p>
      <p>文件标题： <input type="text" v-model="title"></p>
      <p>
        选择开始结束时间:
        <el-date-picker
          size="small"
          v-model="date"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          rnage-separator="-"
        />
      </p>
      <div class="editor">
        活动描述
        <QEditor @editorChange="editorChange" />
      </div>
      <p>原始价格： <el-input v-model="original_price"><span slot="append">元</span></el-input></p>
      <p>团长折扣： <el-input v-model="colonel_discount"><span slot="append">折</span></el-input></p>

      <p><el-button @click="submit">提交</el-button></p>
    </div>
  </div>
</template>

<script>
  import QSwiper from '../components/QSwiper'
  import QEditor from '../components/QEditor'
  import defaultHeadImg from '../assets/logo.png'
  import {fileToDataURL} from "../utils";

  let timer = null;
  export default {
    name: "Template",
    components: {
      QSwiper,
      QEditor
    },
    data() {
      return {
        defaultHeadImg: defaultHeadImg,
        coverImg: '',
        bgImg: '',
        headImg: [],
        date: [],
        headImgMultiple: false,
        title: '',
        introduce: '',
        address: '',
        original_price: '0',
        colonel_discount: '0'
      }
    },
    computed: {
      bgStyle() {
        return {
          backgroundImage: this.bgImg ? `url(${this.bgImg})` : 'none'
        }
      },
      startTime() {
        return this.date.length && this.date[0].getTime();
      },
      endTime() {
        return this.date.length && this.date[1].getTime();
      },
      dateState() {
        const now = Date.now();
        if(!this.date.length) return 'none';
        if(now < this.startTime) {
          return 'before'
        }else if(now < this.endTime) {
          return 'current'
        }else {
          return 'after'
        }
      }
    },
    watch: {
      date: {
        handler: function(val) {
          console.log(val);
          console.log('this', this.bgStyle);
        }
      }
    },
    methods: {
      async bgImgChange(e) {
        const [file] = e.target.files;
        try {
          this.bgImg = await fileToDataURL(file);
        }catch (e) {
          alert('图片解析出错');
        }
      },
      async headImgChange(e) {
        const [file] = e.target.files;
        try {
          const url = await fileToDataURL(file);
          this.headImg.push(url)
        }catch (e) {
          alert('图片解析出错');
        }
      },
      editorChange({html}) {
        console.log('******', html)
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
          this.introduce = html;
        }, 200)
      },
      submit() {
        console.log('提交');
      }
    }
  }
</script>

<style scoped lang="scss">
.template {
  display: flex;

  .preview {
    margin: 50px;
    width: 320px;
    height: 540px;
    border: 1px solid #e8e8e8;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-size: cover;
    overflow-x: hidden;
    overflow-y: auto;

    .prevInner {
      overflow: hidden;

      .banner {
        .singleImg {
          width: 100%;
          height: 120px;
        }
      }

      .titleBlock {
        margin: 20px auto;
        padding: 15px;
        width: 80%;
        box-sizing: border-box;
        box-shadow: 0 0 3px #ccc;
        text-align: center;
      }

      .introduce {
        padding: 20px 15px;

        /deep/ img {
          width: 100%;
        }
      }


    }


  }
}
</style>
