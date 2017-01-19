/**
 * 实现本地存储数据
 * @param  {string} id    传入商家id
 * @param  {string} key   传入存储数据的key值
 * @param  value 传入存储数据的值
 */
export function saveToLocal(id, key, value){
	let seller = localStorage.getItem('seller');
	if (!seller) {
		seller = {};
		seller[id] = {};
	}else {
		seller = JSON.parse(seller);
		if (!seller[id]) {
			seller[id] = {};
		}
	}
	seller[id][key] = value;
	localStorage.setItem('seller',JSON.stringify(seller));
};

/**
 * 从本地数据中读取数据
 * @param  {string} id  传入商家id
 * @param  {[type]} key 传入读取数据的key值
 * @param  {[type]} def 传入数据的默认值
 * @return 返回读取的数据
 */
export function getLocal(id, key, def){
	let seller = localStorage.getItem('seller');
	if (!seller) {
		return def;
	}
	seller = JSON.parse(seller)[id];
	if (!seller) {
		return def;
	}
	let ret = seller[key];
	return ret || def;
}