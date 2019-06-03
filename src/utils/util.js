/**
 * 工具类文件
 * 常用的一些方法可以在这个文件定义
 */

/**
 * 
 * @param time 需要转换的日期 类型为字符串
 * @returns ms 传入时间的时间戳
 */
export function formatDateToMs(time) {
	if (!time) {
		return time
	}
	let myDate = new Date(time);
	let ms = myDate.getTime()
	return ms;
}

/**
 * @param format 时间的格式
 * @param time 需要格式化的时间戳
 * @returns format  当前格式化时间
 */
export function getFormatDate(format, time) {
	let date = '';
	if (!time) {
		date = new Date()
	} else {
		date = new Date(time)
	}
	let args = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
		"S": date.getMilliseconds()
	};
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var i in args) {
		var n = args[i];
		if (new RegExp("(" + i + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? n : ("00" + n).substr(("" + n).length));
	}
	return format;
}

/**
 * 创建action
 * @param type 传入的指示动作
 * @param obj  传入的需要改变的数据对象
 * @return obj 返回创建的动作
 */
export function actionCreator(type, obj) {
	obj = obj || {};
	obj.type = type;
	return obj;
}

/**
 * 数组合并，去重
 * @param {*} a 
 * @param {*} b 
 */
export function union(arrA = [], arrB = []) {
	return array_remove_repeat(arrA.concat(arrB));
}

// 数组去重
function array_remove_repeat(a) { // 去重
	var r = [];
	for (var i = 0; i < a.length; i++) {
		var flag = true;
		var temp = a[i];
		for (var j = 0; j < r.length; j++) {
			if (temp === r[j]) {
				flag = false;
				break;
			}
		}
		if (flag) {
			r.push(temp);
		}
	}
	return r;
}


/**
 * 解析url参数
 * @example  ?id=12345&a=b
 * @return Object {id:12345,a:b}
 * */
function urlParse() {
	let url = window.location.search;// 得到url问号后面拼接的参数  ?id=12345&a=b
	let obj = {};// 创建一个Object
	let reg = /[?&][^?&]+=[^?&]+/g;// 正则匹配 ?&开始 =拼接  非?&结束  的参数
	let arr = url.match(reg);// match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
	// arr数组形式 ['?id=12345','&a=b']
	if (arr) {
		arr.forEach((item) => {
			/**
			 * tempArr数组    ['id','12345']和['a','b']
			* 第一个是key，第二个是value
			* */
			let tempArr = item.substring(1).split('=');
			let key = decodeURIComponent(tempArr[0]);
			let val = decodeURIComponent(tempArr[1]);
			obj[key] = val;
		});
	}
	return obj;
};

export function queryUrlParams(key) {
	let searchData = urlParse();
	if (key) {
		return searchData[key]
	} else {
		return searchData;
	}
}
// 获取对应的name
export function getName(arr, key, type) {
	if (arr.length) {
		if (type === 'brand' || type === 'prod' || type === 'resource' || type === 'trademark'|| type === 'reportReason') {
			for (let i = 0; i < arr.length; i++) {
				const element = arr[i];
				if (element.id === key) {
					return element
				}
			}
		} else {
			for (let i = 0; i < arr.length; i++) {
				const element = arr[i];
				if (element.dictVal === key) {
					return element
				}
			}
		}
	}
	return '';
}
//页面按钮权限
export function getButtonPrem(data, id) {
	if (data.length) {
		for (let i = 0; i < data.length; i++) {
			const element = data[i]
			if (element.subList.length) {
				for (let index = 0; index < element.subList.length; index++) {
					const ele = element.subList[index];
					for (let index = 0; index < ele.subList.length; index++) {
						const elem = ele.subList[index];
						if (elem.code === id && elem.hasFlag === 0 && elem.level === 3) {
							return true
						} else if (elem.code === id && elem.hasFlag !== 0 && elem.level === 3) {
							return false;
						}
					}
				}
			}
		}
	}
}