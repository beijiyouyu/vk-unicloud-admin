module.exports = {
  /**
   * QQ授权登录
   * @url user/pub/loginByQQ 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} code QQ小程序登录返回的code
	 * @param {String} accessToken QQ APP登录返回的access_token
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
   */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID, config, pubFun, vk , db, _ } = util;
		let { uid } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		// 微信登录(未绑定任何账号时,会新建账号)
		res = await uniID.loginByQQ(data);
		if(res.token){
			// 日志服务
			const loginLogService = vk.require("service/user/util/login_log");
			await loginLogService.add({
				type: "login",
				login_type: "qq",
				user_id: res.uid,
				context: originalParam.context
			},util);
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}