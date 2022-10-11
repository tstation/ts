var console = window.console || {
    log : function() {
    },
    info : function() {
    },
    warn : function() {
    },
    error : function() {
    }
};

$.namespace = function() {
    var a = arguments, o = null, i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = a[i].split(".");
        o = window;
        for (j = 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
}

$.namespace("common");
common = {

};

/*--------------------------------------------------------------------------------*\
* String Object Prototype
\*--------------------------------------------------------------------------------*/
String.prototype.isEmpty = function() {
    return (this == null || this == '' || this == 'undefined' || this == 'null');
};
// alert("isEmpty="+"".isEmpty());


/**
 *
 * 숫자여부 체크 함.
 * 사용 예)
 *
 * "100".isNumber()
 * "-100,000".isNumber(1)
 *
 * @param opt
 *            1 : (Default)모든 10진수
 *            2 : 부호 없음
 *            3 : 부호/자릿수구분(",") 없음
 *            4 : 부호/자릿수구분(",")/소숫점
 *
 * @return true(정상) or false(오류-숫자아님)
 *
 */
String.prototype.isNumber = function(opt) {
    // 좌우 trim(공백제거)을 해준다.
    value = String(this).replace(/^\s+|\s+$/g, "");

    if (typeof opt == "undefined" || opt == "1") {
        // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
        var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "2") {
        // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
        var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "3") {
        // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
        var regex = /^[0-9]+(\.[0-9]+)?$/g;
    } else {
        // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
        var regex = /^[0-9]$/g;
    }

    if (regex.test(value)) {
        value = value.replace(/,/g, "");
        return isNaN(value) ? false : true;
    } else {
        return false;
    }
};
//alert("isNumber="+("1-00".isNumber()));


String.prototype.nvl = function(s) {
    return this.isEmpty() ? (s ? s : '') : this+'';
};
String.prototype.startWith = function(str) {
    if (this === str)    return true;

    if (str.length > 0)
        return str === this.substr(0, str.length);
    else
        return false;
};
String.prototype.endWith = function(str) {
    if (this == str)    return true;

    if (String(str).length > 0)
        return str === this.substr(this.length - str.length, str.length);
    else
        return false;
};
String.prototype.bytes = function()
{    // 바이트 계산.
    var b = 0;
    for (var i=0; i<this.length; i++) b += (this.charCodeAt(i) > 128) ? 2 : 1;
    return b;
};
String.prototype.nl2br = function() {
    return this.replace(/\n/g, "<br />");
};
String.prototype.toMoney = function() {
    var s = (this.nvl('0')).trim();
    if (isFinite(s)) {
        while((/(-?[0-9]+)([0-9]{3})/).test(s)) {
            s = s.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
        }
        return s;
    }
    else {
        return this;
    }
};
String.prototype.toNegative = function() {
    return this == '0' ? this : "- " + this;
};

/**
 * val 문자열을 len 길이만큼 왼쪽에 char 문자를 붙여서 반환 한다.
 *
 * 사용 예) "A".lpad(5, "0") => "0000A"
 *
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 왼쪽에 추가할 문자
 */
String.prototype.lpad = function(len, char) {
    var val = String(this);
    if (typeof(char)!="string" && typeof(len)!="number") {
        return val;
    }
    char = String(char);
    while(val.length + char.length<=len) {
        val = char + val;
    }

    return val;
};
// alert("A".lpad(5, "0"));

/**
 * val 문자열을 len 길이만큼 오른쪽에 char 문자를 붙여서 반환 한다.
 *
 * 사용 예) "A".rpad(5, "0") => "A0000"
 *
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 오른쪽에 추가할 문자
 */
String.prototype.rpad = function(len, char) {
    var val = String(this);
    if (typeof(char)!="string" && typeof(len)!="number") {
        return val;
    }
    char = String(char);
    while(val.length + char.length<=len) {
        val = val + char;
    }

    return val;
};
//alert("A".rpad(5, "0"))

String.prototype.numberFormat = function() {
// return this;
// return $.number(this);
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


String.prototype.getBytesLength = function() {
    var s = this;
    for(b = i = 0;c = s.charCodeAt(i++);b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
};

String.prototype.getTransSpace = function() {
    return this.split(" ").join("&nbsp;");
};


/*--------------------------------------------------------------------------------*\
* Number Object Prototype
\*--------------------------------------------------------------------------------*/
Number.prototype.toMoney = function() {
    return String(this).toMoney();
};


Number.prototype.numberFormat = function() {
// return this
// return $.number(this);
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


/**
 * val 문자열을 len 길이만큼 왼쪽에 char 문자를 붙여서 반환 한다.
 *
 * 사용 예) (123).lpad(5,"0") => "00123"
 *
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 왼쪽에 추가할 문자
 */
Number.prototype.lpad = function(len, char) {
    return String(this).lpad(len,char);
};
//alert((123).lpad(5,"0"));

/**
 * val 문자열을 len 길이만큼 오른쪽에 char 문자를 붙여서 반환 한다.
 *
 * 사용 예) (123).rpad(5,"0") => "12300"
 *
 * @param val
 *            문자열
 * @param len
 *            생성할 문자열 길이
 * @param char
 *            해당 길이만큼 오른쪽에 추가할 문자
 */
Number.prototype.rpad = function(len, char) {
    return String(this).rpad(len,char);
}
//alert((123).rpad(5,"0"));

/*--------------------------------------------------------------------------------*\
* Date Object Prototype
\*--------------------------------------------------------------------------------*/
/**
 *
 * 포멧에 맞는 날짜 문자열을 꺼낸다.
 *
 * 사용 예)
 * > new Date().format("yyyy-MM-dd hh:mm:ss E a/p")
 * > => 2016-11-24 11:00:31 목요일 오전
 *
 *
 *
 */
Date.prototype.format = function(format) {
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    if (!d.valueOf()) return " ";
    if(format == undefined) return " ";
    format = String(format);

    return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy":   return (d.getFullYear() % 1000).lpad(2, "0");
            case "MM":   return (d.getMonth() + 1).lpad(2, "0");
            case "dd":   return d.getDate().lpad(2, "0");
            case "E":    return weekName[d.getDay()];
            case "HH":   return d.getHours().lpad(2, "0");
            case "hh":   return ((h = d.getHours() % 12) ? h : 12).lpad(2, "0");
            case "mm":   return d.getMinutes().lpad(2, "0");
            case "ss":   return d.getSeconds().lpad(2, "0");
            case "a/p":  return d.getHours() < 12 ? "오전" : "오후";
            default:     return $1;
        }
    });
};
//alert(new Date().format("yyyy-MM-dd hh:mm:ss E a/p"));


/**
 * 일수를 계산한 날짜를 반환 한다.
 *
 * 사용 예)
 * new Date().addDate(1);  : 내일날짜 반환
 * new Date().addDate(0);  : 오늘날짜 반환
 * new Date().addDate(-1); : 어제날짜 반환
 *
 * @param dateCount
 *            더할 일수
 *
 * @return 계산되어 생성된 Date Object
 *
 */
Date.prototype.addDate = function(dateCount) {
    return new Date(this.valueOf() + (dateCount * (24*60*60*1000)) );
};
//alert(new Date().addDate(1).addDate(1));

Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

Date.prototype.dateDiff = function(value) {
    var diffDate_1 = this;
    var diffDate_2 = value instanceof Date ? value : new Date(value);

    diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth(), diffDate_1.getDate());
    diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth(), diffDate_2.getDate());

    var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
    diff = Math.ceil(diff / (1000 * 3600 * 24));

    return diff;
};