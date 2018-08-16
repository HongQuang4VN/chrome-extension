console.log("%c ĐKHP UIT - Truoc Phan\n%chttps://www.facebook.com/TruocPT/", "color: green; font-style: italic; font-size: 42px", "font-size: 16px;");
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
	},
	// Mã lớp SS001.J11
	5: {
		0: "SS001.J11"
	}
};
var ptt_dk_thanhcong = {};

var ptt_callback = setInterval(
	function(){
		for(var k in ptt_malop){
			$.ajaxSetup({async: false});
			$.post(
				"https://dkhp.uit.edu.vn/",
				{"name": ptt_dkhp.name, "pass": ptt_dkhp.pass, "form_id": "user_login", "op": "Log in"}
			).done(
				function(){	
					$.get(
						"https://dkhp.uit.edu.vn/sinhvien/hocphan/dangky"
					).done(
						function(data){
							var form_build_id = /name="form_build_id" value="(.*)"/.exec(data)[1];
							var form_token = /name="form_token" value="(.*)"/.exec(data)[1];
							var ptt_post_data = {};
							for(var k1 in ptt_malop[k]){
								console.warn("Đang cố gắng đăng ký mã lớp " + ptt_malop[k][k1]);
								ptt_post_data["table_lophoc[" + ptt_malop[k][k1] + "]"] = ptt_malop[k][k1];
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
							$.post(
								"https://dkhp.uit.edu.vn/sinhvien/hocphan/dangky",
								ptt_post_data,
							).done(
								function(result){
									for(var k1 in ptt_malop[k]){
										var pattern = new RegExp("table_lophoc_dadk\\[" + ptt_malop[k][k1].replace(".", "\\.") + "\\]");
										if(pattern.test(result)){
											chrome.notifications.create(
												ptt_malop[k][k1],
												{
													type: "basic",
													iconUrl: "../images/icon.png",
													title: "ĐKHP UIT",
													message: "Mã lớp " + ptt_malop[k][k1] + " đã đăng ký thành công!"
												}
											);
											ptt_dk_thanhcong[k] = "";
											console.log("%c[" + (((new Date().getHours()) <= 9) ? ("0"+(new Date().getHours())) : (new Date().getHours())) + ":" + (((new Date().getMinutes()) <= 9) ? ("0"+(new Date().getMinutes())) : (new Date().getMinutes())) + ":" + (((new Date().getSeconds()) <= 9) ? ("0"+(new Date().getSeconds())) : (new Date().getSeconds())) + "] Mã lớp " + ptt_malop[k][k1] + " đã đăng ký thành công!", "color: blue;");
											delete ptt_malop[k][k1];
										}
									}
								}
							);
						}
					);
				}
			);
		}
		for(var k in ptt_dk_thanhcong){
			delete ptt_malop[k];
		}
		if(Object.keys(ptt_malop).length == 0)
		{
			console.log("%c[" + (((new Date().getHours()) <= 9) ? ("0"+(new Date().getHours())) : (new Date().getHours())) + ":" + (((new Date().getMinutes()) <= 9) ? ("0"+(new Date().getMinutes())) : (new Date().getMinutes())) + ":" + (((new Date().getSeconds()) <= 9) ? ("0"+(new Date().getSeconds())) : (new Date().getSeconds())) + "] Tất cả mã lớp đã đăng ký thành công!", "color: blue; font-size: 20px;");
			clearInterval(ptt_callback);
		}
	},
	2000
);