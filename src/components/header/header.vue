<template>
	<div>
		<div class="header" @click="changeDetailShow">
			<div class="content-wrap">
				<div class="avatar">
					<img :src="seller.avatar">
				</div>
				<div class="content">
					<div class="title">
						<span class="brand"></span>
						<span class="name">{{ seller.name }}</span>
					</div>
					<div class="desc">
						{{ seller.description }}/{{ seller.deliveryTime }}分钟送达
					</div>
					<div v-if="seller.supports" class="support">
						<span class="icon" :class="classMap[seller.supports[0].type]"></span>
						<span class="text">{{ seller.supports[0].description }}</span>
					</div>
				</div>
				<div v-if="seller.supports" class="support-count">
					<span class="count">{{ seller.supports.length }}个活动</span>
					<i class="icon-keyboard_arrow_right"></i>
				</div>
			</div>
			<div class="bulletin-wrap">
				<span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
			<div class="mask">
				<img :src="seller.avatar">
			</div>
		</div>
		<transition name="fade">
			<div v-show="detailShow" class="header-detail">
				<div class="detail-wrap clearfix">
					<div class="detail-main">
						<h2 class="name">{{ seller.name }}</h2>	
						<div class="star-wrap">
							<star :size="48" :score="seller.score"></star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>	
						<ul v-if="seller.supports" class="supports">
							<li v-for="(item,index) in seller.supports" class="support-item">
								<span class="icon" :class="classMap[item.type]"></span>
								<span class="text">{{ item.description }}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>	
						<p class="bulletin">{{ seller.bulletin }}</p>	 
					</div>
				</div>
				<div class="detail-close">
					<i class="icon-close" @click="changeDetailShow"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script type="text/javascript">

	import star from 'components/star/star'

	export default {
		props: {
			seller: Object
		},
		data() {
			return {
				classMap: ['decrease','discount','guarantee','invoice','special'],
				detailShow: false
			};
		},
		methods: {
			changeDetailShow() {
				this.detailShow = !this.detailShow;
			} 
		},
		components: {
			star
		}
	};
</script>

<style lang="scss">
	@import "../../common/scss/mixin";

	.header {
		position: relative;
		overflow: hidden;
		background-color: rgba(7, 17, 27, .5);
		color: #fff;
		.content-wrap {
			position: relative;
			padding: 24px 12px 18px 24px;
			font-size: 0;
			.avatar {
				display: inline-block;
				vertical-align: top;
				img {
					width: 64px;
					height: 64px;
					border-radius: 2px;
				}
			}
			.content {
				display: inline-block;
				margin: 2px 16px;
				.title {
					margin-bottom: 8px;
					.brand {
						display: inline-block;
						width: 30px;
						height: 18px;
						vertical-align: top;
						@include bg-image('brand');
						background-size: 30px 18px;
						background-repeat: no-repeat;
					}
					.name {
						margin-left: 6px;
						font-size: 16px;
						font-weight: bold;
						line-height: 18px;
					}
				}
				.desc {
					margin-bottom: 10px;
					font-size: 12px;
				}
				.support {
					.icon {
						display: inline-block;
						width: 12px;
						height: 12px;
						margin-right: 4px;
						vertical-align: top;
						background-size: 12px 12px;
						background-repeat: no-repeat;
						&.decrease {
							@include bg-image('decrease_1');
						}
						&.discount {
							@include bg-image('discount_1');
						}
						&.guarantee {
							@include bg-image('guarantee_1');
						}
						&.invoice {
							@include bg-image('invoice_1');
						}
						&.special {
							@include bg-image('special_1');
						}
					}
					.text {
						display: inline-block;
						margin-top: 1px;
						line-height: 12px;
						font-size: 10px;
					}
				}
			}
			.support-count {
				position: absolute;
				right: 12px;
				bottom: 16px;
				height: 24px;
				line-height: 24px;
				border-radius: 14px;
				padding: 0 8px;
				background-color: rgba(0,0,0,.2);
				.count {
					vertical-align: top;
					font-size: 10px;
				}
				.icon-keyboard_arrow_right {
					margin-left: 2px;
					line-height: 24px;
					font-size: 10px;
				}
			}
		}
		.bulletin-wrap {
			position: relative;
			height: 28px;
			line-height: 28px;
			padding: 0 22px 0 12px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis; 
			background-color: rgba(7, 17, 27, .2);
			.bulletin-title {
				display: inline-block;
				width: 22px;
				height: 12px;
				@include bg-image('bulletin');
				background-size: 22px 12px;
				background-repeat: no-repeat;
			}
			.bulletin-text {
				vertical-align: middle;
				margin-left: 4px;
				font-size: 10px;
			}
			.icon-keyboard_arrow_right {
				position: absolute;
				right: 12px;
				top: 10px;
				font-size: 10px;
			}
		}
		.mask {
			position: absolute;
			z-index: -1;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(10px);
			-webkit-filter: blur(10px);
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
	.header-detail {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(7, 17, 27, .8);
		color: #fff;
		backdrop-filter: blur(10px);
		&.fade-enter-active, &.fade-leave-active {
		  transition: opacity .5s
		}
		&.fade-enter, &.fade-leave-active {
		  opacity: 0
		}
		.detail-wrap{
			width: 100%;
			min-height: 100%;
			.detail-main {
				margin-top: 64px;
				padding-bottom: 64px;
				.name {
					text-align: center;
					font-size: 16px;
					font-weight: 700;
				}
				.star-wrap {
					margin-top: 16px;
					padding: 2px 0;
					text-align: center;
				}
				.title {
					display: flex;
					width: 80%;
					margin: 28px auto 24px auto;
					.line {
						flex: 1;
						position: relative;
						top: -6px;
						border-bottom: 1px solid rgba(255, 255, 255, .5);
					}
					.text {
						padding: 0 12px;
						font-weight: 700;
						font-size: 14px;
					}
				}
				.supports {
					width: 80%;
					margin: 0 auto;
					.support-item {
						margin-bottom: 12px;
						padding: 0 12px;
						font-size: 0;
						&:last-child {
							margin-bottom: 0;
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
								@include bg-image('decrease_2');
							}
							&.discount {
								@include bg-image('discount_2');
							}
							&.guarantee {
								@include bg-image('guarantee_2');
							}
							&.invoice {
								@include bg-image('invoice_2');
							}
							&.special {
								@include bg-image('special_2');
							}
						}
						.text {
							vertical-align: middle;
							font-size: 12px;
						}
					}
				}
				.bulletin {
					box-sizing: border-box;
					width: 80%;
					margin: 0 auto;
					padding: 0 12px;
					font-size: 12px;
					line-height: 24px;
				}
			}
		}
		.detail-close {
			position: relative;
			width: 32px;
			height: 32px;
			margin: -64px auto 0 auto;
			clear: both;
			.icon-close {
				font-size: 32px;
				color: rgba(255, 255, 255, .5);
			}
		}
	}
</style>