<template>
	<div>
		<v-header :seller="seller">
		</v-header>
		<div class="tab border-1px">
			<div class="tab-item">
				<!-- 使用 router-link 组件来导航. -->
				<!-- 通过传入 `to` 属性指定链接. -->
				<!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
				<router-link to="/goods">商品</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/ratings">评价</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/seller">商家</router-link>
			</div>
		</div>
		<!-- 保留组件状态或避免重新渲染 -->
		<keep-alive>
			<!-- 路由出口 -->
  			<!-- 路由匹配到的组件将渲染在这里 -->
			<router-view :seller="seller"></router-view>
		</keep-alive>
	</div>
</template>

<script>

	import header from 'components/header/header.vue';
	import {urlParse} from 'common/js/util';

	const ERR_OK = 0;

	export default {
		data() {
			return {
				seller: {
					id: (() => {
						// 获得附加地址id
						let queryParam = urlParse();
						return queryParam.id;
					})()
				}
			};
		},
		created() {
			// vue-resource 获取数据
			this.$http.get('/api/seller?id'+this.id).then((response) => {
				// 转化成数据主体
				response = response.body;
				if (response.errno === ERR_OK) {
					// 合并对象
					this.seller = Object.assign({}, this.seller, response.data);
				}
			});
		},
		components: {
			'v-header': header
		}
	}
</script>

<style lang="scss">
	@import 'common/scss/mixin.scss';

	.tab {
		display: flex;
		height: 40px;
		line-height: 40px;
		@include border-1px( rgba(7, 17, 27, .1) );
		.tab-item {
			flex: 1;
			text-align: center;
			& > a {
				display: block;
				font-size: 14px;
				color: rgb(77, 85, 93);
				&.active {
					color: rgb(240, 20, 20);
				}
			}
		}
	}
</style>
