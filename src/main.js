// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';
import 'common/scss/index.scss';

// 安装路由功能
// 安装vue-resource网络请求模块
Vue.use(VueRouter);
Vue.use(VueResource);

// 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
const routes = [
 	{path: 'goods', component: goods},
 	{path: 'ratings', component: ratings},
 	{path: 'seller', component: seller}

];

// 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
	// 当前router-link的class
	'linkActiveClass': 'active',
	routes 
});

// 创建和挂载根实例
const app = new Vue({
	router
}).$mount('#app');

