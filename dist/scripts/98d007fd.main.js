"use strict";$(function(){function a(a){return $("<div/>").text(a).text()}function b(a){var b="https://alpha.fromamsterdamwithlove.net?"+$.param(a);h=Primus.connect(b),h.on("open",function(){m.fadeOut(),n.show(),m.off("click"),q=l.focus(),i="general",h.send("join",{room:i},function(a){console.log("Joined room: "+a)}),h.send("listrooms",{},function(a){console.log("rooms: "+a)})}),h.on("message",function(a,b){e(a),console.log("Msg "+a+" received"),b&&b(a.id)})}function c(){g=a(k.val().trim()),g&&$.ajax("https://alpha.fromamsterdamwithlove.net/demo/"+g+"/token",{success:function(a){b(a)},beforeSend:function(a){a.setRequestHeader("Authorization","Basic "+btoa("pcampus:J6IpR|4q"))}})}function d(){var b=l.val();b=a(b),b&&(h.send("msgtoroom",{message:b,room:i},function(a){console.log("send message ("+b+") successfull: "+a)}),l.val(""))}function e(a,b){b=b||{};var c=JST["chat-message"](a,b);f(c,b)}function f(a,b){var c=$(a),d={fade:!0,prepend:!1};b=b||{},b=$.extend({},d,b),b.fade&&c.hide().fadeIn(j),b.prepend?o.prepend(c):o.append(c),o[0].scrollTop=o[0].scrollHeight}var g,h,i,j=150,k=$(".usernameInput"),l=$(".messageInput"),m=$(".login.page"),n=$(".chat.page"),o=$(".messages"),p=$(window),q=k.focus();p.keydown(function(a){a.ctrlKey||a.metaKey||a.altKey||q.focus(),13===a.which&&(m.is(":visible")?(console.log("logging in"),c()):n.is(":visible")&&(console.log("sending message"),d()))})}),this.JST=this.JST||{},this.JST["chat-message"]=Handlebars.template(function(a,b,c,d,e){this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,a.helpers),e=e||{};var f,g,h="",i="function",j=this.escapeExpression;return h+="<li>",(g=c.message)?f=g.call(b,{hash:{},data:e}):(g=b&&b.message,f=typeof g===i?g.call(b,{hash:{},data:e}):g),h+=j(f)+"</li>"});