    let _obj2Params = function(obj, startTag) {
        let result = startTag
        for (let key in obj) {
            result += key + '=' + obj[key] + '&'
        }
        return result.slice(0, -1);
    }
    let upLoadData = function(options) {
        // 修改image标签的src和后台通信
        console.log('send')
        this.setData({
            tarUploadSrc: "http://api.scrm.weisgj.com/wxtags/batchuntag?&random=" + Math.random() + _obj2Params('&')
        })
    }
    let wrapActionHandle = function(actionFuncName, eventParams) {
        console.table([{
            actionFuncName,
            eventParams,
            this
        }])
    }
    let wrapWxApiHandle = function(apifuncName, eventParams) {
        console.table([{
            apifuncName,
            eventParams,
            this
        }])
    }
    const glPage = Page
    Page = (options) => {
        // 接管Page方法
        !options.onLoad && (options.onLoad = function onLoad() {}), !options.onReady && (options.onReady = function onReady() {}), !options.onShow && (options.onShow = function onShow() {}), !options.onHide && (options.onHide = function onHide() {}), !options.onUnload && (options.onUnload = function onUnload() {}), !options.onPullDownRefreash && (options.onPullDownRefreash = function onPullDownRefreash() {});
        for (let key in options) {
            if (typeof options[key] == 'function') {;
                (() => {
                    let temp = options[key];
                    const inkey = key;
                    options[key] = function() {
                        wrapActionHandle.call(this, inkey, arguments);
                        return temp.apply(this, arguments);
                    }
                })();
            }
        }
        glPage(options)
    }
    const gWx = wx
    let targetWx = {}
    wx = targetWx
    for (let key in gWx) {
        // 接管wx对象
        if (typeof gWx[key] == 'function') {;
            (() => {
                const inkey = key
                targetWx[inkey] = function() {
                    wrapWxApiHandle.call(this, inkey, arguments)
                    return gWx[inkey].apply(this, arguments)
                }
            })();
        }
    }