import{a as nt}from"./chunk-5NPF7GMB.js";import{a as Ue}from"./chunk-A7EIBBLH.js";import{d as $e,h as qe,i as He,k as Xe,s as Ye,v as et,w as tt}from"./chunk-WWDD3Y5X.js";import{$a as g,$d as je,Ba as a,Bd as Pe,Ca as m,Cb as Ae,Da as f,Dd as Qe,Ea as B,Ed as me,F as Ce,Fd as D,G,Gb as y,Gd as Ke,H as U,Hb as Q,I as j,Ia as S,Ja as V,Jd as _e,K as A,Ka as O,La as T,Lb as Le,Ld as he,M as d,Ma as Ie,Md as ze,N as u,Na as C,Nb as Be,Nd as k,O as L,Oa as r,Ob as oe,Oc as de,Od as $,Pa as Oe,Pb as Fe,Pc as M,Qa as Y,Qb as le,Ra as x,S as K,Sa as E,Ta as _,Td as Re,Ua as h,Ub as ae,W as q,Xa as ye,Ya as Se,Zd as Ne,_a as ee,_d as Ge,ab as P,ba as s,bb as H,ca as w,cb as be,ce as We,da as Te,de as Ze,eb as Ve,fb as Ee,gb as ke,ha as fe,hd as ve,ib as te,ja as W,jb as Me,jd as N,ka as Z,kb as I,kd as z,lb as ne,lc as De,ld as R,mb as xe,mc as pe,me as Je,na as J,oa as X,oc as re,od as we,pa as c,pc as se,qc as ce,ta as b,ud as ue,wb as F,zb as ie}from"./chunk-64E2PASB.js";var it=`
    .p-panel {
        display: block;
        border: 1px solid dt('panel.border.color');
        border-radius: dt('panel.border.radius');
        background: dt('panel.background');
        color: dt('panel.color');
    }

    .p-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: dt('panel.header.padding');
        background: dt('panel.header.background');
        color: dt('panel.header.color');
        border-style: solid;
        border-width: dt('panel.header.border.width');
        border-color: dt('panel.header.border.color');
        border-radius: dt('panel.header.border.radius');
    }

    .p-panel-toggleable .p-panel-header {
        padding: dt('panel.toggleable.header.padding');
    }

    .p-panel-title {
        line-height: 1;
        font-weight: dt('panel.title.font.weight');
    }

    .p-panel-content {
        padding: dt('panel.content.padding');
    }

    .p-panel-footer {
        padding: dt('panel.footer.padding');
    }
`;var ht=["header"],gt=["icons"],ft=["content"],yt=["footer"],bt=["headericons"],xt=["contentWrapper"],vt=["*",[["p-header"]],[["p-footer"]]],wt=["*","p-header","p-footer"],Ct=t=>({transitionParams:t,height:"0",opacity:"0"}),Tt=t=>({value:"hidden",params:t}),It=t=>({transitionParams:t,height:"*",opacity:"1"}),Ot=t=>({value:"visible",params:t}),St=t=>({$implicit:t});function Vt(t,p){if(t&1&&(m(0,"span",4),P(1),f()),t&2){let e=r(2);g(e.cx("title")),a("pBind",e.ptm("title")),b("id",e.id+"_header"),s(),H(e._header)}}function Et(t,p){t&1&&O(0)}function kt(t,p){}function Mt(t,p){t&1&&c(0,kt,0,0,"ng-template")}function At(t,p){if(t&1&&(S(0),L(),B(1,"svg",12),V()),t&2){let e=r(5);s(),a("pBind",e.ptm("pcToggleButton.icon"))}}function Lt(t,p){if(t&1&&(S(0),L(),B(1,"svg",13),V()),t&2){let e=r(5);s(),a("pBind",e.ptm("pcToggleButton.icon"))}}function Bt(t,p){if(t&1&&(S(0),c(1,At,2,1,"ng-container",10)(2,Lt,2,1,"ng-container",10),V()),t&2){let e=r(4);s(),a("ngIf",!e.collapsed),s(),a("ngIf",e.collapsed)}}function Ft(t,p){}function Dt(t,p){t&1&&c(0,Ft,0,0,"ng-template")}function Pt(t,p){if(t&1&&c(0,Bt,3,2,"ng-container",10)(1,Dt,1,0,null,11),t&2){let e=r(3);a("ngIf",!e.headerIconsTemplate&&!e._headerIconsTemplate&&!(e.toggleButtonProps!=null&&e.toggleButtonProps.icon)),s(),a("ngTemplateOutlet",e.headerIconsTemplate||e._headerIconsTemplate)("ngTemplateOutletContext",I(3,St,e.collapsed))}}function Qt(t,p){if(t&1){let e=T();m(0,"p-button",9),C("click",function(n){d(e);let o=r(2);return u(o.onIconClick(n))})("keydown",function(n){d(e);let o=r(2);return u(o.onKeyDown(n))}),c(1,Pt,2,5,"ng-template",null,1,F),f()}if(t&2){let e=r(2);a("text",!0)("rounded",!0)("styleClass",e.cx("pcToggleButton"))("buttonProps",e.toggleButtonProps)("pt",e.ptm("pcToggleButton")),b("id",e.id+"_header")("aria-label",e.buttonAriaLabel)("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)}}function Kt(t,p){if(t&1){let e=T();m(0,"div",7),C("click",function(n){d(e);let o=r();return u(o.onHeaderClick(n))}),c(1,Vt,2,5,"span",6),Y(2,1),c(3,Et,1,0,"ng-container",5),m(4,"div",4),c(5,Mt,1,0,null,5)(6,Qt,3,9,"p-button",8),f()()}if(t&2){let e=r();g(e.cx("header")),a("pBind",e.ptm("header")),b("id",e.id+"-titlebar"),s(),a("ngIf",e._header),s(2),a("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),s(),g(e.cx("headerActions")),a("pBind",e.ptm("headerActions")),s(),a("ngTemplateOutlet",e.iconTemplate||e._iconTemplate),s(),a("ngIf",e.toggleable)}}function zt(t,p){t&1&&O(0)}function Rt(t,p){t&1&&O(0)}function $t(t,p){if(t&1&&(m(0,"div",4),Y(1,2),c(2,Rt,1,0,"ng-container",5),f()),t&2){let e=r();g(e.cx("footer")),a("pBind",e.ptm("footer")),s(2),a("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}var qt=`
    ${it}

    /* For PrimeNG */
    .p-panel-collapsed .p-panel-content-container,
    .p-panel-content-container.ng-animating {
        overflow: hidden !important;
    }

`,Ht={root:({instance:t})=>["p-panel p-component",{"p-panel-toggleable":t.toggleable,"p-panel-expanded":!t._collapsed&&t.toggleable,"p-panel-collapsed":t._collapsed&&t.toggleable}],header:"p-panel-header",title:"p-panel-title",headerActions:({instance:t})=>["p-panel-header-actions",{"p-panel-icons-start":t.iconPos==="start","p-panel-icons-end":t.iconPos==="end","p-panel-icons-center":t.iconPos==="center"}],pcToggleButton:"p-panel-toggle-button",contentContainer:"p-panel-content-container",content:"p-panel-content",footer:"p-panel-footer"},ot=(()=>{class t extends _e{name="panel";style=qt;classes=Ht;static \u0275fac=(()=>{let e;return function(n){return(e||(e=q(t)))(n||t)}})();static \u0275prov=G({token:t,factory:t.\u0275fac})}return t})();var lt=new j("PANEL_INSTANCE"),Nt=(()=>{class t extends ze{$pcPanel=A(lt,{optional:!0,skipSelf:!0})??void 0;_componentStyle=A(ot);bindDirectiveInstance=A(k,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}id=ue("pn_id_");toggleable;_header;_collapsed;get collapsed(){return this._collapsed}set collapsed(e){this._collapsed=e}styleClass;iconPos="end";showHeader=!0;toggler="icon";transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";toggleButtonProps;collapsedChange=new w;onBeforeToggle=new w;onAfterToggle=new w;animating=K(!1);footerFacet;headerTemplate;iconTemplate;contentTemplate;footerTemplate;headerIconsTemplate;_headerTemplate;_iconTemplate;_contentTemplate;_footerTemplate;_headerIconsTemplate;contentWrapperViewChild;get buttonAriaLabel(){return this._header}onHeaderClick(e){this.toggler==="header"&&this.toggle(e)}onIconClick(e){this.toggler==="icon"&&this.toggle(e)}toggle(e){if(this.animating())return!1;this.animating.set(!0),this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.toggleable&&(this.collapsed?this.expand():this.collapse()),e.preventDefault()}expand(){this._collapsed=!1,this.collapsedChange.emit(!1),this.updateTabIndex()}collapse(){this._collapsed=!0,this.collapsedChange.emit(!0),this.updateTabIndex()}getBlockableElement(){return this.el.nativeElement}updateTabIndex(){this.contentWrapperViewChild&&this.contentWrapperViewChild.nativeElement.querySelectorAll("input, button, select, a, textarea, [tabindex]").forEach(i=>{this.collapsed?i.setAttribute("tabindex","-1"):i.removeAttribute("tabindex")})}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault())}onToggleDone(e){this.animating.set(!1),this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed})}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"icons":this._iconTemplate=e.template;break;case"headericons":this._headerIconsTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}dataP(){return this.cn({toggleable:this.toggleable})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=q(t)))(n||t)}})();static \u0275cmp=W({type:t,selectors:[["p-panel"]],contentQueries:function(i,n,o){if(i&1&&(x(o,Qe,5),x(o,ht,4),x(o,gt,4),x(o,ft,4),x(o,yt,4),x(o,bt,4),x(o,me,4)),i&2){let l;_(l=h())&&(n.footerFacet=l.first),_(l=h())&&(n.headerTemplate=l.first),_(l=h())&&(n.iconTemplate=l.first),_(l=h())&&(n.contentTemplate=l.first),_(l=h())&&(n.footerTemplate=l.first),_(l=h())&&(n.headerIconsTemplate=l.first),_(l=h())&&(n.templates=l)}},viewQuery:function(i,n){if(i&1&&E(xt,5),i&2){let o;_(o=h())&&(n.contentWrapperViewChild=o.first)}},hostVars:4,hostBindings:function(i,n){i&2&&(Ie("id",n.id),b("data-p",n.dataP()),g(n.cn(n.cx("root"),n.styleClass)))},inputs:{id:"id",toggleable:[2,"toggleable","toggleable",y],_header:[0,"header","_header"],collapsed:[2,"collapsed","collapsed",y],styleClass:"styleClass",iconPos:"iconPos",showHeader:[2,"showHeader","showHeader",y],toggler:"toggler",transitionOptions:"transitionOptions",toggleButtonProps:"toggleButtonProps"},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[te([ot,{provide:lt,useExisting:t},{provide:he,useExisting:t}]),X([k]),J],ngContentSelectors:wt,decls:7,vars:22,consts:[["contentWrapper",""],["icon",""],[3,"pBind","class","click",4,"ngIf"],["role","region",3,"pBind","id"],[3,"pBind"],[4,"ngTemplateOutlet"],[3,"pBind","class",4,"ngIf"],[3,"click","pBind"],["severity","secondary","type","button","role","button",3,"text","rounded","styleClass","buttonProps","pt","click","keydown",4,"ngIf"],["severity","secondary","type","button","role","button",3,"click","keydown","text","rounded","styleClass","buttonProps","pt"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"pBind"],["data-p-icon","plus",3,"pBind"]],template:function(i,n){if(i&1){let o=T();Oe(vt),c(0,Kt,7,11,"div",2),m(1,"div",3),C("@panelContent.done",function(v){return d(o),u(n.onToggleDone(v))}),m(2,"div",4,0),Y(4),c(5,zt,1,0,"ng-container",5),f(),c(6,$t,3,4,"div",6),f()}i&2&&(a("ngIf",n.showHeader),s(),g(n.cx("contentContainer")),a("pBind",n.ptm("contentContainer"))("id",n.id+"_content")("@panelContent",n.collapsed?I(16,Tt,I(14,Ct,n.animating()?n.transitionOptions:"0ms")):I(20,Ot,I(18,It,n.animating()?n.transitionOptions:"0ms"))),b("aria-labelledby",n.id+"_header")("aria-hidden",n.collapsed)("tabindex",n.collapsed?"-1":void 0),s(),g(n.cx("content")),a("pBind",n.ptm("content")),s(3),a("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),s(),a("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate))},dependencies:[ae,oe,le,He,qe,Ze,We,D,$,k],encapsulation:2,data:{animation:[De("panelContent",[se("hidden",re({height:"0"})),se("void",re({height:"{{height}}"}),{params:{height:"0"}}),se("visible",re({height:"*"})),ce("visible <=> hidden",[pe("{{transitionParams}}")]),ce("void => hidden",pe("{{transitionParams}}")),ce("void => visible",pe("{{transitionParams}}"))])]},changeDetection:0})}return t})(),Pi=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Z({type:t});static \u0275inj=U({imports:[Nt,D,$,D,$]})}return t})();var at=`
    .p-autocomplete {
        display: inline-flex;
    }

    .p-autocomplete-loader {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-loader {
        inset-inline-end: calc(dt('autocomplete.dropdown.width') + dt('autocomplete.padding.x'));
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        flex: 1 1 auto;
        width: 1%;
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input,
    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-input-multiple {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-autocomplete-dropdown {
        cursor: pointer;
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('autocomplete.dropdown.width');
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
        background: dt('autocomplete.dropdown.background');
        border: 1px solid dt('autocomplete.dropdown.border.color');
        border-inline-start: 0 none;
        color: dt('autocomplete.dropdown.color');
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
    }

    .p-autocomplete-dropdown:not(:disabled):hover {
        background: dt('autocomplete.dropdown.hover.background');
        border-color: dt('autocomplete.dropdown.hover.border.color');
        color: dt('autocomplete.dropdown.hover.color');
    }

    .p-autocomplete-dropdown:not(:disabled):active {
        background: dt('autocomplete.dropdown.active.background');
        border-color: dt('autocomplete.dropdown.active.border.color');
        color: dt('autocomplete.dropdown.active.color');
    }

    .p-autocomplete-dropdown:focus-visible {
        box-shadow: dt('autocomplete.dropdown.focus.ring.shadow');
        outline: dt('autocomplete.dropdown.focus.ring.width') dt('autocomplete.dropdown.focus.ring.style') dt('autocomplete.dropdown.focus.ring.color');
        outline-offset: dt('autocomplete.dropdown.focus.ring.offset');
    }

    .p-autocomplete-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('autocomplete.overlay.background');
        color: dt('autocomplete.overlay.color');
        border: 1px solid dt('autocomplete.overlay.border.color');
        border-radius: dt('autocomplete.overlay.border.radius');
        box-shadow: dt('autocomplete.overlay.shadow');
        min-width: 100%;
    }

    .p-autocomplete-list-container {
        overflow: auto;
    }

    .p-autocomplete-list {
        margin: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: dt('autocomplete.list.gap');
        padding: dt('autocomplete.list.padding');
    }

    .p-autocomplete-option {
        cursor: pointer;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('autocomplete.option.padding');
        border: 0 none;
        color: dt('autocomplete.option.color');
        background: transparent;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration');
        border-radius: dt('autocomplete.option.border.radius');
    }

    .p-autocomplete-option:not(.p-autocomplete-option-selected):not(.p-disabled).p-focus {
        background: dt('autocomplete.option.focus.background');
        color: dt('autocomplete.option.focus.color');
    }

    .p-autocomplete-option-selected {
        background: dt('autocomplete.option.selected.background');
        color: dt('autocomplete.option.selected.color');
    }

    .p-autocomplete-option-selected.p-focus {
        background: dt('autocomplete.option.selected.focus.background');
        color: dt('autocomplete.option.selected.focus.color');
    }

    .p-autocomplete-option-group {
        margin: 0;
        padding: dt('autocomplete.option.group.padding');
        color: dt('autocomplete.option.group.color');
        background: dt('autocomplete.option.group.background');
        font-weight: dt('autocomplete.option.group.font.weight');
    }

    .p-autocomplete-input-multiple {
        margin: 0;
        list-style-type: none;
        cursor: text;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: calc(dt('autocomplete.padding.y') / 2) dt('autocomplete.padding.x');
        gap: calc(dt('autocomplete.padding.y') / 2);
        color: dt('autocomplete.color');
        background: dt('autocomplete.background');
        border: 1px solid dt('autocomplete.border.color');
        border-radius: dt('autocomplete.border.radius');
        width: 100%;
        transition:
            background dt('autocomplete.transition.duration'),
            color dt('autocomplete.transition.duration'),
            border-color dt('autocomplete.transition.duration'),
            outline-color dt('autocomplete.transition.duration'),
            box-shadow dt('autocomplete.transition.duration');
        outline-color: transparent;
        box-shadow: dt('autocomplete.shadow');
    }

    .p-autocomplete-input-multiple.p-disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-autocomplete-input-multiple:not(.p-disabled):hover {
        border-color: dt('autocomplete.hover.border.color');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple:not(.p-disabled) {
        border-color: dt('autocomplete.focus.border.color');
        box-shadow: dt('autocomplete.focus.ring.shadow');
        outline: dt('autocomplete.focus.ring.width') dt('autocomplete.focus.ring.style') dt('autocomplete.focus.ring.color');
        outline-offset: dt('autocomplete.focus.ring.offset');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    .p-variant-filled.p-autocomplete-input-multiple {
        background: dt('autocomplete.filled.background');
    }

    .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled):hover {
        background: dt('autocomplete.filled.hover.background');
    }

    .p-autocomplete.p-focus .p-autocomplete-input-multiple.p-variant-filled:not(.p-disabled) {
        background: dt('autocomplete.filled.focus.background');
    }

    .p-autocomplete-chip.p-chip {
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
        border-radius: dt('autocomplete.chip.border.radius');
    }

    .p-autocomplete-input-multiple:has(.p-autocomplete-chip) {
        padding-inline-start: calc(dt('autocomplete.padding.y') / 2);
        padding-inline-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-chip-item.p-focus .p-autocomplete-chip {
        background: dt('autocomplete.chip.focus.background');
        color: dt('autocomplete.chip.focus.color');
    }

    .p-autocomplete-input-chip {
        flex: 1 1 auto;
        display: inline-flex;
        padding-block-start: calc(dt('autocomplete.padding.y') / 2);
        padding-block-end: calc(dt('autocomplete.padding.y') / 2);
    }

    .p-autocomplete-input-chip input {
        border: 0 none;
        outline: 0 none;
        background: transparent;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: inherit;
    }

    .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.placeholder.color');
    }

    .p-autocomplete.p-invalid .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    .p-autocomplete-empty-message {
        padding: dt('autocomplete.empty.message.padding');
    }

    .p-autocomplete-fluid {
        display: flex;
    }

    .p-autocomplete-fluid:has(.p-autocomplete-dropdown) .p-autocomplete-input {
        width: 1%;
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.sm.width');
    }

    .p-autocomplete:has(.p-inputtext-sm) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown {
        width: dt('autocomplete.dropdown.lg.width');
    }

    .p-autocomplete:has(.p-inputtext-lg) .p-autocomplete-dropdown .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-autocomplete-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        color: dt('form.field.icon.color');
        inset-inline-end: dt('autocomplete.padding.x');
    }

    .p-autocomplete:has(.p-autocomplete-dropdown) .p-autocomplete-clear-icon {
        inset-inline-end: calc(dt('autocomplete.padding.x') + dt('autocomplete.dropdown.width'));
    }

    .p-autocomplete:has(.p-autocomplete-clear-icon) .p-autocomplete-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputgroup .p-autocomplete-dropdown {
        border-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child:has(.p-autocomplete-dropdown) > .p-autocomplete-input {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-inputgroup > .p-autocomplete:last-child .p-autocomplete-dropdown {
        border-start-end-radius: dt('autocomplete.dropdown.border.radius');
        border-end-end-radius: dt('autocomplete.dropdown.border.radius');
    }
`;var Gt=["item"],Ut=["empty"],jt=["header"],Wt=["footer"],Zt=["selecteditem"],Jt=["group"],Xt=["loader"],Yt=["removeicon"],en=["loadingicon"],tn=["clearicon"],nn=["dropdownicon"],on=["focusInput"],ln=["multiIn"],an=["multiContainer"],pn=["ddBtn"],rn=["items"],sn=["scroller"],cn=["overlay"],dn=t=>({i:t}),st=t=>({$implicit:t}),un=(t,p,e)=>({removeCallback:t,index:p,class:e}),ge=t=>({height:t}),ct=(t,p)=>({$implicit:t,options:p}),mn=t=>({options:t}),_n=()=>({}),hn=(t,p,e)=>({option:t,i:p,scrollerOptions:e}),gn=(t,p)=>({$implicit:t,index:p});function fn(t,p){if(t&1){let e=T();m(0,"input",18,2),C("input",function(n){d(e);let o=r();return u(o.onInput(n))})("keydown",function(n){d(e);let o=r();return u(o.onKeyDown(n))})("change",function(n){d(e);let o=r();return u(o.onInputChange(n))})("focus",function(n){d(e);let o=r();return u(o.onInputFocus(n))})("blur",function(n){d(e);let o=r();return u(o.onInputBlur(n))})("paste",function(n){d(e);let o=r();return u(o.onInputPaste(n))})("keyup",function(n){d(e);let o=r();return u(o.onInputKeyUp(n))}),f()}if(t&2){let e=r();g(e.cn(e.cx("pcInputText"),e.inputStyleClass)),a("pAutoFocus",e.autofocus)("pt",e.ptm("pcInputText"))("ngStyle",e.inputStyle)("variant",e.$variant())("invalid",e.invalid())("pSize",e.size())("fluid",e.hasFluid),b("type",e.type)("value",e.inputValue())("id",e.inputId)("autocomplete",e.autocomplete)("placeholder",e.placeholder)("name",e.name())("minlength",e.minlength())("min",e.min())("max",e.max())("pattern",e.pattern())("size",e.inputSize())("maxlength",e.maxlength())("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??!1)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0)}}function yn(t,p){if(t&1){let e=T();L(),m(0,"svg",21),C("click",function(){d(e);let n=r(2);return u(n.clear())}),f()}if(t&2){let e=r(2);g(e.cx("clearIcon")),a("pBind",e.ptm("clearIcon")),b("aria-hidden",!0)}}function bn(t,p){}function xn(t,p){t&1&&c(0,bn,0,0,"ng-template")}function vn(t,p){if(t&1){let e=T();m(0,"span",22),C("click",function(){d(e);let n=r(2);return u(n.clear())}),c(1,xn,1,0,null,23),f()}if(t&2){let e=r(2);g(e.cx("clearIcon")),a("pBind",e.ptm("clearIcon")),b("aria-hidden",!0),s(),a("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)}}function wn(t,p){if(t&1&&(S(0),c(1,yn,1,4,"svg",19)(2,vn,2,5,"span",20),V()),t&2){let e=r();s(),a("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),s(),a("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function Cn(t,p){t&1&&O(0)}function Tn(t,p){if(t&1){let e=T();m(0,"span",22),C("click",function(n){d(e);let o=r(2).index,l=r(2);return u(!l.readonly&&!l.$disabled()?l.removeOption(n,o):"")}),L(),B(1,"svg",31),f()}if(t&2){let e=r(4);g(e.cx("chipIcon")),a("pBind",e.ptm("chipIcon")),s(),g(e.cx("chipIcon")),b("aria-hidden",!0)}}function In(t,p){}function On(t,p){t&1&&c(0,In,0,0,"ng-template")}function Sn(t,p){if(t&1&&(m(0,"span",32),c(1,On,1,0,null,29),f()),t&2){let e=r(2).index,i=r(2);a("pBind",i.ptm("chipIcon")),b("aria-hidden",!0),s(),a("ngTemplateOutlet",i.removeIconTemplate||i._removeIconTemplate)("ngTemplateOutletContext",xe(4,un,i.removeOption.bind(i),e,i.cx("chipIcon")))}}function Vn(t,p){if(t&1&&c(0,Tn,2,6,"span",20)(1,Sn,2,8,"span",30),t&2){let e=r(3);a("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),s(),a("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}function En(t,p){if(t&1){let e=T();m(0,"li",26,5)(2,"p-chip",28),C("onRemove",function(n){let o=d(e).index,l=r(2);return u(l.readonly?"":l.removeOption(n,o))}),c(3,Cn,1,0,"ng-container",29)(4,Vn,2,2,"ng-template",null,6,F),f()()}if(t&2){let e=p.$implicit,i=p.index,n=r(2);g(n.cx("chipItem",I(16,dn,i))),a("pBind",n.ptm("chipItem")),b("id",n.id+"_multiple_option_"+i)("aria-label",n.getOptionLabel(e))("aria-setsize",n.modelValue().length)("aria-posinset",i+1)("aria-selected",!0),s(2),g(n.cx("pcChip")),a("pt",n.ptm("pcChip"))("label",!n.selectedItemTemplate&&!n._selectedItemTemplate&&n.getOptionLabel(e))("disabled",n.$disabled())("removable",!0),s(),a("ngTemplateOutlet",n.selectedItemTemplate||n._selectedItemTemplate)("ngTemplateOutletContext",I(18,st,e))}}function kn(t,p){if(t&1){let e=T();m(0,"ul",24,3),C("focus",function(n){d(e);let o=r();return u(o.onMultipleContainerFocus(n))})("blur",function(n){d(e);let o=r();return u(o.onMultipleContainerBlur(n))})("keydown",function(n){d(e);let o=r();return u(o.onMultipleContainerKeyDown(n))}),c(2,En,6,20,"li",25),m(3,"li",26)(4,"input",27,4),C("input",function(n){d(e);let o=r();return u(o.onInput(n))})("keydown",function(n){d(e);let o=r();return u(o.onKeyDown(n))})("change",function(n){d(e);let o=r();return u(o.onInputChange(n))})("focus",function(n){d(e);let o=r();return u(o.onInputFocus(n))})("blur",function(n){d(e);let o=r();return u(o.onInputBlur(n))})("paste",function(n){d(e);let o=r();return u(o.onInputPaste(n))})("keyup",function(n){d(e);let o=r();return u(o.onInputKeyUp(n))}),f()()()}if(t&2){let e=r();g(e.cx("inputMultiple")),a("pBind",e.ptm("inputMultiple"))("tabindex",-1),b("aria-orientation","horizontal")("aria-activedescendant",e.focused?e.focusedMultipleOptionId:void 0),s(2),a("ngForOf",e.modelValue()),s(),g(e.cx("inputChip")),a("pBind",e.ptm("inputChip")),s(),g(e.cx("pcInputText")),a("pAutoFocus",e.autofocus)("pBind",e.ptm("input"))("ngStyle",e.inputStyle),b("type",e.type)("id",e.inputId)("autocomplete",e.autocomplete)("name",e.name())("minlength",e.minlength())("maxlength",e.maxlength())("size",e.size())("min",e.min())("max",e.max())("pattern",e.pattern())("placeholder",e.$filled()?null:e.placeholder)("tabindex",e.$disabled()?-1:e.tabindex)("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledBy)("aria-required",e.required())("aria-expanded",e.overlayVisible??!1)("aria-controls",e.overlayVisible?e.id+"_list":null)("aria-activedescendant",e.focused?e.focusedOptionId:void 0)}}function Mn(t,p){if(t&1&&(L(),B(0,"svg",35)),t&2){let e=r(2);g(e.cx("loader")),a("pBind",e.ptm("loader"))("spin",!0),b("aria-hidden",!0)}}function An(t,p){}function Ln(t,p){t&1&&c(0,An,0,0,"ng-template")}function Bn(t,p){if(t&1&&(m(0,"span",32),c(1,Ln,1,0,null,23),f()),t&2){let e=r(2);g(e.cx("loader")),a("pBind",e.ptm("loader")),b("aria-hidden",!0),s(),a("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)}}function Fn(t,p){if(t&1&&(S(0),c(1,Mn,1,5,"svg",33)(2,Bn,2,5,"span",34),V()),t&2){let e=r();s(),a("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate),s(),a("ngIf",e.loadingIconTemplate||e._loadingIconTemplate)}}function Dn(t,p){if(t&1&&B(0,"span",38),t&2){let e=r(2);a("ngClass",e.dropdownIcon),b("aria-hidden",!0)}}function Pn(t,p){if(t&1&&(L(),B(0,"svg",40)),t&2){let e=r(3);a("pBind",e.ptm("dropdown"))}}function Qn(t,p){}function Kn(t,p){t&1&&c(0,Qn,0,0,"ng-template")}function zn(t,p){if(t&1&&(S(0),c(1,Pn,1,1,"svg",39)(2,Kn,1,0,null,23),V()),t&2){let e=r(2);s(),a("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),s(),a("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Rn(t,p){if(t&1){let e=T();m(0,"button",36,7),C("click",function(n){d(e);let o=r();return u(o.handleDropdownClick(n))}),c(2,Dn,1,2,"span",37)(3,zn,3,2,"ng-container",14),f()}if(t&2){let e=r();g(e.cx("dropdown")),a("pBind",e.ptm("dropdown"))("disabled",e.$disabled()),b("aria-label",e.dropdownAriaLabel)("tabindex",e.tabindex),s(2),a("ngIf",e.dropdownIcon),s(),a("ngIf",!e.dropdownIcon)}}function $n(t,p){t&1&&O(0)}function qn(t,p){t&1&&O(0)}function Hn(t,p){if(t&1&&c(0,qn,1,0,"ng-container",29),t&2){let e=p.$implicit,i=p.options;r(2);let n=ye(6);a("ngTemplateOutlet",n)("ngTemplateOutletContext",ne(2,ct,e,i))}}function Nn(t,p){t&1&&O(0)}function Gn(t,p){if(t&1&&c(0,Nn,1,0,"ng-container",29),t&2){let e=p.options,i=r(4);a("ngTemplateOutlet",i.loaderTemplate||i._loaderTemplate)("ngTemplateOutletContext",I(2,mn,e))}}function Un(t,p){t&1&&(S(0),c(1,Gn,1,4,"ng-template",null,10,F),V())}function jn(t,p){if(t&1){let e=T();m(0,"p-scroller",45,9),C("onLazyLoad",function(n){d(e);let o=r(2);return u(o.onLazyLoad.emit(n))}),c(2,Hn,1,5,"ng-template",null,1,F)(4,Un,3,0,"ng-container",14),f()}if(t&2){let e=r(2);ee(I(9,ge,e.scrollHeight)),a("pt",e.ptm("virtualScroller"))("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",!0)("lazy",e.lazy)("options",e.virtualScrollOptions),s(4),a("ngIf",e.loaderTemplate||e._loaderTemplate)}}function Wn(t,p){t&1&&O(0)}function Zn(t,p){if(t&1&&(S(0),c(1,Wn,1,0,"ng-container",29),V()),t&2){r();let e=ye(6),i=r();s(),a("ngTemplateOutlet",e)("ngTemplateOutletContext",ne(3,ct,i.visibleOptions(),Me(2,_n)))}}function Jn(t,p){if(t&1&&(m(0,"span"),P(1),f()),t&2){let e=r(2).$implicit,i=r(3);s(),H(i.getOptionGroupLabel(e.optionGroup))}}function Xn(t,p){t&1&&O(0)}function Yn(t,p){if(t&1&&(S(0),m(1,"li",49),c(2,Jn,2,1,"span",14)(3,Xn,1,0,"ng-container",29),f(),V()),t&2){let e=r(),i=e.$implicit,n=e.index,o=r().options,l=r(2);s(),g(l.cx("optionGroup")),a("pBind",l.ptm("optionGroup"))("ngStyle",I(8,ge,o.itemSize+"px")),b("id",l.id+"_"+l.getOptionIndex(n,o)),s(),a("ngIf",!l.groupTemplate),s(),a("ngTemplateOutlet",l.groupTemplate)("ngTemplateOutletContext",I(10,st,i.optionGroup))}}function ei(t,p){if(t&1&&(m(0,"span"),P(1),f()),t&2){let e=r(2).$implicit,i=r(3);s(),H(i.getOptionLabel(e))}}function ti(t,p){t&1&&O(0)}function ni(t,p){if(t&1){let e=T();S(0),m(1,"li",50),C("click",function(n){d(e);let o=r().$implicit,l=r(3);return u(l.onOptionSelect(n,o))})("mouseenter",function(n){d(e);let o=r().index,l=r().options,v=r(2);return u(v.onOptionMouseEnter(n,v.getOptionIndex(o,l)))}),c(2,ei,2,1,"span",14)(3,ti,1,0,"ng-container",29),f(),V()}if(t&2){let e=r(),i=e.$implicit,n=e.index,o=r().options,l=r(2);s(),g(l.cx("option",xe(14,hn,i,n,o))),a("pBind",l.getPTOptions(i,o,n,"option"))("ngStyle",I(18,ge,o.itemSize+"px")),b("id",l.id+"_"+l.getOptionIndex(n,o))("aria-label",l.getOptionLabel(i))("aria-selected",l.isSelected(i))("aria-disabled",l.isOptionDisabled(i))("data-p-focused",l.focusedOptionIndex()===l.getOptionIndex(n,o))("aria-setsize",l.ariaSetSize)("aria-posinset",l.getAriaPosInset(l.getOptionIndex(n,o))),s(),a("ngIf",!l.itemTemplate&&!l._itemTemplate),s(),a("ngTemplateOutlet",l.itemTemplate||l._itemTemplate)("ngTemplateOutletContext",ne(20,gn,i,o.getOptions?o.getOptions(n):n))}}function ii(t,p){if(t&1&&c(0,Yn,4,12,"ng-container",14)(1,ni,4,23,"ng-container",14),t&2){let e=p.$implicit,i=r(3);a("ngIf",i.isOptionGroup(e)),s(),a("ngIf",!i.isOptionGroup(e))}}function oi(t,p){if(t&1&&(S(0),P(1),V()),t&2){let e=r(4);s(),be(" ",e.searchResultMessageText," ")}}function li(t,p){t&1&&O(0,null,12)}function ai(t,p){if(t&1&&(m(0,"li",49),c(1,oi,2,1,"ng-container",51)(2,li,2,0,"ng-container",23),f()),t&2){let e=r().options,i=r(2);g(i.cx("emptyMessage")),a("pBind",i.ptm("emptyMessage"))("ngStyle",I(7,ge,e.itemSize+"px")),s(),a("ngIf",!i.emptyTemplate&&!i._emptyTemplate)("ngIfElse",i.empty),s(),a("ngTemplateOutlet",i.emptyTemplate||i._emptyTemplate)}}function pi(t,p){if(t&1&&(m(0,"ul",46,11),c(2,ii,2,2,"ng-template",47)(3,ai,3,9,"li",48),f()),t&2){let e=p.$implicit,i=p.options,n=r(2);ee(i.contentStyle),g(n.cn(n.cx("list"),i.contentStyleClass)),a("pBind",n.ptm("list")),b("id",n.id+"_list")("aria-label",n.listLabel),s(2),a("ngForOf",e),s(),a("ngIf",!e||e&&e.length===0&&n.showEmptyMessage)}}function ri(t,p){t&1&&O(0)}function si(t,p){if(t&1&&(m(0,"div",41),c(1,$n,1,0,"ng-container",23),m(2,"div",42),c(3,jn,5,11,"p-scroller",43)(4,Zn,2,6,"ng-container",14),f(),c(5,pi,4,9,"ng-template",null,8,F)(7,ri,1,0,"ng-container",23),f(),m(8,"span",44),P(9),f()),t&2){let e=r();g(e.cn(e.cx("overlay"),e.panelStyleClass)),a("pBind",e.ptm("overlay"))("ngStyle",e.panelStyle),s(),a("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),s(),g(e.cx("listContainer")),Se("max-height",e.virtualScroll?"auto":e.scrollHeight),a("pBind",e.ptm("listContainer"))("tabindex",-1),s(),a("ngIf",e.virtualScroll),s(),a("ngIf",!e.virtualScroll),s(3),a("ngTemplateOutlet",e.footerTemplate||e._footerTemplate),s(2),be(" ",e.selectedMessageText," ")}}var ci=`
    ${at}

    /* For PrimeNG */
    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input,
    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-multiple p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.invalid.border.color');
    }

    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
    p-autoComplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
    p-auto-complete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input:enabled:focus,
    p-autocomplete.ng-invalid.ng-dirty:not(.p-disabled).p-focus .p-autocomplete-input-multiple {
        border-color: dt('autocomplete.focus.border.color');
    }

    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input-chip input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }

    p-autoComplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
    p-auto-complete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder,
    p-autocomplete.ng-invalid.ng-dirty .p-autocomplete-input::placeholder {
        color: dt('autocomplete.invalid.placeholder.color');
    }
`,di={root:{position:"relative"}},ui={root:({instance:t})=>["p-autocomplete p-component p-inputwrapper",{"p-invalid":t.invalid(),"p-focus":t.focused,"p-inputwrapper-filled":t.$filled(),"p-inputwrapper-focus":t.focused&&!t.$disabled()||t.autofocus||t.overlayVisible,"p-autocomplete-open":t.overlayVisible,"p-autocomplete-clearable":t.showClear&&!t.$disabled(),"p-autocomplete-fluid":t.hasFluid}],pcInputText:"p-autocomplete-input",inputMultiple:({instance:t})=>["p-autocomplete-input-multiple",{"p-disabled":t.$disabled(),"p-variant-filled":t.$variant()==="filled"}],chipItem:({instance:t,i:p})=>["p-autocomplete-chip-item",{"p-focus":t.focusedMultipleOptionIndex()===p}],pcChip:"p-autocomplete-chip",chipIcon:"p-autocomplete-chip-icon",inputChip:"p-autocomplete-input-chip",loader:"p-autocomplete-loader",dropdown:"p-autocomplete-dropdown",overlay:({instance:t})=>["p-autocomplete-overlay p-component-overlay p-component",{"p-input-filled":t.$variant()==="filled","p-ripple-disabled":t.config.ripple()===!1}],listContainer:"p-autocomplete-list-container",list:"p-autocomplete-list",optionGroup:"p-autocomplete-option-group",option:({instance:t,option:p,i:e,scrollerOptions:i})=>({"p-autocomplete-option":!0,"p-autocomplete-option-selected":t.isSelected(p),"p-focus":t.focusedOptionIndex()===t.getOptionIndex(e,i),"p-disabled":t.isOptionDisabled(p)}),emptyMessage:"p-autocomplete-empty-message",clearIcon:"p-autocomplete-clear-icon"},pt=(()=>{class t extends _e{name="autocomplete";style=ci;classes=ui;inlineStyles=di;static \u0275fac=(()=>{let e;return function(n){return(e||(e=q(t)))(n||t)}})();static \u0275prov=G({token:t,factory:t.\u0275fac})}return t})();var rt=new j("AUTOCOMPLETE_INSTANCE"),mi={provide:Je,useExisting:Ce(()=>dt),multi:!0},dt=(()=>{class t extends Ye{overlayService;zone;$pcAutoComplete=A(rt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=A(k,{self:!0});minLength=1;minQueryLength;delay=300;panelStyle;styleClass;panelStyleClass;inputStyle;inputId;inputStyleClass;placeholder;readonly;scrollHeight="200px";lazy=!1;virtualScroll;virtualScrollItemSize;virtualScrollOptions;autoHighlight;forceSelection;type="text";autoZIndex=!0;baseZIndex=0;ariaLabel;dropdownAriaLabel;ariaLabelledBy;dropdownIcon;unique=!0;group;completeOnFocus=!1;showClear=!1;dropdown;showEmptyMessage=!0;dropdownMode="blank";multiple;addOnTab=!1;tabindex;dataKey;emptyMessage;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";autofocus;autocomplete="off";optionGroupChildren="items";optionGroupLabel="label";overlayOptions;get suggestions(){return this._suggestions()}set suggestions(e){this._suggestions.set(e),this.handleSuggestionsChange()}optionLabel;optionValue;id;searchMessage;emptySelectionMessage;selectionMessage;autoOptionFocus=!1;selectOnFocus;searchLocale;optionDisabled;focusOnHover=!0;typeahead=!0;addOnBlur=!1;separator;appendTo=Ae(void 0);completeMethod=new w;onSelect=new w;onUnselect=new w;onAdd=new w;onFocus=new w;onBlur=new w;onDropdownClick=new w;onClear=new w;onInputKeydown=new w;onKeyUp=new w;onShow=new w;onHide=new w;onLazyLoad=new w;inputEL;multiInputEl;multiContainerEL;dropdownButton;itemsViewChild;scroller;overlayViewChild;itemsWrapper;itemTemplate;emptyTemplate;headerTemplate;footerTemplate;selectedItemTemplate;groupTemplate;loaderTemplate;removeIconTemplate;loadingIconTemplate;clearIconTemplate;dropdownIconTemplate;onHostClick(e){this.onContainerClick(e)}value;_suggestions=K(null);timeout;overlayVisible;suggestionsUpdated;highlightOption;highlightOptionChanged;focused=!1;loading;scrollHandler;listId;searchTimeout;dirty=!1;_itemTemplate;_groupTemplate;_selectedItemTemplate;_headerTemplate;_emptyTemplate;_footerTemplate;_loaderTemplate;_removeIconTemplate;_loadingIconTemplate;_clearIconTemplate;_dropdownIconTemplate;focusedMultipleOptionIndex=K(-1);focusedOptionIndex=K(-1);_componentStyle=A(pt);$appendTo=ie(()=>this.appendTo()||this.config.overlayAppendTo());visibleOptions=ie(()=>this.group?this.flatOptions(this._suggestions()):this._suggestions()||[]);inputValue=ie(()=>{let e=this.modelValue(),i=this.optionValueSelected?(this.suggestions||[]).find(n=>R(n,e,this.equalityKey())):e;if(N(e))if(typeof e=="object"||this.optionValueSelected){let n=this.getOptionLabel(i);return n??e}else return e;else return""});get focusedMultipleOptionId(){return this.focusedMultipleOptionIndex()!==-1?`${this.id}_multiple_option_${this.focusedMultipleOptionIndex()}`:null}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}get searchResultMessageText(){return N(this.visibleOptions())&&this.overlayVisible?this.searchMessageText.replaceAll("{0}",this.visibleOptions().length):this.emptySearchMessageText}get searchMessageText(){return this.searchMessage||this.config.translation.searchMessage||""}get emptySearchMessageText(){return this.emptyMessage||this.config.translation.emptySearchMessage||""}get selectionMessageText(){return this.selectionMessage||this.config.translation.selectionMessage||""}get emptySelectionMessageText(){return this.emptySelectionMessage||this.config.translation.emptySelectionMessage||""}get selectedMessageText(){return this.hasSelectedOption()?this.selectionMessageText.replaceAll("{0}",this.multiple?this.modelValue()?.length:"1"):this.emptySelectionMessageText}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}get listLabel(){return this.config.getTranslation(Ke.ARIA).listLabel}get virtualScrollerDisabled(){return!this.virtualScroll}get optionValueSelected(){return typeof this.modelValue()=="string"&&this.optionValue}chipItemClass(e){return this._componentStyle.classes.chipItem({instance:this,i:e})}constructor(e,i){super(),this.overlayService=e,this.zone=i}onInit(){this.id=this.id||ue("pn_id_"),this.cd.detectChanges()}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"item":this._itemTemplate=e.template;break;case"group":this._groupTemplate=e.template;break;case"selecteditem":this._selectedItemTemplate=e.template;break;case"selectedItem":this._selectedItemTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"empty":this._emptyTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"removetokenicon":this._removeIconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;case"clearicon":this._clearIconTemplate=e.template;break;case"dropdownicon":this._dropdownIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.suggestionsUpdated&&this.overlayViewChild&&this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild&&this.overlayViewChild.alignOverlay()},1),this.suggestionsUpdated=!1})}handleSuggestionsChange(){if(this.loading){this._suggestions()?.length>0||this.showEmptyMessage||this.emptyTemplate?this.show():this.hide();let e=this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(e),this.suggestionsUpdated=!0,this.loading=!1,this.cd.markForCheck()}}flatOptions(e){return(e||[]).reduce((i,n,o)=>{i.push({optionGroup:n,group:!0,index:o});let l=this.getOptionGroupChildren(n);return l&&l.forEach(v=>i.push(v)),i},[])}isOptionGroup(e){return this.optionGroupLabel&&e.optionGroup&&e.group}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findLastOptionIndex(){return we(this.visibleOptions(),e=>this.isValidOption(e))}findFirstFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findLastFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextOptionIndex(e){let i=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(n=>this.isValidOption(n)):-1;return i>-1?i+e+1:e}findPrevOptionIndex(e){let i=e>0?we(this.visibleOptions().slice(0,e),n=>this.isValidOption(n)):-1;return i>-1?i:e}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}isValidOption(e){return e&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionDisabled(e){return this.optionDisabled?z(e,this.optionDisabled):!1}isSelected(e){return this.multiple?this.unique?this.modelValue()?.some(i=>R(i,e,this.equalityKey())):!1:R(this.modelValue(),e,this.equalityKey())}isOptionMatched(e,i){return this.isValidOption(e)&&this.getOptionLabel(e).toLocaleLowerCase(this.searchLocale)===i.toLocaleLowerCase(this.searchLocale)}isInputClicked(e){return e.target===this.inputEL?.nativeElement}isDropdownClicked(e){return this.dropdownButton?.nativeElement?e.target===this.dropdownButton.nativeElement||this.dropdownButton.nativeElement.contains(e.target):!1}equalityKey(){return this.optionValue?void 0:this.dataKey}onContainerClick(e){this.$disabled()||this.loading||this.isInputClicked(e)||this.isDropdownClicked(e)||(!this.overlayViewChild||!this.overlayViewChild.overlayViewChild?.nativeElement.contains(e.target))&&M(this.inputEL?.nativeElement)}handleDropdownClick(e){let i;this.overlayVisible?this.hide(!0):(M(this.inputEL?.nativeElement),i=this.inputEL?.nativeElement?.value,this.dropdownMode==="blank"?this.search(e,"","dropdown"):this.dropdownMode==="current"&&this.search(e,i,"dropdown")),this.onDropdownClick.emit({originalEvent:e,query:i})}onInput(e){if(this.typeahead){let i=this.minQueryLength||this.minLength;this.searchTimeout&&clearTimeout(this.searchTimeout);let n=e.target.value;this.maxlength()!==null&&(n=n.split("").slice(0,this.maxlength()).join("")),!this.multiple&&!this.forceSelection&&this.updateModel(n),n.length===0&&!this.multiple?(this.onClear.emit(),setTimeout(()=>{this.hide()},this.delay/2)):n.length>=i?(this.focusedOptionIndex.set(-1),this.searchTimeout=setTimeout(()=>{this.search(e,n,"input")},this.delay)):this.hide()}}onInputChange(e){if(this.forceSelection){let i=!1;if(this.visibleOptions()){let n=this.visibleOptions().find(o=>this.isOptionMatched(o,this.inputEL?.nativeElement?.value||""));n!==void 0&&(i=!0,!this.isSelected(n)&&this.onOptionSelect(e,n))}i||(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),!this.multiple&&this.updateModel(null))}}onInputFocus(e){if(this.$disabled())return;!this.dirty&&this.completeOnFocus&&this.search(e,e.target.value,"focus"),this.dirty=!0,this.focused=!0;let i=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(i),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit(e)}onMultipleContainerFocus(e){this.$disabled()||(this.focused=!0)}onMultipleContainerBlur(e){this.focusedMultipleOptionIndex.set(-1),this.focused=!1}onMultipleContainerKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(e.code){case"ArrowLeft":this.onArrowLeftKeyOnMultiple(e);break;case"ArrowRight":this.onArrowRightKeyOnMultiple(e);break;case"Backspace":this.onBackspaceKeyOnMultiple(e);break;default:break}}onInputBlur(e){if(this.dirty=!1,this.focused=!1,this.focusedOptionIndex.set(-1),this.addOnBlur&&this.multiple&&!this.typeahead){let i=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();i&&!this.isSelected(i)&&(this.updateModel([...this.modelValue()||[],i]),this.onAdd.emit({originalEvent:e,value:i}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="")}this.onModelTouched(),this.onBlur.emit(e)}onInputPaste(e){if(this.separator&&this.multiple&&!this.typeahead){let i=(e.clipboardData||window.clipboardData)?.getData("Text");if(i){let n=i.split(this.separator),o=[...this.modelValue()||[]];if(n.forEach(l=>{let v=l.trim();v&&!this.isSelected(v)&&o.push(v)}),o.length>(this.modelValue()||[]).length){let l=o.slice((this.modelValue()||[]).length);this.updateModel(o),l.forEach(v=>{this.onAdd.emit({originalEvent:e,value:v})}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault()}}}else this.onKeyDown(e)}onInputKeyUp(e){this.onKeyUp.emit(e)}onKeyDown(e){if(this.$disabled()){e.preventDefault();return}switch(this.onInputKeydown.emit(e),e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"Backspace":this.onBackspaceKey(e);break;case"ShiftLeft":case"ShiftRight":break;default:this.handleSeparatorKey(e);break}}handleSeparatorKey(e){if(this.separator&&this.multiple&&!this.typeahead&&(this.separator===e.key||typeof this.separator=="string"&&e.key===this.separator||this.separator instanceof RegExp&&e.key.match(this.separator))){let i=(this.multiInputEl?.nativeElement?.value||e.target.value||"").trim();i&&!this.isSelected(i)&&(this.updateModel([...this.modelValue()||[],i]),this.onAdd.emit({originalEvent:e,value:i}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":e.target.value="",e.preventDefault())}}onArrowDownKey(e){if(!this.overlayVisible)return;let i=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.findFirstFocusedOptionIndex();this.changeFocusedOptionIndex(e,i),e.preventDefault(),e.stopPropagation()}onArrowUpKey(e){if(this.overlayVisible)if(e.altKey)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.overlayVisible&&this.hide(),e.preventDefault();else{let i=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.findLastFocusedOptionIndex();this.changeFocusedOptionIndex(e,i),e.preventDefault(),e.stopPropagation()}}onArrowLeftKey(e){let i=e.currentTarget;this.focusedOptionIndex.set(-1),this.multiple&&(ve(i.value)&&this.hasSelectedOption()?(M(this.multiContainerEL?.nativeElement),this.focusedMultipleOptionIndex.set(this.modelValue().length)):e.stopPropagation())}onArrowRightKey(e){this.focusedOptionIndex.set(-1),this.multiple&&e.stopPropagation()}onHomeKey(e){let{currentTarget:i}=e,n=i.value.length;i.setSelectionRange(0,e.shiftKey?n:0),this.focusedOptionIndex.set(-1),e.preventDefault()}onEndKey(e){let{currentTarget:i}=e,n=i.value.length;i.setSelectionRange(e.shiftKey?0:n,n),this.focusedOptionIndex.set(-1),e.preventDefault()}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault()}onPageUpKey(e){this.scrollInView(0),e.preventDefault()}onEnterKey(e){if(!this.typeahead&&!this.forceSelection&&this.multiple){let i=e.target.value?.trim();i&&!this.isSelected(i)&&(this.updateModel([...this.modelValue()||[],i]),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""))}if(this.overlayVisible)this.focusedOptionIndex()!==-1&&this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]),this.hide();else return;e.preventDefault()}onEscapeKey(e){this.overlayVisible&&this.hide(!0),e.preventDefault()}onTabKey(e){if(this.focusedOptionIndex()!==-1){this.onOptionSelect(e,this.visibleOptions()[this.focusedOptionIndex()]);return}if(this.multiple&&!this.typeahead){let i=(this.multiInputEl?.nativeElement?.value||this.inputEL?.nativeElement?.value||"").trim();if(this.addOnTab&&i&&!this.isSelected(i)){this.updateModel([...this.modelValue()||[],i]),this.onAdd.emit({originalEvent:e,value:i}),this.multiInputEl?.nativeElement?this.multiInputEl.nativeElement.value="":this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.updateInputValue(),e.preventDefault(),this.overlayVisible&&this.hide();return}}this.overlayVisible&&this.hide()}onBackspaceKey(e){if(this.multiple){if(N(this.modelValue())&&!this.inputEL?.nativeElement?.value){let i=this.modelValue()[this.modelValue().length-1],n=this.modelValue().slice(0,-1);this.updateModel(n),this.onUnselect.emit({originalEvent:e,value:i})}e.stopPropagation()}}onArrowLeftKeyOnMultiple(e){let i=this.focusedMultipleOptionIndex()<1?0:this.focusedMultipleOptionIndex()-1;this.focusedMultipleOptionIndex.set(i)}onArrowRightKeyOnMultiple(e){let i=this.focusedMultipleOptionIndex();i++,this.focusedMultipleOptionIndex.set(i),i>this.modelValue().length-1&&(this.focusedMultipleOptionIndex.set(-1),M(this.inputEL?.nativeElement))}onBackspaceKeyOnMultiple(e){this.focusedMultipleOptionIndex()!==-1&&this.removeOption(e,this.focusedMultipleOptionIndex())}onOptionSelect(e,i,n=!0){this.multiple?(this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.isSelected(i)||this.updateModel([...this.modelValue()||[],i])):this.updateModel(i),this.onSelect.emit({originalEvent:e,value:i}),n&&this.hide(!0)}onOptionMouseEnter(e,i){this.focusOnHover&&this.changeFocusedOptionIndex(e,i)}search(e,i,n){i!=null&&(n==="input"&&i.trim().length===0||(this.loading=!0,this.completeMethod.emit({originalEvent:e,query:i})))}removeOption(e,i){e.stopPropagation();let n=this.modelValue()[i],o=this.modelValue().filter((l,v)=>v!==i);this.updateModel(o),this.onUnselect.emit({originalEvent:e,value:n}),M(this.inputEL?.nativeElement)}updateModel(e){let i=null;e&&(i=this.multiple?e.map(n=>this.getOptionValue(n)):this.getOptionValue(e)),this.value=i,this.writeModelValue(e),this.onModelChange(i),this.updateInputValue(),this.cd.markForCheck()}updateInputValue(){this.inputEL&&this.inputEL.nativeElement&&(this.multiple?this.inputEL.nativeElement.value="":this.inputEL.nativeElement.value=this.inputValue())}autoUpdateModel(){if((this.selectOnFocus||this.autoHighlight)&&this.autoOptionFocus&&!this.hasSelectedOption()){let e=this.findFirstFocusedOptionIndex();this.focusedOptionIndex.set(e),this.onOptionSelect(null,this.visibleOptions()[this.focusedOptionIndex()],!1)}}scrollInView(e=-1){let i=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let n=de(this.itemsViewChild.nativeElement,`li[id="${i}"]`);n?n.scrollIntoView&&n.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex())},0)}}changeFocusedOptionIndex(e,i){this.focusedOptionIndex()!==i&&(this.focusedOptionIndex.set(i),this.scrollInView(),this.selectOnFocus&&this.onOptionSelect(e,this.visibleOptions()[i],!1))}show(e=!1){this.dirty=!0,this.overlayVisible=!0;let i=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(i),e&&M(this.inputEL?.nativeElement),e&&M(this.inputEL?.nativeElement),this.onShow.emit(),this.cd.markForCheck()}hide(e=!1){let i=()=>{this.dirty=e,this.overlayVisible=!1,this.focusedOptionIndex.set(-1),e&&M(this.inputEL?.nativeElement),this.onHide.emit(),this.cd.markForCheck()};setTimeout(()=>{i()},0)}clear(){this.updateModel(null),this.inputEL?.nativeElement&&(this.inputEL.nativeElement.value=""),this.onClear.emit()}hasSelectedOption(){return N(this.modelValue())}getAriaPosInset(e){return(this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(i=>this.isOptionGroup(i)).length:e)+1}getOptionLabel(e){return this.optionLabel?z(e,this.optionLabel):e&&e.label!=null?e.label:e}getOptionValue(e){return this.optionValue?z(e,this.optionValue):e&&e.value!=null?e.value:e}getOptionIndex(e,i){return this.virtualScrollerDisabled?e:i&&i.getItemOptions(e).index}getOptionGroupLabel(e){return this.optionGroupLabel?z(e,this.optionGroupLabel):e&&e.label!=null?e.label:e}getOptionGroupChildren(e){return this.optionGroupChildren?z(e,this.optionGroupChildren):e.items}getPTOptions(e,i,n,o){return this.ptm(o,{context:{option:e,index:this.getOptionIndex(n,i),selected:this.isSelected(e),focused:this.focusedOptionIndex()===this.getOptionIndex(n,i),disabled:this.isOptionDisabled(e)}})}onOverlayAnimationStart(e){if(e.toState==="visible"&&(this.itemsWrapper=de(this.overlayViewChild.overlayViewChild?.nativeElement,this.virtualScroll?".p-scroller":".p-autocomplete-panel"),this.virtualScroll&&(this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.scroller?.viewInit()),this.visibleOptions()&&this.visibleOptions().length))if(this.virtualScroll){let i=this.modelValue()?this.focusedOptionIndex():-1;i!==-1&&this.scroller?.scrollToIndex(i)}else{let i=de(this.itemsWrapper,".p-autocomplete-item.p-highlight");i&&i.scrollIntoView({block:"nearest",inline:"center"})}}writeControlValue(e,i){let n=this.multiple?this.visibleOptions().filter(o=>e?.some(l=>R(l,o,this.equalityKey()))):this.visibleOptions().find(o=>R(e,o,this.equalityKey()));this.value=e,i(ve(n)?e:n),this.updateInputValue(),this.cd.markForCheck()}onDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null)}static \u0275fac=function(i){return new(i||t)(fe(Pe),fe(Te))};static \u0275cmp=W({type:t,selectors:[["p-autoComplete"],["p-autocomplete"],["p-auto-complete"]],contentQueries:function(i,n,o){if(i&1&&(x(o,Gt,5),x(o,Ut,5),x(o,jt,5),x(o,Wt,5),x(o,Zt,5),x(o,Jt,5),x(o,Xt,5),x(o,Yt,5),x(o,en,5),x(o,tn,5),x(o,nn,5),x(o,me,4)),i&2){let l;_(l=h())&&(n.itemTemplate=l.first),_(l=h())&&(n.emptyTemplate=l.first),_(l=h())&&(n.headerTemplate=l.first),_(l=h())&&(n.footerTemplate=l.first),_(l=h())&&(n.selectedItemTemplate=l.first),_(l=h())&&(n.groupTemplate=l.first),_(l=h())&&(n.loaderTemplate=l.first),_(l=h())&&(n.removeIconTemplate=l.first),_(l=h())&&(n.loadingIconTemplate=l.first),_(l=h())&&(n.clearIconTemplate=l.first),_(l=h())&&(n.dropdownIconTemplate=l.first),_(l=h())&&(n.templates=l)}},viewQuery:function(i,n){if(i&1&&(E(on,5),E(ln,5),E(an,5),E(pn,5),E(rn,5),E(sn,5),E(cn,5)),i&2){let o;_(o=h())&&(n.inputEL=o.first),_(o=h())&&(n.multiInputEl=o.first),_(o=h())&&(n.multiContainerEL=o.first),_(o=h())&&(n.dropdownButton=o.first),_(o=h())&&(n.itemsViewChild=o.first),_(o=h())&&(n.scroller=o.first),_(o=h())&&(n.overlayViewChild=o.first)}},hostVars:4,hostBindings:function(i,n){i&1&&C("click",function(l){return n.onHostClick(l)}),i&2&&(ee(n.sx("root")),g(n.cn(n.cx("root"),n.styleClass)))},inputs:{minLength:[2,"minLength","minLength",Q],minQueryLength:[2,"minQueryLength","minQueryLength",Q],delay:[2,"delay","delay",Q],panelStyle:"panelStyle",styleClass:"styleClass",panelStyleClass:"panelStyleClass",inputStyle:"inputStyle",inputId:"inputId",inputStyleClass:"inputStyleClass",placeholder:"placeholder",readonly:[2,"readonly","readonly",y],scrollHeight:"scrollHeight",lazy:[2,"lazy","lazy",y],virtualScroll:[2,"virtualScroll","virtualScroll",y],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",Q],virtualScrollOptions:"virtualScrollOptions",autoHighlight:[2,"autoHighlight","autoHighlight",y],forceSelection:[2,"forceSelection","forceSelection",y],type:"type",autoZIndex:[2,"autoZIndex","autoZIndex",y],baseZIndex:[2,"baseZIndex","baseZIndex",Q],ariaLabel:"ariaLabel",dropdownAriaLabel:"dropdownAriaLabel",ariaLabelledBy:"ariaLabelledBy",dropdownIcon:"dropdownIcon",unique:[2,"unique","unique",y],group:[2,"group","group",y],completeOnFocus:[2,"completeOnFocus","completeOnFocus",y],showClear:[2,"showClear","showClear",y],dropdown:[2,"dropdown","dropdown",y],showEmptyMessage:[2,"showEmptyMessage","showEmptyMessage",y],dropdownMode:"dropdownMode",multiple:[2,"multiple","multiple",y],addOnTab:[2,"addOnTab","addOnTab",y],tabindex:[2,"tabindex","tabindex",Q],dataKey:"dataKey",emptyMessage:"emptyMessage",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",autofocus:[2,"autofocus","autofocus",y],autocomplete:"autocomplete",optionGroupChildren:"optionGroupChildren",optionGroupLabel:"optionGroupLabel",overlayOptions:"overlayOptions",suggestions:"suggestions",optionLabel:"optionLabel",optionValue:"optionValue",id:"id",searchMessage:"searchMessage",emptySelectionMessage:"emptySelectionMessage",selectionMessage:"selectionMessage",autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",y],selectOnFocus:[2,"selectOnFocus","selectOnFocus",y],searchLocale:[2,"searchLocale","searchLocale",y],optionDisabled:"optionDisabled",focusOnHover:[2,"focusOnHover","focusOnHover",y],typeahead:[2,"typeahead","typeahead",y],addOnBlur:[2,"addOnBlur","addOnBlur",y],separator:"separator",appendTo:[1,"appendTo"]},outputs:{completeMethod:"completeMethod",onSelect:"onSelect",onUnselect:"onUnselect",onAdd:"onAdd",onFocus:"onFocus",onBlur:"onBlur",onDropdownClick:"onDropdownClick",onClear:"onClear",onInputKeydown:"onInputKeydown",onKeyUp:"onKeyUp",onShow:"onShow",onHide:"onHide",onLazyLoad:"onLazyLoad"},features:[te([mi,pt,{provide:rt,useExisting:t},{provide:he,useExisting:t}]),X([k]),J],decls:9,vars:13,consts:[["overlay",""],["content",""],["focusInput",""],["multiContainer",""],["focusInput","","multiIn",""],["token",""],["removeicon",""],["ddBtn",""],["buildInItems",""],["scroller",""],["loader",""],["items",""],["empty",""],["pInputText","","aria-autocomplete","list","role","combobox",3,"pAutoFocus","pt","class","ngStyle","variant","invalid","pSize","fluid","input","keydown","change","focus","blur","paste","keyup",4,"ngIf"],[4,"ngIf"],["role","listbox",3,"pBind","class","tabindex","focus","blur","keydown",4,"ngIf"],["type","button","pRipple","",3,"pBind","class","disabled","click",4,"ngIf"],[3,"visibleChange","onAnimationStart","onHide","pt","hostAttrSelector","visible","options","target","appendTo","showTransitionOptions","hideTransitionOptions"],["pInputText","","aria-autocomplete","list","role","combobox",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pt","ngStyle","variant","invalid","pSize","fluid"],["data-p-icon","times",3,"pBind","class","click",4,"ngIf"],[3,"pBind","class","click",4,"ngIf"],["data-p-icon","times",3,"click","pBind"],[3,"click","pBind"],[4,"ngTemplateOutlet"],["role","listbox",3,"focus","blur","keydown","pBind","tabindex"],["role","option",3,"pBind","class",4,"ngFor","ngForOf"],["role","option",3,"pBind"],["role","combobox","aria-autocomplete","list",3,"input","keydown","change","focus","blur","paste","keyup","pAutoFocus","pBind","ngStyle"],[3,"onRemove","pt","label","disabled","removable"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind",4,"ngIf"],["data-p-icon","times-circle"],[3,"pBind"],["data-p-icon","spinner",3,"pBind","class","spin",4,"ngIf"],[3,"pBind","class",4,"ngIf"],["data-p-icon","spinner",3,"pBind","spin"],["type","button","pRipple","",3,"click","pBind","disabled"],[3,"ngClass",4,"ngIf"],[3,"ngClass"],["data-p-icon","chevron-down",3,"pBind",4,"ngIf"],["data-p-icon","chevron-down",3,"pBind"],[3,"pBind","ngStyle"],[3,"pBind","tabindex"],[3,"pt","items","style","itemSize","autoSize","lazy","options","onLazyLoad",4,"ngIf"],["role","status","aria-live","polite",1,"p-hidden-accessible"],[3,"onLazyLoad","pt","items","itemSize","autoSize","lazy","options"],["role","listbox",3,"pBind"],["ngFor","",3,"ngForOf"],["role","option",3,"pBind","class","ngStyle",4,"ngIf"],["role","option",3,"pBind","ngStyle"],["pRipple","","role","option",3,"click","mouseenter","pBind","ngStyle"],[4,"ngIf","ngIfElse"]],template:function(i,n){if(i&1){let o=T();c(0,fn,2,31,"input",13)(1,wn,3,2,"ng-container",14)(2,kn,7,36,"ul",15)(3,Fn,3,2,"ng-container",14)(4,Rn,4,8,"button",16),m(5,"p-overlay",17,0),ke("visibleChange",function(v){return d(o),Ee(n.overlayVisible,v)||(n.overlayVisible=v),u(v)}),C("onAnimationStart",function(v){return d(o),u(n.onOverlayAnimationStart(v))})("onHide",function(){return d(o),u(n.hide())}),c(7,si,10,15,"ng-template",null,1,F),f()}i&2&&(a("ngIf",!n.multiple),s(),a("ngIf",n.$filled()&&!n.$disabled()&&n.showClear&&!n.loading),s(),a("ngIf",n.multiple),s(),a("ngIf",n.loading),s(),a("ngIf",n.dropdown),s(),a("pt",n.ptm("pcOverlay"))("hostAttrSelector",n.$attrSelector),Ve("visible",n.overlayVisible),a("options",n.overlayOptions)("target","@parent")("appendTo",n.$appendTo())("showTransitionOptions",n.showTransitionOptions)("hideTransitionOptions",n.hideTransitionOptions))},dependencies:[ae,Le,Be,oe,le,Fe,et,Xe,je,tt,Re,Ue,Ne,$e,nt,D,Ge,$,k],encapsulation:2,changeDetection:0})}return t})(),fo=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Z({type:t});static \u0275inj=U({imports:[dt,D,D]})}return t})();export{Pi as a,dt as b,fo as c};
