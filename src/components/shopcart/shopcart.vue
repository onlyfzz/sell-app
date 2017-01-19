<template>
	<div>
		<div class="shopcart">
			<!-- 底部结算信息 -->
			<div class="content" @click="toggleList">
				<div class="content-left" :class="{'highlight':totalCount > 0}">
					<div class="logo-wrap">
						<div class="logo">
							<i class="icon-shopping_cart"></i>
						</div>
						<div v-show="totalCount > 0" class="count">{{ totalCount }}</div>
					</div>
					<div class="price">&yen;{{ totalPrice }}</div>
					<div class="desc">另需配送费&yen;{{ delPrice }}元</div>
				</div>
				<div class="content-right">
					<div class="pay" :class="payClass" @click.stop="pay">{{ payDesc }}</div>
				</div>
			</div>
			<!-- 小球动画 -->
			<div class="ball-container">
				<template v-for="ball in balls">
					<transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
						<div v-show="ball.show" class="ball">
							<div class="inner innerhook"></div>
						</div>
					</transition>
				</template>
			</div>
			<!-- 购买的商品列表 -->
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h2 class="title">购物车</h2>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li v-for="food in selectFoods" class="food">
								<span class="name">{{ food.name }}</span>
								<div class="price">
									<span>¥{{ food.price*food.count }}</span>
								</div>
								<div class="cartcontrol-wrap">
									<cartcontrol :food="food">
									</cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div class="mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>

<script>

	import cartcontrol from "components/cartcontrol/cartcontrol";
	import BScroll from "better-scroll";
	import Hub from 'common/js/eventHub';

	export default {
		props: {
			selectFoods: {
				type: Array,
				default() {
					return [];
				}
			},
			minPrice: {
				type: Number,
				default: 0
			},
			delPrice: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBall: [],
				fold: true
			};
		},
		created() {
			Hub.$on('cartadd', this.cartAdd);
		},
		computed: {
			// 食品总价
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			// 食品总量
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			// 支付信息
			payDesc() {
				if (this.totalPrice === 0) {
					return `¥${this.minPrice}起送`;
				}else if(this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差¥${diff}起送`;
				}else {
					return `去结算`;
				}
			},
			// 支付信息class的改变
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				}else {
					return 'enough';
				}
			},
			// 食品列表是否显示
			listShow() {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if (show) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent,{
								click: true
							});
						}else {
							this.scroll.refresh();
						}
					});
				}
				return show;
			}
		},
		methods: {
			drop(el) {
				for (let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBall.push(ball);
						return;
					}
				}
			},
			// transition 钩子函数
			beforeEnter(el) {
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						// getBoundingClientRect用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left等属性。
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top -22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						el.style.transform = `translate3d(0,${y}px,0)`;
						let inner = el.getElementsByClassName('innerhook')[0];
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter(el) {
				// 触发重绘
				let rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('innerhook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
				});
			},
			afterEnter(el) {
				let ball = this.dropBall.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			// 点击底部列表切换
			toggleList() {
				if (!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			// 清空食品列表
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			hideList() {
				this.fold = true;
			},
			// 支付
			pay() {
				if (this.totalPrice < this.minPrice) {
					return;
				}else {
					window.alert(`需支付${this.totalPrice}元`);
				}
			},
			cartAdd(el) {
				// 体验优化，异步执行动画
				this.$nextTick(() => {
                   this.drop(el);
                })
			}
		},
		components: {
			cartcontrol
		}
	}
</script>

<style lang="scss">

	@import "../../common/scss/mixin"; 

	.shopcart {
		position: fixed;
		z-index: 666;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 48px;
		.content {
			display: flex;
			height: 100%;
			line-height: 48px;
			background: #141d27;
			font-size: 0;
			color: rgba(255,255,255,.4);
			.content-left {
				flex: 1;
				&.highlight {
					.logo-wrap{
						.logo{
							background: rgb(0,160,220);
							.icon-shopping_cart {
								color: #fff;
							}
						}
					}
					.price {
						color: #fff;
					}
				}
				.logo-wrap {
					display: inline-block;
					box-sizing: border-box;
					position: relative;
					top: -10px;
					width: 56px;
					height: 56px;
					margin: 0 12px;
					padding: 6px;
					border-radius: 50%;
					background: #141d27;
					.logo {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						text-align: center;
						background: #2b343c;
						.icon-shopping_cart {
							line-height: 44px;
							font-size: 24px;
							color: #80858a;
						}
					}
					.count {
						position: absolute;
						right: 0;
						top: 0;
						width: 24px;
						height: 16px;
						line-height: 16px;
						border-radius: 12px;
						text-align: center;
						font-size: 9px;
						font-weight: 700;
						color: #fff;
						background-color: rgb(240,20,20);
						box-shadow: 0 4px 8px rgba(0,0,0,.4);
					}
				}
				.price {
					display: inline-block;
					margin-top: 12px;
					padding-right: 12px;
					border-right: 1px solid rgba(255,255,255,.1);
					vertical-align: top;					
					font: 700 16px/24px arial;
					letter-spacing: 2px;
				}
				.desc {
					display: inline-block;
					margin: 1px 0 0 12px;
					vertical-align: top;
					font-size: 10px;
				}
			}
			.content-right {
				flex: 0 0 105px;
				.pay {
					height: 48px;
					line-height: 48px;
					font-size: 12px;
					font-weight: 700;
					text-align: center;
					&.not-enough {
						background: #2b333b; 
					}
					&.enough {
						background: #00b43c;
						color: #fff;
					}
				}
			}
		}
		.ball-container {
			.ball {
				position: fixed;
				left: 32px;
				bottom: 22px;
				z-index: 200;
				&.drop-enter-active{
					transition: all .5s cubic-bezier(.49, -0.29, .75, .41);
					.inner {
						width: 16px;
						height: 16px;
						border-radius: 50%;
						background-color: rgb(0, 160, 220);
						transition: all .5s linear;
					}
				}
				
			}
		}
		.shopcart-list {
			position: absolute;
			z-index: -1;
			left: 0;
			top: 0;
			width: 100%;
			transform: translate3d(0, -100%, 0);
			&.fold-enter-active, &.fold-leave-active {
				transition: all .5s;
			}
			&.fold-enter, &.fold-leave-active {
				transform: translate3d(0, 0, 0);
			}
			.list-header {
				height: 40px;
				line-height: 40px;
				padding: 0 18px;
				border-bottom: 1px solid rgba(7, 17, 27, .1);
				background: #f3f5f7;
				.title {
					float: left;
					font-size: 14px;
					color: rgb(7, 17, 27);
				}
				.empty {
					float: right;
					font-size: 12px;
					color: rgb(0, 160, 220);
				}
			}
			.list-content {
				padding: 0 18px;
				max-height: 217px;
				overflow: hidden;
				background: #fff;
				.food {
					position: relative;
					box-shadow: border-box;
					padding: 12px 0;
					@include border-1px(rgba(7, 17, 27, .1));
					.name {
						line-height: 24px;
						font-size: 12px;
						color: rgb(7, 17, 27);
					}
					.price {
						position: absolute;
						right: 90px;
						bottom: 12px;
						line-height: 24px;
						font-size: 14px;
						font-weight: 700;
						color: rgb(240, 20, 20);
					}
					.cartcontrol-wrap {
						position: absolute;
						right: 0;
						bottom: 6px;
					}
				}
			}
		}
	}
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(7, 17, 27, .6);
		backdrop-filter: blur(10px);
		&.fade-enter-active, &.fade-leave-active {
			transition: all .5s;
		}
		&.fade-enter, &.fade-leave-active {
			opacity: 0;
		}
	}
</style>
