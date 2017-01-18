/**
 * 获取地址附加信息
 * @return {Object} 包含附加信息的对象
 */
export function  urlParse() {
	let url = window.location.search;
	let obj = {};
	let reg = /[?&]+[^?&]+=[^?&]+/g;
	let arr = url.match(reg);
	if (arr) {
		arr.forEach((item) => {
			let str = item.substr(1).split('=');
			let key = str[0];
			let val = str[1];
			obj[key] = val;
		});
		return obj;
	}
}