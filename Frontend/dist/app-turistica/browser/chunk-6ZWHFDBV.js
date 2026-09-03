import{a as F}from"./chunk-VXXMJDZL.js";import{$a as b,Ba as I,C as g,Ca as R,Da as C,Ea as w,Fd as c,G as h,H as v,I as U,J as $,Jd as D,K as d,Ld as M,Md as x,Nd as u,O,Ub as B,W as y,Ya as T,_b as p,ac as N,ba as P,i as f,ib as j,ja as k,ka as S,na as E,o as _,oa as A,p as l,ta as m,v as n,y as a}from"./chunk-64E2PASB.js";var J=`
    .p-progressspinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }

    .p-progressspinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .p-progressspinner-spin {
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: p-progressspinner-rotate 2s linear infinite;
    }

    .p-progressspinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: dt('progressspinner.colorOne');
        animation:
            p-progressspinner-dash 1.5s ease-in-out infinite,
            p-progressspinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progressspinner-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes p-progressspinner-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progressspinner-color {
        100%,
        0% {
            stroke: dt('progressspinner.color.one');
        }
        40% {
            stroke: dt('progressspinner.color.two');
        }
        66% {
            stroke: dt('progressspinner.color.three');
        }
        80%,
        90% {
            stroke: dt('progressspinner.color.four');
        }
    }
`;var V={root:()=>["p-progressspinner"],spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},H=(()=>{class i extends D{name="progressspinner";style=J;classes=V;static \u0275fac=(()=>{let t;return function(s){return(t||(t=y(i)))(s||i)}})();static \u0275prov=h({token:i,factory:i.\u0275fac})}return i})();var G=new U("PROGRESSSPINNER_INSTANCE"),z=(()=>{class i extends x{$pcProgressSpinner=d(G,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=d(u,{self:!0});styleClass;strokeWidth="2";fill="none";animationDuration="2s";ariaLabel;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}_componentStyle=d(H);static \u0275fac=(()=>{let t;return function(s){return(t||(t=y(i)))(s||i)}})();static \u0275cmp=k({type:i,selectors:[["p-progressSpinner"],["p-progress-spinner"],["p-progressspinner"]],hostVars:5,hostBindings:function(r,s){r&2&&(m("aria-label",s.ariaLabel)("role","progressbar")("aria-busy",!0),b(s.cn(s.cx("root"),s.styleClass)))},inputs:{styleClass:"styleClass",strokeWidth:"strokeWidth",fill:"fill",animationDuration:"animationDuration",ariaLabel:"ariaLabel"},features:[j([H,{provide:G,useExisting:i},{provide:M,useExisting:i}]),A([u]),E],decls:2,vars:10,consts:[["viewBox","25 25 50 50",3,"pBind"],["cx","50","cy","50","r","20","stroke-miterlimit","10",3,"pBind"]],template:function(r,s){r&1&&(O(),R(0,"svg",0),w(1,"circle",1),C()),r&2&&(b(s.cx("spin")),T("animation-duration",s.animationDuration),I("pBind",s.ptm("spin")),P(),b(s.cx("circle")),I("pBind",s.ptm("circle")),m("fill",s.fill)("stroke-width",s.strokeWidth))},dependencies:[B,c,u],encapsulation:2,changeDetection:0})}return i})(),le=(()=>{class i{static \u0275fac=function(r){return new(r||i)};static \u0275mod=S({type:i});static \u0275inj=v({imports:[z,c,c]})}return i})();var L=class i{constructor(e){this.http=e}http;API_URI=F.API_URI;base_path=`${this.API_URI}/api/registro/`;base_path_post=`${this.API_URI}/api/registro/`;base=`${this.API_URI}/api/auth/reset/`;base_personas=`${this.API_URI}/persons/`;base_personas_user=`${this.API_URI}/persons/by-user/`;base_documentos=`${this.API_URI}/documents/`;base_usuario=`${this.API_URI}/api/user/`;base_editar_user=`${this.API_URI}/api/user/update/`;base_gender=`${this.API_URI}/genders/`;base_usuario_rol=`${this.API_URI}/roles/user_roles/create/`;base_tabla_maestra=`${this.API_URI}/tabla_maestra/tabla-maestra/`;base_tabla_categoria=`${this.API_URI}/categoria_tipo/categoria-tipo/`;base_roles=`${this.API_URI}/roles`;ObtenerUsuarios(){return this.http.get(`${this.base_personas}`)}handleError(e){let s={statusCode:e.status,error:e};return _(s.error)}getUser(){let e=localStorage.getItem("token"),t=localStorage.getItem("user");if(e!=null&&t!=null){let r=JSON.parse(t);return this.http.get(this.base_path,{headers:new p({"Content-Type":"application/json","x-token":e,user:`${parseInt(r.id)}`})}).pipe(a(0),n(this.handleError))}else return this.http.get(this.base_path).pipe(a(0),n(this.handleError))}getUserProfile(e){return this.http.get(`${this.API_URI}/listusers/${e}/`)}updateConsentimiento(e,t){let r={consentimiento:t};return this.http.patch(`${this.base_editar_user}${e}/`,r).pipe(a(0),n(this.handleError))}UsersInvestigatorStudentTeacherProyecto(e){let t=localStorage.getItem("token"),r=localStorage.getItem("user");if(t!=null&&r!=null){let s=JSON.parse(r),o={headers:new p({"Content-Type":"application/json","x-token":t,user:`${parseInt(s.id)}`})};return this.http.post(this.API_URI+"/api/UsersInvestigatorStudentTeacherProyecto/",e,o).pipe(a(0),n(this.handleError))}else return this.http.post(this.API_URI+"/api/UsersInvestigatorStudentTeacherProyecto/",e).pipe(a(0),n(this.handleError))}getUserteacherinvestigatorstudent2(e){let t=localStorage.getItem("token"),r=localStorage.getItem("user");if(t!=null&&r!=null){let s=JSON.parse(r),o={headers:new p({"Content-Type":"application/json","x-token":t,user:`${parseInt(s.id)}`})};return this.http.get(this.API_URI+"/api/userteacherinvestigatorstudent2/"+e,o).pipe(a(0),n(this.handleError))}else return this.http.get(this.API_URI+"/api/userteacherinvestigatorstudent/"+e).pipe(a(0),n(this.handleError))}getUserteacherinvestigatorstudent(){let e=localStorage.getItem("token"),t=localStorage.getItem("user");if(e!=null&&t!=null){let r=JSON.parse(t),s={headers:new p({"Content-Type":"application/json","x-token":e,user:`${parseInt(r.id)}`})};return this.http.get(this.API_URI+"/api/userteacherinvestigatorstudent/",s).pipe(a(0),n(this.handleError))}else return this.http.get(this.API_URI+"/api/userteacherinvestigatorstudent/").pipe(a(0),n(this.handleError))}userteacher(){let e=localStorage.getItem("token"),t=localStorage.getItem("user");if(e!=null&&t!=null){let r=JSON.parse(t),s={headers:new p({"Content-Type":"application/json","x-token":e,user:`${parseInt(r.id)}`})};return this.http.get(this.API_URI+"/api/userteacher",s).pipe(a(0),n(this.handleError))}else return this.http.get(this.API_URI+"/api/userteacher").pipe(a(0),n(this.handleError))}getUserIdentificacion(e){return this.http.get(this.base_path+"/cc/"+e).pipe(a(0),n(this.handleError))}getOneUser(e){let t=localStorage.getItem("user"),r=localStorage.getItem("token");if(r!=null&&t!=null){let s=JSON.parse(t),o={headers:new p({"Content-Type":"application/json","x-token":r,user:`${parseInt(s.id)}`})};return this.http.get(this.base_path+"/"+e,o).pipe(a(0),n(this.handleError))}else return this.http.get(this.base_path+"/"+e).pipe(a(0),n(this.handleError))}createUser(e){return this.http.post(this.base_path_post,e).pipe(g(t=>{}),n(this.handleError))}getUserDetailsByEmail(e){return this.http.get(this.base_usuario).pipe(l(t=>t&&Array.isArray(t.results)?t.results.find(r=>r.email===e):Array.isArray(t)?t.find(r=>r.email===e):(console.warn("Respuesta inesperada al buscar usuarios por email:",t),null)))}getlistusers(){return this.http.get(`${this.API_URI}/listusers/`)}getUsuariosPorRol(e){return this.http.get(`${this.base_roles}/${e}`)}actualzarContrase\u00F1a(e){let t=localStorage.getItem("token"),r=localStorage.getItem("user");if(t!=null&&r!=null){let s=JSON.parse(r),o={headers:new p({"Content-Type":"application/json","x-token":t,user:`${parseInt(s.id)}`})};return this.http.patch(this.base+"/",JSON.stringify(e),o).pipe(a(0),n(this.handleError))}else return this.http.patch(this.base+"/",JSON.stringify(e)).pipe(a(0),n(this.handleError))}updateUser(e){let t=localStorage.getItem("token"),r=localStorage.getItem("user");if(t!=null&&r!=null){let s=JSON.parse(r),o={headers:new p({"Content-Type":"application/json","x-token":t,user:`${parseInt(s.id)}`})};return this.http.patch(`${this.base_path}/${e.id}`,e,o).pipe(a(0),n(this.handleError))}else return this.http.patch(`${this.base_path}/${e.id}`,e).pipe(a(0),n(this.handleError))}actualzarAvatar(e){let t=localStorage.getItem("token"),r=localStorage.getItem("user");if(t!=null&&r!=null){let s=JSON.parse(r),o={headers:new p({"Content-Type":"application/json","x-token":t,user:`${parseInt(s.id)}`})};return this.http.patch(`${this.API_URI}/api/Avatar/${e.id}`,e,o).pipe(a(0),n(this.handleError))}else return this.http.patch(`${this.API_URI}/api/Avatar/${e.id}`,e).pipe(a(0),n(this.handleError))}eliminarUser(e){return this.http.delete(`${this.base_path}/${e}`).pipe(a(0),n(this.handleError))}createImagen(e,t){let r=new FormData;return r.append("UserId",e),r.append("file",t),this.http.post(this.API_URI+"/api/subirImagen",r).pipe(g(s=>{}),a(0),n(this.handleError))}users=[];getUsers(){return this.users}addUser(e){this.users.push(e)}CrearTipo(e){return this.http.post(this.base_tabla_maestra,e)}obtenerTipo(){return this.http.get(this.base_tabla_maestra)}editarTipo(e){let t=`${this.base_tabla_maestra}${e.id}/`;return this.http.put(t,e)}eliminarTipo(e){let t=`${this.base_tabla_maestra}${e}`;return this.http.delete(t)}CrearTipoCategoria(e){return this.http.post(this.base_tabla_categoria,e)}obtenerTipoCategoria(){return this.http.get(this.base_tabla_categoria)}editarTipoCategoria(e){let t=`${this.base_tabla_categoria}${e.id}/`;return this.http.put(t,e)}eliminarTipoCategoria(e){let t=`${this.base_tabla_categoria}${e}`;return this.http.delete(t)}getTablaMaestraPorCategoria(e){let t=`${this.base_tabla_maestra}categoria/${e}/`;return this.http.get(t).pipe(a(0),n(this.handleError))}getTablaMaestraByUrl(e){return this.http.get(e)}getGenderTypes(){return this.http.get(`${this.base_gender}`).pipe(l(e=>e))}getDocumentTypes(){return this.http.get(`${this.base_documentos}`).pipe(l(e=>e))}getUsuarios(){return this.http.get(`${this.base_personas}`)}editarUsuario(e){return e.id!==0?this.http.put(`${this.base_personas}${e.id}/`,e):this.http.post(this.base_personas,e)}crearPerson(e){return this.http.post(this.base_personas,e)}getPeopleByUserId(e){let t=`${this.base_personas}?user=${e}`;return this.http.get(t).pipe(n(r=>{throw console.error("Error in getPeopleByUserId:",r),r}),l(r=>{let s=r.results||r;return Array.isArray(s)?s.filter(o=>o.user===e):[]}))}getPersonByUserId(e){let t=`${this.base_personas_user}${e}`;return this.http.get(t)}obtenerEditores(){let e=`${this.base_usuario}`;return this.http.get(e)}getUserById(e){let t=`${this.base_usuario}${e}`;return this.http.get(t)}loadUser(e){return new f(t=>{if(!e){t.error("El usuarioId es indefinido");return}this.getUserById(e).subscribe(r=>{let s=r.avatar?`${this.base_usuario}${e}/descargar/`:"assets/avatars/user.png";t.next({user:r,profileImage:s}),t.complete()},r=>{console.error("Error al cargar user data:",r),t.error(r)})})}updateUserProfile(e,t,r){let s=new FormData;return s.append("avatar",r),s.append("password",t.password),s.append("username",t.username),s.append("email",t.email),this.http.put(`${this.base_editar_user}${e}/`,s)}getUserPassword(e){let t=`${this.base_usuario}${e}/`;return this.http.get(t).pipe(l(r=>r.password))}updatePassword(e,t){let r=`${this.base_usuario}${e}`,s={newPassword:t};return this.http.post(r,s)}static \u0275fac=function(t){return new(t||i)($(N))};static \u0275prov=h({token:i,factory:i.\u0275fac,providedIn:"root"})};export{L as a,z as b,le as c};
