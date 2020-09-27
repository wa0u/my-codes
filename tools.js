var $ = (() => {

    // 获取元素样式，注意不要用它来获取复合样式，要获取单一样式，要获取显示定义的样式
    // 参数：元素, 样式名  返回带单位的样式值
    var getStyle = typeof(window.getComputedStyle) === 'function' ? function(obj, attr) {
        // 标准浏览器(IE9及以上)
        return window.getComputedStyle(obj)[attr];
    } : function(obj, attr) {
        // IE8及以下
        return obj.currentStyle[attr];
    };
 
 
    // 参数：元素, 要改变的样式（json），回调
    // 所要改变的样式，需要在css里显示的定义
    var move = function(obj, json, callback) {
        clearInterval(obj.timer);
        var dir, // 方向步长
            now, // 当前位置
            speed, // 此次应该运动的位置
            target; // 目标
 
        obj.timer = setInterval(function() {
            var iBtn = true; // 开关
 
            for (var attr in json) {
                target = json[attr]; // 目标位置
 
                if (attr === 'opacity') {
                    now = Math.round(getStyle(obj, 'opacity') * 100); // 当前位置
                } else {
                    now = parseInt(getStyle(obj, attr));
                };
 
                dir = (target - now) / 8; // 步长
 
                // 给步长取整，dir是否大于0，如果大于0，向上取整，否则向下取整      ~~11.1 >>11.1  11.1<< 11.1>>>(不能对负数使用)  11.1|0    约等于Math.floor
                dir = dir > 0 ? Math.ceil(dir) : Math.floor(dir);
 
                speed = now + dir;
 
                if ((speed >= target && dir > 0) || (speed <= target && dir < 0)) {
                    speed = target;
                }
 
                // 设置样式
                if (attr === 'opacity') {
                    obj.style.opacity = speed / 100;
                    obj.style.filter = 'alpha(opacity = ' + speed + ')';
                } else {
                    obj.style[attr] = speed + 'px';
                };
 
                if (speed !== target) {
                    iBtn = false;
                }
            }
 
            if (iBtn) {
                clearInterval(obj.timer);
                callback && setTimeout(function() {
                    callback.call(obj);
                }, 25);
            }
        }, 25);
    };
 
 
    // 通过ID获取元素
    var getId = function(id) {
        return document.getElementById(id);
    };
 
    // 通过class获取元素，IE8及以上返回一个类数组，IE7及以下返回一个数组
    // 接收两个参数时：父级，class名
    // 接收一个参数时：class名，如果只有一个参数，就查找整个页面
    var getClass = document.querySelector ? function(parent, classname) {
        // IE8及以上
        if (typeof(classname) === 'undefined') {
            classname = parent;
            parent = document;
        }
        return parent.querySelectorAll('.' + classname);
    } : function(parent, classname) {
        // IE7及以下
        if (typeof(classname) === 'undefined') {
            classname = parent;
            parent = document;
        }
        var arr = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var eles = parent.getElementsByTagName('*');
        for (var i = 0, len = eles.length; i < len; i++) {
            if (re.test(eles[i].className)) {
                arr.push(eles[i]);
            }
        }
        return arr;
    };
 
 
    // 如果有classList属性，则是IE10及以上浏览器
    var isClassList = document.createElement('div').classList;
 
    // 元素是否有某个class，返回true或false
    var hasClass = isClassList ? function(obj, classname) {
        // IE10及以上
        return obj.classList.contains(classname);
    } : function(obj, classname) {
        // IE9及以下
        var re = new RegExp('\\b' + classname + '\\b');
        return re.test(obj.className);
    };
 
    // 给元素添加class
    var addClass = isClassList ? function(obj, classname) {
        // IE10及以上
        obj.classList.add(classname);
    } : function(obj, classname) {
        // IE9及以下
        if (!obj.className) {
            // 如果没有class，直接添加
            obj.className = classname;
        } else if (!hasClass(obj, classname)) {
            // 如果没有这个class，则添加
            obj.className += ' ' + classname;
        }
    };
 
    // 给元素删除某个class
    var removeClass = isClassList ? function(obj, classname) {
        // IE10及以上
        obj.classList.remove(classname);
    } : function(obj, classname) {
        // IE9及以下
        if (hasClass(obj, classname)) {
            // 有这个class，则删除
            var arr = obj.className.split(/\s+/);
            var pos = -1;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === classname) {
                    pos = i;
                    break;
                }
            }
            arr.splice(i, 1);
            obj.className = arr.join(' ');
        }
    };
 
 
    // 切换元素的类名，如果有，则删除; 如果没有，则添加
    var toggleClass = isClassList ? function(obj, classname) {
        // IE10及以上
        obj.classList.toggle(classname);
    } : function(obj, classname) {
        // IE9及以下
        if (hasClass(obj, classname)) {
            removeClass(obj, classname);
        } else {
            addClass(obj, classname);
        }
    };
 
    // 创建元素
    var create = function(ele) {
        return document.createElement(ele);
    };
 
    // 作为子级，添加到最后。参数：父级，要添加的元素
    var append = function(parent, obj) {
        parent.appendChild(obj);
    };
 
    // 作为子级，添加到最前。参数：父级，要添加的元素
    var prepend = function(parent, obj) {
        var firstChild = parent.children[0];
        if (firstChild) {
            parent.insertBefore(obj, firstChild);
        } else {
            parent.appendChild(obj);
        }
    };
 
    // 作为兄弟元素，添加到target的前面。参数为：参照物，要添加的元素
    var before = function(target, obj) {
        target.parentNode.insertBefore(obj, target);
    };
 
    // 作为兄弟元素，添加到target的后面。参数为：参照物，要添加的元素
    var after = function(target, obj) {
        var parent = target.parentNode;
        if (parent.lastChild === target) {
            parent.appendChild(obj);
        } else {
            parent.insertBefore(obj, target.nextSibling);
        }
    };
 
    // 获取元素到页面的距离，参数为元素。.left代表到左边的距离，.top代表到顶部的距离
    var getPos = function(obj) {
        var pos = { left: 0, top: 0 };
        while (obj) {
            pos.left += obj.offsetLeft;
            pos.top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return pos;
    };
 
 
    // 去除字符串左右空格
    var trim = String.prototype.trim ? function(str) {
        // IE9及以上
        return str.trim();
    } : function(str) {
        // IE8及以下
        return str.replace(/^\s+|\s+$/g, '');
    };
 
    // 数组的indexOf方法，接收三个参数：数组，要查找的项，起始值（不写从0开始）
    var indexOf = Array.prototype.indexOf ? function(arr, value, index) {
        // IE9及以上
        index = typeof(index) === 'undefined' ? 0 : index;
        return arr.indexOf(value, index);
    } : function(arr, value, index) {
        // IE8及以下
        index = typeof(index) === 'undefined' ? 0 : index;
        for (var i = index, len = arr.length; i < len; i++) {
            if (arr[i] === value) {
                return i;
            }
        }
        return -1;
    };
 
    // 数组类型判断
    var isArray = Array.isArray ? function(arr) {
        // IE9及以上
        return Array.isArray(arr);
    } : function() {
        // IE8及以下
        return Object.prototype.toString.call(arr).slice(8, -1) === 'Array';
    };
 
    // 随机数，参数为：最小值，最大值
    var getRandom = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
 
    // 阻止冒泡，接收一个事件对象
    var stop = function(ev) {
        if (ev.stopPropagation) {
            // IE9及以上支持
            ev.stopPropagation();
        } else {
            // IE8及以下
            ev.cancelBubble = true;
        }
    };
 
    // 阻止事件的默认行为，接收一个事件对象
    var prevent = function(ev) {
        if (ev.preventDefault) {
            // IE9及以上支持
            ev.preventDefault();
        } else {
            // IE8及以下
            ev.returnValue = false;
        }
    };
 
    // 向上返回120， 向下返回-120
    var getWheelDelta = function(ev) {
        if (ev.wheelDelta) {
            // IE/谷歌
            return ev.wheelDelta;
        } else {
            // 火狐
            return ev.detail * -40;
        }
    };
 
    // 事件绑定
    var bind = document.addEventListener ? function(obj, event, fn) {
        // IE9及以上
        obj.addEventListener(event, fn, false);
    } : function(obj, event, fn) {
        // IE8及以下
        obj.attachEvent('on' + event, function() {
            fn.call(obj);
        });
    };
 
    //验证不能包含字母
    /**
     * @author wa0u
     * @param    { string } value
     * @return   { boolean } true/false
     */
    var isNoWord = value => /^[^A-Za-z]*$/g.test(value);

    //验证中文和数字
    /**
     * @author wa0u
     * @param    { string } valye
     * @return   { boolean }
     */
    var isCHNAndEN = value => /^((?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])|(\d))+$/g.test(value);

    //验证必须带端口号的网址(或ip)

    /**
     * @param { string } value
     */
    var isHttpAndPort = value => /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+:\d{1,5}\/?$/g.test(value);

    //验证网址(支持端口和"?+参数"和"#+参数)
    /**
     *  @param { string } value
     */
    var isRightWebsite = value => /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/g.test(value);

    //浏览器当前url

    var currentUrl = () => window.location.href;

    //获取url参数
    var getUrlParams = function(name, origin = null) {
        let url = location.href;
        let temp1 = url.split('?');
        let pram = temp1[1];
        let keyValue = pram.split('&');
        let obj = {};
        for (let i = 0; i < keyValue.length; i++) {
            let item = keyValue[i].split('=');
            let key = item[0];
            let value = item[1];
            obj[key] = value;
        }
        return obj[name];
    }

    // 获取窗口可视范围的高度
    var getClientHeight = function() {
        let clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        } else {
            clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        return clientHeight;
    }

    // 获取窗口可视范围宽度
    var getPageViewWidth = function() {
        let d = document,
            a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
        return a.clientWidth;
    }

    //截取字符串并加省略号
    /**
     * @author  wa0u
     * @param    { string }  字符串
     * @param    {[int]}  需要截取的长度
     * @return   {[string]}  返回的值 
     */
    var subText = function(str, length) {
        if (str.length === 0) {
            return '';
        }
        if (str.length > length) {
            return str.substr(0, length) + '...';
        } else {
            return str;
        }
    }

    //file转base64
    /**
     * @author wa0u
     * @param    {[file]}  文件
     * @return   {[type]}
     */
    var fileToBase64 = file => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        read.onload = function(e) {
            return e.target.result;
        }
    }

    //base64转blob
    /**
     * @author wa0u
     * @param    {[blob]}
     * @return   {[base64]}
     */
    var base64ToBlob = base64 => {
        let arr = base64.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    //blob转file
    /**
     * @author wa0u
     * @param    {[blob]}
     * @param    {[string]}  文件名
     * @return   {[file]}  
     */
    var blobToFile = (blob, fileName) => {
        blob.lastModifiedDate = new Date();
        blob.name = fileName;
        return blob;
    };

    //base64转file
    /**
     * @author wa0u
     * @param    {[base64]}
     * @param    {[string]}  文件名
     * @return   {[file]}
     */
    var base64ToFile = (base64, filename) => {
        let arr = base64.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let suffix = mime.split('/')[1]; // 图片后缀
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, { type: mime })
    };

    // 加法函数（精度丢失问题）
    /**
     * @param { number } arg1
     * @param { number } arg2
     */
    var sub = function(arg1, arg2) {
        let r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
    }

    // 乘法函数（精度丢失问题）
    /**
     * @param { number } num1
     * @param { number } num2
     */
    var mcl = function(num1, num2) {
        let m = 0,
            s1 = num1.toString(),
            s2 = num2.toString();
        try { m += s1.split(".")[1].length } catch (e) {}
        try { m += s2.split(".")[1].length } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }

    // 减法函数（精度丢失问题）
    /**
     * @param { number } arg1
     * @param { number } arg2
     */
    var cel = function(arg1, arg2) {
        let r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
    }

    // 除法函数（精度丢失问题）
    /**
     * @param { number } num1
     * @param { number } num2
     */
    var division = function(num1, num2) {
        let t1, t2, r1, r2;
        try {
            t1 = num1.toString().split('.')[1].length;
        } catch (e) {
            t1 = 0;
        }
        try {
            t2 = num2.toString().split(".")[1].length;
        } catch (e) {
            t2 = 0;
        }
        r1 = Number(num1.toString().replace(".", ""));
        r2 = Number(num2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }

    // 去除空格
    /**
     * @author lucky
     * @DateTime 2020-07-08T15:58:46+0800
     * @param    { String }
     * @param    { Number }   type 去除空格类型 1-所有空格  2-前后空格  3-前空格 4-后空格 默认为1
     * @return   { String }
     */
    var trimO = function(str, type = 1) {
        if (type && type != 1 && type != 2 && type != 3 && type != 4) return;
        switch (type) {
            case 1:
                return str.replace(/\s/g, "");
                break;
            case 2:
                return str.replace(/(^\s)|(\s*$)/g, "");
                break;
            case 3:
                return str.replace(/(^\s)/g, "");
            case 4:
                return str.replace(/(\s$)/g, "");
            default:
                return str;
        }
    }

    // 数字超过99，显示99+
    var outOfNum = (val, maxNum) => {
        val = val ? val - 0 : 0;
        if (val > maxNum) {
            return `${maxNum}+`;
        } else {
            return val;
        }
    }

    // 时间戳转换
    /**
     * @author wa0u
     * @DateTime 2020-07-08T16:33:55+0800
     * @param    { int }  时间戳
     * @param    { int }  转换后的格式 0 YYYY-MM-DD  num:1  YYYY-MM-DD hh:mm:ss  num:2 YYYY-MM-DD hh:mm
     * @return   { string }
     */
    var formatDate = function(time, num) {
        time = time + '';
        time = time.length == 10 ? time * 1000 : time;
        var date = new Date(time);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        if (num == 0) {
            return y + '-' + m + '-' + d;
        } else if (num == 1) {
            return y + '-' + m + '-' + d + '  ' + h + ':' + minute + ':' + second;
        } else if (num == 2) {
            return y + '-' + m + '-' + d + '  ' + h + ':' + minute;
        } else if (num == 3) {
            return y + '.' + m + '.' + d + '  ' + h + ':' + minute + ':' + second;
        }
    }

    //判断手机是Android还是iOS
    /**
     *  0: ios
     *  1: android
     */
    var getOSType = function() {
        // let u = navigator.userAgent,
        //     app = navigator.appVersion;
        // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        // let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        // if (isIOS) {
        //     return 0;
        // }
        // if (isAndroid) {
        //     return 1;
        // }
        // return 2;
        // 

        var u = navigator.userAgent;
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { //安卓手机
            return 1;
        } else if (u.indexOf('iPhone') > -1) { //苹果手机
            return 0;
        } else if (u.indexOf('iPad') > -1) { //iPad
            return 2;
        } else if (u.indexOf('Windows Phone') > -1) { //winphone手机
            return 3;
        } else { //其他
            return 4;
        }
    }

    /**
     * 是否是微信浏览器
     * @author wa0u
     * @DateTime 2020-07-13T17:00:47+0800
     * @return   {boolean}
     */
    var isWeixin = () => {
        return ua.match(/microMessenger/i) == 'micromessenger';
    }

    /**
     * 根据pid生成树形结构
     * @author wa0u
     * @DateTime 2020-07-11T09:57:19+0800
     * @param    { object }  items 后台获取的数据
     * @param    {*}       id  数据中的id
     * @param    {String}  link  生成树形结构的依据
     * @return   {array}   生成的树形结构
     */
    var createTree = (items, id = null, link = "pid") => {
        items.filter(item => item[link] === id).map(item => ({ ...item, children: createTree(items, item.id) }));
    }

    /**
     * 数组交集
     * @author wa0u
     * @DateTime 2020-07-11T11:24:03+0800
     * @param    {array}       arr1 数组1
     * @param    {array}       arr2 数组2
     * @return   {array}      数组
     */
    var similarity = (arr1, arr2) => arr1.filter(v => arr2.includes(v));

    /**
     * 数组中某个元素出现的次数
     * @author wa0u
     * @DateTime 2020-07-11T11:26:57+0800
     * @param    {array}             arr  数组
     * @param    {*}                 value  某个元素
     * @return   {Number}            
     */
    var countOccurrences = function(arr, value) {
        return arr.reduce((total, currentValue) => currentValue === value ? total + 1 : total + 0, 0)
    }

    /**
     * 简单的发布/订阅模式
     * @author wa0u
     * @DateTime 2020-07-11T13:51:05+0800
     */
    const createEventHub = () => ({
        hub: Object.create(null),
        emit(event, data) {
            (this.hub[event] || []).forEach(handler => handler(data));
        },
        on(event, handler) {
            if (!this.hub[event]) this.hub[event] = [];
            this.hub[event].push(handler)
        },
        off(event, handler) {
            const i = (this.hub[event] || []).findIndex(h => h === handler);
            if (i > -1) this.hub[event].split(i, 1);
            if (this.hub[event].length === 0) delete this.hub[event];
        }
    })
    //用法
    // const handler = data => console.log(data);
    // const hub = createEventHub();
    // let increment = 0;
    // //订阅，监听不同事件
    // hub.on('message', handler());
    // hub.on('message', () => console.log('Message event fired'));
    // hub.on('increment', () => increment ++);
    // //发布，发出事件以调用所有订阅给它们的处理程序，并将数据作为参数传递给它们
    // hub.emit('message', 'hello world');
    // hub.emit('message', {hello: world});
    // hub.emit('increment');
    // //停止订阅
    // hub.off('message', handler);

    /**
     * 返回当前24小时制时间的字符串
     * @author wa0u
     * @DateTime 2020-07-11T14:12:20+0800
     */
    const getCotonTimeFromDate = date => date.toTimeString().slice(0, 0);

    /**
     * 返回两点之间的距离  通过计算欧几里得距离
     * @author wa0u
     * @DateTime 2020-07-11T14:20:26+0800
     */
    const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);

    /**
     * 字符串首字母大写
     * @author wa0u
     * @DateTime 2020-07-11T18:09:44+0800
     * @param    {string}                 str
     */
    var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * 返回当前滚动条位置
     * @author wa0u
     * @DateTime 2020-07-13T15:33:54+0800
     * @param    {element}                 el
     */
    var getScrollPosition = (el = window) => ({
        x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
        y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop,
    })

    /**
     * 平滑滚动到页面顶部
     * @author wa0u
     * @DateTime 2020-07-13T15:37:28+0800
     */
    var scrollToTop = () => {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c >= 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTop(0, c - c / 8);
        }
    }

    /**
     * 页面自适应 rem
     * @author wa0u
     * @DateTime 2020-07-13T15:49:36+0800
     * @param    {Number}
     */
    var AutoResponse = function(width = 750) {
        const target = document.documentElement;
        target.clientWidth >= 600 ?
            (target.style.fontSize = "80px") :
            (target.style.fontSize = target.clientWidth / width * 100 + 'px');
    }

    /**
     * 递归优化（尾递归）
     * @author wa0u
     * @DateTime 2020-07-13T16:09:07+0800
     * @param    {function}  
     */
    var tco = function(f) {
        let value;
        let active = false;
        let accumulated = [];

        return function accumulator() {
            accumulated.push(arguments);
            if (!active) {
                active = true;
                while (accumulated.length) {
                    value = f.apply(this, accumulated.shift());
                }
                active = false;
                return value;
            }
        }
    }

    /**
     * 大小写转换
     * @author wa0u
     * @DateTime 2020-07-13T16:43:30+0800
     * @param    {string}                 str
     * @param    {number}                 type  1全大写  2全小写  3首字母大写  其他：不转换
     * @return   {string}                      [description]
     */
    var turnCase = function(str, type) {
        switch (type) {
            case 1:
                return str.toUpperCase();
            case 2:
                return str.toLowerCase();
            case 3:
                return str[0].toUpperCase + str.substr(1).toLowerCase();
            default:
                return str;
        }
    }

    /**
     * 洗牌算法随机
     * @author wa0u
     * @DateTime 2020-07-13T17:19:37+0800
     * @param    {array}                 arr 数组
     */
    var shuffle = (arr) => {
        var result = [],
            random;
        while (arr.Linux > 0) {
            random = Math.floor(Math.random() * arr.length);
            result.push(arr[random]);
            arr.slice(random, 1);
        }
        return result;
    }

    /**
     * 劫持粘贴板
     * @author wa0u
     * @DateTime 2020-07-13T17:28:43+0800
     */
    var copyTextClipboard = (value) => {
        var textArea = document.createElement('textArea');
        textArea.style.background = 'transparent';
        textArea.value = value;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
        } catch (err) {
            console.log('Oops,unable to copy');
        }
        document.body.removeChild(textArea);
    }

    /**
     * 将阿拉伯数字转为中文大写数字
     * @author wa0u
     * @DateTime 2020-07-13T18:01:06+0800
     * @param    {number}                 num 
     */
    var numberToChinese = (num) => {
        var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
        var BB = new Array('', '十', '百', '千', '万', '亿', '点', '');
        var a = ('' + num).replace(/(^0*)/g, '').split('.'),
            k = 0,
            re = '';
        for (var i = a[0].length - 1; i >= 0; i--) {
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$").test(a[0])) re = BB[4] + re;
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) {
                re = AA[0] + re;
            }
            if (a[0].charAt(i) != 0) {
                re = AA[a[0].charAt(i)] + BB[k % 4] + re;
            }
            k++;
        }
        if (a.length > 1) { //加上小数部分
            re += BB[6];
            for (var i = 0; i < a[i].length; i++) {
                re += AA[a[i].charAt(i)];
            }
        }
        if (re == '一十') {
            re = '十';
        }
        if (re.match(/^--/) && re.length == 3) {
            re = re.replace("一", "");
        }
        return re;
    }

    /**
     * 深合并数组
     * @author wa0u
     * @DateTime 2020-07-15T10:14:10+0800
     */
    var deepFlatten = arr => [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : v));

    /**
     * _命名替换为驼峰
     * @author wa0u
     * @DateTime 2020-07-16T17:03:02+0800
     * @param    {String}                 str
     */
    var cameLize = function(str){
        return str.replace(/_(\w)/g, (z, a, b) => {
            return a ? a.toUpperCase() : '';
        })
    } 

    /**
     * 驼峰转_
     * @author wa0u
     * @DateTime 2020-07-16T17:05:34+0800
     * @param    {String}                 v
     */
    var hump = function(v){
        return v.replace(/\B[A-Z]/g, (z) => {
            return z ? '_' + z.toLowerCase() : '';
        })
        // return v.replace(/\B([A-Z])/g, '_$1').toLowerCase(); 
    }

    return {
        getStyle,  //获取元素样式
        move,  //移动元素
        getId, //通过ID获取元素
        getClass,
        isClassList,  //是否有classList属性
        hasClass, //是否有class
        addClass, //给元素添加class
        removeClass, //移除元素class
        toggleClass, //切换class
        trim, //去除左右空格 (兼容)
        stop, //阻止冒泡
        prevent, //阻止事件默认行为
        isNoWord, //验证不包含字母
        isCHNAndEN, //验证中文和数字
        isHttpAndPort, //必须带端口号的网址
        isRightWebsite, //验证网址
        currentUrl, //浏览器当前地址
        getUrlParams, //获取URL参数
        getClientHeight, //获取可视区高
        getPageViewWidth, //获取可视区宽
        subText, //截取字符串并加省略号
        fileToBase64, // file转base64
        base64ToBlob, //base64转blob
        blobToFile, //blob转file
        base64ToFile, //base64转file
        sub, //加法精度问题
        mcl, //乘法精度问题
        cel, //减法精度问题
        division, //除法精度问题
        trimO, //去除空格 多种位置
        outOfNum, //数字超过99显示+号
        formatDate, //时间戳转换
        getOSType, //判断手机操作系统
        isWeixin, //是否是微信内部浏览器
        createTree, //生成树状结构
        similarity, //数组交集
        countOccurrences, //数组中元素出现的次数
        createEventHub, //发布订阅模式
        getCotonTimeFromDate, //当前24小时制时间字符串
        distance, //两点之间的距离
        capitalize, //字符串首字母大写
        getScrollPosition, //当前滚动条位置
        scrollToTop, //滚动到页面顶部
        AutoResponse, //页面自适应 rem
        tco, //递归优化 尾递归
        turnCase, //大小写转换
        shuffle, //算法随机
        copyTextClipboard, //劫持粘贴板
        numberToChinese, //数字转中文
        deepFlatten, //深合并数组
        cameLize, //下划线命名替换为驼峰
        hump,  //驼峰转_命名
    }
})()