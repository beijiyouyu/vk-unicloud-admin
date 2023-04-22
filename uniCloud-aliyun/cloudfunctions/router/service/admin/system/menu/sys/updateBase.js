module.exports = {
	/**
	 * 修改
	 * @url admin/system/menu/sys/updateBase 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} menu_id 					菜单Id，唯一标识
	 * @param {String} name 							菜单名称
	 * @param {String} comment 					备注
	 * @param {String} url 							页面路径
	 * @param {String} icon 							菜单图标
	 * @param {Number} sort 							排序(越大越在前面)
	 * @param {String} parent_id 				父级id
	 * @param {Boolean} enable 					是否启用
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			_id,
			sort,
			enable,
			hidden_menu
		} = data;
		if (vk.pubfn.isNull(_id)) return { code: -1, msg: "_id不能为空" };

		let dbName = "opendb-admin-menus";

		// 执行数据库API请求
		res.num = await vk.baseDao.updateById({
			dbName,
			id: _id,
			dataJson: {
				sort,
				enable,
				hidden_menu
			},
		});
		return res;
	}

}