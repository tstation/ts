/*
 * Tstation Mobile / v1.0.0
 * Wavers
*/

// JQuery Check
if (typeof window.jQuery === 'undefined') {
    throw new Error('Tstation requires JQuery');
}

// Set Tstation
$.Tstation = {};

/* --------------------
 * - Options -
 * --------------------
 * Set Default Options
 */
$.Tstation.options = {

}

/* ------------------
 * - Implementation -
 * ------------------
 * The next block of code implements
 * functions and plugins as specified by the options above.
 */
$(function () {
    'use strict';

    // set up the object
    init();
    $.Tstation.polyfill.mutationObserver();
    $.Tstation.polyfill.promise();
    $.Tstation.popup().init();
});
/* ---------------------------------
 * - Initialize Object -
 * ---------------------------------
 * All functions are implemented below.
 */
function init () {
    'use strict';
    /**
     * Polyfill - MutationObserver
     * @returns void
     */
    $.Tstation.polyfill = {
        mutationObserver: function () {
            var MutationObserver;

            if (window.MutationObserver != null) {
                return;
            }

            MutationObserver = (function() {
                function MutationObserver(callBack) {
                    this.callBack = callBack;
                }

                MutationObserver.prototype.observe = function(element, options) {
                    this.element = element;
                    return this.interval = setInterval((function(_this) {
                        return function() {
                            var html;
                            html = _this.element.innerHTML;
                            if (html !== _this.oldHtml) {
                                _this.oldHtml = html;
                                return _this.callBack.apply(null);
                            }
                        };
                    })(this), 200);
                };

                MutationObserver.prototype.disconnect = function() {
                    return window.clearInterval(this.interval);
                };

                return MutationObserver;

            })();

            window.MutationObserver = MutationObserver;
        },
        promise: function () {
            var myClass = function () {
                this.busy = false;
                this.queue = [];

                this.then = function (fn) {
                    this.queue.push(fn);
                    this.exec();
                    return this;
                }

                // 함수 실행 자 (큐가 남아 있으면 실행합니다.)
                this.exec = function (data) {
                    if (this.busy) return this; // 바쁘니까 다음에
                    var Q = this.queue.shift();
                    var self = this;

                    if (Q) {
                        this.busy = true;

                        // try (Q) {
                        try {
                            // 큐에 함수를 실행 인자는 ok, err, data
                            Q(
                              function (a) {
                                  self.busy = false;
                                  self.exec(a)
                              },
                              function (e) {
                                  self._catch(e);
                              },
                              data
                            );
                        }
                        catch (e) {
                            this._catch(e);
                        }
                    } else {
                        this.busy = false;
                    }
                };

                // 에러가 발생되면 호출
                this.catch = function (fn) {
                    this._catch = fn;
                };
            };

            // 클래스 인스턴스를 반환
            return new myClass();

            // 사용 예시
            // ax.promise()
            //   .then(function (ok, fail, data) {
            //       $.ajax({
            //           url: "/api/v1/connections",
            //           callback: function (res) {
            //               ok(res); // data 로 전달
            //           },
            //           onError: function (res) {
            //               fail(res);
            //           }
            //       });
            //   })
            //   .then(function (ok, fail, data) {
            //       $.ajax({
            //           url: "/api/v1/login",
            //           data: data,
            //           callback: function (res) {
            //               ok(res);
            //           },
            //           onError: function (res) {
            //               fail(res);
            //           }
            //       });
            //   })
            //   .then(function (ok, fail, data) {
            //       console.log("success");
            //   })
            //   .catch(function (res) {
            //       alert(res.message);
            //   });
        }
    }

    /**
     * Detect Mobile Device
     * @returns void
     */
    $.Tstation.detectMobileDevice = {
        android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        ios: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (this.android() || this.ios() || this.opera() || this.windows())
        }
    }

    /**
     * vh issue fix
     * @returns void
     */
    $.Tstation.vhIssueFix = function () {
        var set = function () {
            var vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px')
        };
        set();

        window.addEventListener('resize', function () {
            set();
        })
    }

    /**
     * Set Body Class Mobile Device
     * @returns void
     */
    $.Tstation.setMobileDeviceClass = function () {
        var matchCase = Object.keys($.Tstation.detectMobileDevice);
        $.each(matchCase, function (index, key) {
            if ($.Tstation.detectMobileDevice[key]()) {
                document.body.classList.add('mobile-' + key)
                return false;
            }
        })
    }

    /**
     * Validator
     * @returns void
     */
    $.Tstation.validator = {
        // 차량 번호
        carNumber: function (number) {
            var success = false
            var patterns = {
                old: /^[가-힣]{2}[\s]*[0-9]{1,2}[가-힣]{1}[\s]*[0-9]{4}$/,
                new: /^[0-9]{2,3}[\s]*[가-힣]{1}[\s]*[0-9]{4}$/
            }

            $.each(Object.keys(patterns), function (index, item) {
                if (item.test(number)) {
                    success = true
                }
            })

            return success
        },
        // 휴대전화번호
        cellPhoneNumber: function (number) {
            var pattern = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
            return pattern.test(number)
        },
        // 일반전화번호
        phoneNumber: function (number) {
            var pattern = /^([0-9]{2,3})-?([0-9]{3,4})-?([0-9]{4})$/
            return pattern.test(number)
        },
        // 빈값
        emptySpace: function (string) {
            var pattern = /\s/g
            return pattern.test(string)
        },
        // 날짜 - 2020-03-11
        dateType: function (date) {
            var pattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/
            return pattern.test(date)
        },
        // 월 - 2020-03
        monthType: function (date) {
            var pattern = /^(19|20)\d{2}-(0[1-9]|1[012])$/
            return !pattern.test(date)
        },
        // 특수문자
        specialCharacters: function (characters) {
            var pattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/g
            return pattern.test(characters)
        },
        // 이메일
        email: function (email) {
            var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(email)
        },
        // 한글
        kor: function (string) {
            var pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
            return pattern.test(string)
        }
    }

    /**
     * Tstation Family Site selector
     * @returns void
     */
    $.Tstation.familySiteSelector = function () {
        // bind change event to select
        $('#family-site').on('change', function () {
            var url = $(this).val();
            if (url) {
                window.location.href = url;
            }
            return false;
        });
    };

    /**
     * Form Control Tools
     * @returns void
     */
    $.Tstation.formControlTools = function () {
        var className = {
            inputBox: 'input-box',
            tools: 'tools'
        }
        var inputBoxs = document.getElementsByClassName(className.inputBox);
        var i;
        for (i = 0; i < inputBoxs.length; i++) {
            var inputBox = inputBoxs[i];
            var tools = inputBox.nextElementSibling;
            if (typeof tools !== 'undefined' && tools !== null && tools.classList.contains(className.tools)) {
                if (tools.getBoundingClientRect().width !== 0) {
                    inputBox.style.paddingRight = tools.getBoundingClientRect().width + 'px'
                }
            }
        };

        $('.' + className.inputBox).on('propertychange change keyup paste input', function () {
            var tools = $(this).closest('.input-group').find('.' + className.tools)
            var clear = tools.children('.clear')
            var val = $(this).val();

            val.length > 0 ? clear.addClass('on') : clear.removeClass('on')
        });

        $('.input-group .tools .clear').on('click', function () {
            var inputGroup = $(this).closest('.input-group');
            var input = inputGroup.find('.input-box');

            if (input.length > 0) {
                input.val('');
                $(this).removeClass('on');
            }
        });

        /*$(document).on('keyup', selector.inputBox, function () {
            var inputGroup = $(this).closest(selector.inputGroup)
            var inputGroupTools = inputGroup.find(selector.inputGroupTools)

            if (inputGroupTools.length > 0) {
                var inputGroupToolsWidth = Number(inputGroupTools.css('right').replace('px', '')) + inputGroupTools.get(0).getBoundingClientRect().width + 4

                if (typeof inputGroupTools.get(0).getBoundingClientRect() !== 'undefined' && inputGroupTools.get(0).getBoundingClientRect().width > 0) {
                    $(this).css('padding-right', inputGroupToolsWidth + 'px')
                }
            }
        });*/
    };

    /**
     * Pay Type Selector
     * @returns Object
     * Load after Dom Element created
     */
    $.Tstation.payTypeSelector = function () {
        var selector = {
            payTypeSelectTrigger: '.pay-type-select-trigger',
            payTypeCalculatorWrap: '.pay-calculator-wrap',
            payTypeBottomDrawer: '.pay-type-bottom-drawer',
            bottomDrawer: '#bottomDrawer',
            default: '.default',
            smart: '.smart',
        }
        var className = { on: 'on' }
        var customAttr = { dataPayType: 'data-pay-type' }


        var calculatorToggle = function (type) {
            var calculators = $(selector.payTypeCalculatorWrap)
            var targetCalculator = $(selector.payTypeCalculatorWrap + selector[type])

            calculators.removeClass(className.on)
            targetCalculator.addClass(className.on)
        }

        var bottomDrawerToggle = function (type) {
            var bottomDrawer = $(selector.bottomDrawer)
            var bottomDrawerInners = $(selector.payTypeBottomDrawer)
            var targetBottomDrawer = $(selector.payTypeBottomDrawer + selector[type])

            // bottomDrawer.addClass(className.on)
            bottomDrawerInners.removeClass(className.on)
            targetBottomDrawer.addClass(className.on)
        }

        $(document).on('change', selector.payTypeSelectTrigger, function (event) {
            var payType = $(this).attr(customAttr.dataPayType)

            switch (payType) {
                case 'default':
                    calculatorToggle(payType);
                    bottomDrawerToggle(payType);
                    break
                case 'smart':
                    calculatorToggle(payType);
                    bottomDrawerToggle(payType);
                    break
                default:
                    console.error('data-pay-type attr is not match', $(this), payType)
            }
        });

        return {
            init: function (payType) {
                $(selector.payTypeSelectTrigger).prop('checked', false)
                $(selector.payTypeCalculatorWrap).removeClass(className.on)

                switch (payType) {
                    case 'default':
                        $(selector.payTypeSelectTrigger + '[' + customAttr.dataPayType +'=default]').prop('checked', true)
                        $(selector.payTypeCalculatorWrap + selector.default).addClass(className.on)

                        break
                    case 'smart':
                        $(selector.payTypeSelectTrigger + '[' + customAttr.dataPayType +'=smart]').prop('checked', true)
                        $(selector.payTypeCalculatorWrap + selector.smart).addClass(className.on)

                        break
                    default:
                        throw new Error('init pay type selector params not match')
                }
            },
            initCalculator: function () {
                if ($(selector.payTypeSelectTrigger+ '[' + customAttr.dataPayType +'=smart]').is(':checked')) {
                    calculatorToggle("smart");
                    bottomDrawerToggle("smart");
                }else {
                    calculatorToggle("default");
                    bottomDrawerToggle("default");
                }
            }
        }
    }
    /**
     * Bottom Drawer
     * @returns function
     * Load after Dom Element created
     */
    $.Tstation.bottomDrawer = function () {
        var selector = {
            bottomDrawer: '#bottomDrawer'
        }
        var className = {
            on: 'on',
            fixed: 'fixed'
        }
        var open = function () {
            $('body').addClass(className.fixed);
            $(selector.bottomDrawer).addClass(className.on);
        }
        var close = function () {
            $('body').removeClass(className.fixed);
            $(selector.bottomDrawer).removeClass(className.on);
        }

        return {
            open: function () {
                open()
            },
            close: function () {
                close()
            },
            toggle: function () {
                ($(selector.bottomDrawer).hasClass(className.on)) ? close() : open()
            }
        }
    }
    /**
     * Back Button
     * @returns function
     * Load after Dom Element created
     */
    $.Tstation.historyBack = function () {
        var selector = { btnBack: '.btn-back' }
        $(selector.btnBack).on('click', function () {
            window.history.back()
        })
    }
    /**
     * Header SideBar
     * @returns void
     * Load after Dom Element created
     * Required Swiper plugins
     */
    $.Tstation.sideBar = function () {
        var sidebar_swiper = new Swiper('.sidebar-swiper', {
            init: false,
            initialSlide: 1,
            resistanceRatio: 0,
            slidesPerView: 'auto',
        });

        sidebar_swiper.init();

        sidebar_swiper.on('slideChange', function () {
            if (sidebar_swiper.activeIndex === 1) {
                closeSideBar();
            }
        });

        $(window).on('resize', function () {
            sidebar_swiper.init();
        });

        $('.btn-open-sidebar').on('click', function(){
            openSideBar();
        });

        $('.btn-close-sidebar').on('click', function(){
            closeSideBar();
        });

        sidebar_swiper.on('progress', function () {
            $('#sidebar .dim').css({'opacity': Math.abs(1 - sidebar_swiper.progress) });
        });

        sidebar_swiper.on('touchStart', function () {
            $('#sidebar .dim').addClass('no-anim');
        });

        sidebar_swiper.on('touchEnd', function () {
            $('#sidebar .dim').removeClass('no-anim');
        });

        function openSideBar(){
            $('body').addClass('fixed');
            $('#sidebar').addClass('on');
            sidebar_swiper.slideTo(0);
        }

        function closeSideBar(){
            $('body').removeClass('fixed');
            $('#sidebar').removeClass('on');
            sidebar_swiper.slideTo(1);
        }


        // 글로벌 메뉴
        $('.global-menu dl dt:not(:only-child)').on('click', function(){
            $(this).toggleClass('on');
            $('.global-menu dl dt:not(:only-child)').not(this).removeClass('on');
        });

        // DropdownMenu
        $('.global-menu .has-dropdown').on('click', function () {
            $('.global-menu').find('.dropdown-menu').removeClass('on');
            $('.global-menu').find('.has-dropdown').removeClass('on');
            $(this).addClass('on');
            $(this).next('.dropdown-menu').addClass('on');
        });

        // MembershipCard
        $('.btn-membership-card-wrapper > .btn-membership-card').on('click', function () {
            console.log($(this))
            if(!$(this).is(':disabled')) {
                $(this).closest('.btn-membership-card-wrapper').toggleClass('on');
            }
        });

        // swiper init end
        $('#sidebar').addClass('init')
    };
    /**
     * Radio Item - Check All
     * @returns void
     * Load after Dom Element created
     */
    $.Tstation.radioItemCheckAll = function () {
        var selector = {
            checkBoxGroup: '.check-box-group',
            radioItem: '.radio-item',
            checkAll: '.check-all'
        }
        var customAttr = {
            dataCheckAll: 'data-check-all',
            dataAble: 'data-able',
            dataAbleType: 'data-able-type',
            dataCheckAllRequired: 'data-check-all-required'
        }

        // Check All Toggle
        $(selector.checkAll + ' > ' + 'input:checkbox').on('change', function () {
            var address = $(this).closest(selector.checkAll).attr(customAttr.dataCheckAll)
            var target = $(selector.radioItem + ':not('+ selector.checkAll +')' + '[' + customAttr.dataCheckAll + '=' + address + ']' + '>input:checkbox')
            var checkAllChecked = $(this).is(':checked')

            $.each(target, function (i, item) {
                if (!$(item).is(':disabled')) {
                    $(item).prop('checked', checkAllChecked);
                }
            });
        });

        // Check All Tracking
        $(selector.radioItem + ' > ' + 'input:checkbox').on('change', function () {
            var address = $(this).closest(selector.radioItem).attr(customAttr.dataCheckAll)
            var target = $(selector.radioItem + ':not('+ selector.checkAll +')' + '[' + customAttr.dataCheckAll + '=' + address + ']' + '>input:checkbox')
            var allChecked = true
            var oneChecked = false
            var requiredTargetAllChecked = true

            // check all checkbox toggle
            $.each(target, function (i, item) {
                // all checked
                if (!$(item).is(':checked')) {
                    allChecked = false
                } else {
                    oneChecked = true
                }

                // required checked
                if (!$(item).is(':checked') && $(item).closest(selector.radioItem).attr(customAttr.dataCheckAllRequired) === 'true') {
                    requiredTargetAllChecked = false
                }
            });
            $(selector.checkAll + '[' + customAttr.dataCheckAll + '=' + address + ']' + '>input:checkbox').prop('checked', allChecked);


            // disable button, a toggle
            var disabledTarget = $('*' + '[' + customAttr.dataAble + '=' + address + ']')
            var ableCondition = disabledTarget.attr(customAttr.dataAbleType)
            var changer = {
                able: function () {
                    if (disabledTarget.is('button') || disabledTarget.is('input')) {
                        disabledTarget.attr('disabled', false);
                    } else {
                        disabledTarget.removeClass('disabled');
                    }
                },
                disable: function () {
                    if (disabledTarget.is('button') || disabledTarget.is('input')) {
                        disabledTarget.attr('disabled', true);
                    } else {
                        disabledTarget.addClass('disabled');
                    }
                }
            }

            switch (ableCondition) {
                case 'require-min':
                    oneChecked ? changer.able() : changer.disable()
                    break
                case 'require-all':
                    requiredTargetAllChecked ? changer.able() : changer.disable()
                    break
                default:
                    break
            }
        });
    }

    /**
     * Tire Card Payment Type Selector
     * @returns void
     * Load after Dom Element created
     * Required Swiper plugins
     */
    $.Tstation.tireCardPaymentTypeSelector = function () {
        var selector = {
            cardTire: '.card-tire',
            paymentTypeSelector: '.payment-type-selector',
            selector: '.selector',
            detail: '.detail',
            radioItem: '.radio-item'
        }
        var className = { on: 'on' }
        var customAttr = { dataPayType: 'data-pay-type' }
        var radio = $(selector.paymentTypeSelector + ' > ' + selector.selector + ' ' + selector.radioItem + ' ' + 'input[type=radio]');

        var toggleDetails = function (el) {
            var _this = el
            var paymentTypeSelector = _this.closest(selector.paymentTypeSelector)
            var detail = $(paymentTypeSelector).find(selector.detail)
            var targetType = _this.attr(customAttr.dataPayType)

            // 스마트페이 라디오가 선택되어 있을 경우 스마트페이가 디폴트인 페이지로 상품상세 페이지 주소 변경

            var normalHref = $(el).closest('.payment-type-selector').parent().find('dt a').attr('href');
            var smrtPayHrefStr = "&SmrtPayYn=true";

            if ($(el).attr('data-pay-type') == "default"){
                $(el).closest('.payment-type-selector').parent().find('dt a').attr('href',normalHref.replaceAll(smrtPayHrefStr,""));
                $(el).closest('.payment-type-selector').parent().find('dd a').attr('href',normalHref.replaceAll(smrtPayHrefStr,""));

            } else{
                $(el).closest('.payment-type-selector').parent().find('dt a').attr('href',normalHref+smrtPayHrefStr);
                $(el).closest('.payment-type-selector').parent().find('dd a').attr('href',normalHref+smrtPayHrefStr);
            }


            if (detail.length > 0) {
                $.each(detail, function (index, item) {
                    $(item).removeClass(className.on)

                    if ($(item).attr(customAttr.dataPayType) === targetType) {
                        $(item).addClass(className.on)
                    }
                })
            }
        }

        var initTireCardPaymentTypeSelector = function () {
            $.each($(selector.paymentTypeSelector), function (index, item) {
                if ($(selector.paymentTypeSelector + ' ' + selector.selector)) {
                    var type = $(item).find(selector.selector).find('input[type=radio]:checked').attr(customAttr.dataPayType)
                    var details = $(item).find(selector.detail)
                    $.each(details, function (detailIndex, detail) {
                        $(detail).attr(customAttr.dataPayType) === type ? $(detail).addClass(className.on) : $(detail).removeClass(className.on)
                    })
                }
            })
        };

        // init dom element
        initTireCardPaymentTypeSelector();

        return {
            regListener: function () {
                // reg listener radio on change
                $(document.body).on('change',selector.paymentTypeSelector + ' > ' + selector.selector + ' ' + selector.radioItem + ' ' + 'input[type=radio]', function () {
                    toggleDetails($(this))
                });
            },
            init: function () {
                initTireCardPaymentTypeSelector();
            }
        }
    };

    /**
     * Form Control Number
     * @returns void
     * Load after Dom Element created
     * Required Swiper plugins
     */
    $.Tstation.formControlNumber = function () {
        var selector = {
            formControlNumber: '.form-control-number',
            control: '.control',
            controlDecrease: '.control-decrease',
            controlIncrease: '.control-increase',
            count: '.count'
        }
        var className = {
            controlDecrease: 'control-decrease',
            controlIncrease: 'control-increase',
            disabled: 'disabled'
        }
        var updateCount = function (target, count) {
            target.text(count)
        }
        var updateControlStatus = function (parent, value, options) {
            // decrease
            if (Number(value) <= Number(options.min)) {
                parent.find(selector.controlDecrease).addClass(className.disabled)
            } else {
                parent.find(selector.controlDecrease).removeClass(className.disabled)
            }

            // increase
            if (Number(value) >= Number(options.max)) {
                parent.find(selector.controlIncrease).addClass(className.disabled)
            } else {
                parent.find(selector.controlIncrease).removeClass(className.disabled)
            }
        };

        // init
        var initTarget = $(selector.formControlNumber + ' ' + 'input[type=number]')
        $.each(initTarget, function (index, item) {
            if ($(item) && $(item).val()) {
                var formControlNumber = $(this).closest(selector.formControlNumber)
                var options = {
                    min: $(item).attr('min'),
                    max: $(item).attr('max'),
                    step: $(item).attr('step')
                }
                // set disabled class
                if ($(item).attr('disabled')) {
                    $(item).closest(selector.formControlNumber).addClass(className.disabled);
                }

                // control init
                updateControlStatus(formControlNumber, Number($(item).val()), options)

                // count init
                updateCount($(item).closest(selector.formControlNumber).find(selector.count), $(item).val())
            }
        })


        // control click
        $(document).on('click', selector.formControlNumber + ' ' + selector.control, function () {
            var formControlNumber = $(this).closest(selector.formControlNumber)
            var input = formControlNumber.find('input[type=number]')
            var count = formControlNumber.find(selector.count)
            var value = input.val()
            var options = {
                min: input.attr('min'),
                max: input.attr('max'),
                step: input.attr('step')
            }
            var step = options.step ? options.step : 1

            // Increase Decrease input value
            if ($(this).hasClass(className.controlDecrease)) {
                if (typeof options.min !== 'undefined' && (Number(options.min) >= value)) {
                    return false;
                } else {
                    input.val(Number(value) - Number(step))
                }
            } else if ($(this).hasClass(className.controlIncrease)) {
                if (typeof options.max !== 'undefined' && (Number(options.max) <= value)) {
                    return false;
                } else {
                    input.val(Number(value) + Number(step))
                }
            }

            // update control disabled
            updateControlStatus(formControlNumber, input.val(), options);

            // update count
            updateCount(count, input.val());
        });
    };

    /**
     * Tab
     * @returns void
     * Load after Dom Element created
     */
    $.Tstation.tab = {
        constants: {
            selector: {
                tabItem: '.tab-item',
                tabContents: '.tab-contents',
                indicator: '.indicator',
                onLayer: '.on-layer'
            },
            className: { on: 'on' },
            customAttr: { tabContents: 'data-tab-contents' }
        },
        methods: {
            handleTabContentChange: function (target) {
                var constants = $.Tstation.tab.constants
                var tabContents = $(constants.selector.tabContents);
                if (tabContents.length > 0) {
                    tabContents.removeClass(constants.className.on);
                    $(constants.selector.tabContents + '[' + constants.customAttr.tabContents + '=' + target + ']').addClass(constants.className.on);
                }
            },
            handleTabItemChange: function (condition) {
                var constants = $.Tstation.tab.constants
                var parent = condition.el.closest(constants.selector.tabItem);
                var target = condition.el.data().tabEvent;
                var setIndicator = function () {
                    $(parent.find(constants.selector.indicator), parent).css({
                        width: condition.el.outerWidth(),
                        left: condition.el.position().left
                    });
                    condition.el.siblings().removeClass(constants.className.on);
                    condition.el.addClass(constants.className.on);
                }

                // create indicator
                if(parent.find(constants.selector.indicator).length === 0) {
                    parent.append('<div class="' + constants.selector.indicator.replace('.', '') +'"></div>')
                }

                // set position style
                condition.isInit ? setTimeout(function () { setIndicator(); }, 200) : setIndicator();

                // call tab contents changer
                if (typeof target !== 'undefined') {
                    $.Tstation.tab.methods.handleTabContentChange(target);
                }
            }
        },
        addEvent: function () {
            var selector = $.Tstation.tab.constants.selector
            $(document).on('click', selector.tabItem + '> a' , function (e) {
                if ($(this).closest($.Tstation.tab.constants.selector.tabItem).hasClass($.Tstation.tab.constants.selector.onLayer.replace('.', '')) || $(this).closest($.Tstation.tab.constants.selector.tabItem).hasClass('disabled')) {
                    e.preventDefault();
                }
                $.Tstation.tab.methods.handleTabItemChange({ el: $(this), isInit: false });
            });
        },
        init: function () {
            var constants = $.Tstation.tab.constants
            if ($(constants.selector.tabItem).length > 0) {
                $.each($(constants.selector.tabItem), function (index, item) {
                    var activeTab = $(item).find('a.on');
                    if (activeTab.length > 0) {
                        $.Tstation.tab.methods.handleTabItemChange({ el: activeTab, isInit: true });
                    }
                })
            }
        }
    }

    /**
     * Tabs
     * @returns void
     * Load after Dom Element created
     */
    $.Tstation.tabs = {
        constants: {
            selector: {
                tabs: '.tabs',
                tabsInner: '.tabs-inner',
                tabsItem: '.tabs-item',
                tabsContents: '.tabs-contents',
                indicator: '.indicator'
            },
            className: {
                on: 'on'
            },
            dataAttr: {
                tabs: 'tabs',
                tabsEvents: 'tabsEvents',
                tabsContents: 'data-tabs-contents'
            }
        },
        methods: {
            handleContentChange: function (target) {
                var constants = $.Tstation.tabs.constants
                var tabsContents = $(constants.selector.tabsContents);
                if (tabsContents.length > 0) {
                    tabsContents.removeClass(constants.className.on);
                    $(constants.selector.tabsContents + '[' + constants.dataAttr.tabsContents + '=' + target + ']')
                      .addClass(constants.className.on);
                }
            },
            handleTabsChange: function (condition) {
                var constants = $.Tstation.tabs.constants
                var parent = condition.el.closest(constants.selector.tabs)
                var target = condition.el.data()[constants.dataAttr.tabsEvents]
                var setIndicator = function () {
                    $(parent.find(constants.selector.indicator), parent).css({
                        width: condition.el.outerWidth(),
                        left: condition.el.position().left
                    })
                    parent.find(constants.selector.tabsItem).removeClass(constants.className.on)
                    condition.el.addClass(constants.className.on)
                }

                // create indicator
                if (parent.find(constants.selector.indicator).length === 0) {
                    parent.find(constants.selector.tabsInner)
                      .append('<div class="' + constants.selector.indicator.replace('.', '') +'"></div>')
                }

                // set style
                setIndicator();

                // change tabs contents
                $.Tstation.tabs.methods.handleContentChange(target)
            },
        },
        addEvent: function () {
            var selector = $.Tstation.tabs.constants.selector
            $(document).on('click', selector.tabs + ' ' + selector.tabsItem , function () {
                $.Tstation.tabs.methods.handleTabsChange({ el: $(this), isInit: false });
            });
        },
        init: function (el) {
            var constants = $.Tstation.tabs.constants

            if ($(constants.selector.tabs).length > 0) {
                $.each($(constants.selector.tabs), function (index, item) {
                    var activeTab = $(item).find(constants.selector.tabsItem + '.' + constants.className.on);
                    if (activeTab.length > 0) {
                        $.Tstation.tabs.methods.handleTabsChange({ el: activeTab, isInit: true });
                    }
                })
            }
        }
    }

    /**
     * Switcher
     * @returns void
     */
    $.Tstation.switcher = function () {
        var constants = {
            selector: {
                switcher: '.switcher',
                switcherContent: '.switcher-content'
            },
            class: {
                on: 'on'
            },
            data: {
                switcherTarget: 'switcherTarget',
                switcherContent: 'switcherContent',
                switcherGroup: 'switcherGroup'
            }
        };

        var switcherToggle = function (target, targetGroup) {
            $.each(targetGroup, function (index, item) {
                $(item).removeClass(constants.class.on)
            })
            $(target).addClass(constants.class.on)
        }

        $(constants.selector.switcher).on('click', function () {
            var data = $(this).data()
            var switchers = $(constants.selector.switcher).filter(function (index, item) {
                return $(item).data()[constants.data.switcherGroup] === data[constants.data.switcherGroup]
            });
            var switcherContents = $(constants.selector.switcherContent).filter(function (index, item) {
                return $(item).data()[constants.data.switcherGroup] === data[constants.data.switcherGroup]
            });
            var target = switcherContents.filter(function (index, item) {
                return $(item).data()[constants.data.switcherTarget] === data[constants.data.switcherTarget]
            });

            switcherToggle(target, switcherContents);
            switcherToggle(this, switchers);
        });
    }

    /**
     * ScrollLock
     * @returns void
     */
    $.Tstation.scrollLock = {
        constants: {
            className: {
                scrollLock: 'scroll-lock'
            }
        },
        lock: function () {
            $('body').addClass($.Tstation.scrollLock.constants.className.scrollLock)
        },
        unLock: function () {
            $('body').removeClass($.Tstation.scrollLock.constants.className.scrollLock)
        }
    }

    /**
     * Popup
     * @returns void
     */
    $.Tstation.popup = function () {
        var selector = {
            modalItem: '.modal-item',
            dim: '.dim',
            modalPanel: '.modal-panel',
            modalHeader: '.modal-header',
            btnPopupClose: '.btn-popup-close',
            modalAction: '.modal-action',
            modalBody: '.modal-body',
            modalScroller: '.modal-scroller',
            container: '.container',
            instance: '.instance'
        }
        var className = {
            on: 'on',
            full: 'full',
            pdH: 'pd-h-',
            pdV: 'pd-v-',
            pdT: 'pd-t-',
            pdB: 'pd-b-',
            pdL: 'pd-l-',
            pdR: 'pd-r-',
            white: 'white',
            btnOl: 'btn-ol',
            noBoundary: 'no-boundary'
        }
        var customAttr = { ref: 'ref' }
        var template = function (condition, contents) {
            var ref = ' data-' + customAttr.ref + '="' + condition.ref +'"'
            var full = condition.full ? 'full' : ''
            var dimWhite = condition.dimWhite ? 'dim white' : 'dim'
            var modalHeader = function (title) {
                var header = '<div class="modal-header">\n' +
                  '             <h3>' + title + '</h3>\n' +
                  '             <button type="button" class="btn-item btn-neutral round btn-inv min-w btn-popup-close">\n' +
                  '                 <span class="line-icons close size-24"></span>\n' +
                  '             </button>\n' +
                  '           </div>\n'

                return title ? header : ''
            }
            var modalAction = function (modalAction) {
                if (typeof modalAction === 'undefined') { return '' }

                var noBoundary = modalAction.isNoBoundary ? className.noBoundary : ''
                var button = function () {
                    var buttonTemplate = function (button) {
                        var buttonNegative = button.negative ? className.btnOl : ''
                        return '<li>\n' +
                          '             <button type="button" class="btn-item btn-neutral ' + buttonNegative + ' round full-w" onclick="' + button.action + '">\n' +
                          '                 <span class="label-txt">' + button.label + '</span>\n' +
                          '             </button>\n' +
                          '           </li>'
                    }
                    var pushHtml = ''

                    $.each(modalAction.buttons, function (index, item) {
                        pushHtml = pushHtml.concat(buttonTemplate(item))
                    })

                    return pushHtml
                }
                var actionTemplate = '<div class="modal-action ' + noBoundary + '">\n' +
                  '                        <ul class="list-size-equal">\n' +
                  button() +
                  '                        </ul>\n' +
                  '                    </div>\n'

                return (typeof modalAction.buttons !== 'undefined' && modalAction.buttons.length > 0) ? actionTemplate : '\n'
            }
            var modalContentsPd = function (padding) {
                var pdChecker = function (key, value) {
                    switch (key) {
                        case 'horizon':
                            return className.pdH + value + 'u';
                        case 'vertical':
                            return className.pdV + value + 'u';
                        case 'top':
                            return className.pdT + value + 'u';
                        case 'right':
                            return className.pdR + value + 'u';
                        case 'bottom':
                            return className.pdB + value + 'u';
                        case 'left':
                            return className.pdL + value + 'u';
                        default:
                            return ''
                    }
                };

                var pdClass = ''
                $.each(padding, function (key, value) {
                    if (value > 0) {
                        pdClass = pdClass.concat(' ' + pdChecker(key, value))
                    }
                });

                return pdClass;
            }

            return '<div class="modal-item instance ' + full + '"' + ref + '>\n' +
              '            <div class="' + dimWhite +'"></div>\n' +
              '            <div class="middler">\n' +
              '                <div class="modal-pannel">\n' +
              modalHeader(condition.title) +
              modalAction(condition.modalAction) +
              '                    <div class="modal-body">\n' +
              '                        <div class="modal-scroller">\n' +
              '                            <div class="container ' + modalContentsPd(condition.modalContentsPd) + '">\n' +
              contents +
              '                            </div>\n' +
              '                        </div>\n' +
              '                    </div>\n' +
              '                </div>\n' +
              '            </div>\n' +
              '        </div>'
        }

        return {
            init: function () {
                $(document).on('click', selector.modalItem, function (e) {
                    var modalItem = $(e.target).closest(selector.modalItem)
                    // if ($(e.target).closest(selector.instance).length === 0) return
                    if ($(e.target).closest(selector.dim).length > 0 || $(e.target).closest(selector.btnPopupClose).length > 0) {
                        modalItem.removeClass(className.on)
                        setTimeout(function () {
                            modalItem.remove()
                        }, 200)
                    }
                })
            },
            open: function (condition) {
                var testCondition = {
                    ref: 'modal-ref-1', // 모달 아이디
                    title: '모달 팝업 타이틀', // 모달 타이틀
                    requestUrl: '', // 모달 컨텐츠 정보 GET: html
                    contents: '<p class=\'pd-v-5u txt-center\'>비동기식 Html 요청하지 않고 html string 추가</p>',
                    dimWhite: false, // dim 배경이 화이트인가
                    modalContentsPd: {
                        horizon: 8,
                        vertical: 8,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    full: false, // full size modal
                    modalAction: {
                        isNoBoundary: true, // 팝업 버텀 액선 바 스타일
                        buttons: [
                            {
                                label: '취소', // 버튼 라벨
                                negative: true, // 버튼 중요도 - true 낮음, false 높음
                                action: '$.Tstation.popup().close(\'modal-ref-1\')' // 해당 버튼을 클릭했을때 실행하고픈 사전에 바인딩 메서드 호출
                            },
                            {
                                label: '확인',
                                negative: false,
                                action: 'alert(\'등록한 액션을 스트링으로 추가하세요.\')' // 해당 버튼을 클릭했을때 실행하고픈 사전에 바인딩된 메서드 호출
                            }
                        ]
                    }
                }
                var createPopup = function (params, contents) {
                    var popupString = template(params, contents)
                    var popupHtml = $.parseHTML(popupString, document, true)
                    var onOpen = function () {
                        // scroll lock
                        $.Tstation.scrollLock.lock();
                        // on open fire
                        if (typeof params.onOpen !== 'undefined' && typeof params.onOpen === 'function') {
                            params.onOpen();
                        }
                    };
                    var onClose =function () {
                        // 1. set target
                        var target = popupHtml[0];
                        // 2. set instance observer
                        var observer = new MutationObserver(function(mutations) {
                            if (!mutations[0].target.classList.contains('on')) {
                                // scroll unlock
                                if ($(selector.modalItem + '.' + className.on).length === 0) {
                                    $.Tstation.scrollLock.unLock();
                                }
                                // on close fire
                                if (typeof params.onClose !== 'undefined' && typeof params.onClose === 'function') {
                                    params.onClose();
                                }
                            }
                        });
                        // 3. set options
                        var config = { attributes: true, childList: true, characterData: true };
                        // 4. bind
                        observer.observe(target, config);
                    }

                    // modal action check
                    if (typeof params.modalAction !== 'undefined' && typeof params.modalAction.buttons !== 'undefined' && params.modalAction.buttons.length > 0) {
                        var replacer =  function (el) {
                            $(popupHtml).find(selector.modalAction + '>' + 'ul').append(el)
                        }
                        var createButtons = function (button) {
                            var buttonNegative = button.negative ? className.btnOl : ''
                            var elLi = document.createElement('li')
                            var elButton = document.createElement('button')
                            var elSpanTxt = document.createTextNode(button.label)
                            var elSpan = document.createElement('span')

                            // set span
                            elSpan.classList.add('label-txt')
                            elSpan.appendChild(elSpanTxt)

                            // set button
                            elButton.classList.add('btn-item', 'btn-neutral', 'round', 'full-w')
                            if (buttonNegative) {
                                elButton.classList.add(buttonNegative)
                            }

                            if (typeof button.action !== 'undefined' && typeof button.action === 'string') {
                                elButton.onclick = function () {
                                    eval(button.action)
                                }
                            } else if (typeof button.action !== 'undefined' && typeof button.action === 'function') {
                                elButton.onclick = function () {
                                    button.action();
                                    return false;
                                }
                            }

                            // append
                            elButton.appendChild(elSpan)
                            elLi.appendChild(elButton)

                            return elLi
                        }

                        $(popupHtml).find(selector.modalAction + '>' + 'ul').empty();
                        $.each(params.modalAction.buttons, function (index, item) {
                            replacer(createButtons(item));
                        })
                    }
                    $(document.body).append(popupHtml);
                    setTimeout(function () {
                        $(selector.modalItem + '[data-' + customAttr.ref + '="' + params.ref + '"]').addClass(className.on);
                        onOpen();
                        onClose();
                    }, 10);

                    // tab init
                    $.Tstation.tab.init();
                }

                if (typeof condition.requestUrl !== 'undefined' && condition.requestUrl.length > 0) {
                    $.ajax({
                        url: condition.requestUrl,
                        dataType: 'html',
                        success: function (data) {
                            createPopup(condition, data)
                        },
                        fail: function (e) {
                            throw new Error('Call Async Popup Request Error')
                        }
                    });
                } else {
                    createPopup(condition, condition.contents)
                }
            },
            close: function (ref) {
                var target = ref ? $(selector.modalItem + '[data-' + customAttr.ref + '="' + ref + '"]') : $(selector.modalItem)
                target.removeClass(className.on);
                setTimeout(function () {
                    target.remove();
                }, 200)
            },
            toggleByClass: function (target) {
                if ($(target).length === 0) return

                // 1. open target
                $.Tstation.scrollLock.lock();
                if (!$(target).hasClass(className.on)) {
                    $(target).addClass(className.on);
                }

                // 2. scroll lock trigger
                // 2-1. set target
                var nodeTarget;
                if (target.indexOf('#') !== -1) {
                    nodeTarget = document.getElementById(target.replace('#', ''));
                } else if (target.indexOf('.') !== -1) {
                    nodeTarget = document.getElementsByClassName(target.replace('.', ''));
                }

                // 2-2. set instance observer
                var observer = new MutationObserver(function(mutations) {
                    if (!mutations[0].target.classList.contains(className.on)) {
                        // scroll unlock
                        if ($(selector.modalItem + '.' + className.on).length === 0) {
                            $.Tstation.scrollLock.unLock();
                        }
                        this.disconnect();
                    }
                });
                // 2-3. set options
                var config = { attributes: true, childList: true, characterData: true };
                // 2-4. bind
                observer.observe(nodeTarget, config);

                // set listener
                $(target).on('click', function (e) {
                    if ($(e.target).closest(selector.dim).length > 0 || $(e.target).closest(selector.btnPopupClose).length > 0) {
                        $(e.target).closest(selector.modalItem).removeClass(className.on);
                    }
                });
            }
        }
    };

    /**
     * Loading
     * @returns void
     */
    $.Tstation.loading = {
        constants: {
            selector: {
                loading: '#loading-indicator',
                modalItem: '.modal-item',
            },
            className: { on: 'on' },
            template: '<div id="loading-indicator">\n' +
              '<div class="dim"></div>\n' +
              '    <div class="loader">\n' +
              '        <span class="loader-image"></span>\n' +
              '        <p class="loader-description">잠시만 기다려 주세요.</p>\n' +
              '    </div>\n' +
              '</div>'
        },
        start: function () {
            var self = this
            $.Tstation.scrollLock.lock();
            if (!document.querySelector(self.constants.selector.loading)) {
                $(document.body).append(this.constants.template);
            }
            setTimeout(function () {
                $(self.constants.selector.loading).addClass('on');
            }, 10);
        },
        end: function () {
            var self = this
            if ($(this.constants.selector.modalItem + '.' + this.constants.className.on).length === 0) {
                $.Tstation.scrollLock.unLock();
            }
            $(this.constants.selector.loading).removeClass('on');
            setTimeout(function () {
                document.querySelector(self.constants.selector.loading).remove();
            }, 300);
        }
    }

    /**
     * Action Sheet
     * @returns void
     */
    $.Tstation.actionSheet = {
        constants: {
            selector: {
                actionSheet: '.action-sheet',
                dim: '.dim',
                actions: '.actions'
            },
            className: {
                on: 'on',
                btnOl: 'btn-ol'
            },
            customAttr: { ref: 'ref' }
        },
        init: function () {
            var constants = $.Tstation.actionSheet.constants
            $(document).on('click', constants.selector.actionSheet, function (e) {
                var actionSheet = $(e.target).closest(constants.selector.actionSheet)

                if ($(e.target).closest(constants.selector.dim).length > 0) {
                    actionSheet.removeClass(constants.className.on)
                    setTimeout(function () {
                        actionSheet.remove()
                    }, 200)
                }
            })
        },
        open: function (options) {
            var sampleOptions = {
                ref: 'action-sheet-1', // 액션 시트 아이디
                actions: [
                    {
                        icon: 'call', // 아이콘
                        label: '031-781-3345', // 버튼 라벨
                        negative: false, // 버튼 중요도 - true 낮음, false 높음
                        action: function () {
                            window.location.href = 'tel:031-781-3345'
                        }
                    },
                    {
                        icon: '', // 아이콘
                        label: '취소', // 버튼 라벨
                        negative: true, // 버튼 중요도 - true 낮음, false 높음
                        action: function () {
                            $.Tstation.actionSheet.close('action-sheet-1');
                        }
                    }
                ]
            }

            var constants = $.Tstation.actionSheet.constants
            var actionSheet = document.createElement('div')
            var dim = document.createElement('div')
            var actions = document.createElement('div')
            var createAction = function (button) {
                var action = document.createElement('button')
                var labelText = document.createTextNode(button.label)
                var label = document.createElement('span')

                // set button
                if (button.negative) {
                    action.classList.add('btn-item', 'btn-primary', 'btn-ol', 'round', 'full-w')
                } else {
                    action.classList.add('btn-item', 'btn-neutral', 'btn-ol', 'round', 'full-w')
                }
                if (typeof button.action !== 'undefined' && typeof button.action === 'string') {
                    action.onclick = function () {
                        eval(button.action)
                    }
                } else if (typeof button.action !== 'undefined' && typeof button.action === 'function') {
                    action.onclick = function () {
                        button.action();
                        return false;
                    }
                }

                // set icon
                if (button.icon) {
                    var icon = document.createElement('span')
                    icon.classList.add('line-icons', 'size-20', button.icon)
                    action.appendChild(icon)
                }

                // set label
                label.classList.add('label-txt')
                label.appendChild(labelText)
                action.appendChild(label)

                return action
            }

            actionSheet.classList.add(constants.selector.actionSheet.replace('.', ''))
            actionSheet.setAttribute('data-' + constants.customAttr.ref, options.ref);
            dim.classList.add(constants.selector.dim.replace('.', ''))
            actions.classList.add(constants.selector.actions.replace('.', ''))
            $.each(options.actions, function (index, item) {
                actions.appendChild(createAction(item))
            });

            actionSheet.appendChild(dim)
            actionSheet.appendChild(actions)
            $(document.body).append(actionSheet);

            setTimeout(function () {
                $(constants.selector.actionSheet + '[data-' + constants.customAttr.ref + '="' + options.ref + '"]').addClass(constants.className.on);
            }, 10)
        },
        close: function (ref) {
            var constants = $.Tstation.actionSheet.constants
            var target = ref ? $(constants.selector.actionSheet + '[data-' + constants.customAttr.ref + '="' + ref + '"]') : $(constants.selector.actionSheet)
            target.removeClass(constants.className.on);
            setTimeout(function () {
                target.remove();
            }, 200)
        }
    }

    /**
     * accordion
     * @returns void
     */
    $.Tstation.accordion = function () {
        var selector = {
            accordion: '.accordion',
        }
        var className = { on: 'on' }

        $(document).on('click', selector.accordion + ' > ul > li > a', function (e) {
            var _this = $(e.target).closest('a')
            var accordion = _this.closest(selector.accordion)
            var li = _this.closest('li')

            if (accordion.hasClass('accordion-list')) {
                if (li.hasClass(className.on)) {
                    li.removeClass(className.on)
                } else {
                    $.each(accordion.find('li'), function (index, item) {
                        if ($(item).hasClass(className.on)) {
                            $(item).removeClass(className.on)
                            return;
                        }
                    })

                    li.addClass(className.on)
                }
            } else {
                accordion.toggleClass(className.on)
            }
        })
    };

    /**
     * Guide Floating Button
     * @returns void
     */
    $.Tstation.guideItem = function () {
        var selector = {
            guideItem: '.guide-item',
            btnGuideItemOn: '.btn-guide-item-on',
            btnGuideItemOff: '.btn-guide-item-off',
            dim: '.dim'
        }
        var className = { on: 'on' }

        // on
        $(document).on('click', selector.guideItem + ' ' + selector.btnGuideItemOn, function () {
            $(selector.guideItem).addClass(className.on)
        });

        // off - btn
        $(document).on('click', selector.guideItem + ' ' + selector.btnGuideItemOff, function () {
            $(selector.guideItem).removeClass(className.on)
        });

        // off - dim
        $(document).on('click', selector.guideItem + ' ' + selector.dim, function () {
            $(selector.guideItem).removeClass(className.on)
        });
    }

    /**
     * My Car Selector
     * @returns void
     */
    $.Tstation.myCarSelector = {
        constants: {
            selector: {
                myCarChanger: '.my-car-changer',
                myCarSelector: '.my-car-selector',
                handle: '.handle',
                myCarSelectorItem: '.my-car-selector-item'
            },
            className: {
                on: 'on',
                moving: 'moving'
            }
        },
        toggle: function (handle, swiper) {
            if (!handle.hasClass($.Tstation.myCarSelector.constants.className.on)) {
                setTimeout(function () {
                    swiper.update()
                }, 200)
            }
            handle.closest($.Tstation.myCarSelector.constants.selector.myCarSelector).toggleClass($.Tstation.myCarSelector.constants.className.on)
        },
        changeMyCar: function (car) {
            car.closest($.Tstation.myCarSelector.constants.selector.myCarSelector).find($.Tstation.myCarSelector.constants.selector.myCarSelectorItem).removeClass($.Tstation.myCarSelector.constants.className.on)
            car.addClass($.Tstation.myCarSelector.constants.className.on)
        },
        changeCarInMain : function(car) {
            $.Tstation.loading.start();
               var carInfo = JSON.parse($(car).val());
               var pin = {}
                       $.ajax({
                       url: _baseUrl+'/searchCar/carnum/selectCar',
                       data: $(car).val(),
                       contentType: 'application/json',
                       method: 'POST',
                       success:function () {
                               var tireUrl = _baseUrl + "main/tire-rank";
                               common.Ajax.sendTypeRequest("GET", tireUrl, pin, undefined, function(data) {
                                       $('#mbrCarRelatedTireRank').empty();
                                       $('#mbrCarRelatedTireRank').append(data);
                                       $('#mbrCar').text(carInfo.carMfcpNm+" "+ carInfo.carMdl);
                               });
                               var dealUrl = _baseUrl + "main/deal";
                               common.Ajax.sendTypeRequest("GET", dealUrl, pin, undefined, function(data) {
                                      if(data != ""){
                                              $('#mbrCarRelatedDeal').empty();
                                              $('#dealSection').css('display','block');
                                              $('#mbrCarRelatedDeal').append(data);
                                      }
                              });
                              var reviewUrl = _baseUrl + "main/review";
                              common.Ajax.sendTypeRequest("GET", reviewUrl, pin, undefined, function(data) {
                                      $('#bestReview').empty();
                                      $('#bestReview').append(data);
                               });
                              var smartCareUrl = _baseUrl + "main/smart-care/list?mbrCarRegSeq="+carInfo.mbrCarRegSeq;
                              common.Ajax.sendTypeRequest("GET", smartCareUrl, pin, undefined, function(data) {
                                             $('.reminding-list').empty()
                                             $('.reminding-list').append(data)
                                             car.closest($.Tstation.myCarSelector.constants.selector.myCarSelector).find($.Tstation.myCarSelector.constants.selector.myCarSelectorItem).removeClass($.Tstation.myCarSelector.constants.className.on)
                                         car.addClass($.Tstation.myCarSelector.constants.className.on)
                                         $('#mainCar').attr('src',carInfo.moImgPathNm);
                                             $('.my-car-selected').find('.model').text(carInfo.carMfcpNm+" "+ carInfo.carMdl);
                                         $('.my-car-selected').find('.car-number').text(carInfo.carNo);
                                  $.Tstation.loading.end();
                               });
                      }
                });
        }
    }
    // $.Tstation.myCarSelector = function () {
    //     var selector = {
    //         myCarChanger: '.my-car-changer',
    //         myCarSelector: '.my-car-selector',
    //         handle: '.handle',
    //         myCarSelectorItem: '.my-car-selector-item'
    //     }
    //     var className = {
    //         on: 'on',
    //         moving: 'moving'
    //     }
    //
    //     return {
    //         toggle: function (handle, swiper) {
    //             if (!handle.hasClass(className.on)) {
    //                 setTimeout(function () {
    //                     swiper.update()
    //                 }, 200)
    //             }
    //             handle.closest(selector.myCarSelector).toggleClass(className.on)
    //         },
    //         changeMyCar: function (car) {
    //             car.closest(selector.myCarSelector).find(selector.myCarSelectorItem).removeClass(className.on)
    //             car.addClass(className.on)
    //         }
    //     }
    // };

    /**
     * ToggleView
     * @returns void
     */
    $.Tstation.toggleView = function (target) {
        $(target).css('display', $(target).css('display') === 'none' ? 'block' : 'none')
    }

    /**
     * CopyToClipboard
     * @returns void
     */
    $.Tstation.copyToClipboard = function (messages) {
        var el = document.createElement('textarea')
        el.value = messages.message
        el.setAttribute('readonly', '')
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        var selected =
          document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        if (selected) {
            document.getSelection().removeAllRanges()
            document.getSelection().addRange(selected)
        }

        alert(messages.completeMessage ? messages.completeMessage : '클립보드에 복사되었습니다.')
    }

    /**
     * Image Error
     * @returns void
     */
    $.Tstation.imageError = function (condition) {
        if (typeof condition.el === 'undefined' && condition.el === null) {
            throw new Error('required element')
        }
        condition.url ? condition.el.src = condition.url : condition.el.style.display = 'none'
    }

    /**
     * callAndroidCheck
     * @returns void
     */
    $.Tstation.callAndroidCheck = function (evt, number) {
        evt.preventDefault();

        if ($.Tstation.validator.cellPhoneNumber(number) || $.Tstation.validator.phoneNumber(number)) {
            if ($.Tstation.detectMobileDevice.android()) {
                $.Tstation.actionSheet.open({
                    ref: 'action-sheet-call', // 액션 시트 아이디
                    actions: [
                        {
                            icon: 'call', // 아이콘
                            label: number, // 버튼 라벨
                            negative: false, // 버튼 중요도 - true 낮음, false 높음
                            action: function () {
                                window.location.href = 'tel:' + number
                                $.Tstation.actionSheet.close('action-sheet-call')
                            }
                        },
                        {
                            icon: '', // 아이콘
                            label: '취소', // 버튼 라벨
                            negative: true, // 버튼 중요도 - true 낮음, false 높음
                            action: function () {
                                $.Tstation.actionSheet.close('action-sheet-call');
                            }
                        }
                    ]
                })
            } else {
                window.location.href = 'tel:' + number
            }
        } else {
            throw new Error (number + ' is not a phone, cellphone number')
        }
    }


    /**
     * Get Safe Area
     * @returns Object
     * top, right, bottom, left
     */
    $.Tstation.getSafeArea = function () {
        var result, computed, div = document.createElement('div');

        div.style.padding = 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
        document.body.appendChild(div);
        computed = getComputedStyle(div);
        result = {
            top: parseInt(computed.paddingTop) || 0,
            right: parseInt(computed.paddingRight) || 0,
            bottom: parseInt(computed.paddingBottom) || 0,
            left: parseInt(computed.paddingLeft) || 0
        };
        document.body.removeChild(div);

        return result;
    }

    /**
     * Hot Key
     * @returns void
     */
    $.Tstation.hotkey = {
        constants: {
            selector: {
                hotkey: '.guide-item',
                btnGuideItemOn: '.btn-guide-item-on',
                btnGuideItemOff: '.btn-guide-item-off',
                guideMenus: '.guide-menus'
            },
            className: {},
            checkElements: [
                {
                    el: '.bottom-step-wrap',
                    delay: 200,
                    transition: 300,
                    tracking: true
                },
                {
                    el: '#bottomDrawer',
                    changeAbleEl: '.bottom-drawer-pannel',
                    tracking: true
                },
                {
                    el: '.buy-option-section',
                    // changeAbleEl: '.buy-option-wrap',
                    delay: 0,
                    transition: 300,
                    tracking: true
                },
                {
                    el: '.page-floating-button',
                    tracking: false
                },
                {
                    el: '.deal-bottom-fixed',
                    tracking: false
                }
            ],
            hotkeyBottomPd: 16,
            hotkeyBottomLimit: 16
        },
        methods: {
            createHotkey: function (btnPosition) {
                var template = '<div class="guide-item">\n' +
                  '    <button type="button" class="btn-item btn-primary btn-xl min-w round btn-guide-item-on">\n' +
                  '        <span class="line-icons cs-fab size-32"></span>\n' +
                  '    </button>\n' +
                  '\n' +
                  '    <div class="dim"></div>\n' +
                  '\n' +
                  '    <button type="button" class="btn-item btn-white btn-ol btn-xl min-w round btn-guide-item-off">\n' +
                  '        <span class="line-icons close size-30"></span>\n' +
                  '    </button>\n' +
                  '\n' +
                  '    <div class="guide-menus">\n' +
                  '        <a href="" class="btn-item btn-white btn-inv btn-free full-w">\n' +
                  '            <p class="label-txt">\n' +
                  '                <span class="txt-14 txt-w500">쉬운 타이어 쇼핑</span><br>\n' +
                  '                <span class="txt-13 txt-w300">온라인 타이어 쇼핑이 어렵나요?</span>\n' +
                  '            </p>\n' +
                  '            <span class="line-icons mouse size-36"></span>\n' +
                  '        </a>\n' +
                  '\n' +
                  '        <a href="" class="btn-item btn-white btn-inv btn-free full-w">\n' +
                  '            <p class="label-txt">\n' +
                  '                <span class="txt-14 txt-w500">한국타이어 라인업</span><br>\n' +
                  '                <span class="txt-13 txt-w300">한국타이어 상품군을 한눈에</span>\n' +
                  '            </p>\n' +
                  '            <span class="line-icons search size-36"></span>\n' +
                  '        </a>\n' +
                  '\n' +
                  '        <a href="" class="btn-item btn-white btn-inv btn-free full-w">\n' +
                  '            <p class="label-txt">\n' +
                  '                <span class="txt-14 txt-w500">1:1 전문상담</span><br>\n' +
                  '                <span class="txt-13 txt-w300">메세지나 타이어 사진으로 간편하게!</span>\n' +
                  '            </p>\n' +
                  '            <span class="line-icons headset size-36"></span>\n' +
                  '        </a>\n' +
                  '    </div>\n' +
                  '</div>'

                $(document.body).append($.parseHTML(template, document, true));
            },
            getTrackingElPosition: function (obj) {
                var calcBottomPosition = function (el) {
                    return window.innerHeight - el.getBoundingClientRect().top
                }
                return typeof obj.changeAbleEl !== 'undefined' ? calcBottomPosition(obj.changeAbleEl) : calcBottomPosition(obj.el)
            },
            setHotkeyPosition: function (position, safeArea) {
                var btnGuideItemOn = $($.Tstation.hotkey.constants.selector.btnGuideItemOn).get(0)
                var btnGuideItemOff = $($.Tstation.hotkey.constants.selector.btnGuideItemOff).get(0)
                var guideMenus = $($.Tstation.hotkey.constants.selector.guideMenus).get(0)
                var hotkeyBtns = [
                    { el: btnGuideItemOn, isGuideMenus: false },
                    { el: btnGuideItemOff, isGuideMenus: false },
                    { el: guideMenus, triggerBtn: btnGuideItemOn, isGuideMenus: true }
                ]

                $.each(hotkeyBtns, function (index, item) {
                    var pdBottom = $.Tstation.hotkey.constants.hotkeyBottomPd
                    // display none element 에 접근하여 높이 가져오기
                    var getHeight = function (el) {
                        return Number(window.getComputedStyle(el).getPropertyValue('height').replace('px', ''))
                    }

                    // 가이드 메뉴일때
                    if (item.isGuideMenus) {
                        item.el.style.bottom = pdBottom + safeArea.bottom > position
                          ? 'calc(' + (getHeight(item.triggerBtn) + pdBottom * 2) + 'px + env(safe-area-inset-bottom))'
                          : position + getHeight(item.triggerBtn) + pdBottom * 2 + 'px'
                    }
                    // 트리거 버튼일때
                    else {
                        item.el.style.bottom = pdBottom + safeArea.bottom > position
                          ? 'calc(' + pdBottom + 'px + env(safe-area-inset-bottom))'
                          : position + pdBottom + 'px'
                    }
                })
            },
            addObserver: function (obj, els, safeArea) {
                var methods = this;
                var set = function () {
                    methods.setHotkeyPosition(els.length > 1
                      ? methods.compareTopPosition(els)
                      : methods.getTrackingElPosition(obj), safeArea);
                };
                var observer = new MutationObserver(function (mutations) {
                    if (obj.delay > 0 || obj.transition > 0) {
                        setTimeout(function () {
                            set();
                        }, obj.delay + obj.transition)
                    } else {
                        set();
                    }
                });
                observer.observe(obj.el, { attributes: true, childList: true, characterData: true, subtree: true });
            },
            checkElements: function () {
                var elements = $.Tstation.hotkey.constants.checkElements;
                var existElements = []
                $.each(elements, function (index, item) {
                    if ($(item.el).length > 0) {
                        existElements.push({
                            el: $(item.el).get(0),
                            changeAbleEl: $(item.changeAbleEl).get(0),
                            delay: item.delay || 0,
                            transition: item.transition || 0,
                            tracking: item.tracking,
                        })
                    }
                });

                return existElements;
            },
            compareTopPosition: function (els) {
                var methods = this;
                var topPosition = 0
                $.each(els, function (index, item) {
                    var targetTopPosition = methods.getTrackingElPosition(item);
                    if (targetTopPosition >= topPosition) { topPosition = targetTopPosition }
                });
                return topPosition
            },
            init: function (requireObserver) {
                var methods = this;
                var checkElements = methods.checkElements();
                var safeArea = $.Tstation.getSafeArea();

                // 비교 대상 엘리먼트가 존재할때 해당 엘리먼트 보다 높게 핫키 버튼을 위치
                if (checkElements.length > 0) {
                    // 최초 포지션 적용
                    methods.setHotkeyPosition(methods.compareTopPosition(checkElements), safeArea);

                    // 최초 포지션 적용 후 엘리먼트 옵저버 등록
                    if (!requireObserver) { return; }
                    $.each(checkElements, function (index, item) {
                        if (item.tracking) {
                            methods.addObserver(item, checkElements, safeArea);
                        }
                    });
                }
            }
        },
        init: function () {
            // 핫키 엘리먼트 검사
            if ($($.Tstation.hotkey.constants.selector.hotkey).length === 0) {
                return false;
            }

            // 핫키 위치 초기화
            $.Tstation.hotkey.methods.init(true);

            // 윈도우 리사이즈 트리거
            window.onresize = function () {
                $.Tstation.hotkey.methods.init(false);
            };
        },
    }


    /**
     * Call CS
     * 1:1 문의 호출
     * 메서드 호출 시점은 window.onload 이후에만 가능(cdn 방식의 외부 라이브러리를 사용하고 있음.)
     * @returns void
     */
    $.Tstation.callCs = function () {
        if (typeof zE !== 'function') {
            $.Tstation.popup().open({
                ref: 'cs-error',
                requestUrl: '', // 비동기 방식으로 컨텐츠 영역을 받아올때
                contents: '<p class="txt-center pd-t-4u txt-16">\n' +
                  '<span class="line-icons error-circle size-48 txt-neutral3 mg-b-2u"></span><br />\n' +
                  '1:1 문의를 준비중 입니다. 잠시 후 다시 시도해 주세요.\n' +
                  '</p>', // 팝업을 바로 띄우고 싶을때
                dimWhite: false,
                modalContentsPd: { // contents 영역의 padding 값 조절 해당 숫자의 * 4px 예: top 8 > top 32px
                    horizon: 8,
                    vertical: 8,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                modalAction: {
                    isNoBoundary: false,
                    buttons: [
                        {
                            label: '확인',
                            negative: false,
                            action: function () {
                                $.Tstation.popup().close('cs-error')
                            }
                        }
                    ]
                }
            });
            return;
        }
        zE('webWidget', 'show');
        zE('webWidget', 'open');
        zE('webWidget:on', 'close',function(){
            zE('webWidget', 'hide');
        });
    }
}

/**
 * myDrivingStyle
 * required rangeslider.js
 * https://github.com/andreruffert/rangeslider.js
 * @returns void
 */
$.Tstation.myDrivingStyle = {
    init: function (element, condition) {
        var stickyBreak = []
        var slideTo = function (compareNumbers, count) {
            compareNumbers.sort(function (a, b) {
                return Math.abs(count - a) - Math.abs(count - b);
            });
            return compareNumbers[0];
        }
        var dispatchFireValue = 0

        // filtering
        $.each(condition, function (index, item) {
            if (stickyBreak.indexOf(item.position.start) === -1) {
                stickyBreak.push(item.position.start)
            }
            if (stickyBreak.indexOf(item.position.end) === -1) {
                stickyBreak.push(item.position.end)
            }
            if (index === condition.length - 1) {
                stickyBreak.push(100)
            }
        });

        $(element).rangeslider({
            // Feature detection the default is `true`.
            // Set this to `false` if you want to use
            // the polyfill also in Browsers which support
            // the native <input type="range"> element.
            polyfill: false,

            // Default CSS classes
            rangeClass: 'range-slider-component on-all',
            disabledClass: 'range-slider-component-disabled',
            horizontalClass: 'range-slider-component-horizon',
            verticalClass: 'range-slider-component-vertical',
            fillClass: 'range-slider-component-fill',
            handleClass: 'range-slider-component-handle',

            // Callback function
            onInit: function () {
                var _this = this.$range
                var creatOverlapEl = function (range, el) {
                    range.prepend(el.template);
                    $(el.target).css('left', el.position[el.isGap ? 'start' : 'end'] + '%');
                    $(el.target).css('width', el.isGap ? (el.position.end - el.position.start + '%') : '1px');
                }

                $.each(condition, function (index, item) {
                    creatOverlapEl(_this, item);
                });
            },

            // Callback function
            onSlide: function (position, value) {
                (value >= 0 && value < condition[0].position.end) ? this.$range.addClass('on-all') : this.$range.removeClass('on-all')
            },

            // Callback function
            onSlideEnd: function (position, value) {
                var _this = this.$range
                var slideToPosition = slideTo(stickyBreak, value)
                var scrollToParent = function () {
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $('.mydriving-section').offset().top
                    }, 400);
                }

                // slider animation
                _this.addClass('transition-start');
                $('#find-driving-style').val(slideToPosition).change();
                setTimeout(function () {
                    _this.removeClass('transition-start');
                }, 200);

                // fire to event listener
                if (dispatchFireValue !== slideToPosition) {
                    dispatchFireValue = slideToPosition
                    var event = new CustomEvent('myDrivingStyle', { detail: slideToPosition })
                    document.dispatchEvent(event)
                    scrollToParent();
                }
            }
        });
    },
    update: function (element, value) {
        element.val(value).change();
    }
}


/**
 * instMmStrInit
 * 스마트 페이 할부 개월 수 라디오 버튼 에 따른 가격 표시
 * @returns void
 */
$.Tstation.instMmStrInit = function () {
    var _goodsCardList = $('.unit01');
    for (var i = 0; i < _goodsCardList.length; i++) {
        $("input:radio[name='monthly-pay-"+i+"']").each(function() {
            if ($(this).is(":checked")) {
                instMmChange(this);
            }
        });
    }
}

/**
 * filteredProductListInit
 * Back 버튼을 통해 필터링된 상품 리스트 조회
 * @returns void
 */
$.Tstation.filteredProductListInit = function () {
    //정렬 순서
    var srotTextVal = $('#srotText').val();
    if (!srotTextVal) srotTextVal ="listSort06";
    var srotTextFilterStr = "&srotText="+ srotTextVal;
    var patternMode = $("#patternMode").val();
    var _goodsLrclCd = $("#goodsLrclCd").val();

    // 계절
    if(!patternMode){
        if(_goodsLrclCd =="01") {
            // 타이어
            var seasonFilterStr = "";
            var seasonVal = $('input:radio[name=test_radio]:checked').val();
            if (seasonVal !=undefined) seasonFilterStr = "&seasonNmArry=" + seasonVal;
            var carKndVal = $("input[name='carKnd_radio']:checked").val();
            var carKndFilterStr = "";
            if (carKndVal) carKndFilterStr = "&carKndNm="+carKndVal;
            // 운전스타일에 따른 타이어
            var tComSilAvgArryStr = "";
            if (drivingStyleHigh != null) tComSilAvgArryStr = "&tComSilAvgArry=" + drivingStyleRow + "," + drivingStyleHigh;
            mgoods.product.getProductList(["premium","standard","economy"],srotTextFilterStr + seasonFilterStr + carKndFilterStr + tComSilAvgArryStr);
        }else if(_goodsLrclCd =="02") {
            // 경정비
            var srotTextVal = $('#srotText').val();
            var srotTextFilterStr = "";
            if(srotTextVal) srotTextFilterStr = "&srotText="+ srotTextVal;
            var url = new URL(location.href);
            var goodsMdclCdArry = url.searchParams.get("goodsMdclCd").split(":");
            mgoods.product.getProductList(goodsMdclCdArry, srotTextFilterStr);
        }
    }else {
        if(_goodsLrclCd =="01") {
            var seasonFilterStr = "";
            var seasonVal = $('input:radio[name=test_radio]:checked').val();
            if (seasonVal !=undefined) seasonFilterStr = "&seasonNmArry=" + seasonVal;
            var carKndVal = $("input[name='carKnd_radio']:checked").val();
            var carKndFilterStr = "";
            if (carKndVal) carKndFilterStr = "&carKndNm="+carKndVal;
            var url = new URL(location.href);
            var carKndNmVal = url.searchParams.get("carKndNm");
            if(carKndNmVal != null ) {
                $('input[name="carKnd_radio"]').each(function(){
                    if($(this).val()==carKndNmVal){
                        $(this).prop("checked",true);
                        $(this).attr("disabled",true);
                        carKndFilterStr = "";
                    }else $(this).attr("disabled",true)
                })
            }
            // 운전스타일에 따른 타이어
            var tComSilAvgArryStr = "";
            if (drivingStyleHigh != null) tComSilAvgArryStr = "&tComSilAvgArry=" + drivingStyleRow + "," + drivingStyleHigh;
            mgoods.patternList.getPatternList(["premium","standard","economy"],srotTextFilterStr+ seasonFilterStr+ tComSilAvgArryStr);
        } else {
        	var patternGroupList = [];
            var srotTextVal = $('#srotText').val();
            var srotTextFilterStr = "";
            if(srotTextVal) srotTextFilterStr = "&srotText="+ srotTextVal;
            if (location.href.includes('enegine-oil')) patternGroupList.push("06");
            if (location.href.includes('battery')) patternGroupList.push("02");
            if (location.href.includes('filter')) patternGroupList.push("04");
            if (location.href.includes('wiper')) patternGroupList.push("05");
            mgoods.patternList.getPatternList(patternGroupList,srotTextFilterStr);
        }
    }
}

/* ----------------
 * - Load -
 * ----------------
 *
 */
// Ready - Before Mounted, Dom element is created
$(document).ready(function () {
    console.log('document ready done');
    $.Tstation.sideBar();
    $.Tstation.payTypeSelector();
    $.Tstation.payTypeSelector().initCalculator();
    $.Tstation.tireCardPaymentTypeSelector().regListener();
    $.Tstation.formControlNumber();
    $.Tstation.tab.addEvent();
    $.Tstation.tab.init();
    $.Tstation.tabs.addEvent();
    $.Tstation.tabs.init();
    $.Tstation.switcher();
    $.Tstation.popup();
    $.Tstation.actionSheet.init();
    $.Tstation.accordion();
    $.Tstation.guideItem();
    $.Tstation.myCarSelector;
    $.Tstation.setMobileDeviceClass();
    $.Tstation.vhIssueFix();
    $.Tstation.hotkey.init();

});

// Load - Mounted, Dom element is created & load resource is done
window.onload = function () {
    console.log('window on load done');
    $.Tstation.tireCardPaymentTypeSelector().init();
    $.Tstation.formControlTools();
    $.Tstation.familySiteSelector();
    $.Tstation.historyBack();
    $.Tstation.radioItemCheckAll();
    $.Tstation.instMmStrInit();
    $.Tstation.filteredProductListInit();



};
