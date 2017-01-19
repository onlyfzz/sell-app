<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<!-- 评分信息 -->
			<div class="overview">
				<div class="overview-left">
					<h2 class="score">{{ seller.score }}</h2>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{ seller.rankRate }}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrap">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{ seller.serviceScore }}</span>
					</div>
					<div class="score-wrap">
						<span class="title">商品评分</span>
						<star :size="36" :score="seller.foodScore"></star>
						<span class="score">{{ seller.foodScore }}</span>
					</div>
					<div class="delivery-wrap">
						<span class="title">送达时间</span>
						<span class="time">{{ seller.deliveryTime }}分钟</span>
					</div>
				</div>
			</div>
			<div class="split"></div>
			<!-- 评论选择 -->
			<ratingselect
			 @select="select"
			 @toggle="toggle"
			 :ratings="ratings"
			 :select-type="selectType"
			 :only-content="onlyContent">
			</ratingselect>
			<!-- 评论 -->
			<ul class="rating-wrap">
				<li v-for="rating in ratings" 
				 class="rating-item border-1px"
				 v-show="needShow(rating.rateType,rating.text)">
					<div class="avatar">
						<img :src="rating.avatar">
					</div>
					<div class="content">
						<h2 class="name">{{ rating.username }}</h2>
						<div class="star-wrap">
							<star :size="36" :score="rating.score"></star>
							<span class="delivery" v-show="rating.deliveryTime">
								{{ rating.deliveryTime }}分钟送达
							</span>
						</div>
						<p class="text">{{ rating.text }}</p>
						<div class="recommend" v-if="rating.recommend && rating.recommend.length">
							<i class="icon-thumb_up"></i>
							<span v-for="item in rating.recommend" class="item">
								{{ item }}
							</span>
						</div>
						<div class="time">
							{{ rating.rateTime |formatDate }}
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/javascript">

	import star from 'components/star/star';
	import ratingselect from 'components/ratingSelect/ratingSelect';
	import BScroll from 'better-scroll';
	import {formatDate} from 'common/js/formatDate';

	const ALL = 2;
	const ERR_OK = 0;

	export default {
		props: {
			seller: Object
		},
		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: true
			}
		},
		created() {
			// ajax获取ratings数据
			this.$http.get('api/ratings').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.ratings = response.data;
					this.$nextTick(() => {
						this.scroll = new BScroll(this.$refs.ratings,{
							click: true
						});
					});
				}
			});
		},
		filters: {
			// 格式化时间
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		},
		methods: {
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
			select(type) {
				this.selectType = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			},
			toggle(content) {
				this.onlyContent = content;
				this.$nextTick(() => {
					this.scroll.refresh();
				});
			}
		},
		components: {
			star,
			ratingselect
		}
	};
</script>
	
<style lang="scss">

	@import '../../common/scss/mixin';

	.ratings {
		position: absolute;
		left: 0;
		top: 175px;
		right: 0;
		bottom: 0;
		overflow: hidden;
		.overview {
			display: flex;
			padding: 18px 0;
			.overview-left {
				flex: 0 0 137px;
				width: 137px;
				border-right: 1px solid rgba(7, 17, 27, .1);
				padding: 6px 0;
				text-align: center;
				@media (max-width: 320px) {
					flex: 0 0 120px;
				}
				.score {
					line-height: 28px;
					font-size: 24px;
					color: rgb(255, 153, 0);
				}
				.title {
					padding: 6px 0 8px 0;
					font-size: 12px;
					color: rgb(7, 17, 27);
				}
				.rank {
					font-size: 10px;
					color: rgb(147, 153, 159);
				}
			}
			.overview-right {
				flex: 1;
				padding: 6px 0 6px 24px;
				@media (max-width: 320px) {
					padding-left: 6px;
				}
				.score-wrap {
					margin-bottom: 8px;
					font-size: 0;
					.title {
						line-height: 18px;
						vertical-align: top;
						font-size: 12px;
						color: rgb(7, 17, 27);
					}
					.star {
						display: inline-block;
						vertical-align: top;
						margin: 0 12px;
					}
					.score {
						line-height: 18px;
						vertical-align: top;
						font-size: 12px;
						color: rgb(255, 153, 0);
					}
				}
				.delivery-wrap {
					font-size: 0;
					.title {
						margin-right: 12px;
						line-height: 18px;
						font-size: 12px;
						color: rgb(7, 17, 27);
					}
					.time {
						line-height: 18px;
						font-size: 12px;
						color: rgb(147, 153, 159);
					}
				}
			}
		}
		.split {
			@include split();
		}
		.rating-wrap {
			padding: 0 18px;
			.rating-item {
				display: flex;
				padding: 18px 0;
				@include border-1px(rgba(7, 17, 27, .1));
				.avatar{
					flex: 0 0 28px;
					margin-right: 12px;
					img {
						width: 28px;
						height: 28px;
						border-radius: 50%;
					}
				}
				.content {
					flex: 1;
					position: relative;
					.name {
						line-height: 12px;
						font-size: 10px;
						color: rgb(7, 17, 27);
					}
					.star-wrap {
						padding: 4px 0 6px 0;
						font-size: 0;
						.star {
							display: inline-block;
							vertical-align: bottom;
							margin-right: 6px;
						}
						.delivery {
							line-height: 12px;
							vertical-align: bottom;
							font-size: 10px;
							color: rgb(147, 153, 159);
						}
					}
					.text {
						margin-bottom: 8px;
						line-height: 18px;
						font-size: 12px;
						color: rgb(7, 17, 27);
					}
					.recommend {
						font-size: 0;
						.icon-thumb_up {
							display: inline-block;
							margin:0 8px 4px 0;
							line-height: 16px;
							vertical-align: middle;
							font-size: 12px;
							color: rgb(0, 160, 220);
						}
						.item {		
							display: inline-block;					
							border: 1px solid rgba(7, 17, 27, .1);
							border-radius: 2px;
							margin:0 8px 4px 0;
							padding: 0 6px;
							line-height: 16px;
							vertical-align: middle;
							font-size: 9px;
							color: rgb(147, 153, 159);
						}
					}
					.time {
						position: absolute;
						right: 0;
						top: 0;
						line-height: 12px;
						font-size: 10px;
						color: rgb(147, 153, 159);
					}
				}
			}
		}
	}
</style>