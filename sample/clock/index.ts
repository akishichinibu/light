import { Entry, Compoment, CompomentRegister, Render, Binding, Reference, Member } from "../../src/main";
import * as _ from "lodash";
import { RenderContext } from "../../src/common";


@CompomentRegister("input")
export class Input extends Compoment {

    @Binding({
        events: ["input", "change"],
        traits: (target) => Number(target.val()),
    })
    during(_: number): number {
        return null;
    }
}


@CompomentRegister("clock")
export class Clock extends Compoment {

    tt: number;

    constructor() {
        super();

        this.tt = window.setInterval(() => {
            this.datetime = Date.now();
        }, 500);
    }

    @Reference({
        xid: "input",
    })
    @Member()
    set during(v: number) {
        window.clearInterval(this.tt);
        this.tt = window.setInterval(() => {
            this.datetime = Date.now();
        }, v);
    };

    @Render({
        render: (p: RenderContext<Clock, number>) => {
            return new Date(p.value).toISOString();
        }
    })
    @Member()
    set datetime(v: number) {}
}


@CompomentRegister("boy")
export class Boy extends Compoment {

    @Render({
        member: "timestamp",
        render: (p: RenderContext<Boy, number>) => {
            return p.value % 2 === 0 ? `<b>${p.value}</b>` : `${p.value}`;
        }
    })
    @Render({
        member: "result",
        render: (p: RenderContext<Boy, number>) => {
            return `<b>${p.value % 17}</b>`;
        }
    })
    @Reference({
        xid: "clock",
        member: "datetime",
        traits: (v: number) => Math.round(v / 1000),
    })
    set timestamp(v: number) {
        console.log(`Timestamp update: ${v}`);
    }

}


@CompomentRegister("selector")
export class Selector extends Compoment {

    @Render({
        member: "ulist",
        render: (p: RenderContext<Selector, number>) => {
            const n = p.value % 17;
            return _.range(0, n).map(r => `<option value="r">*${r}*</option>`).join("")
        }
    })
    @Reference({
        xid: "clock",
        member: "datetime",
        traits: (v: number) => Math.round(v / 1000),
    })
    set timestamp(_: number) {};
}


@CompomentRegister("show")
export class Shower extends Compoment {

    @Reference({
        xid: "clock",
        member: "datetime",
        traits: (v: number) => Math.round(v / 1000),
    })
    @Member()
    set a(_: number) {};

    @Reference({
        xid: "boy",
        member: "result",
    })
    @Member()
    set b(_: number) {};

    @Render({
        render: (p: RenderContext<Shower, number>) => {
            return `${p.value}`;
        }
    })
    @Member()
    set c(_: number) {};

    on(snapshot) {
        const inst = this.rt_obj;
        this.c = inst.snapshot.get("a") * inst.snapshot.get("b");
    }
}


export class Demo extends Entry {

    static run() {
        super.run();

        setInterval(() => {

        }, 100);
    }
}
