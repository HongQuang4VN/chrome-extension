var ptt_dkhp = {
	name: "username", // Thay đổi thành tài khoản chứng thực của bạn
	pass: "password", // Password của tài khoản chứng thực
};

/***
	Điền mã lớp cần đăng ký
	+ Đối với những môn không có thực hành:
		key: {
			0: "MaLop-LT"
		}
	+ Đối với những môn có thực hành:
		key: {
			0: "MaLop-LT",
			1: "MaLop-TH"
		}
	(key tăng từ 0 đến n)
***/
var ptt_malop = {
	// Mã lớp NT115.J11.ANTN
	0: {
		0: "NT115.J11.ANTN"
	},
	// Mã lớp NT133.J11.ANTN (LT + TH)
	1: {
		0: "NT133.J11.ANTN",
		1: "NT133.J11.ANTN.1"
	},
	// Mã lớp NT204.J11.ANTN (LT + TH)
	2: {
		0: "NT204.J11.ANTN",
		1: "NT204.J11.ANTN.1"
	},
	// Mã lớp NT207.J11.ANTN (LT + TH)
	3: {
		0: "NT207.J11.ANTN",
		1: "NT207.J11.ANTN.1"
	},
	// Mã lớp NT532.J11.ANTN (LT + TH)
	4: {
		0: "NT532.J11.ANTN",
		1: "NT532.J11.ANTN.1"
	}
};

setInterval(
	function(){
		$(document).ready(
			function(){
				var i = 0;
				while(i < Object.keys(ptt_malop).length){
					$.ajaxSetup({async: false});
					$.post(
						"https://dkhp.uit.edu.vn/",
						{"name": ptt_dkhp.name, "pass": ptt_dkhp.pass, "form_id": "user_login", "op": "Log in"}
					).done(
						function(){
							$.ajaxSetup({async: false});
							$.get(
								"https://dkhp.uit.edu.vn/sinhvien/hocphan/dangky"
							).done(
								function(data){
									var form_build_id = /name="form_build_id" value="(.*)"/.exec(data)[1];
									var form_token = /name="form_token" value="(.*)"/.exec(data)[1];
									var ptt_post_data = {};
									for(var j = 0; j < Object.keys(ptt_malop[i]).length; j++){
										ptt_post_data["table_lophoc[" + ptt_malop[i][j] + "]"] = ptt_malop[i][j];
									}
									ptt_post_data["dsmalop"] = "";
									ptt_post_data["loaimonhoc"] = "";
									ptt_post_data["khoaql"] = "";
									ptt_post_data["mamh"] = "";
									ptt_post_data["op"] = "Đăng ký";
									ptt_post_data["txtmasv"] = ptt_dkhp.name;
									ptt_post_data["form_build_id"] = form_build_id
									ptt_post_data["form_token"] = form_token;
									ptt_post_data["form_id"] = "uit_dkhp_dangky_form";
									$.ajaxSetup({async: false});
									$.post(
										"https://dkhp.uit.edu.vn/sinhvien/hocphan/dangky",
										ptt_post_data,
										function(result){
											for(var j in ptt_malop[i]){
												var pattern = new RegExp("table_lophoc_dadk\\[" + ptt_malop[i][j].replace(".", "\\.") + "\\]");
												if(pattern.test(result)){
													chrome.notifications.create(
														ptt_malop[i][j],
														{
															type: "basic",
															iconUrl: "../images/icon.png",
															title: "ĐKHP UIT",
															message: "Mã lớp " + ptt_malop[i][j] + " đã đăng ký thành công!"
														}
													);
													console.log("Mã lớp " + ptt_malop[i][j] + " đã đăng ký thành công!");
													delete ptt_malop[i][j];
												}
											}
											for(var j in ptt_malop[i]){
												console.log("Đang thử đăng ký lại mã lớp: " + ptt_malop[i][j]);
											}
										}
									).done(
										function(){
											i++;
										}
									);
									$.ajaxSetup({async: true});
								}
							);
							$.ajaxSetup({async: true});
						}
					);
					$.ajaxSetup({async: true});
				}
			}
		);
	},
	2000
);