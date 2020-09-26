import "reflect-metadata";
import * as $ from "jquery";

import { Optional } from "./optional"; 
import { Compoment } from "./compoment";
import { LightDocument, ConstructableCompoment, AnotationType, MetaReference, MetaBinding, RenderContext } from "./common";


export function CompomentRegister(xid: string) {
    return function wrapper<K extends Compoment>(constructor: ConstructableCompoment<K>) {
        const d: LightDocument = document;

        if (d.xidCompomentMapping === undefined) {
            d.xidCompomentMapping = new Map();
        }

        Reflect.defineMetadata(`@${AnotationType.XID}`, xid, constructor.prototype);
        console.log(`[${xid}] has been registered. `);

        d.xidCompomentMapping.set(xid, constructor);
        return constructor;
    }
}


export function Member<T extends Compoment, R>(p: { 
    member?: string; 
}=null) {
    return function (target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        const d: LightDocument = document;
        const member = Optional.of(p?.member).orElesGet(propertyKey);

        console.log(target, propertyKey, descriptor);

        descriptor.set = function(value: R): void {
            const inst = target.rt_obj;
            inst.snapshot.set(member, value);

            if (d.RR.get(`${target.rt_xid}:${member}`)) {
                inst.trigger([
                    [member, value],
                ]);
            }
        }
    }
}


export function Reference<T extends Compoment, R, W>(p: { 
    xid: string; 
    member?: string; 
    traits?: (v: R) => W; 
}) {
    return function (target: T, propertyKey: string) {

        const refer: MetaReference<R, W> = {
            target: [p.xid, p.member ? p.member : propertyKey],
            member: propertyKey,
            traits: Optional.of(p.traits).orElesGet((r: R) => r as unknown as W),
        }

        Reflect.defineMetadata(`@${AnotationType.REF}:${propertyKey}`, refer, target);
    }
}


export function Render<R, T extends Compoment>(p: { 
    member?: string, 
    render: (p: RenderContext<T, R>) => string 
}) {
    return function (target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        const originMethod = descriptor[descriptor.set ? "set" : "value"];

        p.member = Optional.of(p.member).orElesGet(propertyKey);

        descriptor[descriptor.set ? "set" : "value"] = function(value: R, ...args: any[]): R {
            const __parentNode = target.rt_obj.root;
            const __currentTarget = $(`[xmember=${p.member}]`);
            const rv = originMethod.apply(target, [value, __currentTarget, __parentNode]);
            
            if (value !== undefined) {
                // setter
                const domContent = p.render({
                    inst: target.rt_obj as T,
                    value: value, 
                    currentTarget: __currentTarget, 
                    parentNode: __parentNode,
                });
                console.debug(`member [${p.member}] will be rerendered with: ${domContent}`);
                const area = target.root.find(`[xmember=${p.member}]`).first();
                area.html(domContent);
            }

            return rv;
        }
    }
}


export function Binding<R, T extends Compoment>(p: { 
    member?: string, 
    selector?: string,
    events: string[], 
    traits: (currentTarget: JQuery<HTMLElement>, parentNode: JQuery<HTMLElement>) => R 
}) {

    return function (target: T, propertyKey: string, descriptor: PropertyDescriptor) {

        const bind: MetaBinding<R> = {
            member: Optional.of(p.member).orElesGet(propertyKey),
            selector: Optional.of(p.selector).orElesGet(null),
            events: p.events,
            traits: p.traits,
        }

        Reflect.defineMetadata(`@${AnotationType.BINDING}:${propertyKey}`, bind, target);

        const originMethod = descriptor.value;

        descriptor.value = function(value: number): R {
            if (value === undefined) {
                // getter
                return target.rt_obj.snapshot.get(propertyKey);
            }
            return originMethod.apply(target.rt_obj, [value, ]);
        }
    }
}


// export function BindingInput<R, T extends Compoment>(p: { 
//     member: string, 
//     events: string[], 
//     traits: (currentTarget: JQuery<HTMLInputElement>, parentNode: JQuery<HTMLElement>) => R 
// }) {

//     return function (target: T, propertyKey: string, descriptor: PropertyDescriptor) {
//         const bind: MetaBinding<R> = {
//             member: p.member,
//             events: p.events,
//             traits: p.traits,
//         }

//         Reflect.defineMetadata(`@${AnotationType.BINDING}:${propertyKey}`, bind, target);

//         const originMethod = descriptor.value;

//         descriptor.value = function(value: number): R {
//             if (value === undefined) {
//                 // getter
//                 return target.rt_obj.snapshot.get(propertyKey);
//             }
//             return originMethod.apply(target, [value, ]);
//         }
//     }
// }
