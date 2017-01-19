<template>
	<div class="star" :class="startType">
		<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
	</div>
</template>

<script type="text/javascript">

	const LENGTH = 5;
	const CLS_ON = 'on';		//全星
	const CLS_HALF = 'half';	//半星
	const CLS_OFF = 'off';		//无星

	export default {
		props: {
			size: Number,
			score: Number
		},
		computed: {
			startType() {
				return 'star-' + this.size;
			},
			itemClasses() {
				let result = [];
				// 对score取0.5的倍数 如:4.6 => 4.5
				let score = Math.floor( this.score * 2 ) / 2;
				// 判断是否有小数
				let hasDecimal = score % 1 !== 0;
				let integer = Math.floor( score );
				for (let i = 0; i < integer; i++) {
					result.push(CLS_ON);
				}
				if (hasDecimal) {
					result.push(CLS_HALF);
				}
				while (result.length < LENGTH) {
					result.push(CLS_OFF);
				}
				return result;
			}
		}
	};
</script>

<style lang="scss">
	@import "../../common/scss/mixin";

	.star {
		font-size: 0;
		.star-item {
			display: inline-block;
			background-repeat: no-repeat;
		}
		&.star-48 {
			.star-item {
				width: 20px;
				height: 20px;
				margin-right: 22px;
				background-size: 20px 20px;
				&:last-child {
					margin-right: 0;
				}
				&.on {
					@include bg-image('star48_on');
				}
				&.half {
					@include bg-image('star48_half');
				}
				&.off {
					@include bg-image('star48_off');
				}
			}
		}
		&.star-36 {
			.star-item {
				width: 15px;
				height: 15px;
				margin-right: 6px;
				background-size: 15px 15px;
				&:last-child {
					margin-right: 0;
				}
				&.on {
					@include bg-image('star36_on');
				}
				&.half {
					@include bg-image('star36_half');
				}
				&.off {
					@include bg-image('star36_off');
				}
			}
		}
		&.star-24 {
			.star-item {
				width: 10px;
				height: 10px;
				margin-right: 3px;
				background-size: 10px 10px;
				&:last-child {
					margin-right: 0;
				}
				&.on {
					@include bg-image('star24_on');
				}
				&.half {
					@include bg-image('star24_half');
				}
				&.off {
					@include bg-image('star24_off');
				}
			}
		}
	}
</style>