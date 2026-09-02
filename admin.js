
const STORE_KEY='appletech_store';
const SESSION='appletech_admin_session';
function getStore(){
 let s=JSON.parse(localStorage.getItem(STORE_KEY)||'{}');
 s.catalog=s.catalog||[];
 s.contact=s.contact||{};
 return s;
}
let store=getStore(),current='dashboard';
function save(){localStorage.setItem(STORE_KEY,JSON.stringify(store));render();}
if(localStorage.getItem(SESSION)){loginView.hidden=true;panelView.hidden=false;}
function login(){if(u.value==='admin'&&p.value==='admin123'){localStorage.setItem(SESSION,'1');loginView.hidden=true;panelView.hidden=false;render();}else alert('Credenciales inválidas');}
function logout(){localStorage.removeItem(SESSION);location.reload();}
function showTab(t){current=t;render();}
function render(){
 const c=store.catalog;
 if(current==='dashboard'){
 tab.innerHTML=`<div class="result-card"><h2>Dashboard</h2>
 <p>Total: ${c.length}</p><p>Disponibles: ${c.filter(x=>x.estado==='disponible').length}</p>
 <p>Sin stock: ${c.filter(x=>x.estado==='sin_stock').length}</p>
 <p>Ocultos: ${c.filter(x=>x.estado==='oculto').length}</p></div>`;
 }
 if(current==='catalog'){
 tab.innerHTML=`<div class="result-card"><h2>Catálogo Plan Canje</h2>
 <input id="search" class="select-input" placeholder="Buscar" oninput="render()">
 <button class="btn btn-primary" onclick="addProduct()">Nuevo producto</button>
 ${c.map((m,i)=>`<div style="margin:10px 0;padding:10px;border:1px solid #444">
 <input value="${m.modelo||''}" onchange="store.catalog[${i}].modelo=this.value;save()">
 <input value="${m.capacidad||''}" onchange="store.catalog[${i}].capacidad=this.value;save()">
 <input value="${m.precio||0}" onchange="store.catalog[${i}].precio=+this.value;save()">
 <input value="${m.stock||0}" onchange="store.catalog[${i}].stock=+this.value;save()">
 <select onchange="store.catalog[${i}].estado=this.value;save()">
 ${['disponible','sin_stock','oculto','despublicado'].map(s=>`<option ${m.estado===s?'selected':''}>${s}</option>`).join('')}
 </select>
 <button onclick="dup(${i})">Duplicar</button><button onclick="delp(${i})">Eliminar</button></div>`).join('')}</div>`;
 }
 if(current==='contact'){
 let ct=store.contact;
 tab.innerHTML=`<div class="result-card"><h2>Contacto</h2>
 <input id="tel" class="select-input" placeholder="Teléfono" value="${ct.telefono||''}"><br><br>
 <input id="wa" class="select-input" placeholder="WhatsApp" value="${ct.whatsapp||''}"><br><br>
 <input id="ig" class="select-input" placeholder="Instagram" value="${ct.instagram||''}"><br><br>
 <input id="dir" class="select-input" placeholder="Dirección" value="${ct.direccion||''}"><br><br>
 <button class="btn btn-primary" onclick="saveContact()">Guardar</button></div>`;
 }
}
function addProduct(){store.catalog.push({id:Date.now(),modelo:'iPhone',capacidad:'128GB',precio:0,stock:0,estado:'despublicado'});save();}
function dup(i){store.catalog.push({...store.catalog[i],id:Date.now()});save();}
function delp(i){if(confirm('Eliminar?')){store.catalog.splice(i,1);save();}}
function saveContact(){store.contact={telefono:tel.value,whatsapp:wa.value,instagram:ig.value,direccion:dir.value};save();}
function exportData(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(store,null,2)]));a.download='backup.json';a.click();}
render();

// damage config
localStorage.setItem("appletech_damages",localStorage.getItem("appletech_damages")||JSON.stringify([]));


const DEFAULT_MODELS=[
'iPhone 11','iPhone 11 Pro','iPhone 11 Pro Max','iPhone 12','iPhone 12 Pro','iPhone 12 Pro Max',
'iPhone 13','iPhone 13 Pro','iPhone 13 Pro Max','iPhone 14','iPhone 14 Pro','iPhone 14 Pro Max',
'iPhone 15','iPhone 15 Pro','iPhone 15 Pro Max','iPhone 16','iPhone 16 Pro','iPhone 16 Pro Max',
'iPhone 17','iPhone 17 Pro','iPhone 17 Pro Max'
];

if(store.catalog.length===0){
 store.catalog=DEFAULT_MODELS.map((m,i)=>({
  id:i+1,modelo:m,precioUSD:0,stock:0,estado:'oculto'
 }));
 save();
}

const _render=render;
render=function(){
 _render();
 if(current==='damages'){
   const d=JSON.parse(localStorage.getItem('appletech_damages')||'[]');
   tab.innerHTML=`<div class="result-card"><h2>Desperfectos</h2>
   <button onclick="addDamage()">Agregar</button>
   ${d.map((x,i)=>`<div><input value="${x.nombre||''}" onchange="updDamage(${i},this.value)">
   <button onclick="delDamage(${i})">Eliminar</button></div>`).join('')}</div>`;
 }
}
function addDamage(){
 let d=JSON.parse(localStorage.getItem('appletech_damages')||'[]');
 d.push({nombre:'Nuevo desperfecto',descuentoUSD:0,activo:true});
 localStorage.setItem('appletech_damages',JSON.stringify(d));render();
}
function updDamage(i,v){let d=JSON.parse(localStorage.getItem('appletech_damages')||'[]');d[i].nombre=v;localStorage.setItem('appletech_damages',JSON.stringify(d));}
function delDamage(i){let d=JSON.parse(localStorage.getItem('appletech_damages')||'[]');d.splice(i,1);localStorage.setItem('appletech_damages',JSON.stringify(d));render();}
render();

localStorage.setItem('appletech_battery_rules',localStorage.getItem('appletech_battery_rules')||JSON.stringify([
{min:100,max:100,descuentoUSD:0},
{min:95,max:99,descuentoUSD:10}
]));
const __r=render;
render=function(){__r();
 if(current==='battery'){
 let r=JSON.parse(localStorage.getItem('appletech_battery_rules'));
 tab.innerHTML='<div class="result-card"><h2>Reglas batería USD</h2><button onclick="addRule()">Agregar</button>'+
 r.map((x,i)=>`<div><input value="${x.min}" onchange="updRule(${i},'min',this.value)"><input value="${x.max}" onchange="updRule(${i},'max',this.value)"><input value="${x.descuentoUSD}" onchange="updRule(${i},'descuentoUSD',this.value)"> USD</div>`).join('')+'</div>';
 }
}
function addRule(){let r=JSON.parse(localStorage.getItem('appletech_battery_rules'));r.push({min:80,max:84,descuentoUSD:50});localStorage.setItem('appletech_battery_rules',JSON.stringify(r));render();}
function updRule(i,k,v){let r=JSON.parse(localStorage.getItem('appletech_battery_rules'));r[i][k]=Number(v);localStorage.setItem('appletech_battery_rules',JSON.stringify(r));}

localStorage.setItem('appletech_battery_rules',localStorage.getItem('appletech_battery_rules')||JSON.stringify([
{min:100,max:100,usd:0},{min:95,max:99,usd:10},{min:90,max:94,usd:20}
]));
const oldRender=render;
render=function(){
 oldRender();
 if(current==='battery'){
 let r=JSON.parse(localStorage.getItem('appletech_battery_rules')||'[]');
 tab.innerHTML='<div class="result-card"><h2>Reglas de batería</h2><button onclick="addBattery()">Agregar regla</button>'+r.map((x,i)=>`<div><input value="${x.min}" onchange="updBat(${i},'min',this.value)"><input value="${x.max}" onchange="updBat(${i},'max',this.value)"><input value="${x.usd}" onchange="updBat(${i},'usd',this.value)"><button onclick="delBat(${i})">Eliminar</button></div>`).join('')+'</div>';
 }
}
function addBattery(){let r=JSON.parse(localStorage.getItem('appletech_battery_rules')||'[]');r.push({min:80,max:89,usd:35});localStorage.setItem('appletech_battery_rules',JSON.stringify(r));render();}
function updBat(i,k,v){let r=JSON.parse(localStorage.getItem('appletech_battery_rules')||'[]');r[i][k]=Number(v);localStorage.setItem('appletech_battery_rules',JSON.stringify(r));}
function delBat(i){let r=JSON.parse(localStorage.getItem('appletech_battery_rules')||'[]');r.splice(i,1);localStorage.setItem('appletech_battery_rules',JSON.stringify(r));render();}
