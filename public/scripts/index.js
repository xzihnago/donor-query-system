var m=(n,e,t)=>new Promise((r,i)=>{var f=a=>{try{s(t.next(a));}catch(p){i(p);}},c=a=>{try{s(t.throw(a));}catch(p){i(p);}},s=a=>a.done?r(a.value):Promise.resolve(a.value).then(f,c);s((t=t.apply(n,e)).next());});var o=n=>{let e=document.getElementById(n);if(!e)throw new Error(`Element with id "${n}" not found`);return e},d=(n,e)=>{let t=o("modal-title"),r=o("modal-content");t.innerText=n,r.innerHTML=e,document.getElementsByClassName("modal-backdrop fade show").length||(new bootstrap.Modal("#modal").show(),setTimeout(()=>{o("modal-button").focus();},200));},u={success:n=>{d("\u6210\u529F",n.data.data);},failed:n=>e=>{if(axios.isAxiosError(e)&&e.response){let t=n==null?void 0:n[e.response.status];t?t instanceof Function?d("\u932F\u8AA4",t(e.response.data)):d("\u932F\u8AA4",t):e.response.status===401&&(alert("\u767B\u5165\u903E\u6642\uFF0C\u8ACB\u91CD\u65B0\u767B\u5165"),window.location.replace("/"));}else d("\u932F\u8AA4",`\u672A\u77E5\u7684\u932F\u8AA4\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66
\u82E5\u554F\u984C\u6301\u7E8C\u767C\u751F\uFF0C\u8ACB\u806F\u7D61\u7BA1\u7406\u54E1`);}};var H;(H=document.getElementById("form-login"))==null||H.addEventListener("submit",n=>{n.preventDefault();let e=o("input-username"),t=o("input-password");axios.post("/api/user/login",{username:e.value,password:t.value}).then(()=>{window.location.replace("/search");}).catch(u.failed({401:"\u7121\u6548\u7684\u4F7F\u7528\u8005\u540D\u7A31\u6216\u5BC6\u78BC"}));});var $;($=document.getElementById("button-logout"))==null||$.addEventListener("click",()=>{axios.get("/api/user/logout").catch().finally(()=>{window.location.replace("/");});});var D;(D=document.getElementById("form-search"))==null||D.addEventListener("submit",n=>{n.preventDefault();let e=o("input-search"),t=o("search-result");axios.get(`/api/donor-record/search/${e.value}`).then(r=>{t.value=r.data.data.toFixed();}).catch(u.failed({404:`\u300C${e.value}\u300D\u4E0D\u5728\u8CC7\u6599\u5EAB\u4E2D`}));});var M;(M=document.getElementById("form-superior"))==null||M.addEventListener("submit",n=>{n.preventDefault();let e=o("input-superior"),t=o("input-inferior"),r=o("button-superior");e.disabled?(e.disabled=false,t.disabled=true,r.className="btn btn-warning",r.innerText="\u78BA\u8A8D"):(e.disabled=true,t.disabled=false,r.className="btn btn-danger",r.innerText="\u8B8A\u66F4",x(e.value).catch(u.failed({404:i=>(r.click(),`\u300C${i.error.message}\u300D\u4E0D\u5728\u8CC7\u6599\u5EAB\u4E2D`)})));});var X;(X=document.getElementById("form-inferior"))==null||X.addEventListener("submit",n=>{n.preventDefault();let e=o("input-superior"),t=o("input-inferior");if(t.value===e.value){d("\u932F\u8AA4","\u7737\u5C6C\u4E0D\u53EF\u8207\u529F\u5FB7\u4E3B\u76F8\u540C");return}switch(n.submitter.name){case "update":axios.post("/api/donor-relations",{superior:e.value,inferior:t.value}).then(()=>x(e.value)).catch(u.failed({404:i=>`\u300C${i.error.message}\u300D\u4E0D\u5728\u8CC7\u6599\u5EAB\u4E2D`}));break;case "delete":axios.delete(`/api/donor-relations/${t.value}`).then(()=>x(e.value)).catch(u.failed({404:i=>`\u300C${i.error.message}\u300D\u4E0D\u5728\u8CC7\u6599\u5EAB\u4E2D`}));break}});var x=n=>m(void 0,null,function*(){return axios.get(`/api/donor-relations/${n}`).then(e=>m(void 0,null,function*(){let[t,...r]=e.data.data,i=["graph TD",`${t[0].replace(/\s/g,"")}(${t[0]})`,...r.map(s=>`${s[0].replace(/\s/g,"")}(${s[0]}) --> ${s[1].replace(/\s/g,"")}(${s[1]})`)],{svg:f}=yield mermaid.render("graphDiv",i.join(`
`));o("mermaid").innerHTML=f;let c=(r.length?r:[[t[0],""]]).map((s,a)=>[a+1,...s]);o("table").innerHTML=`
        <thead>
          <tr>
            <th>#</th>
            <th>\u529F\u5FB7\u4E3B</th>
            <th>\u7737\u5C6C</th>
          </tr>
        </thead>
        `+XLSX.utils.sheet_to_html(XLSX.utils.aoa_to_sheet(c));}))});var N;(N=document.getElementById("form-upload"))==null||N.addEventListener("submit",n=>m(void 0,null,function*(){var c;n.preventDefault();let e=o("input-file"),t=o("button-upload");t.disabled=true;let r=Array.from((c=e.files)!=null?c:[]).map(s=>[s.name,s.arrayBuffer()]).map(p=>m(void 0,[p],function*([s,a]){var A;let v=XLSX.read(yield a),g=v.Sheets[v.SheetNames[0]],h=XLSX.utils.decode_range((A=g["!ref"])!=null?A:""),P=Array.from({length:h.e.c-h.s.c+1},(l,I)=>g[XLSX.utils.encode_cell({r:h.s.r,c:h.s.c+I})]).map(l=>l==null?void 0:l.v),w=["\u4F9B\u990A\u8005","\u91D1\u984D"].filter(l=>!P.includes(l));if(w.length>0)return {type:"INVALID_HEADER",file:s,error:w};let E=[],y=XLSX.utils.sheet_to_json(g).map(l=>[l.\u4F9B\u990A\u8005?String(l.\u4F9B\u990A\u8005).trim():"",l.\u91D1\u984D?Number(l.\u91D1\u984D):NaN]).filter((l,I)=>{let b=["\u4F9B\u990A\u8005","\u91D1\u984D"].filter((S,T)=>[L=>L.length===0,L=>isNaN(L)][T](l[T]));return b.length===1&&E.push({line:I+2,missing:b}),b.length===0});return E.length>0?{type:"INVALID_DATA",file:s,error:E}:{type:"PENDING",file:s,count:y.length,data:y}})),i=yield Promise.all(r),f=i.filter(s=>s.type==="PENDING").map(s=>s.data).flat();axios.post("/api/donor-record/upload",f).then(()=>{let s=i.map(a=>{switch(a.type){case "PENDING":return `\u6210\u529F\uFF08${a.file}\uFF09
\u3000\u532F\u5165 ${a.count.toFixed()} \u7B46\u7D00\u9304`;case "INVALID_HEADER":return `\u5931\u6557\uFF08${a.file}\uFF09
\u3000\u7F3A\u5C11\u6A19\u982D\u300C${a.error.join("\u3001")}\u300D`;case "INVALID_DATA":return `\u5931\u6557\uFF08${a.file}\uFF09
${a.error.map(p=>`\u3000\u7F3A\u5C11\u6B04\u4F4D\uFF1A\u7B2C ${p.line.toFixed()} \u5217\u300C${p.missing.join("\u3001")}\u300D`).join(`
`)}`}});d("\u4E0A\u50B3\u7D50\u679C",s.join(`
`));}).catch(u.failed()).finally(()=>{t.disabled=false;});}));var R;(R=document.getElementById("button-export"))==null||R.addEventListener("click",()=>{axios.get("/api/donor-record/export").then(n=>{let e=XLSX.utils.book_new(),t=XLSX.utils.aoa_to_sheet([["\u4F9B\u990A\u8005","\u91D1\u984D"],...n.data.data]);XLSX.utils.book_append_sheet(e,t,"\u6350\u6B3E\u7D71\u8A08"),XLSX.writeFile(e,`${Date.now().toFixed()}.xlsx`);}).catch(u.failed());});var _;(_=document.getElementById("button-delete"))==null||_.addEventListener("click",()=>{axios.delete("/api/donor").then(n=>setTimeout(()=>{d("\u6210\u529F",["\u6210\u529F\u522A\u9664\u8CC7\u6599\uFF1A",`\u3000\u6350\u6B3E\u4EBA ${n.data.data.donors.toFixed()} \u4EBA`,`\u3000\u6350\u6B3E\u7D00\u9304 ${n.data.data.records.toFixed()} \u7B46`].join(`
`));},200)).catch(u.failed());});