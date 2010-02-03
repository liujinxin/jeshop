/*!
 * WYSIWYG UBB Editor support for xhEditor
 * @requires xhEditor
 * 
 * @author Yanis.Wang<yanis.wang@gmail.com>
 * @site http://pirate9.com/
 * @licence LGPL(http://www.opensource.org/licenses/lgpl-license.php)
 * 
 * @Version: 0.9.0 build 090428
 */
function ubb2html(sUBB)
{
	var i,sHtml=sUBB;
	sHtml=sHtml.replace(/</g, '&lt;');
	sHtml=sHtml.replace(/>/g, '&gt;');
	sHtml=sHtml.replace(/\r?\n/g,"<br />");
	sHtml=sHtml.replace(/\[(\/?)(b|u|i)\]/ig,'<$1$2>');
	sHtml=sHtml.replace(/\[color\s*=\s*([^\]]+?)\]([\s\S]*?)\[\/color\]/ig,'<font color="$1">$2</font>');
	sHtml=sHtml.replace(/\[size\s*=\s*(\d+?)\]([\s\S]*?)\[\/size\]/ig,'<font size="$1">$2</font>');
	sHtml=sHtml.replace(/\[font\s*=\s*([^\]]+?)\]([\s\S]*?)\[\/font\]/ig,'<font face="$1">$2</font>');
	sHtml=sHtml.replace(/\[sup\]([\s\S]*?)\[\/sup\]/ig,'<sup>$1</sup>');
	sHtml=sHtml.replace(/\[sub\]([\s\S]*?)\[\/sub\]/ig,'<sub>$1</sub>');
	for(i=0;i<3;i++)sHtml=sHtml.replace(/\[align\s*=\s*([^\]]+?)\](((?!\[align(?:\s+[^\]]+)?\])[\s\S])*?)\[\/align\]/ig,'<p align="$1">$2</p>');
	sHtml=sHtml.replace(/\[img\]\s*([\s\S]+?)\s*\[\/img\]/ig,'<img src="$1" />');
	sHtml=sHtml.replace(/\[img\s*=\s*(\d+),(\d+)\s*\]\s*([\s\S]+?)\s*\[\/img\]/ig,'<img src="$3" width="$1" height="$2" />');
	sHtml=sHtml.replace(/\[url\]\s*([\s\S]+?)\s*\[\/url\]/ig,'<a href="$1">$1</a>');
	sHtml=sHtml.replace(/\[url\s*=\s*([^\]\s]+?)\s*\]\s*([\s\S]+?)\s*\[\/url\]/ig,'<a href="$1">$2</a>');
	sHtml=sHtml.replace(/\[email\]\s*([\s\S]+?)\s*\[\/email\]/ig,'<a href="mailto:$1">$1</a>');
	sHtml=sHtml.replace(/\[email\s*=\s*([^\]\s]+?)\s*\]\s*([\s\S]+?)\s*\[\/email\]/ig,'<a href="mailto:$1">$2</a>');
	sHtml=sHtml.replace(/\[quote\]([\s\S]*?)\[\/quote\]/ig,'<blockquote>$1</blockquote>');
	sHtml=sHtml.replace(/\[code\]([\s\S]*?)\[\/code\]/ig,'<code>$1</code>');
	sHtml=sHtml.replace(/\[flash\s*(?:=\s*(\d+)\s*,\s*(\d+)\s*)?\]([\s\S]+?)\[\/flash\]/ig,function(all,w,h,url){
		if(!w)w=550;if(!h)h=400;
		return '<embed type="application/x-shockwave-flash" src="'+url+'" wmode="opaque" quality="high" bgcolor="#ffffff" menu="false" play="true" loop="true" width="'+w+'" height="'+h+'"/>';
	});
	sHtml=sHtml.replace(/\[media\s*(?:=\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+)\s*)?)?\]([\s\S]+?)\[\/media\]/ig,function(all,w,h,play,url){
		if(!w)w=550;if(!h)h=400;
		return '<embed type="application/x-mplayer2" src="'+url+'" enablecontextmenu="false" autostart="'+(play=='1'?'true':'false')+'" width="'+w+'" height="'+h+'"/>';
	});
	
	sHtml=sHtml.replace(/\[\*\]([^\[]+)/ig,'<li>$1</li>');
	sHtml=sHtml.replace(/\[list(?:\s*=\s*([^\]]+)\s*)?\]/ig,function(all,type){
		var str='<ul';
		if(type)str+=' type="'+type+'"';
		return str+'>';
	});
	sHtml=sHtml.replace(/\[\/list\]/ig,'</ul>');
	return sHtml;
}
function html2ubb(sHtml)
{
	var i,mapSize={'xx-small':1,'8pt':1,'x-small':2,'10pt':2,'small':3,'12pt':3,'medium':4,'14pt':4,'large':5,'18pt':5,'x-large':6,'24pt':6,'xx-large':7,'36pt':7};
	var sUBB=sHtml;
	sUBB=sUBB.replace(/\r?\n/g,"");
	sUBB=sUBB.replace(/<(\/?)(b|u|i)(\s+[^>]+)?>/ig,'[$1$2]');
	sUBB=sUBB.replace(/<(\/?)strong(\s+[^>]+)?>/ig,'[$1b]');
	sUBB=sUBB.replace(/<(\/?)em(\s+[^>]+)?>/ig,'[$1i]');
	sUBB=sUBB.replace(/<(\/?)(sup|sub)(\s+[^>]+)?>/ig,'[$1$2]');
	for(i=0;i<3;i++)sUBB=sUBB.replace(/<(span)(?:\s+[^>]+)? style="((?:[^"]*?;)*\s*(?:font-family|font-size|color)\s*:[^"]*)"(?: [^>]+)?>(((?!<\1(\s+[^>]+)?>)[\s\S]|<\1(\s+[^>]+)?>((?!<\1(\s+[^>]+)?>)[\s\S]|<\1(\s+[^>]+)?>((?!<\1(\s+[^>]+)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,function(all,tag,style,content){
		var face=style.match(/(?:^|;)\s*font-family\s*:\s*([^;]+)/i),size=style.match(/(?:^|;)\s*font-size\s*:\s*([^;]+)/i),color=style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i),str=content;
		if(face)str='[font='+face[1]+']'+str+'[/font]';
		if(size)
		{
			size=mapSize[size[1].toLowerCase()];
			if(size)str='[size='+size+']'+str+'[/size]';
		}
		if(color)str='[color='+color[1]+']'+str+'[/color]';
		return str;
	});
	for(i=0;i<3;i++)sUBB=sUBB.replace(/<(div|p)(?:\s+[^>]+?)?\s+align="(left|center|right)"[^>]*>(((?!<\1(\s+[^>]+)?>)[\s\S])+?)<\/\1>/ig,'[align=$2]$3[/align]');
	sUBB=sUBB.replace(/<a(?:\s+[^>]+)?\s+href="\s*([^"]+?)\s*"[^>]*>([\s\S]+?)<\/a>/ig,function(all,url,text){
		var tag='url',str;
		if(url.match(/^mailto:/i))
		{
			tag='email';
			url=url.replace(/mailto:(.+?)/i,'$1');
		}
		str='['+tag;
		if(url!=text)str+='='+url;
		return str+']'+text+'[/'+tag+']';
	});
	sUBB=sUBB.replace(/<img(\s+[^>]+?)\/?>/ig,function(all,attr){
		var url=attr.match(/\s+src="([^"]+?)"/i),w=attr.match(/\s+width="(\d+)"/i),h=attr.match(/\s+height="(\d+)"/i),str='[img';
		if(w&&h)str+='='+w[1]+','+h[1];
		str+=']'+url[1];
		return str+'[/img]';
	});
	sUBB=sUBB.replace(/<blockquote(?: [^>]+)?>([\s\S]+?)<\/blockquote>/ig,'[quote]$1[/quote]');
	sUBB=sUBB.replace(/<code(?: [^>]+)?>([\s\S]+?)<\/code>/ig,'[code]$1[/code]');
	sUBB=sUBB.replace(/<embed((?:\s+[^>]+)?(?:\s+type="application\/x-shockwave-flash"|\s+classid="clsid:d27cdb6e-ae6d-11cf-96b8-4445535400000")[^>]*?)\/>/ig,function(all,attr){
		var url=attr.match(/\s+src="\s*([^"]+)\s*"/i),w=attr.match(/\s+width="\s*([^"]+)\s*"/i),h=attr.match(/\s+height="\s*([^"]+)\s*"/i),str='[flash';
		if(w&&h)str+='='+w[1]+','+h[1];
		str+=']'+url[1];
		return str+'[/flash]';
	});
	sUBB=sUBB.replace(/<embed((?:\s+[^>]+)?(?:\s+type="application\/x-mplayer2"|\s+classid="clsid:6bf52a52-394a-11d3-b153-00c04f79faa6")[^>]*?)\/>/ig,function(all,attr){
		var url=attr.match(/\s+src="\s*([^"]+)\s*"/i),w=attr.match(/\s+width="\s*([^"]+)\s*"/i),h=attr.match(/\s+height="\s*([^"]+)\s*"/i),p=attr.match(/\s+autostart="\s*([^"]+)\s*"/i),str='[media',auto='0';
		if(p)if(p[1]=='true')auto='1';
		if(w&&h)str+='='+w[1]+','+h[1]+','+auto;
		str+=']'+url[1];
		return str+'[/media]';
	});
	sUBB=sUBB.replace(/<ul(?:\s+[^>]+)?\s+type="([^"]+)"[^>]*>/ig,function(all,type,content){return '[list'+(type?'='+type:'')+']';});
	sUBB=sUBB.replace(/<ol(\s+[^>]+)?>/ig,'[list=1]');
	sUBB=sUBB.replace(/<li(\s+[^>]+)?>/ig,'[*]');
	sUBB=sUBB.replace(/<\/li>/ig,'');
	sUBB=sUBB.replace(/<\/(ul|ol)>/ig,'[/list]');
	
	sUBB=sUBB.replace(/<(p)(?:\s+[^>]+)?>(((?!<\1(\s+[^>]+)?>)[\s\S]|<\1(\s+[^>]+)?>((?!<\1(\s+[^>]+)?>)[\s\S]|<\1(\s+[^>]+)?>((?!<\1(\s+[^>]+)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,"\r\n\r\n$2\r\n\r\n");
	sUBB=sUBB.replace(/<(div)(?:\s+[^>]+)?>(((?!<\1(\s+[^>]+)?>)[\s\S]|<\1(\s+[^>]+)?>((?!<\1(\s+[^>]+)?>)[\s\S]|<\1(\s+[^>]+)?>((?!<\1(\s+[^>]+)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,"\r\n$2\r\n");
	sUBB=sUBB.replace(/<br\s*?\/?>/ig,"\r\n");
	sUBB=sUBB.replace(/<[^<>]+?>/g,'');//删除所有HTML标签
	
	sUBB=sUBB.replace(/(\s*?\r?\n){3,}/g,"\r\n\r\n");//限制最多2次换行
	sUBB=sUBB.replace(/^\s+/g,'');//清除开头换行
	sUBB=sUBB.replace(/\s+$/g,'');//清除结尾换行
	return sUBB;
}