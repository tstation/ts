var TitleUtil = {

		title : "T'Station.com",
		curPageIdx : 1,
		deptLen: 0,
		resultArr:[],
		detailNm: {},
		init : function(option) {
			this.getPageDept();
		},

		getPageDept : function() {
			var titleThisUrl = location.href;
			var baseUrl = _baseUrl;
			titleThisUrl = titleThisUrl.replace(baseUrl, "");
			titleThisUrl = "/"+titleThisUrl;
			var indexCk = titleThisUrl.indexOf("/");

			if( indexCk > -1 ){
				var results = titleThisUrl.match(/\//g);
				this.deptLen = results.length;
			}

			var url = /([\w-]+)/gi;
			var result = titleThisUrl.match(url);
			this.resultArr = result;

			var title = "";

			if( this.deptLen > 0 ){
//				alert(this.deptLen);
				if( this.deptLen == 1 ){
					if( this.resultArr == null ){
						title = this.getmTitleNm("tire") + this.title;
					}else{
						title = this.getmTitleNm(this.resultArr[0]) + this.title;
					}
				}else if( this.deptLen == 2 ){
					title = this.getfTitleNm(this.resultArr[3]) + this.getmTitleNm(this.resultArr[0]) + this.title;
				}else if( this.deptLen == 3 ){
					title = this.getdTitleNm(this.resultArr[2]) + this.getmTitleNm(this.resultArr[0]) + this.title;
				}else if( this.deptLen == 4 ){
					title = this.getdTitleNm(this.resultArr[2]) + this.getmTitleNm(this.resultArr[0]) + this.title;
				}else if( this.deptLen == 5 ){
					title = this.getdTitleNm(this.resultArr[2]) + this.getmTitleNm(this.resultArr[0]) + this.title;
				}

			}

			if( title == "" ){
				title = this.title;
			}

			$(document).find("title").text(title);

		},

		/* 상품명, 패턴코드 ajax 조회로 수정예정*/
		/* 타이틀 이름 매핑(상세) */
		getdTitleNm : function(result) {
			var titleNm = "";
			var dept = this.resultArr[0];
			var dept1 = this.resultArr[1];
			var dept2 = this.resultArr[2];
			var dept3 = this.resultArr[3];

			if( dept == "member" ){
				if( dept1 == "login"  ){
					titleNm = "로그인";
				}else if( dept1 == "register" ){
					titleNm = "회원가입";
				}
			}else if( dept == "tire" ){
				if( dept3 == "ptrnCd" ){
					titleNm = "["+this.detailNm.ptrnNm+"]";
				}else if( dept3 == "goodsNo" ){
					titleNm = "["+this.detailNm.goodsNm+"]";
				}
			}else if( dept == "auto-service" ){
				if( dept1 == "product" ){
					titleNm = "["+this.detailNm.ptrnNm+"]";
				}else if( dept3 == "goodsNo" ){
					titleNm = "["+this.detailNm.goodsNm+"]";
				}
			}else if( dept == "customer-service" ){
				if( dept1 == "announcement"  ){
					titleNm = "공지사항";
				}else if( dept1 == "warranty" ){
					titleNm = "무상보증서비스";
				}else if( dept1 == "tsservice" ){
					titleNm = "T’Station 서비스 안내";
				}
			}else if( dept == "mypage" ){
				if( result == "order-history"  ){
					titleNm = "주문내역";
				}else if( result == "return" ){
					titleNm = "주문취소내역";
				}else if( result == "custservice" ){
					if( this.resultArr[3] == "carservice-hist" || this.resultArr[3] == "keepservice-hist" ){
						titleNm = "매장서비스내역";
					}else if( this.resultArr[3] == "safeinsuarance-list" ){
						titleNm = "안심서비스내역";
					}
				}else if( result == "warranty" ){
					titleNm = "무상보증내역";
				}else if( result == "compare-goodshist" ){
					titleNm = "상품비교내역";
				}else if( result == "event" ){
					titleNm = "이벤트응모내역";
				}else if( result == "carmgmt" ){
					titleNm = "내 차 관리";
				}else if( result == "qna" ){
					titleNm = "1:1상담내역";
				}else if( result == "memberconfirm" ){
					titleNm = "개인정보";
				}else if( result == "restock" ){
					titleNm = "재입고 알림";
				}else if( result == "familyCoupon" ){
					titleNm = "패밀리쿠폰";
				}else if( result == "coupon" ){
					titleNm = "쿠폰함";
				}else if( result == "goods-review" ){
					titleNm = "상품평";
				}else if( result == "reservation" ){
					titleNm = "방문예약";
				}
			}else if( dept == "store"){
				if( this.detailNm.shopNm != "" ){
					titleNm = "["+this.detailNm.shopNm+"]";
				}
			}else if( dept == "promotion"){
				if( this.detailNm.evtNm != "" ){
					titleNm = "["+this.detailNm.evtNm+"]";
				}
			}

			if( titleNm != "" ){
				titleNm = titleNm + " - ";
			}
			return titleNm;
		},

		/* 타이틀 이름 매핑(중간) */
		getmTitleNm : function(result) {

			var titleNm = "";
			if( result == "tire" ){
				titleNm = "타이어 쇼핑은";
			}else if( result == "auto-service" ){
				titleNm = "경정비 쇼핑은";
			}else if( result == "promotion" ){
				if( this.resultArr[1] == "event-list" || this.resultArr[1] == "event"){
					titleNm = "진행 중인 이벤트 - ";
				}else if( this.resultArr[1] == "past-event-list" ){
					titleNm = "지난 이벤트 - ";
				}
			}else if( result == "company" ){
				titleNm = "SmartCare 서비스 - ";
			}else if( result == "customer-service" ){
				titleNm = "고객센터 - ";
			}else if( result == "cart" ){
				titleNm = "장바구니 - ";
			}else if( result == "order" ){
				if( this.resultArr[1] == "getSvcChocForm" ){
					titleNm = "서비스 선택 - ";
				}else if( this.resultArr[1] == "getOrderForm" ){
					titleNm = "주문/결제 - ";
				}else if( this.resultArr[1] == "getOrderComplete" ){
					titleNm = "결제완료 - ";
				}
			}else if( result == "mypage" ){
				titleNm = "마이페이지 - ";
			}else if( result == "terms" ){
				titleNm = "티스테이션 약관 - ";
			}else if( this.resultArr[2] == "getShopVisitReserve"){
				titleNm = "방문 예약하기 - ";
			}

			if( titleNm != "" ){
				titleNm = titleNm + "  ";
			}

			return titleNm;
		},

		/* 타이틀 이름 매핑(처음) */
		getfTitleNm : function(result) {

			var titleNm = "";
			var dept1 = this.resultArr[1];

			if( dept1 == "auto-brands" ){
				if( result == "hk" ){
					titleNm = "[한국타이어]";
				}else if( result == "mc" ){
					titleNm = "[미쉐린타이어]";
				}else if( result == "pi" ){
					titleNm = "[피렐리타이어]";
				}else if( result == "mx" ){
					titleNm = "[맥시스타이어]";
				}
			}else if( dept1 == "seasons" ){
				if( result == "a" ){
					titleNm = "[사계절]";
				}else if( result == "s" ){
					titleNm = "[여름]";
				}else if( result == "w" ){
					titleNm = "[겨울]";
				}
			}else if( dept1 == "types" ){
				if( result == "p" ){
					titleNm = "[승용차용]";
				}else if( result == "s" ){
					titleNm = "[SUV용]";
				}else if( result == "lt" ){
					titleNm = "[경트럭/VAN]";
				}else if( result == "e" ){
					titleNm = "[전기차]";
				}
			}else if( dept1 == "products" ){
				titleNm = "[추천상품 리스트]";
			}else if( dept1 == "sizes" ){
				titleNm = "타이어 상품 목록";
			}else if( dept1 == "battery" ){
				titleNm = "[배터리]";
			}else if( dept1 == "enegine-oil" ){
				titleNm = "[엔진오일]";
			}else if( dept1 == "break-pad" ){
				titleNm = "[브레이크패드]";
			}else if( dept1 == "filter" ){
				titleNm = "[실내필터]";
			}else if( dept1 == "wiper" ){
				titleNm = "[와이퍼]";
			}else if( dept1 == "wheel-alignment" ){
				titleNm = "[휠 얼라인먼트]";
			}else if( dept1 == "locals" ){
				titleNm = "매장 방문 예약";
			}else if( dept1 == "smartmain" ){
				titleNm = "스마트케어";
			}else if( dept1 == "smartcounsel" ){
				titleNm = "전문 상담 서비스";
			}else if( dept1 == "smarttoday" ){
				titleNm = "오늘서비스";
			}else if( dept1 == "smartpickup" ){
				titleNm = "픽업&딜리버리";
			}else if( dept1 == "smartmulti" ){
				titleNm = "멀티브랜드";
			}else if( dept1 == "smarthotel" ){
				titleNm = "호텔서비스";
			}else if( dept1 == "qna" ){
				titleNm = "1:1 고객상담";
			}else if( dept1 == "faq" ){
				titleNm = "FAQ";
			}else if( dept1 == "warranty" ){
				titleNm = "무상보증서비스";
			}else if( dept1 == "tsservice" ){
				titleNm = "T’Station 서비스 안내";
			}

			if( titleNm != "" ){
				titleNm = titleNm + " - ";
			}

			return titleNm;
		},

		titleNameCallback : function( type, codeNo) {
			var srchCodeNm = "";
			var jsonParam = {
					type : type,
					codeNo : codeNo
			}
			_ajax.sendJSONRequest(
					"POST",
					_baseUrl + "getTitleCode",
					jsonParam,
					function(data) {
						if (data.result == true) {

							srchCodeNm = data.jsonCode;
						}
					}
			)
			return srchCodeNm;
		}

};
