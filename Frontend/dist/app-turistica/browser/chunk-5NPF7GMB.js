import{a as ne}from"./chunk-A7EIBBLH.js";import{$ as P,$a as d,Ba as c,Ca as _,Da as g,Ea as j,Ed as J,Fd as W,G as V,Gb as B,Gd as X,I as M,Ia as I,Ja as w,Jd as Y,K as y,La as h,Lb as $,Ld as Z,M as s,Md as ee,N as l,Na as u,Nd as v,O as S,Oa as r,Ob as q,Pa as F,Qa as z,Qb as G,Ra as T,Ta as k,Ua as E,Ub as U,W as x,Xa as R,Ya as Q,ab as K,ba as p,bb as L,ca as C,ib as O,ja as A,na as D,oa as N,pa as m,ta as f,wb as H}from"./chunk-64E2PASB.js";var te=`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.font.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`;var re=["removeicon"],ce=["*"];function ae(n,a){if(n&1){let e=h();_(0,"img",4),u("error",function(i){s(e);let o=r();return l(o.imageError(i))}),g()}if(n&2){let e=r();d(e.cx("image")),c("pBind",e.ptm("image"))("src",e.image,P)("alt",e.alt)}}function pe(n,a){if(n&1&&j(0,"span",6),n&2){let e=r(2);d(e.icon),c("pBind",e.ptm("icon"))("ngClass",e.cx("icon"))}}function se(n,a){if(n&1&&m(0,pe,1,4,"span",5),n&2){let e=r();c("ngIf",e.icon)}}function le(n,a){if(n&1&&(_(0,"div",7),K(1),g()),n&2){let e=r();d(e.cx("label")),c("pBind",e.ptm("label")),p(),L(e.label)}}function de(n,a){if(n&1){let e=h();_(0,"span",11),u("click",function(i){s(e);let o=r(3);return l(o.close(i))})("keydown",function(i){s(e);let o=r(3);return l(o.onKeydown(i))}),g()}if(n&2){let e=r(3);d(e.removeIcon),c("pBind",e.ptm("removeIcon"))("ngClass",e.cx("removeIcon")),f("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function me(n,a){if(n&1){let e=h();S(),_(0,"svg",12),u("click",function(i){s(e);let o=r(3);return l(o.close(i))})("keydown",function(i){s(e);let o=r(3);return l(o.onKeydown(i))}),g()}if(n&2){let e=r(3);d(e.cx("removeIcon")),c("pBind",e.ptm("removeIcon")),f("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function _e(n,a){if(n&1&&(I(0),m(1,de,1,6,"span",9)(2,me,1,5,"svg",10),w()),n&2){let e=r(2);p(),c("ngIf",e.removeIcon),p(),c("ngIf",!e.removeIcon)}}function ge(n,a){}function fe(n,a){n&1&&m(0,ge,0,0,"ng-template")}function he(n,a){if(n&1){let e=h();_(0,"span",13),u("click",function(i){s(e);let o=r(2);return l(o.close(i))})("keydown",function(i){s(e);let o=r(2);return l(o.onKeydown(i))}),m(1,fe,1,0,null,14),g()}if(n&2){let e=r(2);d(e.cx("removeIcon")),c("pBind",e.ptm("removeIcon")),f("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel),p(),c("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function ue(n,a){if(n&1&&(I(0),m(1,_e,3,2,"ng-container",3)(2,he,2,6,"span",8),w()),n&2){let e=r();p(),c("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),p(),c("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var ve={root:({instance:n})=>["p-chip p-component",{"p-disabled":n.disabled}],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},ie=(()=>{class n extends Y{name="chip";style=te;classes=ve;static \u0275fac=(()=>{let e;return function(i){return(e||(e=x(n)))(i||n)}})();static \u0275prov=V({token:n,factory:n.\u0275fac})}return n})();var oe=new M("CHIP_INSTANCE"),Le=(()=>{class n extends ee{$pcChip=y(oe,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=y(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}label;icon;image;alt;styleClass;disabled=!1;removable=!1;removeIcon;onRemove=new C;onImageError=new C;visible=!0;get removeAriaLabel(){return this.config.getTranslation(X.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([t,i])=>this[`_${t}`]!==i&&(this[`_${t}`]=i))}_chipProps;_componentStyle=y(ie);removeIconTemplate;templates;_removeIconTemplate;onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="removeicon"?this._removeIconTemplate=e.template:this._removeIconTemplate=e.template})}onChanges(e){if(e.chipProps&&e.chipProps.currentValue){let{currentValue:t}=e.chipProps;t.label!==void 0&&(this.label=t.label),t.icon!==void 0&&(this.icon=t.icon),t.image!==void 0&&(this.image=t.image),t.alt!==void 0&&(this.alt=t.alt),t.styleClass!==void 0&&(this.styleClass=t.styleClass),t.removable!==void 0&&(this.removable=t.removable),t.removeIcon!==void 0&&(this.removeIcon=t.removeIcon)}}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}static \u0275fac=(()=>{let e;return function(i){return(e||(e=x(n)))(i||n)}})();static \u0275cmp=A({type:n,selectors:[["p-chip"]],contentQueries:function(t,i,o){if(t&1&&(T(o,re,4),T(o,J,4)),t&2){let b;k(b=E())&&(i.removeIconTemplate=b.first),k(b=E())&&(i.templates=b)}},hostVars:5,hostBindings:function(t,i){t&2&&(f("aria-label",i.label),d(i.cn(i.cx("root"),i.styleClass)),Q("display",!i.visible&&"none"))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",disabled:[2,"disabled","disabled",B],removable:[2,"removable","removable",B],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[O([ie,{provide:oe,useExisting:n},{provide:Z,useExisting:n}]),N([v]),D],ngContentSelectors:ce,decls:6,vars:4,consts:[["iconTemplate",""],[3,"pBind","class","src","alt","error",4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"],[4,"ngIf"],[3,"error","pBind","src","alt"],[3,"pBind","class","ngClass",4,"ngIf"],[3,"pBind","ngClass"],[3,"pBind"],["role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"pBind","class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"click","keydown","pBind","ngClass"],["data-p-icon","times-circle","role","button",3,"click","keydown","pBind"],["role","button",3,"click","keydown","pBind"],[4,"ngTemplateOutlet"]],template:function(t,i){if(t&1&&(F(),z(0),m(1,ae,1,5,"img",1)(2,se,1,1,"ng-template",null,0,H)(4,le,2,4,"div",2)(5,ue,3,2,"ng-container",3)),t&2){let o=R(3);p(),c("ngIf",i.image)("ngIfElse",o),p(3),c("ngIf",i.label),p(),c("ngIf",i.removable)}},dependencies:[U,$,q,G,ne,W,v],encapsulation:2,changeDetection:0})}return n})();export{Le as a};
