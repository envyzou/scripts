const wsurl = "ws://127.0.0.1:2019";
var ws = null;
const propsId = Object.keys(
    document.querySelector(".ReactVirtualized__List")
)[1];
const chatObserverrom = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
            let dom = mutation.addedNodes[0];
            let { props } = dom[propsId].children;
            let message_info = props.data;
            console.log("服务器监听到一条消息,如下：");
            console.log(message_info);
            if (message_info.commentContent) {
                ws_send(message_info);
            }

        }
    }
});
function ws_send(message) {
    ws.send(JSON.stringify(message));
}
function init() {
    console.clear()
    ws = new WebSocket(wsurl);
    ws.onclose = () => {
        console.log("服务器断开,请启动ws服务" + wsurl);
    };
    ws.onerror = error => {
        console.log("服务器断开,请启动ws服务" + wsurl);
    };
    ws.onopen = () => {
        console.log("连接ws成功:" + wsurl);
        console.log("- 欢迎加入");
        //observer.observe(roomJoinDom, { childList: true });
        chatObserverrom.observe(chatDom, { childList: true });
    };

}
init();
