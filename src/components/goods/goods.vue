<template>
	<div class="goods">
		<!-- 左侧菜单 -->
		<div class="menu-wrap" ref="menuWrap">
			<ul>
				<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index, $event)">
					<span class="text border-1px">
						<span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}
					</span>
				</li>
			</ul>
		</div>
		<!-- 右侧食品列表 -->
		<div class="foods-wrap" ref="foodsWrap">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h2 class="title">{{ item.name }}</h2>
					<ul>
						<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
							<div class="icon">
								<img :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{ food.name }}</h2>
								<p v-if="food.description" class="desc">{{ food.description }}</p>
								<div class="extra">
									<span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
								</div>
								<div class="price">
									<span class="now">&yen;{{ food.price }}</span>
									<span v-show="food.oldPrice" class="old">&yen;{{ food.oldPrice }}</span>
								</div>
								<div class="cartcontrol-wrap">
									<cartcontrol :food="food">
									</cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<!-- 底部购物车 -->
		<shopcart 
		:del-price="seller.deliveryPrice" 
		:min-price="seller.minPrice" 
		:select-foods="selectFoods" 
		ref="shopcart">
		</shopcart>
		<!-- 食品详情页 -->
		<food :food="selectedFood" ref="food"></food>
	</div>
</template>

<script type="text/javascript">

	import shopcart from 'components/shopcart/shopcart';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import BScroll from 'better-scroll';
	import food from 'components/food/food'

	const ERR_OK = 0;

	export default {
		props: {
			seller: Object
		},
		data() {
			return {
				goods: [],
				classMap: ['decrease','discount','guarantee','invoice','special'],
				listHeight: [],
				scrollY: 0,
				selectedFood: {}
			};
		},
		created() {
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					// Dom更新之后执行回调
					this.$nextTick(() => {
						this.initScroll();
						this.caculateHeight();
					});
				} 
			});
		},
		methods: {
			initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrap, {
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrap, {
					click: true,
					probeType: 3
				});
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs( Math.round(pos.y) );
				});
			},
			caculateHeight() {
				let foodList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			selectMenu(index, event) {
				if (!event._constructed) {
					return;
				}
				let foodList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el, 300);
			},
			selectFood(food, event) {
				if (!event._constructed) {
					return;
				}
				this.selectedFood = food;
				this.$refs.food.show();
			}
		},
		computed: {
			currentIndex() {
				for (let i = 0; i < this.listHeight.length-1; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					if (this.scrollY >= height1 && this.scrollY < height2) {
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		components: {
			shopcart,
			cartcontrol,
			food
		}
	};
</script>

<style lang="scss">

	@import "../../common/scss/mixin";

	.goods {
		display: flex;
		position: absolute;
		left: 0;
		top: 175px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
		.menu-wrap {
			flex: 0 0 80px;
			width: 80px;
			background-color: #f3f5f7;
			.menu-item {
				display: table;
				width: 56px;
				height: 54px;
				padding: 0 12px;
				line-height: 14px;
				&.current {
					position: relative;
					z-index: 10;
					margin-top: -1px;
					background: #fff;
					font-weight: 700;
					.text {
						@include border-none();
					}
				}
				.icon {
					display: inline-block;
					width: 12px;
					height: 12px;
					margin-right: 2px;
					vertical-align: top;
					background-size: 12px 12px;
					background-repeat: no-repeat;
					&.decrease {
						@include bg-image('decrease_3');
					}
					&.discount {
						@include bg-image('discount_3');
					}
					&.guarantee {
						@include bg-image('guarantee_3');
					}
					&.invoice {
						@include bg-image('invoice_3');
					}
					&.special {
						@include bg-image('special_3');
					}
				}
				.text {
					display: table-cell;
					width: 56px;
					@include border-1px(rgba(7, 17, 27, .1));
					vertical-align: middle;
					font-size: 12px;
				}
			}
		}
		.foods-wrap {
			flex: 1;
			.title {
				height: 26px;
				line-height: 26px;
				border-left: 2px solid #d9dde1;
				padding-left: 12px;
				font-size: 12px;
				color: rgb(147, 153, 159);
				background: #f3f5f7;
			}
			.food-item {
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				@include border-1px(rgba(7, 17, 27, .1));
				&:last-child {
					@include border-none();
					margin-bottom: 0;
				}
				.icon {
					flex: 0 0 57px;
					margin-right: 10px;
					img {
						width: 57px;
						height: 57px;
					}
				}
				.content {
					flex: 1;
					.name {
						margin-top: 2px;
						font-size: 14px;
						color: rgb(7, 17, 27);
					}
					.desc,.extra {
						font-size: 10px;
						color: rgb(147, 153, 159);
					}
					.desc {
						padding-top: 8px;
						line-height: 12px;
					}
					.extra {
						padding-top: 8px;
						.count {
							margin-right: 12px;
						}
					}
					.price {
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
						right: 0;
						bottom: 12px;
					}
				}
			}
		}
	}
</style>