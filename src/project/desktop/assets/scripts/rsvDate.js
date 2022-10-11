_ajax = common.Ajax;

$.namespace("reserve.date");
reserve.date = {

	notOpenDtArr : "",
	notOpenDtimeObj : "",
	notRsvDtimeObj : "",
	timeArea : "",
	callback : "",
	filterStartDay : "",
	filterEndDay : "",
	
	/** 
	 * parameter information
	 * _this : 달력 그려질 대상, 
	 * _shopSeq : ET_SHOP_INFO.SHOP_SEQ, 
	 * _days : 달력 시작일 (오늘일자 + _days) 
	 * _dlvSvcCd : 배송서비스 공통코드 [ORD050], 
	 * _timeArea : 시간영역 그려질 대상
	 * _callback : callback function
	 * _lastRsvDt : 예약가능 최종일
	 * _days2 : 필터시작일
	 * _days3 : 필터종료일
	 * */
	dateSet : function(_this, _shopSeq, _days, _dlvSvcCd, _timeArea, _callback, _lastRsvDt, _days2, _days3) {
		if (_timeArea != "undefined") {
			reserve.date.timeArea = _timeArea;
		}

		if (_callback != "undefined") {
			reserve.date.callback = _callback;
		}

		var retObj = reserve.date.getShopNotOpenInfo(_shopSeq);
		if (!retObj.result) {
			return false;
		}

		reserve.date.notOpenDtArr = retObj.notOpenDtList;
		reserve.date.notOpenDtimeObj = retObj.notOpenDtimeList;
		reserve.date.notRsvDtimeObj = retObj.notRsvDtimeList;
		
		// 마이페이지 > 주문상세에서 장착예정일 변경하는 경우
		if (_dlvSvcCd == "10" && typeof(order) == "undefined") {
			order = {
				svcChoc : { 
					getSvcType : function() { return 2; }
				}
			};
		}

		// $this = $(this);
		var containerClass = "." + _this.attr("data-rel");
		var containerId = "#" + _this.attr("data-id");
		var containerBox = "." + _this.attr("data-id");

		var objDate = new Date();

		if (_days > 0) {
			objDate.setDate(objDate.getDate() + Number(_days)); // 예약가능일로 변경
			$(".beable .close").trigger("click"); // 오늘 장착가능 숨김처리
		}
		
		if(_days2 != null && _days2 != 0){
			reserve.date.filterStartDay = objDate.addDate(Number(_days2)).format("yyyyMMdd");
		}

		if(_days3 != null && _days3 != 0){
			reserve.date.filterEndDay = objDate.addDate(Number(_days3)).format("yyyyMMdd");
		}

		var m = objDate.getMonth(), d = objDate.getDate(), y = objDate.getFullYear();
		m = (m + 1).lpad(2, "0");
		d = d.lpad(2, "0");
		
		var rsvDay = y + "" + m + d ; //yyymmdd 형으로 저장
		var dayCheck = false;
		
		//비영업일과 현재일 비교
		if (retObj.notOpenDtList.length <= 0) {
			rsvDay = y + "-" + m + "-" + d ;
		} else {
			for (var i = 0; i < retObj.notOpenDtList.length; i++) {
				if (reserve.date.contains(retObj.notOpenDtList, rsvDay)) {
					objDate = objDate.addDate(1); // 예약가능일 변경 
					$(".beable .close").trigger("click"); // 오늘장착 툴팁 숨김처리
					
					rsvDay = objDate.format("yyyyMMdd");
					dayCheck = true;
				} else {
					rsvDay = objDate.format("yyyy-MM-dd");
					break;
				}
			}
		}
		
		// 픽업&딜리버리인 경우, 일요일 선택 불가 
		if (_dlvSvcCd == "10" && objDate.getDay() == 0) {
			rsvDay = objDate.addDate(1).format("yyyy-MM-dd");
		}
		
		$("#" + reserve.date.timeArea + "vstRsvDt").val(rsvDay);  // 선택일로 지정
		$("#dispRsltVstRstDt").text(rsvDay);
    	$("#dispRsltVstRstDt").addClass("on");
		rsvDay = rsvDay.replace(/-/g,""); // yyyymmdd 로 변경

		if (_dlvSvcCd == "20") { // 모바일 피팅
			reserve.date.mf_showAreaVstRsvTime(rsvDay); // 예약가능한 시간 설정
		} else  {
			reserve.date.showAreaVstRsvTime(rsvDay); // 예약가능한 시간 설정
		}
		
		var endDate = new Date();
		if(_lastRsvDt != null && _lastRsvDt != ""){
			endDate.setFullYear(_lastRsvDt.substring(0,4)
								,Number(_lastRsvDt.substring(4,6))-1
								, _lastRsvDt.substring(6,8)
								);
		}else{
			endDate.setDate(endDate.getDate() + 30);
		}
		
		if(rsvDay > endDate.format("yyyyMMdd")){
			alert("선택하신 매장은 예약 가능한 날짜가 없으니 다른 매장을 선택해 주시기 바랍니다.");
			return false;
		}
		
		$(containerClass).hide();
		$(containerId).show();
		_this.datepicker ({
			language : "ko-KR",
			inline : true,
			container : containerBox,
			format : "yyyy-mm-dd",
			yearFirst : true,
			yearSuffix : "년",
			daysMin : [ "일", "월", "화", "수", "목", "금", "토" ],
			months : [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월",
					"10월", "11월", "12월" ],
			startDate : objDate,
			filter : reserve.date.disableAllTheseDays,
			endDate : endDate,
			setDate : objDate //선택일 지정
		});
		
		$("#" + reserve.date.timeArea  + "vstRsvDt").on("change", function() {
        	var vstRsvDt = $(this).val();
        	vstRsvDt = vstRsvDt.replace(/-/g,"");
        	
        	if (_dlvSvcCd == "20") { // 모바일 피팅
    			reserve.date.mf_showAreaVstRsvTime(vstRsvDt); // 예약가능한 시간 설정
    		} else  {
    			reserve.date.showAreaVstRsvTime(vstRsvDt); // 예약가능한 시간 설정
    		}
    	});
		
		$(".selectDate").click(function() {
			reserve.date.callback();
		});
	},
	
	getShopNotOpenInfo : function(_shopSeq) {
    	var retObj = reserve.date.http.getShopNotOpenDtime.submit(_shopSeq);
    	return retObj;
    },
    
    contains : function (data, element) {
		for (var i = 0; i < data.length; i++) {
			if (data[i] == element) {
				return true;
			}
		}
		return false;
	}, 

	showAreaVstRsvTime : function(vstRsvDt) {
		var notOpenDtimeArr;
		var notRsvDtimeArr;

		// 선택한 날짜의 비영업시간 리스트 조회
		$(reserve.date.notOpenDtimeObj).each(function() {
			notOpenDtimeArr = $(this).attr(vstRsvDt);
			if (typeof (notOpenDtimeArr) != "undefined") {
				return false;
			}
		});

		// 선택한 날짜의 no capa 시간 리스트 조회
		$(reserve.date.notRsvDtimeObj).each(function() {
			notRsvDtimeArr = $(this).attr(vstRsvDt);
			if (typeof (notRsvDtimeArr) != "undefined") {
				return false;
			}
		});

		var objDate = new Date();
		var currentDate = objDate.format("yyyyMMdd");
		var currentHh = objDate.format("HH");

		// 시간대 배열
		var timeArr = [ "00", "01", "02", "03", "04", "05", "06", "07", "08",
				"09", "10", "11", "13", "14", "15", "16", "17", "18",
				"19", "20", "21", "22", "23" ];

		// 비영업시간 제외
		$(notOpenDtimeArr).each(function(k, v) {
    		var idx = timeArr.indexOf(v);
    		timeArr.splice(idx, 1);
    	});
		
		// 픽업&딜리버리인 경우, 09-17시만 선택 가능
    	if (typeof(order) !== "undefined" && order.svcChoc.getSvcType() == 2) {
    		$(timeArr).each(function(k, v) {
    			var time = Number(v);
    			if (time < 9 || time > 17) {
    				timeArr.splice(timeArr.indexOf(v), 1);
    			}
    		});
    	}
    	
		// 시간 선택 영역 생성&표시
		$("#" + reserve.date.timeArea + "areaVstRsvTime > ol").empty();
		var $ol = $("<ol>");
		for (var i = 0; i < timeArr.length; i++) {
			var $li = $("<li>");
			var $input = $("<input>").attr("type", "radio").attr("class",
					"btnS2").attr("name", reserve.date.timeArea + "TimeS")
					.attr("id", reserve.date.timeArea + "TimeS" + timeArr[i])
					.val(timeArr[i]);
			var $label = $("<label>").attr("class", "btnS2").attr("for",
					reserve.date.timeArea + "TimeS" + timeArr[i]).text(
					timeArr[i] + "시");

			// 오늘날짜에 해당하는 시간 목록의 경우, 주문시간+1시간 이전 disable 처리
			if (vstRsvDt == currentDate && timeArr[i] <= currentHh) {
				$input.attr("disabled", "disabled");
			}

			// capa 없는 시간 disable처리
			if (typeof (notRsvDtimeArr) == "undefined") {
				notRsvDtimeArr = new Array();
			}
			var index = notRsvDtimeArr.indexOf(timeArr[i]);
			if (index > -1) {
				$input.attr("disabled", "disabled");
			}

			$li.append($input).append($label);
			$ol.append($li);
		}

		$("#" + reserve.date.timeArea + "areaVstRsvTime").append($ol);
		$("#" + reserve.date.timeArea + "areaVstRsvTime").show();
	},
	
	// 찾아가는장착 - 시간선택영역 표시
	mf_showAreaVstRsvTime : function(vstRsvDt) {
		
		var notRsvDtimeArr;
		
		// 선택한 날짜의 no capa 시간 리스트 조회
		$(reserve.date.notRsvDtimeObj).each(function() {
			notRsvDtimeArr = $(this).attr(vstRsvDt);
			if(typeof(notRsvDtimeArr) != "undefined") {
				return false;
			}   
		});
		
		if(typeof(notRsvDtimeArr) == "undefined") {
			notRsvDtimeArr = new Array();
		}
		
		var objDate = new Date();
		var currentDate = objDate.format("yyyyMMdd");
		var currentHh = objDate.format("HH");
		
		// 시간대 배열
		var timeArr = ["09","12","14"];
		var dispTimeArr = ["오전","점심","오후"];
		
		// 시간 선택 영역 생성&표시
		$("#"+ reserve.date.timeArea +"areaVstRsvTime").empty();
		var $ol = $("<ol>");
		for(var i = 0; i < timeArr.length; i++) {
			var $li = $("<li>");
    		var $input = $("<input>").attr("type", "radio").attr("class", "btnS2").attr("name", reserve.date.timeArea+"TimeS").attr("id", reserve.date.timeArea+"TimeS"+timeArr[i]).val(timeArr[i]);
    		var $label = $("<label>").attr("class", "btnS2").attr("for", reserve.date.timeArea+"TimeS"+timeArr[i]).text(dispTimeArr[i]);
    		
    		// capa 없는 시간 disable처리
    		var index = notRsvDtimeArr.indexOf(timeArr[i]);
    		if(index > -1) {
    			$input.attr("disabled", "disabled");
    		}
    		
    		$li.append($input).append($label);
    		$ol.append($li);
		}
		
		$("#"+ reserve.date.timeArea +"areaVstRsvTime").append($ol);
		$("#"+ reserve.date.timeArea +"areaVstRsvTime").show();
	},
	
	disableAllTheseDays : function(date) {
		// 픽업&딜리버리인 경우, 일요일 비활성화 처리  
		if (typeof(order) !== "undefined" && order.svcChoc.getSvcType() == 2 && date.getDay() == 0) { 
			return false;
		}
		
		// 매장 비영업일 비활성화 처리 
		if($.inArray(date.format("yyyyMMdd"), reserve.date.notOpenDtArr) != -1) { 
	        return false;  
	    } 
		
		if(reserve.date.filterStartDay != "" && reserve.date.filterEndDay != ""){
			if(date.format("yyyyMMdd") >= reserve.date.filterStartDay && date.format("yyyyMMdd") <= reserve.date.filterEndDay){
				return false;
			}
		}
    }
};

$.namespace("reserve.date.http");
reserve.date.http = {
		 /*
	     * 일자선택 - 재고체크, 비영업일시 조회
	     */
	    getShopNotOpenDtime : {
	        jsonParam : false,
	        /** 
	         *   파라메터의 validation 처리
	         */
	        validation : function(vShopSeq) {
	            var isValid = true;
	            
	            if(isValid) {
	                this.jsonParam =   {
	                		shopSeq : vShopSeq
	                    };
	            }
	            return isValid;
	        },
	        submit : function(vShopSeq) {
	            var url = _baseUrl + "order/getShopNotOpenDtimeJson.do";
	            var retval = false;
	            var retObj;
	            var callback = function(jsonObj) {
	                retval = jsonObj.result;
	                retObj = jsonObj;
	                
	                if(!jsonObj.result) {
	                    if(jsonObj.jsMessage !== undefined) {
	                    	alert(jsonObj.jsMessage);
	                    } 
	                }
	            };
	            
	            var isValid = this.validation(vShopSeq);
	            if (isValid) {
	                //ajax 배열값 던지기 위해 수정 traditional : true, 옵션 추가 배열 직렬화 옵션
	                $.ajax({
	                    type: "POST",
	                    url: url,
	                    data: this.jsonParam,
	                    dataType : "json",
	                    async: false,
	                    cache: false,
	                    traditional : true,
	                    success: function(data) {
	                        callback(data);
	                    },
	                    error: function(data) {
	                        callback(data);
	                    }
	                });
	            }
	            
	            return retObj;
	        }
	    }
};