import { Compoment } from "./compoment";


export enum AnotationType {
    XID = "xid",

    LIGHTING = "lighting",
    REF = "ref",
    EXPOSE = "expose",
    ON = "on",

    BINDING = "monitor",
}


export type ConstructableCompoment<R> = {
    new (...args: any[]): R;
};


export interface LightDocument extends Document {
    xidCompomentMapping?: Map<string, ConstructableCompoment<Compoment>>;
    objectPool?: Map<string, Compoment>;
    RR?: Map<string, Array<string>>;
}


export interface LightingEventMsg {
    xid: string;
    snapshot: Map<string, any>;
}


export interface MetaReference<R, W> {
    target: [string, string],
    member: string,
    traits: (v: R) => W,
}


export interface MetaExpose {
    name: string,
    pipes: string[],
}


export interface MetaBinding<R> {
    member: string;
    selector?: string;
    events: string[];
    traits: (target: JQuery<HTMLElement>, parent: JQuery<HTMLElement>) => R;
}

export interface RenderContext<T, R> {
    inst: T,
    value: R, 
    currentTarget: JQuery<HTMLElement>, 
    parentNode: JQuery<HTMLElement>,
}
