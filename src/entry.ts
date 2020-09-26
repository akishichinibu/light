import "reflect-metadata";
import * as $ from "jquery";

import { Compoment } from "./compoment";
import { buildRunningTimeError } from "./exception";
import { LightDocument, ConstructableCompoment, AnotationType, LightingEventMsg, MetaReference, MetaBinding } from "./common";
import { Optional } from "./optional";


export abstract class Entry {

    static checkXidUnique() {
        const d: LightDocument = document;
        const xids = Array.from(d.xidCompomentMapping, ([xid, _]) => xid);

        if (new Set(xids).size !== xids.length) {
            throw buildRunningTimeError("The xids must be unique");
        }
    }

    static run(): void {
        const d: LightDocument = document;
        this.checkXidUnique();

        // instance
        d.objectPool = new Map(Array.from(d.xidCompomentMapping, ([xid, c]) => [xid, new c()]));

        d.objectPool.forEach((inst: Compoment, xid) => {
            const DomElementBinding: Map<string, MetaBinding<any>> = inst.binding;
            console.trace(xid, DomElementBinding);

            const __parentNode = inst.root;

            for (let [field, b] of DomElementBinding.entries()) {
                // init the snapshot
                const __currentTarget = $(`[xmember=${b.member}]`);
                inst.snapshot.set(field, b.traits(__currentTarget, __parentNode));

                inst.root.on(b.events.join(" "), `[xmember=${b.member}]`, (event) => {
                    const value = b.traits(__currentTarget, __parentNode);
                    inst.snapshot.set(field, value);
                    console.log(`xmember[${b.member}] event[${event.type}]: [${value}] ==> [${field}]`);

                    Optional
                        .of(inst[field])
                        .ifPresent((method) => {
                            method.apply(inst, [value, __currentTarget, __parentNode,]);
                        })
                        .orElesThrow(buildRunningTimeError(`Can not find the method [${field}] for instance ${inst.rt_xid}`));

                    if (d.RR.get(`${inst.rt_xid}:${field}`)) {
                        inst.trigger([
                            [field, value],
                        ]);
                    }
                });
            }
        });

        d.RR = new Map();

        d.objectPool.forEach((inst: Compoment, xid) => {
            for (let [_, b] of inst.reference) {
                const [ref_xid, ref_field] = b.target;

                if (!d.objectPool.has(ref_xid)) {
                    throw buildRunningTimeError(`The binding [${b}] is illeagal beacause the target [${ref_xid}] can not be found. `);
                }

                const key = `${ref_xid}:${ref_field}`;

                if (!d.RR.has(key)) {
                    d.RR.set(key, []);
                }

                d.RR.get(key).push(`${xid}:${b.member}`);
            }
        });

        console.log("RR: ", d.RR);

        $(document).on("@lighting", "[xid]", (event, msg: LightingEventMsg) => {
            const xid = msg.xid;
            console.log(`Receive a @lighting event from [${xid}]`, msg);

            if (!d.objectPool.has(xid)) {
                throw buildRunningTimeError(`Can not find instance with xid=[${xid}]`);
            }

            msg.snapshot.forEach((value, field) => {
                const key = `${xid}:${field}`;
                if (d.RR.has(key)) {
                    d.RR.get(key).forEach((targetKey: string) => {
                        const t = targetKey.indexOf(":");
                        const [targetXid, targetField] = [targetKey.slice(0, t), targetKey.slice(t + 1)];
                        const inst = d.objectPool.get(targetXid);

                        const meta = Reflect.getMetadata(`@${AnotationType.REF}:${targetField}`, inst.constructor.prototype);
                        const traits = meta.traits;
                        const tvalue = traits(value);

                        console.log(targetField, inst.constructor.prototype, inst.constructor.prototype[targetField]);

                        Optional
                            .of(inst[targetField])
                            .ifPresent((responsor) => {
                                console.log(responsor);
                                responsor.apply(inst, [tvalue,]);
                            });

                        Optional
                            .of(inst[`on`])
                            .ifPresent((responsor) => {
                                responsor.apply(inst, [{ target_field: tvalue },]);
                            });
                    });
                }
            });
        });

        // const observer = new MutationObserver(function (mutations, observer) {
        //     mutations.forEach(function (mutation) {
        //         console.log(mutation);
        //     });
        // });

        // observer.observe(document.documentElement, {
        //     attributes: true,
        //     characterData: false,
        //     childList: true,
        //     subtree: true,
        // });
    }
}
