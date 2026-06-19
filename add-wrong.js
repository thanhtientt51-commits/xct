const fs=require('fs');let h=fs.readFileSync('index.html','utf-8');

// 1. Add wrongList div inside the second side-card
h = h.replace(
  '错题本</h3><button class="btn btn-ghost" style="font-size:.68em;padding:4px 10px">📥 导出Word</button></div>\n  </div>',
  '错题本</h3><button class="btn btn-ghost" style="font-size:.68em;padding:4px 10px" onclick="exportWrong()">📥 导出Word</button></div><div id="wrongList" style="overflow-y:auto;flex:1"><div style="font-size:.7em;padding:20px;text-align:center;color:var(--sub)">暂无错题</div></div></div>'
);

// 2. Add 加入错题 button next to 换一题
h = h.replace(
  '<button class="btn btn-ghost">换一题</button>',
  '<button class="btn btn-ghost" onclick="addToWrong()">加入错题</button><button class="btn btn-ghost">换一题</button>'
);

// 3. Add wrongList variable
h = h.replace(
  'var cat="判断推理",q=null,sel=-1,ans=false;',
  'var cat="判断推理",q=null,sel=-1,ans=false;var wrongList=JSON.parse(localStorage.getItem("xct_wrong")||"[]");'
);

// 4. Auto-save wrong answers in submit function
h = h.replace(
  'document.getElementById("btnSub").textContent="错误";getAI()',
  'document.getElementById("btnSub").textContent="错误";addToWrong();getAI()'
);

// 5. Add functions before next()
var newFns = `function addToWrong(){if(!q)return;if(wrongList.some(function(w){return w.q===q.q})){alert("已在错题本中");return}wrongList.unshift({cat:cat,q:q.q,o:q.o,a:q.a,my:sel>=0?sel:-1});if(wrongList.length>50)wrongList=wrongList.slice(0,50);localStorage.setItem("xct_wrong",JSON.stringify(wrongList));renderWrong()}
function renderWrong(){var el=document.getElementById("wrongList");if(!el)return;if(!wrongList.length){el.innerHTML="<div style=font-size:.7em;padding:20px;text-align:center;color:var(--sub)>暂无错题</div>";return}el.innerHTML=wrongList.map(function(w,i){var l=["A","B","C","D"];return"<div class=wrong-item onclick=review("+i+")>"+w.q.substring(0,30)+"...<br><span style=font-size:.8em;color:var(--sub)>"+w.cat+"</span></div>"}).join("")}
function review(i){var w=wrongList[i];cat=w.cat;q={q:w.q,o:w.o,a:w.a};sel=w.my;ans=true;document.getElementById("qText").textContent=w.q;document.getElementById("qType").textContent=w.cat+" (回顾)";document.getElementById("btnSub").disabled=true;document.getElementById("btnSub").textContent=w.my>=0?"你的:"+["A","B","C","D"][w.my]+" 正确:"+["A","B","C","D"][w.a]:"已标记";var l=["A","B","C","D"];document.getElementById("opts").innerHTML=w.o.map(function(o,i){var cls=i===w.a?"correct":(i===w.my?"wrong":"");return"<div class=opt "+cls+" style=pointer-events:none><span class=letter>"+l[i]+"</span>"+o+"</div>"}).join("");document.getElementById("explainBox").innerHTML="<div style=display:flex;align-items:center;justify-content:center;height:100%;color:var(--sub)>回顾模式</div>"}
function exportWrong(){if(!wrongList.length){alert("暂无错题");return}var t="<html><head><meta charset=UTF-8><style>body{font-family:SimSun;font-size:14px;line-height:1.8;padding:20px}li{padding:8px 0}</style></head><body><h2>行测错题本</h2><ol>";wrongList.forEach(function(w,i){t+="<li><b>["+w.cat+"]</b> "+w.q+"<br>你的:<b style=color:red>"+(w.my>=0?["A","B","C","D"][w.my]:"未选")+"</b> 正确:<b style=color:green>"+["A","B","C","D"][w.a]+"</b></li>"});t+="</ol></body></html>";var b=new Blob([t],{type:"application/msword"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="行测错题本.doc";a.click()}
renderWrong();`;
h = h.replace('next();', newFns+'next();');

// Verify div balance
var open=(h.match(/<div/g)||[]).length,close=(h.match(/<\/div>/g)||[]).length;
console.log('div: <'+open+' />'+close, open===close?'OK':'MISMATCH');
fs.writeFileSync('index.html',h);
