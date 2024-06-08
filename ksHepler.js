const wsurl = "ws://127.0.0.1:2019";
var ws = null;
const propsId = Object.keys(
    document.querySelector(".ReactVirtualized__List")
)[1];
/*const roomJoinDom = document.querySelector(
    ".ReactVirtualized__Grid__innerScrollContainer"
);*/
const chatDom = document.querySelector(".ReactVirtualized__Grid__innerScrollContainer");
/*const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
            let dom = mutation.addedNodes[0];
            let { user, common } = dom[propsId].children.props.message.payload;
            if (user.short_id) {
                let message_info = getUser(user);
                if (common.anchor_fold_type_v2 === "1") {
                    message_info.message_type = "like";
                    message_info.message_describe = `${message_info.user_nickName} 为主播点赞Le`;
                }
                if (common.anchor_fold_type_v2 === "3") {
                    message_info.message_type = "join";
                    message_info.message_describe = `${message_info.user_nickName} 来了`;
                }
                const msg = Object.assign(createMessage(), message_info);
                ws_send(msg);
            }
        }
    }
});*/
//document.querySelector(".ReactVirtualized__Grid__innerScrollContainer").children[5]['__reactProps$olj20vra1j'].props.children.props.children.props.data
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

function createMessage() {
    const new_msg = {
        message_type: null,
        user_follow_status: null,
        user_id: null,
        user_url: null,
        user_nickName: null,
        user_avatar: null,
        user_gender: null,
        user_is_admin: null,
        user_is_super_admin: null,
        user_level_value: null,
        user_level_icon: null,
        user_fans_light_level_value: null,
        user_fans_light_level_name: null,
        user_fans_light_icon_url: null,
        gift_combo_count: null,
        gift_id: null,
        gift_url: null,
        gift_name: null,
        gift_total_count: null,
    };
    return new_msg;
}

function getUser(user) {
    if (!user) {
        return {};
    }
    let msg = {
        user_follow_status: user.follow_status === "0" ? "y" : "n", // 是否关注
        user_id: user.short_id,
        user_url: `https://www.douyin.com/user/${user.sec_uid}`,
        user_nickName: user.nickname,
        user_avatar: user.avatar_thumb.url_list[0],
        user_gender: user.gender === 1 ? "男" : "女",
        user_is_admin: user.user_attr.is_admin ? "y" : "n",
        user_is_super_admin: user.user_attr.is_super_admin ? "y" : "n", // 超级管理员
    };

    user.badge_image_list.map((item) => {
        if (item.image_type === 1) {
            msg.user_level_value = item.content.level;
            msg.user_level_icon = item.url_list[0];
        }
        if (item.image_type === 7) {
            msg.user_fans_light_level_value = item.content.level;
            msg.user_fans_light_level_name = item.content.name;
            msg.user_fans_light_icon_url = item.url_list[0];
        }
    });

    return msg;
}

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
