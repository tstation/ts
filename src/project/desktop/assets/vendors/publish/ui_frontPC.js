// 상품평에서 사진 보기 슬라이드 ajax
function ajaxPhotoView(){
	var swiper = new Swiper('.photo .swiper-container', {
		autoHeight: true,
		loop: false,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});
}

//주문하기 좌측 결제정보 scroll
function fixedBillinfo(pannelId, pageName, footerTarget) {
	var $pannelId = $('#'+pannelId),
		$startFixedEle = $pannelId.find('.'+pageName+'_content'),
		$window = $(window);
	$window.off('.fixedBill');
	
	if (!$startFixedEle.length) {return;}

	var	$infoBillWarp = $pannelId.find('.bill_wrap'),
		$infoBill = $infoBillWarp.find('.'+pageName+'_result'),
		$footer = $(footerTarget),
		//gnbHeight = $('#header').outerHeight() + 1,
		gnbHeight = 0,
		startPosit = 0,
		fixedLeftPosit = 0,
		scrollTop =0;
	// setTimeout
	setTimeout(function() {
		startPosit = $startFixedEle.offset().top;
		fixedLeftPosit = $infoBillWarp.offset().left - $window.scrollLeft();
		scrollTop = $window.scrollTop();

	// [우측 fixedBill (주문 정보) 높이값 상수에서 변수로 변경.]
	var _infoBillWrapHeight = $infoBillWarp.outerHeight();
		/*
		[BugFix ] 2018-12-07 : 쇼핑백화면에서 우측 Bill 영역의 위치 버그.
		[OrgCode] if ($pannelId.height() >= 840) { 
		: $pannelId 안에 추가 컨텐츠(인기상품)가 있어 스크롤적용 높이값이 늘어남.
		상품영역($startFixedEle)과 청구서영역($infoBillWarp) 높이값 적용 */
		var startFixedEleHeight = ($startFixedEle.outerHeight() > $infoBillWarp.outerHeight())?$startFixedEle.outerHeight():$infoBillWarp.outerHeight();
			$startFixedEle.css({height:  startFixedEleHeight });  
		if ($pannelId.height() >= _infoBillWrapHeight) {
			checkingPosition(startPosit, scrollTop);
		}
		
		$window.on('scroll.fixedBill',function() {
			scrollTop = $window.scrollTop();
			startPosit = $startFixedEle.offset().top;
			fixedLeftPosit = $infoBillWarp.offset().left - $window.scrollLeft();

			if ($pannelId.height() >= _infoBillWrapHeight) {
				checkingPosition(startPosit, scrollTop);
			}
		});
		$window.on('resize.fixedBill',function() {
			fixedLeftPosit = $infoBillWarp.offset().left - $window.scrollLeft();
			$infoBill.css({left:fixedLeftPosit});
		});
	}, 300) // setTimeout
	function checkingPosition(standardPosit, scrollPosit) {
		if (scrollPosit + gnbHeight >= standardPosit) {
			footerPositionChk();
		} else if (scrollPosit + gnbHeight < standardPosit) {
			$infoBill.removeAttr('style');
		}
	}
	//footer check
	function footerPositionChk() {
		var positTop = 0,
			infoHeight = scrollTop + $infoBill.height(),
			footerPosit = $footer.offset().top - 60;
		if(infoHeight > footerPosit - gnbHeight) {
			positTop = footerPosit - infoHeight;
		} else {
			positTop = gnbHeight;
		}
		$infoBill.css({position: 'fixed', left: fixedLeftPosit, top: positTop})
	}//footer check
	
}//주문하기 좌측 결제정보 scroll

$(document).ready(function(){
	if ( $('#container').length ) {
		var containerH1 = $('#header').height();
		var containerH2 = $('#footer').height();
		var containerH = $( window ).height() - containerH1 - containerH2;
		$('#container').css('min-height', containerH+'px');
		// END 검색 시 searchStep01 min-height 값 넣어서 bg 깔기
		
	};//
	// 전체메뉴 
	$(document).on( "click", '#h_allMenu', function() {
		$(this).toggleClass('on');
		$( "#h_allMenuLayer" ).toggle();
		$( "#dim_allmenu" ).toggle();
	});
	
	// Ajax 부분 Layer popup
	$(document).on( "click", '.popup-scarce', function() {
		var htmlUrl  = $(this).attr('data-rel');
		var boxWidth = $(this).attr('data-width');
		var ajaxPhotoIs = $(this).attr('name');
		var $el = $('.layer_box');
		$el.attr('data-width',boxWidth);
		var wrapH = $('#wrap').height();
		$('#layerScarcePopup').css('height', wrapH+'px');
		$.ajax({
			url:htmlUrl,
			method:"GET",
			dataType:"html",
			success:function(data){
				$('#scarce_content').empty().append(data);
				$('#layerScarcePopup').attr('tabindex', '0').show();
				var scrollT = $(document).scrollTop(),//스크롤 top 위치
					browserH = $( window ).height(),//브라우저 창 높이
					contentH = $('#scarce_content').height(),//컨텐츠 높이
					$elTop = scrollT + (browserH - contentH)/2;
				$('#scarce_content').focus();
				if (browserH <= contentH){
					$el.css({top: scrollT+'px' });
				} else {
					$el.css({top: $elTop+'px' });
				}

				if(ajaxPhotoIs == "PHOTO") {
					ajaxPhotoView();
				}
			}
		});
		$el.addClass(boxWidth);
		$this = $(this);
	});
	// Ajax 부분 Layer popup
	$(document).on( "click", '.popup-inner', function() {
		var htmlUrl  = $(this).attr('data-rel');
		var boxWidth = $(this).attr('data-width');
		var ajaxPhotoIs = $(this).attr('name');
		var $el = $('.layer_box2');
		$el.attr('data-width',boxWidth);
		var wrapH = $('#wrap').height();
		$('#layerinnerPopup').css('height', wrapH+'px');
		$.ajax({
			url:htmlUrl,
			method:"GET",
			dataType:"html",
			success:function(data){
				$('#scarce_inner').empty().append(data);
				$('#layerinnerPopup').attr('tabindex', '0').show().focus();

				var scrollT = $(document).scrollTop(),//스크롤 top 위치
					browserH = $( window ).height(),//브라우저 창 높이
					contentH = $('#scarce_inner').height(),//컨텐츠 높이
					$elTop = scrollT + (browserH - contentH)/2;
					//console.log(scrollT, browserH, contentH, $elTop );
				if (browserH <= contentH){
					$el.css({top: scrollT+'px' });
				} else {
					$el.css({top: $elTop+'px' });
				}

				if(ajaxPhotoIs == "PHOTO") {
					ajaxPhotoView();
				}
			}
		});
		$el.addClass(boxWidth);
		$this = $(this);
	});
	
	
	
	// Ajax 부분 Layer popup
	$(document).on( "click", '.popup-search', function() {
		var htmlUrl  = $(this).attr('data-rel');
		$('#scarce_content').empty();
		var $el = $('.layer_box'); 
		$.ajax({
			url:htmlUrl,
			method:"GET",
			dataType:"html",
			success:function(data){
				$('#scarce_content').empty().append(data);
				$('#layerScarcePopup').attr('tabindex', '0').show();
				$('#scarce_content').focus();
			}
		});
		$this = $(this);
	});
	
	
	// ID 부분 Layer
	$('.layer-scarce').click(function(){
		var layerId = $(this).attr('data-rel');
		var boxWidth = $(this).attr('data-width');
		var boxHeight = $(this).attr('data-height');
		var htmlContent = $('#'+layerId).html();
		var $el = $('.layer_box'); 
		var wrapH = $('#wrap').height();
		$el.attr('data-width',boxWidth);
		$el.addClass(boxWidth);
		$('#layerScarcePopup').css('height', wrapH+'px');
		$('#'+layerId).show();
		$('#layerScarcePopup').show();

		var scrollT = $(document).scrollTop();//스크롤 top 위치
		var browserH = $( window ).height();//브라우저 창 높이
		var contentH = $('#scarce_content').height();//컨텐츠 높이
		$elTop = scrollT + (browserH - contentH)/2;

		$('#'+layerId ).appendTo( '#layerScarcePopup #scarce_content' );
		if (browserH <= contentH){
			$el.css({top: scrollT+'px'});
			$el.css({marginTop: - boxHeight /2 })
		} else {
			$el.css({top: $elTop+'px'});
			$el.css({marginTop: - boxHeight /2 })
		}
		
		$('#scarce_content').attr('tabindex', '0').focus();
		$this = $(this);
	});
	// ID 부분 alert layer
	$(document).on( "click", '.view_alert', function() {
		var layerId = $(this).attr('data-rel');
		var $el = $( '#'+layerId + " .alert_box"); 
		
		$('#'+layerId).show();
		$('#'+layerId).attr('tabindex', '0').focus();
		var $elHeight = ~~($el.height()),
			docHeight = $(document).height();
		if ($elHeight < docHeight) {
			$el.css({marginTop: - $elHeight /2 -20})
		} else { $el.css({top: 0});}
		$this = $(this);
	});
	// layerScarcePopup END
	// 팝업 닫기 layerScarcePopup
	$(document).on( "click", '.layer-scarce-close', function() {
		$('#layerScarcePopup').hide();
		//$('#scarce_content').empty();
		var boxWidth = $('.layer_box').attr('data-width');
		var boxHeight = $('.layer_box').attr('data-height');
		$('.layer_box').attr('data-width','');
		$('.layer_box').attr('data-height','');
		$('#layerScarcePopup > div').removeClass(boxWidth);
		$('.layer_box').removeAttr("style");
		$this.focus();
	});
	$(document).on( "click", '.popup-inner-close', function() {
		$('#layerinnerPopup').hide();
		$('#scarce_inner').empty();
		var boxWidth = $('.layer_box2').attr('data-width');
		$('.layer_box2').attr('data-width','');
		$('#layerinnerPopup > div').removeClass(boxWidth);
		$('.layer_box2').removeAttr("style");
		$this.focus();
	});
	// 얼럿 레이어 닫기  view_alert * 0618 클래스명 오류. 수정*/
	$(document).on( "click", '.close_alert', function() {
		var layerId = $(this).attr('data-rel');
		$('#'+layerId).hide();
		$('.layer_alert').removeAttr("style");
		$this.focus();
	});
	
	//* FAQ : Accordion Script 
	var faqPanel = $('#accordion > dt').show();
	var faqPanels = $('#accordion > dd').hide();
	$('#accordion > dt').click(function() {
		$this = $(this);
		$target =  $(this).next();
		if(!$target.hasClass('on')){
			faqPanel.removeClass('on');
			faqPanels.removeClass('on').slideUp();
			$this.addClass('on');
			$target.addClass('on').slideDown();
		} else {
			$this.removeClass('on');
			$target.removeClass('on').slideUp();
		}
		return false;
	});
	//* FAQ : Accordion Script END
	// show hide Toggle
	$(document).on( "click", '.toggle_box .tit', function() {
		var viewcont = $(this).parent();
		if($(viewcont).hasClass('on')){
			$(viewcont).removeClass('on');
			$(this).removeClass('on');
		} else {
			$(viewcont).addClass('on');
			$(this).addClass('on');
		}
	});
	// 결
	//Tab Style 시작
	$(document).on( "click", '.tabScript > ul > li button', function() {
		var onTag = $(this).parent();
		var tabCont = $(this).attr('data-rel');
		var activeTab = $(this).attr("title");
		$(".tabScript > ul > li").removeClass("on");
		onTag.addClass("on");
		$(".tabScript > ." + tabCont).hide();
		$("#" + activeTab).show();
	});
	//Tab Style 끝

	// 패스워드 보이기 숨기기 
	$('.pwView').change(function(){
		var inpTxt = $(this).attr('data-rel');
		if($(this).is(':checked')){
			$('.'+inpTxt).attr('type','text');
			$(this).addClass('on');
		}else{
			$('.'+inpTxt).attr('type','password');
			$(this).removeClass('on');
		}
	});
	// 패스워드 보이기 숨기기 
	// check All
	$(document).on( "click", '.checkAll', function() {
		var str = $(this).attr('name');
		var chkName = str.substring(3, str.length); //chkName = str.substring(0, str.length -4 );
		if(this.checked){
			$("input[name=" + chkName + "]").each(function(){ this.checked=true; });
		}else{
			$("input[name=" + chkName + "]").each(function(){ this.checked=false; })
		}
	});
	// check All Clear
	$(document).on( "click", '.checkSingle', function() {
		var str = $(this).attr('name');
		var chkName = "All"+str;
		if ($("input[name=" + str + "]").is(":checked")){
			var isAllChecked = 0;
			$("input[name=" + str + "]").each(function(){
				if(!this.checked)
					isAllChecked = 1;
			});
			if(isAllChecked == 0){ $("#" + chkName).prop("checked", true);
			}else { $("#" + chkName).prop("checked", false);
			};
		}
	});
	// check All Clear END
	
	// 업로드 한 파일 삭제
	$(document).on( "click", '.fileClear', function() {
		var cHref = $(this).parent(".filebox").find('.upload-hidden').attr('data-href');
		var divID = $("." +cHref).find('.upload-display');
		console.log(cHref);
		$(this).parent(".filebox").find('input').val("");
		divID.remove();
		$(this).hide();
	});
	// 파일 업로드 
	$(document).on( "change", '.filebox .upload-hidden', function() {
		if(window.FileReader){
			var filename = $(this)[0].files[0].name;// 파일명 추출
		} else {
			var filename = $(this).val().split('/').pop().split('\\').pop();// Old IE 파일명 추출
		};
		$(this).parent(".filebox").find('.upload-name').val(filename);
	});
	//preview image 
	$(document).on( "change", '.preview-image .upload-hidden', function() {
		var parent = $(this).parent();
		var cHref = $(this).attr('data-href');
		var divID = $("." +cHref);
		$(this).parent().children('.fileClear').show();
		divID.children('.upload-display').remove();
		if(window.FileReader){
			if (!$(this)[0].files[0].type.match(/image\//)) return; //image 파일만
			var reader = new FileReader();
			reader.onload = function(e){
				var src = e.target.result;
				divID.prepend('<div class="upload-display"><img src="'+src+'" class="upload-thumb"></div>');
			}
			reader.readAsDataURL($(this)[0].files[0]);
		} else {
			$(this)[0].select();
			$(this)[0].blur();
			var imgSrc = document.selection.createRange().text;
			divID.prepend('<div class="upload-display"><img class="upload-thumb"></div>');
			var img = $(this).siblings('.upload-display').find('img');
			img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\""+imgSrc+"\")";		
		}
	});
	//preview image END
	$(document).ready(function() {
	    $(".icn_soldout").append('<div class="tooltip_box"><p class="tooltip_title">품절임박</p><p class="tooltip_text">재고가 곧 품절될 수 있으니 구매 결정을 서둘러 주세요.</p></div>');
	    $(".icn_relieve").append('<div class="tooltip_box"><p class="tooltip_title">스마트안심서비스</p><p class="tooltip_text">구매 후 1년 그리고 1만 6천킬로미터 이내 주행 중 발생한 타이어 파손 건에 대해 동일 타이어로 보상해주는 서비스입니다.</p></div>');
	});
	
	$(document).ready(function(){
		setTimeout(function() {$('.tootipFadeOut').fadeOut();}, 2000);
	});

});
