<template>
	<transition name="move">
		<div class="food" v-show="showFlag" ref="food">
			<div class="food-content">
				<!-- 头部图片 -->
				<div class="img-header">
					<img :src="food.image">
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<!-- 食品信息 -->
				<div class="content">
					<h2 class="name">{{ food.name }}</h2>
					<div class="detail">
						<span class="sell-count">月售{{ food.sellCount }}份</span>
						<span class="rating">好评率{{ food.rating }}%</span>
					</div>
					<div class="price">
						<span class="now">¥{{ food.price }}</span>
						<span v-show="food.oldPrice" class="old">¥{{ food.oldPrice }}</span>
					</div>
					<div class="cartcontrol-wrap">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div 
						class="buy" 
						v-show="!food.count || food.count===0"
						@click="addFood">
						加入购物车
						</div>
					</transition>
				</div>
				<div class="split" v-show="food.info">
				</div>
				<div class="info">
					<h2 class="title">商品介绍</h2>
					<p class="text">{{ food.info }}</p>
				</div>
				<div class="split"></div>
				<!-- 评价内容 -->
				<div class="rating">
					<h2 class="title">商品评价</h2>
					<ratingselect
					 @select="select"
					 @toggle="toggle"
					 :ratings="food.ratings"
					 :select-type="selectType"
					 :only-content="onlyContent"
					 :desc="desc">
					</ratingselect>
					<div class="rating-wrap">
					 	<ul v-show="food.ratings && food.ratings.length">
					 		<li v-for="rating in food.ratings" 
					 			class="rating-item"
					 			v-show="needShow(rating.rateType,rating.text)">
					 			<div class="user">
					 				<span class="name">{{ rating.username }}</span>
					 				<img class="avatar" :src="rating.avatar"></img>
					 			</div>
					 			<div class="time">
					 				{{ rating.rateTime | formatDate }}
					 			</div>
					 			<p class="text">
					 				<i :class="{
					 				'icon-thumb_up':rating.rateType===0,
					 				'icon-thumb_down':rating.rateType===1}"></i>{{ rating.text }}
					 			</p>
					 		</li>
					 	</ul>
					 	<div class="no-rating" v-if="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>
			</div>
		</div>	
	</transition>
</template>

<script>

	import BScroll from 'better-scroll';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import Vue from 'vue';
	import ratingselect from 'components/ratingSelect/ratingSelect';
	import {formatDate} from 'common/js/formatDate';
	import Hub from 'common/js/eventHub';

	const ALL = 2;

	export default {
		props: {
			food: Object
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			};
		},
		methods: {
			// food组件展现
			show() {
				// 默认设置ratingselect组件的参数
				this.showFlag = true;
				this.selectType = ALL;
				this.onlyContent = true;
				// DOM更新之后创建BScroll
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food,{
							click: true
						});
					}else {
						this.scroll.refresh();
					}
				});			
			},
			// 隐藏food组件
			hide() {
				this.showFlag = false;
			},
			// 使用set方法给this.food添加响应属性
			addFood(event) {
				if (!event._constructed) {
					return;
				}
				Vue.set(this.food, 'count', 1);
				// Hub传递事件
				Hub.$emit('cartadd', event.target);
			},
			// 通过三种情况返回是否显示
			needShow(type,text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				}else {
					return this.selectType === type;
				}
			},
			// 接收ratingselect子组件传过来的参数,改变selectType
			select(type) {
				this.selectType = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			// 是否显示内容
			toggle(content) {
				this.onlyContent = content;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			}
		},
		filters: {
			// 对时间戳进行格式化
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		},
		components: {
			cartcontrol,
			ratingselect
		}
	};
</script>

<style lang="scss">

	@import '../../common/scss/mixin';	

	.food {
		position: fixed;
		z-index: 30;
		left: 0;
		top: 0;
		bottom: 48px;
		width: 100%;
		background: #fff;
		transform: translate3d(0, 0, 0);
		&.move-enter-active, &.move-leave-active {
			transition: all .5s;
		}
		&.move-enter, &.move-leave-active {
			transform: translate3d(100%, 0, 0);
		}
		.img-header {
			position: relative;
			width: 100%;
			height: 0;
			padding-top: 100%;
			img {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
			.back {
				position: absolute;
				top: 10px;
				left: 10px;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				background: rgba(0, 0, 0, .3);
				i {
					display: inline-block;
					padding: 10px;
					font-size: 20px;
					color: #fff;
				}
			}
		}
		.content {
			position: relative;
			padding: 18px;
			font-size: 0;
			.name {
				font-weight: 700;
				font-size: 14px;
				color: rgb(7, 17, 27);
			}
			.detail {
				margin: 8px 0 18px 0;
				.sell-count, .rating {
					font-size: 10px;
					color: rgb(147, 153, 159);
				} 
				.sell-count {
					margin-right: 12px;
				}
			}
			.price {
				height: 24px;
				line-height: 24px;
				font-family: arial;
				font-weight: 700;
				.now {
					margin-right: 8px;
					font-size: 14px;
					color: rgb(240, 20, 20);
				}
				.old {
					font-size: 10px;
					text-decoration: line-through;
					color: rgb(147, 153, 159);
				}
			}
			.cartcontrol-wrap {
				position: absolute;
				right: 12px;
				bottom: 12px;
			}
			.buy {
				position: absolute;
				right: 18px;
				bottom: 18px;
				height: 24px;
				line-height: 24px;
				padding: 0 12px;
				border-radius: 12px;
				font-size: 10px;
				background: rgb(0, 160, 220);
				color: #fff;
				&.fade-enter-active, &.fade-leave-active {
					transition: all .5s;
				}
				&.fade-enter, &.fade-leave-active {
					opacity: 0;
				}
			}
		}
		.split {
			@include split();
		}
		.info {
			padding: 18px;
			.title {
				padding-bottom: 12px;
				font-size: 14px;
				color: rgb(7, 17, 27);
			}
			.text {
				padding: 0 8px;
				line-height: 24px;
				font-size: 12px;
				color: rgb(77, 85, 93);
			}
		}
		.rating {
			padding-top: 18px;
			.title {
				margin-left: 18px;
				font-size: 14px;
				color: rgb(7, 17, 27);
			}
			.rating-wrap {
				padding: 0 18px;
				.rating-item {
					position: relative;
					padding: 16px 0;
					@include border-1px(rgba(7, 17, 27, .1));
					.user {
						position: absolute;
						right: 0;
						top: 16px;
						line-height: 12px;
						font-size: 0;
						.name {
							margin-right: 6px;
							line-height: 12px;
							vertical-align: middle;
							font-size: 10px;
							color: rgb(147, 153, 159);
						}
						.avatar {
							vertical-align: middle;
							width: 12px;
							height: 12px;
							border-radius: 50%;
						}
					}
					.time {
						line-height: 12px;
						font-size: 10px;
						color: rgb(147, 153, 159);
					}
					.text {
						margin-top: 6px;
						line-height: 16px;
						font-size: 12px;
						color: rgb(7, 17, 27);
						.icon-thumb_up, .icon-thumb_down {
							margin-right: 4px;
							font-size: 12px;
						}
						.icon-thumb_up {
							color: rgb(0, 160, 220);
						}
						.icon-thumb_down {
							color: rgb(147, 153, 159);
						}
					}
				}
				.no-rating {
					padding: 16px 0;
					font-size: 12px;
					color: rgb(147, 153, 159);
				}
			}
		}
	}
</style>