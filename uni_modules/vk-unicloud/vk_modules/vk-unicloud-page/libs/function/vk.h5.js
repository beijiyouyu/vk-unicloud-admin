// #ifdef H5
/**
 * H5专用的一些函数，会涉及到window等H5专用的内置对象。
 */
var h5 = {};

// 引入 微信公众号 js_sdk 包
import wx from './weixin-js-sdk'
h5.wx = wx;

/**
 * 获取当前H5所在的环境
let env = vk.h5.getEnv();
if (env === "h5-weixin") {
	
}
 */
h5.getEnv = function() {
	const ua = window.navigator.userAgent.toLowerCase();
	const isWeChat = /micromessenger/i.test(ua);
	const isAlipay = /alipay/i.test(ua);
	const isMiniProgram = /miniprogram/i.test(ua);

	if (isWeChat) {
		if (isMiniProgram) {
			return "mp-weixin";
		} else {
			return "h5-weixin";
		}
	} else if (isAlipay) {
		if (isMiniProgram) {
			return "mp-alipay";
		} else {
			return "h5-alipay";
		}
	}
	return "h5";
};

/**
 * 获取当前项目根目录访问地址
 * https://www.aaa.com/pages/index/index?a=1&b=1
 * http://192.168.66.66:8080/pages/index/index?a=1&b=1
 * 获取当前H5的url地址的https://www.aaa.com 部分
 * let getRootPath = vk.h5.getRootPath();
 * let getRootPath = vk.h5.getRootPath({ projectName:true });
 */
h5.getRootPath = function(obj = {}) {
	let { projectName = false } = obj;
	let url = new URL(window.location.href);
	return projectName ? url.origin + url.pathname.substring(0, url.pathname.substr(1).indexOf('/') + 1) : url.origin;
};

/**
 * 微信公众号 - 初始化，只有初始化成功后，才能执行 let wx = vk.h5.getWeiXinJsApi();
 * 需要在 App.vue 的 onLaunch 里执行此 init 函数
自动模式
vk.h5.init();
手动模式
vk.h5.init({
	debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
	appId: "", // 必填，公众号的唯一标识
	timestamp: "", // 必填，生成签名的时间戳
	nonceStr: "", // 必填，生成签名的随机串
	signature: "", // 必填，签名
})
 */
h5.init = function(obj = {}) {
	const vk = uni.vk;
	let {
		debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
		appId, // 必填，公众号的唯一标识
		timestamp, // 必填，生成签名的时间戳
		nonceStr, // 必填，生成签名的随机串
		signature, // 必填，签名
		jsApiList,
	} = obj;
	if (!jsApiList) {
		// 具体接口参数用法请访问 https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html 查看文档
		jsApiList = [
			"updateAppMessageShareData", // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
			"updateTimelineShareData", // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
			//"onMenuShareAppMessage", // 微信已废弃此接口
			//"onMenuShareTimeline",// 微信已废弃此接口
			"onMenuShareWeibo", // 分享到腾讯微博
			"onMenuShareQZone", // 分享到QQ空间
			"startRecord", // 开始录音接口
			"stopRecord", // 停止录音接口
			"onVoiceRecordEnd", // 监听录音自动停止接口
			"playVoice", // 播放语音接口
			"pauseVoice", // 暂停播放接口
			"stopVoice", // 停止播放接口
			"onVoicePlayEnd", // 监听语音播放完毕接口
			"uploadVoice", // 上传语音接口
			"downloadVoice", // 下载语音接口
			"chooseImage", // 拍照或从手机相册中选图接口
			"previewImage", // 预览图片接口
			"uploadImage", // 上传图片接口
			"downloadImage", // 下载图片接口
			"translateVoice", // 识别音频并返回识别结果接口
			"getNetworkType", // 获取网络状态接口
			"openLocation", // 使用微信内置地图查看位置接口
			"getLocation", // 获取地理位置接口
			"startSearchBeacons", // 开启查找周边ibeacon设备接口
			"stopSearchBeacons", // 关闭查找周边ibeacon设备接口
			"onSearchBeacons", // 监听周边ibeacon设备接口
			"hideOptionMenu", // 效果和hideAllNonBaseMenuItem一致
			"showOptionMenu", // 效果和showAllNonBaseMenuItem一致
			"hideMenuItems", // 批量隐藏功能按钮接口
			"showMenuItems", // 批量显示功能按钮接口
			"hideAllNonBaseMenuItem", // 隐藏所有非基础按钮接口（可以用来一键隐藏分享按钮）
			"showAllNonBaseMenuItem", // 显示所有功能按钮接口（可以用来一键显示分享按钮）
			"closeWindow", // 关闭当前网页窗口接口
			"scanQRCode", // 调起微信扫一扫接口
			"openProductSpecificView", // 跳转微信商品页接口
			"addCard", // 批量添加卡券接口
			"chooseCard", // 拉取适用卡券列表并获取用户选择信息
			"openCard", // 查看微信卡包中的卡券接口
			"chooseWXPay", // 发起微信支付
		];
	}
	const env = vk.h5.getEnv();
	if (env === "h5-weixin") {
		const setConfig = (config = {}) => {
			wx.config(Object.assign({
				debug,
				appId,
				timestamp,
				nonceStr,
				signature,
				jsApiList
			}, config));
			wx.error((err) => {
				console.error(err);
			});
		}
		if (appId) {
			setConfig();
		} else {
			vk.userCenter.getWeiXinJsapiSign({
				success: (data) => {
					setConfig({
						...data.config,
						debug
					});
				}
			});
		}
	}
};

// 注意：只有执行过 vk.h5.init() 后才可以执行以下方法

/**
 * 微信公众号同时设置分享好友和朋友圈（仅设置分享信息，最终分享依然要点右上角三个点）
let wx = vk.h5.getWeiXinJsApi();
 */
h5.getWeiXinJsApi = function() {
	const proxyObj = {};
	const newObj = new Proxy(proxyObj, {
		get: function(target, key, receiver) {
			return async function(options) {
				const env = vk.h5.getEnv();
				if (env === "h5-weixin") {
					wx.ready(() => {
						wx[key](options);
						// wx.checkJsApi({
						// 	jsApiList: [key],
						// 	success: (res) => {
						// 		if (res.checkResult[key]) {
						// 			// 支持
						// 			wx[key](options);
						// 		} else {
						// 			// 不支持
						// 			console.error(`不支持接口${key}`);
						// 		}
						// 	}
						// });
					});
				}
			}
		}
	});
	return newObj;
};


/**
 * 语法糖，微信公众号同时设置分享好友和朋友圈（仅设置分享信息，最终分享依然要点右上角三个点）
vk.h5.updateShareData({
	title: "标题",
	desc: "描述", // 仅分享好友有效
	link:  window.location.href,
	imgUrl: "图片链接地址"
});
 */
h5.updateShareData = function(obj = {}) {
	const env = vk.h5.getEnv();
	if (env === "h5-weixin") {
		const wx = vk.h5.getWeiXinJsApi();
		// 分享到朋友圈和分享到QQ空间
		wx.updateAppMessageShareData(obj);
		// 分享到朋友圈和分享到QQ空间
		wx.updateTimelineShareData(obj);
	}
};

export default h5;
// #endif