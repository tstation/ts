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
//햄버거 최근 본 상품
function nonRecentList(){
	var swiper = new Swiper('.recent_list .swiper-container', {
		pagination: {
			el: '.swiper-pagination',
		},
	});
}


$(document).ready(function(){
	var $this;
	if($("#container").hasClass("member")) {
		$('#footer').hide();
	};
	if($("#container").hasClass("search")) {
		$('#footer').hide();
	};//
	// 메뉴
	/*$("#header .btn-open-sidebar").click(function(){
		$('#hamburgerMenu').show();
		var minusH = $('.ham_menu .my_area').height() + 20;
		var winH = $( window ).height() - minusH;
		$( "#hamburgerMenu .inner" ).height( winH );
		$( "body" ).addClass( "fixed" );
		nonRecentList();
	});*/
	$("#hamburgerMenu .h_close").click(function(){
		$( "body" ).removeClass( "fixed" );
		$('#hamburgerMenu').hide();
	});
	// 상단 history back
	$("#pageTitle .p_back").click(function(){
		history.back();
	});

	// Ajax Full Layer popup
	$(document).on( "click", '.popup-full', function() {
		var htmlUrl = $(this).attr('data-rel');
		var boxClass = $(this).attr('title');
		var ajaxPhotoIs = $(this).attr('name');
		var popupfixedYN = $(this).attr('popupFixed');
		if(popupfixedYN == null || popupfixedYN != "N"){
			$( "body" ).addClass( "fixed" );
		}
		$( "#layerFullPopup .layer_box" ).addClass( boxClass );
		$.ajax({
			url:htmlUrl,
			method:"GET",
			dataType:"html",
			success:function(data){
				$('#full_content').empty().append(data);
				$('#layerFullPopup').attr('tabindex', '0').show().focus();
				if(ajaxPhotoIs == "PHOTO") {
					ajaxPhotoView();
				}
			}
		});
		$this = $(this);
	});
	$(document).on( "click", '.popup-inner', function() {
		var htmlUrl = $(this).attr('data-rel');
		var boxClass = $(this).attr('title');
		$( "#layerInnerPopup .layer_box2" ).addClass( boxClass );
		$.ajax({
			url:htmlUrl,
			method:"GET",
			dataType:"html",
			success:function(data){
				$('#full_inner').empty().append(data);
				$('#layerInnerPopup').attr('tabindex', '0').show().focus();
			}
		});
		$this = $(this);
	});
	// Full Layer popup
	$(document).on( "click", '.popup-full2', function() {
		var layerId = $(this).attr('data-rel');
		$( "body" ).addClass( "fixed" );
		$('#'+layerId).show();
		$this = $(this);
	});
	// 팝업 닫기 layerFullPopup
	$(document).on( "click", '.layer-full-close2', function() {
		$( "body" ).removeClass( "fixed" );
		$('#layerFull').hide();
		$this.focus();
	});
	// Ajax 부분 Layer popup
	var popupScarceScrollTop; // 20200608 추가 daesung
	$(document).on( "click", '.popup-scarce', function() {
		var htmlUrl = $(this).attr('data-rel');
		var $el = $('.layer_box');
		$.ajax({
			url:htmlUrl,
			method:"GET",
			dataType:"html",
			success:function(data){
				$('#scarce_content').empty().append(data);
				$('#layerScarcePopup').attr('tabindex', '0').show();
				$('#scarce_content').focus();


				// 20200608 추가 daesung
				popupScarceScrollTop = $(document).scrollTop();
				$("body").css("position","fixed");
				if(popupScarceScrollTop > 50){
					$("body").css("top", "-" + (popupScarceScrollTop + 50) + "px");
				} else {
					$("body").css("top", "-" + (popupScarceScrollTop) + "px");
				}

				setTimeout(function(){
					var $elHeight = ~~($el.outerHeight()),
						docHeight = $('#scarce_content').height();
						console.log($elHeight, docHeight)
						if ($elHeight < docHeight) {
							$el.css({marginTop: -docHeight /2 })
						} else { $el.css({top: 0});}
				},30);
				// 20200608
			}
		});
		$this = $(this);
	});
	// ID Full Layer
	$(document).on( "click", '.layer-full', function() {
		var layerId = $(this).attr('data-rel');
		var htmlContent = $('#'+layerId).html();
		var ajaxPhotoIs = $(this).attr('name');
		$('#'+layerId).show();
		$( "body" ).addClass( "fixed" );
		$( '#'+layerId ).appendTo( '#layerFullPopup #full_content' );
		$('#layerFullPopup').show();
		$('#layerFullPopup').attr('tabindex', '0').focus();
		if(ajaxPhotoIs == "PHOTO") {
			ajaxPhotoView();
		}
		$this = $(this);
	});
	// ID 부분 Layer
	$(document).on( "click", '.layer-scarce', function() {
		var layerId = $(this).attr('data-rel');
		var htmlContent = $('#'+layerId).html();
		var $el = $('.layer_box');
		$('#'+layerId).show();
		//$('#layerScarcePopup').find('#scarce_content').html(htmlContent);
		$( '#'+layerId ).appendTo( '#layerScarcePopup #scarce_content' );
		$('#layerScarcePopup').show();
		$('#scarce_content').attr('tabindex', '0').focus();
		var $elHeight = ~~($el.outerHeight()),
			docHeight = $('#scarce_content').height();
		if ($elHeight < docHeight) {
			$el.css({marginTop: -docHeight /2 })
		} else { $el.css({top: 0});}
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
			$el.css({marginTop: - $elHeight /2 -30 })
		} else { $el.css({top: 0});}
		$this = $(this);
	});
	// layerScarcePopup END
	// 팝업 닫기 layerFullPopup
	$(document).on( "click", '.layer-full-close', function() {
		$( "body" ).removeClass( "fixed" );
		$('#layerFullPopup').hide();
		$('#full_content').empty();
		$('.layer_box').removeAttr("style");
		$('.layer_box').removeClass("white");
		$this.focus();
	});
	$(document).on( "click", '.layer-inner-close', function() {
		$('#layerInnerPopup').hide();
		$('#full_inner').empty();
		$('.layer_box2').removeAttr("style");
		$('.layer_box2').removeClass("white");
		$this.focus();
	});
	// 팝업 닫기 layerScarcePopup
	$(document).on( "click", '.layer-scarce-close', function() {
		// 20200608 추가 daesung
		 $("body").css("position","relative");
		 $("body").css("top" , "");
		 $(document).scrollTop(popupScarceScrollTop);
		// 20200608

		$('#layerScarcePopup').hide();
		//$('#scarce_content > div').remove();
		$('.layer_box').removeAttr("style");
		$this.focus();
	});
	// 얼럿 레이어 닫기  view_alert * 0618 클래스명 오류. 수정*/
	$(document).on( "click", '.close_alert', function() {
		var layerId = $(this).attr('data-rel');
		$('#'+layerId).hide();
		//$('#scarce_content > div').remove();
		$('.layer_alert').removeAttr("style");
		$this.focus();
	});
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


	//플로팅 주문버튼 보임/안보임 처리
	var mobileH = $(window).height();
	var bodyH = $(document).height() - 200;

	if(mobileH < bodyH){
		console.log(mobileH, bodyH);
		$(window).scroll(function() {
			if ( $('.cart_list').length ) {
				var cartBtn = $( '.cart_list .cart_price' ).offset().top;
				if($(window).scrollTop() < (cartBtn-600) ) {
					$('#cartFloating').fadeIn();
				} else {
					$('#cartFloating').fadeOut();
				}

			};//
			if ( $('#pageTitle').length ) {
				var browserH = $(window).scrollTop();
				var docHeight = $(document).height();
				if($(window).scrollTop() >= 100 ) {
					$('#pageTitle').addClass('fixed');
				} else {
					$('#pageTitle').removeClass('fixed');
				}
			};

			if ( $('#orderStepM1').length ) {
				if($(window).scrollTop() >= 100 ) {
					$('#orderStepM1').addClass('fixed');
					$('#orderStepM2').addClass('fixed');
					$('#orderStepM3').addClass('fixed');
				} else {
					$('#orderStepM1').removeClass('fixed');
					$('#orderStepM2').removeClass('fixed');
					$('#orderStepM3').removeClass('fixed');
				}
			};
		});
	}//




	// 페이지 타이틀 상단 고정 스크립트
	if ( $('#pageTitle').length ) {
		//$("html, body").animate({ scrollTop: 55 }, 300);
	};//

	//Tab Style 시작
	$(document).on( "click", '.tabScript ul li button', function() {
		var onTag = $(this).parent();
		var tabCont = $(this).attr('data-rel');
		var activeTab = $(this).attr("title");
		$(".tabScript ul li").removeClass("on");
		onTag.addClass("on");
		$(".tabScript > ." + tabCont).hide();
		$("#" + activeTab).show();
	});

	$(document).on( "click", '.tabScript2 .tab ul li button', function() {
		var onTag = $(this).parent();
		var tabCont = $(this).attr('data-rel');
		var activeTab = $(this).attr("title");
		$(".tabScript2 .tab ul li").removeClass("on");
		onTag.addClass("on");
		$(".tabScript2 > ." + tabCont).hide();
		$("#" + activeTab).show();
	});
	//Tab Style 끝

	//* FAQ : Accordion Script
	var faqPanel = $('#accordion > dt').show();
	var faqPanels = $('#accordion > dd').hide();
	$('#accordion > dt > a').click(function() {
		$this = $(this).parent();
		$target =  $(this).parent().next();
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
	$('.toggle_box .tit').on("click", function () {
		var viewcont = $(this).parent();
		if($(viewcont).hasClass('on')){
			$(viewcont).removeClass('on');
		} else {
			$(viewcont).addClass('on');
			$(this).addClass('on');
		}
	});
	// 결

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
	    $(".icn_relieve").append('<div class="tooltip_box"><p class="tooltip_title">안심서비스</p><p class="tooltip_text">구매 후 1년 그리고 1만 6천킬로미터 이내 주행 중 발생한 타이어 파손 건에 대해 동일 타이어로 보상해주는 서비스입니다.</p></div>');
	});
	$(document).ready(function(){
		setTimeout(function() {$('.tootipFadeOut').fadeOut();}, 2000);
	});
});

/* lnb */
(function($){
	var lnbUI = {
		click : function (target, speed) {
			var _self = this,
					$target = $(target);
			_self.speed = speed || 300;

			$target.each(function(){
				if(findChildren($(this))) {
					return;
				}
				$(this).addClass('noDepth');
			});

			function findChildren(obj) {
				return obj.find('> ul').length > 0;
			}
			$target.on('click','a', function(e){//click
				if( !$(this).parent().hasClass('noDepth')){ //depth
					e.stopPropagation();
					var $this = $(this),
							$depthTarget = $this.next(),
							$siblings = $this.parent().siblings();
					$this.parent('li').find('ul li').removeClass('on');
					$siblings.removeClass('on');
					$siblings.find('ul').slideUp(250);

					if($depthTarget.css('display') == 'none') {
						_self.activeOn($this);
						$depthTarget.slideDown(_self.speed);
					} else {
						$depthTarget.slideUp(_self.speed);
						_self.activeOff($this);
					}
				}//depth
			})//click
		},
		activeOff : function($target) { $target.parent().removeClass('on');},
		activeOn : function($target) {$target.parent().addClass('on');}
	};
	// Call lnbUI
	$(function(){
		lnbUI.click('.menu_list li', 300)
	});
}(jQuery));

// tire-goods-list
;(function() {
	$.subNav = function() {
		$('.subnav-wrap').on("click", "li:not('.active') a", function(e) {
			$('.subnav-wrap').find('li').removeClass("active")
			$(this).closest('li').addClass("active")
		})
	};

	$.tabNav = function() {
		var tabWrap = $('.tabnav');
		var tabList = tabWrap.find('.item');
		var tabContent = $('.tab-wrap').find('.tab-content');

		tabList.each(function(e, item) {
		  tabList.eq(e).click(function(event) {
          tabList.removeClass('active');
          tabList.eq(e).addClass('active');
          tabContent.removeClass('active');
          tabContent.eq(e).addClass('active');
		  });
		});
	};

	$.rangeResponse = function(id) {
		var input_range = $('#' + id);
		var range_value = input_range.val();
		var responseLabel = input_range.closest('.range-wrap').find('.response-label');
		if (range_value <= 0.5) {
			input_range.val(0);
			responseLabel.html('<strong>AAAAA</strong>aaaaaa aaaaa aaaa aaaaa aaaaaa aaaaa');
		} else if ((range_value > 0.5) && (range_value < 1.5)) {
			input_range.val(1);
			responseLabel.html('<strong>BBBBBB</strong>bbbbbbb bbbb bb bbbbbb bb bbbbbb');
		} else if ((range_value >= 1.5) && (range_value < 2.5)) {
			input_range.val(2);
			responseLabel.html('<strong>DDDDDD</strong>dddd dddddd dddd dddddd dddddd dddd dddddd');
		} else if ((range_value >= 2.5) && (range_value < 3.5)) {
			input_range.val(3);
			responseLabel.html('<strong>EEEEEE</strong>eeeee eeeee eeeeee  ee eeeee eeeee eeeeee');
		}
		var responseBar = (100/input_range.attr('max')) * (input_range.val());
		input_range.css('background', 'linear-gradient(to right, #ff8400 0%, #ff8400 '+ responseBar +'%, #cbb58f ' + responseBar + '%, #cbb58f 100%)');
	}

	$.fn.prgSwiper = function(opts) {
		opts = $.extend({
		  pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
		  },
		  scrollbar: {
			  el: '.swiper-scrollbar'
		  },
		  navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
		  },
		  slidesPerView: 'auto'
		}, opts);

		return this.each(function() {
		  var $this = $(this);
		  var $item = $this.find('.swiper-slide');
		  var itemLength = $item.size();

		  if (itemLength > 1) {
			var listSlider = new Swiper($this[0], {
			  pagination: {
				el: opts.pagination.el,
				type: opts.pagination.type
			  },
			  scrollbar: {
				el: opts.scrollbar.el
			  },
			  navigation: {
				nextEl: opts.navigation.nextEl,
				prevEl: opts.navigation.prevEl
			  },
			  slidesPerView: opts.slidesPerView
			});
		  }
		});
	  };

	$.displaySelect = function() {
		var displaySort = $('.display-sort-wrap');
		var sortBtn = displaySort.find('.btn-sort');

		sortBtn.on('click', sortOpen);
		function sortOpen() {
			sortBtn.toggleClass('active');
		}
	};

	// $.storeSelect = function() {
	// 	$(document).on('click', '#storeListButton, #storeMapButton', function () {
  //       if ($(this).is('#storeListButton')) {
  //           sortList($(this))
  //       } else {
  //           sortMap($(this))
  //       }
  //   })
  //
	// 	function sortList(btn) {
	// 		btn.hide().siblings($('#storeMapButton')).show();
	// 		sortChange();
	// 	}
  //
	// 	function sortMap(btn) {
	// 		btn.hide().siblings($('#storeListButton')).show();
	// 		sortChange();
	// 	}
  //
	// 	function sortChange() {
	// 		if ($('.wheretire-section').hasClass('map-store-view')) {
	// 			storeListView();
	// 		} else {
	// 			storeMapView()
	// 		}
	// 	}
  //
	// 	function storeListView() {
  //       $('.wheretire-section').removeClass('map-store-view');
	// 		$('.store-list').show();
	// 		$('.store-maps').hide();
	// 	}
  //
	// 	function storeMapView() {
  //       $('.wheretire-section').addClass('map-store-view');
	// 		$('.store-maps').show();
	// 		$('.store-list').hide();
	// 	}
	// };

	$.prductTitleImg = function() {
		var brandImg = $('.name-group > .name').find('img')
		var brandWidth = 0;
		var timer;
		timer = setTimeout(function() {
			brandWidth = brandImg.load().width()/2;

			if(brandImg.is('img')) {
				brandImg.width(brandWidth);
			};
		}, 500);
	}

	$.navigationEvnet = function() {
		var $navigation = $('.bottom_items_wrapper');

		var prevScrollTop = 0;
		var nowScrollTop = 0;
		var timer;

		$(window).on('scroll touchmove', function() {
			nowScrollTop = $(window).scrollTop();

			if (nowScrollTop > prevScrollTop) {
				$navigation.addClass('top');
			} else if (nowScrollTop < prevScrollTop) {
				$navigation.removeClass('top');
			}

			prevScrollTop = nowScrollTop;
		});

		$(window).bind('scroll', function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			$navigation.removeClass('top');
		}, 200);
		});
  	};

    $.navigationEvnet = function() {
		var $navigation = $('.bottom-step-wrap');
		var prevScrollTop = 0;
		var nowScrollTop = 0;
		var timer;

		$(window).on('scroll touchmove', function() {
			nowScrollTop = $(window).scrollTop();

			if (nowScrollTop > prevScrollTop) {
				$navigation.addClass('top');
			} else if (nowScrollTop < prevScrollTop) {
				$navigation.removeClass('top');
			}

			prevScrollTop = nowScrollTop;
		});

    	$(window).bind('scroll', function() {
			clearTimeout(timer);
			timer = setTimeout(function() {
				//$navigation.removeClass('top');
			}, 200);
		});
	};


	$.footerHide = function() {
		if($('#footerHide').hasClass('bottom-step-wrap')) {
			$('#footer').hide();
		} else {
			$('#footer').show();
		}
	}

	/*$.fn.buyOption = function() {
		var buyOnBtn = $('#buyOptBtn');
		var buyOnInp = $('#buyOptInp');
		var buyOption = $('.buy-option-section');
		var buyCloseBtn = buyOption.find('.close-button-wrap>button');
		var buyOptionDim = buyOption.find('.dim-pannel');
		var basicOrderButton = buyOption.find('#basicOrderButton');
		var smartPayButton = buyOption.find('#smartPayButton');

		buyOnInp.on('change', function() {
			buyOptionOn()
		});

		buyOnBtn.on('click', function() {
			buyOptionOn()
		});

		function buyOptionOn() {
			buyOption.addClass('active');
			buyOption.removeClass('slidedown');
			$('body').addClass('fixed');
		};

		buyCloseBtn.on('click', function() {
			buyOptionClose();
		});

		buyOptionDim.on('click', function() {
			buyOptionClose();
		});

		function buyOptionClose() {
			buyOption.addClass('slidedown');
			setTimeout(function() {
				buyOption.removeClass('active');
			}, 200);
		  	$('body').removeClass('fixed');
			buyOnInp.prop('checked', false);
		}

		var basicOrderButton = buyOption.find('#basicOrderButton');
		var smartPayButton = buyOption.find('#smartPayButton');

		basicOrderButton.click(function() {
			$(this)
				.removeClass('btn-gray')
				.addClass('btn-primary')
				.closest(buyOption)
				.addClass('basic-order');
			smartPayButton.addClass('btn-gray');
		});

		smartPayButton.click(function() {
			$(this)
				.removeClass('btn-gray')
				.addClass('btn-primary')
				.closest(buyOption)
				.removeClass('basic-order');
			basicOrderButton.addClass('btn-gray');
		});
	};*/

	$.fn.eqAnyOf = function (arrayOfIndexes) {
		return this.filter(function(i) {
			return $.inArray(i, arrayOfIndexes) > -1;
		});
	};

	// $.todaySort = function() {
	// 	// 팝업 이벤트 내부에서 메소드가 작동 할 수 있도록 변경함
  //   // 오늘 서비스, 3일 이후 장착 토글
  //   $(document).on('click', '#todayService, #basicService', function (event) {
  //       // reset & toggle
  //       $('#todayService, #basicService')
  //         .removeClass('btn-primary')
  //         .addClass('btn-gray');
  //       $(this)
  //         .removeClass('btn-gray')
  //         .addClass('btn-primary');
  //
  //       // sorting
  //       if ($(this).is('#todayService')) {
  //           todaySorting()
  //       } else {
  //           resetSorting()
  //       }
  //   });
  //
	// 	function resetSorting() {
	// 	    var store = $('.find-location-near').find('.store-wrap')
  //       console.log('resetSorting')
	// 		if(store.hasClass('disable')) {
  //         store.removeClass('disable');
	// 		} else {
	// 			return false
	// 		}
	// 	};
  //
	// 	function todaySorting() {
  //       $('.find-location-near').find('.store-wrap').eqAnyOf([0, 1, 2, 3]).addClass('disable');
	// 	}
	// }

	$.bottomStep = function() {
      var swiperContainer = $('.swiper-container');
      var swiperWrapper = swiperContainer.find('.swiper-wrapper')

      $('#cardCheckButton').click(function() {
          swiperWrapper.each(function(i) {
              if(swiperWrapper.eq(i).hasClass('check-view')) {
                  swiperWrapper.eq(i).removeClass('check-view');
				  swiperWrapper.eq(i).find('.salecheck-tooltip-wrap > .guide-tip-bx').hide();
              } else {
                  swiperWrapper.eq(i).addClass('check-view');
				  swiperWrapper.eq(i).find('.salecheck-tooltip-wrap > .guide-tip-bx').show();
              }
          });
          $('.order-view').toggleClass('check-view')
      });
	};

	$(document).ready(function() {
		// $.fn.buyOption();
		$.subNav();
		$.tabNav();
		$.rangeResponse();
		$('.tire-result').prgSwiper({
			scrollbar: true
		});
		$('.other-result').prgSwiper({
			scrollbar: true
		});
		$.displaySelect();
		// $.storeSelect();
		$.prductTitleImg();
		$.navigationEvnet();
		$.footerHide();
		// $.todaySort();
		$.bottomStep();
	});


})(jQuery);

// order-list-wrap
;(function() {
	$.fn.eqAnyOf = function (arrayOfIndexes) {
		return this.filter(function(i) {
			return $.inArray(i, arrayOfIndexes) > -1;
		});
	};

	$.fn.orderAccordion = function() {
		return this.each(function(i) {
			var $accordionWrap = $('.order-accordian-wrap');
			var $accordionButton = $accordionWrap.find('.headline');

			$accordionButton.eq(i).click(function() {
				$accordionWrap.eq(i).toggleClass('active');
			})
		});
	}

	$(document).ready(function() {
		$('.order-accordian-wrap').orderAccordion();
	});
})(jQuery);
