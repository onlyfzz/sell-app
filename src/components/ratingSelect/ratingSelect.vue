<template>
	<div class="ratingSelect">
		<div class="rating-type border-1px">
			<span class="block positive" 
			:class="{'active':selectType===2}" 
			@click="select(2,$event)">
				{{ desc.all }}<span class="count">{{ ratings.length }}</span>
			</span>

			<span class="block positive" 
			:class="{'active':selectType===0}"
			@click="select(0,$event)">
				{{ desc.positive }}<span class="count">{{ positives.length }}</span>
			</span>
			
			<span class="block nagative" 
			:class="{'active':selectType===1}"
			@click="select(1,$event)">
				{{ desc.negative }}<span class="count">{{ negatives.length }}</span>
			</span>
		</div>
		<div class="switch" :class="{'on':onlyContent}">
			<i @click="toggleContent" class="icon-check_circle"></i>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>

	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2; 

	export default {
		props: {
			ratings: {
				type: Array,
				default() {
					return [];
				}
			},
			selectType: {
				type: Number,
				default: ALL
			},
			onlyContent: {
				type: Boolean,
				default: false
			},
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			}
		},
		computed: {
			// 对所有评价进行过滤返回满意的评价
			positives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === POSITIVE;
				});
			},
			// 对所有评价进行过滤返回不满意的评价
			negatives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === NEGATIVE;
				});
			}
		},
		methods: {
			// 传入当前评论的类型,$emit让父组件接收
			select(type,event) {
				if (!event._constructed) {
					return;
				}
				this.$emit('select',type);
			},
			// 传入toggle,$emit让父组件接收
			toggleContent() {
				if (!event._constructed) {
					return;
				}
				this.$emit('toggle',!this.onlyContent);
			}
		}
	};
</script>

<style lang="scss">

	@import "../../common/scss/mixin";

	.ratingSelect {
		.rating-type {
			margin: 0 18px;
			padding: 18px 0;
			@include border-1px(rgba(7, 17, 27, .1));
			font-size: 0;
			.block {
				display: inline-block;
				border-radius: 1px;
				margin-right: 8px;
				padding: 8px 12px;
				line-height: 16px;
				font-size: 12px;
				color: rgb(77, 85, 93);
				&.active {
					color: #fff;
				}
				.count {
					margin-left: 2px;
					font-size: 8px;
				}
				&.positive {
					background: rgba(0, 160, 220, .2);
					&.active {
						background: rgb(0, 160, 220);
					}
				}
				&.nagative {
					background: rgba(77, 85, 93, .2);
					&.active {
						background: rgb(77, 85, 93);
					}
				}
			}
		}
		.switch {
			padding: 12px 18px;
			border-bottom: 1px solid rgba(7, 17, 27, .1);
			line-height: 24px; 
			&.on {
				.icon-check_circle {
					color: #00c850; 
				}
			}
			.icon-check_circle {
				margin-right: 4px;
				vertical-align: middle;
				font-size: 24px;
				color: rgb(147, 153, 159);
			}
			.text {
				font-size: 12px;
				color: rgb(147, 153, 159);
			}
		}
	}
</style>