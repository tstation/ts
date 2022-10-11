_ajax = common.Ajax;

$.namespace("common.Footer");
common.Footer = {
	checkBuyNowItem : function() { // 바로구매한 상품 장바구니에 담기 로직
		var mbrNo = "";
		var drtPurYn = "N";
		var dispYn = "Y"
		if (_isLogin) { // 로그인 체크
			mbrNo = appUser.mbrNo;
		}
		/*if (confirm("장바구니 담기지 않은 상품이 있습니다. 장바구니에 담겠습니까?")) {
			drtPurYn = "N";
		} else {
			dispYn = "N";
		}*/
		var jsonParam = {
				mbrNo : mbrNo,
				drtPurYn : drtPurYn,
				dispYn :  dispYn
		}
		_ajax.sendJSONRequest(
                "POST",
                _baseUrl + "cart/buyNowItemSaveJson.do",
                jsonParam,
                function(data) {
                	/*if (data.result == true && data.jsSaveStatus == "Y") {
                		common.Footer.cartCnt();
                	} else if (data.result == false) {
                		alert(data.message);
                	}*/
                	if (data.result == false) {
                		alert(data.message);
                	}

                	if(window.location.href == _baseUrl + "cart") {
                		window.location.reload();
                	}
                },
                false
            );
	},
	cartCnt : function() { // 장바구니 개수 확인 로직
		_ajax.sendJSONRequest(
				"POST",
				_baseUrl + "cart/cartCntJson.do",
				"",
				function(data) {
					if (data.result == true) {
						$('li > .cart > em').text(data.jsCurrCartCnt);
						$('li > .cart > .badge').text(data.jsCurrCartCnt);
					}
				}
		)

	},
	couponDown : function(cpnNoArr) { //쿠폰다운로드
		if(!_isLogin){
			alert("로그인을 해 주세요.");
			window.location.href = _baseUrl + "member/login/loginform.do";
			return false;
		}
		if(!cpnNoArr){
			alert("잘못된 접근입니다.");
			return false;
		}
		var param = {
				cpnNoArr : cpnNoArr
		}
		_ajax.sendJSONRequest(
				"POST",
				_baseUrl + "promotion/coupondownload.do",
				param,
				function(data) {
					if (data.result) {
						alert("쿠폰이 발급되었습니다\n[마이페이지]-내쿠폰함 확인");
					}
				}
		)

	},
	hdBanner : function() {
		_ajax.sendJSONRequest(
				"POST",
				_baseUrl + "header-banner",
				"",
				function(data) {
					if (data.result == true) {

						$('.banner').append(data.hdBanner);
					}
				}
		)

	}
};