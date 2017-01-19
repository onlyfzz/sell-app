<template>
	<div class="cartcontrol">
		<transition name="move">
			<!-- 减少商品 -->
			<div class="cart-decrease" v-show="food.count > 0" @click.stop="decreaseFood">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<!-- 商品数量 -->
		<div class="cart-count" v-show="food.count > 0">
			{{ food.count }}
		</div>
		<!-- 增加商品 -->
		<div class="cart-add icon-add_circle" @click.stop="addFood"></div>
	</div>
</template>

<script>

	import Vue from 'vue';
	import Hub from 'common/js/eventHub';

	export default {
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addFood(event) {
				if (!event._constructed) {
					return;
				}
				if (!this.food.count) {
					// 设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法主要用于避开 Vue 不能检测属性被添加的限制,这个方法设置的属性使得子组件对象的属性绑定到父组件之上,子组件属性变化,父组件也会随之更新!
					Vue.set(this.food, 'count', 1);
				}else {
					this.food.count++;
				}
				Hub.$emit('cartadd', event.target);
			},
			decreaseFood(event) {
				if (!event._constructed) {
					return;
				}
				if (this.food.count) {
					this.food.count--;
				}
			}
		}
	};
</script>

<style lang="scss">
	.cartcontrol {
		font-size: 0;
		.cart-decrease {
			display: inline-block;
			padding: 6px;
			.inner {
				display: inline-block;
				line-height: 24px;
				font-size: 24px;
				color: rgb(0, 160, 220);
			}
			&.move-enter-active, &.move-leave-active {
				transition: all .5s linear;
				.inner {
					transition: all .5s linear;
					transform: rotate(0);
				}
			}
			&.move-enter, &.move-leave-active {
				opacity: 0;
				transform: translate3d(24px, 0, 0);
				.inner {
					transform: rotate(180deg);
				}
			}
		}
		.cart-count {
			display: inline-block; 
			padding-top: 6px;
			line-height: 24px;
			vertical-align: top;
			font-size: 10px;
			color: rgb(147, 153, 159);
		}
		.cart-add {
			display: inline-block;
			padding: 6px;
			line-height: 24px;
			font-size: 24px;
			color: rgb(0, 160, 220);
		}
	}
</style>