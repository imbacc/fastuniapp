/**
 * 拦截请求
 */
import http from './vmeitime-http/interface.js'
import is_fun_tools from './is_fun_tools'

const call_fun_vuex_error_msg = (msg) => {
	is_fun_tools.check_login().then((res)=>{
		!res ? is_fun_tools.to_msg('请登录授权...') : (msg ? is_fun_tools.to_msg(msg) : is_fun_tools.to_msg()) 
	})
}

//设置请求拦截
http.interceptor.request = (config) => {
	
	let token = uni.getStorageSync("token")
	token instanceof String ? token = JSON.parse(token) : console.log("token="+token)
	
	//添加通用参数 Token
	config.header = {
		Authorization: `Bearer ${token}`
	}
	
	// config.requestId = new Date().getTime()
	console.log("【config】 "+JSON.stringify(config))
}

//设置响应拦截
http.interceptor.response = (res) => {
	
	if(res.errMsg.toString().indexOf("fail") != -1 || res.statusCode == 0){
		call_fun_vuex_error_msg()
		return false
	}
	
	// console.log("res...")
	// console.log(res)
	
	if(res.data.hasOwnProperty("result")){
		 return res.data
	}else{
		// console.log('---------------------------------------------')
		// console.log(res)
		// console.log('---------------------------------------------')
		if(res.data.error == "invalid_token"){
			call_fun_vuex_error_msg('服务器',res)
		}else{
			if(res.data.error.hasOwnProperty("message")){
				return res
			} 
			if(res.statusCode != 200) call_fun_vuex_error_msg()
		}
		console.log("res.data.error=")
		console.log(res.data.error)
		return false
	}
	
    return res
}

export default http
