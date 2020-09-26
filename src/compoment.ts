import "reflect-metadata";
import * as $ from "jquery";

import { buildRunningTimeError } from "./exception";
import { LightDocument, AnotationType, MetaReference } from "./common";


export abstract class Compoment {

    private __snapshot: Map<string, any>;

    constructor() {
        const _ = this.root;
        this.__snapshot = new Map();
    }

    get snapshot() {
        return this.__snapshot;
    }

    get rt_xid() {
        const r = Reflect.getMetadata(`@${AnotationType.XID}`, this.constructor.prototype);
        if (r === undefined) {
            throw buildRunningTimeError(`Current object does not have xid metadata. `, this);
        }
        return r;
    }

    get rt_obj() {
        const _rt_xid = this.rt_xid;
        const d: LightDocument = document;

        if (!d.objectPool.has(_rt_xid)) {
            throw buildRunningTimeError(`Can not find obj with xid=[${_rt_xid}]`);
        }

        return d.objectPool.get(_rt_xid);
    }

    get root(): JQuery<HTMLElement> {
        const _rt_xid = this.rt_xid;
        const e: JQuery<HTMLElement> = $(`[xid=${_rt_xid}]`);

        if (e.length === 0) {
            throw buildRunningTimeError(`Unable to find a DOM element for binding xid [${_rt_xid}]`);
        }

        return e.first();
    }

    get reference(): Map<string, MetaReference<any, any>> {
        const mkeys = Reflect
            .getMetadataKeys(this.constructor.prototype)
            .filter((r: string) => r.startsWith(`@${AnotationType.REF}`));

        return new Map(mkeys.map((k) => [k.slice(2 + AnotationType.REF.length), Reflect.getMetadata(k, this.constructor.prototype)]));
    }

    get binding() {
        const lkeys = Reflect
            .getMetadataKeys(this.constructor.prototype)
            .filter((r: string) => r.startsWith(`@${AnotationType.BINDING}`));

        return new Map(lkeys.map((k) => [k.slice(2 + AnotationType.BINDING.length), Reflect.getMetadata(k, this.constructor.prototype)]));
    }

    trigger(snapshot: Iterable<[string, any]>) {
        const _rt_xid = this.rt_xid;

        this.root.trigger(`@${AnotationType.LIGHTING}`, {
            xid: _rt_xid,
            snapshot: new Map(snapshot),
        });
    }
}
