/**
 * get Element by class
 * @return {HTMLCollection} target elements
 */
function getByClass (parent, className) {
	var result = [];

	if (!className) {
		className = arguments[0];
		parent = document;
	};

	var allChild = parent.getElementsByTagName('*'),
		cur,
		classList;

	for (var i = 0, len = allChild.length; i < len; i++) {
		cur = allChild[i];
		classList = cur.className.split(' ');
		for (var j = 0, iLen = classList.length; j < iLen; j++) {
			if(classList[j] === className) {
				result.push(cur);
			}
		}
	}

	return result;
}

/**
 * 初始化一个日历
 * @param  {Object} opt 日历配置
 * @return {null}   
 */
function initCalendar (opt) {	
	var beforeTem, repeatStr='', afterTem, now, year, month, day, preMonthDays, tMonthDay, nextMonthDay, val, dayToMonth;

	dayToMonth = [31, undefined, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	year = new Date().getFullYear();
	month = new Date().getMonth();
	now = new Date(year, month, 1);
	day = now.getDay();

	/**
	 * 生成日历中心体
	 * @param  {Number} preMonthDays 上一个月的天数
	 * @param  {Number} tMonthDay    这个月的天数
	 * @param  {Number} day          这个月的第一天是星期几
	 * @return {String}              中心体字符串
	 */
	var makeCalendarBody = function (preMonthDays, tMonthDay, day, year, month) {
		var date = new Date().getDate(),
			curYear = (new Date()).getFullYear(),
			curMonth = (new Date()).getMonth(),
			iClass = '',
			str = '', val, over = false, shouldCheck = false;

		//只有年与月跟当前相同, 才检测是不是今天	
		if (!year) {
			var dateEle = getByClass('calendar_top_val')[0];
			year = parseInt(dateEle.innerText.split(' - ')[0]);
			month = parseInt(dateEle.innerText.split(' - ')[1]) - 1;
		}

		shouldCheck = ( year === curYear && 
				month === curMonth) ? true : false;

		for (var i = 0, len = 6; i < len; i++) {
			str += '<tr>';

			for(var j = 0, days = 7; j < days; j++) {

				if (i === 0) {
					if (j < day) {
						iClass = 'calendar_day out_of_month';
						str += '<td class="' + iClass + '">' + (preMonthDays - (day - j) + 1) + '</td>';
					} else if (j === day) {
						val = 1;
						if (shouldCheck && val === date) {
							//如果是今天
							iClass = 'calendar_day calendar_today';
						} else {
							iClass = 'calendar_day';
						}
						str += '<td class="' + iClass + '">' + val + '</td>';
					} else if (j > day) {
						++val;
						if (shouldCheck && val === date) {
							//如果是今天
							iClass = 'calendar_day calendar_today';
						} else {
							iClass = 'calendar_day';
						}
						str += '<td class="' + iClass + '">' + val + '</td>';
					}
				} else {
					if (tMonthDay === val) {
						val = 0;
						over = true;
					}
					++val;
					if (over) {
						str += '<td class="calendar_day out_of_month">' + val + '</td>';
					} else {
						if (shouldCheck && val === date) {
							//如果是今天
							iClass = 'calendar_day calendar_today';
						} else {
							iClass = 'calendar_day';
						}

						str += '<td class="' + iClass + '">' + val + '</td>';
					}
					
				}
			}
			str += '</tr>';
		}

		return str;
	};

	/**
	 * 设置二月份的天数
	 * return null
	 */
	var setFreDay = function (year) {
		if (!(year % 100)) {
			if (!(year % 400)) {
				//闰年
				dayToMonth[1] = 29;
			} else {
				//平年
				dayToMonth[1] = 28;
			}
		} else {
			if (!(year % 4)) {
				//闰年
				dayToMonth[1] = 29;
			} else {
				//平年
				dayToMonth[1] = 28;
			}
		}
	}

	setFreDay(year);

	preMonthDays = dayToMonth[month - 1];
	tMonthDay = dayToMonth[month];
	nextMonthDay = dayToMonth[month + 1];

	beforeTem = '<div class="calendar">' +
						'<div class="calendar_header">' + 
							'<a href="javascript:void(0)" class="calendar_prev_month"></a>' + 
							'<span class="calendar_top_val">' + year + ' - ' + (month + 1) + '</span>' +
							'<a href="javascript:void(0)" class="calendar_next_month"></a>' + 
						'</div>' + 
						'<div class="calendar_body">' + 
							'<ul class="calendar_bar">' + 
								'<li>日</li>' +
								'<li>一</li>' +
								'<li>二</li>' +
								'<li>三</li>' +
								'<li>四</li>' +
								'<li>五</li>' +
								'<li>六</li>' +
							'</ul>' + 
							'<div class="calendar_day_wrapper">' + 
								'<table>';

	afterTem = '</table>' + 
					'</div>' + 
				'</div>' + 
				'<div class="calendar_footer">' + 
					'<button class="crave_default_btn calendar_cancel_btn">取消</button>' + 
					'<button class="crave_default_btn calendar_confirm_btn mr_6">确定</button>' + 
				'</div>' + 
			'</div>';

	
	

	var calendarWrap = document.createElement('div'),
		bodyStr = makeCalendarBody(preMonthDays, tMonthDay, day, year, month);
	calendarWrap.id = 'calendar_wrapper';
	calendarWrap.innerHTML = beforeTem + bodyStr + afterTem;

	document.body.appendChild(calendarWrap);

	//检测点击事件
	document.body.onclick = function (ev) {
		var source = ev.target || ev.srcElement,
			classList = source.className.split(/\s+/),
			bodyEle = getByClass('calendar_day_wrapper')[0],
			bodyStr = '',
			dateEle = getByClass('calendar_top_val')[0],
			curYear = parseInt(dateEle.innerText.split(' - ')[0]),
			curMonth = parseInt(dateEle.innerText.split(' - ')[1]),
			findVal,
			permissionDom,
			preMonth,
			preMonthDays,
			tMonthDay,
			day;

		permissionDom = [
			'calendar_prev_month', 
			'calendar_next_month', 
			'calendar_day', 
			'calendar_confirm_btn', 
			'calendar_cancel_btn'
		];
 		
		for (var len = classList.length, i = 0; i < len; i++) {
			for (var j = 0, arrLen = permissionDom.length; j < arrLen; j++) {
				if (permissionDom[j] === classList[i]) {
					findVal = classList[i];
					break;
				}
			}
		}

		if (!findVal) return;

		switch  (findVal) {
			case 'calendar_prev_month' : 
				if (parseInt(curMonth) === 1) {
					// 现在已经1月的话, 那么现在的前一个月应该是前一年了
					curMonth = 12;
					preMonth = curMonth - 1;
					curYear = curYear - 1;
					dateEle.innerText = curYear + ' - ' + curMonth;

					setFreDay(curYear);
					preMonthDays = dayToMonth[preMonth - 1];
					tMonthDay = dayToMonth[curMonth - 1];
				} else {
					curMonth = curMonth - 1;
					preMonth = (curMonth - 1 === 0) ? 12 : (curMonth - 1);
					dateEle.innerText = curYear + ' - ' + curMonth;
					setFreDay(curYear);
					preMonthDays = dayToMonth[preMonth - 1];
					tMonthDay = dayToMonth[curMonth - 1];
				}

				day = new Date(curYear, curMonth - 1, 1).getDay();
				bodyStr = makeCalendarBody(preMonthDays, tMonthDay, day);
				break;
			case 'calendar_next_month' :
				if (curMonth === 12) {
					// 现在已经12月的话, 那么下个月应该是下一年了
					curMonth = 1;
					preMonth = 12;
					curYear = curYear + 1;
					dateEle.innerText = curYear + ' - ' + curMonth;

					setFreDay(curYear);
					preMonthDays = dayToMonth[preMonth - 1];
					tMonthDay = dayToMonth[curMonth - 1];
				} else {
					preMonth = curMonth;
					curMonth++;
					dateEle.innerText = curYear + ' - ' + curMonth;
					setFreDay(curYear);
					preMonthDays = dayToMonth[preMonth - 1];
					tMonthDay = dayToMonth[curMonth - 1];
				}

				day = new Date(curYear, curMonth - 1, 1).getDay();

				bodyStr = makeCalendarBody(preMonthDays, tMonthDay, day);
				break;
			case 'calendar_day' : 
				var allSelected = getByClass('calendar_selected')[0];

				if (allSelected) {
					allSelected.className = allSelected.className.replace(/\s*calendar_selected\s*/, '');
				}
				
				source.className += ' calendar_selected';
				return;
			case 'calendar_confirm_btn' :
				var allSelected = getByClass('calendar_selected')[0];
				var val = curYear + '-' + curMonth + '-' + allSelected.innerText;
				alert(val);
				return;
				break;
			case 'calendar_cancel_btn' :
				var mainBody = getByClass('calendar')[0];
				mainBody.style.display = 'none';
				break;
		};

		bodyEle.innerHTML = '<table>' + bodyStr + '</table>';
	}
}