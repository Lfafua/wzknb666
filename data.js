(function(root){
  'use strict';
  const countries = [
    {id:0,name:'阿尔登联邦',short:'阿尔登',en:'ARDEN FEDERATION',color:'#639d9a',dark:'#315d60',symbol:'✦',capital:'苍石城',trait:'工业之心',bonus:'建设效率 +25%，初始军工最多',description:'北境的工厂昼夜不息。以工业积累支撑战线，是最稳健的大陆开局。',playable:true,civ:6,mil:7,units:8,stability:78,style:'均衡发展',attack:1,construction:1.25,oil:1},
    {id:1,name:'维斯塔共和国',short:'维斯塔',en:'VESTA REPUBLIC',color:'#c3a16b',dark:'#756040',symbol:'◇',capital:'江界市',trait:'丰饶腹地',bonus:'燃油产出 +50%，初始库存充足',description:'宽阔平原与丰富油田孕育了繁荣。尽快把资源优势转化成能守住边境的军队。',playable:true,civ:5,mil:5,units:6,stability:82,style:'资源经营',attack:1,construction:1,oil:1.5},
    {id:2,name:'凛峰王国',short:'凛峰',en:'RIME KINGDOM',color:'#8d99b6',dark:'#4e5977',symbol:'♜',capital:'霜冠城',trait:'山地卫士',bonus:'山地防御 +25%，步兵训练加快',description:'群山是天然的城墙。稳住防线、争取盟友，再选择最脆弱的方向突围。',playable:true,civ:4,mil:4,units:7,stability:88,style:'防守反击',attack:1,construction:1,oil:1},
    {id:3,name:'赤原公社',short:'赤原',en:'REDLAND COMMUNE',color:'#ba7970',dark:'#774a45',symbol:'▲',capital:'红炉城',trait:'全民动员',bonus:'步兵训练时间 −20%',description:'南部的工业城镇组成了坚韧的共同体。',civ:5,mil:5,units:7,stability:75,style:'广泛动员',attack:1,construction:1,oil:1},
    {id:4,name:'索兰帝国',short:'索兰',en:'SOLAR EMPIRE',color:'#aa9564',dark:'#6d603c',symbol:'☀',capital:'日冕城',trait:'机动作战',bonus:'装甲与摩托化攻击 +15%',description:'大陆中部的新兴强权，渴望打通通往北方的道路。',civ:5,mil:6,units:8,stability:73,style:'装甲突破',attack:1.15,construction:1,oil:1},
    {id:5,name:'翡翠协约',short:'翡翠',en:'JADE CONCORD',color:'#82a17b',dark:'#4d6948',symbol:'❖',capital:'青港城',trait:'商路枢纽',bonus:'每周政治点 +2',description:'森林与港城之间的松散协约，擅长以外交换取发展。',civ:4,mil:5,units:6,stability:80,style:'灵活外交',attack:1,construction:1,oil:1}
  ];
  const terrain = {
    plains:{name:'平原',defense:1,move:2,symbol:'·'},forest:{name:'森林',defense:1.25,move:3,symbol:'♠'},mountain:{name:'山地',defense:1.55,move:4,symbol:'△'},city:{name:'城市',defense:1.4,move:3,symbol:'▦'}
  };
  const unitTypes = {
    infantry:{name:'步兵师',short:'步兵',icon:'×',attack:11,defense:13,days:28,fuel:0,cost:{rifles:90,trucks:0,tanks:0}},
    motorized:{name:'摩托化师',short:'摩托化',icon:'⊗',attack:16,defense:11,days:35,fuel:3,cost:{rifles:65,trucks:35,tanks:0}},
    armor:{name:'装甲师',short:'装甲',icon:'▱',attack:25,defense:17,days:49,fuel:6,cost:{rifles:40,trucks:20,tanks:40}}
  };
  const policies = [
    {id:'e1',branch:'经济',name:'国家建设署',days:35,pre:null,desc:'新增 1 座民用工厂',effect:'civ',amount:1},
    {id:'e2',branch:'经济',name:'钢铁动脉',days:49,pre:'e1',desc:'钢材产出 +30%，首都基础设施 +1',effect:'steel',amount:.3},
    {id:'e3',branch:'经济',name:'战时工业',days:56,pre:'e2',desc:'新增 2 座军用工厂',effect:'mil',amount:2},
    {id:'e4',branch:'经济',name:'大规模生产',days:70,pre:'e3',desc:'全部装备产出 +25%',effect:'production',amount:.25},
    {id:'m1',branch:'军事',name:'军队现代化',days:35,pre:null,desc:'获得 180 步兵装备、30 车辆',effect:'equipment',amount:180},
    {id:'m2',branch:'军事',name:'职业军官团',days:49,pre:'m1',desc:'部队攻击与防御 +12%',effect:'combat',amount:.12},
    {id:'m3',branch:'军事',name:'机动先锋',days:56,pre:'m2',desc:'获得 80 装甲装备、60 车辆',effect:'armor',amount:80},
    {id:'m4',branch:'军事',name:'联合参谋部',days:70,pre:'m3',desc:'训练速度 +25%，补给范围 +2',effect:'training',amount:.25},
    {id:'d1',branch:'外交',name:'睦邻使团',days:35,pre:null,desc:'与所有中立国家关系 +20',effect:'relations',amount:20},
    {id:'d2',branch:'外交',name:'共同防御倡议',days:49,pre:'d1',desc:'开启结盟，获得 40 政治点',effect:'alliance',amount:40},
    {id:'d3',branch:'外交',name:'大陆安全宣言',days:56,pre:'d2',desc:'获得对所有非盟国的战争目标',effect:'goals',amount:1},
    {id:'d4',branch:'外交',name:'国民团结',days:70,pre:'d3',desc:'稳定度 +20，每周政治点 +3',effect:'unity',amount:20}
  ];
  const outline = [[118,166],[188,121],[273,136],[328,78],[427,91],[492,65],[567,105],[640,87],[701,121],[805,80],[868,111],[893,160],[1008,164],[1030,225],[1090,267],[1056,329],[1113,396],[1074,448],[1101,516],[1034,560],[996,621],[919,618],[879,683],[802,667],[755,703],[684,658],[602,692],[540,643],[461,680],[406,629],[312,643],[279,594],[199,580],[194,524],[121,493],[145,431],[95,379],[117,324],[81,270],[131,234]];
  function seeded(seed){let s=seed>>>0;return ()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296;};}
  function inside(x,y,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
  function cut(poly,a,b,c){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],dp=a*p[0]+b*p[1]-c,dq=a*q[0]+b*q[1]-c;if(dp<=1e-7)out.push(p);if((dp<0)!=(dq<0)){const t=dp/(dp-dq);out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);}}return out;}
  function makeMap(){
    const rng=seeded(832761),centers=[[292,245],[595,242],[873,244],[297,493],[599,501],[893,500]],pts=centers.map(x=>x.slice());
    while(pts.length<72){let best=null,dist=-1;for(let k=0;k<70;k++){const p=[90+rng()*1020,75+rng()*615];if(!inside(...p,outline))continue;const d=Math.min(...pts.map(q=>(p[0]-q[0])**2+(p[1]-q[1])**2));if(d>dist){dist=d;best=p;}}if(best)pts.push(best);}
    const prefixes=['苍','银','松','河','风','白','北','石','落','远','云','古','铁','星','岚','暮','东','长'];
    const suffixes=['岭','原','湾','谷','港','林','川','丘','关','镇','堡','湖'];
    const map=pts.map((p,i)=>{
      let poly=outline.map(v=>v.slice());pts.forEach((q,j)=>{if(i!==j)poly=cut(poly,q[0]-p[0],q[1]-p[1],(q[0]**2+q[1]**2-p[0]**2-p[1]**2)/2);});
      const owner=centers.map(c=>(c[0]-p[0])**2+(c[1]-p[1])**2).reduce((b,d,k,a)=>d<a[b]?k:b,0);
      let land=rng()<.27?'forest':'plains';if((owner===2&&rng()<.68)||(p[0]<270&&rng()<.4))land='mountain';if(i<6||i%13===0)land='city';
      return {id:i,name:i<6?countries[i].capital:prefixes[(i*7)%prefixes.length]+suffixes[Math.floor(i/6)%suffixes.length],x:p[0],y:p[1],poly,owner,controller:owner,terrain:land,neighbors:[],capital:i<6,hub:i<6||i===23||i===48,vp:i<6?12:land==='city'?5:1,civ:0,mil:0,steel:land==='mountain'?4:1+Math.floor(rng()*3),oil:owner===1?3:Math.floor(rng()*3),infra:i<6?3:1,fort:0};
    });
    map.forEach((p,i)=>map.forEach((q,j)=>{if(i>=j)return;const a=q.x-p.x,b=q.y-p.y,c=(q.x**2+q.y**2-p.x**2-p.y**2)/2;const edge=p.poly.filter(v=>Math.abs(a*v[0]+b*v[1]-c)<.01);if(edge.length>=2&&Math.hypot(edge[0][0]-edge[1][0],edge[0][1]-edge[1][1])>.1){p.neighbors.push(j);q.neighbors.push(i);}}));
    countries.forEach(c=>{const regions=map.filter(p=>p.owner===c.id);for(let i=0;i<c.civ;i++)regions[i%regions.length].civ++;for(let i=0;i<c.mil;i++)regions[(i+2)%regions.length].mil++;});
    return map;
  }
  const D={countries,terrain,unitTypes,policies,outline,makeMap,seeded,campaignDays:1080,version:1};
  if(typeof module!=='undefined'&&module.exports)module.exports=D;else root.WarData=D;
})(typeof globalThis!=='undefined'?globalThis:this);
