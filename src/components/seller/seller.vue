<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h2 class="title">{{ seller.name }}</h2>
				<div class="desc border-1px">
					<star :size="36" :score="seller.score"></star>
					<span class="text">({{ seller.ratingCount }})</span>
					<span class="text">月售{{ seller.sellCount }}</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h3 class="title">起送价</h3>
						<div class="content">
							<span class="stress">{{ seller.minPrice }}</span>分钟
						</div>
					</li>
					<li class="block">
						<h3 class="title">商家配送</h3>
						<div class="content">
							<span class="stress">{{ seller.deliveryPrice }}</span>分钟
						</div>
					</li>
					<li class="block">
						<h3 class="title">平均配送时间</h3>
						<div class="content">
							<span class="stress">{{ seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite">
					<i class="icon-favorite" 
					 :class="{'active':favorite}"
					 @click="toggle">
					</i>
					<span class="text">{{ favoriteText }}</span>
				</div>
			</div>
			<div class="split"></div>
			<div class="bulletin">
				<h2 class="title">公告与活动</h2>
				<p class="content border-1px">{{ seller.bulletin }}</p>
				<ul v-if="seller.supports" class="supports">
					<li v-for="(item,index) in seller.supports" class="support-item border-1px">
						<span class="icon" :class="classMap[item.type]"></span>
						<span class="text">{{ item.description }}</span>
					</li>
				</ul>
			</div>
			<div class="split"></div>
			<div class="pics">
				<h2 class="title">商家实景</h2>
				<div class="pic-wrap" ref="picWrap">
					<ul class="pic-list" ref="picList">
						<li class="pic-item" v-for="pic in seller.pics">
							<img :src="pic">
						</li>
					</ul>
				</div>
			</div>
			<div class="split"></div>
			<div class="info">
				<h2 class="title">商家信息</h2>
				<ul>
					<li class="item borderbot-1px" v-for="info in seller.infos">
						{{ info }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

	import star from 'components/star/star';
	import BScroll from 'better-scroll';
	import {saveToLocal, getLocal} from 'common/js/store';

	export default {
		props: {
			seller: Object
		},
		data() {
			return {
				classMap: ['decrease','discount','guarantee','invoice','special'],
				favorite: (() => {
					return getLocal(this.seller.id, 'favorite', false);
				})()
			};
		},
		computed: {
			favoriteText() {
				return this.favorite ? '已收藏' : '收藏';
			}
		},
		mounted() {
			if (!this.scroll) {
				this.scroll = new BScroll(this.$refs.seller,{
					click: true
				});
			}else {
				this.scroll.refresh();
			}

			if (this.seller.pics) {
				let picWidth = 120;
				let margin = 6;
				let width = (picWidth + margin) * this.seller.pics.length - margin;
				this.$refs.picList.style.width = width + 'px';
				this.$nextTick(() => {
					if (!this.picScroll) {
						this.picScroll = new BScroll(this.$refs.picWrap,{
							scrollX: true,
							// 禁止向上滑动
							eventPassthrough: 'vertical'
						});
					}else {
						this.picScroll.refresh();
					}
				});
			}
		},
		methods: {
			toggle(event) {
				if (!event._constructed) {
					return;
				}
				this.favorite = !this.favorite;
				saveToLocal(this.seller.id, 'favorite', this.favorite);
			}
		},
		components: {
			star
		}
	};
</script>

<style lang="scss">

	@import '../../common/scss/mixin';

	.seller {
		position: absolute;
		left: 0;
		top: 175px;
		right: 0;
		bottom: 0;
		overflow: hidden;
		.overview {
			position: relative;
			padding: 18px;
			.title {
				font-size: 14px;
				color: rgb(7, 17, 27);
			}
			.desc {
				padding: 8px 0 18px 0;
				@include border-1px(rgba(7, 17, 27, .1));
				font-size: 0;
				.star {
					display: inline-block;
					margin-right: 8px;
					vertical-align: top;
				} 
				.text {
					display: inline-block;
					margin-right: 12px;
					line-height: 18px;
					vertical-align: top;
					font-size: 10px;
					color: rgb(77, 85, 93);
				}
			}
			.remark {
				display: flex;
				margin-top: 18px;
				.block {
					flex: 1;
					border-right: 1px solid rgba(7, 17, 27, .1);
					text-align: center;
					font-size: 10px;
					&:last-child {
						border: none;
					}
					.title {
						margin-bottom: 4px;
						font-size: 10px;
						color: rgb(147, 153, 159);
					}
					.content {
						line-height: 24px;
						color: rgb(7, 17, 27);
						.stress {
							font-size: 24px;
						}
					}
				}
			}
		}
		.split {
			@include split();
		}
		.bulletin{
			padding: 18px 18px 0 18px;
			.title {
				margin-bottom: 8px;
				font-size: 14px;
				color: rgb(7, 17, 27);
			}
			.content {
				padding: 0 12px 16px 12px;
				line-height: 24px;
				font-size: 12px;
				@include border-1px(rgba(7, 17, 27, .1));
				color: rgb(240, 20, 20);
			}
			.supports {
				.support-item {
					padding: 16px 12px;
					font-size: 0;
					@include border-1px(rgba(7, 17, 27, .1));
					&:last-child {
						@include border-none();
					}
					.icon {
						display: inline-block;
						width: 16px;
						height: 16px;
						margin-right: 6px;
						vertical-align: middle;
						background-size: 16px 16px;
						background-repeat: no-repeat;
						&.decrease {
							@include bg-image('decrease_4');
						}
						&.discount {
							@include bg-image('discount_4');
						}
						&.guarantee {
							@include bg-image('guarantee_4');
						}
						&.invoice {
							@include bg-image('invoice_4');
						}
						&.special {
							@include bg-image('special_4');
						}
					}
					.text {
						vertical-align: middle;
						font-size: 12px;
						line-height: 16px;
						color: rgb(7, 17, 27)
					}
				}
			}
		}
		.pics {
			padding: 18px;
			.title {
				margin-bottom: 12px;
				font-size: 14px;
				color: rgb(7, 17, 27);
			}
			.pic-wrap {
				width: 100%;
				overflow: hidden;
				.pic-list {
					font-size: 0;
					white-space: nowrap;	
					.pic-item {
						display: inline-block;
						width: 120px;
						height: 90px;
						margin-right: 6px;
						&.last-child {
							margin-right: 0;
						}
						img {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
		.info {
			padding: 0 18px;
			color: rgb(7, 17, 27);
			.title {
				padding: 18px 0 12px 0;
				font-size: 14px;
			}
			.item {
				padding: 16px 12px;
				line-height: 16px;
				font-size: 12px;
				@include borderbot-1px(rgba(7, 17, 27, .1));
			}
		}
		.favorite {
			position: absolute;
			right: 11px;
			top: 18px;
			width: 50px;
			text-align: center;
			.icon-favorite {
				display: block;
				margin-bottom: 4px;
				font-size: 24px;
				color: #d4d6d9; 
				&.active {
					color: rgb(240, 20, 20);
				}
			}
			.text {
				font-size: 10px;
				color: rgb(77, 85, 93);
			}
		}
	}
</style>